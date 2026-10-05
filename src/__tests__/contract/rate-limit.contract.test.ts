/**
 * Rate-limit contract for the SDK's core HTTP client (`BaseApiClient`).
 *
 * The api's refusal contract (CI-API anti-bulk-exfiltration plan C5 / §4):
 *
 *   429  { message, error: 'rate_limited', scope, limit, window, retry_after }
 *   503  { message, error: 'rate_limiter_unavailable', scope, retry_after }
 *
 * each with a `Retry-After` header (delta-seconds, or an HTTP-date) that the
 * api exposes through CORS so a cross-origin consumer can read it. Plan C10 /
 * WS8 for this repo: the thrown `ApiError` surfaces that number in a TYPED
 * field (`retryAfter`, seconds) so callers back off — and a 429 is never
 * something the SDK replays on its own (`isRetryableError` is false for every
 * 4xx; `useApi` is pinned separately in
 * `src/composables/__tests__/useApi.retry.test.ts`).
 */
import { describe, expect, it } from 'vitest';
import { HttpResponse } from 'msw';
import { BaseApiClient } from '../../api-client';
import { ApiError, getErrorMessage, isRetryableError } from '../../api/error-handling';
import { server } from '../msw/server';
import { mockEndpoint } from '../helpers/factories';

const BASE = 'https://api.test.local';

class TestClient extends BaseApiClient {
  public g = this.get.bind(this);
}

/** The api's 429 body, verbatim shape (RateLimitedException::toArray). */
const RATE_LIMITED_BODY = {
  message: 'Too Many Attempts.',
  error: 'rate_limited',
  scope: 'public-directory',
  limit: 120,
  window: 'minute',
  retry_after: 30,
};

/** The api's 503 shed body (RateLimitStoreUnavailableException::toArray). */
const STORE_UNAVAILABLE_BODY = {
  message: 'Rate limiter unavailable.',
  error: 'rate_limiter_unavailable',
  scope: 'daily_rows',
  retry_after: 30,
};

async function thrownBy(fn: () => Promise<unknown>): Promise<ApiError> {
  try {
    await fn();
  }
  catch (e) {
    return e as ApiError;
  }
  throw new Error('expected the call to throw');
}

function refuse(status: number, body: unknown, headers: Record<string, string> = {}) {
  return mockEndpoint('get', `${BASE}/api/public/subprojects`, () =>
    HttpResponse.json(body as any, { status, headers }));
}

describe('BaseApiClient — rate-limit contract (Retry-After on the thrown ApiError)', () => {
  it('429 + Retry-After: 30 → ApiError.retryAfter is 30 seconds, typed rateLimit from the body, never retryable', async () => {
    server.use(refuse(429, RATE_LIMITED_BODY, { 'Retry-After': '30' }));
    const err = await thrownBy(() => new TestClient({ baseURL: BASE }).g('/api/public/subprojects'));

    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(429);
    expect(err.isRateLimitError()).toBe(true);
    expect(err.retryAfter).toBe(30);
    expect(err.rateLimit).toEqual({
      retryAfter: 30,
      error: 'rate_limited',
      scope: 'public-directory',
      limit: 120,
      window: 'minute',
    });
    expect(err.message).toBe('Too Many Attempts.');
    expect(isRetryableError(err)).toBe(false);
  });

  it('429 + Retry-After as an HTTP-date → seconds until that instant', async () => {
    const date = new Date(Date.now() + 90_000).toUTCString(); // IMF-fixdate, second precision
    server.use(refuse(429, RATE_LIMITED_BODY, { 'Retry-After': date }));
    const err = await thrownBy(() => new TestClient({ baseURL: BASE }).g('/api/public/subprojects'));

    expect(err.status).toBe(429);
    // toUTCString() drops the milliseconds and the request takes time, so
    // the honest window is [88, 90] — the exact arithmetic is pinned with a
    // frozen `now` in src/api/__tests__/error-handling.retry-after.test.ts.
    expect(err.retryAfter).toBeGreaterThanOrEqual(88);
    expect(err.retryAfter).toBeLessThanOrEqual(90);
  });

  it('429 without a Retry-After header → the body\'s retry_after is the fallback', async () => {
    server.use(refuse(429, { ...RATE_LIMITED_BODY, retry_after: 7 }));
    const err = await thrownBy(() => new TestClient({ baseURL: BASE }).g('/api/public/subprojects'));

    expect(err.status).toBe(429);
    expect(err.retryAfter).toBe(7);
    expect(err.rateLimit?.retryAfter).toBe(7);
  });

  it('429 with neither header nor body number → retryAfter is null (never a guessed number)', async () => {
    server.use(refuse(429, { message: 'Too Many Attempts.' }));
    const err = await thrownBy(() => new TestClient({ baseURL: BASE }).g('/api/public/subprojects'));

    expect(err.status).toBe(429);
    expect(err.retryAfter).toBeNull();
    expect(err.rateLimit).toEqual({ retryAfter: null });
    expect(isRetryableError(err)).toBe(false);
  });

  it('503 shed + Retry-After: 30 → retryAfter 30, isServerError, STILL retryable (5xx), rateLimit names the outage', async () => {
    server.use(refuse(503, STORE_UNAVAILABLE_BODY, { 'Retry-After': '30' }));
    const err = await thrownBy(() => new TestClient({ baseURL: BASE }).g('/api/public/subprojects'));

    expect(err.status).toBe(503);
    expect(err.isServerError()).toBe(true);
    expect(err.isRateLimitError()).toBe(false);
    expect(err.retryAfter).toBe(30);
    expect(err.rateLimit).toEqual({
      retryAfter: 30,
      error: 'rate_limiter_unavailable',
      scope: 'daily_rows',
    });
    expect(isRetryableError(err)).toBe(true);
  });

  it('404 without Retry-After → retryAfter null, no rateLimit, not retryable', async () => {
    server.use(refuse(404, { success: false, message: 'Not found', data: null }));
    const err = await thrownBy(() => new TestClient({ baseURL: BASE }).g('/api/public/subprojects'));

    expect(err.status).toBe(404);
    expect(err.retryAfter).toBeNull();
    expect(err.rateLimit).toBeUndefined();
    expect(isRetryableError(err)).toBe(false);
  });

  it('500 without Retry-After → retryAfter null, retryable (5xx retry unchanged)', async () => {
    server.use(refuse(500, { success: false, message: 'boom', data: null }));
    const err = await thrownBy(() => new TestClient({ baseURL: BASE }).g('/api/public/subprojects'));

    expect(err.status).toBe(500);
    expect(err.retryAfter).toBeNull();
    expect(err.rateLimit).toBeUndefined();
    expect(isRetryableError(err)).toBe(true);
  });

  it('toJSON() carries retryAfter and still never the original response', async () => {
    server.use(refuse(429, RATE_LIMITED_BODY, { 'Retry-After': '30' }));
    const err = await thrownBy(() => new TestClient({ baseURL: BASE, getToken: () => 'secret-tok' }).g('/api/public/subprojects'));

    const json = JSON.parse(JSON.stringify(err));
    expect(json).toEqual({ name: 'ApiError', message: 'Too Many Attempts.', status: 429, retryAfter: 30 });
    expect(JSON.stringify(err)).not.toContain('secret-tok');
  });

  it('getErrorMessage() tells the caller how long to wait', async () => {
    server.use(refuse(429, RATE_LIMITED_BODY, { 'Retry-After': '30' }));
    const err = await thrownBy(() => new TestClient({ baseURL: BASE }).g('/api/public/subprojects'));

    expect(getErrorMessage(err)).toBe('Too many requests. Please try again in 30 seconds.');
  });

  it('a per-call validateStatus that accepts 429 keeps the escape hatch: no throw, the body comes back', async () => {
    server.use(refuse(429, RATE_LIMITED_BODY, { 'Retry-After': '30' }));
    const body = await new TestClient({ baseURL: BASE }).g<unknown>(
      '/api/public/subprojects',
      undefined,
      { validateStatus: s => s < 500 },
    );

    expect((body as any).error).toBe('rate_limited');
    expect((body as any).retry_after).toBe(30);
  });
});
