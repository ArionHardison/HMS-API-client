/**
 * Unit pins for the rate-limit helpers in `error-handling.ts` (plan C10 / WS8):
 * `parseRetryAfter` (delta-seconds AND HTTP-date, RFC 7231 §7.1.3),
 * `bodyRetryAfter`, `rateLimitInfoFrom`, `httpStatusOf`, `isRetryableError`,
 * the legacy axios construction path of `ApiError`, and the 429 wording of
 * `getErrorMessage`. The fetch pipeline is pinned end-to-end in
 * `src/__tests__/contract/rate-limit.contract.test.ts`.
 */
import { describe, expect, it } from 'vitest';
import {
  ApiError,
  bodyRetryAfter,
  getErrorMessage,
  httpStatusOf,
  isRetryableError,
  parseRetryAfter,
  processApiError,
  rateLimitInfoFrom,
} from '../error-handling';

const NOW = Date.parse('2026-10-05T13:00:00.000Z');

describe('parseRetryAfter', () => {
  it('reads delta-seconds verbatim', () => {
    expect(parseRetryAfter('30')).toBe(30);
    expect(parseRetryAfter(' 30 ')).toBe(30);
    expect(parseRetryAfter('0')).toBe(0);
    expect(parseRetryAfter('000120')).toBe(120);
  });

  it('turns an HTTP-date into whole seconds from `now`, rounding up', () => {
    expect(parseRetryAfter('Mon, 05 Oct 2026 13:01:30 GMT', NOW)).toBe(90);
    // 89.5 s away → the client must not come back early → 90.
    expect(parseRetryAfter('Mon, 05 Oct 2026 13:01:30 GMT', NOW + 500)).toBe(90);
    expect(parseRetryAfter('Mon, 05 Oct 2026 13:00:01 GMT', NOW)).toBe(1);
  });

  it('clamps an HTTP-date already in the past to 0 (retry now), never negative', () => {
    expect(parseRetryAfter('Mon, 05 Oct 2026 12:59:00 GMT', NOW)).toBe(0);
  });

  it('answers null for anything that is neither form — the caller falls back, never guesses', () => {
    expect(parseRetryAfter(null)).toBeNull();
    expect(parseRetryAfter(undefined)).toBeNull();
    expect(parseRetryAfter('')).toBeNull();
    expect(parseRetryAfter('   ')).toBeNull();
    expect(parseRetryAfter('abc')).toBeNull();
    expect(parseRetryAfter('soon')).toBeNull();
    expect(parseRetryAfter('1.5')).toBeNull();
    expect(parseRetryAfter('-5')).toBeNull();
    expect(parseRetryAfter('30s')).toBeNull();
    expect(parseRetryAfter('Not a date at all GMT')).toBeNull();
  });
});

describe('bodyRetryAfter', () => {
  it('reads the api\'s numeric retry_after and nothing else', () => {
    expect(bodyRetryAfter({ retry_after: 12 })).toBe(12);
    expect(bodyRetryAfter({ retry_after: 0 })).toBe(0);
    expect(bodyRetryAfter({ retry_after: '12' })).toBeNull();
    expect(bodyRetryAfter({ retry_after: -1 })).toBeNull();
    expect(bodyRetryAfter({ retry_after: Number.NaN })).toBeNull();
    expect(bodyRetryAfter({})).toBeNull();
    expect(bodyRetryAfter(null)).toBeNull();
    expect(bodyRetryAfter('text body')).toBeNull();
  });
});

describe('rateLimitInfoFrom', () => {
  it('types the 429 body', () => {
    expect(rateLimitInfoFrom(429, {
      message: 'Too Many Attempts.', error: 'rate_limited', scope: 'api', limit: 240, window: 'minute', retry_after: 30,
    }, 30)).toEqual({ retryAfter: 30, error: 'rate_limited', scope: 'api', limit: 240, window: 'minute' });
  });

  it('types the 503 shed body by its refusal word even though the status is not 429', () => {
    expect(rateLimitInfoFrom(503, { error: 'rate_limiter_unavailable', scope: 'daily_rows', retry_after: 30 }, 30))
      .toEqual({ retryAfter: 30, error: 'rate_limiter_unavailable', scope: 'daily_rows' });
  });

  it('is undefined for an ordinary error response', () => {
    expect(rateLimitInfoFrom(404, { message: 'Not found' }, null)).toBeUndefined();
    expect(rateLimitInfoFrom(500, 'Internal Server Error', null)).toBeUndefined();
    expect(rateLimitInfoFrom(503, { message: 'maintenance' }, 120)).toBeUndefined();
  });

  it('still answers for a 429 whose body is not JSON', () => {
    expect(rateLimitInfoFrom(429, '<html>Too Many Requests</html>', 5)).toEqual({ retryAfter: 5 });
  });
});

describe('ApiError — legacy axios construction path', () => {
  function axios429(headers: unknown) {
    return {
      isAxiosError: true,
      message: 'Request failed with status code 429',
      config: { url: '/api/public/subprojects', method: 'get', headers: { Authorization: 'Bearer secret-tok' } },
      response: {
        status: 429,
        statusText: 'Too Many Requests',
        headers,
        data: { message: 'Too Many Attempts.', error: 'rate_limited', scope: 'api', limit: 240, window: 'minute', retry_after: 12 },
      },
    } as any;
  }

  it('reads Retry-After from a plain lower-cased headers object', () => {
    const err = new ApiError(axios429({ 'retry-after': '12', 'x-ratelimit-limit': '240' }));
    expect(err.status).toBe(429);
    expect(err.isRateLimitError()).toBe(true);
    expect(err.retryAfter).toBe(12);
    expect(err.rateLimit).toEqual({ retryAfter: 12, error: 'rate_limited', scope: 'api', limit: 240, window: 'minute' });
  });

  it('reads Retry-After through an AxiosHeaders-style .get()', () => {
    const err = new ApiError(axios429({ get: (name: string) => (name === 'retry-after' ? '45' : null) }));
    expect(err.retryAfter).toBe(45);
  });

  it('reads a mixed-case header key', () => {
    const err = new ApiError(axios429({ 'Retry-After': '9' }));
    expect(err.retryAfter).toBe(9);
  });

  it('falls back to the body\'s retry_after when the header is missing', () => {
    const err = new ApiError(axios429({}));
    expect(err.retryAfter).toBe(12);
  });

  it('serializes retryAfter and never the bearer', () => {
    const err = new ApiError(axios429({ 'retry-after': '12' }));
    expect(JSON.parse(JSON.stringify(err))).toEqual({ name: 'ApiError', message: 'Too Many Attempts.', status: 429, retryAfter: 12 });
    expect(JSON.stringify(err)).not.toContain('secret-tok');
  });

  it('processApiError() keeps retryAfter for an axios error and answers null for a plain Error', () => {
    expect(processApiError(axios429({ 'retry-after': '12' })).retryAfter).toBe(12);
    const plain = processApiError(new TypeError('fetch failed'));
    expect(plain.status).toBe(0);
    expect(plain.retryAfter).toBeNull();
    expect(plain.rateLimit).toBeUndefined();
  });

  it('the modern init path defaults retryAfter to null', () => {
    expect(new ApiError({ status: 404, message: 'nope' }).retryAfter).toBeNull();
    expect(new ApiError({ status: 429, message: 'slow down', retryAfter: 3 }).retryAfter).toBe(3);
  });
});

describe('httpStatusOf / isRetryableError', () => {
  it('finds the status on every error shape the SDK throws', () => {
    expect(httpStatusOf(new ApiError({ status: 429, message: 'x' }))).toBe(429);
    expect(httpStatusOf({ isAxiosError: true, response: { status: 404 } })).toBe(404);
    expect(httpStatusOf({ isAxiosError: true, response: undefined })).toBeNull();
    expect(httpStatusOf(new ApiError({ status: 0, message: 'network' }))).toBeNull();
    expect(httpStatusOf(new TypeError('fetch failed'))).toBeNull();
    expect(httpStatusOf(null)).toBeNull();
    expect(httpStatusOf('nope')).toBeNull();
  });

  it('never retries a 4xx — 429 included — and keeps retrying 5xx and network failures', () => {
    for (const status of [400, 401, 403, 404, 409, 422, 423, 429]) {
      expect(isRetryableError(new ApiError({ status, message: `s${status}` }))).toBe(false);
    }
    for (const status of [500, 502, 503, 504]) {
      expect(isRetryableError(new ApiError({ status, message: `s${status}` }))).toBe(true);
    }
    expect(isRetryableError(new ApiError({ status: 0, message: 'network' }))).toBe(true);
    expect(isRetryableError(new TypeError('fetch failed'))).toBe(true);
    expect(isRetryableError({ isAxiosError: true, response: { status: 429 } })).toBe(false);
    expect(isRetryableError({ isAxiosError: true, response: { status: 502 } })).toBe(true);
    expect(isRetryableError({ isAxiosError: true, code: 'ECONNRESET' })).toBe(true);
  });
});

describe('getErrorMessage — 429 wording', () => {
  it('says how long to wait when the server said so', () => {
    expect(getErrorMessage(new ApiError({ status: 429, message: 'Too Many Attempts.', retryAfter: 30 })))
      .toBe('Too many requests. Please try again in 30 seconds.');
    expect(getErrorMessage(new ApiError({ status: 429, message: 'Too Many Attempts.', retryAfter: 1 })))
      .toBe('Too many requests. Please try again in 1 second.');
  });

  it('stays honest when it did not', () => {
    expect(getErrorMessage(new ApiError({ status: 429, message: 'Too Many Attempts.' })))
      .toBe('Too many requests. Please try again shortly.');
  });
});
