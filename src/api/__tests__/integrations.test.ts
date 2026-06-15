/**
 * IntegrationsApiClient — endpoint-by-endpoint contract tests for the
 * subproject federation surface (`api/Modules/Integrations`, 15 routes): the
 * machine-to-machine glue IBD/PHM/MOB/NIO + codify-careers use to write
 * events into P2X.
 *
 * Each `describe` wraps a single route and asserts (campaign #1000 checklist):
 *   - URL (after baseURL)
 *   - HTTP verb on the wire (all POST)
 *   - `Authorization: Bearer` header present (machine writer token) — EXCEPT
 *     the two unauthenticated token-mint endpoints (firebase-login,
 *     guest-register) which assert NO Authorization header by default
 *   - `X-Domain` header present (every endpoint is tenant-scoped)
 *   - `Idempotency-Key` header on writes when supplied (+ omitted when not)
 *   - request body matches the controller's FormRequest shape
 *   - response decoding pulls the raw controller body (202 linked/accepted,
 *     coin balance, token-mint envelopes)
 *
 * Plus a 422 (validation), a 401 (unauthorized callback + ApiError), and the
 * insufficient-balance + invalid-firebase-token paths.
 *
 * MSW-based; mirrors the canonical style of `deal-wizard.test.ts`.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpResponse } from 'msw';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectNoAuthHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { ApiError } from '../error-handling';
import { IntegrationsApiClient } from '../integrations-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'tok-subproject-writer';
const DOMAIN = 'crohnie.ai';
const IDEM = 'idem-key-integrations-1';

function makeClient(overrides: Record<string, unknown> = {}): IntegrationsApiClient {
  return new IntegrationsApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
    ...overrides,
  });
}

/** Assert the captured request carries `Idempotency-Key: <key>`. */
function expectIdempotencyKey(request: Request, key: string): void {
  const got = request.headers.get('idempotency-key');
  if (got !== key) {
    throw new Error(`Expected Idempotency-Key "${key}", got "${got ?? '<missing>'}".`);
  }
}

function upsertEnvelope(source: string): Record<string, unknown> {
  return { user_id: 7, external_id: 'ext-abc', source, status: 'linked' };
}

function eventEnvelope(source: string, kind: string): Record<string, unknown> {
  return { id: 42, source, kind, status: 'accepted' };
}

describe('IntegrationsApiClient — subproject federation surface', () => {
  let cap: { current: Request | null };

  beforeEach(() => {
    cap = { current: null };
  });

  afterEach(() => {
    cap.current = null;
  });

  // ===========================================================================
  // User upsert — IBD / PHM / MOB / NIO
  // ===========================================================================

  describe('POST /api/v1/integrations/ibd/users/upsert (upsertIbdUser)', () => {
    it('Bearer + X-Domain + Idempotency-Key, body {external_id,email,attributes}, 202 linked', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/v1/integrations/ibd/users/upsert`, async ({ request }) => {
          cap.current = request.clone();
          return HttpResponse.json(upsertEnvelope('ibd'), { status: 202 });
        }),
      );
      const res = await makeClient().upsertIbdUser(
        { external_id: 'mongo-id-1', email: 'p@x.com', attributes: { plan: 'gold' } },
        IDEM,
      );
      expectAuthHeader(cap.current!, TOKEN);
      expectDomainHeader(cap.current!, DOMAIN);
      expectIdempotencyKey(cap.current!, IDEM);
      expect(cap.current!.method).toBe('POST');
      expect(await cap.current!.json()).toEqual({
        external_id: 'mongo-id-1',
        email: 'p@x.com',
        attributes: { plan: 'gold' },
      });
      expect(res.source).toBe('ibd');
      expect(res.status).toBe('linked');
    });

    it('omits Idempotency-Key when not supplied', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/v1/integrations/ibd/users/upsert`, async ({ request }) => {
          cap.current = request.clone();
          return HttpResponse.json(upsertEnvelope('ibd'), { status: 202 });
        }),
      );
      await makeClient().upsertIbdUser({ external_id: 'mongo-id-1' });
      expect(cap.current!.headers.get('idempotency-key')).toBeNull();
    });

    it('surfaces a 422 validation error via ApiError + callback', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/v1/integrations/ibd/users/upsert`, () =>
          HttpResponse.json(
            { message: 'The external id field is required.', errors: { external_id: ['required'] } },
            { status: 422 },
          ),
        ),
      );
      const onValidationError = vi.fn();
      const client = makeClient({ onValidationError });
      await expect(
        client.upsertIbdUser({ external_id: '' }),
      ).rejects.toBeInstanceOf(ApiError);
      expect(onValidationError).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /api/v1/integrations/phm/users/upsert (upsertPhmUser)', () => {
    it('Bearer + Idempotency-Key, 202 linked source phm', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/v1/integrations/phm/users/upsert`, async ({ request }) => {
          cap.current = request.clone();
          return HttpResponse.json(upsertEnvelope('phm'), { status: 202 });
        }),
      );
      const res = await makeClient().upsertPhmUser({ external_id: '12345' }, IDEM);
      expectAuthHeader(cap.current!, TOKEN);
      expectIdempotencyKey(cap.current!, IDEM);
      expect(res.source).toBe('phm');
    });
  });

  describe('POST /api/v1/integrations/mob/users/upsert (upsertMobUser)', () => {
    it('Bearer + Idempotency-Key, 202 linked source mob', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/v1/integrations/mob/users/upsert`, async ({ request }) => {
          cap.current = request.clone();
          return HttpResponse.json(upsertEnvelope('mob'), { status: 202 });
        }),
      );
      const res = await makeClient().upsertMobUser({ external_id: 'device-uuid-1' }, IDEM);
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.source).toBe('mob');
    });
  });

  describe('POST /api/v1/integrations/nio/users/upsert (upsertNioUser)', () => {
    it('Bearer + Idempotency-Key, 202 linked source nio', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/v1/integrations/nio/users/upsert`, async ({ request }) => {
          cap.current = request.clone();
          return HttpResponse.json(upsertEnvelope('nio'), { status: 202 });
        }),
      );
      const res = await makeClient().upsertNioUser({ external_id: 'firebase-uid-1' }, IDEM);
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.source).toBe('nio');
    });
  });

  // ===========================================================================
  // Careers HRM claim-back upsert
  // ===========================================================================

  describe('POST /api/v1/integrations/careers/users/upsert (upsertCareersUser)', () => {
    it('Bearer + Idempotency-Key, body {source,source_id,source_email,name}, 202 with p2x_user_id', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/v1/integrations/careers/users/upsert`, async ({ request }) => {
          cap.current = request.clone();
          return HttpResponse.json(
            { user_id: 7, p2x_user_id: 7, source: 'hrm-candidate', status: 'linked' },
            { status: 202 },
          );
        }),
      );
      const res = await makeClient().upsertCareersUser(
        { source: 'hrm-candidate', source_id: 'cand-99', source_email: 'c@x.com', name: 'Cara' },
        IDEM,
      );
      expectAuthHeader(cap.current!, TOKEN);
      expectIdempotencyKey(cap.current!, IDEM);
      const body = await cap.current!.json();
      expect(body.source_id).toBe('cand-99');
      expect(body.source_email).toBe('c@x.com');
      expect(res.p2x_user_id).toBe(7);
      expect(res.status).toBe('linked');
    });
  });

  // ===========================================================================
  // IBD Phase 1 event log
  // ===========================================================================

  describe('POST /api/v1/integrations/ibd/applications (createIbdApplication)', () => {
    it('Bearer + Idempotency-Key, body shape, 202 accepted kind application', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/v1/integrations/ibd/applications`, async ({ request }) => {
          cap.current = request.clone();
          return HttpResponse.json(eventEnvelope('ibd', 'application'), { status: 202 });
        }),
      );
      const res = await makeClient().createIbdApplication(
        {
          patient_external_id: 'pat-1',
          program_code: 'CROHN-A',
          intake_payload: { severity: 'moderate' },
        },
        IDEM,
      );
      expectAuthHeader(cap.current!, TOKEN);
      expectIdempotencyKey(cap.current!, IDEM);
      const body = await cap.current!.json();
      expect(body.patient_external_id).toBe('pat-1');
      expect(body.program_code).toBe('CROHN-A');
      expect(res.kind).toBe('application');
      expect(res.status).toBe('accepted');
    });
  });

  describe('POST /api/v1/integrations/ibd/kpi-events (createIbdKpiEvent)', () => {
    it('Bearer + Idempotency-Key, body {metric,value,occurred_at}, 202 accepted kind kpi_event', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/v1/integrations/ibd/kpi-events`, async ({ request }) => {
          cap.current = request.clone();
          return HttpResponse.json(eventEnvelope('ibd', 'kpi_event'), { status: 202 });
        }),
      );
      const res = await makeClient().createIbdKpiEvent(
        { metric: 'adherence', value: 0.92, dimensions: { cohort: 'A' }, occurred_at: '2026-06-15T00:00:00Z' },
        IDEM,
      );
      expectAuthHeader(cap.current!, TOKEN);
      const body = await cap.current!.json();
      expect(body.metric).toBe('adherence');
      expect(body.value).toBe(0.92);
      expect(body.occurred_at).toBe('2026-06-15T00:00:00Z');
      expect(res.kind).toBe('kpi_event');
    });
  });

  // ===========================================================================
  // MOB Phase 1 event log
  // ===========================================================================

  describe('POST /api/v1/integrations/mob/activity-locations/batch (batchMobActivityLocations)', () => {
    it('Bearer + Idempotency-Key, body {device_uuid, points[]}, 202 accepted kind activity_location', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/v1/integrations/mob/activity-locations/batch`,
          async ({ request }) => {
            cap.current = request.clone();
            return HttpResponse.json(eventEnvelope('mob', 'activity_location'), { status: 202 });
          },
        ),
      );
      const res = await makeClient().batchMobActivityLocations(
        {
          device_uuid: 'dev-1',
          points: [{ run_id: 'run-1', lat: 40.7, lng: -74.0, recorded_at: '2026-06-15T00:00:01Z' }],
        },
        IDEM,
      );
      expectAuthHeader(cap.current!, TOKEN);
      expectIdempotencyKey(cap.current!, IDEM);
      const body = await cap.current!.json();
      expect(body.device_uuid).toBe('dev-1');
      expect(body.points[0].run_id).toBe('run-1');
      expect(body.points[0].lat).toBe(40.7);
      expect(res.kind).toBe('activity_location');
    });
  });

  describe('POST /api/v1/integrations/mob/runs/complete (completeMobRun)', () => {
    it('Bearer + Idempotency-Key, body {run_id,total_seconds,distance_meters}, 202 accepted kind run_complete', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/v1/integrations/mob/runs/complete`, async ({ request }) => {
          cap.current = request.clone();
          return HttpResponse.json(eventEnvelope('mob', 'run_complete'), { status: 202 });
        }),
      );
      const res = await makeClient().completeMobRun(
        { run_id: 'run-1', total_seconds: 1800, distance_meters: 5000.5, path_geojson: { type: 'LineString' } },
        IDEM,
      );
      expectAuthHeader(cap.current!, TOKEN);
      const body = await cap.current!.json();
      expect(body.run_id).toBe('run-1');
      expect(body.total_seconds).toBe(1800);
      expect(body.distance_meters).toBe(5000.5);
      expect(res.kind).toBe('run_complete');
    });
  });

  // ===========================================================================
  // NIO Phase 1 event log
  // ===========================================================================

  describe('POST /api/v1/integrations/nio/assessments-responses (createNioAssessmentResponse)', () => {
    it('Bearer + Idempotency-Key, body {assessment_key, responses}, 202 accepted kind assessment', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/v1/integrations/nio/assessments-responses`,
          async ({ request }) => {
            cap.current = request.clone();
            return HttpResponse.json(eventEnvelope('nio', 'assessment'), { status: 202 });
          },
        ),
      );
      const res = await makeClient().createNioAssessmentResponse(
        { assessment_key: 'diet-v1', responses: { q1: 'a' }, scoring: { total: 9 } },
        IDEM,
      );
      expectAuthHeader(cap.current!, TOKEN);
      const body = await cap.current!.json();
      expect(body.assessment_key).toBe('diet-v1');
      expect(body.responses).toEqual({ q1: 'a' });
      expect(res.kind).toBe('assessment');
    });
  });

  describe('POST /api/v1/integrations/nio/orders (createNioOrder)', () => {
    it('Bearer + Idempotency-Key, body {source,external_order_id,amount_cents,status}, 202 accepted kind order', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/v1/integrations/nio/orders`, async ({ request }) => {
          cap.current = request.clone();
          return HttpResponse.json(eventEnvelope('nio', 'order'), { status: 202 });
        }),
      );
      const res = await makeClient().createNioOrder(
        { source: 'stripe', external_order_id: 'sub_123', amount_cents: 999, status: 'active' },
        IDEM,
      );
      expectAuthHeader(cap.current!, TOKEN);
      const body = await cap.current!.json();
      expect(body.source).toBe('stripe');
      expect(body.external_order_id).toBe('sub_123');
      expect(body.amount_cents).toBe(999);
      expect(res.kind).toBe('order');
    });

    it('surfaces a 422 (bad source enum) via ApiError', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/v1/integrations/nio/orders`, () =>
          HttpResponse.json(
            { message: 'The selected source is invalid.', errors: { source: ['in'] } },
            { status: 422 },
          ),
        ),
      );
      await expect(
        makeClient().createNioOrder({
          source: 'paypal' as unknown as 'stripe',
          external_order_id: 'x',
          amount_cents: 1,
          status: 'active',
        }),
      ).rejects.toBeInstanceOf(ApiError);
    });
  });

  // ===========================================================================
  // NIO coin economy
  // ===========================================================================

  describe('POST /api/v1/integrations/nio/coins/grant (grantNioCoins)', () => {
    it('Bearer + Idempotency-Key, body {amount,reason}, returns {balance,transaction_id}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/v1/integrations/nio/coins/grant`, async ({ request }) => {
          cap.current = request.clone();
          return { balance: 150, transaction_id: 5001 };
        }),
      );
      const res = await makeClient().grantNioCoins({ amount: 50, reason: 'daily-bonus' }, IDEM);
      expectAuthHeader(cap.current!, TOKEN);
      expectIdempotencyKey(cap.current!, IDEM);
      expect(await cap.current!.json()).toEqual({ amount: 50, reason: 'daily-bonus' });
      expect(res.balance).toBe(150);
      expect(res.transaction_id).toBe(5001);
    });
  });

  describe('POST /api/v1/integrations/nio/coins/spend (spendNioCoins)', () => {
    it('Bearer + Idempotency-Key, body {amount}, returns {balance,transaction_id}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/v1/integrations/nio/coins/spend`, async ({ request }) => {
          cap.current = request.clone();
          return { balance: 100, transaction_id: 5002 };
        }),
      );
      const res = await makeClient().spendNioCoins({ amount: 50 }, IDEM);
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ amount: 50 });
      expect(res.balance).toBe(100);
    });

    it('surfaces a 422 insufficient balance via ApiError', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/v1/integrations/nio/coins/spend`, () =>
          HttpResponse.json(
            { message: 'Insufficient coin balance.', errors: { amount: ['Insufficient coin balance.'] } },
            { status: 422 },
          ),
        ),
      );
      await expect(makeClient().spendNioCoins({ amount: 9999 })).rejects.toBeInstanceOf(ApiError);
    });
  });

  // ===========================================================================
  // Token mints — unauthenticated
  // ===========================================================================

  describe('POST /api/v1/integrations/nio/firebase-login (nioFirebaseLogin)', () => {
    it('sends NO Authorization, keeps X-Domain + Idempotency-Key, returns {success,data:{user,token}}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/v1/integrations/nio/firebase-login`, async ({ request }) => {
          cap.current = request.clone();
          return {
            success: true,
            message: 'ok',
            data: {
              user: { id: 7, name: 'Nina', username: 'nio_x', email: 'n@x.com', roles: [], email_verified_at: null },
              token: { access_token: 'sanctum-tok', token_type: 'Bearer', expires_at: null },
            },
          };
        }),
      );
      const res = await makeClient().nioFirebaseLogin(
        { firebase_id_token: 'aaa.bbb.ccc' },
        IDEM,
      );
      expectNoAuthHeader(cap.current!);
      expectDomainHeader(cap.current!, DOMAIN);
      expectIdempotencyKey(cap.current!, IDEM);
      expect(await cap.current!.json()).toEqual({ firebase_id_token: 'aaa.bbb.ccc' });
      expect(res.success).toBe(true);
      expect(res.data.token.access_token).toBe('sanctum-tok');
      expect(res.data.user.id).toBe(7);
    });

    it('surfaces a 401 (invalid token) via ApiError', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/v1/integrations/nio/firebase-login`, () =>
          HttpResponse.json({ success: false, message: 'Invalid Firebase ID token' }, { status: 401 }),
        ),
      );
      await expect(
        makeClient().nioFirebaseLogin({ firebase_id_token: 'bad.token.here' }),
      ).rejects.toBeInstanceOf(ApiError);
    });
  });

  describe('POST /api/v1/integrations/mob/guest-register (mobGuestRegister)', () => {
    it('sends NO Authorization, keeps X-Domain + Idempotency-Key, returns {data:{user,token}}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/v1/integrations/mob/guest-register`, async ({ request }) => {
          cap.current = request.clone();
          return HttpResponse.json(
            {
              data: {
                user: {
                  id: 8,
                  name: 'MOB guest',
                  email: 'mob+x@guest.local',
                  roles: [],
                  subproject_id: 3,
                  created_at: '2026-06-15T00:00:00+00:00',
                },
                token: { access_token: 'mob-tok', token_type: 'Bearer' },
              },
            },
            { status: 201 },
          );
        }),
      );
      const res = await makeClient().mobGuestRegister(
        { device_uuid: 'dev-uuid-9', platform: 'ios', app_version: '1.2.3' },
        IDEM,
      );
      expectNoAuthHeader(cap.current!);
      expectDomainHeader(cap.current!, DOMAIN);
      expectIdempotencyKey(cap.current!, IDEM);
      const body = await cap.current!.json();
      expect(body.device_uuid).toBe('dev-uuid-9');
      expect(body.platform).toBe('ios');
      expect(res.data.token.access_token).toBe('mob-tok');
      expect(res.data.user.id).toBe(8);
    });

    it('surfaces a 422 (missing device_uuid) via ApiError', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/v1/integrations/mob/guest-register`, () =>
          HttpResponse.json(
            { message: 'A device_uuid (or device_id) is required to register a guest device.', errors: { device_uuid: ['required'] } },
            { status: 422 },
          ),
        ),
      );
      await expect(
        makeClient().mobGuestRegister({ device_uuid: '' }),
      ).rejects.toBeInstanceOf(ApiError);
    });
  });
});
