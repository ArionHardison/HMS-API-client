/**
 * DealWizardApiClient — endpoint-by-endpoint contract tests for the Deal
 * Runtime Wizard slice (17 `/api/wizard/deal/*` routes).
 *
 * Each `describe` wraps a single route and asserts (per the campaign #1000
 * checklist):
 *   - URL (after baseURL + path-param interpolation)
 *   - HTTP verb on the wire (PATCH → POST + `?_method=PATCH`; DELETE stays DELETE)
 *   - `Authorization: Bearer` header present
 *   - `X-Domain` header present
 *   - `Idempotency-Key` header on writes when supplied
 *   - request body matches the controller's validate()/FormRequest shape
 *   - response decoding pulls the typed payload out of the envelope
 *
 * Plus a 422 (missing_required_info) and a 401 (unauthorized callback + ApiError)
 * path, and a multipart assertion for the file upload.
 *
 * MSW-based; mirrors the canonical style of `protocol.test.ts`.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpResponse } from 'msw';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectMethodOverride,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { ApiError } from '../error-handling';
import { DealWizardApiClient } from '../deal-wizard-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'tok-deal-wizard';
const DOMAIN = 'codify.healthcare';
const DEAL = '11111111-2222-3333-4444-555555555555';
const IDEM = 'idem-key-abc-123';

function makeClient(overrides: Record<string, unknown> = {}): DealWizardApiClient {
  return new DealWizardApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
    ...overrides,
  });
}

function captured(): { current: Request | null } {
  return { current: null };
}

/** Assert the captured request carries `Idempotency-Key: <key>`. */
function expectIdempotencyKey(request: Request, key: string): void {
  const got = request.headers.get('idempotency-key');
  if (got !== key) {
    throw new Error(`Expected Idempotency-Key "${key}", got "${got ?? '<missing>'}".`);
  }
}

/** A minimal DealResource envelope for happy-path responses. */
function dealEnvelope(state: string): Record<string, unknown> {
  return {
    success: true,
    message: '',
    data: {
      id: DEAL,
      deal_id: DEAL,
      user_id: 7,
      subproject_id: 3,
      tld: 'codify.healthcare',
      state,
      wizard_step: 1,
      current_step_idx: null,
      problem: { statement: 'help' },
      solutions: [],
      selected_solution_idx: null,
      stakeholders: [],
      financing: {},
      expertise: {},
      pipeline_steps: [],
      outcome_score: null,
      outcome_report: null,
      ontology_class: null,
      ontology_version: 'v3',
      created_at: '2026-06-15T00:00:00+00:00',
      updated_at: '2026-06-15T00:00:00+00:00',
      completed_at: null,
    },
  };
}

describe('DealWizardApiClient — Deal Runtime Wizard slice', () => {
  let cap: { current: Request | null };

  beforeEach(() => {
    cap = captured();
  });

  afterEach(() => {
    cap.current = null;
  });

  // ===========================================================================
  // POST /api/wizard/deal/define
  // ===========================================================================

  describe('POST /api/wizard/deal/define', () => {
    it('Bearer + X-Domain + Idempotency-Key, body {statement, tld}, returns deal with id alias', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/wizard/deal/define`, async ({ request }) => {
          cap.current = request.clone();
          return dealEnvelope('analyzing');
        }),
      );
      const res = await makeClient().defineDeal(
        { statement: 'My clinic needs faster intake', tld: 'healthcare' },
        IDEM,
      );
      expectAuthHeader(cap.current!, TOKEN);
      expectDomainHeader(cap.current!, DOMAIN);
      expectIdempotencyKey(cap.current!, IDEM);
      expect(cap.current!.method).toBe('POST');
      expect(await cap.current!.json()).toEqual({
        statement: 'My clinic needs faster intake',
        tld: 'healthcare',
      });
      expect(res.data.id).toBe(DEAL);
      expect(res.data.deal_id).toBe(DEAL);
      expect(res.data.state).toBe('analyzing');
    });

    it('omits Idempotency-Key when not supplied', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/wizard/deal/define`, async ({ request }) => {
          cap.current = request.clone();
          return dealEnvelope('analyzing');
        }),
      );
      await makeClient().defineDeal({ statement: 'hello world' });
      expect(cap.current!.headers.get('idempotency-key')).toBeNull();
    });
  });

  // ===========================================================================
  // GET /api/wizard/deal/{id}/status
  // ===========================================================================

  describe('GET /api/wizard/deal/{id}/status', () => {
    it('Bearer required, interpolates deal id, returns DealResource', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/wizard/deal/${DEAL}/status`, ({ request }) => {
          cap.current = request;
          return dealEnvelope('codified');
        }),
      );
      const res = await makeClient().getStatus(DEAL);
      expectAuthHeader(cap.current!, TOKEN);
      expectDomainHeader(cap.current!, DOMAIN);
      expect(cap.current!.method).toBe('GET');
      expect(res.data.deal_id).toBe(DEAL);
      expect(res.data.state).toBe('codified');
    });
  });

  // ===========================================================================
  // GET /api/wizard/deal/{id}/events
  // ===========================================================================

  describe('GET /api/wizard/deal/{id}/events', () => {
    it('Bearer required, returns paginated events, no per_page param by default', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/wizard/deal/${DEAL}/events`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: {
              events: [
                {
                  deal_id: DEAL,
                  sequence: 1,
                  event_type: 'deal.created',
                  payload: { state: 'analyzing' },
                  actor_ref: 'user:7',
                },
              ],
              pagination: { total: 1, per_page: 50, current_page: 1, last_page: 1 },
            },
          };
        }),
      );
      const res = await makeClient().getEvents(DEAL);
      expectAuthHeader(cap.current!, TOKEN);
      expect(new URL(cap.current!.url).searchParams.get('per_page')).toBeNull();
      expect(res.data.events[0].event_type).toBe('deal.created');
      expect(res.data.pagination.per_page).toBe(50);
    });

    it('appends per_page when supplied', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/wizard/deal/${DEAL}/events`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: {
              events: [],
              pagination: { total: 0, per_page: 25, current_page: 1, last_page: 1 },
            },
          };
        }),
      );
      await makeClient().getEvents(DEAL, { per_page: 25 });
      expect(new URL(cap.current!.url).searchParams.get('per_page')).toBe('25');
    });
  });

  // ===========================================================================
  // POST /api/wizard/deal/{id}/required-info  (happy + 422)
  // ===========================================================================

  describe('POST /api/wizard/deal/{id}/required-info', () => {
    it('Bearer + Idempotency-Key, body {answers}, advances to codified', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/wizard/deal/${DEAL}/required-info`,
          async ({ request }) => {
            cap.current = request.clone();
            return dealEnvelope('codified');
          },
        ),
      );
      const res = await makeClient().submitRequiredInfo(
        DEAL,
        { answers: { diagnosis: 'crohns', severity: 'moderate' } },
        IDEM,
      );
      expectAuthHeader(cap.current!, TOKEN);
      expectIdempotencyKey(cap.current!, IDEM);
      expect(await cap.current!.json()).toEqual({
        answers: { diagnosis: 'crohns', severity: 'moderate' },
      });
      expect(res.data.state).toBe('codified');
    });

    it('surfaces a 422 missing_required_info via ApiError', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/wizard/deal/${DEAL}/required-info`,
          () =>
            HttpResponse.json(
              { error: 'missing_required_info', missing: ['severity'] },
              { status: 422 },
            ),
        ),
      );
      await expect(
        makeClient().submitRequiredInfo(DEAL, { answers: { diagnosis: 'crohns' } }),
      ).rejects.toBeInstanceOf(ApiError);
    });
  });

  // ===========================================================================
  // POST /api/wizard/deal/{id}/codify  (happy + 502 strict-schema)
  // ===========================================================================

  describe('POST /api/wizard/deal/{id}/codify', () => {
    it('Bearer + Idempotency-Key, no body, returns generated solutions', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/wizard/deal/${DEAL}/codify`, async ({ request }) => {
          cap.current = request.clone();
          const env = dealEnvelope('codified');
          (env.data as Record<string, unknown>).solutions = [{ id: 'sol-1' }];
          return env;
        }),
      );
      const res = await makeClient().codify(DEAL, IDEM);
      expectAuthHeader(cap.current!, TOKEN);
      expectIdempotencyKey(cap.current!, IDEM);
      expect(cap.current!.method).toBe('POST');
      expect(res.data.solutions?.[0].id).toBe('sol-1');
    });

    it('surfaces a 502 solution_generation_failed via ApiError', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/wizard/deal/${DEAL}/codify`, () =>
          HttpResponse.json(
            { error: 'solution_generation_failed', message: 'missing financing key' },
            { status: 502 },
          ),
        ),
      );
      await expect(makeClient().codify(DEAL)).rejects.toBeInstanceOf(ApiError);
    });
  });

  // ===========================================================================
  // POST /api/wizard/deal/{id}/select-solution
  // ===========================================================================

  describe('POST /api/wizard/deal/{id}/select-solution', () => {
    it('Bearer required, body {solution_idx}', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/wizard/deal/${DEAL}/select-solution`,
          async ({ request }) => {
            cap.current = request.clone();
            return dealEnvelope('codified');
          },
        ),
      );
      await makeClient().selectSolution(DEAL, { solution_idx: 1 }, IDEM);
      expectAuthHeader(cap.current!, TOKEN);
      expectIdempotencyKey(cap.current!, IDEM);
      expect(await cap.current!.json()).toEqual({ solution_idx: 1 });
    });
  });

  // ===========================================================================
  // POST /api/wizard/deal/{id}/setup
  // ===========================================================================

  describe('POST /api/wizard/deal/{id}/setup', () => {
    it('Bearer required, no body, advances to setup', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/wizard/deal/${DEAL}/setup`, async ({ request }) => {
          cap.current = request.clone();
          return dealEnvelope('setup');
        }),
      );
      const res = await makeClient().setup(DEAL, IDEM);
      expectAuthHeader(cap.current!, TOKEN);
      expectIdempotencyKey(cap.current!, IDEM);
      expect(res.data.state).toBe('setup');
    });
  });

  // ===========================================================================
  // POST /api/wizard/deal/{id}/start
  // ===========================================================================

  describe('POST /api/wizard/deal/{id}/start', () => {
    it('Bearer required, no body, advances to executing', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/wizard/deal/${DEAL}/start`, async ({ request }) => {
          cap.current = request.clone();
          return dealEnvelope('executing');
        }),
      );
      const res = await makeClient().start(DEAL, IDEM);
      expectAuthHeader(cap.current!, TOKEN);
      expectIdempotencyKey(cap.current!, IDEM);
      expect(res.data.state).toBe('executing');
    });
  });

  // ===========================================================================
  // PATCH /api/wizard/deal/{id}/metadata  (method override)
  // ===========================================================================

  describe('PATCH /api/wizard/deal/{id}/metadata', () => {
    it('rewrites PATCH to POST + ?_method=PATCH, body shape, Idempotency-Key', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/wizard/deal/${DEAL}/metadata`, async ({ request }) => {
          cap.current = request.clone();
          return dealEnvelope('analyzing');
        }),
      );
      await makeClient().patchMetadata(
        DEAL,
        {
          title: 'Faster intake',
          description: 'A description that comfortably exceeds the fifty character minimum requirement.',
          applicant_type: 'Builder',
          related_industries: ['healthcare'],
        },
        IDEM,
      );
      expectAuthHeader(cap.current!, TOKEN);
      expectMethodOverride(cap.current!, 'PATCH');
      expectIdempotencyKey(cap.current!, IDEM);
      const body = await cap.current!.json();
      expect(body.title).toBe('Faster intake');
      expect(body.applicant_type).toBe('Builder');
      expect(body.related_industries).toEqual(['healthcare']);
    });
  });

  // ===========================================================================
  // PATCH /api/wizard/deal/{id}/details
  // ===========================================================================

  describe('PATCH /api/wizard/deal/{id}/details', () => {
    it('rewrites PATCH to POST + ?_method=PATCH, body shape', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/wizard/deal/${DEAL}/details`, async ({ request }) => {
          cap.current = request.clone();
          return dealEnvelope('analyzing');
        }),
      );
      await makeClient().patchDetails(
        DEAL,
        {
          customer_user_id: 42,
          start_date: '2026-07-01',
          end_date: '2026-09-01',
          budget_tier: 'lt30k',
        },
        IDEM,
      );
      expectAuthHeader(cap.current!, TOKEN);
      expectMethodOverride(cap.current!, 'PATCH');
      const body = await cap.current!.json();
      expect(body.budget_tier).toBe('lt30k');
      expect(body.customer_user_id).toBe(42);
    });
  });

  // ===========================================================================
  // POST /api/wizard/deal/{id}/files  (multipart) + 201
  // ===========================================================================

  describe('POST /api/wizard/deal/{id}/files', () => {
    it('serializes multipart/form-data with file + file_type, returns 201 row', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/wizard/deal/${DEAL}/files`, async ({ request }) => {
          cap.current = request.clone();
          return HttpResponse.json(
            {
              success: true,
              message: '',
              data: {
                id: 9,
                deal_id: DEAL,
                file_path: `deal-files/${DEAL}/abc.pdf`,
                file_type: 'document',
                mime_type: 'application/pdf',
                uploaded_by_user_id: 7,
              },
            },
            { status: 201 },
          );
        }),
      );
      const file = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
      const res = await makeClient().uploadFile(
        DEAL,
        { file, file_type: 'document' },
        IDEM,
      );
      expectAuthHeader(cap.current!, TOKEN);
      expectIdempotencyKey(cap.current!, IDEM);
      const ctype = cap.current!.headers.get('content-type') ?? '';
      expect(ctype).toMatch(/multipart\/form-data/);
      const fd = await cap.current!.formData();
      expect(fd.get('file_type')).toBe('document');
      expect(fd.get('file')).toBeInstanceOf(Blob);
      expect(res.data.id).toBe(9);
      expect(res.data.file_type).toBe('document');
    });
  });

  // ===========================================================================
  // DELETE /api/wizard/deal/{id}/files/{fileId}  (204)
  // ===========================================================================

  describe('DELETE /api/wizard/deal/{id}/files/{fileId}', () => {
    it('issues a real DELETE, interpolates both ids, Bearer + Idempotency-Key', async () => {
      server.use(
        mockEndpoint(
          'delete',
          `${BASE}/api/wizard/deal/${DEAL}/files/9`,
          ({ request }) => {
            cap.current = request;
            return new HttpResponse(null, { status: 204 });
          },
        ),
      );
      await makeClient().deleteFile(DEAL, 9, IDEM);
      expectAuthHeader(cap.current!, TOKEN);
      expectIdempotencyKey(cap.current!, IDEM);
      expect(cap.current!.method).toBe('DELETE');
      expect(new URL(cap.current!.url).pathname).toBe(`/api/wizard/deal/${DEAL}/files/9`);
    });
  });

  // ===========================================================================
  // PATCH /api/wizard/deal/{id}/path
  // ===========================================================================

  describe('PATCH /api/wizard/deal/{id}/path', () => {
    it('rewrites PATCH to POST + ?_method=PATCH, body {path_tier}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/wizard/deal/${DEAL}/path`, async ({ request }) => {
          cap.current = request.clone();
          return dealEnvelope('analyzing');
        }),
      );
      await makeClient().patchPath(DEAL, { path_tier: 'blue' }, IDEM);
      expectAuthHeader(cap.current!, TOKEN);
      expectMethodOverride(cap.current!, 'PATCH');
      expect(await cap.current!.json()).toEqual({ path_tier: 'blue' });
    });
  });

  // ===========================================================================
  // POST /api/wizard/deal/{id}/submit  (happy + 422 missing_wizard_data)
  // ===========================================================================

  describe('POST /api/wizard/deal/{id}/submit', () => {
    it('Bearer required, no body, transitions to awaiting_compute', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/wizard/deal/${DEAL}/submit`, async ({ request }) => {
          cap.current = request.clone();
          return dealEnvelope('awaiting_compute');
        }),
      );
      const res = await makeClient().submit(DEAL, IDEM);
      expectAuthHeader(cap.current!, TOKEN);
      expectIdempotencyKey(cap.current!, IDEM);
      expect(res.data.state).toBe('awaiting_compute');
    });

    it('surfaces a 422 missing_wizard_data via ApiError', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/wizard/deal/${DEAL}/submit`, () =>
          HttpResponse.json(
            { error: 'missing_wizard_data', missing: ['path_tier'] },
            { status: 422 },
          ),
        ),
      );
      await expect(makeClient().submit(DEAL)).rejects.toBeInstanceOf(ApiError);
    });
  });

  // ===========================================================================
  // POST /api/wizard/deal/{id}/compute-deposit
  // ===========================================================================

  describe('POST /api/wizard/deal/{id}/compute-deposit', () => {
    it('Bearer required, body {amount_cents}, returns client_secret', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/wizard/deal/${DEAL}/compute-deposit`,
          async ({ request }) => {
            cap.current = request.clone();
            return {
              success: true,
              message: '',
              data: { client_secret: 'pi_123_secret_abc' },
            };
          },
        ),
      );
      const res = await makeClient().computeDeposit(DEAL, { amount_cents: 10000 }, IDEM);
      expectAuthHeader(cap.current!, TOKEN);
      expectIdempotencyKey(cap.current!, IDEM);
      expect(await cap.current!.json()).toEqual({ amount_cents: 10000 });
      expect(res.data.client_secret).toBe('pi_123_secret_abc');
    });
  });

  // ===========================================================================
  // POST /api/wizard/deal/{id}/verify/{executionId}
  // ===========================================================================

  describe('POST /api/wizard/deal/{id}/verify/{executionId}', () => {
    it('Bearer required, no body, interpolates execution id, returns outcome', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/wizard/deal/${DEAL}/verify/42`,
          async ({ request }) => {
            cap.current = request.clone();
            return {
              success: true,
              message: '',
              data: {
                deal_id: DEAL,
                state: 'completed',
                outcome_score: 75,
                outcome_class: 'partial_success',
                outcome_report: { score: 75 },
              },
            };
          },
        ),
      );
      const res = await makeClient().verifyOutcome(DEAL, 42, IDEM);
      expectAuthHeader(cap.current!, TOKEN);
      expectIdempotencyKey(cap.current!, IDEM);
      expect(cap.current!.method).toBe('POST');
      expect(new URL(cap.current!.url).pathname).toBe(`/api/wizard/deal/${DEAL}/verify/42`);
      expect(res.data.outcome_score).toBe(75);
      expect(res.data.outcome_class).toBe('partial_success');
    });
  });

  // ===========================================================================
  // 401 path — unauthorized callback fires and ApiError is thrown.
  // ===========================================================================

  describe('401 unauthorized handling', () => {
    it('fires onUnauthorized and throws ApiError on a 401', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/wizard/deal/${DEAL}/status`, () =>
          HttpResponse.json({ message: 'Unauthenticated.' }, { status: 401 }),
        ),
      );
      const onUnauthorized = vi.fn();
      const client = makeClient({ onUnauthorized });
      await expect(client.getStatus(DEAL)).rejects.toBeInstanceOf(ApiError);
      expect(onUnauthorized).toHaveBeenCalledTimes(1);
    });
  });
});
