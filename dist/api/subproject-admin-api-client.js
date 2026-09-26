"use strict";
/**
 * SubprojectAdminApiClient — covers the create-section and claim-section flows
 * under `/api/subproject-admin/create/subproject/*` and
 * `/api/subproject-admin/claim/subproject/{subproject}/*` (12 endpoints).
 * All `auth: admin` (Bearer required, admin-scoped).
 *
 * NOTE: The non-section endpoints under `/api/subproject-admin/*`
 * (account-data, confirm-account, create-account, etc.) are owned by
 * `TenancyApiClient` and are NOT included here.
 *
 * Source of truth: `sdk/spec/endpoints.json`.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubprojectAdminApiClient = void 0;
const api_client_1 = require("../api-client");
class SubprojectAdminApiClient extends api_client_1.BaseApiClient {
    // ---------------------------------------------------------------------------
    // /api/subproject-admin/create/subproject/{section} — fresh subproject flow.
    // ---------------------------------------------------------------------------
    /** POST /api/subproject-admin/create/subproject/content */
    async createSubprojectContent(body) {
        return this.post('/api/subproject-admin/create/subproject/content', body);
    }
    /** POST /api/subproject-admin/create/subproject/domains */
    async createSubprojectDomains(body) {
        return this.post('/api/subproject-admin/create/subproject/domains', body);
    }
    /** POST /api/subproject-admin/create/subproject/layout */
    async createSubprojectLayout(body) {
        return this.post('/api/subproject-admin/create/subproject/layout', body);
    }
    /** POST /api/subproject-admin/create/subproject/seo */
    async createSubprojectSeo(body) {
        return this.post('/api/subproject-admin/create/subproject/seo', body);
    }
    /** POST /api/subproject-admin/create/subproject/team */
    async createSubprojectTeam(body) {
        return this.post('/api/subproject-admin/create/subproject/team', body);
    }
    /** POST /api/subproject-admin/create/subproject/template */
    async createSubprojectTemplate(body) {
        return this.post('/api/subproject-admin/create/subproject/template', body);
    }
    // ---------------------------------------------------------------------------
    // /api/subproject-admin/claim/subproject/{subproject}/{section} — claim/edit
    // an existing subproject.
    // ---------------------------------------------------------------------------
    /** POST /api/subproject-admin/claim/subproject/{subproject}/content */
    async claimSubprojectContent(subproject, body) {
        return this.post(`/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/content`, body);
    }
    /** POST /api/subproject-admin/claim/subproject/{subproject}/domains */
    async claimSubprojectDomains(subproject, body) {
        return this.post(`/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/domains`, body);
    }
    /** POST /api/subproject-admin/claim/subproject/{subproject}/layout */
    async claimSubprojectLayout(subproject, body) {
        return this.post(`/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/layout`, body);
    }
    /** POST /api/subproject-admin/claim/subproject/{subproject}/seo */
    async claimSubprojectSeo(subproject, body) {
        return this.post(`/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/seo`, body);
    }
    /** POST /api/subproject-admin/claim/subproject/{subproject}/team */
    async claimSubprojectTeam(subproject, body) {
        return this.post(`/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/team`, body);
    }
    /** POST /api/subproject-admin/claim/subproject/{subproject}/template */
    async claimSubprojectTemplate(subproject, body) {
        return this.post(`/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/template`, body);
    }
}
exports.SubprojectAdminApiClient = SubprojectAdminApiClient;
//# sourceMappingURL=subproject-admin-api-client.js.map