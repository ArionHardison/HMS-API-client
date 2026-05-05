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

import { BaseApiClient, type ApiResponse } from '../api-client';
import type {
  AdministratorData,
  AdminCreateUserRequest,
  AdminEmptyOk,
  AdminPaginatedPayload,
  AdminSearchRequest,
  AdminUserData,
  AiInstallationStatusData,
  AiLogData,
  AiLogRequest,
  AiModelData,
  AiPolicyData,
  AiPolicyRequest,
  AiPromptData,
  AiSettingsData,
  AttachPromptToPolicyRequest,
  CreateAdministratorRequest,
  CreateAiPromptRequest,
  CreateProgramCategoryRequest,
  CreateProgramSubCategoryRequest,
  DomainSettingsData,
  FeeSettingsData,
  FindFeeUsersRequest,
  ProgramCategoryData,
  ProgramSubCategoryData,
  ProgramTagData,
  ProgramTagRequest,
  ProjectRoleData,
  ProjectRoleRequest,
  ProviderData,
  ProviderRolesData,
  RolesToAssignData,
  SaveAiSettingsRequest,
  SaveDashboardSettingsRequest,
  SaveFeeSettingsRequest,
  StatisticData,
  StatisticRequest,
  TeamSearchRequest,
  UpdateAdministratorRequest,
  UpdateAiPromptRequest,
  UpdateProgramCategoryRequest,
  UpdateProgramSubCategoryRequest,
  UserFeeSettingsData,
  UserFeeSettingsRequest,
} from '../types/admin';

// Re-export so consumers can pull types from one place.
export type {
  AdministratorData,
  AdminCreateUserRequest,
  AdminEmptyOk,
  AdminPaginatedPayload,
  AdminSearchRequest,
  AdminUserData,
  AiInstallationStatusData,
  AiLogData,
  AiLogRequest,
  AiModelData,
  AiPolicyData,
  AiPolicyRequest,
  AiPromptData,
  AiSettingsData,
  AttachPromptToPolicyRequest,
  CreateAdministratorRequest,
  CreateAiPromptRequest,
  CreateProgramCategoryRequest,
  CreateProgramSubCategoryRequest,
  DomainSettingsData,
  FeeSettingsData,
  FindFeeUsersRequest,
  ProgramCategoryData,
  ProgramSubCategoryData,
  ProgramTagData,
  ProgramTagRequest,
  ProjectRoleData,
  ProjectRoleRequest,
  ProviderData,
  ProviderRolesData,
  RolesToAssignData,
  SaveAiSettingsRequest,
  SaveDashboardSettingsRequest,
  SaveFeeSettingsRequest,
  StatisticData,
  StatisticRequest,
  TeamSearchRequest,
  UpdateAdministratorRequest,
  UpdateAiPromptRequest,
  UpdateProgramCategoryRequest,
  UpdateProgramSubCategoryRequest,
  UserFeeSettingsData,
  UserFeeSettingsRequest,
};

export class AdminApiClient extends BaseApiClient {
  // ===========================================================================
  // Search (admin / team search)
  // ===========================================================================

  /** POST /api/admin-search */
  async adminSearch(body: AdminSearchRequest): Promise<ApiResponse<unknown[]>> {
    return this.post<unknown[]>('/api/admin-search', body);
  }

  /** POST /api/team-search */
  async teamSearch(body: TeamSearchRequest): Promise<ApiResponse<unknown[]>> {
    return this.post<unknown[]>('/api/team-search', body);
  }

  // ===========================================================================
  // Administrator CRUD (`administrator.*`)
  // ===========================================================================

  /** POST /api/administrator */
  async createAdministrator(
    body: CreateAdministratorRequest,
  ): Promise<ApiResponse<AdministratorData>> {
    return this.post<AdministratorData>('/api/administrator', body);
  }

  /** GET /api/administrator/{administrator} */
  async getAdministrator(
    administrator: number | string,
  ): Promise<ApiResponse<AdministratorData>> {
    return this.get<AdministratorData>(
      `/api/administrator/${encodeURIComponent(String(administrator))}`,
    );
  }

  /** PUT /api/administrator/{administrator} (POST + ?_method=PUT). */
  async updateAdministrator(
    administrator: number | string,
    body: UpdateAdministratorRequest,
  ): Promise<ApiResponse<AdministratorData>> {
    return this.put<AdministratorData>(
      `/api/administrator/${encodeURIComponent(String(administrator))}`,
      body,
    );
  }

  /** DELETE /api/administrator/{administrator} */
  async deleteAdministrator(
    administrator: number | string,
  ): Promise<ApiResponse<AdminEmptyOk>> {
    return this.delete<AdminEmptyOk>(
      `/api/administrator/${encodeURIComponent(String(administrator))}`,
    );
  }

  // ===========================================================================
  // AI – models / settings / installation
  // ===========================================================================

  /** POST /api/ai/delete-model */
  async deleteAiModel(body?: Record<string, unknown>): Promise<ApiResponse<AdminEmptyOk>> {
    return this.post<AdminEmptyOk>('/api/ai/delete-model', body ?? {});
  }

  /** GET /api/ai/get-models */
  async getAiModels(): Promise<ApiResponse<AiModelData[]>> {
    return this.get<AiModelData[]>('/api/ai/get-models');
  }

  /** GET /api/ai/get-models-list */
  async getAiModelsList(): Promise<ApiResponse<AiModelData[]>> {
    return this.get<AiModelData[]>('/api/ai/get-models-list');
  }

  /** GET /api/ai/get-settings */
  async getAiSettings(): Promise<ApiResponse<AiSettingsData>> {
    return this.get<AiSettingsData>('/api/ai/get-settings');
  }

  /** POST /api/ai/install-model */
  async installAiModel(
    body?: Record<string, unknown>,
  ): Promise<ApiResponse<AdminEmptyOk>> {
    return this.post<AdminEmptyOk>('/api/ai/install-model', body ?? {});
  }

  /** GET /api/ai/installation-status */
  async getAiInstallationStatus(): Promise<ApiResponse<AiInstallationStatusData>> {
    return this.get<AiInstallationStatusData>('/api/ai/installation-status');
  }

  /** POST /api/ai/save-settings */
  async saveAiSettings(body: SaveAiSettingsRequest): Promise<ApiResponse<AdminEmptyOk>> {
    return this.post<AdminEmptyOk>('/api/ai/save-settings', body);
  }

  // ===========================================================================
  // AI Log CRUD (`admin.ai.log.*`)
  // ===========================================================================

  /** GET /api/ai/log */
  async listAiLogs(): Promise<ApiResponse<AiLogData[]>> {
    return this.get<AiLogData[]>('/api/ai/log');
  }

  /** POST /api/ai/log */
  async createAiLog(body: AiLogRequest): Promise<ApiResponse<AiLogData>> {
    return this.post<AiLogData>('/api/ai/log', body);
  }

  /** GET /api/ai/log/{log} */
  async getAiLog(log: number | string): Promise<ApiResponse<AiLogData>> {
    return this.get<AiLogData>(`/api/ai/log/${encodeURIComponent(String(log))}`);
  }

  /** PUT /api/ai/log/{log} */
  async updateAiLog(
    log: number | string,
    body: AiLogRequest,
  ): Promise<ApiResponse<AiLogData>> {
    return this.put<AiLogData>(`/api/ai/log/${encodeURIComponent(String(log))}`, body);
  }

  /** DELETE /api/ai/log/{log} */
  async deleteAiLog(log: number | string): Promise<ApiResponse<AdminEmptyOk>> {
    return this.delete<AdminEmptyOk>(
      `/api/ai/log/${encodeURIComponent(String(log))}`,
    );
  }

  // ===========================================================================
  // AI Policy CRUD + prompt linkage
  // ===========================================================================

  /** GET /api/ai/policy */
  async listAiPolicies(): Promise<ApiResponse<AiPolicyData[]>> {
    return this.get<AiPolicyData[]>('/api/ai/policy');
  }

  /** POST /api/ai/policy */
  async createAiPolicy(body: AiPolicyRequest): Promise<ApiResponse<AiPolicyData>> {
    return this.post<AiPolicyData>('/api/ai/policy', body);
  }

  /** GET /api/ai/policy/{policy} */
  async getAiPolicy(policy: number | string): Promise<ApiResponse<AiPolicyData>> {
    return this.get<AiPolicyData>(
      `/api/ai/policy/${encodeURIComponent(String(policy))}`,
    );
  }

  /** PUT /api/ai/policy/{policy} */
  async updateAiPolicy(
    policy: number | string,
    body: AiPolicyRequest,
  ): Promise<ApiResponse<AiPolicyData>> {
    return this.put<AiPolicyData>(
      `/api/ai/policy/${encodeURIComponent(String(policy))}`,
      body,
    );
  }

  /** DELETE /api/ai/policy/{policy} */
  async deleteAiPolicy(policy: number | string): Promise<ApiResponse<AdminEmptyOk>> {
    return this.delete<AdminEmptyOk>(
      `/api/ai/policy/${encodeURIComponent(String(policy))}`,
    );
  }

  /** DELETE /api/ai/policy-file/{file} */
  async deleteAiPolicyFile(file: number | string): Promise<ApiResponse<AdminEmptyOk>> {
    return this.delete<AdminEmptyOk>(
      `/api/ai/policy-file/${encodeURIComponent(String(file))}`,
    );
  }

  /** GET /api/ai/policy-list/{prompt} */
  async listAiPoliciesForPrompt(
    prompt: number | string,
  ): Promise<ApiResponse<AiPolicyData[]>> {
    return this.get<AiPolicyData[]>(
      `/api/ai/policy-list/${encodeURIComponent(String(prompt))}`,
    );
  }

  /** POST /api/ai/policy/{policy}/prompts */
  async attachPromptToAiPolicy(
    policy: number | string,
    body: AttachPromptToPolicyRequest,
  ): Promise<ApiResponse<AdminEmptyOk>> {
    return this.post<AdminEmptyOk>(
      `/api/ai/policy/${encodeURIComponent(String(policy))}/prompts`,
      body,
    );
  }

  /** DELETE /api/ai/policy/{policy}/prompts/{prompt} */
  async detachPromptFromAiPolicy(
    policy: number | string,
    prompt: number | string,
  ): Promise<ApiResponse<AdminEmptyOk>> {
    return this.delete<AdminEmptyOk>(
      `/api/ai/policy/${encodeURIComponent(String(policy))}/prompts/${encodeURIComponent(String(prompt))}`,
    );
  }

  // ===========================================================================
  // AI Prompts
  // ===========================================================================

  /** POST /api/ai/prompts/create */
  async createAiPrompt(
    body: CreateAiPromptRequest,
  ): Promise<ApiResponse<AiPromptData>> {
    return this.post<AiPromptData>('/api/ai/prompts/create', body);
  }

  /** GET /api/ai/prompts/keywords */
  async getAiPromptKeywords(): Promise<ApiResponse<unknown[]>> {
    return this.get<unknown[]>('/api/ai/prompts/keywords');
  }

  /** GET /api/ai/prompts/list */
  async listAiPrompts(): Promise<ApiResponse<AiPromptData[]>> {
    return this.get<AiPromptData[]>('/api/ai/prompts/list');
  }

  /** GET /api/ai/prompts/list-policies */
  async listAiPromptPolicies(): Promise<ApiResponse<AiPolicyData[]>> {
    return this.get<AiPolicyData[]>('/api/ai/prompts/list-policies');
  }

  /** GET /api/ai/prompts/required-list */
  async getRequiredAiPrompts(): Promise<ApiResponse<AiPromptData[]>> {
    return this.get<AiPromptData[]>('/api/ai/prompts/required-list');
  }

  /** GET /api/ai/prompts/show/{prompt} */
  async getAiPrompt(prompt: number | string): Promise<ApiResponse<AiPromptData>> {
    return this.get<AiPromptData>(
      `/api/ai/prompts/show/${encodeURIComponent(String(prompt))}`,
    );
  }

  /** PUT /api/ai/prompts/update/{prompt} */
  async updateAiPrompt(
    prompt: number | string,
    body: UpdateAiPromptRequest,
  ): Promise<ApiResponse<AiPromptData>> {
    return this.put<AiPromptData>(
      `/api/ai/prompts/update/${encodeURIComponent(String(prompt))}`,
      body,
    );
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
  async saveDashboardSettings(
    body: SaveDashboardSettingsRequest,
  ): Promise<ApiResponse<AdminEmptyOk>> {
    return this.post<AdminEmptyOk>('/api/dashboard-settings/save', body);
  }

  /** GET /api/domain-settings/{id} */
  async getDomainSettings(id: number | string): Promise<ApiResponse<DomainSettingsData>> {
    return this.get<DomainSettingsData>(
      `/api/domain-settings/${encodeURIComponent(String(id))}`,
    );
  }

  // ===========================================================================
  // Fees
  // ===========================================================================

  /** GET /api/fees/fee */
  async listFees(): Promise<ApiResponse<UserFeeSettingsData[]>> {
    return this.get<UserFeeSettingsData[]>('/api/fees/fee');
  }

  /** POST /api/fees/fee */
  async createFee(
    body: UserFeeSettingsRequest,
  ): Promise<ApiResponse<UserFeeSettingsData>> {
    return this.post<UserFeeSettingsData>('/api/fees/fee', body);
  }

  /** GET /api/fees/fee/{fee} */
  async getFee(fee: number | string): Promise<ApiResponse<UserFeeSettingsData>> {
    return this.get<UserFeeSettingsData>(
      `/api/fees/fee/${encodeURIComponent(String(fee))}`,
    );
  }

  /** PUT /api/fees/fee/{fee} */
  async updateFee(
    fee: number | string,
    body: UserFeeSettingsRequest,
  ): Promise<ApiResponse<UserFeeSettingsData>> {
    return this.put<UserFeeSettingsData>(
      `/api/fees/fee/${encodeURIComponent(String(fee))}`,
      body,
    );
  }

  /** DELETE /api/fees/fee/{fee} */
  async deleteFee(fee: number | string): Promise<ApiResponse<AdminEmptyOk>> {
    return this.delete<AdminEmptyOk>(
      `/api/fees/fee/${encodeURIComponent(String(fee))}`,
    );
  }

  /** POST /api/fees/find-users */
  async findFeeUsers(body: FindFeeUsersRequest): Promise<ApiResponse<unknown[]>> {
    return this.post<unknown[]>('/api/fees/find-users', body);
  }

  /** GET /api/fees/get-settings */
  async getFeeSettings(): Promise<ApiResponse<FeeSettingsData>> {
    return this.get<FeeSettingsData>('/api/fees/get-settings');
  }

  /** POST /api/fees/save-settings */
  async saveFeeSettings(
    body: SaveFeeSettingsRequest,
  ): Promise<ApiResponse<AdminEmptyOk>> {
    return this.post<AdminEmptyOk>('/api/fees/save-settings', body);
  }

  // ===========================================================================
  // Program categories / sub-categories / tags
  // ===========================================================================

  /** GET /api/program-categories */
  async listProgramCategoriesPublic(): Promise<ApiResponse<ProgramCategoryData[]>> {
    return this.get<ProgramCategoryData[]>('/api/program-categories');
  }

  /** GET /api/program-category */
  async listProgramCategories(): Promise<ApiResponse<ProgramCategoryData[]>> {
    return this.get<ProgramCategoryData[]>('/api/program-category');
  }

  /** POST /api/program-category */
  async createProgramCategory(
    body: CreateProgramCategoryRequest,
  ): Promise<ApiResponse<ProgramCategoryData>> {
    return this.post<ProgramCategoryData>('/api/program-category', body);
  }

  /** GET /api/program-category/{program_category} */
  async getProgramCategory(
    programCategory: number | string,
  ): Promise<ApiResponse<ProgramCategoryData>> {
    return this.get<ProgramCategoryData>(
      `/api/program-category/${encodeURIComponent(String(programCategory))}`,
    );
  }

  /** PUT /api/program-category/{program_category} */
  async updateProgramCategory(
    programCategory: number | string,
    body: UpdateProgramCategoryRequest,
  ): Promise<ApiResponse<ProgramCategoryData>> {
    return this.put<ProgramCategoryData>(
      `/api/program-category/${encodeURIComponent(String(programCategory))}`,
      body,
    );
  }

  /** DELETE /api/program-category/{program_category} */
  async deleteProgramCategory(
    programCategory: number | string,
  ): Promise<ApiResponse<AdminEmptyOk>> {
    return this.delete<AdminEmptyOk>(
      `/api/program-category/${encodeURIComponent(String(programCategory))}`,
    );
  }

  /** GET /api/program-sub-category */
  async listProgramSubCategories(): Promise<ApiResponse<ProgramSubCategoryData[]>> {
    return this.get<ProgramSubCategoryData[]>('/api/program-sub-category');
  }

  /** POST /api/program-sub-category */
  async createProgramSubCategory(
    body: CreateProgramSubCategoryRequest,
  ): Promise<ApiResponse<ProgramSubCategoryData>> {
    return this.post<ProgramSubCategoryData>('/api/program-sub-category', body);
  }

  /** GET /api/program-sub-category/{program_sub_category} */
  async getProgramSubCategory(
    programSubCategory: number | string,
  ): Promise<ApiResponse<ProgramSubCategoryData>> {
    return this.get<ProgramSubCategoryData>(
      `/api/program-sub-category/${encodeURIComponent(String(programSubCategory))}`,
    );
  }

  /** PUT /api/program-sub-category/{program_sub_category} */
  async updateProgramSubCategory(
    programSubCategory: number | string,
    body: UpdateProgramSubCategoryRequest,
  ): Promise<ApiResponse<ProgramSubCategoryData>> {
    return this.put<ProgramSubCategoryData>(
      `/api/program-sub-category/${encodeURIComponent(String(programSubCategory))}`,
      body,
    );
  }

  /** DELETE /api/program-sub-category/{program_sub_category} */
  async deleteProgramSubCategory(
    programSubCategory: number | string,
  ): Promise<ApiResponse<AdminEmptyOk>> {
    return this.delete<AdminEmptyOk>(
      `/api/program-sub-category/${encodeURIComponent(String(programSubCategory))}`,
    );
  }

  /** GET /api/program-tag */
  async listProgramTags(): Promise<ApiResponse<ProgramTagData[]>> {
    return this.get<ProgramTagData[]>('/api/program-tag');
  }

  /** POST /api/program-tag */
  async createProgramTag(body: ProgramTagRequest): Promise<ApiResponse<ProgramTagData>> {
    return this.post<ProgramTagData>('/api/program-tag', body);
  }

  /** GET /api/program-tag/{program_tag} */
  async getProgramTag(
    programTag: number | string,
  ): Promise<ApiResponse<ProgramTagData>> {
    return this.get<ProgramTagData>(
      `/api/program-tag/${encodeURIComponent(String(programTag))}`,
    );
  }

  /** PUT /api/program-tag/{program_tag} */
  async updateProgramTag(
    programTag: number | string,
    body: ProgramTagRequest,
  ): Promise<ApiResponse<ProgramTagData>> {
    return this.put<ProgramTagData>(
      `/api/program-tag/${encodeURIComponent(String(programTag))}`,
      body,
    );
  }

  /** DELETE /api/program-tag/{program_tag} */
  async deleteProgramTag(
    programTag: number | string,
  ): Promise<ApiResponse<AdminEmptyOk>> {
    return this.delete<AdminEmptyOk>(
      `/api/program-tag/${encodeURIComponent(String(programTag))}`,
    );
  }

  // ===========================================================================
  // Project role
  // ===========================================================================

  /** GET /api/project-role */
  async listProjectRoles(): Promise<ApiResponse<ProjectRoleData[]>> {
    return this.get<ProjectRoleData[]>('/api/project-role');
  }

  /** POST /api/project-role */
  async createProjectRole(
    body: ProjectRoleRequest,
  ): Promise<ApiResponse<ProjectRoleData>> {
    return this.post<ProjectRoleData>('/api/project-role', body);
  }

  /** GET /api/project-role/permissions */
  async getProjectRolePermissions(): Promise<ApiResponse<unknown[]>> {
    return this.get<unknown[]>('/api/project-role/permissions');
  }

  /** GET /api/project-role/{project_role} */
  async getProjectRole(
    projectRole: number | string,
  ): Promise<ApiResponse<ProjectRoleData>> {
    return this.get<ProjectRoleData>(
      `/api/project-role/${encodeURIComponent(String(projectRole))}`,
    );
  }

  /** PUT /api/project-role/{project_role} */
  async updateProjectRole(
    projectRole: number | string,
    body: ProjectRoleRequest,
  ): Promise<ApiResponse<ProjectRoleData>> {
    return this.put<ProjectRoleData>(
      `/api/project-role/${encodeURIComponent(String(projectRole))}`,
      body,
    );
  }

  /** DELETE /api/project-role/{project_role} */
  async deleteProjectRole(
    projectRole: number | string,
  ): Promise<ApiResponse<AdminEmptyOk>> {
    return this.delete<AdminEmptyOk>(
      `/api/project-role/${encodeURIComponent(String(projectRole))}`,
    );
  }

  // ===========================================================================
  // Provider + roles-to-assign
  // ===========================================================================

  /** GET /api/provider */
  async listProviders(
    params?: { q?: string; per_page?: string; [k: string]: unknown },
  ): Promise<ApiResponse<ProviderData[]>> {
    return this.get<ProviderData[]>('/api/provider', params as any);
  }

  /** GET /api/provider/roles */
  async listProviderRoles(): Promise<ApiResponse<ProviderRolesData>> {
    return this.get<ProviderRolesData>('/api/provider/roles');
  }

  /** GET /api/roles-to-assign/all */
  async listRolesToAssign(): Promise<ApiResponse<RolesToAssignData>> {
    return this.get<RolesToAssignData>('/api/roles-to-assign/all');
  }

  // ===========================================================================
  // Statistic CRUD
  // ===========================================================================

  /** GET /api/statistic */
  async listStatistics(): Promise<ApiResponse<StatisticData[]>> {
    return this.get<StatisticData[]>('/api/statistic');
  }

  /** POST /api/statistic */
  async createStatistic(body: StatisticRequest): Promise<ApiResponse<StatisticData>> {
    return this.post<StatisticData>('/api/statistic', body);
  }

  /** GET /api/statistic/{statistic} */
  async getStatistic(
    statistic: number | string,
  ): Promise<ApiResponse<StatisticData>> {
    return this.get<StatisticData>(
      `/api/statistic/${encodeURIComponent(String(statistic))}`,
    );
  }

  /** PUT /api/statistic/{statistic} */
  async updateStatistic(
    statistic: number | string,
    body: StatisticRequest,
  ): Promise<ApiResponse<StatisticData>> {
    return this.put<StatisticData>(
      `/api/statistic/${encodeURIComponent(String(statistic))}`,
      body,
    );
  }

  /** DELETE /api/statistic/{statistic} */
  async deleteStatistic(
    statistic: number | string,
  ): Promise<ApiResponse<AdminEmptyOk>> {
    return this.delete<AdminEmptyOk>(
      `/api/statistic/${encodeURIComponent(String(statistic))}`,
    );
  }

  // ===========================================================================
  // User (admin index/store) — show/update/destroy live in AuthUserApiClient
  // ===========================================================================

  /**
   * GET /api/user — admin user listing. The matching show/update/destroy
   * verbs at `/api/user/{user}` are owned by `AuthUserApiClient`
   * (`adminShowUser` / `adminUpdateUser` / `adminDestroyUser`).
   */
  async listAdminUsers(
    params?: { q?: string; per_page?: string; [k: string]: unknown },
  ): Promise<ApiResponse<AdminUserData[]>> {
    return this.get<AdminUserData[]>('/api/user', params as any);
  }

  /** POST /api/user — admin user creation. */
  async createAdminUser(
    body: AdminCreateUserRequest,
  ): Promise<ApiResponse<AdminUserData>> {
    return this.post<AdminUserData>('/api/user', body);
  }
}
