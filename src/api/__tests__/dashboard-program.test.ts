/**
 * Endpoint coverage for `DashboardProgramApiClient` — 7 endpoints.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectMethodOverride,
  expectNoAuthHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { DashboardProgramApiClient } from '../dashboard-program-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'dp-tok-abc';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): DashboardProgramApiClient {
  return new DashboardProgramApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('DashboardProgramApiClient', () => {
  let captured: Captured;
  beforeEach(() => {
    captured = { current: null };
  });

  it('listDashboardPrograms() — GET /api/dashboard-program', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/dashboard-program`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().listDashboardPrograms();
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(captured.current!.method).toBe('GET');
  });

  it('createDashboardProgram() — POST /api/dashboard-program', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/dashboard-program`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    await makeClient().createDashboardProgram();
    expect(captured.current!.method).toBe('POST');
  });

  it('showDashboardProgram() — GET /api/dashboard-program/{id}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/dashboard-program/12`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 12 } };
        },
      ),
    );
    await makeClient().showDashboardProgram(12);
    expect(captured.current!.method).toBe('GET');
  });

  it('updateDashboardProgram() — PUT /api/dashboard-program/{id} via POST + ?_method=PUT', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/dashboard-program/12`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 12 } };
        },
      ),
    );
    await makeClient().updateDashboardProgram(12, { featured: true });
    expectMethodOverride(captured.current!, 'PUT');
    expect((await captured.current!.json()).featured).toBe(true);
  });

  it('destroyDashboardProgram() — DELETE /api/dashboard-program/{id}', async () => {
    server.use(
      mockEndpoint(
        'delete',
        `${BASE}/api/dashboard-program/12`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        },
      ),
    );
    await makeClient().destroyDashboardProgram(12);
    expect(captured.current!.method).toBe('DELETE');
  });

  it('getDashboardSettings() — GET /api/dashboard-settings/get (public, no Bearer)', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/dashboard-settings/get`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { theme: 'dark' } };
        },
      ),
    );
    await makeClient().getDashboardSettings();
    expectNoAuthHeader(captured.current!);
    expectDomainHeader(captured.current!, DOMAIN);
  });

  it('updateProtocolCategory() — PUT /api/protocol-category/{id} via POST + ?_method=PUT', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/protocol-category/3`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 3 } };
        },
      ),
    );
    await makeClient().updateProtocolCategory(3, { category_name: 'New name' });
    expectMethodOverride(captured.current!, 'PUT');
    expect((await captured.current!.json()).category_name).toBe('New name');
  });
});
