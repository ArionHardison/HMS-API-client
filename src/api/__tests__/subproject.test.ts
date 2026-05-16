/**
 * Endpoint coverage for `SubprojectApiClient` — the hierarchy-aware
 * successor to `TenancyApiClient`. Subprojects are NOT flat siblings:
 * each subproject can have a `parent_subproject_id`, and DPG / theme /
 * branding inherits up the chain from leaf to root.
 *
 * Tests pinned in this file (Lane A red phase):
 *
 *   1. `loadSubproject()` — GET /api/load, but the typed response now
 *      includes `parent_subproject_id: number | null` and
 *      `chain: Subproject[]` (the ancestor list, leaf → root, EXCLUDING
 *      the leaf itself). The chain comes pre-resolved from the api/
 *      side; the SDK does not walk it itself for this method.
 *
 *   2. `resolveInherited(subproject, key)` — pure helper. Walks from
 *      the leaf subproject through `subproject.chain` (leaf → root) and
 *      returns the FIRST non-null value for `key`. Used by sys/ to
 *      compute "effective" branding/theme without the consumer having
 *      to write the walk five times.
 *
 *   3. `getDpgInstances(id)` — GET /api/subprojects/{id}/dpg-instances.
 *      Returns `Array<{system_key, instance_url, mode,
 *      inherited_from_subproject_id}>`. The `inherited_from_subproject_id`
 *      is non-null when the binding was contributed by an ancestor
 *      rather than the leaf subproject. NOTE: this endpoint does not
 *      yet exist in api/ — see the sibling-ticket flag in the lane A
 *      report. The SDK type is forward-compatible.
 *
 *   4. `TenancyApiClient` deprecation alias — old name still imports +
 *      constructs + calls methods identically. Removed in 2.0.0.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectNoAuthHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { SubprojectApiClient } from '../subproject-api-client';
import type { Subproject, DpgInstance } from '../../types/subproject';
import { resolveInherited } from '../../utils/resolve-inherited';
import { TenancyApiClient } from '../tenancy-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'sub-tkn-xyz';
const DOMAIN = 'codify.healthcare';

interface Captured {
  current: Request | null;
}

function makeClient(): SubprojectApiClient {
  return new SubprojectApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

function makePublicClient(): SubprojectApiClient {
  return new SubprojectApiClient({
    baseURL: BASE,
    getDomain: () => DOMAIN,
  });
}

describe('SubprojectApiClient', () => {
  let captured: Captured;
  beforeEach(() => {
    captured = { current: null };
  });

  // ===========================================================================
  // loadSubproject() — hierarchy fields surface through /api/load
  // ===========================================================================

  describe('loadSubproject() — hierarchy', () => {
    it('returns ok=true with parent_subproject_id and chain on 200', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/load`, ({ request }) => {
          captured.current = request;
          return {
            data: {
              id: 42,
              name: 'NYC Health',
              parent_subproject_id: 7,
              theme: null,
              chain: [
                // leaf → root: closest ancestor first
                {
                  id: 7,
                  name: 'NY State Health',
                  parent_subproject_id: 3,
                  theme: 'state-blue',
                  chain: [],
                },
                {
                  id: 3,
                  name: 'US Health',
                  parent_subproject_id: null,
                  theme: 'federal-red',
                  chain: [],
                },
              ],
            },
          };
        }),
      );
      const res = await makePublicClient().loadSubproject();
      expect(captured.current!.method).toBe('GET');
      expectNoAuthHeader(captured.current!);
      expectDomainHeader(captured.current!, DOMAIN);
      expect(res.ok).toBe(true);
      expect(res.status).toBe(200);
      if (res.ok) {
        expect(res.data.id).toBe(42);
        expect(res.data.parent_subproject_id).toBe(7);
        expect(res.data.chain).toHaveLength(2);
        expect(res.data.chain[0].id).toBe(7);
        expect(res.data.chain[1].id).toBe(3);
        expect(res.data.chain[1].parent_subproject_id).toBeNull();
      }
    });

    it('parent_subproject_id is nullable for root subprojects', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/load`, () => ({
          data: {
            id: 1,
            name: 'root',
            parent_subproject_id: null,
            chain: [],
          },
        })),
      );
      const res = await makePublicClient().loadSubproject();
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.data.parent_subproject_id).toBeNull();
        expect(res.data.chain).toEqual([]);
      }
    });

    it('chain defaults to [] when api/ omits it (back-compat)', async () => {
      // api/ SubprojectClientDataResource may not yet emit chain — until
      // the sibling ticket lands, the SDK must tolerate the missing
      // field and surface an empty chain rather than throwing or leaving
      // it `undefined` (which would force every consumer to defend).
      server.use(
        mockEndpoint('get', `${BASE}/api/load`, () => ({
          data: {
            id: 99,
            name: 'orphaned',
          },
        })),
      );
      const res = await makePublicClient().loadSubproject();
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.data.chain).toEqual([]);
        expect(res.data.parent_subproject_id ?? null).toBeNull();
      }
    });

    it('returns ok=false on 404 without throwing', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/load`, () =>
          new Response(JSON.stringify({ error: 'Subproject not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }),
        ),
      );
      const res = await makePublicClient().loadSubproject();
      expect(res.ok).toBe(false);
      expect(res.status).toBe(404);
      expect(res.data).toBeNull();
    });
  });

  // ===========================================================================
  // resolveInherited(subproject, key) — pure helper
  // ===========================================================================

  describe('resolveInherited()', () => {
    it('returns the leaf value when it is non-null', () => {
      const leaf: Subproject = {
        id: 10,
        name: 'leaf',
        parent_subproject_id: 5,
        theme: 'leaf-theme',
        chain: [
          { id: 5, name: 'mid', parent_subproject_id: 1, theme: 'mid-theme', chain: [] },
          { id: 1, name: 'root', parent_subproject_id: null, theme: 'root-theme', chain: [] },
        ],
      };
      expect(resolveInherited(leaf, 'theme')).toBe('leaf-theme');
    });

    it('walks the chain leaf → root and returns the first non-null ancestor value', () => {
      const leaf: Subproject = {
        id: 10,
        name: 'leaf',
        parent_subproject_id: 5,
        theme: null,
        chain: [
          { id: 5, name: 'mid', parent_subproject_id: 1, theme: null, chain: [] },
          { id: 1, name: 'root', parent_subproject_id: null, theme: 'root-theme', chain: [] },
        ],
      };
      expect(resolveInherited(leaf, 'theme')).toBe('root-theme');
    });

    it('stops at the first non-null match (does not keep walking past)', () => {
      const leaf: Subproject = {
        id: 10,
        name: 'leaf',
        parent_subproject_id: 5,
        theme: null,
        chain: [
          { id: 5, name: 'mid', parent_subproject_id: 1, theme: 'mid-theme', chain: [] },
          { id: 1, name: 'root', parent_subproject_id: null, theme: 'root-theme', chain: [] },
        ],
      };
      expect(resolveInherited(leaf, 'theme')).toBe('mid-theme');
    });

    it('returns null when neither leaf nor any ancestor has a value', () => {
      const leaf: Subproject = {
        id: 10,
        name: 'leaf',
        parent_subproject_id: 5,
        theme: null,
        chain: [
          { id: 5, name: 'mid', parent_subproject_id: 1, theme: null, chain: [] },
          { id: 1, name: 'root', parent_subproject_id: null, theme: null, chain: [] },
        ],
      };
      expect(resolveInherited(leaf, 'theme')).toBeNull();
    });

    it('treats `undefined` as a non-match and continues walking', () => {
      // api/ may omit a field entirely on a partial payload. Mirror the
      // null behavior so consumers don't need a `?? null` shim before
      // calling resolveInherited.
      const leaf = {
        id: 10,
        name: 'leaf',
        parent_subproject_id: 5,
        chain: [
          { id: 5, name: 'mid', parent_subproject_id: 1, chain: [] },
          { id: 1, name: 'root', parent_subproject_id: null, theme: 'root-theme', chain: [] },
        ],
      } as unknown as Subproject;
      expect(resolveInherited(leaf, 'theme' as keyof Subproject)).toBe('root-theme');
    });

    it('handles a single-node chain (root subproject with no ancestors)', () => {
      const root: Subproject = {
        id: 1,
        name: 'root',
        parent_subproject_id: null,
        theme: 'root-theme',
        chain: [],
      };
      expect(resolveInherited(root, 'theme')).toBe('root-theme');
      expect(resolveInherited(root, 'parent_subproject_id')).toBeNull();
    });

    it('is pure — does not mutate the input subproject', () => {
      const leaf: Subproject = {
        id: 10,
        name: 'leaf',
        parent_subproject_id: null,
        theme: null,
        chain: [],
      };
      const before = JSON.stringify(leaf);
      resolveInherited(leaf, 'theme');
      expect(JSON.stringify(leaf)).toBe(before);
    });
  });

  // ===========================================================================
  // getDpgInstances(id) — DPG bindings with inheritance attribution
  // ===========================================================================

  describe('getDpgInstances(id)', () => {
    it('GET /api/subprojects/{id}/dpg-instances returns typed bindings', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/subprojects/42/dpg-instances`, ({ request }) => {
          captured.current = request;
          const body: DpgInstance[] = [
            {
              system_key: 'emr',
              instance_url: 'https://emr.codify.nyc',
              mode: 'domain',
              inherited_from_subproject_id: null,
            },
            {
              system_key: 'lms',
              instance_url: 'https://lms.codify.nyc',
              mode: 'hybrid',
              inherited_from_subproject_id: 7,
            },
            {
              system_key: 'hrm',
              instance_url: null,
              mode: 'native',
              inherited_from_subproject_id: null,
            },
          ];
          return { data: body };
        }),
      );
      const res = await makeClient().getDpgInstances(42);
      expect(captured.current!.method).toBe('GET');
      expectAuthHeader(captured.current!, TOKEN);
      expectDomainHeader(captured.current!, DOMAIN);
      expect(res.data).toHaveLength(3);
      expect(res.data[0].system_key).toBe('emr');
      expect(res.data[0].mode).toBe('domain');
      expect(res.data[0].inherited_from_subproject_id).toBeNull();
      expect(res.data[1].inherited_from_subproject_id).toBe(7);
      expect(res.data[2].instance_url).toBeNull();
    });

    it('encodes the id in the URL path (no SQL-injection via slashes)', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/subprojects/foo%2Fbar/dpg-instances`, ({ request }) => {
          captured.current = request;
          return { data: [] };
        }),
      );
      // String id with a forward slash should be percent-encoded so it
      // can't escape the path segment.
      await makeClient().getDpgInstances('foo/bar');
      expect(captured.current).not.toBeNull();
    });

    it('mode is constrained to the three canonical values', () => {
      // Compile-time check — exercised via a const assignment whose only
      // job is to make TS narrow the union. The runtime expect() is a
      // smoke check so the test isn't a no-op when the type loosens.
      const modes: Array<DpgInstance['mode']> = ['native', 'domain', 'hybrid'];
      expect(modes).toEqual(['native', 'domain', 'hybrid']);
    });
  });

  // ===========================================================================
  // TenancyApiClient — deprecation alias
  // ===========================================================================

  describe('TenancyApiClient deprecation alias', () => {
    it('TenancyApiClient is still importable and constructible', () => {
      const client = new TenancyApiClient({
        baseURL: BASE,
        getToken: () => TOKEN,
        getDomain: () => DOMAIN,
      });
      // It must structurally still expose the SubprojectApiClient surface
      // — the alias is a re-export, not a fork.
      expect(typeof (client as any).loadSubproject).toBe('function');
      expect(typeof (client as any).getDpgInstances).toBe('function');
    });

    it('TenancyApiClient.loadTenant() still works and proxies to loadSubproject()', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/load`, () => ({
          data: { id: 1, name: 'phm', parent_subproject_id: null, chain: [] },
        })),
      );
      const client = new TenancyApiClient({
        baseURL: BASE,
        getDomain: () => DOMAIN,
      });
      const res = await client.loadTenant();
      expect(res.ok).toBe(true);
      if (res.ok) expect(res.data.id).toBe(1);
    });

    it('emits a one-shot console.warn on TenancyApiClient construction', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      try {
        // First construction warns
        new TenancyApiClient({ baseURL: BASE, getDomain: () => DOMAIN });
        // Subsequent constructions should NOT warn again (one-shot)
        new TenancyApiClient({ baseURL: BASE, getDomain: () => DOMAIN });
        new TenancyApiClient({ baseURL: BASE, getDomain: () => DOMAIN });

        const tenancyWarns = warn.mock.calls.filter((call) =>
          String(call[0] ?? '').includes('TenancyApiClient'),
        );
        expect(tenancyWarns.length).toBe(1);
      }
      finally {
        warn.mockRestore();
      }
    });
  });
});
