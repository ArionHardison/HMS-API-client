/**
 * SubprojectWizardApiClient — covers `/api/subproject-wizard/{section}/{id}`
 * (6 endpoints, one per section). All `auth: admin`.
 *
 * Same six sections as the admin/create + admin/claim flows
 * (`SubprojectAdminApiClient`), but parameterized by the existing wizard
 * record id rather than slugged under `claim/subproject/{subproject}`.
 *
 * Source of truth: `sdk/spec/endpoints.json`.
 */
import { BaseApiClient } from '../api-client';
export class SubprojectWizardApiClient extends BaseApiClient {
    /** POST /api/subproject-wizard/content/{id} */
    async wizardContent(id, body) {
        return this.post(`/api/subproject-wizard/content/${encodeURIComponent(String(id))}`, body);
    }
    /** POST /api/subproject-wizard/domains/{id} */
    async wizardDomains(id, body) {
        return this.post(`/api/subproject-wizard/domains/${encodeURIComponent(String(id))}`, body);
    }
    /** POST /api/subproject-wizard/layout/{id} */
    async wizardLayout(id, body) {
        return this.post(`/api/subproject-wizard/layout/${encodeURIComponent(String(id))}`, body);
    }
    /** POST /api/subproject-wizard/seo/{id} */
    async wizardSeo(id, body) {
        return this.post(`/api/subproject-wizard/seo/${encodeURIComponent(String(id))}`, body);
    }
    /** POST /api/subproject-wizard/team/{id} */
    async wizardTeam(id, body) {
        return this.post(`/api/subproject-wizard/team/${encodeURIComponent(String(id))}`, body);
    }
    /** POST /api/subproject-wizard/template/{id} */
    async wizardTemplate(id, body) {
        return this.post(`/api/subproject-wizard/template/${encodeURIComponent(String(id))}`, body);
    }
}
// =============================================================================
// Re-export hint for `src/index.ts`
// -----------------------------------------------------------------------------
//   export { SubprojectWizardApiClient } from './api/subproject-wizard-api-client';
//   // Types re-exported from ./api/subproject-admin-api-client (shared shape).
// =============================================================================
//# sourceMappingURL=subproject-wizard-api-client.js.map