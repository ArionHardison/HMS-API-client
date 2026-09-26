/**
 * Type definitions for `Modules/ETL`.
 *
 * Structural interfaces only. Mirrors the request shapes captured in
 * `sdk/spec/endpoints.json` (module === "Modules/ETL"). The ETL pipeline
 * runs async — `etl.process` and friends return a pipeline id; clients
 * poll `etl.status` (`getStatus(pipelineId)`) until terminal state.
 */
export {};
//# sourceMappingURL=modules-etl.js.map