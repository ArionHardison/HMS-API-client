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
import { BaseApiClient, type ApiResponse } from '../api-client';
import type { AdminUpdateUserBody, ChangeForcedPasswordRequest, CreateLoginTransactionDashboardBody, CreateLoginTransactionPublicBody, GovCitiesQuery, GovCityAgenciesQuery, GovStatesQuery, GovSubprojectsQuery, InterfaceGetSmsBody, InterfaceVerifyCodeBody, MiscCoreResponse, PublicAuthBySocialTokenBody, PublicContactBody, PublicCreatorsFilterBody, PublicSubprojectsSearchBody, PublicVerifySocialTokenBody, SaveFrontendBody, SetProgramStatusBody, UpdateAdministratorRequest, UpdateAiLogRequest, UpdateAiPolicyRequest, UpdateAiPromptRequest, UpdateBillingInfoBody, UpdateCreatorBody, UpdateCreatorRequestBody, UpdateDocumentationRequest, UpdateDomainInterfaceBody, UpdateFeeRequest, UpdatePhoneBody, UpdateProgramBody, UpdateProgramCategoryRequest, UpdateProgramSubCategoryRequest, UpdateProgramTagRequest, UpdateProjectRoleRequest, UpdateProtocolBody, UpdateProtocolSaleBody, UpdateRoleBody, UpdateSeoPageBody, UpdateStatisticRequest, UpdateSubscriptionBody, UpdateUserBody, UpdateUserPasswordBody, VerifyCodeRequest } from '../types/misc-core';
export type { AdminUpdateUserBody, ChangeForcedPasswordRequest, CreateLoginTransactionDashboardBody, CreateLoginTransactionPublicBody, GovCitiesQuery, GovCityAgenciesQuery, GovStatesQuery, GovSubprojectsQuery, InterfaceGetSmsBody, InterfaceVerifyCodeBody, MiscCoreResponse, PublicAuthBySocialTokenBody, PublicContactBody, PublicCreatorsFilterBody, PublicSubprojectsSearchBody, PublicVerifySocialTokenBody, SaveFrontendBody, SetProgramStatusBody, UpdateAdministratorRequest, UpdateAiLogRequest, UpdateAiPolicyRequest, UpdateAiPromptRequest, UpdateBillingInfoBody, UpdateCreatorBody, UpdateCreatorRequestBody, UpdateDocumentationRequest, UpdateDomainInterfaceBody, UpdateFeeRequest, UpdatePhoneBody, UpdateProgramBody, UpdateProgramCategoryRequest, UpdateProgramSubCategoryRequest, UpdateProgramTagRequest, UpdateProjectRoleRequest, UpdateProtocolBody, UpdateProtocolSaleBody, UpdateRoleBody, UpdateSeoPageBody, UpdateStatisticRequest, UpdateSubscriptionBody, UpdateUserBody, UpdateUserPasswordBody, VerifyCodeRequest, };
export declare class MiscCoreApiClient extends BaseApiClient {
    /** PUT /api/administrator/{administrator} */
    updateAdministrator(administrator: number | string, body: UpdateAdministratorRequest): Promise<ApiResponse<MiscCoreResponse>>;
    /** PUT /api/ai/log/{log} */
    updateAiLog(log: number | string, body?: UpdateAiLogRequest): Promise<ApiResponse<MiscCoreResponse>>;
    /** PUT /api/ai/policy/{policy} */
    updateAiPolicy(policy: number | string, body: UpdateAiPolicyRequest): Promise<ApiResponse<MiscCoreResponse>>;
    /** PUT /api/ai/prompts/update/{prompt} */
    updateAiPrompt(prompt: number | string, body: UpdateAiPromptRequest): Promise<ApiResponse<MiscCoreResponse>>;
    /** PUT /api/documentation/{documentation} */
    updateDocumentation(documentation: number | string, body: UpdateDocumentationRequest): Promise<ApiResponse<MiscCoreResponse>>;
    /** PUT /api/fees/fee/{fee} */
    updateFee(fee: number | string, body: UpdateFeeRequest): Promise<ApiResponse<MiscCoreResponse>>;
    /** PUT /api/program-category/{program_category} */
    updateProgramCategory(programCategory: number | string, body: UpdateProgramCategoryRequest): Promise<ApiResponse<MiscCoreResponse>>;
    /** PUT /api/program-sub-category/{program_sub_category} */
    updateProgramSubCategory(programSubCategory: number | string, body: UpdateProgramSubCategoryRequest): Promise<ApiResponse<MiscCoreResponse>>;
    /** PUT /api/program-tag/{program_tag} */
    updateProgramTag(programTag: number | string, body: UpdateProgramTagRequest): Promise<ApiResponse<MiscCoreResponse>>;
    /** PUT /api/project-role/{project_role} */
    updateProjectRole(projectRole: number | string, body: UpdateProjectRoleRequest): Promise<ApiResponse<MiscCoreResponse>>;
    /** PUT /api/statistic/{statistic} */
    updateStatistic(statistic: number | string, body: UpdateStatisticRequest): Promise<ApiResponse<MiscCoreResponse>>;
    /** PUT /api/user/{user} (admin) */
    adminUpdateUserById(user: number | string, body: AdminUpdateUserBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** PUT /api/creator-request/{creator_request} */
    updateCreatorRequest(creatorRequest: number | string, body: UpdateCreatorRequestBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** PUT /api/creator/{creator} */
    updateCreator(creator: number | string, body: UpdateCreatorBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** PUT /api/program/update-program/{program} */
    updateProgram(program: number | string, body?: UpdateProgramBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/program-category/all */
    listAllProgramCategories(): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/program-sub-category/all */
    listAllProgramSubCategories(): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/program-tag/all */
    listAllProgramTags(): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/program-status/get/{program} */
    getProgramPublishedStatus(program: number | string): Promise<ApiResponse<MiscCoreResponse>>;
    /** POST /api/program-status/set/{program} */
    setProgramPublishedStatus(program: number | string, body: SetProgramStatusBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/program-sale */
    listProgramSales(): Promise<ApiResponse<MiscCoreResponse>>;
    /** POST /api/program-sale */
    createProgramSale(body?: Record<string, unknown>): Promise<ApiResponse<MiscCoreResponse>>;
    /** PUT /api/program-sale/{program_sale} */
    updateProgramSale(programSale: number | string, body?: Record<string, unknown>): Promise<ApiResponse<MiscCoreResponse>>;
    /** PUT /api/protocol/{protocol} */
    updateProtocol(protocol: number | string, body: UpdateProtocolBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** PATCH /api/protocol/sale/update/{protocol} */
    updateProtocolSale(protocol: number | string, body: UpdateProtocolSaleBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** PATCH /api/subscription/update/{subscription} */
    updateSubscription(subscription: number | string, body?: UpdateSubscriptionBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** PUT /api/role/{role} */
    updateRole(role: number | string, body?: UpdateRoleBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** PUT /api/seo-page/{seo_page} */
    updateSeoPage(seoPage: number | string, body: UpdateSeoPageBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** PUT /api/frontend/save-frontend */
    saveFrontend(body: SaveFrontendBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** PATCH /api/domain-interfaces/{id} */
    updateDomainInterface(id: number | string, body: UpdateDomainInterfaceBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** POST /api/auth/change-forced-password */
    changeForcedPassword(body: ChangeForcedPasswordRequest): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/resend-verify-email */
    resendVerifyEmail(): Promise<ApiResponse<MiscCoreResponse>>;
    /** POST /api/verify-code */
    verifyCode(body: VerifyCodeRequest): Promise<ApiResponse<MiscCoreResponse>>;
    /** PATCH /api/users/update-billing-info */
    patchBillingInfo(body: UpdateBillingInfoBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** PATCH /api/users/update-password/{user} */
    patchUserPassword(user: number | string, body: UpdateUserPasswordBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** PATCH /api/users/update-phone */
    patchUserPhone(body: UpdatePhoneBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** PATCH /api/users/update/{user} */
    patchUser(user: number | string, body: UpdateUserBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** DELETE /api/chat/delete-сhat/{chat} (note: Cyrillic "с" in path — preserved verbatim from spec). */
    deleteChat(chat: number | string): Promise<ApiResponse<MiscCoreResponse>>;
    /** POST /api/dashboard/create-login-transaction (`auth: public`). */
    dashboardCreateLoginTransaction(body: CreateLoginTransactionDashboardBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** POST /api/public/auth-by-social-token (`auth: public`). */
    publicAuthBySocialToken(body?: PublicAuthBySocialTokenBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** POST /api/public/contact (`auth: public`). */
    publicContact(body: PublicContactBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** POST /api/public/create-login-transaction (`auth: public`). */
    publicCreateLoginTransaction(body: CreateLoginTransactionPublicBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** POST /api/public/verify-social-token (`auth: public`). */
    publicVerifySocialToken(body: PublicVerifySocialTokenBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/interface/auth-token/{token} (public). */
    interfaceAuthByToken(token: string): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/interface/auth/{sessionKey} (public). */
    interfaceAuthBySessionKey(sessionKey: string): Promise<ApiResponse<MiscCoreResponse>>;
    /** POST /api/interface/get-sms (public). */
    interfaceGetSms(body: InterfaceGetSmsBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** POST /api/interface/verify-code (public). */
    interfaceVerifyCode(body: InterfaceVerifyCodeBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/mcp/connector (public). */
    mcpConnectorIndex(): Promise<ApiResponse<MiscCoreResponse>>;
    /** POST /api/mcp/connector (`auth: api`). */
    mcpConnectorStore(body?: Record<string, unknown>): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/gov/agency-footer (public). */
    getGovAgencyFooter(): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/gov/cities (public). */
    getGovCities(params?: GovCitiesQuery): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/gov/city-agencies (public). */
    getGovCityAgencies(params?: GovCityAgenciesQuery): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/gov/federal-directory (public). */
    getGovFederalDirectory(): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/gov/states (public). */
    getGovStates(params?: GovStatesQuery): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/gov/subprojects (public). */
    getGovSubprojects(params?: GovSubprojectsQuery): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/gov/subprojects/by-domain (public). */
    getGovSubprojectByDomain(): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/politicians-by-domain (public). */
    getPoliticiansByDomain(): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/home/featured-creators (public). */
    getHomeFeaturedCreators(): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/home/featured-programs (public). */
    getHomeFeaturedPrograms(): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/home/feedback (public). */
    getHomeFeedback(): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/home/frontend/{items} (public). */
    getHomeFrontend(items: string): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/home/most-recent-programs (public). */
    getHomeMostRecentPrograms(): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/home/statistic (public). */
    getHomeStatistic(): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/public/creators (public). */
    listPublicCreators(): Promise<ApiResponse<MiscCoreResponse>>;
    /** POST /api/public/creators/filter (public). */
    filterPublicCreators(body?: PublicCreatorsFilterBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/public/documentation/random-feedback (public). */
    getDocumentationRandomFeedback(): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/public/documentation/search/{search?} (public). */
    searchPublicDocumentation(search?: string): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/public/documentation/show/{documentation} (public). */
    showPublicDocumentation(documentation: number | string): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/public/get-program-categories (public). */
    getPublicProgramCategories(): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/public/get-program-feedback/{program} (public). */
    getPublicProgramFeedback(program: number | string): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/public/get-program-shop-categories (public). */
    getPublicProgramShopCategories(): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/public/get-program/{program} (public). */
    getPublicProgram(program: number | string): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/public/get-programs (public). */
    getPublicPrograms(): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/public/get-roles (public). */
    getPublicRoles(): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/public/get-user-featured/{user} (public). */
    getPublicUserFeatured(user: number | string): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/public/get-user-feed/{user} (public). */
    getPublicUserFeed(user: number | string): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/public/program-sale/money-distributions (public). */
    getPublicProgramSaleMoneyDistributions(): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/public/short-link/{shortLink} (public). */
    resolvePublicShortLink(shortLink: string): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/public/subprojects (public). */
    listPublicSubprojects(): Promise<ApiResponse<MiscCoreResponse>>;
    /** POST /api/public/subprojects/search (public). */
    searchPublicSubprojects(body?: PublicSubprojectsSearchBody): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/public/team/get-invite/{token} (public). */
    getPublicTeamInvite(token: string): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/public/team/get-invited-data/{token} (public). */
    getPublicTeamInvitedData(token: string): Promise<ApiResponse<MiscCoreResponse>>;
    /** DELETE /api/public/team/reject-invite/{token} (public). */
    rejectPublicTeamInvite(token: string): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/public/top-creators (public). */
    getPublicTopCreators(): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/public/user-country/{id} (public). */
    getPublicUserCountry(id: number | string): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/search (public). */
    publicSearch(params?: Record<string, unknown>): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/showcase/projects (public). */
    getShowcaseProjects(): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /api/twitter/timeline (public). */
    getTwitterTimeline(): Promise<ApiResponse<MiscCoreResponse>>;
    /** GET /broadcasting/auth (public). */
    broadcastingAuth(): Promise<ApiResponse<MiscCoreResponse>>;
    /**
     * POST /api/support/error-report — anonymous error reporting from the
     * tenant-error pages. No Bearer required. Body shape is open-ended:
     * the controller stores the entire payload as the report context, so
     * callers can include arbitrary diagnostic fields (URL, user agent,
     * stack trace, app version, etc.).
     */
    submitErrorReport(body: Record<string, unknown>): Promise<ApiResponse<MiscCoreResponse>>;
}
//# sourceMappingURL=misc-core-api-client.d.ts.map