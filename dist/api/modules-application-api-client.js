"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationModuleApiClient = void 0;
/**
 * `Modules/Application` API client.
 *
 * Covers the 9 endpoints documented in `sdk/spec/endpoints.json` with
 * `module === "Modules/Application"`:
 *
 *   - 5 CRUD endpoints (`application.{index,store,show,update,destroy}`)
 *   - 1 lifecycle endpoint (`POST /api/application/submit`)
 *   - 2 protocol-run reads (`run-global/{application}/{task}`,
 *     `run/{application}/{chain}`) — raw `{ data, chain }` shape, no
 *     Resource wrapper
 *   - 1 protocol-integration listing (`/api/protocol/application/all`)
 *
 * Class: `ApplicationModuleApiClient`. Auth: every route is `auth:api`.
 */
const api_client_1 = require("../api-client");
/**
 * Public client over the `/api/application/*` and `/api/protocol/application/*`
 * surfaces. Subclasses `BaseApiClient` for auth / `X-Domain` / `_method` /
 * `ApiError` handling.
 */
class ApplicationModuleApiClient extends api_client_1.BaseApiClient {
    // ---------------------------------------------------------------------------
    // CRUD
    // ---------------------------------------------------------------------------
    /** GET `/api/application`. (`application.index`) */
    list(opts) {
        return this.get('/api/application', undefined, opts);
    }
    /** POST `/api/application`. (`application.store`) */
    create(body, opts) {
        return this.post('/api/application', body, opts);
    }
    /** GET `/api/application/{application}`. (`application.show`) */
    show(application, opts) {
        return this.get(`/api/application/${encodeURIComponent(String(application))}`, undefined, opts);
    }
    /** PUT `/api/application/{application}` — sent as POST + `?_method=PUT`. (`application.update`) */
    update(application, body, opts) {
        return this.put(`/api/application/${encodeURIComponent(String(application))}`, body, opts);
    }
    /** DELETE `/api/application/{application}`. (`application.destroy`) */
    destroy(application, opts) {
        return this.delete(`/api/application/${encodeURIComponent(String(application))}`, opts);
    }
    // ---------------------------------------------------------------------------
    // Lifecycle
    // ---------------------------------------------------------------------------
    /** POST `/api/application/submit`. (`post.api.application.submit`) */
    submit(body, opts) {
        return this.post('/api/application/submit', body, opts);
    }
    // ---------------------------------------------------------------------------
    // Protocol run reads
    // ---------------------------------------------------------------------------
    /** GET `/api/application/run-global/{application}/{task}`. (`get.api.application.run-global.item.item`) */
    runGlobal(application, task, opts) {
        const a = encodeURIComponent(String(application));
        const t = encodeURIComponent(String(task));
        return this.get(`/api/application/run-global/${a}/${t}`, undefined, opts);
    }
    /** GET `/api/application/run/{application}/{chain}`. (`get.api.application.run.item.item`) */
    run(application, chain, opts) {
        const a = encodeURIComponent(String(application));
        const c = encodeURIComponent(String(chain));
        return this.get(`/api/application/run/${a}/${c}`, undefined, opts);
    }
    // ---------------------------------------------------------------------------
    // Protocol integration
    // ---------------------------------------------------------------------------
    /** GET `/api/protocol/application/all`. (`get.api.protocol.application.all`) */
    listProtocolApplications(opts) {
        return this.get('/api/protocol/application/all', undefined, opts);
    }
}
exports.ApplicationModuleApiClient = ApplicationModuleApiClient;
//# sourceMappingURL=modules-application-api-client.js.map