/**
 * Type definitions for `Modules/Report`.
 *
 * Structural interfaces only — no runtime code. Mirrors
 * `Modules\Report\Transformers\ReportResource`, a passthrough resource.
 * Shape kept open via `[key: string]: unknown` so callers can narrow when
 * they know the column set their tenant exposes.
 */

/** Identifier alias for the `{report}` route binding (id or slug). */
export type ReportId = number | string;

/** Identifier alias for the `{task}` (run-global) route binding. */
export type ReportTaskId = number | string;

/** Identifier alias for the `{chain}` (run) route binding. */
export type ReportChainId = number | string;

/** Canonical Report record. Passthrough resource — keep shape open. */
export interface ReportResource {
  id?: number;
  [key: string]: unknown;
}

/** POST /api/report body. */
export type ReportStoreInput = Record<string, unknown>;

/** PUT /api/report/{report} body. */
export type ReportUpdateInput = Record<string, unknown>;

/** POST /api/report/submit body — controller takes the request raw. */
export type ReportSubmitInput = Record<string, unknown>;

/** Response shape for run / runGlobal endpoints (`{ data, chain }`). */
export interface ReportRunResource {
  data: unknown;
  chain: unknown;
  [key: string]: unknown;
}

/** Response shape for `/api/report/submit` (`{ success }`). */
export interface ReportSubmitResource {
  success: unknown;
  [key: string]: unknown;
}
