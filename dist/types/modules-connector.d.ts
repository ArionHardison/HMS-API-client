/**
 * Type definitions for `Modules/Connector`.
 *
 * Structural interfaces only — no runtime code. Mirrors the
 * `Modules\Connector\Transformers\ConnectorResource` plus the
 * `CreateConnectorRequest` / `UpdateConnectorRequest` shapes captured in
 * `sdk/spec/endpoints.json` (module === "Modules/Connector").
 */
/** Identifier alias matching the Laravel `{connector}` route binding. */
export type ConnectorId = number | string;
/** Identifier alias for the protocol-personal-chain `{chain}` binding on run endpoints. */
export type ConnectorChainId = number | string;
/** Identifier alias for the global `{task}` binding on run-global. */
export type ConnectorTaskId = number | string;
/**
 * Connector record returned by index / show / store / update / destroy /
 * `protocol/connector/all`. The upstream PHP resource is intentionally
 * loose (`shape:{}` in the spec) so we keep this open for downstream
 * narrowing.
 */
export interface ConnectorResource {
    id?: number;
    title?: unknown;
    description?: unknown;
    server_command?: unknown;
    server_args?: unknown;
    server_env?: unknown;
    selected_tool?: unknown;
    tool_parameters?: unknown;
    timeout?: unknown;
    [key: string]: unknown;
}
/**
 * `POST /api/connector/execute` response body — the controller bypasses
 * the resource transformer and returns raw `{ success, result }`.
 */
export interface ConnectorExecuteResult {
    success: unknown;
    result: unknown;
}
/**
 * `GET /api/connector/{connector}/discover` response — bare `{ tools }`
 * envelope, no resource transformer.
 */
export interface ConnectorDiscoverResult {
    tools: unknown;
}
/**
 * `POST /api/connector` body. Mirrors `CreateConnectorRequest` rules:
 *   - `title`         required, string, max:128
 *   - `description`   sometimes, string, max:1000
 *   - `server_command` required, string, max:255
 *   - `server_args`    sometimes, array
 *   - `server_env`     sometimes, array
 *   - `selected_tool`  sometimes, string, max:255
 *   - `tool_parameters` sometimes, array
 *   - `timeout`        sometimes, integer, min:1, max:300
 */
export interface CreateConnectorInput {
    title: string;
    description?: string;
    server_command: string;
    server_args?: unknown;
    server_env?: unknown;
    selected_tool?: string;
    tool_parameters?: unknown;
    timeout?: number;
}
/** `PUT /api/connector/{connector}` body — same shape as create per the spec. */
export type UpdateConnectorInput = CreateConnectorInput;
/** `POST /api/connector/execute` body. */
export interface ExecuteConnectorInput {
    id: number;
    chain_id: number;
}
//# sourceMappingURL=modules-connector.d.ts.map