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
import type {
  AdminUpdateUserBody,
  ChangeForcedPasswordRequest,
  CreateLoginTransactionDashboardBody,
  CreateLoginTransactionPublicBody,
  GovCitiesQuery,
  GovCityAgenciesQuery,
  GovStatesQuery,
  GovSubprojectsQuery,
  InterfaceGetSmsBody,
  InterfaceVerifyCodeBody,
  MiscCoreResponse,
  PublicAuthBySocialTokenBody,
  PublicContactBody,
  PublicCreatorsFilterBody,
  PublicSubprojectsSearchBody,
  PublicVerifySocialTokenBody,
  SaveFrontendBody,
  SetProgramStatusBody,
  UpdateAdministratorRequest,
  UpdateAiLogRequest,
  UpdateAiPolicyRequest,
  UpdateAiPromptRequest,
  UpdateBillingInfoBody,
  UpdateCreatorBody,
  UpdateCreatorRequestBody,
  UpdateDocumentationRequest,
  UpdateDomainInterfaceBody,
  UpdateFeeRequest,
  UpdatePhoneBody,
  UpdateProgramBody,
  UpdateProgramCategoryRequest,
  UpdateProgramSubCategoryRequest,
  UpdateProgramTagRequest,
  UpdateProjectRoleRequest,
  UpdateProtocolBody,
  UpdateProtocolSaleBody,
  UpdateRoleBody,
  UpdateSeoPageBody,
  UpdateStatisticRequest,
  UpdateSubscriptionBody,
  UpdateUserBody,
  UpdateUserPasswordBody,
  VerifyCodeRequest,
} from '../types/misc-core';

export type {
  AdminUpdateUserBody,
  ChangeForcedPasswordRequest,
  CreateLoginTransactionDashboardBody,
  CreateLoginTransactionPublicBody,
  GovCitiesQuery,
  GovCityAgenciesQuery,
  GovStatesQuery,
  GovSubprojectsQuery,
  InterfaceGetSmsBody,
  InterfaceVerifyCodeBody,
  MiscCoreResponse,
  PublicAuthBySocialTokenBody,
  PublicContactBody,
  PublicCreatorsFilterBody,
  PublicSubprojectsSearchBody,
  PublicVerifySocialTokenBody,
  SaveFrontendBody,
  SetProgramStatusBody,
  UpdateAdministratorRequest,
  UpdateAiLogRequest,
  UpdateAiPolicyRequest,
  UpdateAiPromptRequest,
  UpdateBillingInfoBody,
  UpdateCreatorBody,
  UpdateCreatorRequestBody,
  UpdateDocumentationRequest,
  UpdateDomainInterfaceBody,
  UpdateFeeRequest,
  UpdatePhoneBody,
  UpdateProgramBody,
  UpdateProgramCategoryRequest,
  UpdateProgramSubCategoryRequest,
  UpdateProgramTagRequest,
  UpdateProjectRoleRequest,
  UpdateProtocolBody,
  UpdateProtocolSaleBody,
  UpdateRoleBody,
  UpdateSeoPageBody,
  UpdateStatisticRequest,
  UpdateSubscriptionBody,
  UpdateUserBody,
  UpdateUserPasswordBody,
  VerifyCodeRequest,
};

const NO_AUTH = { auth: false } as const;

export class MiscCoreApiClient extends BaseApiClient {
  // ===========================================================================
  // admin-side single-resource updates
  // ===========================================================================

  /** PUT /api/administrator/{administrator} */
  async updateAdministrator(
    administrator: number | string,
    body: UpdateAdministratorRequest,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.put<MiscCoreResponse>(
      `/api/administrator/${encodeURIComponent(String(administrator))}`,
      body,
    );
  }

  /** PUT /api/ai/log/{log} */
  async updateAiLog(
    log: number | string,
    body: UpdateAiLogRequest = {},
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.put<MiscCoreResponse>(
      `/api/ai/log/${encodeURIComponent(String(log))}`,
      body,
    );
  }

  /** PUT /api/ai/policy/{policy} */
  async updateAiPolicy(
    policy: number | string,
    body: UpdateAiPolicyRequest,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.put<MiscCoreResponse>(
      `/api/ai/policy/${encodeURIComponent(String(policy))}`,
      body,
    );
  }

  /** PUT /api/ai/prompts/update/{prompt} */
  async updateAiPrompt(
    prompt: number | string,
    body: UpdateAiPromptRequest,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.put<MiscCoreResponse>(
      `/api/ai/prompts/update/${encodeURIComponent(String(prompt))}`,
      body,
    );
  }

  /** PUT /api/documentation/{documentation} */
  async updateDocumentation(
    documentation: number | string,
    body: UpdateDocumentationRequest,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.put<MiscCoreResponse>(
      `/api/documentation/${encodeURIComponent(String(documentation))}`,
      body,
    );
  }

  /** PUT /api/fees/fee/{fee} */
  async updateFee(
    fee: number | string,
    body: UpdateFeeRequest,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.put<MiscCoreResponse>(
      `/api/fees/fee/${encodeURIComponent(String(fee))}`,
      body,
    );
  }

  /** PUT /api/program-category/{program_category} */
  async updateProgramCategory(
    programCategory: number | string,
    body: UpdateProgramCategoryRequest,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.put<MiscCoreResponse>(
      `/api/program-category/${encodeURIComponent(String(programCategory))}`,
      body,
    );
  }

  /** PUT /api/program-sub-category/{program_sub_category} */
  async updateProgramSubCategory(
    programSubCategory: number | string,
    body: UpdateProgramSubCategoryRequest,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.put<MiscCoreResponse>(
      `/api/program-sub-category/${encodeURIComponent(String(programSubCategory))}`,
      body,
    );
  }

  /** PUT /api/program-tag/{program_tag} */
  async updateProgramTag(
    programTag: number | string,
    body: UpdateProgramTagRequest,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.put<MiscCoreResponse>(
      `/api/program-tag/${encodeURIComponent(String(programTag))}`,
      body,
    );
  }

  /** PUT /api/project-role/{project_role} */
  async updateProjectRole(
    projectRole: number | string,
    body: UpdateProjectRoleRequest,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.put<MiscCoreResponse>(
      `/api/project-role/${encodeURIComponent(String(projectRole))}`,
      body,
    );
  }

  /** PUT /api/statistic/{statistic} */
  async updateStatistic(
    statistic: number | string,
    body: UpdateStatisticRequest,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.put<MiscCoreResponse>(
      `/api/statistic/${encodeURIComponent(String(statistic))}`,
      body,
    );
  }

  /** PUT /api/user/{user} (admin) */
  async adminUpdateUserById(
    user: number | string,
    body: AdminUpdateUserBody,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.put<MiscCoreResponse>(
      `/api/user/${encodeURIComponent(String(user))}`,
      body,
    );
  }

  // ===========================================================================
  // creator + program adjacent
  // ===========================================================================

  /** PUT /api/creator-request/{creator_request} */
  async updateCreatorRequest(
    creatorRequest: number | string,
    body: UpdateCreatorRequestBody,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.put<MiscCoreResponse>(
      `/api/creator-request/${encodeURIComponent(String(creatorRequest))}`,
      body,
    );
  }

  /** PUT /api/creator/{creator} */
  async updateCreator(
    creator: number | string,
    body: UpdateCreatorBody,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.put<MiscCoreResponse>(
      `/api/creator/${encodeURIComponent(String(creator))}`,
      body,
    );
  }

  /** PUT /api/program/update-program/{program} */
  async updateProgram(
    program: number | string,
    body: UpdateProgramBody = {},
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.put<MiscCoreResponse>(
      `/api/program/update-program/${encodeURIComponent(String(program))}`,
      body,
    );
  }

  /** GET /api/program-category/all */
  async listAllProgramCategories(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>('/api/program-category/all');
  }

  /** GET /api/program-sub-category/all */
  async listAllProgramSubCategories(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>('/api/program-sub-category/all');
  }

  /** GET /api/program-tag/all */
  async listAllProgramTags(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>('/api/program-tag/all');
  }

  /** GET /api/program-status/get/{program} */
  async getProgramPublishedStatus(
    program: number | string,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      `/api/program-status/get/${encodeURIComponent(String(program))}`,
    );
  }

  /** POST /api/program-status/set/{program} */
  async setProgramPublishedStatus(
    program: number | string,
    body: SetProgramStatusBody,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.post<MiscCoreResponse>(
      `/api/program-status/set/${encodeURIComponent(String(program))}`,
      body,
    );
  }

  /** GET /api/program-sale */
  async listProgramSales(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>('/api/program-sale');
  }

  /** POST /api/program-sale */
  async createProgramSale(
    body: Record<string, unknown> = {},
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.post<MiscCoreResponse>('/api/program-sale', body);
  }

  /** PUT /api/program-sale/{program_sale} */
  async updateProgramSale(
    programSale: number | string,
    body: Record<string, unknown> = {},
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.put<MiscCoreResponse>(
      `/api/program-sale/${encodeURIComponent(String(programSale))}`,
      body,
    );
  }

  /** PUT /api/protocol/{protocol} */
  async updateProtocol(
    protocol: number | string,
    body: UpdateProtocolBody,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.put<MiscCoreResponse>(
      `/api/protocol/${encodeURIComponent(String(protocol))}`,
      body,
    );
  }

  /** PATCH /api/protocol/sale/update/{protocol} */
  async updateProtocolSale(
    protocol: number | string,
    body: UpdateProtocolSaleBody,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.patch<MiscCoreResponse>(
      `/api/protocol/sale/update/${encodeURIComponent(String(protocol))}`,
      body,
    );
  }

  /** PATCH /api/subscription/update/{subscription} */
  async updateSubscription(
    subscription: number | string,
    body: UpdateSubscriptionBody = {},
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.patch<MiscCoreResponse>(
      `/api/subscription/update/${encodeURIComponent(String(subscription))}`,
      body,
    );
  }

  /** PUT /api/role/{role} */
  async updateRole(
    role: number | string,
    body: UpdateRoleBody = {},
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.put<MiscCoreResponse>(
      `/api/role/${encodeURIComponent(String(role))}`,
      body,
    );
  }

  /** PUT /api/seo-page/{seo_page} */
  async updateSeoPage(
    seoPage: number | string,
    body: UpdateSeoPageBody,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.put<MiscCoreResponse>(
      `/api/seo-page/${encodeURIComponent(String(seoPage))}`,
      body,
    );
  }

  /** PUT /api/frontend/save-frontend */
  async saveFrontend(
    body: SaveFrontendBody,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.put<MiscCoreResponse>('/api/frontend/save-frontend', body);
  }

  /** PATCH /api/domain-interfaces/{id} */
  async updateDomainInterface(
    id: number | string,
    body: UpdateDomainInterfaceBody,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.patch<MiscCoreResponse>(
      `/api/domain-interfaces/${encodeURIComponent(String(id))}`,
      body,
    );
  }

  // ===========================================================================
  // auth + user (api band)
  // ===========================================================================

  /** POST /api/auth/change-forced-password */
  async changeForcedPassword(
    body: ChangeForcedPasswordRequest,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.post<MiscCoreResponse>('/api/auth/change-forced-password', body);
  }

  /** GET /api/resend-verify-email */
  async resendVerifyEmail(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>('/api/resend-verify-email');
  }

  /** POST /api/verify-code */
  async verifyCode(
    body: VerifyCodeRequest,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.post<MiscCoreResponse>('/api/verify-code', body);
  }

  /** PATCH /api/users/update-billing-info */
  async patchBillingInfo(
    body: UpdateBillingInfoBody,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.patch<MiscCoreResponse>('/api/users/update-billing-info', body);
  }

  /** PATCH /api/users/update-password/{user} */
  async patchUserPassword(
    user: number | string,
    body: UpdateUserPasswordBody,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.patch<MiscCoreResponse>(
      `/api/users/update-password/${encodeURIComponent(String(user))}`,
      body,
    );
  }

  /** PATCH /api/users/update-phone */
  async patchUserPhone(
    body: UpdatePhoneBody,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.patch<MiscCoreResponse>('/api/users/update-phone', body);
  }

  /** PATCH /api/users/update/{user} */
  async patchUser(
    user: number | string,
    body: UpdateUserBody,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.patch<MiscCoreResponse>(
      `/api/users/update/${encodeURIComponent(String(user))}`,
      body,
    );
  }

  // ===========================================================================
  // chat
  // ===========================================================================

  /** DELETE /api/chat/delete-сhat/{chat} (note: Cyrillic "с" in path — preserved verbatim from spec). */
  async deleteChat(chat: number | string): Promise<ApiResponse<MiscCoreResponse>> {
    return this.delete<MiscCoreResponse>(
      `/api/chat/delete-сhat/${encodeURIComponent(String(chat))}`,
    );
  }

  // ===========================================================================
  // public auth + login flows
  // ===========================================================================

  /** POST /api/dashboard/create-login-transaction (`auth: public`). */
  async dashboardCreateLoginTransaction(
    body: CreateLoginTransactionDashboardBody,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.post<MiscCoreResponse>(
      '/api/dashboard/create-login-transaction',
      body,
      NO_AUTH,
    );
  }

  /** POST /api/public/auth-by-social-token (`auth: public`). */
  async publicAuthBySocialToken(
    body: PublicAuthBySocialTokenBody = {},
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.post<MiscCoreResponse>(
      '/api/public/auth-by-social-token',
      body,
      NO_AUTH,
    );
  }

  /** POST /api/public/contact (`auth: public`). */
  async publicContact(
    body: PublicContactBody,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.post<MiscCoreResponse>('/api/public/contact', body, NO_AUTH);
  }

  /** POST /api/public/create-login-transaction (`auth: public`). */
  async publicCreateLoginTransaction(
    body: CreateLoginTransactionPublicBody,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.post<MiscCoreResponse>(
      '/api/public/create-login-transaction',
      body,
      NO_AUTH,
    );
  }

  /** POST /api/public/verify-social-token (`auth: public`). */
  async publicVerifySocialToken(
    body: PublicVerifySocialTokenBody,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.post<MiscCoreResponse>(
      '/api/public/verify-social-token',
      body,
      NO_AUTH,
    );
  }

  // ===========================================================================
  // interface (public)
  // ===========================================================================

  /** GET /api/interface/auth-token/{token} (public). */
  async interfaceAuthByToken(
    token: string,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      `/api/interface/auth-token/${encodeURIComponent(token)}`,
      undefined,
      NO_AUTH,
    );
  }

  /** GET /api/interface/auth/{sessionKey} (public). */
  async interfaceAuthBySessionKey(
    sessionKey: string,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      `/api/interface/auth/${encodeURIComponent(sessionKey)}`,
      undefined,
      NO_AUTH,
    );
  }

  /** POST /api/interface/get-sms (public). */
  async interfaceGetSms(
    body: InterfaceGetSmsBody,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.post<MiscCoreResponse>(
      '/api/interface/get-sms',
      body,
      NO_AUTH,
    );
  }

  /** POST /api/interface/verify-code (public). */
  async interfaceVerifyCode(
    body: InterfaceVerifyCodeBody,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.post<MiscCoreResponse>(
      '/api/interface/verify-code',
      body,
      NO_AUTH,
    );
  }

  // ===========================================================================
  // MCP connector
  // ===========================================================================

  /** GET /api/mcp/connector (public). */
  async mcpConnectorIndex(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/mcp/connector',
      undefined,
      NO_AUTH,
    );
  }

  /** POST /api/mcp/connector (`auth: api`). */
  async mcpConnectorStore(
    body: Record<string, unknown> = {},
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.post<MiscCoreResponse>('/api/mcp/connector', body);
  }

  // ===========================================================================
  // gov directory (public)
  // ===========================================================================

  /** GET /api/gov/agency-footer (public). */
  async getGovAgencyFooter(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/gov/agency-footer',
      undefined,
      NO_AUTH,
    );
  }

  /** GET /api/gov/cities (public). */
  async getGovCities(
    params: GovCitiesQuery = {},
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/gov/cities',
      params as Record<string, unknown>,
      NO_AUTH,
    );
  }

  /** GET /api/gov/city-agencies (public). */
  async getGovCityAgencies(
    params: GovCityAgenciesQuery = {},
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/gov/city-agencies',
      params as Record<string, unknown>,
      NO_AUTH,
    );
  }

  /** GET /api/gov/federal-directory (public). */
  async getGovFederalDirectory(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/gov/federal-directory',
      undefined,
      NO_AUTH,
    );
  }

  /** GET /api/gov/states (public). */
  async getGovStates(
    params: GovStatesQuery = {},
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/gov/states',
      params as Record<string, unknown>,
      NO_AUTH,
    );
  }

  /** GET /api/gov/subprojects (public). */
  async getGovSubprojects(
    params: GovSubprojectsQuery = {},
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/gov/subprojects',
      params as Record<string, unknown>,
      NO_AUTH,
    );
  }

  /** GET /api/gov/subprojects/by-domain (public). */
  async getGovSubprojectByDomain(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/gov/subprojects/by-domain',
      undefined,
      NO_AUTH,
    );
  }

  /** GET /api/politicians-by-domain (public). */
  async getPoliticiansByDomain(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/politicians-by-domain',
      undefined,
      NO_AUTH,
    );
  }

  // ===========================================================================
  // home (public)
  // ===========================================================================

  /** GET /api/home/featured-creators (public). */
  async getHomeFeaturedCreators(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/home/featured-creators',
      undefined,
      NO_AUTH,
    );
  }

  /** GET /api/home/featured-programs (public). */
  async getHomeFeaturedPrograms(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/home/featured-programs',
      undefined,
      NO_AUTH,
    );
  }

  /** GET /api/home/feedback (public). */
  async getHomeFeedback(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/home/feedback',
      undefined,
      NO_AUTH,
    );
  }

  /** GET /api/home/frontend/{items} (public). */
  async getHomeFrontend(
    items: string,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      `/api/home/frontend/${encodeURIComponent(items)}`,
      undefined,
      NO_AUTH,
    );
  }

  /** GET /api/home/most-recent-programs (public). */
  async getHomeMostRecentPrograms(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/home/most-recent-programs',
      undefined,
      NO_AUTH,
    );
  }

  /** GET /api/home/statistic (public). */
  async getHomeStatistic(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/home/statistic',
      undefined,
      NO_AUTH,
    );
  }

  // ===========================================================================
  // public catalog / feed
  // ===========================================================================

  /** GET /api/public/creators (public). */
  async listPublicCreators(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/public/creators',
      undefined,
      NO_AUTH,
    );
  }

  /** POST /api/public/creators/filter (public). */
  async filterPublicCreators(
    body: PublicCreatorsFilterBody = {},
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.post<MiscCoreResponse>(
      '/api/public/creators/filter',
      body,
      NO_AUTH,
    );
  }

  /** GET /api/public/documentation/random-feedback (public). */
  async getDocumentationRandomFeedback(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/public/documentation/random-feedback',
      undefined,
      NO_AUTH,
    );
  }

  /** GET /api/public/documentation/search/{search?} (public). */
  async searchPublicDocumentation(
    search?: string,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    const url = search == null
      ? '/api/public/documentation/search'
      : `/api/public/documentation/search/${encodeURIComponent(search)}`;
    return this.get<MiscCoreResponse>(url, undefined, NO_AUTH);
  }

  /** GET /api/public/documentation/show/{documentation} (public). */
  async showPublicDocumentation(
    documentation: number | string,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      `/api/public/documentation/show/${encodeURIComponent(String(documentation))}`,
      undefined,
      NO_AUTH,
    );
  }

  /** GET /api/public/get-program-categories (public). */
  async getPublicProgramCategories(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/public/get-program-categories',
      undefined,
      NO_AUTH,
    );
  }

  /** GET /api/public/get-program-feedback/{program} (public). */
  async getPublicProgramFeedback(
    program: number | string,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      `/api/public/get-program-feedback/${encodeURIComponent(String(program))}`,
      undefined,
      NO_AUTH,
    );
  }

  /** GET /api/public/get-program-shop-categories (public). */
  async getPublicProgramShopCategories(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/public/get-program-shop-categories',
      undefined,
      NO_AUTH,
    );
  }

  /** GET /api/public/get-program/{program} (public). */
  async getPublicProgram(
    program: number | string,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      `/api/public/get-program/${encodeURIComponent(String(program))}`,
      undefined,
      NO_AUTH,
    );
  }

  /** GET /api/public/get-programs (public). */
  async getPublicPrograms(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/public/get-programs',
      undefined,
      NO_AUTH,
    );
  }

  /** GET /api/public/get-roles (public). */
  async getPublicRoles(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/public/get-roles',
      undefined,
      NO_AUTH,
    );
  }

  /** GET /api/public/get-user-featured/{user} (public). */
  async getPublicUserFeatured(
    user: number | string,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      `/api/public/get-user-featured/${encodeURIComponent(String(user))}`,
      undefined,
      NO_AUTH,
    );
  }

  /** GET /api/public/get-user-feed/{user} (public). */
  async getPublicUserFeed(
    user: number | string,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      `/api/public/get-user-feed/${encodeURIComponent(String(user))}`,
      undefined,
      NO_AUTH,
    );
  }

  /** GET /api/public/program-sale/money-distributions (public). */
  async getPublicProgramSaleMoneyDistributions(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/public/program-sale/money-distributions',
      undefined,
      NO_AUTH,
    );
  }

  /** GET /api/public/short-link/{shortLink} (public). */
  async resolvePublicShortLink(
    shortLink: string,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      `/api/public/short-link/${encodeURIComponent(shortLink)}`,
      undefined,
      NO_AUTH,
    );
  }

  /** GET /api/public/subprojects (public). */
  async listPublicSubprojects(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/public/subprojects',
      undefined,
      NO_AUTH,
    );
  }

  /** POST /api/public/subprojects/search (public). */
  async searchPublicSubprojects(
    body: PublicSubprojectsSearchBody = {},
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.post<MiscCoreResponse>(
      '/api/public/subprojects/search',
      body,
      NO_AUTH,
    );
  }

  /** GET /api/public/team/get-invite/{token} (public). */
  async getPublicTeamInvite(
    token: string,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      `/api/public/team/get-invite/${encodeURIComponent(token)}`,
      undefined,
      NO_AUTH,
    );
  }

  /** GET /api/public/team/get-invited-data/{token} (public). */
  async getPublicTeamInvitedData(
    token: string,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      `/api/public/team/get-invited-data/${encodeURIComponent(token)}`,
      undefined,
      NO_AUTH,
    );
  }

  /** DELETE /api/public/team/reject-invite/{token} (public). */
  async rejectPublicTeamInvite(
    token: string,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.delete<MiscCoreResponse>(
      `/api/public/team/reject-invite/${encodeURIComponent(token)}`,
      NO_AUTH,
    );
  }

  /** GET /api/public/top-creators (public). */
  async getPublicTopCreators(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/public/top-creators',
      undefined,
      NO_AUTH,
    );
  }

  /** GET /api/public/user-country/{id} (public). */
  async getPublicUserCountry(
    id: number | string,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      `/api/public/user-country/${encodeURIComponent(String(id))}`,
      undefined,
      NO_AUTH,
    );
  }

  // ===========================================================================
  // misc public
  // ===========================================================================

  /** GET /api/search (public). */
  async publicSearch(
    params: Record<string, unknown> = {},
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>('/api/search', params, NO_AUTH);
  }

  /** GET /api/showcase/projects (public). */
  async getShowcaseProjects(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/showcase/projects',
      undefined,
      NO_AUTH,
    );
  }

  /** GET /api/twitter/timeline (public). */
  async getTwitterTimeline(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/api/twitter/timeline',
      undefined,
      NO_AUTH,
    );
  }

  /** GET /broadcasting/auth (public). */
  async broadcastingAuth(): Promise<ApiResponse<MiscCoreResponse>> {
    return this.get<MiscCoreResponse>(
      '/broadcasting/auth',
      undefined,
      NO_AUTH,
    );
  }

  /**
   * POST /api/support/error-report — anonymous error reporting from the
   * tenant-error pages. No Bearer required. Body shape is open-ended:
   * the controller stores the entire payload as the report context, so
   * callers can include arbitrary diagnostic fields (URL, user agent,
   * stack trace, app version, etc.).
   */
  async submitErrorReport(
    body: Record<string, unknown>,
  ): Promise<ApiResponse<MiscCoreResponse>> {
    return this.post<MiscCoreResponse>('/api/support/error-report', body, NO_AUTH);
  }
}

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
