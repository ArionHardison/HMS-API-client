/**
 * Endpoint coverage for `VerificationModuleApiClient` (`Modules/Verification`).
 *
 * 9 endpoints from `sdk/spec/endpoints.json` (module === "Modules/Verification").
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectMethodOverride,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { VerificationModuleApiClient } from '../modules-verification-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'verif-tkn-xyz';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): VerificationModuleApiClient {
  return new VerificationModuleApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('VerificationModuleApiClient — Modules/Verification', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  it('list() — GET /api/verification', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/verification`, ({ request }) => {
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

  it('create() — POST /api/verification with body', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/verification`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 7 } };
      }),
    );
    const body = { type: 'identity', payload: {} };
    const res = await makeClient().create(body);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data).toEqual({ id: 7 });
  });

  it('submit() — POST /api/verification/submit', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/verification/submit`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { success: true } };
      }),
    );
    const body = { ref: 'abc' };
    const res = await makeClient().submit(body);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data).toMatchObject({ success: true });
  });

  it('runGlobal() — GET /api/verification/run-global/{verification}/{task}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/verification/run-global/12/55`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { data: {}, chain: {} } };
      }),
    );
    const res = await makeClient().runGlobal(12, 55);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toMatchObject({ data: {}, chain: {} });
  });

  it('run() — GET /api/verification/run/{verification}/{chain}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/verification/run/12/77`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { data: {}, chain: {} } };
      }),
    );
    const res = await makeClient().run(12, 77);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toMatchObject({ data: {}, chain: {} });
  });

  it('show() — GET /api/verification/{verification}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/verification/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    const res = await makeClient().show(42);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual({ id: 42 });
  });

  it('update() — PUT /api/verification/{verification} sent as POST + ?_method=PUT', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/verification/42`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    const body = { type: 'address' };
    await makeClient().update(42, body);
    expectMethodOverride(captured.current!, 'PUT');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('destroy() — DELETE /api/verification/{verification}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/verification/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    await makeClient().destroy(42);
    expect(captured.current!.method).toBe('DELETE');
    expectAuthHeader(captured.current!, TOKEN);
  });

  it('listProtocolVerifications() — GET /api/protocol/verification/all', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/protocol/verification/all`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 1 }] };
      }),
    );
    const res = await makeClient().listProtocolVerifications();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual([{ id: 1 }]);
  });

  it('show() — accepts string IDs (route binding is string|number)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/verification/verif-slug`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    await makeClient().show('verif-slug');
    expect(new URL(captured.current!.url).pathname).toBe('/api/verification/verif-slug');
  });
});
