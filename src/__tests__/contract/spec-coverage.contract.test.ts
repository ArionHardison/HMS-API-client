/**
 * Spec coverage contract — the public gate that the module fan-out leans on.
 *
 * Reads `sdk/spec/endpoints.json` and asserts STATIC INVARIANTS on the
 * manifest itself. The manifest is the source of truth that powers codegen
 * (`spec/openapi.json` is mechanically derived from it; see
 * `spec/scripts/build_openapi.py`). If the manifest drifts in shape — keys
 * renamed, dropped, or counts collapse — every downstream module agent will
 * trip on it, so we lock it here.
 *
 * What this file deliberately is NOT (yet): a behavioral coverage check. The
 * `it.todo` at the bottom is a marker for the next round — when module
 * agents flip on real client classes, that test becomes the assertion that
 * every `endpoints.json` entry has a generated client method.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TypedApiClient } from '../../typed-client';
import { operationIndex } from '../../generated/operation-index';

interface EndpointEntry {
  id: string;
  module: string;
  method: string;
  uri: string;
  auth: string;
  controller: string;
  // Other keys exist (`request`, `response`, `pathParams`, etc.) — we only
  // pin the load-bearing identity / dispatch fields here.
  [key: string]: unknown;
}

const REQUIRED_KEYS = ['id', 'module', 'method', 'uri', 'auth', 'controller'] as const;
const VALID_METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']);
// Auth classes are the api's `endpoint-inventory.json` vocabulary (the source
// of truth `build-endpoints-manifest.mjs` enriches from), not the coarse
// legacy set. See EndpointsInventoryCommand::authClass in CI-API.
const VALID_AUTH = new Set([
  'user-sanctum',
  'dashboard-admin',
  'user-or-admin',
  'optional-auth',
  'guest-only',
  'webhook-signed',
  'signed',
  'public',
  'unknown',
]);

const sdkRoot = resolve(__dirname, '../../..');
const endpointsPath = resolve(sdkRoot, 'spec/endpoints.json');

const endpoints = JSON.parse(readFileSync(endpointsPath, 'utf8')) as EndpointEntry[];

/**
 * Extract the operationId set from the GENERATED types themselves
 * (`src/generated/api-types.ts`), by reading the keys of the top-level
 * `operations` interface. This is the source of truth the typed layer must
 * cover — parsed from the file so the count can't silently drift from what
 * openapi-typescript actually emitted.
 */
function generatedOperationIds(): string[] {
  const typesPath = resolve(sdkRoot, 'src/generated/api-types.ts');
  const src = readFileSync(typesPath, 'utf8');
  const start = src.indexOf('export interface operations {');
  if (start === -1) throw new Error('operations interface not found in api-types.ts');
  // The `operations` block runs to the next top-level `export` declaration.
  const rest = src.slice(start + 'export interface operations {'.length);
  const end = rest.search(/\nexport (?:interface|type) /);
  const body = end === -1 ? rest : rest.slice(0, end);
  // Operation keys sit at exactly 2-space indentation: `  "id": {`.
  const ids = [...body.matchAll(/^ {2}"([^"]+)": \{$/gm)].map(m => m[1]);
  return ids;
}

const GENERATED_OP_IDS = generatedOperationIds();
const GENERATED_OP_COUNT = GENERATED_OP_IDS.length;

describe('spec/endpoints.json — manifest shape lock', () => {
  it('loads as a non-empty array', () => {
    expect(Array.isArray(endpoints)).toBe(true);
    expect(endpoints.length).toBeGreaterThan(0);
  });

  it('matches the generated operation count (rebaselined from the 800 floor)', () => {
    // Previously a soft `>= 800` floor. Now that the typed layer enforces
    // 1:1 parity with the generated `operations` map, we rebaseline to the
    // ACTUAL generated count so any drift (routes added or pruned without
    // regenerating types) trips this gate.
    expect(GENERATED_OP_COUNT).toBeGreaterThanOrEqual(810);
    expect(endpoints.length).toBe(GENERATED_OP_COUNT);
  });

  it('every entry carries the required keys (id, module, method, uri, auth, controller)', () => {
    const offenders: { index: number; missing: string[] }[] = [];
    endpoints.forEach((entry, index) => {
      const missing = REQUIRED_KEYS.filter(
        k => entry[k] === undefined || entry[k] === null || entry[k] === '',
      );
      if (missing.length > 0) offenders.push({ index, missing });
    });
    expect(
      offenders,
      `Entries missing required keys:\n${offenders
        .slice(0, 5)
        .map(o => `  [${o.index}]: missing ${o.missing.join(', ')}`)
        .join('\n')}`,
    ).toEqual([]);
  });

  it('every method is a valid HTTP verb', () => {
    const offenders = endpoints.filter(e => !VALID_METHODS.has(e.method));
    expect(offenders.map(o => `${o.id}: ${o.method}`)).toEqual([]);
  });

  it('every auth value is a known api auth class', () => {
    const offenders = endpoints.filter(e => !VALID_AUTH.has(e.auth));
    expect(offenders.map(o => `${o.id}: ${o.auth}`)).toEqual([]);
  });

  it('ids are unique across the manifest', () => {
    const counts = new Map<string, number>();
    for (const e of endpoints) counts.set(e.id, (counts.get(e.id) ?? 0) + 1);
    const dupes = [...counts.entries()].filter(([, n]) => n > 1).map(([id]) => id);
    expect(dupes).toEqual([]);
  });

  it('(method, uri) pairs are unique across the manifest', () => {
    const counts = new Map<string, number>();
    for (const e of endpoints) {
      const key = `${e.method} ${e.uri}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const dupes = [...counts.entries()].filter(([, n]) => n > 1).map(([k]) => k);
    expect(dupes).toEqual([]);
  });

});

// -----------------------------------------------------------------------------
// Typed-client coverage — the enforcement contract this file was staged for.
//
// Previously an `it.todo`. Now REAL: every operationId in the GENERATED types
// must (a) exist in the runtime `operationIndex`, and (b) be reachable as a
// callable method on `TypedApiClient.ops`. `Request<E>` / `Response<E>` cover
// every operation by construction (they are generic over `keyof operations`),
// and the concreteness of those types is pinned separately in
// `typed-contract.test-d.ts`.
// -----------------------------------------------------------------------------
describe('typed client — operationId coverage', () => {
  // SSR-safe instantiation: no baseURL, no browser globals touched.
  const client = new TypedApiClient();
  const opsKeys = Object.keys(client.ops);
  const indexKeys = Object.keys(operationIndex);

  it('the generated types expose a non-trivial operation set', () => {
    expect(GENERATED_OP_COUNT).toBeGreaterThanOrEqual(810);
  });

  it('runtime operationIndex exactly mirrors the generated operations map', () => {
    const generated = new Set(GENERATED_OP_IDS);
    const index = new Set(indexKeys);
    const missingFromIndex = [...generated].filter(id => !index.has(id));
    const extraInIndex = [...index].filter(id => !generated.has(id));
    expect(missingFromIndex, 'ops in generated types but not in operationIndex').toEqual([]);
    expect(extraInIndex, 'ops in operationIndex but not in generated types').toEqual([]);
    expect(indexKeys.length).toBe(GENERATED_OP_COUNT);
  });

  it('every generated operation has a callable method on client.ops', () => {
    const missing = GENERATED_OP_IDS.filter(
      id => typeof (client.ops as Record<string, unknown>)[id] !== 'function',
    );
    expect(missing, 'generated operations with no typed-client method').toEqual([]);
    expect(opsKeys.length).toBe(GENERATED_OP_COUNT);
  });

  it('exposes no phantom methods beyond the generated operation set', () => {
    const generated = new Set(GENERATED_OP_IDS);
    const extra = opsKeys.filter(id => !generated.has(id));
    expect(extra, 'client.ops methods with no matching generated operation').toEqual([]);
  });

  it('every operationIndex entry carries a valid method + path template', () => {
    const VALID = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']);
    const offenders = indexKeys.filter((id) => {
      const meta = operationIndex[id as keyof typeof operationIndex];
      return !VALID.has(meta.method) || !meta.path.startsWith('/');
    });
    expect(offenders).toEqual([]);
  });
});
