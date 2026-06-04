/**
 * `WizardApiClient.defineDeal()` — contract pin for the YCaaS apex chat
 * deal-creation entry point. Wraps the canonical Deals-module endpoint
 * `POST /api/wizard/deal/define` (DealWizardController::define), which
 * runs LLM classification + required_info computation and delegates to
 * `DealOrchestrator::createDeal()`.
 *
 * The endpoint already exists on the backend; this test pins the wire
 * shape so sys/ can consume it without surprise. See
 * `api/docs/CHAT_DEAL_WIRE.md` for the multi-session plan.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import { mockEndpoint } from '../../__tests__/helpers/factories';
import { WizardApiClient } from '../wizard-api-client';

// WizardApiClient extends the HMS-style BaseApiClient whose axios
// request interceptor reads `localStorage.getItem('auth_token')` —
// bare reference, no typeof guard. In the Node test env localStorage
// is undefined; stub it (returning null so no Authorization header
// gets set) so the interceptor doesn't crash with ReferenceError.
beforeAll(() => {
  if (typeof (globalThis as { localStorage?: unknown }).localStorage === 'undefined') {
    (globalThis as { localStorage: { getItem: (k: string) => string | null } }).localStorage = {
      getItem: () => null,
    };
  }
});

const BASE = 'https://api.test.local';
const TOKEN = 'wiz-tok-define';
const DOMAIN = 'ycaas.ai';

function makeClient(): WizardApiClient {
  return new WizardApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('WizardApiClient.defineDeal() — POST /api/wizard/deal/define', () => {
  it('hits the canonical Deals-module endpoint with the locked payload', async () => {
    let captured: Request | null = null;
    let body: unknown = null;
    server.use(
      mockEndpoint('post', `${BASE}/wizard/deal/define`, async ({ request }) => {
        captured = request.clone();
        body = await request.json();
        return {
          success: true,
          message: '',
          data: {
            id: '9c7e6f2a-3b11-4e8a-9a4c-d1f2c5b8e9a1',
            problem: 'I need to set up payroll for my accounting firm',
            category: 'accounting',
            wizard_step: 'define_problem',
          },
        };
      }),
    );

    const res = await makeClient().defineDeal({
      statement: 'I need to set up payroll for my accounting firm',
      tld: 'accountants',
    });

    expect(captured!.method).toBe('POST');
    expect(body).toEqual({
      statement: 'I need to set up payroll for my accounting firm',
      tld: 'accountants',
    });
    expect(res.data.data?.id).toBe('9c7e6f2a-3b11-4e8a-9a4c-d1f2c5b8e9a1');
  });

  it('accepts an explicit subproject_id and partial problem override', async () => {
    let body: unknown = null;
    server.use(
      mockEndpoint('post', `${BASE}/wizard/deal/define`, async ({ request }) => {
        body = await request.json();
        return {
          success: true,
          message: '',
          data: { id: 'd-2', problem: 'p', category: 'c', wizard_step: 'define_problem' },
        };
      }),
    );

    await makeClient().defineDeal({
      statement: 'Tax planning for my LLC',
      tld: 'codify.tax',
      subproject_id: 42,
      problem: { intent_slug: 'tax.llc_quarterly' },
    });

    expect(body).toEqual({
      statement: 'Tax planning for my LLC',
      tld: 'codify.tax',
      subproject_id: 42,
      problem: { intent_slug: 'tax.llc_quarterly' },
    });
  });
});
