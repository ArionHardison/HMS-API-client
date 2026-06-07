"use strict";
/**
 * ProjectSettingsApiClient — covers `/api/project-settings/{section}/{...}`
 * (10 endpoints — 5 sections × {show GET, save POST}). All `auth: admin`.
 *
 * Five sections: content, domains, layout, seo, template. NOTE: there is
 * NO `team` section under `/api/project-settings/*` (team lives under the
 * subproject-admin / subproject-wizard surfaces).
 *
 * The `{subproject?}` path param is optional in Laravel — when omitted the
 * controller defaults to the caller's primary subproject. The SDK accepts
 * `undefined` to omit the segment entirely.
 *
 * Source of truth: `sdk/spec/endpoints.json`.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectSettingsApiClient = void 0;
const api_client_1 = require("../api-client");
function buildSectionPath(section, subproject) {
    return subproject == null
        ? `/api/project-settings/${section}`
        : `/api/project-settings/${section}/${encodeURIComponent(String(subproject))}`;
}
function buildShowPath(section, subproject) {
    return subproject == null
        ? `/api/project-settings/${section}/show`
        : `/api/project-settings/${section}/show/${encodeURIComponent(String(subproject))}`;
}
class ProjectSettingsApiClient extends api_client_1.BaseApiClient {
    // ---------------------------------------------------------------------------
    // content
    // ---------------------------------------------------------------------------
    /** GET /api/project-settings/content/show/{subproject?} */
    async showContent(subproject) {
        return this.get(buildShowPath('content', subproject));
    }
    /** POST /api/project-settings/content/{subproject?} */
    async saveContent(body, subproject) {
        return this.post(buildSectionPath('content', subproject), body);
    }
    // ---------------------------------------------------------------------------
    // domains
    // ---------------------------------------------------------------------------
    /** GET /api/project-settings/domains/show/{subproject?} */
    async showDomains(subproject) {
        return this.get(buildShowPath('domains', subproject));
    }
    /** POST /api/project-settings/domains/{subproject?} */
    async saveDomains(body, subproject) {
        return this.post(buildSectionPath('domains', subproject), body);
    }
    // ---------------------------------------------------------------------------
    // layout
    // ---------------------------------------------------------------------------
    /** GET /api/project-settings/layout/show/{subproject?} */
    async showLayout(subproject) {
        return this.get(buildShowPath('layout', subproject));
    }
    /** POST /api/project-settings/layout/{subproject?} */
    async saveLayout(body, subproject) {
        return this.post(buildSectionPath('layout', subproject), body);
    }
    // ---------------------------------------------------------------------------
    // seo
    // ---------------------------------------------------------------------------
    /** GET /api/project-settings/seo/show/{subproject?} */
    async showSeo(subproject) {
        return this.get(buildShowPath('seo', subproject));
    }
    /** POST /api/project-settings/seo/{subproject?} */
    async saveSeo(body, subproject) {
        return this.post(buildSectionPath('seo', subproject), body);
    }
    // ---------------------------------------------------------------------------
    // template
    // ---------------------------------------------------------------------------
    /** GET /api/project-settings/template/show/{subproject?} */
    async showTemplate(subproject) {
        return this.get(buildShowPath('template', subproject));
    }
    /** POST /api/project-settings/template/{subproject?} */
    async saveTemplate(body, subproject) {
        return this.post(buildSectionPath('template', subproject), body);
    }
}
exports.ProjectSettingsApiClient = ProjectSettingsApiClient;
// =============================================================================
// Re-export hint for `src/index.ts`
// -----------------------------------------------------------------------------
//   export { ProjectSettingsApiClient } from './api/project-settings-api-client';
//   export type {
//     ProjectSettingsContentRequest,
//     ProjectSettingsDomainsRequest,
//   } from './api/project-settings-api-client';
// =============================================================================
//# sourceMappingURL=project-settings-api-client.js.map