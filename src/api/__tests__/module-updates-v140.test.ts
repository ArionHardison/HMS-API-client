/**
 * v1.4.0 endpoint additions — happy-path coverage for the routes that
 * had drifted out of the SDK as of the v1.3.0 → v1.4.0 audit:
 *
 *   - AuthUserApiClient.getAccessibleSubprojects() — GET /api/me/accessible-subprojects
 *   - MiscCoreApiClient.submitErrorReport()        — POST /api/support/error-report
 *   - WizardSetupApiClient.startWizard()           — POST /api/wizard/start
 *   - SubprojectApiClient.getCurrentSubprojectSystem() — GET /api/v1/subprojects/current/system
 *
 * Intake routes are covered separately in
 * `modules-intake.test.ts`. Style + helpers mirror the existing
 * per-module suites under `src/api/__tests__/`.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectNoAuthHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { AuthUserApiClient } from '../auth-user-api-client';
import { MiscCoreApiClient } from '../misc-core-api-client';
import { SubprojectApiClient } from '../subproject-api-client';
import { WizardSetupApiClient } from '../wizard-setup-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'v140-tkn';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

describe('v1.4.0 — newly-added endpoint coverage', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  // ---------------------------------------------------------------------------
  // AuthUserApiClient.getAccessibleSubprojects() — GET /api/me/accessible-subprojects
  // ---------------------------------------------------------------------------
  it('getAccessibleSubprojects() — GET /api/me/accessible-subprojects (Bearer)', async () => {
    const client = new AuthUserApiClient({
      baseURL: BASE,
      getToken: () => TOKEN,
      getDomain: () => DOMAIN,
    });
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/me/accessible-subprojects`,
        ({ request }) => {
          captured.current = request;
          return {
            success: true,
            message: '',
            data: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }],
          };
        },
      ),
    );
    const res = await client.getAccessibleSubprojects();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data).toHaveLength(2);
  });

  // ---------------------------------------------------------------------------
  // MiscCoreApiClient.submitErrorReport() — POST /api/support/error-report
  // ---------------------------------------------------------------------------
  it('submitErrorReport() — POST /api/support/error-report (public, no Bearer)', async () => {
    const client = new MiscCoreApiClient({
      baseURL: BASE,
      getToken: () => TOKEN,
      getDomain: () => DOMAIN,
    });
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/support/error-report`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { received: true } };
        },
      ),
    );
    const body = {
      url: 'https://phm.ai/oops',
      user_agent: 'jest',
      stack: 'Error: boom',
    };
    const res = await client.submitErrorReport(body);
    expect(captured.current!.method).toBe('POST');
    expectNoAuthHeader(captured.current!);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(await captured.current!.json()).toEqual(body);
    expect((res.data as { received: boolean }).received).toBe(true);
  });

  // ---------------------------------------------------------------------------
  // WizardSetupApiClient.startWizard() — POST /api/wizard/start
  // ---------------------------------------------------------------------------
  it('startWizard() — POST /api/wizard/start (Bearer)', async () => {
    const client = new WizardSetupApiClient({
      baseURL: BASE,
      getToken: () => TOKEN,
      getDomain: () => DOMAIN,
    });
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/wizard/start`,
        async ({ request }) => {
          captured.current = request.clone();
          return {
            success: true,
            message: '',
            data: { subproject_id: 99, domain: 'newco.codify.city' },
          };
        },
      ),
    );
    const body = {
      organization: 'New Co',
      mission: 'Do the thing',
      contacts: [{ name: 'A', email: 'a@b.c' }],
    };
    const res = await client.startWizard(body);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
    expect((res.data as { subproject_id: number }).subproject_id).toBe(99);
  });

  // ---------------------------------------------------------------------------
  // SubprojectApiClient.getCurrentSubprojectSystem() — GET /api/v1/subprojects/current/system
  // ---------------------------------------------------------------------------
  it('getCurrentSubprojectSystem() — GET /api/v1/subprojects/current/system (public)', async () => {
    const client = new SubprojectApiClient({
      baseURL: BASE,
      getToken: () => TOKEN,
      getDomain: () => DOMAIN,
    });
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/v1/subprojects/current/system`,
        ({ request }) => {
          captured.current = request;
          return {
            success: true,
            message: '',
            data: { systems: { dpg: { instance_id: 1 } } },
          };
        },
      ),
    );
    const res = await client.getCurrentSubprojectSystem();
    expect(captured.current!.method).toBe('GET');
    expectNoAuthHeader(captured.current!);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(res.data).toEqual({ systems: { dpg: { instance_id: 1 } } });
  });
});
