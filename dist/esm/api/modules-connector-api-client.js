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
/**
 * Public client over `/api/connector/*` and `/api/protocol/connector/all`.
 * Subclasses `BaseApiClient` for token / domain / `_method` handling.
 */
export class ConnectorModuleApiClient extends BaseApiClient {
    // ---------------------------------------------------------------------------
    // CRUD
    // ---------------------------------------------------------------------------
    /** GET `/api/connector` — list (paginated) all connectors. (`connector.index`) */
    list(opts) {
        return this.get('/api/connector', undefined, opts);
    }
    /** POST `/api/connector` — create a new connector. (`connector.store`) */
    create(body, opts) {
        return this.post('/api/connector', body, opts);
    }
    /** GET `/api/connector/{connector}`. (`connector.show`) */
    show(connector, opts) {
        const c = encodeURIComponent(String(connector));
        return this.get(`/api/connector/${c}`, undefined, opts);
    }
    /** PUT `/api/connector/{connector}` — sent as POST + `?_method=PUT`. (`connector.update`) */
    update(connector, body, opts) {
        const c = encodeURIComponent(String(connector));
        return this.put(`/api/connector/${c}`, body, opts);
    }
    /** DELETE `/api/connector/{connector}`. (`connector.destroy`) */
    destroy(connector, opts) {
        const c = encodeURIComponent(String(connector));
        return this.delete(`/api/connector/${c}`, opts);
    }
    // ---------------------------------------------------------------------------
    // Execution / run helpers
    // ---------------------------------------------------------------------------
    /** POST `/api/connector/execute`. (`post.api.connector.execute`) */
    execute(body, opts) {
        return this.post('/api/connector/execute', body, opts);
    }
    /** GET `/api/connector/run-global/{connector}/{task}`. (`get.api.connector.run-global.item.item`) */
    runGlobal(connector, task, opts) {
        const c = encodeURIComponent(String(connector));
        const t = encodeURIComponent(String(task));
        return this.get(`/api/connector/run-global/${c}/${t}`, undefined, opts);
    }
    /** GET `/api/connector/run/{connector}/{chain}`. (`get.api.connector.run.item.item`) */
    run(connector, chain, opts) {
        const c = encodeURIComponent(String(connector));
        const ch = encodeURIComponent(String(chain));
        return this.get(`/api/connector/run/${c}/${ch}`, undefined, opts);
    }
    /** GET `/api/connector/{connector}/discover` — list tools available on the connector. (`get.api.connector.item.discover`) */
    discover(connector, opts) {
        const c = encodeURIComponent(String(connector));
        return this.get(`/api/connector/${c}/discover`, undefined, opts);
    }
    // ---------------------------------------------------------------------------
    // Protocol integration
    // ---------------------------------------------------------------------------
    /** GET `/api/protocol/connector/all`. (`get.api.protocol.connector.all`) */
    listProtocolConnectors(opts) {
        return this.get('/api/protocol/connector/all', undefined, opts);
    }
}
//# sourceMappingURL=modules-connector-api-client.js.map