"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportModuleApiClient = void 0;
/**
 * `Modules/Report` API client.
 *
 * Covers the 9 endpoints documented in `sdk/spec/endpoints.json` with
 * `module === "Modules/Report"`:
 *
 *   - 5 CRUD endpoints (`report.{index,store,show,update,destroy}`)
 *   - 1 lifecycle endpoint (`POST /api/report/submit`)
 *   - 2 protocol-run reads (`run-global/{report}/{task}`,
 *     `run/{report}/{chain}`) — raw `{ data, chain }` shape
 *   - 1 protocol-integration listing (`/api/protocol/report/all`)
 *
 * Class: `ReportModuleApiClient`. Auth: every route is `auth:api`.
 */
const api_client_1 = require("../api-client");
/**
 * Public client over `/api/report/*` and `/api/protocol/report/*`.
 * Subclasses `BaseApiClient` for auth / `X-Domain` / `_method` / `ApiError`.
 */
class ReportModuleApiClient extends api_client_1.BaseApiClient {
    // ---------------------------------------------------------------------------
    // CRUD
    // ---------------------------------------------------------------------------
    /** GET `/api/report`. (`report.index`) */
    list(opts) {
        return this.get('/api/report', undefined, opts);
    }
    /** POST `/api/report`. (`report.store`) */
    create(body, opts) {
        return this.post('/api/report', body, opts);
    }
    /** GET `/api/report/{report}`. (`report.show`) */
    show(report, opts) {
        return this.get(`/api/report/${encodeURIComponent(String(report))}`, undefined, opts);
    }
    /** PUT `/api/report/{report}` — sent as POST + `?_method=PUT`. (`report.update`) */
    update(report, body, opts) {
        return this.put(`/api/report/${encodeURIComponent(String(report))}`, body, opts);
    }
    /** DELETE `/api/report/{report}`. (`report.destroy`) */
    destroy(report, opts) {
        return this.delete(`/api/report/${encodeURIComponent(String(report))}`, opts);
    }
    // ---------------------------------------------------------------------------
    // Lifecycle
    // ---------------------------------------------------------------------------
    /** POST `/api/report/submit`. (`post.api.report.submit`) */
    submit(body, opts) {
        return this.post('/api/report/submit', body, opts);
    }
    // ---------------------------------------------------------------------------
    // Protocol run reads
    // ---------------------------------------------------------------------------
    /** GET `/api/report/run-global/{report}/{task}`. (`get.api.report.run-global.item.item`) */
    runGlobal(report, task, opts) {
        const r = encodeURIComponent(String(report));
        const t = encodeURIComponent(String(task));
        return this.get(`/api/report/run-global/${r}/${t}`, undefined, opts);
    }
    /** GET `/api/report/run/{report}/{chain}`. (`get.api.report.run.item.item`) */
    run(report, chain, opts) {
        const r = encodeURIComponent(String(report));
        const c = encodeURIComponent(String(chain));
        return this.get(`/api/report/run/${r}/${c}`, undefined, opts);
    }
    // ---------------------------------------------------------------------------
    // Protocol integration
    // ---------------------------------------------------------------------------
    /** GET `/api/protocol/report/all`. (`get.api.protocol.report.all`) */
    listProtocolReports(opts) {
        return this.get('/api/protocol/report/all', undefined, opts);
    }
}
exports.ReportModuleApiClient = ReportModuleApiClient;
//# sourceMappingURL=modules-report-api-client.js.map