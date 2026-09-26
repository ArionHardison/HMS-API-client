/**
 * Step 5 (Verify Outcome) — route contract.
 *
 * The api grades a deal at `POST /api/wizard/deal/{deal_id}/verify/{execution_id}`
 * (DealVerificationController::verify) and returns the report directly. The
 * SDK used to post to `/wizard/deal/{deal}/step/verify_outcome`, a route that
 * does not exist, so Step 5 was unreachable from every SDK caller.
 */
import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../msw/server';
import { WizardApiClient, PayoutStatus, type VerifyOutcomeInput } from '../../api/wizard-api-client';

const BASE = 'https://api.test.local/api';

// No browser globals are shimmed: the legacy hms-api-client interceptor now
// guards its localStorage read, so the SDK runs under node as documented.

const input = (executionId?: number | string): VerifyOutcomeInput => ({
  execution_id: executionId,
  outcome: { verified: true, metrics: {} },
  payout_status: PayoutStatus.PENDING,
});

describe('WizardApiClient.verifyOutcome — Step 5 route', () => {
  it('posts to /wizard/deal/{deal}/verify/{execution} with no body and returns the report as-is', async () => {
    let seen: { url: string; body: string } | null = null;
    server.use(
      http.post(`${BASE}/wizard/deal/:dealId/verify/:executionId`, async ({ request, params }) => {
        seen = { url: request.url, body: await request.text() };
        return HttpResponse.json({
          deal_id: params.dealId,
          state: 'completed',
          outcome_score: 75,
          outcome_class: 'partial_success',
          outcome_report: { steps: 3 },
        });
      }),
    );
    const client = new WizardApiClient({ baseURL: BASE, getToken: () => 'test-token' });
    const res = await client.verifyOutcome('deal-42', input(7));
    expect(seen).not.toBeNull();
    expect(seen!.url).toBe(`${BASE}/wizard/deal/deal-42/verify/7`);
    expect(seen!.body).toBe('');
    expect(res.data.outcome_score).toBe(75);
    expect(res.data.outcome_class).toBe('partial_success');
    expect(res.data.deal_id).toBe('deal-42');
  });

  it('refuses to call the api without an execution_id — the only route needs one', async () => {
    const client = new WizardApiClient({ baseURL: BASE, getToken: () => 'test-token' });
    await expect(client.verifyOutcome('deal-42', input(undefined))).rejects.toThrow(/execution_id/);
    await expect(client.verifyOutcome('deal-42', input(''))).rejects.toThrow(/execution_id/);
  });

  it('verifyOutcomeStep verifies then re-reads the deal into the step-executor shape', async () => {
    server.use(
      http.post(`${BASE}/wizard/deal/:dealId/verify/:executionId`, () =>
        HttpResponse.json({ deal_id: 'deal-42', state: 'completed', outcome_score: 90, outcome_class: 'success', outcome_report: {} }),
      ),
      http.get(`${BASE}/wizard/deal/:dealId`, () =>
        HttpResponse.json({ success: true, message: '', data: { id: 'deal-42', state: 'completed' } }),
      ),
    );
    const client = new WizardApiClient({ baseURL: BASE, getToken: () => 'test-token' });
    const res = await client.verifyOutcomeStep('deal-42', input(7));
    expect(res.data.data.is_async).toBe(false);
    expect(res.data.data.success).toBe(true);
    expect(res.data.data.message).toBe('success');
    expect((res.data.data.deal as any).id).toBe('deal-42');
  });
});
