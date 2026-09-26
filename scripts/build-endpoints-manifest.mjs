#!/usr/bin/env node
/**
 * Build spec/endpoints.json — the manifest the contract suite locks
 * (`src/__tests__/contract/spec-coverage.contract.test.ts`).
 *
 * Source of truth: spec/openapi.json (the Scramble-generated OpenAPI). One
 * entry per operation: id/method/uri come straight from the spec; controller
 * from the operation `tags`; module/auth are enriched from the api's
 * `endpoint-inventory.json` when it is reachable at `../api` (join on the
 * method + param-normalized path), else derived/backfilled so every
 * REQUIRED key stays non-empty.
 *
 * Retires the legacy python-regex manifest (was pinned at 810). The count is
 * asserted 1:1 against the generated `operations` map, so re-run this whenever
 * routes change and the openapi is regenerated.
 *
 *   node scripts/build-endpoints-manifest.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HTTP = ['get', 'put', 'post', 'delete', 'patch'];
const here = dirname(fileURLToPath(import.meta.url));
const sdkRoot = resolve(here, '..');
const spec = JSON.parse(readFileSync(resolve(sdkRoot, 'spec/openapi.json'), 'utf8'));

const norm = (method, uri) => {
  const p = ('/' + uri.replace(/^\/?(api\/)?/, ''))
    .replace(/\{[^}]*\}/g, '{}')
    .replace(/\/+$/, '');
  return `${method.toUpperCase()} ${p}`;
};

// Optional enrichment from the api route registry (present in the monorepo,
// absent in an isolated sdk CI checkout — both paths handled).
const invPath = resolve(sdkRoot, '../api/endpoint-inventory.json');
const inv = new Map();
if (existsSync(invPath)) {
  const doc = JSON.parse(readFileSync(invPath, 'utf8'));
  for (const e of doc.endpoints ?? []) {
    inv.set(norm(e.method, e.uri), e);
  }
}

const entries = [];
for (const [path, item] of Object.entries(spec.paths ?? {})) {
  for (const method of HTTP) {
    const op = item[method];
    if (!op || typeof op !== 'object' || !op.operationId) continue;
    const uri = '/api' + path;
    const match = inv.get(norm(method, uri));
    const controller = (op.tags && op.tags[0]) || op.operationId.split('.')[0] || 'Api';
    entries.push({
      id: op.operationId,
      module: match?.module ?? (op.operationId.includes('.') ? op.operationId.split('.')[0] : 'core'),
      method: method.toUpperCase(),
      uri,
      name: op.operationId,
      controller,
      auth: match?.auth ?? 'unknown',
      flags: match?.flags ?? {},
      hasPathParams: /\{[^}]+\}/.test(path),
      hasBody: Boolean(op.requestBody),
      summary: op.summary ?? null,
    });
  }
}

entries.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
writeFileSync(resolve(sdkRoot, 'spec/endpoints.json'), JSON.stringify(entries, null, 2) + '\n');
console.log(
  `build-endpoints-manifest: ${entries.length} entries` +
    (inv.size ? ` (${entries.filter(e => e.auth !== 'unknown').length} auth-enriched from api inventory)` : ' (no api inventory — auth=unknown)'),
);
