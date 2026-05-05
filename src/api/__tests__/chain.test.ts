/**
 * Endpoint coverage for `ChainApiClient` — `/api/chain*` (6 endpoints).
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectMethodOverride,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { ChainApiClient } from '../chain-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'chain-tok-abc';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): ChainApiClient {
  return new ChainApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('ChainApiClient — /api/chain*', () => {
  let captured: Captured;
  beforeEach(() => {
    captured = { current: null };
  });

  it('listChains() — GET /api/chain', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/chain`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 1 }] };
      }),
    );
    const res = await makeClient().listChains();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(res.data).toEqual([{ id: 1 }]);
  });

  it('createChain() — POST /api/chain with body', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/chain`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 9 } };
      }),
    );
    await makeClient().createChain({ name: 'My chain' });
    expect(captured.current!.method).toBe('POST');
    expect(await captured.current!.json()).toEqual({ name: 'My chain' });
  });

  it('showChain() — GET /api/chain/{id}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/chain/12`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 12 } };
      }),
    );
    const res = await makeClient().showChain(12);
    expect(res.data).toEqual({ id: 12 });
  });

  it('updateChain() — PUT /api/chain/{id} via POST + ?_method=PUT', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/chain/12`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 12 } };
      }),
    );
    await makeClient().updateChain(12, { name: 'Renamed' });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('destroyChain() — DELETE /api/chain/{id}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/chain/12`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().destroyChain(12);
    expect(captured.current!.method).toBe('DELETE');
  });

  it('switchChainParent() — POST /api/chain/switch-parent/{protocol}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/chain/switch-parent/55`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { ok: true } };
        },
      ),
    );
    await makeClient().switchChainParent(55, { parent_id: 99 });
    expect(captured.current!.method).toBe('POST');
    expect(await captured.current!.json()).toEqual({ parent_id: 99 });
  });
});
