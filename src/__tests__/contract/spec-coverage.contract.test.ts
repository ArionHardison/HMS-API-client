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
const VALID_AUTH = new Set(['api', 'admin', 'sanctum', 'public']);

const sdkRoot = resolve(__dirname, '../../..');
const endpointsPath = resolve(sdkRoot, 'spec/endpoints.json');

const endpoints = JSON.parse(readFileSync(endpointsPath, 'utf8')) as EndpointEntry[];

describe('spec/endpoints.json — manifest shape lock', () => {
  it('loads as a non-empty array', () => {
    expect(Array.isArray(endpoints)).toBe(true);
    expect(endpoints.length).toBeGreaterThan(0);
  });

  it('contains at least 800 entries (sanity check on manifest scale)', () => {
    // Manifest README claims 810 entries cross-checked against
    // `php artisan route:list --json`. Floor at 800 to allow for benign route
    // pruning without tripping the gate; a real regression would be a much
    // larger drop than 10.
    expect(endpoints.length).toBeGreaterThanOrEqual(800);
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

  it('every auth value is one of api / admin / sanctum / public', () => {
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

  // Placeholder for the next round: module agents will flip this from
  // `it.todo` into a real assertion once each module's generated client is
  // wired up. The contract: every endpoint in the manifest must be reachable
  // via a generated method on the SDK surface.
  it.todo('every endpoint has a generated client method');
});
