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
      this.originalError = err;
      this.status = err.response?.status || 0;
      this.data = err.response?.data?.data;
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