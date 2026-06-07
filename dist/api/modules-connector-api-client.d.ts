/**
 * `Modules/Connector` API client.
 *
 * Covers the 10 endpoints from `sdk/spec/endpoints.json` with
 * `module === "Modules/Connector"`:
 *
 *   - 5 RESTful CRUD endpoints (`connector.{index,store,show,update,destroy}`)
 *   - 1 execution endpoint (`POST /api/connector/execute`)
 *   - 2 run helpers — global tasks (`run-global/{connector}/{task}`) and
 *     chain-scoped (`run/{connector}/{chain}`)
 *   - 1 tool-discovery endpoint (`/api/connector/{connector}/discover`)
 *   - 1 protocol-integration listing (`/api/protocol/connector/all`)
 *
 * Naming policy: methods derive from `spec.id` minus the noisy
 * `get.api.connector.` / `post.api.connector.` prefixes, then camelCased.
 * RESTful CRUD methods follow Laravel conventions (`list/create/show/update/destroy`).
 *
 * Class is named `ConnectorModuleApiClient` to match the foundation slice
 * naming policy (avoid colliding with any future legacy `ConnectorApiClient`).
 *
 * All endpoints are `auth:api` upstream — Bearer required.
 */
import { BaseApiClient } from '../api-client';
import type { ApiRequestOptions, ApiResponse } from '../api-client';
import type { ConnectorChainId, ConnectorDiscoverResult, ConnectorExecuteResult, ConnectorId, ConnectorResource, ConnectorTaskId, CreateConnectorInput, ExecuteConnectorInput, UpdateConnectorInput } from '../types/modules-connector';
/**
 * Public client over `/api/connector/*` and `/api/protocol/connector/all`.
 * Subclasses `BaseApiClient` for token / domain / `_method` handling.
 */
export declare class ConnectorModuleApiClient extends BaseApiClient {
    /** GET `/api/connector` — list (paginated) all connectors. (`connector.index`) */
    list(opts?: ApiRequestOptions): Promise<ApiResponse<ConnectorResource[]>>;
    /** POST `/api/connector` — create a new connector. (`connector.store`) */
    create(body: CreateConnectorInput, opts?: ApiRequestOptions): Promise<ApiResponse<ConnectorResource>>;
    /** GET `/api/connector/{connector}`. (`connector.show`) */
    show(connector: ConnectorId, opts?: ApiRequestOptions): Promise<ApiResponse<ConnectorResource>>;
    /** PUT `/api/connector/{connector}` — sent as POST + `?_method=PUT`. (`connector.update`) */
    update(connector: ConnectorId, body: UpdateConnectorInput, opts?: ApiRequestOptions): Promise<ApiResponse<ConnectorResource>>;
    /** DELETE `/api/connector/{connector}`. (`connector.destroy`) */
    destroy(connector: ConnectorId, opts?: ApiRequestOptions): Promise<ApiResponse<ConnectorResource>>;
    /** POST `/api/connector/execute`. (`post.api.connector.execute`) */
    execute(body: ExecuteConnectorInput, opts?: ApiRequestOptions): Promise<ApiResponse<ConnectorExecuteResult>>;
    /** GET `/api/connector/run-global/{connector}/{task}`. (`get.api.connector.run-global.item.item`) */
    runGlobal(connector: ConnectorId, task: ConnectorTaskId, opts?: ApiRequestOptions): Promise<ApiResponse<unknown>>;
    /** GET `/api/connector/run/{connector}/{chain}`. (`get.api.connector.run.item.item`) */
    run(connector: ConnectorId, chain: ConnectorChainId, opts?: ApiRequestOptions): Promise<ApiResponse<unknown>>;
    /** GET `/api/connector/{connector}/discover` — list tools available on the connector. (`get.api.connector.item.discover`) */
    discover(connector: ConnectorId, opts?: ApiRequestOptions): Promise<ApiResponse<ConnectorDiscoverResult>>;
    /** GET `/api/protocol/connector/all`. (`get.api.protocol.connector.all`) */
    listProtocolConnectors(opts?: ApiRequestOptions): Promise<ApiResponse<ConnectorResource[]>>;
}
//# sourceMappingURL=modules-connector-api-client.d.ts.map