/**
 * Type definitions for `Modules/Verification`.
 *
 * Structural interfaces only — no runtime code. Mirrors
 * `Modules\Verification\Transformers\VerificationResource`, a passthrough
 * resource. Shape kept open via `[key: string]: unknown` so callers can
 * narrow when they know the column set their tenant exposes.
 */

/** Identifier alias for the `{verification}` route binding (id or slug). */
export type VerificationId = number | string;

/** Identifier alias for the `{task}` (run-global) route binding. */
export type VerificationTaskId = number | string;

/** Identifier alias for the `{chain}` (run) route binding. */
export type VerificationChainId = number | string;

/** Canonical Verification record. Passthrough resource — keep shape open. */
export interface VerificationResource {
  id?: number;
  [key: string]: unknown;
}

/** POST /api/verification body. */
export type VerificationStoreInput = Record<string, unknown>;

/** PUT /api/verification/{verification} body. */
export type VerificationUpdateInput = Record<string, unknown>;

/** POST /api/verification/submit body — controller takes the request raw. */
export type VerificationSubmitInput = Record<string, unknown>;

/** Response shape for run / runGlobal endpoints (`{ data, chain }`). */
export interface VerificationRunResource {
  data: unknown;
  chain: unknown;
  [key: string]: unknown;
}

/** Response shape for `/api/verification/submit` (`{ success }`). */
export interface VerificationSubmitResource {
  success: unknown;
  [key: string]: unknown;
}
