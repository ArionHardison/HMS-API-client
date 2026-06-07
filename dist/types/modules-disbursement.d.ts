/**
 * Type definitions for `Modules/Disbursement`.
 *
 * Structural interfaces only — no runtime code. Mirrors
 * `Modules\Disbursement\Transformers\DisbursementResource`, a passthrough
 * resource. Shape kept open via `[key: string]: unknown` so callers can
 * narrow when they know the columns their tenant exposes.
 *
 * Manifest oddity: this module exposes `POST /api/disbursement/confirm`
 * instead of the `submit` action used by Appeal / Application / Report /
 * Verification. Methods on the client reflect that — see `confirm()`.
 */
/** Identifier alias for the `{disbursement}` route binding (id or slug). */
export type DisbursementId = number | string;
/** Identifier alias for the `{task}` (run-global) route binding. */
export type DisbursementTaskId = number | string;
/** Identifier alias for the `{chain}` (run) route binding. */
export type DisbursementChainId = number | string;
/** Canonical Disbursement record. Passthrough resource — keep shape open. */
export interface DisbursementResource {
    id?: number;
    [key: string]: unknown;
}
/** POST /api/disbursement body. */
export type DisbursementStoreInput = Record<string, unknown>;
/** PUT /api/disbursement/{disbursement} body. */
export type DisbursementUpdateInput = Record<string, unknown>;
/** POST /api/disbursement/confirm body — controller takes the request raw. */
export type DisbursementConfirmInput = Record<string, unknown>;
/** Response shape for run / runGlobal endpoints (`{ data, chain }`). */
export interface DisbursementRunResource {
    data: unknown;
    chain: unknown;
    [key: string]: unknown;
}
/** Response shape for `/api/disbursement/confirm` (`{ success }`). */
export interface DisbursementConfirmResource {
    success: unknown;
    [key: string]: unknown;
}
//# sourceMappingURL=modules-disbursement.d.ts.map