/**
 * Endpoint coverage for `RlhfApiClient` (`Modules/RLHF`, prefix /api/v1/rlhf).
 *
 * 3 routes from `Modules/RLHF/Routes/api.php`:
 *   POST /api/v1/rlhf/submissions                          (rlhf:writer)
 *   POST /api/v1/rlhf/grades/{course_id}/{assignment_id}   (rlhf:writer)
 *   GET  /api/v1/rlhf/rubrics/{question_id}                (rlhf:reader)
 *
 * Every controller proxies the body verbatim upstream and passes through the
 * upstream status + body. The two writes carry IdempotencyMiddleware.
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
import { RlhfApiClient } from '../rlhf-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'rlhf-tkn-1';
const DOMAIN = 'rl.tlnt.ai';
const IDEM = 'idem-rlhf-0001';

interface Captured {
  current: Request | null;
}

function expectIdempotencyKey(request: Request, key: string): void {
  const got = request.headers.get('idempotency-key');
  if (got !== key) {
    throw new Error(`Expected Idempotency-Key "${key}", got "${got ?? '<missing>'}".`);
  }
}

function makeClient(overrides?: { onUnauthorized?: () => void }): RlhfApiClient {
  return new RlhfApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
    ...overrides,
  });
}

describe('RlhfApiClient — Modules/RLHF', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  it('submit() — POST /api/v1/rlhf/submissions, body + Bearer + Idempotency-Key', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/v1/rlhf/submissions`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { submission_id: 99 } };
      }),
    );
    const body = { assignment_id: 7, files: ['a.pdf'] };
    const res = await makeClient().submit(body, IDEM);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expectIdempotencyKey(captured.current!, IDEM);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data).toEqual({ submission_id: 99 });
  });

  it('submit() — omits Idempotency-Key when not supplied', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/v1/rlhf/submissions`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: {} };
      }),
    );
    await makeClient().submit({ x: 1 });
    expect(captured.current!.headers.get('idempotency-key')).toBeNull();
  });

  it('grade() — POST /api/v1/rlhf/grades/{course}/{assignment}, interpolates both ids', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/v1/rlhf/grades/12/34`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { graded: true } };
      }),
    );
    const body = { score: 0.9 };
    const res = await makeClient().grade(12, 34, body, IDEM);
    expect(new URL(captured.current!.url).pathname).toBe('/api/v1/rlhf/grades/12/34');
    expectAuthHeader(captured.current!, TOKEN);
    expectIdempotencyKey(captured.current!, IDEM);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data).toEqual({ graded: true });
  });

  it('getRubric() — GET /api/v1/rlhf/rubrics/{question_id}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/v1/rlhf/rubrics/55`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { items: [] } };
      }),
    );
    const res = await makeClient().getRubric(55);
    expect(captured.current!.method).toBe('GET');
    expect(new URL(captured.current!.url).pathname).toBe('/api/v1/rlhf/rubrics/55');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual({ items: [] });
  });

  it('surfaces a 422 via ApiError', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/v1/rlhf/submissions`, () =>
        HttpResponse.json({ message: 'Invalid', errors: { files: ['required'] } }, { status: 422 }),
      ),
    );
    await expect(makeClient().submit({})).rejects.toBeInstanceOf(ApiError);
  });

  it('fires onUnauthorized and throws ApiError on a 401', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/v1/rlhf/rubrics/55`, () =>
        HttpResponse.json({ message: 'Unauthenticated.' }, { status: 401 }),
      ),
    );
    const onUnauthorized = vi.fn();
    const client = makeClient({ onUnauthorized });
    await expect(client.getRubric(55)).rejects.toBeInstanceOf(ApiError);
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });
});
