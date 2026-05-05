/**
 * Endpoint coverage for `ReportModuleApiClient` (`Modules/Report`).
 *
 * 9 endpoints from `sdk/spec/endpoints.json` (module === "Modules/Report").
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectMethodOverride,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { ReportModuleApiClient } from '../modules-report-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'rep-tkn-xyz';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): ReportModuleApiClient {
  return new ReportModuleApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('ReportModuleApiClient — Modules/Report', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  it('list() — GET /api/report', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/report`, ({ request }) => {
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

  it('create() — POST /api/report with body', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/report`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 7 } };
      }),
    );
    const body = { title: 'r1' };
    const res = await makeClient().create(body);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data).toEqual({ id: 7 });
  });

  it('submit() — POST /api/report/submit', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/report/submit`, async ({ request }) => {
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

  it('runGlobal() — GET /api/report/run-global/{report}/{task}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/report/run-global/12/55`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { data: {}, chain: {} } };
      }),
    );
    const res = await makeClient().runGlobal(12, 55);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toMatchObject({ data: {}, chain: {} });
  });

  it('run() — GET /api/report/run/{report}/{chain}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/report/run/12/77`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { data: {}, chain: {} } };
      }),
    );
    const res = await makeClient().run(12, 77);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toMatchObject({ data: {}, chain: {} });
  });

  it('show() — GET /api/report/{report}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/report/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    const res = await makeClient().show(42);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual({ id: 42 });
  });

  it('update() — PUT /api/report/{report} sent as POST + ?_method=PUT', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/report/42`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    const body = { title: 'renamed' };
    await makeClient().update(42, body);
    expectMethodOverride(captured.current!, 'PUT');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('destroy() — DELETE /api/report/{report}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/report/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    await makeClient().destroy(42);
    expect(captured.current!.method).toBe('DELETE');
    expectAuthHeader(captured.current!, TOKEN);
  });

  it('listProtocolReports() — GET /api/protocol/report/all', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/protocol/report/all`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 1 }] };
      }),
    );
    const res = await makeClient().listProtocolReports();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual([{ id: 1 }]);
  });

  it('show() — accepts string IDs (route binding is string|number)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/report/rep-slug`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    await makeClient().show('rep-slug');
    expect(new URL(captured.current!.url).pathname).toBe('/api/report/rep-slug');
  });
});
