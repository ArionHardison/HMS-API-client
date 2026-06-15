/**
 * Endpoint coverage for `LmsApiClient` (`Modules/Lms`,
 * prefix /api/v1/integrations/lms).
 *
 * 1 route from `Modules/Lms/Routes/api.php` (202):
 *   POST /api/v1/integrations/lms/grading   (lms:writer + idempotency)
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpResponse } from 'msw';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { ApiError } from '../error-handling';
import { LmsApiClient } from '../lms-api-client';
import type { LmsGradingResponse } from '../lms-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'lms-tkn-1';
const DOMAIN = 'codify.education';
const IDEM = 'idem-lms-0001';

interface Captured {
  current: Request | null;
}

function expectIdempotencyKey(request: Request, key: string): void {
  const got = request.headers.get('idempotency-key');
  if (got !== key) {
    throw new Error(`Expected Idempotency-Key "${key}", got "${got ?? '<missing>'}".`);
  }
}

function makeClient(overrides?: { onUnauthorized?: () => void }): LmsApiClient {
  return new LmsApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
    ...overrides,
  });
}

describe('LmsApiClient — Modules/Lms', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  it('submitGrading() — POST /grading, body + Bearer + X-Domain + Idempotency-Key, 202', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/v1/integrations/lms/grading`, async ({ request }) => {
        captured.current = request.clone();
        return HttpResponse.json(
          { status: 'accepted', reward_id: 11, rollout_id: 22 },
          { status: 202 },
        );
      }),
    );
    const body = {
      external_enrollment_id: 'enr-1',
      user_id: 7,
      course_id: 3,
      score: 0.95,
      completed_at: '2026-06-15T00:00:00Z',
      certificate_url: 'https://x/cert.pdf',
    };
    const res = (await makeClient().submitGrading(
      body,
      IDEM,
    )) as unknown as LmsGradingResponse;
    expect(captured.current!.method).toBe('POST');
    expect(new URL(captured.current!.url).pathname).toBe('/api/v1/integrations/lms/grading');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expectIdempotencyKey(captured.current!, IDEM);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.status).toBe('accepted');
    expect(res.reward_id).toBe(11);
  });

  it('submitGrading() — replay returns status "replayed"', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/v1/integrations/lms/grading`, ({ request }) => {
        captured.current = request;
        return HttpResponse.json(
          { status: 'replayed', reward_id: 11, rollout_id: 22 },
          { status: 202 },
        );
      }),
    );
    const res = (await makeClient().submitGrading(
      {
        external_enrollment_id: 'enr-1',
        user_id: 7,
        course_id: 3,
        score: 0.95,
        completed_at: '2026-06-15T00:00:00Z',
      },
      IDEM,
    )) as unknown as LmsGradingResponse;
    expect(res.status).toBe('replayed');
  });

  it('surfaces a 422 (score out of range) via ApiError', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/v1/integrations/lms/grading`, () =>
        HttpResponse.json({ message: 'Invalid', errors: { score: ['between'] } }, { status: 422 }),
      ),
    );
    await expect(
      makeClient().submitGrading({
        external_enrollment_id: 'enr-1',
        user_id: 7,
        course_id: 3,
        score: 5,
        completed_at: '2026-06-15T00:00:00Z',
      }),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it('fires onUnauthorized and throws ApiError on a 401', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/v1/integrations/lms/grading`, () =>
        HttpResponse.json({ message: 'Unauthenticated.' }, { status: 401 }),
      ),
    );
    const onUnauthorized = vi.fn();
    const client = makeClient({ onUnauthorized });
    await expect(
      client.submitGrading({
        external_enrollment_id: 'enr-1',
        user_id: 7,
        course_id: 3,
        score: 0.5,
        completed_at: '2026-06-15T00:00:00Z',
      }),
    ).rejects.toBeInstanceOf(ApiError);
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });
});
