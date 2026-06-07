/**
 * DashboardProgramApiClient — covers `/api/dashboard-program*`,
 * `/api/dashboard-settings/get`, and `/api/protocol-category/{protocol_category}`
 * (7 endpoints).
 *
 * Auth bands:
 *   - dashboard-program/* → `auth: api`
 *   - dashboard-settings/get → `auth: public` (call with `{ auth: false }`)
 *   - protocol-category/{id} (PUT) → `auth: api`
 *
 * Source of truth: `sdk/spec/endpoints.json`.
 */
import { BaseApiClient } from '../api-client';
export class DashboardProgramApiClient extends BaseApiClient {
    // ---------------------------------------------------------------------------
    // /api/dashboard-program (resource — index, store, show, update, destroy)
    // ---------------------------------------------------------------------------
    /** GET /api/dashboard-program */
    async listDashboardPrograms() {
        return this.get('/api/dashboard-program');
    }
    /** POST /api/dashboard-program */
    async createDashboardProgram(body = {}) {
        return this.post('/api/dashboard-program', body);
    }
    /** GET /api/dashboard-program/{dashboard_program} */
    async showDashboardProgram(dashboardProgram) {
        return this.get(`/api/dashboard-program/${encodeURIComponent(String(dashboardProgram))}`);
    }
    /** PUT /api/dashboard-program/{dashboard_program} — POST + `?_method=PUT`. */
    async updateDashboardProgram(dashboardProgram, body) {
        return this.put(`/api/dashboard-program/${encodeURIComponent(String(dashboardProgram))}`, body);
    }
    /** DELETE /api/dashboard-program/{dashboard_program} */
    async destroyDashboardProgram(dashboardProgram) {
        return this.delete(`/api/dashboard-program/${encodeURIComponent(String(dashboardProgram))}`);
    }
    // ---------------------------------------------------------------------------
    // /api/dashboard-settings/get (public)
    // ---------------------------------------------------------------------------
    /** GET /api/dashboard-settings/get — `auth: public`. */
    async getDashboardSettings() {
        return this.get('/api/dashboard-settings/get', undefined, { auth: false });
    }
    // ---------------------------------------------------------------------------
    // /api/protocol-category/{protocol_category} (PUT only — the rest are owned
    // by another slice).
    // ---------------------------------------------------------------------------
    /** PUT /api/protocol-category/{protocol_category} — POST + `?_method=PUT`. */
    async updateProtocolCategory(protocolCategory, body) {
        return this.put(`/api/protocol-category/${encodeURIComponent(String(protocolCategory))}`, body);
    }
}
// =============================================================================
// Re-export hint for `src/index.ts`
// -----------------------------------------------------------------------------
//   export { DashboardProgramApiClient } from './api/dashboard-program-api-client';
//   export type {
//     CreateDashboardProgramRequest,
//     DashboardProgramRecord,
//     DashboardSettingsResponse,
//     ProtocolCategoryRecord,
//     UpdateDashboardProgramRequest,
//     UpdateProtocolCategoryRequest,
//   } from './api/dashboard-program-api-client';
// =============================================================================
//# sourceMappingURL=dashboard-program-api-client.js.map