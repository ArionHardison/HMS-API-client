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
    /**
     * The host root the client targets (no trailing `/api` — endpoint paths
     * already include it). Optional. When omitted, the client resolves the
     * base URL lazily per request via:
     *
     *   1. `globalThis.window.location.origin` (browser / happy-dom / jsdom),
     *      so a deploy at `https://ycaas.ai` issues same-origin requests
     *      that a Vercel rewrite proxies to the API.
     *   2. `https://api.project20x.com` as the SSR / Node fallback.
     *
     * Resolution is lazy on purpose — the constructor must not touch `window`
     * (see the SSR safety contract test). An explicit value always wins.
     */
    baseURL?: string;
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
export declare class BaseApiClient {
    protected readonly baseURL: string;
    protected readonly timeout: number;
    protected readonly withCredentials: boolean;
    protected readonly defaultHeaders: Record<string, string>;
    protected readonly config: ApiClientConfig;
    constructor(config: ApiClientConfig);
    /** Resolve the auth token using injected `getToken`, falling back to localStorage iff window exists. */
    protected resolveToken(): string | null;
    /** Resolve the `X-Domain` value. Null/undefined = omit. Never defaults. */
    protected resolveDomain(): string | null;
    /** True if the payload contains any `File` / `Blob` (recursively). */
    protected hasBinary(value: unknown): boolean;
    /**
     * Recursively serialize an object into FormData using Laravel's
     * `field[0][nested]=value` bracket notation. Booleans become `'1'`/`'0'`.
     */
    protected toFormData(payload: Record<string, unknown>): FormData;
    /**
     * Core dispatch. Handles header injection, method override, body
     * serialization, status validation, and ApiError normalization.
     *
     * `RequestInit` is honored as-is so subclasses can pass cookies / mode /
     * etc. through if they need to.
     */
    protected request<T>(endpoint: string, init?: RequestInit, opts?: ApiRequestOptions): Promise<ApiResponse<T>>;
    /** Pull `{ field: string[] }` out of either Laravel-default or legacy nested envelope. */
    protected extractValidationErrors(parsed: any): Record<string, string[]> | undefined;
    /**
     * Build the request body + headers based on the supplied data. Used by
     * post/put/patch verb wrappers. Returns `{ body, isMultipart }`.
     */
    protected serializeBody(data: unknown): {
        body: BodyInit | undefined;
        isMultipart: boolean;
    };
    protected get<T>(endpoint: string, params?: Record<string, any>, opts?: ApiRequestOptions): Promise<ApiResponse<T>>;
    protected post<T>(endpoint: string, data?: any, opts?: ApiRequestOptions): Promise<ApiResponse<T>>;
    protected put<T>(endpoint: string, data?: any, opts?: ApiRequestOptions): Promise<ApiResponse<T>>;
    protected patch<T>(endpoint: string, data?: any, opts?: ApiRequestOptions): Promise<ApiResponse<T>>;
    protected delete<T>(endpoint: string, opts?: ApiRequestOptions): Promise<ApiResponse<T>>;
}
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
export declare enum ItemStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PENDING = "pending",
    DELETED = "deleted"
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
export declare class ItemsApiClient extends BaseApiClient {
    getItems(params?: {
        status?: ItemStatus;
        page?: number;
        perPage?: number;
    }): Promise<ApiResponse<ItemCollectionData>>;
    getItem(id: number): Promise<ApiResponse<ItemData>>;
    createItem(data: Omit<ItemData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ItemData>>;
    updateItem(id: number, data: Partial<Omit<ItemData, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<ItemData>>;
    deleteItem(id: number): Promise<ApiResponse<null>>;
}
/** Authentication API Client */
export declare class AuthApiClient extends BaseApiClient {
    login(data: LoginData): Promise<ApiResponse<AuthData>>;
    logout(): Promise<ApiResponse<null>>;
    getCurrentUser(): Promise<ApiResponse<UserData>>;
    isAuthenticated(): boolean;
}
/** Factory function to create API clients */
export declare function createApiClient(config: ApiClientConfig): {
    items: ItemsApiClient;
    auth: AuthApiClient;
};
//# sourceMappingURL=api-client.d.ts.map