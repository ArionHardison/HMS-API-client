/**
 * Security-hardening regression tests.
 *
 * Pins the behavior added in the 2026-07 hardening pass so it cannot silently
 * regress:
 *   - baseURL https enforcement (assertSecureBaseURL)
 *   - retry only idempotent methods (isRetryableRequest)
 *   - request/response logging never emits the bearer token or credentials
 *   - ApiError never leaks the token via originalError / JSON.stringify
 */
import { describe, expect, it, vi, afterEach } from 'vitest';
import type { AxiosInstance, AxiosAdapter } from 'axios';
import {
  BaseApiClient,
  isRetryableRequest,
  type ApiClientConfig,
} from '../hms-api-client';
import { assertSecureBaseURL, isLocalHost } from '../url-safety';
import { ApiError } from '../error-handling';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../../stores/auth';

// Concrete subclass so we can exercise the protected axios instance directly.
class TestClient extends BaseApiClient {
  raw() {
    return (this as unknown as { client: AxiosInstance }).client;
  }
}

// A no-network axios adapter so the real request/response interceptors run.
function fakeAdapter(responseData: unknown, status = 200): AxiosAdapter {
  return async (config) => ({
    data: responseData,
    status,
    statusText: 'OK',
    headers: {},
    config,
  }) as any;
}

describe('assertSecureBaseURL', () => {
  it('allows https, empty/relative, and local hosts', () => {
    expect(() => assertSecureBaseURL('https://api.example.com')).not.toThrow();
    expect(() => assertSecureBaseURL('')).not.toThrow();
    expect(() => assertSecureBaseURL(undefined)).not.toThrow();
    expect(() => assertSecureBaseURL('http://localhost:8000/api')).not.toThrow();
    expect(() => assertSecureBaseURL('http://127.0.0.1:8000')).not.toThrow();
    expect(() => assertSecureBaseURL('http://api.test.local')).not.toThrow();
    expect(() => assertSecureBaseURL('http://192.168.1.10:3000')).not.toThrow();
  });

  it('throws for a non-local cleartext http baseURL', () => {
    expect(() => assertSecureBaseURL('http://api.example.com')).toThrow(/insecure baseURL/i);
    expect(() => assertSecureBaseURL('http://8.8.8.8')).toThrow(/insecure baseURL/i);
  });

  it('isLocalHost recognizes loopback, .local and RFC-1918', () => {
    expect(isLocalHost('localhost')).toBe(true);
    expect(isLocalHost('10.0.0.5')).toBe(true);
    expect(isLocalHost('172.16.0.1')).toBe(true);
    expect(isLocalHost('172.32.0.1')).toBe(false); // outside 16-31
    expect(isLocalHost('example.com')).toBe(false);
  });
});

describe('isRetryableRequest', () => {
  it('retries idempotent methods on 5xx / network error', () => {
    expect(isRetryableRequest('get', 500, false)).toBe(true);
    expect(isRetryableRequest('GET', undefined, false)).toBe(true); // network error
    expect(isRetryableRequest('delete', 503, false)).toBe(true);
    expect(isRetryableRequest('put', 502, false)).toBe(true);
  });

  it('never retries idempotent 4xx', () => {
    expect(isRetryableRequest('get', 400, false)).toBe(false);
    expect(isRetryableRequest('get', 401, false)).toBe(false);
    expect(isRetryableRequest('get', 429, false)).toBe(false);
  });

  it('does NOT retry non-idempotent POST/PATCH unless an Idempotency-Key is present', () => {
    expect(isRetryableRequest('post', 500, false)).toBe(false);
    expect(isRetryableRequest('patch', 503, false)).toBe(false);
    expect(isRetryableRequest('post', undefined, false)).toBe(false); // network error on POST
    expect(isRetryableRequest('post', 500, true)).toBe(true); // opt-in via Idempotency-Key
  });
});

describe('request/response logging redaction', () => {
  afterEach(() => vi.restoreAllMocks());

  it('never writes the bearer token or password to the console', async () => {
    // Enable logging (allowed because NODE_ENV is "test", not "production").
    const client = new TestClient({ baseURL: 'https://api.test.local', enableLogging: true } as ApiClientConfig);
    client.raw().defaults.adapter = fakeAdapter({ success: true, data: { token: 'SUPER_SECRET_TOKEN' } });

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await client.raw().post(
      '/auth/sign-in',
      { email: 'a@b.co', password: 'hunter2' },
      { headers: { Authorization: 'Bearer LEAKME_TOKEN' } },
    );

    const serialized = logSpy.mock.calls.map((c) => JSON.stringify(c)).join('\n');
    expect(logSpy).toHaveBeenCalled();
    expect(serialized).not.toContain('LEAKME_TOKEN');
    expect(serialized).not.toContain('hunter2');
    expect(serialized).not.toContain('SUPER_SECRET_TOKEN');
    expect(serialized).toContain('[redacted]'); // proves the log path ran + masked
  });

  it('is silent in production even when enableLogging is true', async () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      const client = new TestClient({ baseURL: 'https://api.test.local', enableLogging: true } as ApiClientConfig);
      client.raw().defaults.adapter = fakeAdapter({ success: true, data: {} });
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      await client.raw().get('/ping');
      expect(logSpy).not.toHaveBeenCalled();
    } finally {
      process.env.NODE_ENV = prev;
    }
  });
});

describe('ApiError credential safety', () => {
  it('sanitizes the axios originalError (no request headers) and JSON.stringify hides everything sensitive', () => {
    const fakeAxiosError = {
      isAxiosError: true,
      message: 'Request failed',
      config: { url: '/secure', method: 'get', headers: { Authorization: 'Bearer LEAKME' } },
      response: { status: 401, statusText: 'Unauthorized', data: { message: 'nope' } },
    } as unknown as import('axios').AxiosError;

    const err = new ApiError(fakeAxiosError);

    // originalError is a snapshot, not the live error — no headers retained.
    expect(err.originalError).not.toHaveProperty('config');
    expect(JSON.stringify(err.originalError)).not.toContain('LEAKME');

    // toJSON exposes only safe fields.
    const asJson = JSON.stringify(err);
    expect(asJson).not.toContain('LEAKME');
    expect(asJson).not.toContain('originalError');
    expect(JSON.parse(asJson)).toMatchObject({ name: 'ApiError', status: 401 });
  });
});

describe('auth store SSR safety', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('instantiates without a localStorage global (server context) instead of throwing', () => {
    vi.stubGlobal('localStorage', undefined);
    setActivePinia(createPinia());
    expect(() => useAuthStore()).not.toThrow();
  });
});
