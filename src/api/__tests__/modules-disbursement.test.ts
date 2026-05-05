/**
 * Endpoint coverage for `DisbursementModuleApiClient` (`Modules/Disbursement`).
 *
 * 9 endpoints from `sdk/spec/endpoints.json` (module === "Modules/Disbursement").
 *
 * Manifest oddity: this module exposes `POST /api/disbursement/confirm`
 * instead of the `submit` action used by Appeal / Application / Report /
 * Verification. Test method is named `confirm()` accordingly.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectMethodOverride,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { DisbursementModuleApiClient } from '../modules-disbursement-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'disb-tkn-xyz';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): DisbursementModuleApiClient {
  return new DisbursementModuleApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('DisbursementModuleApiClient — Modules/Disbursement', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  it('list() — GET /api/disbursement', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/disbursement`, ({ request }) => {
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

  it('create() — POST /api/disbursement with body', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/disbursement`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 7 } };
      }),
    );
    const body = { amount: 100, currency: 'USD' };
    const res = await makeClient().create(body);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data).toEqual({ id: 7 });
  });

  it('confirm() — POST /api/disbursement/confirm', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/disbursement/confirm`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { success: true } };
      }),
    );
    const body = { ref: 'abc', txn: '0xdeadbeef' };
    const res = await makeClient().confirm(body);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data).toMatchObject({ success: true });
  });

  it('runGlobal() — GET /api/disbursement/run-global/{disbursement}/{task}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/disbursement/run-global/12/55`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { data: {}, chain: {} } };
      }),
    );
    const res = await makeClient().runGlobal(12, 55);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toMatchObject({ data: {}, chain: {} });
  });

  it('run() — GET /api/disbursement/run/{disbursement}/{chain}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/disbursement/run/12/77`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { data: {}, chain: {} } };
      }),
    );
    const res = await makeClient().run(12, 77);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toMatchObject({ data: {}, chain: {} });
  });

  it('show() — GET /api/disbursement/{disbursement}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/disbursement/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    const res = await makeClient().show(42);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual({ id: 42 });
  });

  it('update() — PUT /api/disbursement/{disbursement} sent as POST + ?_method=PUT', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/disbursement/42`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    const body = { amount: 250 };
    await makeClient().update(42, body);
    expectMethodOverride(captured.current!, 'PUT');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('destroy() — DELETE /api/disbursement/{disbursement}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/disbursement/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    await makeClient().destroy(42);
    expect(captured.current!.method).toBe('DELETE');
    expectAuthHeader(captured.current!, TOKEN);
  });

  it('listProtocolDisbursements() — GET /api/protocol/disbursement/all', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/protocol/disbursement/all`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 1 }] };
      }),
    );
    const res = await makeClient().listProtocolDisbursements();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual([{ id: 1 }]);
  });

  it('show() — accepts string IDs (route binding is string|number)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/disbursement/disb-slug`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    await makeClient().show('disb-slug');
    expect(new URL(captured.current!.url).pathname).toBe('/api/disbursement/disb-slug');
  });
});
