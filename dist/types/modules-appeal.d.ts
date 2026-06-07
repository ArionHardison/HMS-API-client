/**
 * Type definitions for `Modules/Appeal`.
 *
 * Structural interfaces only — no runtime code. Mirrors the Laravel
 * `Modules\Appeal\Transformers\AppealResource` shape, which is a
 * passthrough resource (`toArray($request)` returns `parent::toArray`).
 * The SDK keeps the shape open with `[key: string]: unknown` so callers
 * can narrow when they know the column set their tenant exposes.
 */
/** Identifier alias for the `{appeal}` route binding (id or slug). */
export type AppealId = number | string;
/** Identifier alias for the `{task}` (run-global) route binding. */
export type AppealTaskId = number | string;
/** Identifier alias for the `{chain}` (run) route binding. */
export type AppealChainId = number | string;
/** Canonical Appeal record. Passthrough resource — keep shape open. */
export interface AppealResource {
    id?: number;
    [key: string]: unknown;
}
/**
 * Body for `POST /api/appeal` and the `PUT /api/appeal/{appeal}` update.
 * The Appeal request class extends `BaseRequest` which inherits a freeform
 * rule set per-tenant — we type it as a generic record.
 */
export type AppealStoreInput = Record<string, unknown>;
/** PUT /api/appeal/{appeal} body — same passthrough shape as store. */
export type AppealUpdateInput = Record<string, unknown>;
/** POST /api/appeal/submit body — controller takes the request raw. */
export type AppealSubmitInput = Record<string, unknown>;
/** Response shape for the run / runGlobal endpoints (`{ data, chain }`). */
export interface AppealRunResource {
    data: unknown;
    chain: unknown;
    [key: string]: unknown;
}
/** Response shape for `/api/appeal/submit` (`{ success }`). */
export interface AppealSubmitResource {
    success: unknown;
    [key: string]: unknown;
}
//# sourceMappingURL=modules-appeal.d.ts.map