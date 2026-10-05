/**
 * `useApi` retry contract (anti-bulk-exfiltration plan C10 / WS8 'sdk'):
 *
 *   - a 4xx is NEVER retried — a 429 least of all: replaying it at
 *     `retryDelay * (n + 1)` ms lands inside the server's `Retry-After`
 *     window and extends the refusal. Before this pin `executeWithRetry`
 *     retried ANY error while `retry > 0`.
 *   - a 5xx and a network failure keep the retry ladder exactly as before;
 *   - the 429's `Retry-After` reaches the caller: `state.retryAfter` and
 *     `rawError.retryAfter` (seconds), so the CALLER schedules the retry.
 *
 * Also pins the notifications store's `apiError()` on the composable's
 * DEFAULT error path (`showErrorNotification: true`): its parameter used to
 * be named `error`, shadowing the store's own `error()` — every failed call
 * died with `TypeError: error is not a function` instead of toasting.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { ApiError } from '../../api/error-handling';
import { useNotificationStore } from '../../stores/notifications';
import { useApi } from '../useApi';

const OK = { data: { success: true, message: '', data: { ok: true } } };

function apiErrorOf(status: number, opts: { retryAfter?: number | null; message?: string } = {}): ApiError {
  return new ApiError({
    status,
    message: opts.message ?? `HTTP error ${status}`,
    retryAfter: opts.retryAfter ?? null,
  });
}

/** An axios-shaped 429, the way the legacy axios clients reject. */
function axios429(): unknown {
  return {
    isAxiosError: true,
    message: 'Request failed with status code 429',
    config: { url: '/api/x', method: 'get', headers: {} },
    response: {
      status: 429,
      statusText: 'Too Many Requests',
      headers: { 'retry-after': '12' },
      data: { message: 'Too Many Attempts.', error: 'rate_limited', scope: 'api', limit: 240, window: 'minute', retry_after: 12 },
    },
  };
}

let warn: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  setActivePinia(createPinia());
  // `useApi` registers `onUnmounted` — outside a component Vue warns once per
  // call. Silence it so the output stays readable; nothing else warns here.
  warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  warn.mockRestore();
});

describe('useApi — executeWithRetry never retries a 4xx', () => {
  it('a 429 is called exactly once even with retry: 3, and its Retry-After reaches the caller', async () => {
    const apiFn = vi.fn().mockRejectedValue(apiErrorOf(429, { retryAfter: 30, message: 'Too Many Attempts.' }));
    const api = useApi(apiFn, { retry: 3, retryDelay: 0, showErrorNotification: false });

    await expect(api.execute('page-1')).resolves.toBeNull();

    expect(apiFn).toHaveBeenCalledTimes(1);
    expect(api.state.value.retryAfter).toBe(30);
    expect(api.state.value.rawError).toBeInstanceOf(ApiError);
    expect(api.state.value.rawError.retryAfter).toBe(30);
    expect(api.state.value.rawError.isRateLimitError()).toBe(true);
    expect(api.state.value.error).toBe('Too many requests. Please try again in 30 seconds.');
    expect(api.state.value.success).toBe(false);
    expect(api.state.value.loading).toBe(false);
  });

  it.each([400, 401, 403, 404, 409, 422, 423])('a %i is never retried', async (status) => {
    const apiFn = vi.fn().mockRejectedValue(apiErrorOf(status));
    const api = useApi(apiFn, { retry: 3, retryDelay: 0, showErrorNotification: false });

    await expect(api.execute(status)).resolves.toBeNull();

    expect(apiFn).toHaveBeenCalledTimes(1);
    expect(api.state.value.rawError.status).toBe(status);
    expect(api.state.value.retryAfter).toBeNull();
  });

  it('an axios-shaped 429 (legacy clients) is not retried either, and its header is read', async () => {
    const apiFn = vi.fn().mockRejectedValue(axios429());
    const api = useApi(apiFn, { retry: 2, retryDelay: 0, showErrorNotification: false });

    await expect(api.execute('axios')).resolves.toBeNull();

    expect(apiFn).toHaveBeenCalledTimes(1);
    expect(api.state.value.retryAfter).toBe(12);
    expect(api.state.value.rawError.rateLimit?.scope).toBe('api');
  });

  it('throwOnError: true rethrows the ApiError carrying retryAfter — still one call', async () => {
    const apiFn = vi.fn().mockRejectedValue(apiErrorOf(429, { retryAfter: 30 }));
    const api = useApi(apiFn, { retry: 3, retryDelay: 0, throwOnError: true, showErrorNotification: false });

    await expect(api.execute('throw')).rejects.toMatchObject({ status: 429, retryAfter: 30 });
    expect(apiFn).toHaveBeenCalledTimes(1);
  });
});

describe('useApi — the 5xx / network retry ladder is unchanged', () => {
  it('a 5xx is replayed `retry` times, then the failure is reported', async () => {
    const apiFn = vi.fn().mockRejectedValue(apiErrorOf(500, { message: 'boom' }));
    const api = useApi(apiFn, { retry: 2, retryDelay: 0, showErrorNotification: false });

    await expect(api.execute('5xx')).resolves.toBeNull();

    expect(apiFn).toHaveBeenCalledTimes(3); // 1 + 2 retries
    expect(api.state.value.rawError.status).toBe(500);
    expect(api.state.value.error).toBe('A server error occurred. Please try again later.');
    expect(api.state.value.retryAfter).toBeNull();
  });

  it('a 5xx that recovers resolves with the data', async () => {
    const apiFn = vi.fn()
      .mockRejectedValueOnce(apiErrorOf(503))
      .mockResolvedValueOnce(OK);
    const api = useApi<{ ok: boolean }>(apiFn, { retry: 3, retryDelay: 0, showErrorNotification: false });

    await expect(api.execute('recover')).resolves.toEqual({ ok: true });

    expect(apiFn).toHaveBeenCalledTimes(2);
    expect(api.state.value.data).toEqual({ ok: true });
    expect(api.state.value.success).toBe(true);
    expect(api.state.value.error).toBeNull();
    expect(api.state.value.retryAfter).toBeNull();
  });

  it('a 503 shed with Retry-After is still replayed (5xx) and, when it keeps refusing, the wait is surfaced', async () => {
    const apiFn = vi.fn().mockRejectedValue(apiErrorOf(503, { retryAfter: 30, message: 'Rate limiter unavailable.' }));
    const api = useApi(apiFn, { retry: 1, retryDelay: 0, showErrorNotification: false });

    await expect(api.execute('shed')).resolves.toBeNull();

    expect(apiFn).toHaveBeenCalledTimes(2);
    expect(api.state.value.retryAfter).toBe(30);
  });

  it('a network failure (no HTTP status) is replayed', async () => {
    const apiFn = vi.fn()
      .mockRejectedValueOnce(new TypeError('fetch failed'))
      .mockResolvedValueOnce(OK);
    const api = useApi(apiFn, { retry: 3, retryDelay: 0, showErrorNotification: false });

    await expect(api.execute('network')).resolves.toEqual({ ok: true });
    expect(apiFn).toHaveBeenCalledTimes(2);
  });

  it('retry: 0 (the default) never replays anything', async () => {
    const apiFn = vi.fn().mockRejectedValue(apiErrorOf(502));
    const api = useApi(apiFn, { showErrorNotification: false });

    await expect(api.execute('no-retry')).resolves.toBeNull();
    expect(apiFn).toHaveBeenCalledTimes(1);
  });

  it('the linear retryDelay ladder is honoured between 5xx replays', async () => {
    const apiFn = vi.fn().mockRejectedValue(apiErrorOf(500));
    const api = useApi(apiFn, { retry: 2, retryDelay: 20, showErrorNotification: false });

    const started = performance.now();
    await api.execute('delay');
    const elapsed = performance.now() - started;

    expect(apiFn).toHaveBeenCalledTimes(3);
    // 20 ms + 40 ms of waits; a lower bound only, so a slow runner cannot flake it.
    expect(elapsed).toBeGreaterThanOrEqual(50);
  });
});

describe('useApi — default options toast the failure (notifications store apiError)', () => {
  it('a refused call reaches the notification store instead of dying in the catch block', async () => {
    const apiFn = vi.fn().mockRejectedValue(apiErrorOf(429, { retryAfter: 30, message: 'Too Many Attempts.' }));
    const api = useApi(apiFn); // showErrorNotification defaults to true

    await expect(api.execute('toast')).resolves.toBeNull();

    const store = useNotificationStore();
    expect(store.notifications).toHaveLength(1);
    expect(store.notifications[0]).toMatchObject({
      type: 'error',
      title: 'Error',
      message: 'Too Many Attempts.',
      group: 'api-error',
      persistent: true,
    });
    expect(store.notifications[0].data?.error).toBeInstanceOf(ApiError);
    expect(apiFn).toHaveBeenCalledTimes(1);
  });
});
