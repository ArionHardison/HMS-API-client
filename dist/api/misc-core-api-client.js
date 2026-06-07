"use strict";
/**
 * MiscCoreApiClient — covers the long tail of `Core` endpoints in
 * `sdk/spec/endpoints.json` that don't fit a themed slice. 89 endpoints
 * spanning home/feed/search, the gov directory, public auth/login flows,
 * documentation, MCP connector, twitter timeline, broadcasting auth,
 * single-PUT admin updates (administrator/ai-log/ai-policy/etc.), and
 * authenticated user-account mutations.
 *
 * Auth bands per spec:
 *   - `auth: public` → call with `{ auth: false }` so no Bearer token leaks.
 *   - `auth: api`    → Bearer required (default).
 *   - `auth: admin`  → Bearer required, admin-scoped (callers attach the
 *                      admin token via `getToken`; the SDK doesn't enforce
 *                      role-level distinctions on the wire).
 *
 * Source of truth: `sdk/spec/endpoints.json`. PUT endpoints are translated
 * to POST + `?_method=PUT` automatically by `BaseApiClient`. PATCH same as
 * `?_method=PATCH`.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscCoreApiClient = void 0;
const api_client_1 = require("../api-client");
const NO_AUTH = { auth: false };
class MiscCoreApiClient extends api_client_1.BaseApiClient {
    // ===========================================================================
    // admin-side single-resource updates
    // ===========================================================================
    /** PUT /api/administrator/{administrator} */
    async updateAdministrator(administrator, body) {
        return this.put(`/api/administrator/${encodeURIComponent(String(administrator))}`, body);
    }
    /** PUT /api/ai/log/{log} */
    async updateAiLog(log, body = {}) {
        return this.put(`/api/ai/log/${encodeURIComponent(String(log))}`, body);
    }
    /** PUT /api/ai/policy/{policy} */
    async updateAiPolicy(policy, body) {
        return this.put(`/api/ai/policy/${encodeURIComponent(String(policy))}`, body);
    }
    /** PUT /api/ai/prompts/update/{prompt} */
    async updateAiPrompt(prompt, body) {
        return this.put(`/api/ai/prompts/update/${encodeURIComponent(String(prompt))}`, body);
    }
    /** PUT /api/documentation/{documentation} */
    async updateDocumentation(documentation, body) {
        return this.put(`/api/documentation/${encodeURIComponent(String(documentation))}`, body);
    }
    /** PUT /api/fees/fee/{fee} */
    async updateFee(fee, body) {
        return this.put(`/api/fees/fee/${encodeURIComponent(String(fee))}`, body);
    }
    /** PUT /api/program-category/{program_category} */
    async updateProgramCategory(programCategory, body) {
        return this.put(`/api/program-category/${encodeURIComponent(String(programCategory))}`, body);
    }
    /** PUT /api/program-sub-category/{program_sub_category} */
    async updateProgramSubCategory(programSubCategory, body) {
        return this.put(`/api/program-sub-category/${encodeURIComponent(String(programSubCategory))}`, body);
    }
    /** PUT /api/program-tag/{program_tag} */
    async updateProgramTag(programTag, body) {
        return this.put(`/api/program-tag/${encodeURIComponent(String(programTag))}`, body);
    }
    /** PUT /api/project-role/{project_role} */
    async updateProjectRole(projectRole, body) {
        return this.put(`/api/project-role/${encodeURIComponent(String(projectRole))}`, body);
    }
    /** PUT /api/statistic/{statistic} */
    async updateStatistic(statistic, body) {
        return this.put(`/api/statistic/${encodeURIComponent(String(statistic))}`, body);
    }
    /** PUT /api/user/{user} (admin) */
    async adminUpdateUserById(user, body) {
        return this.put(`/api/user/${encodeURIComponent(String(user))}`, body);
    }
    // ===========================================================================
    // creator + program adjacent
    // ===========================================================================
    /** PUT /api/creator-request/{creator_request} */
    async updateCreatorRequest(creatorRequest, body) {
        return this.put(`/api/creator-request/${encodeURIComponent(String(creatorRequest))}`, body);
    }
    /** PUT /api/creator/{creator} */
    async updateCreator(creator, body) {
        return this.put(`/api/creator/${encodeURIComponent(String(creator))}`, body);
    }
    /** PUT /api/program/update-program/{program} */
    async updateProgram(program, body = {}) {
        return this.put(`/api/program/update-program/${encodeURIComponent(String(program))}`, body);
    }
    /** GET /api/program-category/all */
    async listAllProgramCategories() {
        return this.get('/api/program-category/all');
    }
    /** GET /api/program-sub-category/all */
    async listAllProgramSubCategories() {
        return this.get('/api/program-sub-category/all');
    }
    /** GET /api/program-tag/all */
    async listAllProgramTags() {
        return this.get('/api/program-tag/all');
    }
    /** GET /api/program-status/get/{program} */
    async getProgramPublishedStatus(program) {
        return this.get(`/api/program-status/get/${encodeURIComponent(String(program))}`);
    }
    /** POST /api/program-status/set/{program} */
    async setProgramPublishedStatus(program, body) {
        return this.post(`/api/program-status/set/${encodeURIComponent(String(program))}`, body);
    }
    /** GET /api/program-sale */
    async listProgramSales() {
        return this.get('/api/program-sale');
    }
    /** POST /api/program-sale */
    async createProgramSale(body = {}) {
        return this.post('/api/program-sale', body);
    }
    /** PUT /api/program-sale/{program_sale} */
    async updateProgramSale(programSale, body = {}) {
        return this.put(`/api/program-sale/${encodeURIComponent(String(programSale))}`, body);
    }
    /** PUT /api/protocol/{protocol} */
    async updateProtocol(protocol, body) {
        return this.put(`/api/protocol/${encodeURIComponent(String(protocol))}`, body);
    }
    /** PATCH /api/protocol/sale/update/{protocol} */
    async updateProtocolSale(protocol, body) {
        return this.patch(`/api/protocol/sale/update/${encodeURIComponent(String(protocol))}`, body);
    }
    /** PATCH /api/subscription/update/{subscription} */
    async updateSubscription(subscription, body = {}) {
        return this.patch(`/api/subscription/update/${encodeURIComponent(String(subscription))}`, body);
    }
    /** PUT /api/role/{role} */
    async updateRole(role, body = {}) {
        return this.put(`/api/role/${encodeURIComponent(String(role))}`, body);
    }
    /** PUT /api/seo-page/{seo_page} */
    async updateSeoPage(seoPage, body) {
        return this.put(`/api/seo-page/${encodeURIComponent(String(seoPage))}`, body);
    }
    /** PUT /api/frontend/save-frontend */
    async saveFrontend(body) {
        return this.put('/api/frontend/save-frontend', body);
    }
    /** PATCH /api/domain-interfaces/{id} */
    async updateDomainInterface(id, body) {
        return this.patch(`/api/domain-interfaces/${encodeURIComponent(String(id))}`, body);
    }
    // ===========================================================================
    // auth + user (api band)
    // ===========================================================================
    /** POST /api/auth/change-forced-password */
    async changeForcedPassword(body) {
        return this.post('/api/auth/change-forced-password', body);
    }
    /** GET /api/resend-verify-email */
    async resendVerifyEmail() {
        return this.get('/api/resend-verify-email');
    }
    /** POST /api/verify-code */
    async verifyCode(body) {
        return this.post('/api/verify-code', body);
    }
    /** PATCH /api/users/update-billing-info */
    async patchBillingInfo(body) {
        return this.patch('/api/users/update-billing-info', body);
    }
    /** PATCH /api/users/update-password/{user} */
    async patchUserPassword(user, body) {
        return this.patch(`/api/users/update-password/${encodeURIComponent(String(user))}`, body);
    }
    /** PATCH /api/users/update-phone */
    async patchUserPhone(body) {
        return this.patch('/api/users/update-phone', body);
    }
    /** PATCH /api/users/update/{user} */
    async patchUser(user, body) {
        return this.patch(`/api/users/update/${encodeURIComponent(String(user))}`, body);
    }
    // ===========================================================================
    // chat
    // ===========================================================================
    /** DELETE /api/chat/delete-сhat/{chat} (note: Cyrillic "с" in path — preserved verbatim from spec). */
    async deleteChat(chat) {
        return this.delete(`/api/chat/delete-сhat/${encodeURIComponent(String(chat))}`);
    }
    // ===========================================================================
    // public auth + login flows
    // ===========================================================================
    /** POST /api/dashboard/create-login-transaction (`auth: public`). */
    async dashboardCreateLoginTransaction(body) {
        return this.post('/api/dashboard/create-login-transaction', body, NO_AUTH);
    }
    /** POST /api/public/auth-by-social-token (`auth: public`). */
    async publicAuthBySocialToken(body = {}) {
        return this.post('/api/public/auth-by-social-token', body, NO_AUTH);
    }
    /** POST /api/public/contact (`auth: public`). */
    async publicContact(body) {
        return this.post('/api/public/contact', body, NO_AUTH);
    }
    /** POST /api/public/create-login-transaction (`auth: public`). */
    async publicCreateLoginTransaction(body) {
        return this.post('/api/public/create-login-transaction', body, NO_AUTH);
    }
    /** POST /api/public/verify-social-token (`auth: public`). */
    async publicVerifySocialToken(body) {
        return this.post('/api/public/verify-social-token', body, NO_AUTH);
    }
    // ===========================================================================
    // interface (public)
    // ===========================================================================
    /** GET /api/interface/auth-token/{token} (public). */
    async interfaceAuthByToken(token) {
        return this.get(`/api/interface/auth-token/${encodeURIComponent(token)}`, undefined, NO_AUTH);
    }
    /** GET /api/interface/auth/{sessionKey} (public). */
    async interfaceAuthBySessionKey(sessionKey) {
        return this.get(`/api/interface/auth/${encodeURIComponent(sessionKey)}`, undefined, NO_AUTH);
    }
    /** POST /api/interface/get-sms (public). */
    async interfaceGetSms(body) {
        return this.post('/api/interface/get-sms', body, NO_AUTH);
    }
    /** POST /api/interface/verify-code (public). */
    async interfaceVerifyCode(body) {
        return this.post('/api/interface/verify-code', body, NO_AUTH);
    }
    // ===========================================================================
    // MCP connector
    // ===========================================================================
    /** GET /api/mcp/connector (public). */
    async mcpConnectorIndex() {
        return this.get('/api/mcp/connector', undefined, NO_AUTH);
    }
    /** POST /api/mcp/connector (`auth: api`). */
    async mcpConnectorStore(body = {}) {
        return this.post('/api/mcp/connector', body);
    }
    // ===========================================================================
    // gov directory (public)
    // ===========================================================================
    /** GET /api/gov/agency-footer (public). */
    async getGovAgencyFooter() {
        return this.get('/api/gov/agency-footer', undefined, NO_AUTH);
    }
    /** GET /api/gov/cities (public). */
    async getGovCities(params = {}) {
        return this.get('/api/gov/cities', params, NO_AUTH);
    }
    /** GET /api/gov/city-agencies (public). */
    async getGovCityAgencies(params = {}) {
        return this.get('/api/gov/city-agencies', params, NO_AUTH);
    }
    /** GET /api/gov/federal-directory (public). */
    async getGovFederalDirectory() {
        return this.get('/api/gov/federal-directory', undefined, NO_AUTH);
    }
    /** GET /api/gov/states (public). */
    async getGovStates(params = {}) {
        return this.get('/api/gov/states', params, NO_AUTH);
    }
    /** GET /api/gov/subprojects (public). */
    async getGovSubprojects(params = {}) {
        return this.get('/api/gov/subprojects', params, NO_AUTH);
    }
    /** GET /api/gov/subprojects/by-domain (public). */
    async getGovSubprojectByDomain() {
        return this.get('/api/gov/subprojects/by-domain', undefined, NO_AUTH);
    }
    /** GET /api/politicians-by-domain (public). */
    async getPoliticiansByDomain() {
        return this.get('/api/politicians-by-domain', undefined, NO_AUTH);
    }
    // ===========================================================================
    // home (public)
    // ===========================================================================
    /** GET /api/home/featured-creators (public). */
    async getHomeFeaturedCreators() {
        return this.get('/api/home/featured-creators', undefined, NO_AUTH);
    }
    /** GET /api/home/featured-programs (public). */
    async getHomeFeaturedPrograms() {
        return this.get('/api/home/featured-programs', undefined, NO_AUTH);
    }
    /** GET /api/home/feedback (public). */
    async getHomeFeedback() {
        return this.get('/api/home/feedback', undefined, NO_AUTH);
    }
    /** GET /api/home/frontend/{items} (public). */
    async getHomeFrontend(items) {
        return this.get(`/api/home/frontend/${encodeURIComponent(items)}`, undefined, NO_AUTH);
    }
    /** GET /api/home/most-recent-programs (public). */
    async getHomeMostRecentPrograms() {
        return this.get('/api/home/most-recent-programs', undefined, NO_AUTH);
    }
    /** GET /api/home/statistic (public). */
    async getHomeStatistic() {
        return this.get('/api/home/statistic', undefined, NO_AUTH);
    }
    // ===========================================================================
    // public catalog / feed
    // ===========================================================================
    /** GET /api/public/creators (public). */
    async listPublicCreators() {
        return this.get('/api/public/creators', undefined, NO_AUTH);
    }
    /** POST /api/public/creators/filter (public). */
    async filterPublicCreators(body = {}) {
        return this.post('/api/public/creators/filter', body, NO_AUTH);
    }
    /** GET /api/public/documentation/random-feedback (public). */
    async getDocumentationRandomFeedback() {
        return this.get('/api/public/documentation/random-feedback', undefined, NO_AUTH);
    }
    /** GET /api/public/documentation/search/{search?} (public). */
    async searchPublicDocumentation(search) {
        const url = search == null
            ? '/api/public/documentation/search'
            : `/api/public/documentation/search/${encodeURIComponent(search)}`;
        return this.get(url, undefined, NO_AUTH);
    }
    /** GET /api/public/documentation/show/{documentation} (public). */
    async showPublicDocumentation(documentation) {
        return this.get(`/api/public/documentation/show/${encodeURIComponent(String(documentation))}`, undefined, NO_AUTH);
    }
    /** GET /api/public/get-program-categories (public). */
    async getPublicProgramCategories() {
        return this.get('/api/public/get-program-categories', undefined, NO_AUTH);
    }
    /** GET /api/public/get-program-feedback/{program} (public). */
    async getPublicProgramFeedback(program) {
        return this.get(`/api/public/get-program-feedback/${encodeURIComponent(String(program))}`, undefined, NO_AUTH);
    }
    /** GET /api/public/get-program-shop-categories (public). */
    async getPublicProgramShopCategories() {
        return this.get('/api/public/get-program-shop-categories', undefined, NO_AUTH);
    }
    /** GET /api/public/get-program/{program} (public). */
    async getPublicProgram(program) {
        return this.get(`/api/public/get-program/${encodeURIComponent(String(program))}`, undefined, NO_AUTH);
    }
    /** GET /api/public/get-programs (public). */
    async getPublicPrograms() {
        return this.get('/api/public/get-programs', undefined, NO_AUTH);
    }
    /** GET /api/public/get-roles (public). */
    async getPublicRoles() {
        return this.get('/api/public/get-roles', undefined, NO_AUTH);
    }
    /** GET /api/public/get-user-featured/{user} (public). */
    async getPublicUserFeatured(user) {
        return this.get(`/api/public/get-user-featured/${encodeURIComponent(String(user))}`, undefined, NO_AUTH);
    }
    /** GET /api/public/get-user-feed/{user} (public). */
    async getPublicUserFeed(user) {
        return this.get(`/api/public/get-user-feed/${encodeURIComponent(String(user))}`, undefined, NO_AUTH);
    }
    /** GET /api/public/program-sale/money-distributions (public). */
    async getPublicProgramSaleMoneyDistributions() {
        return this.get('/api/public/program-sale/money-distributions', undefined, NO_AUTH);
    }
    /** GET /api/public/short-link/{shortLink} (public). */
    async resolvePublicShortLink(shortLink) {
        return this.get(`/api/public/short-link/${encodeURIComponent(shortLink)}`, undefined, NO_AUTH);
    }
    /** GET /api/public/subprojects (public). */
    async listPublicSubprojects() {
        return this.get('/api/public/subprojects', undefined, NO_AUTH);
    }
    /** POST /api/public/subprojects/search (public). */
    async searchPublicSubprojects(body = {}) {
        return this.post('/api/public/subprojects/search', body, NO_AUTH);
    }
    /** GET /api/public/team/get-invite/{token} (public). */
    async getPublicTeamInvite(token) {
        return this.get(`/api/public/team/get-invite/${encodeURIComponent(token)}`, undefined, NO_AUTH);
    }
    /** GET /api/public/team/get-invited-data/{token} (public). */
    async getPublicTeamInvitedData(token) {
        return this.get(`/api/public/team/get-invited-data/${encodeURIComponent(token)}`, undefined, NO_AUTH);
    }
    /** DELETE /api/public/team/reject-invite/{token} (public). */
    async rejectPublicTeamInvite(token) {
        return this.delete(`/api/public/team/reject-invite/${encodeURIComponent(token)}`, NO_AUTH);
    }
    /** GET /api/public/top-creators (public). */
    async getPublicTopCreators() {
        return this.get('/api/public/top-creators', undefined, NO_AUTH);
    }
    /** GET /api/public/user-country/{id} (public). */
    async getPublicUserCountry(id) {
        return this.get(`/api/public/user-country/${encodeURIComponent(String(id))}`, undefined, NO_AUTH);
    }
    // ===========================================================================
    // misc public
    // ===========================================================================
    /** GET /api/search (public). */
    async publicSearch(params = {}) {
        return this.get('/api/search', params, NO_AUTH);
    }
    /** GET /api/showcase/projects (public). */
    async getShowcaseProjects() {
        return this.get('/api/showcase/projects', undefined, NO_AUTH);
    }
    /** GET /api/twitter/timeline (public). */
    async getTwitterTimeline() {
        return this.get('/api/twitter/timeline', undefined, NO_AUTH);
    }
    /** GET /broadcasting/auth (public). */
    async broadcastingAuth() {
        return this.get('/broadcasting/auth', undefined, NO_AUTH);
    }
    /**
     * POST /api/support/error-report — anonymous error reporting from the
     * tenant-error pages. No Bearer required. Body shape is open-ended:
     * the controller stores the entire payload as the report context, so
     * callers can include arbitrary diagnostic fields (URL, user agent,
     * stack trace, app version, etc.).
     */
    async submitErrorReport(body) {
        return this.post('/api/support/error-report', body, NO_AUTH);
    }
}
exports.MiscCoreApiClient = MiscCoreApiClient;
// =============================================================================
// Re-export hint for `src/index.ts`
// -----------------------------------------------------------------------------
//   export { MiscCoreApiClient } from './api/misc-core-api-client';
//   export type {
//     AdminUpdateUserBody,
//     ChangeForcedPasswordRequest,
//     CreateLoginTransactionDashboardBody,
//     CreateLoginTransactionPublicBody,
//     GovCitiesQuery,
//     GovCityAgenciesQuery,
//     GovStatesQuery,
//     GovSubprojectsQuery,
//     InterfaceGetSmsBody,
//     InterfaceVerifyCodeBody,
//     MiscCoreResponse,
//     PublicAuthBySocialTokenBody,
//     PublicContactBody,
//     PublicCreatorsFilterBody,
//     PublicSubprojectsSearchBody,
//     PublicVerifySocialTokenBody,
//     SaveFrontendBody,
//     SetProgramStatusBody,
//     UpdateAdministratorRequest,
//     UpdateAiLogRequest,
//     UpdateAiPolicyRequest,
//     UpdateAiPromptRequest,
//     UpdateBillingInfoBody,
//     UpdateCreatorBody,
//     UpdateCreatorRequestBody,
//     UpdateDocumentationRequest,
//     UpdateDomainInterfaceBody,
//     UpdateFeeRequest,
//     UpdatePhoneBody,
//     UpdateProgramBody,
//     UpdateProgramCategoryRequest,
//     UpdateProgramSubCategoryRequest,
//     UpdateProgramTagRequest,
//     UpdateProjectRoleRequest,
//     UpdateProtocolBody,
//     UpdateProtocolSaleBody,
//     UpdateRoleBody,
//     UpdateSeoPageBody,
//     UpdateStatisticRequest,
//     UpdateSubscriptionBody,
//     UpdateUserBody,
//     UpdateUserPasswordBody,
//     VerifyCodeRequest,
//   } from './api/misc-core-api-client';
// =============================================================================
//# sourceMappingURL=misc-core-api-client.js.map