/**
 * Admin / SuperAdmin slice — request / response types.
 *
 * Source of truth: `sdk/spec/endpoints.json`. Each interface mirrors the
 * `request.shape` or `response.shape` of one or more endpoints. `unknown`
 * preserves the spec's "shape unknown" cases (Laravel Resource
 * `parent::toArray($request)`, scraped `request->input('x')` keys, etc.).
 *
 * Structural interfaces only — no branded type aliases.
 */
/** Empty / opaque response payload — used where the spec's `response.shape` is `{}`. */
export type AdminEmptyOk = Record<string, unknown> | null;
/** Paginated wrapper (Laravel Resource `wrapper: "paginated"`). */
export interface AdminPaginatedPayload<T> {
    items: T[];
    meta?: Record<string, unknown>;
    links?: Record<string, unknown>;
}
/** POST /api/admin-search + POST /api/team-search request body. */
export interface AdminSearchRequest {
    sorting: string;
    project?: unknown;
    search_condition?: string;
}
/** POST /api/team-search request body — same shape as admin-search. */
export type TeamSearchRequest = AdminSearchRequest;
/** POST /api/administrator + PUT /api/administrator/{administrator}. */
export interface CreateAdministratorRequest {
    full_name: string;
    email: string;
    password: string;
    subproject_id?: unknown;
}
export type UpdateAdministratorRequest = CreateAdministratorRequest;
export interface AdministratorData {
    id?: number;
    full_name?: string;
    email?: string;
    subproject_id?: number | null;
    [k: string]: unknown;
}
/** POST /api/ai/save-settings request body. */
export interface SaveAiSettingsRequest {
    model: string;
    version: string;
}
/** Generic AI model representation (spec shape unknown). */
export interface AiModelData {
    [k: string]: unknown;
}
export interface AiSettingsData {
    [k: string]: unknown;
}
export interface AiInstallationStatusData {
    [k: string]: unknown;
}
/** AI log entry (spec shape unknown — admin endpoints redirect through Laravel resource). */
export interface AiLogData {
    id?: number;
    [k: string]: unknown;
}
/** POST /api/ai/log + PUT /api/ai/log/{log} — request shape unscraped, accept any payload. */
export type AiLogRequest = Record<string, unknown>;
/** POST /api/ai/policy + PUT /api/ai/policy/{policy}. */
export interface AiPolicyRequest {
    title: string;
    slug?: string;
    summary?: string;
    body?: string;
    published_at?: string;
}
export interface AiPolicyData {
    id?: number;
    title?: string;
    slug?: string;
    summary?: string;
    body?: string;
    published_at?: string | null;
    [k: string]: unknown;
}
/** POST /api/ai/policy/{policy}/prompts. */
export interface AttachPromptToPolicyRequest {
    prompt_id: number;
    position?: number;
}
/** POST /api/ai/prompts/create. */
export interface CreateAiPromptRequest {
    prompt_key: string;
    prompt_text: string;
}
/** PUT /api/ai/prompts/update/{prompt}. */
export interface UpdateAiPromptRequest {
    prompt_text: string;
}
export interface AiPromptData {
    id?: number;
    prompt_key?: string;
    prompt_text?: string;
    [k: string]: unknown;
}
/**
 * POST /api/dashboard-settings/save — supports a remote video reference
 * (`video_id`) OR a binary upload (`video_file: File`). When `video_file`
 * is a `File`/`Blob`, `BaseApiClient` auto-switches the request to
 * multipart/form-data.
 */
export interface SaveDashboardSettingsRequest {
    video_id?: File | Blob | string | null;
    video_file?: File | Blob | string | null;
}
/** GET /api/domain-settings/{id} — shape unknown. */
export interface DomainSettingsData {
    id?: number;
    [k: string]: unknown;
}
/** POST /api/fees/fee + PUT /api/fees/fee/{fee}. */
export interface UserFeeSettingsRequest {
    user_id?: unknown;
    service_fee: number;
    processor_correction: number;
    processor_fee: number;
}
/** POST /api/fees/save-settings — global fee settings (no user_id). */
export interface SaveFeeSettingsRequest {
    service_fee: number;
    processor_correction: number;
    processor_fee: number;
}
/** POST /api/fees/find-users. */
export interface FindFeeUsersRequest {
    search: string;
}
/** GET /api/fees/fee/{fee} response shape (UserFeeSettingsResource). */
export interface UserFeeSettingsData {
    id: number;
    user_id: number;
    user?: unknown;
    service_fee?: unknown;
    processor_correction?: unknown;
    processor_fee?: unknown;
}
export interface FeeSettingsData {
    [k: string]: unknown;
}
/** POST /api/program-category. */
export interface CreateProgramCategoryRequest {
    category_name: string;
    category_description: string;
}
/** PUT /api/program-category/{program_category}. */
export interface UpdateProgramCategoryRequest {
    id: string | number;
    category_name: string;
    category_description: string;
}
/** POST /api/program-sub-category. */
export interface CreateProgramSubCategoryRequest {
    category_id: number;
    sub_category_name: string;
    sub_category_description: string;
}
/** PUT /api/program-sub-category/{program_sub_category}. */
export interface UpdateProgramSubCategoryRequest {
    id: number;
    category_id: number;
    sub_category_name: string;
    sub_category_description: string;
}
/** POST + PUT /api/program-tag. */
export interface ProgramTagRequest {
    tag_name: string;
}
export interface ProgramCategoryData {
    id?: number;
    name?: string;
    description?: string;
    [k: string]: unknown;
}
export interface ProgramSubCategoryData {
    id?: number;
    category_id?: number;
    name?: string;
    description?: string;
    [k: string]: unknown;
}
export interface ProgramTagData {
    id?: number;
    name?: string;
    [k: string]: unknown;
}
/** POST /api/project-role + PUT /api/project-role/{project_role}. */
export interface ProjectRoleRequest {
    name: string;
    permissions: unknown[];
}
export interface ProjectRoleData {
    id?: number;
    name?: string;
    permissions?: unknown[];
    [k: string]: unknown;
}
export interface ProviderData {
    id?: number;
    full_name?: string;
    email?: string;
    [k: string]: unknown;
}
export interface ProviderRolesData {
    [k: string]: unknown;
}
export interface RolesToAssignData {
    [k: string]: unknown;
}
/** POST /api/statistic + PUT /api/statistic/{statistic}. */
export interface StatisticRequest {
    icon: string;
    value: number;
    label: string;
    color: string;
    call_method?: string;
}
export interface StatisticData {
    id?: number;
    icon?: string;
    value?: number;
    label?: string;
    color?: string;
    call_method?: string | null;
    [k: string]: unknown;
}
/** POST /api/user — admin user creation. */
export interface AdminCreateUserRequest {
    country_id?: unknown;
    full_name: string;
    username?: unknown;
    email?: unknown;
    facebook_profile?: string;
    linkedin_profile?: string;
    instagram_profile?: string;
    twitter_profile?: string;
    phone: number;
    password: string;
    password_confirmation: string;
    description?: unknown;
    roles?: unknown;
    is_published: boolean;
    homepage_preview?: unknown;
}
export interface AdminUserData {
    id?: number;
    full_name?: string;
    email?: string;
    username?: string;
    phone?: number | string | null;
    is_published?: boolean;
    [k: string]: unknown;
}
//# sourceMappingURL=admin.d.ts.map