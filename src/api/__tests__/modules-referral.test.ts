/**
 * Endpoint coverage for `ReferralModuleApiClient` (`Modules/Referral`).
 *
 * 9 endpoints from `sdk/spec/endpoints.json` (module === "Modules/Referral").
 *
 * Manifest oddity: Referral exposes `POST /api/referral/confirm` (not
 * `submit`). Test method is named `confirm()` accordingly.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectMethodOverride,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { ReferralModuleApiClient } from '../modules-referral-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'ref-tkn-xyz';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): ReferralModuleApiClient {
  return new ReferralModuleApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('ReferralModuleApiClient — Modules/Referral', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  it('list() — GET /api/referral', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/referral`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 1 }] };
      }),
    );
    const res = await makeClient().list();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(res.data).toEqual([{ id: 1 }]);
  });

  it('create() — POST /api/referral with body', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/referral`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 7 } };
      }),
    );
    const body = { referrer: 'r1', referee: 'e1' };
    const res = await makeClient().create(body);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data).toEqual({ id: 7 });
  });

  it('confirm() — POST /api/referral/confirm', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/referral/confirm`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { success: true } };
      }),
    );
    const body = { code: 'abc' };
    const res = await makeClient().confirm(body);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data).toMatchObject({ success: true });
  });

  it('runGlobal() — GET /api/referral/run-global/{referral}/{task}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/referral/run-global/12/55`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { data: {}, chain: {} } };
      }),
    );
    const res = await makeClient().runGlobal(12, 55);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toMatchObject({ data: {}, chain: {} });
  });

  it('run() — GET /api/referral/run/{referral}/{chain}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/referral/run/12/77`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { data: {}, chain: {} } };
      }),
    );
    const res = await makeClient().run(12, 77);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toMatchObject({ data: {}, chain: {} });
  });

  it('show() — GET /api/referral/{referral}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/referral/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    const res = await makeClient().show(42);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual({ id: 42 });
  });

  it('update() — PUT /api/referral/{referral} sent as POST + ?_method=PUT', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/referral/42`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    const body = { code: 'updated' };
    await makeClient().update(42, body);
    expectMethodOverride(captured.current!, 'PUT');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('destroy() — DELETE /api/referral/{referral}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/referral/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    await makeClient().destroy(42);
    expect(captured.current!.method).toBe('DELETE');
    expectAuthHeader(captured.current!, TOKEN);
  });

  it('listProtocolReferrals() — GET /api/protocol/referral/all', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/protocol/referral/all`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 1 }] };
      }),
    );
    const res = await makeClient().listProtocolReferrals();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual([{ id: 1 }]);
  });

  it('show() — accepts string IDs (route binding is string|number)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/referral/ref-slug`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    await makeClient().show('ref-slug');
    expect(new URL(captured.current!.url).pathname).toBe('/api/referral/ref-slug');
  });
});
