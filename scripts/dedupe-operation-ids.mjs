#!/usr/bin/env node
/**
 * Dedupe operationIds in spec/openapi.json (in place, idempotent).
 *
 * Scramble derives operationId from the controller route/method, so ALIASED
 * routes that share one controller method collide (e.g. `/public/creators`
 * and `/public/influencers` → the same `core.users.getCreators`). Both
 * `openapi-typescript` (whose `operations` map is keyed by operationId, so
 * a collision silently drops one op) and our runtime `operation-index`
 * generator (which throws on a dup) require globally-unique ids.
 *
 * Fix: for every operationId used by >1 operation, suffix EVERY member of the
 * group with a deterministic slug derived from `METHOD path`. Single-use ids
 * are left untouched. Running twice is a no-op (a deduped spec has no groups
 * of size >1), so the drift check (`types:check`) stays green.
 *
 *   node scripts/dedupe-operation-ids.mjs [specPath]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'patch', 'head', 'options'];
const here = dirname(fileURLToPath(import.meta.url));
const specPath = process.argv[2] || resolve(here, '..', 'spec/openapi.json');

const spec = JSON.parse(readFileSync(specPath, 'utf8'));

/** slugify `METHOD /a/b/{c}` → `get.a.b.c` (params kept as bare segment names). */
function slug(method, path) {
  const p = path
    .replace(/\{([^}]+)\}/g, '$1')
    .split('/')
    .filter(Boolean)
    .join('.');
  return `${method}.${p}`.replace(/[^A-Za-z0-9._-]/g, '_');
}

// 0) schema normalization: relocate an array-level `enum` onto `items.enum`.
// Scramble emits `{type:array, enum:[...], items:{type:string}}` for a
// `Rule::in(...)`-on-array FormRequest field, but the enum semantically
// constrains each ITEM. openapi-typescript 6.7.6 mis-renders an array-level
// enum as bare identifiers (`sunday | monday`), so move it where it belongs.
let enumsMoved = 0;
function normalizeSchemas(node) {
  if (Array.isArray(node)) {
    node.forEach(normalizeSchemas);
    return;
  }
  if (!node || typeof node !== 'object') return;
  if (node.type === 'array' && Array.isArray(node.enum) && node.items && typeof node.items === 'object') {
    node.items.enum = node.enum;
    delete node.enum;
    enumsMoved += 1;
  }
  for (const v of Object.values(node)) normalizeSchemas(v);
}
normalizeSchemas(spec);

// 0.5) SRE canonical ids for the sys layout-demo family (CI-MFE sre:mfe-page
// fleet). Scramble derives ids from controller names (`actions.index`,
// `onboarding.progress`, …) which are collision-prone and NOT the contract
// spelling the consumers pin (api routes/subproject.php names them, and the
// sys typed modules import them as `Response<'get.api.v1.l.actions'>`). Pin
// the whole family to the deterministic verb.path scheme instead:
//
//   {method}.api{path segments joined by dots, `{param}` → `item`}
//
//   GET  /v1/l/actions              → get.api.v1.l.actions
//   POST /v1/l/actions/{id}         → post.api.v1.l.actions.item
//   POST /v1/l/onboarding/progress  → post.api.v1.l.onboarding.progress
//
// Runs BEFORE the collision pass (a canonical id is unique by construction,
// so family members never reach it) and is idempotent — re-running maps an
// already-canonical member to the same id. Extend SRE_CANONICAL_FAMILIES as
// new demo families ship (e.g. /v1/d/* for the dashboard pages).
//
// `/load` is in the list because the FIRST typed consumer (sys
// codify/typed-subproject.ts, the #326 pilot — deployed) pins
// `Response<'get.api.load'>`; the tarball it was built against carried that
// id and a regen must never orphan it.
const SRE_CANONICAL_FAMILIES = [/^\/v1\/l(\/|$)/, /^\/load$/];
let canonicalized = 0;
for (const [path, item] of Object.entries(spec.paths ?? {})) {
  if (!SRE_CANONICAL_FAMILIES.some(re => re.test(path))) continue;
  for (const method of HTTP_METHODS) {
    const op = item[method];
    if (!op || typeof op !== 'object' || !op.operationId) continue;
    const canonical = `${method}.api.${path
      .replace(/\{[^}]+\}/g, 'item')
      .split('/')
      .filter(Boolean)
      .join('.')}`.replace(/[^A-Za-z0-9._-]/g, '_');
    if (op.operationId !== canonical) {
      op.operationId = canonical;
      canonicalized += 1;
    }
  }
}

// 1) index operationId -> [{path, method, op}]
const groups = new Map();
for (const [path, item] of Object.entries(spec.paths ?? {})) {
  for (const method of HTTP_METHODS) {
    const op = item[method];
    if (!op || typeof op !== 'object' || !op.operationId) continue;
    if (!groups.has(op.operationId)) groups.set(op.operationId, []);
    groups.get(op.operationId).push({ path, method, op });
  }
}

// 2) for every collided id, suffix each member with its path slug.
let renamed = 0;
for (const [id, members] of groups) {
  if (members.length < 2) continue;
  for (const { path, method, op } of members) {
    op.operationId = `${id}.${slug(method, path)}`;
    renamed += 1;
  }
}

// 3) verify global uniqueness (defensive — slugs could theoretically collide).
const seen = new Set();
for (const item of Object.values(spec.paths ?? {})) {
  for (const method of HTTP_METHODS) {
    const op = item[method];
    if (!op?.operationId) continue;
    if (seen.has(op.operationId)) {
      throw new Error(`dedupe failed — still-duplicate operationId: ${op.operationId}`);
    }
    seen.add(op.operationId);
  }
}

if (renamed > 0 || enumsMoved > 0 || canonicalized > 0) {
  writeFileSync(specPath, JSON.stringify(spec, null, 2) + '\n');
}
console.log(`normalize-spec: renamed ${renamed} operationId(s), canonicalized ${canonicalized} SRE demo id(s), moved ${enumsMoved} array-enum(s); ${seen.size} unique ids total.`);
