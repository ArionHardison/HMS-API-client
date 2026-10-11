/**
 * HMS API Error Handling Utilities
 * 
 * This module provides utilities for handling API errors in a consistent way.
 */

import { AxiosError } from 'axios';
import { ApiResponse } from './hms-api-client';

/**
 * Normalized init shape accepted by `ApiError`. The original AxiosError-only
 * constructor is preserved (legacy callers pass `error.isAxiosError === true`)
 * but the fetch-based `BaseApiClient` constructs from a plain object instead
 * — no axios runtime needed in non-axios code paths.
 */
export interface ApiErrorInit {
  status: number;
  message: string;
  /**
   * Parsed response body (typically the `data` field of the API envelope).
   * Optional because some failures (network errors, opaque responses) carry
   * no body at all.
   */
  data?: any;
  /**
   * Laravel-style validation map: `{ field: string[] }`. Populated for 422
   * responses; the SDK pulls it from either `data.errors` (legacy nested
   * envelope) or top-level `errors`.
   */
  validationErrors?: Record<string, string[]>;
  /**
   * The original error / response, kept around so callers can do deeper
   * inspection (status text, raw body, etc).
   */
  originalError?: any;
  /**
   * Seconds to wait before retrying, already normalized from `Retry-After`
   * (delta-seconds or HTTP-date) with the api's `retry_after` body field as
   * the fallback. `null` / omitted when the response carried neither.
   */
  retryAfter?: number | null;
  /** Rate-limit detail for a refusal (429, or the api's `rate_limited` / `rate_limiter_unavailable` body). */
  rateLimit?: RateLimitInfo;
}

// =============================================================================
// Rate-limit contract (CI-API anti-bulk-exfiltration plan C5 / §4, WS1):
//   429  { message, error: 'rate_limited', scope, limit, window, retry_after }
//   503  { message, error: 'rate_limiter_unavailable', scope, retry_after }
// each with `Retry-After` (+ X-RateLimit-* / RateLimit-Policy). `Retry-After`
// and `retry_after` are ONE number, >= 1. The api exposes Retry-After through
// CORS (`exposed_headers`) so a cross-origin browser consumer can read it.
// =============================================================================

/** Typed rate-limit detail surfaced on `ApiError.rateLimit`. */
export interface RateLimitInfo {
  /** Seconds to wait — the same number as `ApiError.retryAfter`. */
  retryAfter: number | null;
  /** The api's refusal word: `'rate_limited'` (429) or `'rate_limiter_unavailable'` (503 shed). */
  error?: string;
  /** The named limiter / budget scope that refused (`public-directory`, `api`, `daily_rows`, ...). */
  scope?: string;
  /** The ceiling of the bucket that refused. */
  limit?: number;
  /** `'minute' | 'hour' | 'day' | '<n>m'`. */
  window?: string;
}

const RATE_LIMIT_ERROR_WORDS = new Set(['rate_limited', 'rate_limiter_unavailable']);

/**
 * Parse a `Retry-After` header value into whole seconds from `now`.
 *
 * RFC 7231 §7.1.3 allows two forms: delta-seconds (`"30"`) and an HTTP-date
 * (`"Wed, 21 Oct 2015 07:28:00 GMT"`). Delta-seconds are returned as-is; an
 * HTTP-date becomes the seconds until that instant (ceil), clamped at 0 when
 * it is already in the past. Anything else — empty, missing, a bare word, a
 * fraction — is `null`: the caller falls back to the body or its own default,
 * never to a guessed number. Only strings carrying a month / day name are
 * tried as dates so `Date.parse`'s lenient numeric forms cannot leak in.
 */
export function parseRetryAfter(
  value: string | null | undefined,
  now: number = Date.now(),
): number | null {
  if (value == null) return null;
  const v = String(value).trim();
  if (v === '') return null;
  if (/^\d+$/.test(v)) return Number(v);
  if (!/[A-Za-z]{3}/.test(v)) return null;
  const at = Date.parse(v);
  if (Number.isNaN(at)) return null;
  return Math.max(0, Math.ceil((at - now) / 1000));
}

/** The api's `retry_after` body field when the body is the plan's refusal envelope; else `null`. */
export function bodyRetryAfter(body: unknown): number | null {
  if (!body || typeof body !== 'object') return null;
  const ra = (body as { retry_after?: unknown }).retry_after;
  return typeof ra === 'number' && Number.isFinite(ra) && ra >= 0 ? ra : null;
}

/**
 * Build the typed `RateLimitInfo` for a refusal. Returns `undefined` unless
 * the status is 429 or the body carries one of the api's refusal words — a
 * plain 404 / 500 never grows a `rateLimit` field.
 */
export function rateLimitInfoFrom(
  status: number,
  body: unknown,
  retryAfter: number | null,
): RateLimitInfo | undefined {
  const b = (body && typeof body === 'object') ? (body as Record<string, unknown>) : {};
  const word = typeof b.error === 'string' ? b.error : undefined;
  if (status !== 429 && !(word && RATE_LIMIT_ERROR_WORDS.has(word))) return undefined;
  const info: RateLimitInfo = { retryAfter };
  if (word) info.error = word;
  if (typeof b.scope === 'string') info.scope = b.scope;
  if (typeof b.limit === 'number') info.limit = b.limit;
  if (typeof b.window === 'string') info.window = b.window;
  return info;
}

/** Read one header off an axios `response.headers` (AxiosHeaders or a plain, lower-cased object). */
function axiosHeader(headers: unknown, name: string): string | null {
  if (!headers || typeof headers !== 'object') return null;
  const h = headers as { get?: (n: string) => unknown } & Record<string, unknown>;
  if (typeof h.get === 'function') {
    const got = h.get(name);
    if (typeof got === 'string') return got;
    if (got != null) return String(got);
  }
  const lower = name.toLowerCase();
  for (const key of Object.keys(h)) {
    if (key.toLowerCase() === lower) {
      const got = h[key];
      return got == null ? null : String(got);
    }
  }
  return null;
}

/**
 * Best-effort detection of an AxiosError without paying for the axios import
 * surface area inside this discriminator. AxiosError sets `isAxiosError: true`;
 * we also accept anything with a `response` field (loose duck-typing) to keep
 * legacy callers working when the flag is missing.
 */
function isAxiosErrorLike(value: unknown): value is AxiosError {
  if (!value || typeof value !== 'object') return false;
  const v = value as { isAxiosError?: unknown; response?: unknown };
  if (v.isAxiosError === true) return true;
  // Reject our own ApiErrorInit shape: it has `status` as a top-level number.
  if (typeof (v as any).status === 'number' && !v.response) return false;
  return false;
}

/**
 * Enhanced API Error class with additional error handling functionality.
 *
 * Two construction modes:
 *   1. Legacy: `new ApiError(axiosError)` — used by axios-based callers in
 *      `hms-api-client.ts` and friends.
 *   2. Modern: `new ApiError({ status, message, data, validationErrors })`
 *      — used by the fetch-based `BaseApiClient` request pipeline.
 *
 * Both shapes populate the same public surface (`status`, `data`, `errors`,
 * `validationErrors`, `isApiError`, predicates) so downstream code is
 * agnostic.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly data: any;
  /** Legacy alias kept for backward compat. Same as `validationErrors`. */
  readonly errors?: Record<string, string[]>;
  /**
   * Typed validation map. Mirrors `errors` but is the contract the new
   * fetch pipeline guarantees (always an object on 422 with this field set).
   */
  readonly validationErrors?: Record<string, string[]>;
  readonly isApiError: boolean = true;
  readonly originalError: any;
  /**
   * Seconds the server asked the client to wait before retrying: the
   * `Retry-After` header (delta-seconds or HTTP-date, normalized to whole
   * seconds from now) first, the api's `retry_after` body field as the
   * fallback; `null` when the response carried neither. Present on EVERY
   * ApiError so a caller can back off a 429 (or a 503 shed) without
   * re-reading response headers. Never replay a 429 inside this window.
   */
  readonly retryAfter: number | null;
  /** Rate-limit detail when the response was a refusal (429, or the api's `rate_limited` / `rate_limiter_unavailable` body). */
  readonly rateLimit?: RateLimitInfo;

  /**
   * Create a new ApiError. Accepts either an AxiosError (legacy) or a
   * normalized init object (modern fetch path).
   */
  constructor(input: AxiosError<ApiResponse> | ApiErrorInit) {
    // Discriminate first, build a unified set of fields, then call super at
    // the root of the constructor (TS2401 forbids conditional super calls).
    const isAxios = isAxiosErrorLike(input);
    const message = isAxios
      ? ((input as AxiosError<ApiResponse>).response?.data?.message
        || (input as AxiosError).message
        || 'Unknown API error')
      : ((input as ApiErrorInit).message || 'Unknown API error');
    super(message);
    this.name = 'ApiError';

    if (isAxios) {
      const err = input as AxiosError<ApiResponse>;
      // Do NOT retain the live AxiosError: its `config.headers` holds the
      // `Authorization: Bearer <token>` and response headers can carry
      // Set-Cookie. Keep only a sanitized, serialization-safe snapshot so
      // JSON.stringify / error reporters cannot exfiltrate credentials.
      this.originalError = {
        status: err.response?.status,
        statusText: err.response?.statusText,
        url: err.config?.url,
        method: err.config?.method,
        data: err.response?.data,
      };
      this.status = err.response?.status || 0;
      this.data = err.response?.data?.data;
      this.retryAfter = parseRetryAfter(axiosHeader(err.response?.headers, 'retry-after'))
        ?? bodyRetryAfter(err.response?.data);
      this.rateLimit = rateLimitInfoFrom(this.status, err.response?.data, this.retryAfter);
      // Extract validation errors. Two shapes seen in the wild:
      //   - Wrapped: `{ data: { errors: { field: [...] } } }` (legacy HMS).
      //   - Top-level: `{ errors: { field: [...] } }` (Laravel default).
      const wrapped = (err.response?.data as any)?.data?.errors;
      const topLevel = (err.response?.data as any)?.errors;
      const v = wrapped ?? topLevel;
      if (err.response?.status === 422 && v) {
        this.errors = v;
        this.validationErrors = v;
      }
    }
    else {
      const init = input as ApiErrorInit;
      this.originalError = init.originalError ?? init;
      this.status = init.status ?? 0;
      this.data = init.data;
      this.retryAfter = init.retryAfter ?? null;
      if (init.rateLimit) this.rateLimit = init.rateLimit;
      if (init.validationErrors) {
        this.errors = init.validationErrors;
        this.validationErrors = init.validationErrors;
      }
    }
  }

  /**
   * Check if this is a validation error (HTTP 422)
   */
  isValidationError(): boolean {
    return this.status === 422 && !!this.errors;
  }

  /**
   * Check if this is an authentication error (HTTP 401)
   */
  isAuthError(): boolean {
    return this.status === 401;
  }

  /**
   * Check if this is a forbidden error (HTTP 403)
   */
  isForbiddenError(): boolean {
    return this.status === 403;
  }

  /**
   * Check if this is a not found error (HTTP 404)
   */
  isNotFoundError(): boolean {
    return this.status === 404;
  }

  /**
   * Check if this is a server error (HTTP 500+)
   */
  isServerError(): boolean {
    return this.status >= 500;
  }

  /**
   * Check if this is a locked-resource error (HTTP 423). `app/` uses this
   * to surface "this deal is currently being modified by another user".
   */
  isLockedError(): boolean {
    return this.status === 423;
  }

  /**
   * Check if this is a rate-limit refusal (HTTP 429). Back off for
   * `retryAfter` seconds; never replay the request inside that window.
   */
  isRateLimitError(): boolean {
    return this.status === 429;
  }

  /**
   * Get all validation errors
   */
  getValidationErrors(): Record<string, string[]> {
    return this.errors || {};
  }

  /**
   * Get the first validation error for a specific field
   * @param field - The field name
   */
  getFieldError(field: string): string | undefined {
    if (!this.errors || !this.errors[field] || !this.errors[field].length) {
      return undefined;
    }
    return this.errors[field][0];
  }

  /**
   * Get simplified validation errors as a Record of field to first error message
   */
  getSimplifiedValidationErrors(): Record<string, string> {
    if (!this.errors) {
      return {};
    }

    return Object.entries(this.errors).reduce((result, [field, messages]) => {
      if (messages && messages.length > 0) {
        result[field] = messages[0];
      }
      return result;
    }, {} as Record<string, string>);
  }

  /**
   * Serialization guard: `JSON.stringify(apiError)` and most error reporters
   * will only ever see these safe fields — never `originalError` or any request
   * headers — so an accidental serialize cannot leak the bearer token.
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      retryAfter: this.retryAfter,
      validationErrors: this.validationErrors,
    };
  }
}

/**
 * Process an error and convert it to an ApiError if possible
 * @param error - The error to process
 */
export function processApiError(error: any): ApiError {
  // If already an ApiError, return it
  if (error && error.isApiError) {
    return error;
  }
  
  // If it's an AxiosError, convert it to an ApiError
  if (error && error.isAxiosError) {
    return new ApiError(error);
  }
  
  // For other errors, create a generic ApiError using the modern init shape.
  return new ApiError({
    status: 0,
    message: error?.message ?? 'Unknown error',
    originalError: error,
  });
}

/**
 * HTTP status of a thrown error across the SDK's error shapes — `ApiError`
 * (fetch pipeline), an AxiosError (legacy axios clients), or anything else.
 * `null` when there is no HTTP status: a network failure, an abort, a
 * programmer error.
 */
export function httpStatusOf(error: unknown): number | null {
  if (!error || typeof error !== 'object') return null;
  const e = error as { isApiError?: unknown; status?: unknown; response?: { status?: unknown } | null };
  const status = e.isApiError === true ? e.status : (e.response?.status ?? e.status);
  return typeof status === 'number' && status > 0 ? status : null;
}

/**
 * Whether replaying the SAME request can help. A 4xx is the client's own
 * fault — bad input (400/422), auth (401/403), a missing row (404), a lock
 * (423) or a rate-limit refusal (429) — so an unchanged replay can only lose,
 * and a 429 replayed inside `Retry-After` extends the ban (plan C10: the sdk
 * never retries 4xx). 5xx and network failures (no status) stay retryable.
 */
export function isRetryableError(error: unknown): boolean {
  const status = httpStatusOf(error);
  return status === null || status >= 500;
}

/**
 * Async error handler that wraps an API call and processes errors consistently
 * @param apiCall - The API call function to execute
 * @param errorHandler - Optional custom error handler
 */
export async function handleApiCall<T>(
  apiCall: () => Promise<T>,
  errorHandler?: (error: ApiError) => void
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    const apiError = processApiError(error);
    
    if (errorHandler) {
      errorHandler(apiError);
    }
    
    throw apiError;
  }
}

/**
 * Create a form validation object from an ApiError for use with form libraries
 * @param error - The API error
 */
export function createFormErrors(error: any): Record<string, string> {
  const apiError = processApiError(error);
  
  if (apiError.isValidationError()) {
    return apiError.getSimplifiedValidationErrors();
  }
  
  return {};
}

/**
 * Extract error messages from an API error in a user-friendly format
 * @param error - The API error
 */
export function getErrorMessage(error: any): string {
  const apiError = processApiError(error);
  
  // Authentication errors
  if (apiError.isAuthError()) {
    return 'Your session has expired. Please log in again.';
  }
  
  // Forbidden errors
  if (apiError.isForbiddenError()) {
    return 'You do not have permission to perform this action.';
  }
  
  // Not found errors
  if (apiError.isNotFoundError()) {
    return 'The requested resource was not found.';
  }
  
  // Rate-limit refusals — say how long to wait when the server said so.
  if (apiError.isRateLimitError()) {
    const wait = apiError.retryAfter;
    return wait == null
      ? 'Too many requests. Please try again shortly.'
      : `Too many requests. Please try again in ${wait} second${wait === 1 ? '' : 's'}.`;
  }

  // Server errors
  if (apiError.isServerError()) {
    return 'A server error occurred. Please try again later.';
  }
  
  // Validation errors
  if (apiError.isValidationError()) {
    const errors = apiError.getValidationErrors();
    const errorMessages = Object.entries(errors)
      .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
      .join('\n');
    
    return `Validation errors:\n${errorMessages}`;
  }
  
  // Default case
  return apiError.message;
}

/**
 * Usage example:
 * 
 * try {
 *   const result = await handleApiCall(
 *     () => hmsApiClient.items.getItem(123)
 *   );
 *   console.log('Item:', result.data.data);
 * } catch (error) {
 *   // ApiError with additional helper methods
 *   if (error.isValidationError()) {
 *     // Handle validation errors
 *     const fieldErrors = error.getSimplifiedValidationErrors();
 *     console.error('Validation errors:', fieldErrors);
 *   } else if (error.isAuthError()) {
 *     // Handle authentication errors
 *     console.error('Authentication error. Please log in again.');
 *   } else {
 *     // Handle other errors
 *     console.error('Error:', error.message);
 *   }
 * }
 */