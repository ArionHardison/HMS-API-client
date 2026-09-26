"use strict";
/**
 * HMS API Error Handling Utilities
 *
 * This module provides utilities for handling API errors in a consistent way.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = exports.createFormErrors = exports.handleApiCall = exports.processApiError = exports.ApiError = void 0;
/**
 * Best-effort detection of an AxiosError without paying for the axios import
 * surface area inside this discriminator. AxiosError sets `isAxiosError: true`;
 * we also accept anything with a `response` field (loose duck-typing) to keep
 * legacy callers working when the flag is missing.
 */
function isAxiosErrorLike(value) {
    if (!value || typeof value !== 'object')
        return false;
    const v = value;
    if (v.isAxiosError === true)
        return true;
    // Reject our own ApiErrorInit shape: it has `status` as a top-level number.
    if (typeof v.status === 'number' && !v.response)
        return false;
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
class ApiError extends Error {
    /**
     * Create a new ApiError. Accepts either an AxiosError (legacy) or a
     * normalized init object (modern fetch path).
     */
    constructor(input) {
        // Discriminate first, build a unified set of fields, then call super at
        // the root of the constructor (TS2401 forbids conditional super calls).
        const isAxios = isAxiosErrorLike(input);
        const message = isAxios
            ? (input.response?.data?.message
                || input.message
                || 'Unknown API error')
            : (input.message || 'Unknown API error');
        super(message);
        this.isApiError = true;
        this.name = 'ApiError';
        if (isAxios) {
            const err = input;
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
            // Extract validation errors. Two shapes seen in the wild:
            //   - Wrapped: `{ data: { errors: { field: [...] } } }` (legacy HMS).
            //   - Top-level: `{ errors: { field: [...] } }` (Laravel default).
            const wrapped = err.response?.data?.data?.errors;
            const topLevel = err.response?.data?.errors;
            const v = wrapped ?? topLevel;
            if (err.response?.status === 422 && v) {
                this.errors = v;
                this.validationErrors = v;
            }
        }
        else {
            const init = input;
            this.originalError = init.originalError ?? init;
            this.status = init.status ?? 0;
            this.data = init.data;
            if (init.validationErrors) {
                this.errors = init.validationErrors;
                this.validationErrors = init.validationErrors;
            }
        }
    }
    /**
     * Check if this is a validation error (HTTP 422)
     */
    isValidationError() {
        return this.status === 422 && !!this.errors;
    }
    /**
     * Check if this is an authentication error (HTTP 401)
     */
    isAuthError() {
        return this.status === 401;
    }
    /**
     * Check if this is a forbidden error (HTTP 403)
     */
    isForbiddenError() {
        return this.status === 403;
    }
    /**
     * Check if this is a not found error (HTTP 404)
     */
    isNotFoundError() {
        return this.status === 404;
    }
    /**
     * Check if this is a server error (HTTP 500+)
     */
    isServerError() {
        return this.status >= 500;
    }
    /**
     * Check if this is a locked-resource error (HTTP 423). `app/` uses this
     * to surface "this deal is currently being modified by another user".
     */
    isLockedError() {
        return this.status === 423;
    }
    /**
     * Get all validation errors
     */
    getValidationErrors() {
        return this.errors || {};
    }
    /**
     * Get the first validation error for a specific field
     * @param field - The field name
     */
    getFieldError(field) {
        if (!this.errors || !this.errors[field] || !this.errors[field].length) {
            return undefined;
        }
        return this.errors[field][0];
    }
    /**
     * Get simplified validation errors as a Record of field to first error message
     */
    getSimplifiedValidationErrors() {
        if (!this.errors) {
            return {};
        }
        return Object.entries(this.errors).reduce((result, [field, messages]) => {
            if (messages && messages.length > 0) {
                result[field] = messages[0];
            }
            return result;
        }, {});
    }
    /**
     * Serialization guard: `JSON.stringify(apiError)` and most error reporters
     * will only ever see these safe fields — never `originalError` or any request
     * headers — so an accidental serialize cannot leak the bearer token.
     */
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            status: this.status,
            validationErrors: this.validationErrors,
        };
    }
}
exports.ApiError = ApiError;
/**
 * Process an error and convert it to an ApiError if possible
 * @param error - The error to process
 */
function processApiError(error) {
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
exports.processApiError = processApiError;
/**
 * Async error handler that wraps an API call and processes errors consistently
 * @param apiCall - The API call function to execute
 * @param errorHandler - Optional custom error handler
 */
async function handleApiCall(apiCall, errorHandler) {
    try {
        return await apiCall();
    }
    catch (error) {
        const apiError = processApiError(error);
        if (errorHandler) {
            errorHandler(apiError);
        }
        throw apiError;
    }
}
exports.handleApiCall = handleApiCall;
/**
 * Create a form validation object from an ApiError for use with form libraries
 * @param error - The API error
 */
function createFormErrors(error) {
    const apiError = processApiError(error);
    if (apiError.isValidationError()) {
        return apiError.getSimplifiedValidationErrors();
    }
    return {};
}
exports.createFormErrors = createFormErrors;
/**
 * Extract error messages from an API error in a user-friendly format
 * @param error - The API error
 */
function getErrorMessage(error) {
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
exports.getErrorMessage = getErrorMessage;
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
//# sourceMappingURL=error-handling.js.map