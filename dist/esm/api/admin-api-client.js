/**
 * AdminApiClient — covers the admin / SuperAdmin slice of the P2X API. Source
 * of truth is `sdk/spec/endpoints.json` (filter `auth === "admin"`, ~150 of
 * which ~76 are unique to this client; the rest are owned by `TenancyApiClient`
 * (creator / featured / contacts / documentation / SEO / domain-interfaces /
 * project-settings / subproject-admin / world-locations) and three
 * `/api/user/{user}` verbs by `AuthUserApiClient`).
 *
 * The class extends `BaseApiClient`, which already handles:
 *   - Bearer token injection (skipped per call via `{ auth: false }`)
 *   - `X-Domain` header from `getDomain`
 *   - PUT/PATCH → POST + `?_method=PUT|PATCH` (Laravel)
 *   - FormData switching when payload contains a `File`/`Blob`
 *   - 401 / 422 → callback + `ApiError`
 *
 * Auth band note: every method below is `auth: "admin"`. The SDK does NOT
 * ship a separate "admin" client class — `BaseApiClient` injects whatever
 * `getToken()` returns. Consumer apps (`gov/`, `app/`, `sys/`) construct an
 * `AdminApiClient` with their *admin* Sanctum token, leaving the regular
 * `getToken` getter wired to their normal user token. The only practical
 * difference between this client and a sibling `auth: api` client is the
 * URL set — the request envelope is identical.
 *
 * Wrapper handling: the spec marks every endpoint here as `wrapper: "data"`
 * (single Resource), so the SDK consumes the parsed envelope (`{ success,
 * message, data }`) and the typed payload sits in `.data`.
 */
import { BaseApiClient } from '../api-client';
export class AdminApiClient extends BaseApiClient {
    // ===========================================================================
    // Search (admin / team search)
    // ===========================================================================
    /** POST /api/admin-search */
    async adminSearch(body) {
        return this.post('/api/admin-search', body);
    }
    /** POST /api/team-search */
    async teamSearch(body) {
        return this.post('/api/team-search', body);
    }
    // ===========================================================================
    // Administrator CRUD (`administrator.*`)
    // ===========================================================================
    /** POST /api/administrator */
    async createAdministrator(body) {
        return this.post('/api/administrator', body);
    }
    /** GET /api/administrator/{administrator} */
    async getAdministrator(administrator) {
        return this.get(`/api/administrator/${encodeURIComponent(String(administrator))}`);
    }
    /** PUT /api/administrator/{administrator} (POST + ?_method=PUT). */
    async updateAdministrator(administrator, body) {
        return this.put(`/api/administrator/${encodeURIComponent(String(administrator))}`, body);
    }
    /** DELETE /api/administrator/{administrator} */
    async deleteAdministrator(administrator) {
        return this.delete(`/api/administrator/${encodeURIComponent(String(administrator))}`);
    }
    // ===========================================================================
    // AI – models / settings / installation
    // ===========================================================================
    /** POST /api/ai/delete-model */
    async deleteAiModel(body) {
        return this.post('/api/ai/delete-model', body ?? {});
    }
    /** GET /api/ai/get-models */
    async getAiModels() {
        return this.get('/api/ai/get-models');
    }
    /** GET /api/ai/get-models-list */
    async getAiModelsList() {
        return this.get('/api/ai/get-models-list');
    }
    /** GET /api/ai/get-settings */
    async getAiSettings() {
        return this.get('/api/ai/get-settings');
    }
    /** POST /api/ai/install-model */
    async installAiModel(body) {
        return this.post('/api/ai/install-model', body ?? {});
    }
    /** GET /api/ai/installation-status */
    async getAiInstallationStatus() {
        return this.get('/api/ai/installation-status');
    }
    /** POST /api/ai/save-settings */
    async saveAiSettings(body) {
        return this.post('/api/ai/save-settings', body);
    }
    // ===========================================================================
    // AI Log CRUD (`admin.ai.log.*`)
    // ===========================================================================
    /** GET /api/ai/log */
    async listAiLogs() {
        return this.get('/api/ai/log');
    }
    /** POST /api/ai/log */
    async createAiLog(body) {
        return this.post('/api/ai/log', body);
    }
    /** GET /api/ai/log/{log} */
    async getAiLog(log) {
        return this.get(`/api/ai/log/${encodeURIComponent(String(log))}`);
    }
    /** PUT /api/ai/log/{log} */
    async updateAiLog(log, body) {
        return this.put(`/api/ai/log/${encodeURIComponent(String(log))}`, body);
    }
    /** DELETE /api/ai/log/{log} */
    async deleteAiLog(log) {
        return this.delete(`/api/ai/log/${encodeURIComponent(String(log))}`);
    }
    // ===========================================================================
    // AI Policy CRUD + prompt linkage
    // ===========================================================================
    /** GET /api/ai/policy */
    async listAiPolicies() {
        return this.get('/api/ai/policy');
    }
    /** POST /api/ai/policy */
    async createAiPolicy(body) {
        return this.post('/api/ai/policy', body);
    }
    /** GET /api/ai/policy/{policy} */
    async getAiPolicy(policy) {
        return this.get(`/api/ai/policy/${encodeURIComponent(String(policy))}`);
    }
    /** PUT /api/ai/policy/{policy} */
    async updateAiPolicy(policy, body) {
        return this.put(`/api/ai/policy/${encodeURIComponent(String(policy))}`, body);
    }
    /** DELETE /api/ai/policy/{policy} */
    async deleteAiPolicy(policy) {
        return this.delete(`/api/ai/policy/${encodeURIComponent(String(policy))}`);
    }
    /** DELETE /api/ai/policy-file/{file} */
    async deleteAiPolicyFile(file) {
        return this.delete(`/api/ai/policy-file/${encodeURIComponent(String(file))}`);
    }
    /** GET /api/ai/policy-list/{prompt} */
    async listAiPoliciesForPrompt(prompt) {
        return this.get(`/api/ai/policy-list/${encodeURIComponent(String(prompt))}`);
    }
    /** POST /api/ai/policy/{policy}/prompts */
    async attachPromptToAiPolicy(policy, body) {
        return this.post(`/api/ai/policy/${encodeURIComponent(String(policy))}/prompts`, body);
    }
    /** DELETE /api/ai/policy/{policy}/prompts/{prompt} */
    async detachPromptFromAiPolicy(policy, prompt) {
        return this.delete(`/api/ai/policy/${encodeURIComponent(String(policy))}/prompts/${encodeURIComponent(String(prompt))}`);
    }
    // ===========================================================================
    // AI Prompts
    // ===========================================================================
    /** POST /api/ai/prompts/create */
    async createAiPrompt(body) {
        return this.post('/api/ai/prompts/create', body);
    }
    /** GET /api/ai/prompts/keywords */
    async getAiPromptKeywords() {
        return this.get('/api/ai/prompts/keywords');
    }
    /** GET /api/ai/prompts/list */
    async listAiPrompts() {
        return this.get('/api/ai/prompts/list');
    }
    /** GET /api/ai/prompts/list-policies */
    async listAiPromptPolicies() {
        return this.get('/api/ai/prompts/list-policies');
    }
    /** GET /api/ai/prompts/required-list */
    async getRequiredAiPrompts() {
        return this.get('/api/ai/prompts/required-list');
    }
    /** GET /api/ai/prompts/show/{prompt} */
    async getAiPrompt(prompt) {
        return this.get(`/api/ai/prompts/show/${encodeURIComponent(String(prompt))}`);
    }
    /** PUT /api/ai/prompts/update/{prompt} */
    async updateAiPrompt(prompt, body) {
        return this.put(`/api/ai/prompts/update/${encodeURIComponent(String(prompt))}`, body);
    }
    // ===========================================================================
    // Dashboard / domain settings
    // ===========================================================================
    /**
     * POST /api/dashboard-settings/save — accepts either a stored video id
     * (`video_id`) OR a `File` upload (`video_file`). When the payload carries
     * a `File`/`Blob`, `BaseApiClient.serializeBody` switches the request to
     * multipart/form-data automatically.
     */
    async saveDashboardSettings(body) {
        return this.post('/api/dashboard-settings/save', body);
    }
    /** GET /api/domain-settings/{id} */
    async getDomainSettings(id) {
        return this.get(`/api/domain-settings/${encodeURIComponent(String(id))}`);
    }
    // ===========================================================================
    // Fees
    // ===========================================================================
    /** GET /api/fees/fee */
    async listFees() {
        return this.get('/api/fees/fee');
    }
    /** POST /api/fees/fee */
    async createFee(body) {
        return this.post('/api/fees/fee', body);
    }
    /** GET /api/fees/fee/{fee} */
    async getFee(fee) {
        return this.get(`/api/fees/fee/${encodeURIComponent(String(fee))}`);
    }
    /** PUT /api/fees/fee/{fee} */
    async updateFee(fee, body) {
        return this.put(`/api/fees/fee/${encodeURIComponent(String(fee))}`, body);
    }
    /** DELETE /api/fees/fee/{fee} */
    async deleteFee(fee) {
        return this.delete(`/api/fees/fee/${encodeURIComponent(String(fee))}`);
    }
    /** POST /api/fees/find-users */
    async findFeeUsers(body) {
        return this.post('/api/fees/find-users', body);
    }
    /** GET /api/fees/get-settings */
    async getFeeSettings() {
        return this.get('/api/fees/get-settings');
    }
    /** POST /api/fees/save-settings */
    async saveFeeSettings(body) {
        return this.post('/api/fees/save-settings', body);
    }
    // ===========================================================================
    // Program categories / sub-categories / tags
    // ===========================================================================
    /** GET /api/program-categories */
    async listProgramCategoriesPublic() {
        return this.get('/api/program-categories');
    }
    /** GET /api/program-category */
    async listProgramCategories() {
        return this.get('/api/program-category');
    }
    /** POST /api/program-category */
    async createProgramCategory(body) {
        return this.post('/api/program-category', body);
    }
    /** GET /api/program-category/{program_category} */
    async getProgramCategory(programCategory) {
        return this.get(`/api/program-category/${encodeURIComponent(String(programCategory))}`);
    }
    /** PUT /api/program-category/{program_category} */
    async updateProgramCategory(programCategory, body) {
        return this.put(`/api/program-category/${encodeURIComponent(String(programCategory))}`, body);
    }
    /** DELETE /api/program-category/{program_category} */
    async deleteProgramCategory(programCategory) {
        return this.delete(`/api/program-category/${encodeURIComponent(String(programCategory))}`);
    }
    /** GET /api/program-sub-category */
    async listProgramSubCategories() {
        return this.get('/api/program-sub-category');
    }
    /** POST /api/program-sub-category */
    async createProgramSubCategory(body) {
        return this.post('/api/program-sub-category', body);
    }
    /** GET /api/program-sub-category/{program_sub_category} */
    async getProgramSubCategory(programSubCategory) {
        return this.get(`/api/program-sub-category/${encodeURIComponent(String(programSubCategory))}`);
    }
    /** PUT /api/program-sub-category/{program_sub_category} */
    async updateProgramSubCategory(programSubCategory, body) {
        return this.put(`/api/program-sub-category/${encodeURIComponent(String(programSubCategory))}`, body);
    }
    /** DELETE /api/program-sub-category/{program_sub_category} */
    async deleteProgramSubCategory(programSubCategory) {
        return this.delete(`/api/program-sub-category/${encodeURIComponent(String(programSubCategory))}`);
    }
    /** GET /api/program-tag */
    async listProgramTags() {
        return this.get('/api/program-tag');
    }
    /** POST /api/program-tag */
    async createProgramTag(body) {
        return this.post('/api/program-tag', body);
    }
    /** GET /api/program-tag/{program_tag} */
    async getProgramTag(programTag) {
        return this.get(`/api/program-tag/${encodeURIComponent(String(programTag))}`);
    }
    /** PUT /api/program-tag/{program_tag} */
    async updateProgramTag(programTag, body) {
        return this.put(`/api/program-tag/${encodeURIComponent(String(programTag))}`, body);
    }
    /** DELETE /api/program-tag/{program_tag} */
    async deleteProgramTag(programTag) {
        return this.delete(`/api/program-tag/${encodeURIComponent(String(programTag))}`);
    }
    // ===========================================================================
    // Project role
    // ===========================================================================
    /** GET /api/project-role */
    async listProjectRoles() {
        return this.get('/api/project-role');
    }
    /** POST /api/project-role */
    async createProjectRole(body) {
        return this.post('/api/project-role', body);
    }
    /** GET /api/project-role/permissions */
    async getProjectRolePermissions() {
        return this.get('/api/project-role/permissions');
    }
    /** GET /api/project-role/{project_role} */
    async getProjectRole(projectRole) {
        return this.get(`/api/project-role/${encodeURIComponent(String(projectRole))}`);
    }
    /** PUT /api/project-role/{project_role} */
    async updateProjectRole(projectRole, body) {
        return this.put(`/api/project-role/${encodeURIComponent(String(projectRole))}`, body);
    }
    /** DELETE /api/project-role/{project_role} */
    async deleteProjectRole(projectRole) {
        return this.delete(`/api/project-role/${encodeURIComponent(String(projectRole))}`);
    }
    // ===========================================================================
    // Provider + roles-to-assign
    // ===========================================================================
    /** GET /api/provider */
    async listProviders(params) {
        return this.get('/api/provider', params);
    }
    /** GET /api/provider/roles */
    async listProviderRoles() {
        return this.get('/api/provider/roles');
    }
    /** GET /api/roles-to-assign/all */
    async listRolesToAssign() {
        return this.get('/api/roles-to-assign/all');
    }
    // ===========================================================================
    // Statistic CRUD
    // ===========================================================================
    /** GET /api/statistic */
    async listStatistics() {
        return this.get('/api/statistic');
    }
    /** POST /api/statistic */
    async createStatistic(body) {
        return this.post('/api/statistic', body);
    }
    /** GET /api/statistic/{statistic} */
    async getStatistic(statistic) {
        return this.get(`/api/statistic/${encodeURIComponent(String(statistic))}`);
    }
    /** PUT /api/statistic/{statistic} */
    async updateStatistic(statistic, body) {
        return this.put(`/api/statistic/${encodeURIComponent(String(statistic))}`, body);
    }
    /** DELETE /api/statistic/{statistic} */
    async deleteStatistic(statistic) {
        return this.delete(`/api/statistic/${encodeURIComponent(String(statistic))}`);
    }
    // ===========================================================================
    // User (admin index/store) — show/update/destroy live in AuthUserApiClient
    // ===========================================================================
    /**
     * GET /api/user — admin user listing. The matching show/update/destroy
     * verbs at `/api/user/{user}` are owned by `AuthUserApiClient`
     * (`adminShowUser` / `adminUpdateUser` / `adminDestroyUser`).
     */
    async listAdminUsers(params) {
        return this.get('/api/user', params);
    }
    /** POST /api/user — admin user creation. */
    async createAdminUser(body) {
        return this.post('/api/user', body);
    }
}
//# sourceMappingURL=admin-api-client.js.map