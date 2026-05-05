/**
 * Endpoint coverage for `ApplicationModuleApiClient` (`Modules/Application`).
 *
 * Mirrors the structure of `modules-appeal.test.ts`: 9 endpoints from
 * `sdk/spec/endpoints.json` (module === "Modules/Application"), one
 * `it()` per endpoint plus a string-id round-trip case.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectMethodOverride,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { ApplicationModuleApiClient } from '../modules-application-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'app-tkn-xyz';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): ApplicationModuleApiClient {
  return new ApplicationModuleApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('ApplicationModuleApiClient — Modules/Application', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  it('list() — GET /api/application', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/application`, ({ request }) => {
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

  it('create() — POST /api/application with body', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/application`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 7 } };
      }),
    );
    const body = { name: 'a1' };
    const res = await makeClient().create(body);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data).toEqual({ id: 7 });
  });

  it('submit() — POST /api/application/submit', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/application/submit`, async ({ request }) => {
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

  it('runGlobal() — GET /api/application/run-global/{application}/{task}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/application/run-global/12/55`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { data: {}, chain: {} } };
      }),
    );
    const res = await makeClient().runGlobal(12, 55);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toMatchObject({ data: {}, chain: {} });
  });

  it('run() — GET /api/application/run/{application}/{chain}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/application/run/12/77`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { data: {}, chain: {} } };
      }),
    );
    const res = await makeClient().run(12, 77);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toMatchObject({ data: {}, chain: {} });
  });

  it('show() — GET /api/application/{application}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/application/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    const res = await makeClient().show(42);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual({ id: 42 });
  });

  it('update() — PUT /api/application/{application} sent as POST + ?_method=PUT', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/application/42`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    const body = { name: 'renamed' };
    await makeClient().update(42, body);
    expectMethodOverride(captured.current!, 'PUT');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('destroy() — DELETE /api/application/{application}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/application/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    await makeClient().destroy(42);
    expect(captured.current!.method).toBe('DELETE');
    expectAuthHeader(captured.current!, TOKEN);
  });

  it('listProtocolApplications() — GET /api/protocol/application/all', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/protocol/application/all`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 1 }] };
      }),
    );
    const res = await makeClient().listProtocolApplications();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual([{ id: 1 }]);
  });

  it('show() — accepts string IDs (route binding is string|number)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/application/app-slug`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    await makeClient().show('app-slug');
    expect(new URL(captured.current!.url).pathname).toBe('/api/application/app-slug');
  });
});
