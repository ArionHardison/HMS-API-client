/**
 * Cross-cutting contract tests for the SDK's core HTTP client (`BaseApiClient`
 * from `src/api-client.ts`). These tests pin the *wire format* the four
 * frontends (CI-WWW, sys, gov, app) expect — not the implementation. Any
 * client refactor must keep them green.
 *
 * The contract items covered here are enumerated in the SDK CLAUDE.md
 * "HTTP layer contract" / "Frontend integration map" sections. One
 * `describe` per item, one or more tests per describe.
 *
 * NOTE: every endpoint registered via `mockEndpoint` is captured into a
 * `lastRequest` ref so the test body can run synchronous header / form
 * assertions after `await`-ing the SDK call. MSW v2's `http.*` resolvers
 * receive a real `Request`, so these helpers are just thin wrappers.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpResponse } from 'msw';
import { BaseApiClient } from '../../api-client';
import { ApiError } from '../../api/error-handling';
import { server } from '../msw/server';
import {
  mockEndpoint,
  expectAuthHeader,
  expectNoAuthHeader,
  expectDomainHeader,
  expectNoDomainHeader,
  expectMethodOverride,
  expectFormDataField,
} from '../helpers/factories';

const BASE = 'https://api.test.local';

/**
 * Tiny harness that exposes the protected `request` / `get` / `post` /
 * `put` / `patch` / `delete` of `BaseApiClient` as public for testing.
 */
class TestClient extends BaseApiClient {
  public req = this.request.bind(this);
  public g = this.get.bind(this);
  public p = this.post.bind(this);
  public pu = this.put.bind(this);
  public pa = (this as any).patch?.bind(this);
  public d = this.delete.bind(this);
}

/** Capture the last MSW-intercepted request for assertions. */
function captureRequest(): { current: Request | null } {
  return { current: null };
}

describe('BaseApiClient — contract', () => {
  let captured: { current: Request | null };

  beforeEach(() => {
    captured = captureRequest();
  });

  // ---------------------------------------------------------------------------
  // Auth header injection
  // ---------------------------------------------------------------------------
  describe('Authorization header', () => {
    it('injects Bearer token from getToken when present', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/things`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      const client = new TestClient({
        baseURL: BASE,
        getToken: () => 'tkn-abc',
      });
      await client.g('/things');
      expectAuthHeader(captured.current!, 'tkn-abc');
    });

    it('omits Authorization when getToken returns null', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/things`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      const client = new TestClient({ baseURL: BASE, getToken: () => null });
      await client.g('/things');
      expectNoAuthHeader(captured.current!);
    });

    it('omits Authorization when getToken returns undefined', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/things`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      const client = new TestClient({
        baseURL: BASE,
        getToken: () => undefined,
      });
      await client.g('/things');
      expectNoAuthHeader(captured.current!);
    });
  });

  // ---------------------------------------------------------------------------
  // X-Domain header injection
  // ---------------------------------------------------------------------------
  describe('X-Domain header', () => {
    it('injects X-Domain from getDomain when present', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/x`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      const client = new TestClient({
        baseURL: BASE,
        getDomain: () => 'phm.ai',
      });
      await client.g('/x');
      expectDomainHeader(captured.current!, 'phm.ai');
    });

    it('omits X-Domain when getDomain returns null (does NOT default to localhost)', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/x`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      const client = new TestClient({
        baseURL: BASE,
        getDomain: () => null,
      });
      await client.g('/x');
      expectNoDomainHeader(captured.current!);
    });

    it('omits X-Domain entirely when no getDomain is configured', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/x`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      const client = new TestClient({ baseURL: BASE });
      await client.g('/x');
      expectNoDomainHeader(captured.current!);
    });
  });

  // ---------------------------------------------------------------------------
  // PUT / PATCH method override (Laravel convention)
  // ---------------------------------------------------------------------------
  describe('PUT/PATCH method override', () => {
    it('rewrites PUT as POST with ?_method=PUT and preserves body', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/items/7`, async ({ request }) => {
          captured.current = request.clone();
          // Drain body before responding for assertion below.
          await request.clone().json();
          return { success: true, message: '', data: null };
        }),
      );
      const client = new TestClient({ baseURL: BASE });
      await client.pu('/items/7', { name: 'updated' });
      expectMethodOverride(captured.current!, 'PUT');
      const body = await captured.current!.json();
      expect(body).toEqual({ name: 'updated' });
    });

    it('rewrites PATCH as POST with ?_method=PATCH and preserves body', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/items/7`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: null };
        }),
      );
      const client = new TestClient({ baseURL: BASE });
      // patch() may not be on the existing client; the new contract requires it.
      await (client as any).pa('/items/7', { name: 'patched' });
      expectMethodOverride(captured.current!, 'PATCH');
      const body = await captured.current!.json();
      expect(body).toEqual({ name: 'patched' });
    });
  });

  // ---------------------------------------------------------------------------
  // Real DELETE — no method rewriting
  // ---------------------------------------------------------------------------
  describe('DELETE', () => {
    it('issues a real DELETE (no _method param)', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/items/9`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      const client = new TestClient({ baseURL: BASE });
      await client.d('/items/9');
      expect(captured.current!.method).toBe('DELETE');
      const url = new URL(captured.current!.url);
      expect(url.searchParams.get('_method')).toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // FormData / multipart serialization (when payload contains File/Blob)
  // ---------------------------------------------------------------------------
  describe('multipart serialization', () => {
    it('switches to multipart/form-data when payload contains a Blob', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/upload`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { ok: true } };
        }),
      );
      const client = new TestClient({ baseURL: BASE });
      const blob = new Blob(['hello'], { type: 'text/plain' });
      await client.p('/upload', { name: 'note', file: blob });
      const ctype = captured.current!.headers.get('content-type') ?? '';
      expect(ctype).toMatch(/multipart\/form-data/);
      await expectFormDataField(captured.current!, 'name', 'note');
    });

    it('serializes nested arrays as field[i][nested]=value', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/upload`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: null };
        }),
      );
      const client = new TestClient({ baseURL: BASE });
      const blob = new Blob(['x'], { type: 'text/plain' });
      await client.p('/upload', {
        attachment: blob,
        items: [{ nested: 'a' }, { nested: 'b' }],
      });
      const fd = await captured.current!.formData();
      expect(fd.get('items[0][nested]')).toBe('a');
      expect(fd.get('items[1][nested]')).toBe('b');
    });
  });

  // ---------------------------------------------------------------------------
  // 422 → ApiError with validationErrors + onValidationError callback
  // ---------------------------------------------------------------------------
  describe('422 validation errors', () => {
    it('throws ApiError with .validationErrors and invokes callback once', async () => {
      const onValidationError = vi.fn();
      server.use(
        mockEndpoint('post', `${BASE}/things`, () =>
          HttpResponse.json(
            {
              success: false,
              message: 'Validation failed',
              data: {
                errors: {
                  email: ['email is required', 'must be valid'],
                  name: ['too short'],
                },
              },
            },
            { status: 422 },
          ),
        ),
      );
      const client = new TestClient({ baseURL: BASE, onValidationError });
      await expect(client.p('/things', {})).rejects.toBeInstanceOf(ApiError);
      let thrown: ApiError | null = null;
      try {
        await client.p('/things', {});
      }
      catch (e) {
        thrown = e as ApiError;
      }
      expect(thrown).toBeInstanceOf(ApiError);
      expect(thrown!.status).toBe(422);
      expect(thrown!.validationErrors).toEqual({
        email: ['email is required', 'must be valid'],
        name: ['too short'],
      });
      // Two calls were made (the first .rejects + the second await),
      // so the callback should have fired twice across them but exactly
      // once per failing call. Reset and try once.
      onValidationError.mockClear();
      await client.p('/things', {}).catch(() => {});
      expect(onValidationError).toHaveBeenCalledTimes(1);
      expect(onValidationError).toHaveBeenCalledWith({
        email: ['email is required', 'must be valid'],
        name: ['too short'],
      });
    });
  });

  // ---------------------------------------------------------------------------
  // 401 → onUnauthorized callback, no window navigation
  // ---------------------------------------------------------------------------
  describe('401 unauthorized', () => {
    it('throws ApiError, invokes onUnauthorized once, never calls window.location.assign', async () => {
      const onUnauthorized = vi.fn();
      const assignSpy = vi.fn();
      // Stub out window.location.assign to detect the SDK accidentally
      // navigating.
      const origLocation = (globalThis as any).window?.location;
      if (typeof (globalThis as any).window === 'undefined') {
        (globalThis as any).window = { location: { assign: assignSpy } };
      }
      else {
        (globalThis as any).window.location = { assign: assignSpy } as any;
      }
      try {
        server.use(
          mockEndpoint('get', `${BASE}/me`, () =>
            HttpResponse.json(
              { success: false, message: 'unauthenticated', data: null },
              { status: 401 },
            ),
          ),
        );
        const client = new TestClient({ baseURL: BASE, onUnauthorized });
        await expect(client.g('/me')).rejects.toBeInstanceOf(ApiError);
        expect(onUnauthorized).toHaveBeenCalledTimes(1);
        expect(assignSpy).not.toHaveBeenCalled();
      }
      finally {
        if (origLocation === undefined) {
          delete (globalThis as any).window;
        }
        else {
          (globalThis as any).window.location = origLocation;
        }
      }
    });
  });

  // ---------------------------------------------------------------------------
  // 403 / 404 / 423 / 5xx → ApiError predicates
  // ---------------------------------------------------------------------------
  describe('error predicates', () => {
    const cases: Array<{ status: number; predicate: keyof ApiError }> = [
      { status: 403, predicate: 'isForbiddenError' },
      { status: 404, predicate: 'isNotFoundError' },
      { status: 423, predicate: 'isLockedError' },
      { status: 500, predicate: 'isServerError' },
      { status: 503, predicate: 'isServerError' },
    ];

    for (const { status, predicate } of cases) {
      it(`status ${status} → ApiError.${String(predicate)}() returns true`, async () => {
        server.use(
          mockEndpoint('get', `${BASE}/oops`, () =>
            HttpResponse.json(
              { success: false, message: `status ${status}`, data: null },
              { status },
            ),
          ),
        );
        const client = new TestClient({ baseURL: BASE });
        let thrown: ApiError | null = null;
        try {
          await client.g('/oops');
        }
        catch (e) {
          thrown = e as ApiError;
        }
        expect(thrown).toBeInstanceOf(ApiError);
        expect(thrown!.status).toBe(status);
        // Cast: the predicate is always a fn on ApiError.
        expect((thrown as any)[predicate]()).toBe(true);
      });
    }
  });

  // ---------------------------------------------------------------------------
  // Per-call `auth: false` option
  // ---------------------------------------------------------------------------
  describe('auth: false per-call', () => {
    it('omits Authorization even when getToken returns a token', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/public/auth/sign-in`, ({ request }) => {
          captured.current = request;
          return {
            success: true,
            message: '',
            data: { token: 't', user: {}, expiresAt: '' },
          };
        }),
      );
      const client = new TestClient({
        baseURL: BASE,
        getToken: () => 'should-not-be-sent',
      });
      await client.req(
        '/public/auth/sign-in',
        { method: 'POST', body: JSON.stringify({ email: 'e', password: 'p' }) },
        { auth: false },
      );
      expectNoAuthHeader(captured.current!);
    });
  });

  // ---------------------------------------------------------------------------
  // validateStatus — 404 from /api/load shouldn't throw if caller opts in
  // ---------------------------------------------------------------------------
  describe('validateStatus per-call', () => {
    it('does not throw on a 404 when validateStatus returns true', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/load`, () =>
          HttpResponse.json(
            { success: false, message: 'not found', data: null },
            { status: 404 },
          ),
        ),
      );
      const client = new TestClient({ baseURL: BASE });
      const res = await client.req(
        '/api/load',
        { method: 'GET' },
        { validateStatus: () => true },
      );
      expect(res).toBeDefined();
      // res should be the parsed envelope, status preserved through the chain.
      expect((res as any).success).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // safe: true → return null on network failure (CI-WWW contract)
  // ---------------------------------------------------------------------------
  describe('safe: true on network failure', () => {
    it('returns null when fetch rejects and safe is set', async () => {
      const failingFetch = vi.fn(async () => {
        throw new TypeError('network down');
      });
      const client = new TestClient({
        baseURL: BASE,
        fetch: failingFetch as any,
      });
      const res = await client.req('/anything', { method: 'GET' }, { safe: true });
      expect(res).toBeNull();
      expect(failingFetch).toHaveBeenCalled();
    });

    it('throws when fetch rejects and safe is not set', async () => {
      const failingFetch = vi.fn(async () => {
        throw new TypeError('network down');
      });
      const client = new TestClient({
        baseURL: BASE,
        fetch: failingFetch as any,
      });
      await expect(client.req('/anything', { method: 'GET' })).rejects.toBeTruthy();
    });
  });

  // ---------------------------------------------------------------------------
  // Default baseURL resolution
  //
  // CI-HUB / YCaaS consumes the SDK from the browser at ycaas.ai (and
  // *.ycaas.ai) without configuring `baseURL`. Same-origin requests are
  // proxied by Vercel `vercel.json` rewrites to https://codify.inc/api/*.
  // When the SDK is instantiated with no baseURL the resolution order is:
  //
  //   1. globalThis.window?.location?.origin  (browser / happy-dom / jsdom)
  //   2. 'https://api.project20x.com'          (Node / SSR fallback)
  //
  // Resolution is lazy (per request) so the SSR safety contract is preserved
  // — the constructor must not read `window`. An explicit `baseURL` always
  // wins.
  // ---------------------------------------------------------------------------
  describe('Default baseURL resolution', () => {
    it('uses window.location.origin when window is present and no baseURL is configured', async () => {
      const originalWindow = (globalThis as any).window;
      (globalThis as any).window = { location: { origin: 'https://ycaas.ai' } };
      try {
        server.use(
          mockEndpoint('get', 'https://ycaas.ai/api/things', ({ request }) => {
            captured.current = request;
            return { success: true, message: '', data: [] };
          }),
        );
        const client = new TestClient({} as any);
        await client.g('/api/things');
        expect(captured.current).not.toBeNull();
        expect(captured.current!.url).toBe('https://ycaas.ai/api/things');
      }
      finally {
        if (originalWindow === undefined) delete (globalThis as any).window;
        else (globalThis as any).window = originalWindow;
      }
    });

    it('falls back to https://api.project20x.com when window is absent (SSR/Node)', async () => {
      const originalWindow = (globalThis as any).window;
      delete (globalThis as any).window;
      try {
        server.use(
          mockEndpoint('get', 'https://api.project20x.com/api/load', ({ request }) => {
            captured.current = request;
            return { success: true, message: '', data: {} };
          }),
        );
        const client = new TestClient({} as any);
        await client.g('/api/load');
        expect(captured.current).not.toBeNull();
        expect(captured.current!.url).toBe('https://api.project20x.com/api/load');
      }
      finally {
        if (originalWindow !== undefined) (globalThis as any).window = originalWindow;
      }
    });

    it('honors an explicit baseURL even when window is present', async () => {
      const originalWindow = (globalThis as any).window;
      (globalThis as any).window = { location: { origin: 'https://wrong.example' } };
      try {
        server.use(
          mockEndpoint('get', 'https://api.codify.inc/api/load', ({ request }) => {
            captured.current = request;
            return { success: true, message: '', data: {} };
          }),
        );
        const client = new TestClient({ baseURL: 'https://api.codify.inc' });
        await client.g('/api/load');
        expect(captured.current).not.toBeNull();
        expect(captured.current!.url).toBe('https://api.codify.inc/api/load');
      }
      finally {
        if (originalWindow === undefined) delete (globalThis as any).window;
        else (globalThis as any).window = originalWindow;
      }
    });
  });

  // ---------------------------------------------------------------------------
  // SSR / Node safety: instantiation must not touch browser globals
  // ---------------------------------------------------------------------------
  describe('SSR safety', () => {
    it('does not touch window / localStorage / document during construction', () => {
      const originals = {
        window: (globalThis as any).window,
        localStorage: (globalThis as any).localStorage,
        document: (globalThis as any).document,
      };
      // Strip browser globals.
      delete (globalThis as any).window;
      delete (globalThis as any).localStorage;
      delete (globalThis as any).document;
      try {
        // Should NOT throw — the SDK must be instantiable in pure Node.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const client = new BaseApiClient({ baseURL: BASE });
        expect(client).toBeInstanceOf(BaseApiClient);
      }
      finally {
        if (originals.window !== undefined) (globalThis as any).window = originals.window;
        if (originals.localStorage !== undefined) (globalThis as any).localStorage = originals.localStorage;
        if (originals.document !== undefined) (globalThis as any).document = originals.document;
      }
    });
  });

  afterEach(() => {
    captured.current = null;
  });
});
