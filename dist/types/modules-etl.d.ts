/**
 * Type definitions for `Modules/ETL`.
 *
 * Structural interfaces only. Mirrors the request shapes captured in
 * `sdk/spec/endpoints.json` (module === "Modules/ETL"). The ETL pipeline
 * runs async — `etl.process` and friends return a pipeline id; clients
 * poll `etl.status` (`getStatus(pipelineId)`) until terminal state.
 */
/** Pipeline identifier — server-issued opaque string. */
export type PipelineId = string;
/**
 * `GET /api/v1/etl/components` response — discovery endpoint listing
 * registered extract / transform / load components. Open shape because
 * components are pluggable.
 */
export interface ETLComponentsResource {
    components?: unknown;
    [key: string]: unknown;
}
/**
 * `GET /api/v1/etl/status/{pipelineId}` response. The server publishes
 * status with at minimum `{ status, progress }`; full per-pipeline detail
 * is open. Callers can poll this for completion.
 */
export interface ETLStatusResource {
    status?: unknown;
    progress?: unknown;
    [key: string]: unknown;
}
/** `GET /api/protocol/etl/all` — protocol-integration listing. */
export interface ETLProtocolIntegrationResource {
    [key: string]: unknown;
}
/**
 * `POST /api/v1/etl/process` body. Spec rules:
 *   - parameters         required|array
 *   - parameters.q       required|string
 *   - transform_options  nullable|array
 *   - destination        nullable|array
 */
export interface ETLProcessInput {
    parameters: {
        q: string;
    } & Record<string, unknown>;
    transform_options?: unknown;
    destination?: unknown;
}
/**
 * `POST /api/v1/etl/agent/process` body. Spec rules:
 *   - agent_id  required|string
 *   - query     required|string|min:3
 *   - context   nullable|string
 *   - format    open
 */
export interface ETLAgentProcessInput {
    agent_id: string;
    query: string;
    context?: string;
    format?: unknown;
}
/**
 * `POST /api/v1/etl/search-analyze` body. Spec rules:
 *   - query        required|string|min:3
 *   - context      open
 *   - threshold    nullable|numeric|min:0|max:1
 *   - destination  open
 */
export interface ETLSearchAnalyzeInput {
    query: string;
    context?: unknown;
    threshold?: number;
    destination?: unknown;
}
/**
 * Response wrapper for `process` / `agent-process` / `search-analyze`.
 * The server-side controller emits open-shaped JSON; we leave it
 * pass-through and let downstream callers narrow.
 */
export interface ETLPipelineResource {
    pipelineId?: PipelineId;
    [key: string]: unknown;
}
/** Response for `etl.cancel`. */
export interface ETLCancelResource {
    canceled?: unknown;
    [key: string]: unknown;
}
//# sourceMappingURL=modules-etl.d.ts.map