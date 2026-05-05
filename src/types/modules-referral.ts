/**
 * Type definitions for `Modules/Referral`.
 *
 * Structural interfaces only — no runtime code. Mirrors
 * `Modules\Referral\Transformers\ReferralResource`, a passthrough
 * resource. Shape kept open via `[key: string]: unknown` so callers can
 * narrow when they know the column set their tenant exposes.
 *
 * Manifest oddity: like Disbursement, Referral exposes
 * `POST /api/referral/confirm` rather than `submit` — the client method is
 * named `confirm()` accordingly.
 */

/** Identifier alias for the `{referral}` route binding (id or slug). */
export type ReferralId = number | string;

/** Identifier alias for the `{task}` (run-global) route binding. */
export type ReferralTaskId = number | string;

/** Identifier alias for the `{chain}` (run) route binding. */
export type ReferralChainId = number | string;

/** Canonical Referral record. Passthrough resource — keep shape open. */
export interface ReferralResource {
  id?: number;
  [key: string]: unknown;
}

/** POST /api/referral body. */
export type ReferralStoreInput = Record<string, unknown>;

/** PUT /api/referral/{referral} body. */
export type ReferralUpdateInput = Record<string, unknown>;

/** POST /api/referral/confirm body — controller takes the request raw. */
export type ReferralConfirmInput = Record<string, unknown>;

/** Response shape for run / runGlobal endpoints (`{ data, chain }`). */
export interface ReferralRunResource {
  data: unknown;
  chain: unknown;
  [key: string]: unknown;
}

/** Response shape for `/api/referral/confirm` (`{ success }`). */
export interface ReferralConfirmResource {
  success: unknown;
  [key: string]: unknown;
}
