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

// =============================================================================
// Public types
// =============================================================================

/** Standard response envelope every Laravel endpoint returns. */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMetaData;
}

/** Metadata included in API responses */
export interface ApiMetaData {
  timestamp: string;
  apiVersion: string;
}

/**
 * Configuration for `BaseApiClient`. Old fields (`baseURL`, `timeout`,
 * `withCredentials`, `headers`) are preserved. New optional fields make the
 * client SSR-safe and let frontends inject their auth + tenancy strategies.
 */
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  withCredentials?: boolean;
  headers?: Record<string, string>;
  /**
   * Returns the current auth token, or null/undefined to omit the
   * Authorization header. SSR-safe — the SDK never touches localStorage
   * directly when this is provided.
   */
  getToken?: () => string | null | undefined;
  /**
   * Returns the current `X-Domain` value, or null/undefined to omit the
   * header. The SDK does NOT default this to `localhost` (gov/sys/app each
   * have their own resolution rules).
   */
  getDomain?: () => string | null | undefined;
  /** Fired exactly once per 401 response. Replaces the old window-event flow. */
  onUnauthorized?: () => void;
  /** Fired exactly once per 422 response with the parsed validation map. */
  onValidationError?: (errors: Record<string, string[]>) => void;
  /**
   * Optional fetch implementation injection point. Used in tests and for
   * SSR runtimes that polyfill fetch differently (e.g. node-fetch).
   */
  fetch?: typeof fetch;
  enableRetry?: boolean;
  maxRetries?: number;
}

/** Per-request options. All optional; sensible defaults match legacy behavior. */
export interface ApiRequestOptions {
  /** When false, Authorization is omitted for this call. Default: true. */
  auth?: boolean;
  /** When true, network failures resolve to null instead of throwing. */
  safe?: boolean;
  /** Custom non-throw status range. Defaults to `s => s >= 200 && s < 300`. */
  validateStatus?: (status: number) => boolean;
  /** AbortSignal for cancellation. */
  signal?: AbortSignal;
}


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
export class BaseApiClient {
  protected readonly baseURL: string;
  protected readonly timeout: number;
  protected readonly withCredentials: boolean;
  protected readonly defaultHeaders: Record<string, string>;
  protected readonly config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = config;
    this.baseURL = config.baseURL;
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
  protected resolveToken(): string | null {
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
  protected resolveDomain(): string | null {
    if (!this.config.getDomain) return null;
    const d = this.config.getDomain();
    return d == null ? null : d;
  }

  /** True if the payload contains any `File` / `Blob` (recursively). */
  protected hasBinary(value: unknown): boolean {
    if (value == null) return false;
    if (typeof Blob !== 'undefined' && value instanceof Blob) return true;
    if (typeof File !== 'undefined' && value instanceof File) return true;
    if (Array.isArray(value)) return value.some(v => this.hasBinary(v));
    if (typeof value === 'object') {
      return Object.values(value as Record<string, unknown>).some(v => this.hasBinary(v));
    }
    return false;
  }

  /**
   * Recursively serialize an object into FormData using Laravel's
   * `field[0][nested]=value` bracket notation. Booleans become `'1'`/`'0'`.
   */
  protected toFormData(payload: Record<string, unknown>): FormData {
    const fd = new FormData();
    const append = (key: string, value: unknown): void => {
      if (value === null || value === undefined) return;
      if (value instanceof Blob) {
        // File extends Blob; FormData picks up the filename automatically.
        fd.append(key, value as Blob);
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((v, i) => append(`${key}[${i}]`, v));
        return;
      }
      if (typeof value === 'object') {
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
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
    for (const [k, v] of Object.entries(payload)) append(k, v);
    return fd;
  }

  /**
   * Core dispatch. Handles header injection, method override, body
   * serialization, status validation, and ApiError normalization.
   *
   * `RequestInit` is honored as-is so subclasses can pass cookies / mode /
   * etc. through if they need to.
   */
  protected async request<T>(
    endpoint: string,
    init: RequestInit = {},
    opts: ApiRequestOptions = {},
  ): Promise<ApiResponse<T>> {
    // ---- URL + method override -------------------------------------------
    let url = `${this.baseURL}${endpoint}`;
    let method = (init.method || 'GET').toUpperCase();
    let body = init.body;

    if (method === 'PUT' || method === 'PATCH') {
      // Laravel HTTP-verb-override convention.
      const sep = url.includes('?') ? '&' : '?';
      url = `${url}${sep}_method=${method}`;
      method = 'POST';
    }

    // ---- Header assembly --------------------------------------------------
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...((init.headers as Record<string, string>) || {}),
    };

    // Authorization (unless explicitly opted out).
    if (opts.auth !== false) {
      const token = this.resolveToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    // Tenant header.
    const domain = this.resolveDomain();
    if (domain) headers['X-Domain'] = domain;

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
      if (opts.signal.aborted) controller.abort();
      else opts.signal.addEventListener('abort', () => controller.abort(), { once: true });
    }

    const fetchImpl = this.config.fetch ?? fetch;
    const validateStatus = opts.validateStatus ?? ((s: number) => s >= 200 && s < 300);

    let response: Response;
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
        return null as unknown as ApiResponse<T>;
      }
      throw err;
    }
    clearTimeout(timeoutId);

    // ---- Response parsing -------------------------------------------------
    // Some endpoints return empty bodies (204, etc). Guard against parse failure.
    const ctype = response.headers.get('content-type') ?? '';
    let parsed: any = null;
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
      const message = (parsed && typeof parsed === 'object' && (parsed as any).message)
        || `HTTP error ${response.status}`;
      const validationErrors = this.extractValidationErrors(parsed);
      throw new ApiError({
        status: response.status,
        message,
        data: parsed && typeof parsed === 'object' ? (parsed as any).data : parsed,
        validationErrors,
        originalError: response,
      });
    }

    return parsed as ApiResponse<T>;
  }

  /** Pull `{ field: string[] }` out of either Laravel-default or legacy nested envelope. */
  protected extractValidationErrors(parsed: any): Record<string, string[]> | undefined {
    if (!parsed || typeof parsed !== 'object') return undefined;
    const wrapped = parsed?.data?.errors;
    const topLevel = parsed?.errors;
    const v = wrapped ?? topLevel;
    if (v && typeof v === 'object') return v as Record<string, string[]>;
    return undefined;
  }

  /**
   * Build the request body + headers based on the supplied data. Used by
   * post/put/patch verb wrappers. Returns `{ body, isMultipart }`.
   */
  protected serializeBody(data: unknown): { body: BodyInit | undefined; isMultipart: boolean } {
    if (data === undefined || data === null) return { body: undefined, isMultipart: false };
    // FormData passes through verbatim.
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      return { body: data, isMultipart: true };
    }
    // Object payload with a binary somewhere → switch to multipart.
    if (typeof data === 'object' && this.hasBinary(data)) {
      return { body: this.toFormData(data as Record<string, unknown>), isMultipart: true };
    }
    return { body: JSON.stringify(data), isMultipart: false };
  }

  // ---------------------------------------------------------------------------
  // Verb wrappers — public-ish (subclasses use these). Signatures kept
  // backward-compatible with the original fetch client.
  // ---------------------------------------------------------------------------

  protected async get<T>(
    endpoint: string,
    params?: Record<string, any>,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) searchParams.append(key, String(value));
      }
      const paramString = searchParams.toString();
      if (paramString) url += (url.includes('?') ? '&' : '?') + paramString;
    }
    return this.request<T>(url, { method: 'GET' }, opts);
  }

  protected async post<T>(
    endpoint: string,
    data?: any,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<T>> {
    const { body } = this.serializeBody(data);
    return this.request<T>(endpoint, { method: 'POST', body }, opts);
  }

  protected async put<T>(
    endpoint: string,
    data?: any,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<T>> {
    const { body } = this.serializeBody(data);
    return this.request<T>(endpoint, { method: 'PUT', body }, opts);
  }

  protected async patch<T>(
    endpoint: string,
    data?: any,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<T>> {
    const { body } = this.serializeBody(data);
    return this.request<T>(endpoint, { method: 'PATCH', body }, opts);
  }

  protected async delete<T>(
    endpoint: string,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' }, opts);
  }
}

// =============================================================================
// DTOs / Module clients (preserved verbatim from the legacy file)
// =============================================================================

/** Item DTO interfaces based on PHP DTOs */
export interface ItemData {
  id: number;
  name: string;
  description: string;
  price: number;
  status: ItemStatus;
  imageUrl?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

/** ItemCollection DTO */
export interface ItemCollectionData {
  items: ItemData[];
}

/** Item Status Enum */
export enum ItemStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  DELETED = 'deleted',
}

/** FoodData DTO */
export interface FoodData {
  id: number;
  name: string;
  description: string | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  calories: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

/** FoodCollection DTO */
export interface FoodCollectionData {
  items: FoodData[];
}

/** User DTO */
export interface UserData {
  id: number;
  name: string;
  email: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

/** Authentication DTO */
export interface AuthData {
  token: string;
  user: UserData;
  expiresAt: string;
}

/** Login DTO */
export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/** Pagination DTO */
export interface PaginationData {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

/** Paginated Response DTO */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationData;
}

/** Specific client implementation for the Items module */
export class ItemsApiClient extends BaseApiClient {
  async getItems(params?: { status?: ItemStatus; page?: number; perPage?: number }): Promise<ApiResponse<ItemCollectionData>> {
    return this.get<ItemCollectionData>('/items', params);
  }

  async getItem(id: number): Promise<ApiResponse<ItemData>> {
    return this.get<ItemData>(`/items/${id}`);
  }

  async createItem(data: Omit<ItemData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ItemData>> {
    return this.post<ItemData>('/items', data);
  }

  async updateItem(id: number, data: Partial<Omit<ItemData, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<ItemData>> {
    return this.put<ItemData>(`/items/${id}`, data);
  }

  async deleteItem(id: number): Promise<ApiResponse<null>> {
    return this.delete<null>(`/items/${id}`);
  }
}

/** Authentication API Client */
export class AuthApiClient extends BaseApiClient {
  async login(data: LoginData): Promise<ApiResponse<AuthData>> {
    const response = await this.post<AuthData>('/auth/login', data);
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

  async logout(): Promise<ApiResponse<null>> {
    try {
      const response = await this.post<null>('/auth/logout');
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        try {
          localStorage.removeItem('auth_token');
        }
        catch {}
      }
      return response;
    }
    catch (error) {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        try {
          localStorage.removeItem('auth_token');
        }
        catch {}
      }
      throw error;
    }
  }

  async getCurrentUser(): Promise<ApiResponse<UserData>> {
    return this.get<UserData>('/auth/user');
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return false;
    try {
      return !!localStorage.getItem('auth_token');
    }
    catch {
      return false;
    }
  }
}

/** Factory function to create API clients */
export function createApiClient(config: ApiClientConfig) {
  return {
    items: new ItemsApiClient(config),
    auth: new AuthApiClient(config),
  };
}
