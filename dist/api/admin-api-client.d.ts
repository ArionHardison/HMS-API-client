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
import type { AdministratorData, AdminCreateUserRequest, AdminEmptyOk, AdminPaginatedPayload, AdminSearchRequest, AdminUserData, AiInstallationStatusData, AiLogData, AiLogRequest, AiModelData, AiPolicyData, AiPolicyRequest, AiPromptData, AiSettingsData, AttachPromptToPolicyRequest, CreateAdministratorRequest, CreateAiPromptRequest, CreateProgramCategoryRequest, CreateProgramSubCategoryRequest, DomainSettingsData, FeeSettingsData, FindFeeUsersRequest, ProgramCategoryData, ProgramSubCategoryData, ProgramTagData, ProgramTagRequest, ProjectRoleData, ProjectRoleRequest, ProviderData, ProviderRolesData, RolesToAssignData, SaveAiSettingsRequest, SaveDashboardSettingsRequest, SaveFeeSettingsRequest, StatisticData, StatisticRequest, TeamSearchRequest, UpdateAdministratorRequest, UpdateAiPromptRequest, UpdateProgramCategoryRequest, UpdateProgramSubCategoryRequest, UserFeeSettingsData, UserFeeSettingsRequest } from '../types/admin';
export type { AdministratorData, AdminCreateUserRequest, AdminEmptyOk, AdminPaginatedPayload, AdminSearchRequest, AdminUserData, AiInstallationStatusData, AiLogData, AiLogRequest, AiModelData, AiPolicyData, AiPolicyRequest, AiPromptData, AiSettingsData, AttachPromptToPolicyRequest, CreateAdministratorRequest, CreateAiPromptRequest, CreateProgramCategoryRequest, CreateProgramSubCategoryRequest, DomainSettingsData, FeeSettingsData, FindFeeUsersRequest, ProgramCategoryData, ProgramSubCategoryData, ProgramTagData, ProgramTagRequest, ProjectRoleData, ProjectRoleRequest, ProviderData, ProviderRolesData, RolesToAssignData, SaveAiSettingsRequest, SaveDashboardSettingsRequest, SaveFeeSettingsRequest, StatisticData, StatisticRequest, TeamSearchRequest, UpdateAdministratorRequest, UpdateAiPromptRequest, UpdateProgramCategoryRequest, UpdateProgramSubCategoryRequest, UserFeeSettingsData, UserFeeSettingsRequest, };
export declare class AdminApiClient extends BaseApiClient {
    /** POST /api/admin-search */
    adminSearch(body: AdminSearchRequest): Promise<ApiResponse<unknown[]>>;
    /** POST /api/team-search */
    teamSearch(body: TeamSearchRequest): Promise<ApiResponse<unknown[]>>;
    /** POST /api/administrator */
    createAdministrator(body: CreateAdministratorRequest): Promise<ApiResponse<AdministratorData>>;
    /** GET /api/administrator/{administrator} */
    getAdministrator(administrator: number | string): Promise<ApiResponse<AdministratorData>>;
    /** PUT /api/administrator/{administrator} (POST + ?_method=PUT). */
    updateAdministrator(administrator: number | string, body: UpdateAdministratorRequest): Promise<ApiResponse<AdministratorData>>;
    /** DELETE /api/administrator/{administrator} */
    deleteAdministrator(administrator: number | string): Promise<ApiResponse<AdminEmptyOk>>;
    /** POST /api/ai/delete-model */
    deleteAiModel(body?: Record<string, unknown>): Promise<ApiResponse<AdminEmptyOk>>;
    /** GET /api/ai/get-models */
    getAiModels(): Promise<ApiResponse<AiModelData[]>>;
    /** GET /api/ai/get-models-list */
    getAiModelsList(): Promise<ApiResponse<AiModelData[]>>;
    /** GET /api/ai/get-settings */
    getAiSettings(): Promise<ApiResponse<AiSettingsData>>;
    /** POST /api/ai/install-model */
    installAiModel(body?: Record<string, unknown>): Promise<ApiResponse<AdminEmptyOk>>;
    /** GET /api/ai/installation-status */
    getAiInstallationStatus(): Promise<ApiResponse<AiInstallationStatusData>>;
    /** POST /api/ai/save-settings */
    saveAiSettings(body: SaveAiSettingsRequest): Promise<ApiResponse<AdminEmptyOk>>;
    /** GET /api/ai/log */
    listAiLogs(): Promise<ApiResponse<AiLogData[]>>;
    /** POST /api/ai/log */
    createAiLog(body: AiLogRequest): Promise<ApiResponse<AiLogData>>;
    /** GET /api/ai/log/{log} */
    getAiLog(log: number | string): Promise<ApiResponse<AiLogData>>;
    /** PUT /api/ai/log/{log} */
    updateAiLog(log: number | string, body: AiLogRequest): Promise<ApiResponse<AiLogData>>;
    /** DELETE /api/ai/log/{log} */
    deleteAiLog(log: number | string): Promise<ApiResponse<AdminEmptyOk>>;
    /** GET /api/ai/policy */
    listAiPolicies(): Promise<ApiResponse<AiPolicyData[]>>;
    /** POST /api/ai/policy */
    createAiPolicy(body: AiPolicyRequest): Promise<ApiResponse<AiPolicyData>>;
    /** GET /api/ai/policy/{policy} */
    getAiPolicy(policy: number | string): Promise<ApiResponse<AiPolicyData>>;
    /** PUT /api/ai/policy/{policy} */
    updateAiPolicy(policy: number | string, body: AiPolicyRequest): Promise<ApiResponse<AiPolicyData>>;
    /** DELETE /api/ai/policy/{policy} */
    deleteAiPolicy(policy: number | string): Promise<ApiResponse<AdminEmptyOk>>;
    /** DELETE /api/ai/policy-file/{file} */
    deleteAiPolicyFile(file: number | string): Promise<ApiResponse<AdminEmptyOk>>;
    /** GET /api/ai/policy-list/{prompt} */
    listAiPoliciesForPrompt(prompt: number | string): Promise<ApiResponse<AiPolicyData[]>>;
    /** POST /api/ai/policy/{policy}/prompts */
    attachPromptToAiPolicy(policy: number | string, body: AttachPromptToPolicyRequest): Promise<ApiResponse<AdminEmptyOk>>;
    /** DELETE /api/ai/policy/{policy}/prompts/{prompt} */
    detachPromptFromAiPolicy(policy: number | string, prompt: number | string): Promise<ApiResponse<AdminEmptyOk>>;
    /** POST /api/ai/prompts/create */
    createAiPrompt(body: CreateAiPromptRequest): Promise<ApiResponse<AiPromptData>>;
    /** GET /api/ai/prompts/keywords */
    getAiPromptKeywords(): Promise<ApiResponse<unknown[]>>;
    /** GET /api/ai/prompts/list */
    listAiPrompts(): Promise<ApiResponse<AiPromptData[]>>;
    /** GET /api/ai/prompts/list-policies */
    listAiPromptPolicies(): Promise<ApiResponse<AiPolicyData[]>>;
    /** GET /api/ai/prompts/required-list */
    getRequiredAiPrompts(): Promise<ApiResponse<AiPromptData[]>>;
    /** GET /api/ai/prompts/show/{prompt} */
    getAiPrompt(prompt: number | string): Promise<ApiResponse<AiPromptData>>;
    /** PUT /api/ai/prompts/update/{prompt} */
    updateAiPrompt(prompt: number | string, body: UpdateAiPromptRequest): Promise<ApiResponse<AiPromptData>>;
    /**
     * POST /api/dashboard-settings/save — accepts either a stored video id
     * (`video_id`) OR a `File` upload (`video_file`). When the payload carries
     * a `File`/`Blob`, `BaseApiClient.serializeBody` switches the request to
     * multipart/form-data automatically.
     */
    saveDashboardSettings(body: SaveDashboardSettingsRequest): Promise<ApiResponse<AdminEmptyOk>>;
    /** GET /api/domain-settings/{id} */
    getDomainSettings(id: number | string): Promise<ApiResponse<DomainSettingsData>>;
    /** GET /api/fees/fee */
    listFees(): Promise<ApiResponse<UserFeeSettingsData[]>>;
    /** POST /api/fees/fee */
    createFee(body: UserFeeSettingsRequest): Promise<ApiResponse<UserFeeSettingsData>>;
    /** GET /api/fees/fee/{fee} */
    getFee(fee: number | string): Promise<ApiResponse<UserFeeSettingsData>>;
    /** PUT /api/fees/fee/{fee} */
    updateFee(fee: number | string, body: UserFeeSettingsRequest): Promise<ApiResponse<UserFeeSettingsData>>;
    /** DELETE /api/fees/fee/{fee} */
    deleteFee(fee: number | string): Promise<ApiResponse<AdminEmptyOk>>;
    /** POST /api/fees/find-users */
    findFeeUsers(body: FindFeeUsersRequest): Promise<ApiResponse<unknown[]>>;
    /** GET /api/fees/get-settings */
    getFeeSettings(): Promise<ApiResponse<FeeSettingsData>>;
    /** POST /api/fees/save-settings */
    saveFeeSettings(body: SaveFeeSettingsRequest): Promise<ApiResponse<AdminEmptyOk>>;
    /** GET /api/program-categories */
    listProgramCategoriesPublic(): Promise<ApiResponse<ProgramCategoryData[]>>;
    /** GET /api/program-category */
    listProgramCategories(): Promise<ApiResponse<ProgramCategoryData[]>>;
    /** POST /api/program-category */
    createProgramCategory(body: CreateProgramCategoryRequest): Promise<ApiResponse<ProgramCategoryData>>;
    /** GET /api/program-category/{program_category} */
    getProgramCategory(programCategory: number | string): Promise<ApiResponse<ProgramCategoryData>>;
    /** PUT /api/program-category/{program_category} */
    updateProgramCategory(programCategory: number | string, body: UpdateProgramCategoryRequest): Promise<ApiResponse<ProgramCategoryData>>;
    /** DELETE /api/program-category/{program_category} */
    deleteProgramCategory(programCategory: number | string): Promise<ApiResponse<AdminEmptyOk>>;
    /** GET /api/program-sub-category */
    listProgramSubCategories(): Promise<ApiResponse<ProgramSubCategoryData[]>>;
    /** POST /api/program-sub-category */
    createProgramSubCategory(body: CreateProgramSubCategoryRequest): Promise<ApiResponse<ProgramSubCategoryData>>;
    /** GET /api/program-sub-category/{program_sub_category} */
    getProgramSubCategory(programSubCategory: number | string): Promise<ApiResponse<ProgramSubCategoryData>>;
    /** PUT /api/program-sub-category/{program_sub_category} */
    updateProgramSubCategory(programSubCategory: number | string, body: UpdateProgramSubCategoryRequest): Promise<ApiResponse<ProgramSubCategoryData>>;
    /** DELETE /api/program-sub-category/{program_sub_category} */
    deleteProgramSubCategory(programSubCategory: number | string): Promise<ApiResponse<AdminEmptyOk>>;
    /** GET /api/program-tag */
    listProgramTags(): Promise<ApiResponse<ProgramTagData[]>>;
    /** POST /api/program-tag */
    createProgramTag(body: ProgramTagRequest): Promise<ApiResponse<ProgramTagData>>;
    /** GET /api/program-tag/{program_tag} */
    getProgramTag(programTag: number | string): Promise<ApiResponse<ProgramTagData>>;
    /** PUT /api/program-tag/{program_tag} */
    updateProgramTag(programTag: number | string, body: ProgramTagRequest): Promise<ApiResponse<ProgramTagData>>;
    /** DELETE /api/program-tag/{program_tag} */
    deleteProgramTag(programTag: number | string): Promise<ApiResponse<AdminEmptyOk>>;
    /** GET /api/project-role */
    listProjectRoles(): Promise<ApiResponse<ProjectRoleData[]>>;
    /** POST /api/project-role */
    createProjectRole(body: ProjectRoleRequest): Promise<ApiResponse<ProjectRoleData>>;
    /** GET /api/project-role/permissions */
    getProjectRolePermissions(): Promise<ApiResponse<unknown[]>>;
    /** GET /api/project-role/{project_role} */
    getProjectRole(projectRole: number | string): Promise<ApiResponse<ProjectRoleData>>;
    /** PUT /api/project-role/{project_role} */
    updateProjectRole(projectRole: number | string, body: ProjectRoleRequest): Promise<ApiResponse<ProjectRoleData>>;
    /** DELETE /api/project-role/{project_role} */
    deleteProjectRole(projectRole: number | string): Promise<ApiResponse<AdminEmptyOk>>;
    /** GET /api/provider */
    listProviders(params?: {
        q?: string;
        per_page?: string;
        [k: string]: unknown;
    }): Promise<ApiResponse<ProviderData[]>>;
    /** GET /api/provider/roles */
    listProviderRoles(): Promise<ApiResponse<ProviderRolesData>>;
    /** GET /api/roles-to-assign/all */
    listRolesToAssign(): Promise<ApiResponse<RolesToAssignData>>;
    /** GET /api/statistic */
    listStatistics(): Promise<ApiResponse<StatisticData[]>>;
    /** POST /api/statistic */
    createStatistic(body: StatisticRequest): Promise<ApiResponse<StatisticData>>;
    /** GET /api/statistic/{statistic} */
    getStatistic(statistic: number | string): Promise<ApiResponse<StatisticData>>;
    /** PUT /api/statistic/{statistic} */
    updateStatistic(statistic: number | string, body: StatisticRequest): Promise<ApiResponse<StatisticData>>;
    /** DELETE /api/statistic/{statistic} */
    deleteStatistic(statistic: number | string): Promise<ApiResponse<AdminEmptyOk>>;
    /**
     * GET /api/user — admin user listing. The matching show/update/destroy
     * verbs at `/api/user/{user}` are owned by `AuthUserApiClient`
     * (`adminShowUser` / `adminUpdateUser` / `adminDestroyUser`).
     */
    listAdminUsers(params?: {
        q?: string;
        per_page?: string;
        [k: string]: unknown;
    }): Promise<ApiResponse<AdminUserData[]>>;
    /** POST /api/user — admin user creation. */
    createAdminUser(body: AdminCreateUserRequest): Promise<ApiResponse<AdminUserData>>;
}
//# sourceMappingURL=admin-api-client.d.ts.map