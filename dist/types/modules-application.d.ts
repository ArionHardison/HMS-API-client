/**
 * Type definitions for `Modules/Application`.
 *
 * Structural interfaces only — no runtime code. Mirrors
 * `Modules\Application\Transformers\ApplicationResource`, a passthrough
 * resource. Shape kept open via `[key: string]: unknown` so callers can
 * narrow when they know their tenant's column set.
 */
/** Identifier alias for the `{application}` route binding (id or slug). */
export type ApplicationId = number | string;
/** Identifier alias for the `{task}` (run-global) route binding. */
export type ApplicationTaskId = number | string;
/** Identifier alias for the `{chain}` (run) route binding. */
export type ApplicationChainId = number | string;
/** Canonical Application record. Passthrough resource — keep shape open. */
export interface ApplicationResource {
    id?: number;
    [key: string]: unknown;
}
/** POST /api/application body. */
export type ApplicationStoreInput = Record<string, unknown>;
/** PUT /api/application/{application} body — same passthrough shape. */
export type ApplicationUpdateInput = Record<string, unknown>;
/** POST /api/application/submit body — controller takes the request raw. */
export type ApplicationSubmitInput = Record<string, unknown>;
/** Response shape for run / runGlobal endpoints (`{ data, chain }`). */
export interface ApplicationRunResource {
    data: unknown;
    chain: unknown;
    [key: string]: unknown;
}
/** Response shape for `/api/application/submit` (`{ success }`). */
export interface ApplicationSubmitResource {
    success: unknown;
    [key: string]: unknown;
}
//# sourceMappingURL=modules-application.d.ts.map