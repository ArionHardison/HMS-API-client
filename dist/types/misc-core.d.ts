/**
 * Type contracts for `MiscCoreApiClient`.
 *
 * Source of truth: `sdk/spec/endpoints.json` — the long-tail Core endpoints
 * that don't fit the themed client buckets (chain/schedule/wizard/etc.).
 * Most are `auth: public` (home/feed/search/showcase/gov directory) with
 * a sprinkling of admin-side updates and authenticated user-account
 * mutations. Shapes are derived from each endpoint's `request.shape` /
 * `response.shape` — empty shapes fall back to permissive structural types.
 */
/** PUT /api/administrator/{administrator} body. */
export interface UpdateAdministratorRequest {
    full_name: string;
    email: string;
    password?: string;
    subproject_id: number | string;
}
/** PUT /api/ai/log/{log} body — spec leaves shape empty. */
export interface UpdateAiLogRequest {
    [key: string]: unknown;
}
/** PUT /api/ai/policy/{policy} body. */
export interface UpdateAiPolicyRequest {
    title: string;
    slug: string;
    summary: string;
    body: string;
    published_at?: string | null;
}
/** PUT /api/ai/prompts/update/{prompt} body. */
export interface UpdateAiPromptRequest {
    prompt_text: string;
}
/** PUT /api/documentation/{documentation} body. */
export interface UpdateDocumentationRequest {
    title: string;
    description: string;
    youtube_video_id?: string | null;
    end_title?: string | null;
    end_description?: string | null;
    steps: ReadonlyArray<unknown>;
}
/** PUT /api/fees/fee/{fee} body. */
export interface UpdateFeeRequest {
    user_id: number;
    service_fee: number;
    processor_correction: number;
    processor_fee: number;
}
/** PUT /api/program-category/{program_category} body. */
export interface UpdateProgramCategoryRequest {
    id: number;
    category_name: string;
    category_description: string;
}
/** PUT /api/program-sub-category/{program_sub_category} body. */
export interface UpdateProgramSubCategoryRequest {
    id: number;
    category_id: number;
    sub_category_name: string;
    sub_category_description: string;
}
/** PUT /api/program-tag/{program_tag} body. */
export interface UpdateProgramTagRequest {
    tag_name: string;
}
/** PUT /api/project-role/{project_role} body. */
export interface UpdateProjectRoleRequest {
    name: string;
    permissions: ReadonlyArray<string>;
}
/** PUT /api/statistic/{statistic} body. */
export interface UpdateStatisticRequest {
    icon: string;
    value: string;
    label: string;
    color: string;
    call_method: string;
}
/** PUT /api/user/{user} (admin-side) body. */
export interface AdminUpdateUserBody {
    full_name: string;
    email: string;
    username: string;
    phone: string;
    profession: string;
    description: string;
    subproject_id: number | string;
    country_id: number;
    roles: ReadonlyArray<string | number>;
}
/** POST /api/auth/change-forced-password body. */
export interface ChangeForcedPasswordRequest {
    password: string;
}
/** PATCH /api/users/update-billing-info body. */
export interface UpdateBillingInfoBody {
    address: string;
    city: string;
    company?: string | null;
    state: string;
    zip: string;
}
/** PATCH /api/users/update-password/{user} body. */
export interface UpdateUserPasswordBody {
    password: string;
}
/** PATCH /api/users/update-phone body. */
export interface UpdatePhoneBody {
    phone: string;
    code: string;
}
/** PATCH /api/users/update/{user} body. */
export interface UpdateUserBody {
    username?: string;
    full_name?: string;
    about?: string;
    birth_date?: string;
    gender?: string;
    country_id?: number;
}
/** POST /api/verify-code body. */
export interface VerifyCodeRequest {
    code: string;
}
/** PUT /api/creator-request/{creator_request} body. */
export interface UpdateCreatorRequestBody {
    status: string;
}
/** PUT /api/creator/{creator} body. */
export interface UpdateCreatorBody {
    featured: boolean;
}
/** PUT /api/program/update-program/{program} body — spec shape empty. */
export interface UpdateProgramBody {
    [key: string]: unknown;
}
/** POST /api/program-status/set/{program} body. */
export interface SetProgramStatusBody {
    is_published: boolean;
}
/** PUT /api/protocol/{protocol} body. */
export interface UpdateProtocolBody {
    name: string;
    category_id: number;
    problem?: string;
}
/** PATCH /api/protocol/sale/update/{protocol} body. */
export interface UpdateProtocolSaleBody {
    amount: number;
    salary: number;
}
/** PATCH /api/subscription/update/{subscription} body — spec leaves shape empty. */
export interface UpdateSubscriptionBody {
    [key: string]: unknown;
}
/** PUT /api/role/{role} body — spec leaves shape empty. */
export interface UpdateRoleBody {
    [key: string]: unknown;
}
/** PUT /api/seo-page/{seo_page} body. */
export interface UpdateSeoPageBody {
    page: string;
    call?: string;
    items: ReadonlyArray<unknown>;
}
/** PUT /api/frontend/save-frontend body. */
export interface SaveFrontendBody {
    project_name: string;
    project_short_description: string;
    reviews_title: string;
    reviews_description: string;
    footer_text: string;
    how_it_works: ReadonlyArray<unknown>;
}
/** PATCH /api/domain-interfaces/{id} body. */
export interface UpdateDomainInterfaceBody {
    subproject_id?: number | string;
    domain?: string;
    interface_id?: number | string;
    is_base?: boolean;
    page_route?: string;
    page_file?: string;
    block_name?: string;
    block_file?: string;
    purpose?: string;
    data_sources?: ReadonlyArray<unknown>;
    agent_use_cases?: ReadonlyArray<unknown>;
    tags?: ReadonlyArray<string>;
    enabled?: boolean;
}
/** POST /api/dashboard/create-login-transaction body. */
export interface CreateLoginTransactionDashboardBody {
    driver: string;
    redirect_url: string;
    secret_token: string;
}
/** POST /api/public/create-login-transaction body. */
export interface CreateLoginTransactionPublicBody {
    driver: string;
    redirect_url: string;
}
/** POST /api/public/auth-by-social-token body — spec shape empty. */
export interface PublicAuthBySocialTokenBody {
    [key: string]: unknown;
}
/** POST /api/public/contact body. */
export interface PublicContactBody {
    description: string;
    email: string;
    full_name: string;
    subject: string;
}
/** POST /api/public/creators/filter body. */
export interface PublicCreatorsFilterBody {
    category?: string;
    rating?: number;
    speciality?: string;
    order?: string;
    popular?: boolean;
    hostname?: string;
    subproject_id?: number | string;
    search?: string;
    politician_role?: string;
    politician_branch?: string;
    politician_party?: string;
    politician_country?: string;
    politician_state?: string;
    politician_city?: string;
    politician_office_status?: string;
}
/** POST /api/public/subprojects/search body. */
export interface PublicSubprojectsSearchBody {
    search?: string;
    hostname?: string;
    state_id?: number | string;
    subproject_id?: number | string;
}
/** POST /api/public/verify-social-token body. */
export interface PublicVerifySocialTokenBody {
    driver: string;
    social: Record<string, unknown>;
}
/** POST /api/interface/get-sms body. */
export interface InterfaceGetSmsBody {
    token: string;
    phone: string;
}
/** POST /api/interface/verify-code body. */
export interface InterfaceVerifyCodeBody {
    token: string;
    code: string;
}
/** GET /api/gov/cities query params. */
export interface GovCitiesQuery {
    country?: string;
    state?: string;
    q?: string;
    limit?: number;
}
/** GET /api/gov/city-agencies query params. */
export interface GovCityAgenciesQuery {
    slug?: string;
}
/** GET /api/gov/states query params. */
export interface GovStatesQuery {
    country?: string;
    q?: string;
    limit?: number;
}
/** GET /api/gov/subprojects query params. */
export interface GovSubprojectsQuery {
    classification?: string;
    parent_domain?: string;
    country?: string;
    state?: string;
    q?: string;
    limit?: number;
}
/** Generic envelope payload — most endpoint response shapes are empty in the
 *  spec (Resource transformer returns whatever the model exposes). */
export interface MiscCoreResponse {
    [key: string]: unknown;
}
//# sourceMappingURL=misc-core.d.ts.map