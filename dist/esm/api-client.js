/**
 * SDK core HTTP client (fetch-based).
 *
 * This module is the foundation that the four frontends — CI-WWW, sys, gov,
 * app — depend on. Behavior is locked by the cross-cutting contract suite at
 * `src/__tests__/contract/base-client.contract.test.ts` — read those tests
 * first if you're tempted to "just tweak" the request flow.
 *
 * Key invariants (see contract tests for the full spec):
 *
 *   - Auth header injection is opt-in via `getToken`. No browser globals are
 *     touched at construction time so the SDK is SSR-safe.
 *   - `X-Domain` header injection is opt-in via `getDomain` and never
 *     defaults to `localhost`.
 *   - PUT/PATCH are sent as POST + `?_method=PUT|PATCH` (Laravel convention).
 *     DELETE stays a real DELETE.
 *   - Payloads carrying a `File`/`Blob` switch to `multipart/form-data` and
 *     serialize nested arrays as `field[i][nested]=value`.
 *   - 401 / 422 dispatch to `onUnauthorized` / `onValidationError` callbacks
 *     and throw a normalized `ApiError`. The SDK NEVER navigates the browser.
 *   - Per-call options: `auth: false` (skip Authorization), `safe: true`
 *     (return null on network failure), `validateStatus` (custom non-throw
 *     ranges), `signal` (AbortController support).
 *
 * The legacy `BaseApiClient` API surface (`get` / `post` / `put` / `delete`
 * + the `protected request()` escape hatch) is preserved so existing
 * subclasses keep working. New behavior is additive.
 */
import { ApiError } from './api/error-handling';
import { assertSecureBaseURL } from './api/url-safety';
// =============================================================================
// BaseApiClient
// =============================================================================
/**
 * Base API Client class that handles common functionality using fetch.
 *
 * Constructor & public methods are stable — the contract suite + every
 * downstream module rely on them. Behavior is opted into via `ApiClientConfig`
 * fields; if none are set, the client falls back to legacy semantics
 * (read auth token from localStorage iff `window` exists; dispatch
 * `auth:unauthorized` on 401).
 */
/**
 * Default base URL when no `baseURL` is configured.
 *
 * In a browser context (real or simulated via happy-dom/jsdom) the SDK uses
 * the current page origin, which keeps requests same-origin so cookies and
 * Vercel `vercel.json` rewrites both work without CORS. In Node / SSR there
 * is no window, so the canonical API host `https://api.project20x.com` is
 * used — a reachable, TLS-terminated origin that serves `/api/*`. (The old
 * `https://codify.inc` fallback did NOT serve the API and broke SSR callers
 * such as gov; an explicit `baseURL` still always wins.)
 *
 * Resolution is lazy / per-request so the SSR safety contract is preserved.
 */
function resolveDefaultBaseURL() {
    const w = globalThis.window;
    const origin = w?.location?.origin;
    if (typeof origin === 'string' && origin.length > 0)
        return origin;
    return 'https://api.project20x.com';
}
export class BaseApiClient {
    constructor(config) {
        // Refuse a cleartext non-local baseURL (token would travel over http).
        // String-only check — touches no browser globals, so SSR-safe.
        assertSecureBaseURL(config.baseURL);
        this.config = config;
        // Stored verbatim — empty/undefined means "resolve per-request" (see
        // `resolveDefaultBaseURL`). We do NOT eager-resolve here because the
        // SSR safety contract forbids touching `window` during construction.
        this.baseURL = config.baseURL ?? '';
        this.timeout = config.timeout || 30000;
        this.withCredentials = config.withCredentials || false;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...config.headers,
        };
        // Critical: do NOT touch window / localStorage / document here. The SSR
        // safety contract test stubs all three to `undefined` and instantiates.
    }
    // ---------------------------------------------------------------------------
    // Internal helpers — all the "interesting" logic lives here so the per-verb
    // wrappers below stay one-liners.
    // ---------------------------------------------------------------------------
    /** Resolve the auth token using injected `getToken`, falling back to localStorage iff window exists. */
    resolveToken() {
        if (this.config.getToken) {
            const t = this.config.getToken();
            return t == null ? null : t;
        }
        // Legacy fallback only kicks in when no getter was injected.
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            try {
                return localStorage.getItem('auth_token');
            }
            catch {
                return null;
            }
        }
        return null;
    }
    /** Resolve the `X-Domain` value. Null/undefined = omit. Never defaults. */
    resolveDomain() {
        if (!this.config.getDomain)
            return null;
        const d = this.config.getDomain();
        return d == null ? null : d;
    }
    /** True if the payload contains any `File` / `Blob` (recursively). */
    hasBinary(value) {
        if (value == null)
            return false;
        if (typeof Blob !== 'undefined' && value instanceof Blob)
            return true;
        if (typeof File !== 'undefined' && value instanceof File)
            return true;
        if (Array.isArray(value))
            return value.some(v => this.hasBinary(v));
        if (typeof value === 'object') {
            return Object.values(value).some(v => this.hasBinary(v));
        }
        return false;
    }
    /**
     * Recursively serialize an object into FormData using Laravel's
     * `field[0][nested]=value` bracket notation. Booleans become `'1'`/`'0'`.
     */
    toFormData(payload) {
        const fd = new FormData();
        const append = (key, value) => {
            if (value === null || value === undefined)
                return;
            if (value instanceof Blob) {
                // File extends Blob; FormData picks up the filename automatically.
                fd.append(key, value);
                return;
            }
            if (Array.isArray(value)) {
                value.forEach((v, i) => append(`${key}[${i}]`, v));
                return;
            }
            if (typeof value === 'object') {
                for (const [k, v] of Object.entries(value)) {
                    append(`${key}[${k}]`, v);
                }
                return;
            }
            if (typeof value === 'boolean') {
                fd.append(key, value ? '1' : '0');
                return;
            }
            fd.append(key, String(value));
        };
        for (const [k, v] of Object.entries(payload))
            append(k, v);
        return fd;
    }
    /**
     * Core dispatch. Handles header injection, method override, body
     * serialization, status validation, and ApiError normalization.
     *
     * `RequestInit` is honored as-is so subclasses can pass cookies / mode /
     * etc. through if they need to.
     */
    async request(endpoint, init = {}, opts = {}) {
        // ---- URL + method override -------------------------------------------
        const base = this.baseURL || resolveDefaultBaseURL();
        let url = `${base}${endpoint}`;
        let method = (init.method || 'GET').toUpperCase();
        let body = init.body;
        if (method === 'PUT' || method === 'PATCH') {
            // Laravel HTTP-verb-override convention.
            const sep = url.includes('?') ? '&' : '?';
            url = `${url}${sep}_method=${method}`;
            method = 'POST';
        }
        // ---- Header assembly --------------------------------------------------
        // Per-call `opts.headers` (e.g. Idempotency-Key) win over both the
        // default headers and any method-derived `init.headers`.
        const headers = {
            ...this.defaultHeaders,
            ...(init.headers || {}),
            ...(opts.headers || {}),
        };
        // Authorization (unless explicitly opted out).
        if (opts.auth !== false) {
            const token = this.resolveToken();
            if (token)
                headers.Authorization = `Bearer ${token}`;
        }
        // Tenant header.
        const domain = this.resolveDomain();
        if (domain)
            headers['X-Domain'] = domain;
        // If the body is FormData, drop Content-Type so the runtime sets the
        // correct multipart boundary.
        if (body instanceof FormData) {
            delete headers['Content-Type'];
        }
        // ---- Timeout / abort wiring ------------------------------------------
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        // Forward an externally provided signal.
        if (opts.signal) {
            if (opts.signal.aborted)
                controller.abort();
            else
                opts.signal.addEventListener('abort', () => controller.abort(), { once: true });
        }
        const fetchImpl = this.config.fetch ?? fetch;
        const validateStatus = opts.validateStatus ?? ((s) => s >= 200 && s < 300);
        let response;
        try {
            response = await fetchImpl(url, {
                ...init,
                method,
                headers,
                body,
                credentials: this.withCredentials ? 'include' : 'omit',
                signal: controller.signal,
            });
        }
        catch (err) {
            clearTimeout(timeoutId);
            if (opts.safe) {
                // CI-WWW contract: network failure resolves to null when opted in.
                return null;
            }
            throw err;
        }
        clearTimeout(timeoutId);
        // ---- Response parsing -------------------------------------------------
        // Some endpoints return empty bodies (204, etc). Guard against parse failure.
        const ctype = response.headers.get('content-type') ?? '';
        let parsed = null;
        if (ctype.includes('application/json')) {
            try {
                parsed = await response.json();
            }
            catch {
                parsed = null;
            }
        }
        else {
            // Non-JSON: read as text but don't fail.
            try {
                parsed = await response.text();
            }
            catch {
                parsed = null;
            }
        }
        // ---- 401 → unauthorized callback -------------------------------------
        if (response.status === 401) {
            if (this.config.onUnauthorized) {
                this.config.onUnauthorized();
            }
            else if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
                // Backwards compat: legacy frontends listen for this event.
                try {
                    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
                }
                catch {
                    // SSR or environments without CustomEvent — silently ignore.
                }
            }
        }
        // ---- 422 → validation callback ---------------------------------------
        if (response.status === 422) {
            const v = this.extractValidationErrors(parsed);
            if (v && this.config.onValidationError) {
                this.config.onValidationError(v);
            }
        }
        // ---- Status validation -----------------------------------------------
        if (!validateStatus(response.status)) {
            const message = (parsed && typeof parsed === 'object' && parsed.message)
                || `HTTP error ${response.status}`;
            const validationErrors = this.extractValidationErrors(parsed);
            throw new ApiError({
                status: response.status,
                message,
                data: parsed && typeof parsed === 'object' ? parsed.data : parsed,
                validationErrors,
                originalError: response,
            });
        }
        return parsed;
    }
    /** Pull `{ field: string[] }` out of either Laravel-default or legacy nested envelope. */
    extractValidationErrors(parsed) {
        if (!parsed || typeof parsed !== 'object')
            return undefined;
        const wrapped = parsed?.data?.errors;
        const topLevel = parsed?.errors;
        const v = wrapped ?? topLevel;
        if (v && typeof v === 'object')
            return v;
        return undefined;
    }
    /**
     * Build the request body + headers based on the supplied data. Used by
     * post/put/patch verb wrappers. Returns `{ body, isMultipart }`.
     */
    serializeBody(data) {
        if (data === undefined || data === null)
            return { body: undefined, isMultipart: false };
        // FormData passes through verbatim.
        if (typeof FormData !== 'undefined' && data instanceof FormData) {
            return { body: data, isMultipart: true };
        }
        // Object payload with a binary somewhere → switch to multipart.
        if (typeof data === 'object' && this.hasBinary(data)) {
            return { body: this.toFormData(data), isMultipart: true };
        }
        return { body: JSON.stringify(data), isMultipart: false };
    }
    // ---------------------------------------------------------------------------
    // Verb wrappers — public-ish (subclasses use these). Signatures kept
    // backward-compatible with the original fetch client.
    // ---------------------------------------------------------------------------
    async get(endpoint, params, opts) {
        let url = endpoint;
        if (params) {
            const searchParams = new URLSearchParams();
            for (const [key, value] of Object.entries(params)) {
                if (value !== undefined && value !== null)
                    searchParams.append(key, String(value));
            }
            const paramString = searchParams.toString();
            if (paramString)
                url += (url.includes('?') ? '&' : '?') + paramString;
        }
        return this.request(url, { method: 'GET' }, opts);
    }
    async post(endpoint, data, opts) {
        const { body } = this.serializeBody(data);
        return this.request(endpoint, { method: 'POST', body }, opts);
    }
    async put(endpoint, data, opts) {
        const { body } = this.serializeBody(data);
        return this.request(endpoint, { method: 'PUT', body }, opts);
    }
    async patch(endpoint, data, opts) {
        const { body } = this.serializeBody(data);
        return this.request(endpoint, { method: 'PATCH', body }, opts);
    }
    async delete(endpoint, opts) {
        return this.request(endpoint, { method: 'DELETE' }, opts);
    }
}
/** Item Status Enum */
export var ItemStatus;
(function (ItemStatus) {
    ItemStatus["ACTIVE"] = "active";
    ItemStatus["INACTIVE"] = "inactive";
    ItemStatus["PENDING"] = "pending";
    ItemStatus["DELETED"] = "deleted";
})(ItemStatus || (ItemStatus = {}));
/** Specific client implementation for the Items module */
export class ItemsApiClient extends BaseApiClient {
    async getItems(params) {
        return this.get('/items', params);
    }
    async getItem(id) {
        return this.get(`/items/${id}`);
    }
    async createItem(data) {
        return this.post('/items', data);
    }
    async updateItem(id, data) {
        return this.put(`/items/${id}`, data);
    }
    async deleteItem(id) {
        return this.delete(`/items/${id}`);
    }
}
/** Authentication API Client */
export class AuthApiClient extends BaseApiClient {
    async login(data) {
        const response = await this.post('/auth/login', data);
        if (response.success && response.data.token) {
            // Legacy: store the token in localStorage if available. New apps should
            // inject `getToken` instead of relying on this side effect.
            if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
                try {
                    localStorage.setItem('auth_token', response.data.token);
                }
                catch {
                    // SSR / restricted env — silently ignore.
                }
            }
        }
        return response;
    }
    async logout() {
        try {
            const response = await this.post('/auth/logout');
            if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
                try {
                    localStorage.removeItem('auth_token');
                }
                catch { }
            }
            return response;
        }
        catch (error) {
            if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
                try {
                    localStorage.removeItem('auth_token');
                }
                catch { }
            }
            throw error;
        }
    }
    async getCurrentUser() {
        return this.get('/auth/user');
    }
    isAuthenticated() {
        if (typeof window === 'undefined' || typeof localStorage === 'undefined')
            return false;
        try {
            return !!localStorage.getItem('auth_token');
        }
        catch {
            return false;
        }
    }
}
/** Factory function to create API clients */
export function createApiClient(config) {
    return {
        items: new ItemsApiClient(config),
        auth: new AuthApiClient(config),
    };
}
//# sourceMappingURL=api-client.js.map