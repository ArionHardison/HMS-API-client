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
export declare class ApiError extends Error {
    readonly status: number;
    readonly data: any;
    /** Legacy alias kept for backward compat. Same as `validationErrors`. */
    readonly errors?: Record<string, string[]>;
    /**
     * Typed validation map. Mirrors `errors` but is the contract the new
     * fetch pipeline guarantees (always an object on 422 with this field set).
     */
    readonly validationErrors?: Record<string, string[]>;
    readonly isApiError: boolean;
    readonly originalError: any;
    /**
     * Create a new ApiError. Accepts either an AxiosError (legacy) or a
     * normalized init object (modern fetch path).
     */
    constructor(input: AxiosError<ApiResponse> | ApiErrorInit);
    /**
     * Check if this is a validation error (HTTP 422)
     */
    isValidationError(): boolean;
    /**
     * Check if this is an authentication error (HTTP 401)
     */
    isAuthError(): boolean;
    /**
     * Check if this is a forbidden error (HTTP 403)
     */
    isForbiddenError(): boolean;
    /**
     * Check if this is a not found error (HTTP 404)
     */
    isNotFoundError(): boolean;
    /**
     * Check if this is a server error (HTTP 500+)
     */
    isServerError(): boolean;
    /**
     * Check if this is a locked-resource error (HTTP 423). `app/` uses this
     * to surface "this deal is currently being modified by another user".
     */
    isLockedError(): boolean;
    /**
     * Get all validation errors
     */
    getValidationErrors(): Record<string, string[]>;
    /**
     * Get the first validation error for a specific field
     * @param field - The field name
     */
    getFieldError(field: string): string | undefined;
    /**
     * Get simplified validation errors as a Record of field to first error message
     */
    getSimplifiedValidationErrors(): Record<string, string>;
    /**
     * Serialization guard: `JSON.stringify(apiError)` and most error reporters
     * will only ever see these safe fields — never `originalError` or any request
     * headers — so an accidental serialize cannot leak the bearer token.
     */
    toJSON(): Record<string, unknown>;
}
/**
 * Process an error and convert it to an ApiError if possible
 * @param error - The error to process
 */
export declare function processApiError(error: any): ApiError;
/**
 * Async error handler that wraps an API call and processes errors consistently
 * @param apiCall - The API call function to execute
 * @param errorHandler - Optional custom error handler
 */
export declare function handleApiCall<T>(apiCall: () => Promise<T>, errorHandler?: (error: ApiError) => void): Promise<T>;
/**
 * Create a form validation object from an ApiError for use with form libraries
 * @param error - The API error
 */
export declare function createFormErrors(error: any): Record<string, string>;
/**
 * Extract error messages from an API error in a user-friendly format
 * @param error - The API error
 */
export declare function getErrorMessage(error: any): string;
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
//# sourceMappingURL=error-handling.d.ts.map