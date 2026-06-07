"use strict";
/**
 * SubprojectApiClient — the hierarchy-aware successor to the legacy
 * `TenancyApiClient`. Tenants are flat siblings; subprojects inherit
 * from parents (per the long-standing memory rule). The rename is
 * semantic, not cosmetic.
 *
 * This class is the canonical multi-tenant boot + subproject lifecycle
 * client. It covers the same surface the old `TenancyApiClient`
 * covered:
 *
 *   - CI-WWW boot endpoints (/api/load, /api/board, /api/leader,
 *     /api/interface/load-interface, /api/authenticate-at/{tenant},
 *     /api/public/logo/{tenant})
 *   - Subproject CRUD + search
 *   - Subproject admin lifecycle (account, claim, create-greenfield)
 *   - Subproject team (invites + permissions)
 *   - Subproject wizard (live editing)
 *   - Project settings (live, post-creation domain settings UI)
 *   - Tenant claim
 *   - Tenant interface graph
 *   - Domain interfaces
 *   - World locations / public country directory
 *   - Gov directory (public)
 *   - Frontend + SEO pages
 *   - Creator + featured (gov-side admin)
 *   - Contacts
 *   - Documentation
 *
 * What's new (Lane A / CI-MFE#12):
 *
 *   - `loadSubproject()` (override) — same endpoint (GET /api/load),
 *     but the returned payload is normalized to the hierarchy-aware
 *     `Subproject` shape, with `parent_subproject_id` and `chain`
 *     guaranteed present (null + [] when api/ omits them).
 *
 *   - `getDpgInstances(id)` — GET /api/subprojects/{id}/dpg-instances.
 *     Returns the DPG bindings for a subproject, including the
 *     `inherited_from_subproject_id` field that attributes inherited
 *     bindings back to the ancestor that contributed them.
 *
 * Source-of-truth for the existing endpoint shapes:
 * `sdk/spec/endpoints.json`. Every method here mirrors one entry from
 * that spec; the `tenant`-prefixed Laravel routes (tenant-claim,
 * tenant-interface-*, tenant-registration) keep their on-the-wire
 * paths but the SDK exposes them via subproject-named methods where
 * the rename makes sense — see method JSDoc on each.
 *
 * The class extends `BaseApiClient`, which already handles Bearer
 * injection (skippable per call via `{ auth: false }`), `X-Domain`
 * header, PUT/PATCH → POST + `_method=`, FormData switching for
 * `File`/`Blob` payloads, and 401/422 callback dispatch.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubprojectApiClient = void 0;
const api_client_1 = require("../api-client");
/**
 * Helper: append an optional path segment when a value is provided. Used
 * for the `{subproject?}` Laravel optional path parameters scattered across
 * this slice.
 */
function tail(value) {
    if (value === undefined || value === null || value === '')
        return '';
    return `/${encodeURIComponent(String(value))}`;
}
class SubprojectApiClient extends api_client_1.BaseApiClient {
    // ===========================================================================
    // CI-WWW boot endpoints (hierarchy-aware loadSubproject lives here)
    // ===========================================================================
    /**
     * GET /api/load — load the active subproject's boot data, normalized
     * to the hierarchy-aware `Subproject` shape.
     *
     * Public endpoint (no Bearer required). Special-cased: 404 must NOT
     * throw — CI-WWW renders a "subproject not found" page from the
     * false branch. Returns a discriminated union so callers can switch
     * on `.ok`.
     *
     * Normalization (additive over the legacy `TenancyApiClient`
     * version):
     *
     *   - `parent_subproject_id` defaults to `null` when missing on the
     *     api/ payload.
     *   - `chain` defaults to `[]` when missing. The api/ side is
     *     expected to project this as a pre-flattened ancestor list,
     *     leaf -> root, EXCLUDING the leaf — see the Subproject type
     *     docs. Until the sibling api/ ticket lands, every leaf will
     *     just see `chain: []` and behave like a root, which is
     *     intentional: existing flat-subproject installs keep working
     *     without any api/ change.
     *
     * Discriminator is *presence of `data`*, not a `success` flag. The
     * Laravel side emits `{"data": {…}}` on hit (via JsonResource or
     * manual wrap for the apex root) and `{"error": "Subproject not
     * found"}` with no `data` field on miss.
     */
    async loadSubproject() {
        const res = await this.request('/api/load', { method: 'GET' }, { auth: false, validateStatus: () => true });
        const env = res;
        if (env && env.data && typeof env.data === 'object') {
            const raw = env.data;
            const normalized = {
                ...raw,
                id: typeof raw.id === 'number' ? raw.id : Number(raw.id),
                name: raw.name,
                parent_subproject_id: typeof raw.parent_subproject_id === 'number'
                    ? raw.parent_subproject_id
                    : raw.parent_subproject_id == null
                        ? null
                        : Number(raw.parent_subproject_id),
                chain: Array.isArray(raw.chain) ? raw.chain : [],
            };
            return { status: 200, ok: true, data: normalized };
        }
        return { status: 404, ok: false, data: null };
    }
    /**
     * @deprecated Use `loadSubproject()` — we don't have "tenants", we
     * have subprojects. Kept as an alias so existing callers in `app/`,
     * `gov/`, and `sys/` keep working until they migrate. Will be
     * removed in 2.0.0.
     */
    async loadTenant() {
        return this.loadSubproject();
    }
    /** GET /api/board — public dashboard defaults. */
    async loadBoard() {
        return this.get('/api/board', undefined, { auth: false });
    }
    /** GET /api/leader — public leader info. */
    async loadLeader() {
        return this.get('/api/leader', undefined, { auth: false });
    }
    /** GET /api/interface/load-interface — public interface payload. */
    async loadInterface() {
        return this.get('/api/interface/load-interface', undefined, { auth: false });
    }
    /** GET /api/authenticate-at/{tenant} — auth=api. */
    async authenticateAtTenant(tenant) {
        return this.get(`/api/authenticate-at/${encodeURIComponent(tenant)}`);
    }
    /** GET /api/public/logo/{tenant} — public tenant logo. */
    async getPublicTenantLogo(tenant) {
        return this.get(`/api/public/logo/${encodeURIComponent(tenant)}`, undefined, { auth: false });
    }
    // ===========================================================================
    // Hierarchy-aware DPG instance bindings
    // ===========================================================================
    /**
     * GET /api/subprojects/{id}/dpg-instances — return the DPG bindings
     * for a specific subproject, including which ancestor (if any)
     * contributed each binding via inheritance.
     *
     * Auth: api guard (Bearer required). The endpoint is per-subproject
     * by id rather than X-Domain-resolved because the hierarchy view
     * intentionally allows reading across the inheritance chain (an
     * ancestor's bindings show up on the leaf with
     * `inherited_from_subproject_id` set to the ancestor's id).
     *
     * IMPORTANT: as of SDK 1.3.0 the matching api/ route does not yet
     * exist — `subproject_dpg_instances` is modeled in
     * `api/Modules/Systems/` (`SubprojectDpgInstance` entity +
     * migration), but only the X-Domain-scoped `GET
     * /api/v1/subprojects/current/system` reads it today. Sibling api/
     * work is required to:
     *
     *   1. Add `Route::get('subprojects/{id}/dpg-instances', ...)` under
     *      the `auth:api` middleware (api/Modules/Systems/Routes/api.php).
     *   2. Resolve `inherited_from_subproject_id` server-side by walking
     *      the `parent_project` chain and overlaying the leaf's own
     *      bindings on top of each ancestor's (leaf wins per system_key).
     *
     * Consumers can mock this route via MSW in the meantime — see
     * `src/api/__tests__/subproject.test.ts` for the contract.
     */
    async getDpgInstances(id) {
        return this.get(`/api/subprojects/${encodeURIComponent(String(id))}/dpg-instances`);
    }
    /**
     * GET /api/v1/subprojects/current/system — read-only DPG / system
     * config for the X-Domain-resolved subproject. Public endpoint (no
     * Bearer required); the data exposed is non-sensitive (DNS-derived).
     * The Systems module owns this route on the backend — see
     * `api/Modules/Systems/Routes/api.php` and `SubprojectSystemsController`.
     *
     * Shape is left open (`SubprojectSystemData`) because the upstream
     * controller is still maturing; consumers should cast to a stricter
     * type at the call site if they need one.
     */
    async getCurrentSubprojectSystem() {
        return this.get('/api/v1/subprojects/current/system', undefined, { auth: false });
    }
    // ===========================================================================
    // Subproject CRUD
    // ===========================================================================
    /** GET /api/subproject (paginated). */
    async listSubprojects(params) {
        return this.get('/api/subproject', params);
    }
    /** GET /api/subproject/all */
    async listAllSubprojects() {
        return this.get('/api/subproject/all');
    }
    /** GET /api/subproject/{subproject} */
    async showSubproject(subproject) {
        return this.get(`/api/subproject/${encodeURIComponent(String(subproject))}`);
    }
    /** DELETE /api/subproject/{subproject} */
    async deleteSubproject(subproject) {
        return this.delete(`/api/subproject/${encodeURIComponent(String(subproject))}`);
    }
    /** POST /api/subproject/delete-category/{subproject} */
    async deleteSubprojectCategory(subproject, body) {
        return this.post(`/api/subproject/delete-category/${encodeURIComponent(String(subproject))}`, body);
    }
    // ===========================================================================
    // Subproject admin lifecycle
    // ===========================================================================
    /** GET /api/subproject-admin/account-data */
    async getSubprojectAdminAccountData() {
        return this.get('/api/subproject-admin/account-data');
    }
    /** POST /api/subproject-admin/confirm-account */
    async confirmSubprojectAdminAccount(body) {
        return this.post('/api/subproject-admin/confirm-account', body);
    }
    /** POST /api/subproject-admin/create-account (public). */
    async createSubprojectAdminAccount(body) {
        return this.post('/api/subproject-admin/create-account', body, { auth: false });
    }
    /** GET /api/subproject-admin/create-subscription */
    async createSubprojectAdminSubscription() {
        return this.get('/api/subproject-admin/create-subscription');
    }
    /** POST /api/subproject-admin/find-claimable */
    async findClaimableSubproject(body) {
        return this.post('/api/subproject-admin/find-claimable', body);
    }
    /** GET /api/subproject-admin/get-allowed-countries (public). */
    async getSubprojectAdminAllowedCountries() {
        return this.get('/api/subproject-admin/get-allowed-countries', undefined, { auth: false });
    }
    /** POST /api/subproject-admin/login (public). */
    async subprojectAdminLogin(body) {
        return this.post('/api/subproject-admin/login', body, { auth: false });
    }
    /** POST /api/subproject-admin/subproject/has-contacts */
    async subprojectAdminHasContacts(body) {
        return this.post('/api/subproject-admin/subproject/has-contacts', body);
    }
    /** GET /api/subproject-admin/subscription-status */
    async getSubprojectAdminSubscriptionStatus() {
        return this.get('/api/subproject-admin/subscription-status');
    }
    /** POST /api/subproject-admin/start-claiming/{subproject}/claim */
    async startSubprojectClaim(subproject, body) {
        return this.post(`/api/subproject-admin/start-claiming/${encodeURIComponent(String(subproject))}/claim`, body);
    }
    // -- claim sections (saving step bodies for an in-flight claim) -------------
    /** POST /api/subproject-admin/claim/subproject/{subproject}/content */
    async saveClaimedSubprojectContent(subproject, body) {
        return this.post(`/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/content`, body);
    }
    /** POST /api/subproject-admin/claim/subproject/{subproject}/domains */
    async saveClaimedSubprojectDomains(subproject, body) {
        return this.post(`/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/domains`, body);
    }
    /** POST /api/subproject-admin/claim/subproject/{subproject}/layout */
    async saveClaimedSubprojectLayout(subproject, body) {
        return this.post(`/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/layout`, body);
    }
    /** POST /api/subproject-admin/claim/subproject/{subproject}/seo */
    async saveClaimedSubprojectSeo(subproject, body) {
        return this.post(`/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/seo`, body);
    }
    /** POST /api/subproject-admin/claim/subproject/{subproject}/team */
    async saveClaimedSubprojectTeam(subproject, body) {
        return this.post(`/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/team`, body);
    }
    /** POST /api/subproject-admin/claim/subproject/{subproject}/template */
    async saveClaimedSubprojectTemplate(subproject, body) {
        return this.post(`/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/template`, body);
    }
    /** GET /api/subproject-admin/claim/subproject/{subproject}/wizard-instance */
    async getClaimedSubprojectWizardInstance(subproject) {
        return this.get(`/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/wizard-instance`);
    }
    // -- create sections (greenfield subproject creation flow) ------------------
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
    // ===========================================================================
    // Subproject misc
    // ===========================================================================
    /** POST /api/subproject-search */
    async searchSubprojects(body) {
        return this.post('/api/subproject-search', body);
    }
    /** GET /api/subproject-settings */
    async getSubprojectSettings() {
        return this.get('/api/subproject-settings');
    }
    /** GET /api/subproject-types */
    async getSubprojectTypes() {
        return this.get('/api/subproject-types');
    }
    // ===========================================================================
    // Subproject team
    // ===========================================================================
    /** DELETE /api/subproject-team/delete-invite/{id}/{subproject?} */
    async deleteSubprojectTeamInvite(id, subproject) {
        return this.delete(`/api/subproject-team/delete-invite/${encodeURIComponent(String(id))}${tail(subproject)}`);
    }
    /** GET /api/subproject-team/get-invites/{subproject?} */
    async getSubprojectTeamInvites(subproject) {
        return this.get(`/api/subproject-team/get-invites${tail(subproject)}`);
    }
    /** POST /api/subproject-team/renew-token/{subproject?} */
    async renewSubprojectTeamToken(subprojectOrBody, body) {
        // Two call shapes supported: (subproject, body) or (body) without
        // subproject. The first positional is the optional path param.
        const isPathFirst = typeof subprojectOrBody === 'number' ||
            typeof subprojectOrBody === 'string';
        const subproject = isPathFirst ? subprojectOrBody : undefined;
        const payload = isPathFirst ? (body ?? {}) : subprojectOrBody;
        return this.post(`/api/subproject-team/renew-token${tail(subproject)}`, payload);
    }
    /** POST /api/subproject-team/send-invites/{subproject?} */
    async sendSubprojectTeamInvites(subprojectOrBody, body) {
        const isPathFirst = typeof subprojectOrBody === 'number' ||
            typeof subprojectOrBody === 'string';
        const subproject = isPathFirst ? subprojectOrBody : undefined;
        const payload = isPathFirst
            ? (body ?? {})
            : subprojectOrBody;
        return this.post(`/api/subproject-team/send-invites${tail(subproject)}`, payload);
    }
    /** POST /api/subproject-team/update-permissions/{subproject?} */
    async updateSubprojectTeamPermissions(subprojectOrBody, body) {
        const isPathFirst = typeof subprojectOrBody === 'number' ||
            typeof subprojectOrBody === 'string';
        const subproject = isPathFirst ? subprojectOrBody : undefined;
        const payload = isPathFirst
            ? (body ?? {})
            : subprojectOrBody;
        return this.post(`/api/subproject-team/update-permissions${tail(subproject)}`, payload);
    }
    // ===========================================================================
    // Subproject wizard
    // ===========================================================================
    /** POST /api/subproject-wizard/content/{id} */
    async saveSubprojectWizardContent(id, body) {
        return this.post(`/api/subproject-wizard/content/${encodeURIComponent(String(id))}`, body);
    }
    /** GET /api/subproject-wizard/creation-started */
    async getSubprojectWizardCreationStarted() {
        return this.get('/api/subproject-wizard/creation-started');
    }
    /** POST /api/subproject-wizard/domains/{id} */
    async saveSubprojectWizardDomains(id, body) {
        return this.post(`/api/subproject-wizard/domains/${encodeURIComponent(String(id))}`, body);
    }
    /** GET /api/subproject-wizard/get */
    async getSubprojectWizard() {
        return this.get('/api/subproject-wizard/get');
    }
    /** POST /api/subproject-wizard/layout/{id} */
    async saveSubprojectWizardLayout(id, body) {
        return this.post(`/api/subproject-wizard/layout/${encodeURIComponent(String(id))}`, body);
    }
    /** POST /api/subproject-wizard/seo/{id} */
    async saveSubprojectWizardSeo(id, body) {
        return this.post(`/api/subproject-wizard/seo/${encodeURIComponent(String(id))}`, body);
    }
    /** POST /api/subproject-wizard/team/{id} */
    async saveSubprojectWizardTeam(id, body) {
        return this.post(`/api/subproject-wizard/team/${encodeURIComponent(String(id))}`, body);
    }
    /** POST /api/subproject-wizard/template/{id} */
    async saveSubprojectWizardTemplate(id, body) {
        return this.post(`/api/subproject-wizard/template/${encodeURIComponent(String(id))}`, body);
    }
    // ===========================================================================
    // Project settings (the live, post-creation domain settings UI)
    // ===========================================================================
    /** GET /api/project-settings/content/show/{subproject?} */
    async getProjectSettingsContent(subproject) {
        return this.get(`/api/project-settings/content/show${tail(subproject)}`);
    }
    /** POST /api/project-settings/content/{subproject?} */
    async saveProjectSettingsContent(subprojectOrBody, body) {
        const isPathFirst = typeof subprojectOrBody === 'number' ||
            typeof subprojectOrBody === 'string';
        const subproject = isPathFirst ? subprojectOrBody : undefined;
        const payload = isPathFirst
            ? (body ?? {})
            : subprojectOrBody;
        return this.post(`/api/project-settings/content${tail(subproject)}`, payload);
    }
    /** GET /api/project-settings/domain-settings/{subproject?} */
    async getProjectSettingsDomainSettings(subproject) {
        return this.get(`/api/project-settings/domain-settings${tail(subproject)}`);
    }
    /** GET /api/project-settings/domains/show/{subproject?} */
    async getProjectSettingsDomains(subproject) {
        return this.get(`/api/project-settings/domains/show${tail(subproject)}`);
    }
    /** POST /api/project-settings/domains/{subproject?} */
    async saveProjectSettingsDomains(subprojectOrBody, body) {
        const isPathFirst = typeof subprojectOrBody === 'number' ||
            typeof subprojectOrBody === 'string';
        const subproject = isPathFirst ? subprojectOrBody : undefined;
        const payload = isPathFirst
            ? (body ?? {})
            : subprojectOrBody;
        return this.post(`/api/project-settings/domains${tail(subproject)}`, payload);
    }
    /** GET /api/project-settings/layout/show/{subproject?} */
    async getProjectSettingsLayout(subproject) {
        return this.get(`/api/project-settings/layout/show${tail(subproject)}`);
    }
    /** POST /api/project-settings/layout/{subproject?} */
    async saveProjectSettingsLayout(subprojectOrBody, body) {
        const isPathFirst = typeof subprojectOrBody === 'number' ||
            typeof subprojectOrBody === 'string';
        const subproject = isPathFirst ? subprojectOrBody : undefined;
        const payload = isPathFirst
            ? (body ?? {})
            : subprojectOrBody;
        return this.post(`/api/project-settings/layout${tail(subproject)}`, payload);
    }
    /** GET /api/project-settings/seo/show/{subproject?} */
    async getProjectSettingsSeo(subproject) {
        return this.get(`/api/project-settings/seo/show${tail(subproject)}`);
    }
    /** POST /api/project-settings/seo/{subproject?} */
    async saveProjectSettingsSeo(subprojectOrBody, body) {
        const isPathFirst = typeof subprojectOrBody === 'number' ||
            typeof subprojectOrBody === 'string';
        const subproject = isPathFirst ? subprojectOrBody : undefined;
        const payload = isPathFirst
            ? (body ?? {})
            : subprojectOrBody;
        return this.post(`/api/project-settings/seo${tail(subproject)}`, payload);
    }
    /** GET /api/project-settings/template/show/{subproject?} */
    async getProjectSettingsTemplate(subproject) {
        return this.get(`/api/project-settings/template/show${tail(subproject)}`);
    }
    /** POST /api/project-settings/template/{subproject?} */
    async saveProjectSettingsTemplate(subprojectOrBody, body) {
        const isPathFirst = typeof subprojectOrBody === 'number' ||
            typeof subprojectOrBody === 'string';
        const subproject = isPathFirst ? subprojectOrBody : undefined;
        const payload = isPathFirst
            ? (body ?? {})
            : subprojectOrBody;
        return this.post(`/api/project-settings/template${tail(subproject)}`, payload);
    }
    // ===========================================================================
    // Tenant claim — the on-the-wire path stays `tenant-claim` because the
    // Laravel route names are stable; SDK methods keep the same names too
    // since "tenant claim" is a domain-specific concept (KYC + ownership
    // transfer) that maps to a Laravel tenant in this product line.
    // ===========================================================================
    /** POST /api/tenant-claim/complete */
    async completeTenantClaim(body) {
        return this.post('/api/tenant-claim/complete', body);
    }
    /** GET /api/tenant-claim/details/{id} */
    async getTenantClaimDetails(id) {
        return this.get(`/api/tenant-claim/details/${encodeURIComponent(String(id))}`);
    }
    /** POST /api/tenant-claim/initiate */
    async initiateTenantClaim(body) {
        return this.post('/api/tenant-claim/initiate', body);
    }
    /** GET /api/tenant-claim/my-claim */
    async getMyTenantClaim() {
        return this.get('/api/tenant-claim/my-claim');
    }
    /** GET /api/tenant-claim/search */
    async searchTenantClaims(params) {
        return this.get('/api/tenant-claim/search', params);
    }
    /** GET /api/tenant-claim/status/{token} */
    async getTenantClaimStatus(token) {
        return this.get(`/api/tenant-claim/status/${encodeURIComponent(token)}`);
    }
    /**
     * POST /api/tenant-claim/verify (multipart/form-data; KYC docs).
     * `BaseApiClient.post` automatically switches to FormData when the body
     * carries a `Blob` / `File`.
     */
    async verifyTenantClaim(body) {
        return this.post('/api/tenant-claim/verify', body);
    }
    // ===========================================================================
    // Tenant interface graph
    // ===========================================================================
    /** GET /api/tenant-interface-block/by-page/{page_id} */
    async getTenantInterfaceBlocksByPage(pageId) {
        return this.get(`/api/tenant-interface-block/by-page/${encodeURIComponent(String(pageId))}`);
    }
    /** GET /api/tenant-interface-page/all/{interface_id} */
    async getTenantInterfacePagesAll(interfaceId) {
        return this.get(`/api/tenant-interface-page/all/${encodeURIComponent(String(interfaceId))}`);
    }
    /** GET /api/tenant-interface-page/interface/{interface_id} */
    async getTenantInterfacePagesByInterface(interfaceId) {
        return this.get(`/api/tenant-interface-page/interface/${encodeURIComponent(String(interfaceId))}`);
    }
    /** GET /api/tenant-interface/all */
    async getTenantInterfacesAll() {
        return this.get('/api/tenant-interface/all');
    }
    /** GET /api/tenant-registration/fees (public). */
    async getTenantRegistrationFees() {
        return this.get('/api/tenant-registration/fees', undefined, { auth: false });
    }
    // ===========================================================================
    // Domain interfaces
    // ===========================================================================
    /** GET /api/domain-interfaces */
    async listDomainInterfaces() {
        return this.get('/api/domain-interfaces');
    }
    /** POST /api/domain-interfaces */
    async createDomainInterface(body) {
        return this.post('/api/domain-interfaces', body);
    }
    /**
     * GET /api/domain-interfaces/by-domain/{domain}.
     *
     * Returns the `{base, others}` envelope as api/ writes it (no
     * wrapping `data` field — the controller emits the two keys at the
     * top level). 404 from api/ (no rows mapped for the host) is
     * normalized to `{base: null, others: []}` so callers don't have to
     * try/catch around the lookup; the legitimate "no mapping" answer
     * and the "endpoint unreachable" answer are kept distinct: the
     * latter still throws via `ApiError`.
     */
    async getDomainInterfaceByDomain(domain) {
        const res = await this.request(`/api/domain-interfaces/by-domain/${encodeURIComponent(domain)}`, { method: 'GET' }, { validateStatus: (status) => (status >= 200 && status < 300) || status === 404 });
        const env = res;
        if (!env || (env.base === undefined && env.others === undefined)) {
            return { base: null, others: [] };
        }
        return {
            base: (env.base ?? null),
            others: Array.isArray(env.others)
                ? env.others
                : [],
        };
    }
    /** GET /api/domain-interfaces/{id} */
    async getDomainInterface(id) {
        return this.get(`/api/domain-interfaces/${encodeURIComponent(String(id))}`);
    }
    /** PATCH /api/domain-interfaces/{id} (rewritten as POST?_method=PATCH). */
    async patchDomainInterface(id, body) {
        return this.patch(`/api/domain-interfaces/${encodeURIComponent(String(id))}`, body);
    }
    /** DELETE /api/domain-interfaces/{id} */
    async deleteDomainInterface(id) {
        return this.delete(`/api/domain-interfaces/${encodeURIComponent(String(id))}`);
    }
    // ===========================================================================
    // World locations / public country directory
    // ===========================================================================
    /** POST /api/world-locations/city */
    async createWorldLocationCity(body) {
        return this.post('/api/world-locations/city', body);
    }
    /** GET /api/world-locations/city/{city} */
    async getWorldLocationCity(city) {
        return this.get(`/api/world-locations/city/${encodeURIComponent(String(city))}`);
    }
    /** POST /api/world-locations/country */
    async createWorldLocationCountry(body) {
        return this.post('/api/world-locations/country', body);
    }
    /** GET /api/world-locations/country/{country} */
    async getWorldLocationCountry(country) {
        return this.get(`/api/world-locations/country/${encodeURIComponent(String(country))}`);
    }
    /** POST /api/world-locations/state */
    async createWorldLocationState(body) {
        return this.post('/api/world-locations/state', body);
    }
    /** GET /api/world-locations/state/{state} */
    async getWorldLocationState(state) {
        return this.get(`/api/world-locations/state/${encodeURIComponent(String(state))}`);
    }
    /** GET /api/public/countries/{country} (public). */
    async getPublicCountry(country) {
        return this.get(`/api/public/countries/${encodeURIComponent(country)}`, undefined, { auth: false });
    }
    /** GET /api/public/countries/find-allowed (public). */
    async getPublicAllowedCountries() {
        return this.get('/api/public/countries/find-allowed', undefined, { auth: false });
    }
    // ===========================================================================
    // Gov directory (all public)
    // ===========================================================================
    /** GET /api/gov/agency-footer */
    async getGovAgencyFooter() {
        return this.get('/api/gov/agency-footer', undefined, { auth: false });
    }
    /** GET /api/gov/cities */
    async getGovCities() {
        return this.get('/api/gov/cities', undefined, { auth: false });
    }
    /** GET /api/gov/city-agencies */
    async getGovCityAgencies() {
        return this.get('/api/gov/city-agencies', undefined, { auth: false });
    }
    /** GET /api/gov/federal-directory */
    async getGovFederalDirectory() {
        return this.get('/api/gov/federal-directory', undefined, { auth: false });
    }
    /** GET /api/gov/states */
    async getGovStates() {
        return this.get('/api/gov/states', undefined, { auth: false });
    }
    /** GET /api/gov/subprojects */
    async getGovSubprojects() {
        return this.get('/api/gov/subprojects', undefined, { auth: false });
    }
    /** GET /api/gov/subprojects/by-domain */
    async getGovSubprojectByDomain() {
        return this.get('/api/gov/subprojects/by-domain', undefined, { auth: false });
    }
    // ===========================================================================
    // Frontend + SEO pages
    // ===========================================================================
    /** GET /api/frontend/get-frontend */
    async getFrontend() {
        return this.get('/api/frontend/get-frontend');
    }
    /** PUT /api/frontend/save-frontend (rewritten as POST?_method=PUT). */
    async saveFrontend(body) {
        return this.put('/api/frontend/save-frontend', body);
    }
    /** GET /api/seo-page (paginated) */
    async listSeoPages() {
        return this.get('/api/seo-page');
    }
    /** POST /api/seo-page */
    async createSeoPage(body) {
        return this.post('/api/seo-page', body);
    }
    /** DELETE /api/seo-page/item/{seoPageItem} */
    async deleteSeoPageItem(seoPageItem) {
        return this.delete(`/api/seo-page/item/${encodeURIComponent(String(seoPageItem))}`);
    }
    /** GET /api/seo-page/{seo_page} */
    async getSeoPage(seoPage) {
        return this.get(`/api/seo-page/${encodeURIComponent(String(seoPage))}`);
    }
    /** PUT /api/seo-page/{seo_page} */
    async updateSeoPage(seoPage, body) {
        return this.put(`/api/seo-page/${encodeURIComponent(String(seoPage))}`, body);
    }
    /** DELETE /api/seo-page/{seo_page} */
    async deleteSeoPage(seoPage) {
        return this.delete(`/api/seo-page/${encodeURIComponent(String(seoPage))}`);
    }
    // ===========================================================================
    // Creator + featured (gov-side admin)
    // ===========================================================================
    /** GET /api/creator */
    async listCreators() {
        return this.get('/api/creator');
    }
    /** POST /api/creator */
    async createCreator(body) {
        return this.post('/api/creator', body);
    }
    /** GET /api/creator/{creator} */
    async getCreator(creator) {
        return this.get(`/api/creator/${encodeURIComponent(String(creator))}`);
    }
    /** PUT /api/creator/{creator} */
    async updateCreator(creator, body) {
        return this.put(`/api/creator/${encodeURIComponent(String(creator))}`, body);
    }
    /** DELETE /api/creator/{creator} */
    async deleteCreator(creator) {
        return this.delete(`/api/creator/${encodeURIComponent(String(creator))}`);
    }
    /** GET /api/creator-activity */
    async listCreatorActivity() {
        return this.get('/api/creator-activity');
    }
    /** POST /api/creator-activity */
    async createCreatorActivity(body) {
        return this.post('/api/creator-activity', body);
    }
    /** GET /api/creator-activity/{creator_activity} */
    async getCreatorActivity(creatorActivity) {
        return this.get(`/api/creator-activity/${encodeURIComponent(String(creatorActivity))}`);
    }
    /** PUT /api/creator-activity/{creator_activity} */
    async updateCreatorActivity(creatorActivity, body) {
        return this.put(`/api/creator-activity/${encodeURIComponent(String(creatorActivity))}`, body);
    }
    /** DELETE /api/creator-activity/{creator_activity} */
    async deleteCreatorActivity(creatorActivity) {
        return this.delete(`/api/creator-activity/${encodeURIComponent(String(creatorActivity))}`);
    }
    /** GET /api/creator-request */
    async listCreatorRequests() {
        return this.get('/api/creator-request');
    }
    /** POST /api/creator-request */
    async createCreatorRequest(body) {
        return this.post('/api/creator-request', body);
    }
    /** GET /api/creator-request/status */
    async getCreatorRequestStatus() {
        return this.get('/api/creator-request/status');
    }
    /** GET /api/creator-request/{creator_request} */
    async getCreatorRequest(creatorRequest) {
        return this.get(`/api/creator-request/${encodeURIComponent(String(creatorRequest))}`);
    }
    /** PUT /api/creator-request/{creator_request} */
    async updateCreatorRequest(creatorRequest, body) {
        return this.put(`/api/creator-request/${encodeURIComponent(String(creatorRequest))}`, body);
    }
    /** DELETE /api/creator-request/{creator_request} */
    async deleteCreatorRequest(creatorRequest) {
        return this.delete(`/api/creator-request/${encodeURIComponent(String(creatorRequest))}`);
    }
    /** POST /api/featured/creators */
    async saveFeaturedCreators(body) {
        return this.post('/api/featured/creators', body);
    }
    /** POST /api/featured/programs */
    async saveFeaturedPrograms(body) {
        return this.post('/api/featured/programs', body);
    }
    // ===========================================================================
    // Contacts
    // ===========================================================================
    /** DELETE /api/contacts/delete/{contact} */
    async deleteContact(contact) {
        return this.delete(`/api/contacts/delete/${encodeURIComponent(String(contact))}`);
    }
    /** POST /api/contacts/find/{subproject?} */
    async findContacts(body, subproject) {
        return this.post(`/api/contacts/find${tail(subproject)}`, body);
    }
    /** GET /api/contacts/has-contacts */
    async getContactsHasContacts() {
        return this.get('/api/contacts/has-contacts');
    }
    /** POST /api/contacts/import */
    async importContacts(body) {
        return this.post('/api/contacts/import', body);
    }
    /** POST /api/contacts/list */
    async listContacts(body) {
        return this.post('/api/contacts/list', body);
    }
    /** GET /api/contacts/running-import */
    async getContactsRunningImport() {
        return this.get('/api/contacts/running-import');
    }
    /** POST /api/contacts/save */
    async saveContact(body) {
        return this.post('/api/contacts/save', body);
    }
    // ===========================================================================
    // Documentation
    // ===========================================================================
    /** GET /api/documentation */
    async listDocumentation() {
        return this.get('/api/documentation');
    }
    /** POST /api/documentation */
    async createDocumentation(body) {
        return this.post('/api/documentation', body);
    }
    /** GET /api/documentation/{documentation} */
    async getDocumentation(documentation) {
        return this.get(`/api/documentation/${encodeURIComponent(String(documentation))}`);
    }
    /** PUT /api/documentation/{documentation} */
    async updateDocumentation(documentation, body) {
        return this.put(`/api/documentation/${encodeURIComponent(String(documentation))}`, body);
    }
    /** DELETE /api/documentation/{documentation} */
    async deleteDocumentation(documentation) {
        return this.delete(`/api/documentation/${encodeURIComponent(String(documentation))}`);
    }
}
exports.SubprojectApiClient = SubprojectApiClient;
//# sourceMappingURL=subproject-api-client.js.map