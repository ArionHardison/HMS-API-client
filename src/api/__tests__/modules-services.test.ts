/**
 * Endpoint coverage for `ServicesModuleApiClient` (`Modules/Services`).
 *
 * Spec source: `sdk/spec/endpoints.json` — module === "Modules/Services".
 * 3 endpoints, all under the `/api/v1/services/*` versioned prefix (the
 * other versioned family alongside ETL). All endpoints are `auth:api` —
 * Bearer required.
 *
 * The resolver fan-out is: `resolve` → discover candidates from HRM / LMS
 * / external; `reserve` → claim a slot or candidate; `release` → undo a
 * reservation.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { ServicesModuleApiClient } from '../modules-services-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'services-tkn-xyz';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): ServicesModuleApiClient {
  return new ServicesModuleApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('ServicesModuleApiClient — Modules/Services', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  // ---------------------------------------------------------------------------
  // POST /api/v1/services/resolve — post.api.v1.services.resolve
  // ---------------------------------------------------------------------------
  it('resolve() — POST /api/v1/services/resolve (versioned prefix preserved)', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/v1/services/resolve`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { candidates: [] } };
        },
      ),
    );
    const body = { chain_id: 12, service_name: 'lab.cbc', near: 'NYC' };
    await makeClient().resolve(body);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(await captured.current!.json()).toEqual(body);
  });

  // ---------------------------------------------------------------------------
  // POST /api/v1/services/reserve — post.api.v1.services.reserve
  // ---------------------------------------------------------------------------
  it('reserve() — POST /api/v1/services/reserve', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/v1/services/reserve`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { reservation_id: 9 } };
        },
      ),
    );
    const body = {
      chain_id: 12,
      source: 'hrm' as const,
      slot_id: 99,
    };
    const res = await makeClient().reserve(body);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data).toMatchObject({ reservation_id: 9 });
  });

  // ---------------------------------------------------------------------------
  // POST /api/v1/services/release — post.api.v1.services.release
  // ---------------------------------------------------------------------------
  it('release() — POST /api/v1/services/release', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/v1/services/release`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { released: true } };
        },
      ),
    );
    const body = {
      chain_id: 12,
      source: 'external' as const,
      external_candidate_id: 17,
    };
    await makeClient().release(body);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
  });
});
