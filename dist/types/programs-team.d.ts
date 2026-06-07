/**
 * Programs + Team + Roles + Members slice — request / response types.
 *
 * Source of truth: `sdk/spec/endpoints.json`. Each interface mirrors the
 * `request.shape` or `response.shape` of one or more endpoints. `unknown`
 * preserves the spec's "shape unknown" cases (Laravel Resource
 * `parent::toArray($request)`, scraped `request->input('x')` keys, etc.).
 *
 * Structural interfaces only — no branded type aliases.
 */
/**
 * `wrapper: "paginated"` Laravel envelope shape — the SDK does not yet
 * normalize pagination across slices, so we leave `meta` / `links` open.
 */
export interface PaginatedPayload<T> {
    items: T[];
    meta?: unknown;
    links?: unknown;
}
/** Empty success payload — endpoints that just acknowledge. */
export interface EmptyOk {
    [key: string]: unknown;
}
/**
 * POST /api/program-sale/buy → `App\Http\Requests\Core\Sales\ProgramBuyRequest`.
 * `balance` is whether to charge the user wallet; `program_id` is mandatory.
 */
export interface ProgramBuyRequest {
    balance: boolean;
    program_id: number;
}
/** Server-side BuyProgramResource — shape unknown in spec; preserve as open object. */
export interface BuyProgramResult {
    [key: string]: unknown;
}
/**
 * POST /api/program-sale/list (and used by GET list-by-author / list/random)
 * → `App\Http\Requests\Core\Program\ProgramsFilterRequest`.
 *
 * Every key is optional (server does `sometimes|nullable` on most). Arrays
 * are intentionally `unknown[]` because the `in:` rules are dynamic.
 */
export interface ProgramsFilterRequest {
    category?: unknown;
    tag?: unknown[];
    access?: unknown[];
    level?: unknown[];
    search?: string;
    signs?: unknown[];
    time?: unknown[];
    order?: unknown;
    popular?: unknown;
}
/** ProgramSaleResource — listing card for a purchasable program. */
export interface ProgramSaleData {
    amount: number;
    subscription_amount: unknown;
    id: number;
    name: unknown;
    program_description: unknown;
    required_time: unknown;
    required_time_range: unknown;
    level: unknown;
    feedback_avg_rating: unknown;
    price_signs: unknown;
    program_image: unknown;
    author: unknown;
    protocol: unknown;
    access_type: unknown;
    created_at: string;
    bookmarked: unknown;
}
/** ProgramSalePriceResource — salary / show variant. Shape unknown in spec. */
export interface ProgramSalePriceData {
    [key: string]: unknown;
}
/** TagResource — minimal tag payload. */
export interface ProgramTagData {
    [key: string]: unknown;
}
/** AllProgramsResource — `{id, name}` listing entries. */
export interface AllProgramData {
    id: number;
    name: unknown;
}
/** UserPersonalChainResource — `{id, name}` per chain. */
export interface UserPersonalChainData {
    id: number;
    name: unknown;
}
/** POST /api/program/detach-protocol → `DetachProgramProtocolRequest`. */
export interface DetachProgramProtocolRequest {
    id?: unknown;
}
/** DetachProgramProtocolResource — shape unknown in spec. */
export interface DetachProgramProtocolResult {
    [key: string]: unknown;
}
/** POST /api/program/program-check → `ValidateProgramFormRequest`. */
export interface ValidateProgramRequest {
    id?: number;
    step: number;
}
/** ProgramValidationResource — shape unknown in spec. */
export interface ProgramValidationResult {
    [key: string]: unknown;
}
/** ProgramDataToUseResource — `/api/program/program-data/{program?}`. */
export interface ProgramDataToUse {
    protocols: unknown;
    tags: unknown;
    categories: unknown;
    subcategories: unknown;
    team: unknown;
    protocolCategories: unknown;
}
/** POST /api/program/program/add-tag → `ProgramAddTagRequest`. */
export interface ProgramAddTagRequest {
    program: string;
    tag: string;
}
/** PublishProgramResource — both /publish and /publications return this. */
export interface PublishProgramData {
    [key: string]: unknown;
}
/** POST /api/program/publish (and /publish/cancel) → `PublishProgramRequest`. */
export interface PublishProgramRequest {
    tenant_id: string;
    program_id?: unknown;
}
/** POST /api/program/run-personal → `RunPersonalProgramRequest`. */
export interface RunPersonalProgramRequest {
    id: number;
}
/** RunPersonalProgramResource — shape unknown in spec. */
export interface RunPersonalProgramResult {
    [key: string]: unknown;
}
/** POST /api/program/search → `SearchProgramRequest` (q is required, min 3). */
export interface SearchProgramRequest {
    q: string;
}
/** ProgramHomeSearchResource — shape unknown in spec. */
export interface ProgramHomeSearchResult {
    [key: string]: unknown;
}
/**
 * ProgramInstanceResource — `/api/program/show/{program}` payload. Many fields
 * are `unknown` in the spec scrape (Eloquent relations / accessors).
 */
export interface ProgramInstanceData {
    id: number;
    name: unknown;
    description: unknown;
    agent: unknown;
    category_id: number;
    sub_category_id: number;
    protocol_id: number;
    program_image: unknown;
    category: unknown;
    subCategory: unknown;
    team: unknown;
    protocol: unknown;
    sale: unknown;
    feedback_avg_rating: unknown;
    ratings: unknown;
    subscriptionSale: unknown;
    tags: unknown;
    access_type: unknown;
    level: unknown;
    modules: unknown;
    price_signs: unknown;
    required_time: unknown;
    required_time_range: unknown;
    created_at: string;
    author: unknown;
    subscribed: unknown;
    purchase: unknown;
    borken: unknown;
    bookmarked: unknown;
    balance: unknown;
    attachedProtocols: unknown;
}
/** ProgramSimulationResource — `/api/program/simulation/{program}`. */
export interface ProgramSimulationData {
    description: unknown;
    name: unknown;
    program_image: unknown;
    chain: unknown;
}
/** POST /api/program/toggle-bookmark → `ProgramBookmarkRequest`. */
export interface ProgramBookmarkRequest {
    program_id: number;
}
/** ProgramBookmarkResource — shape unknown in spec. */
export interface ProgramBookmarkResult {
    [key: string]: unknown;
}
/**
 * PUT /api/program/update-program/{program} → `UpdateProgramRequest`.
 * Spec scrape leaves rules empty (the FormRequest does conditional rules per
 * step). The shape is intentionally permissive — callers must marshal a
 * full program payload, plus optional file uploads.
 */
export interface UpdateProgramRequest {
    [key: string]: unknown;
}
/** ProgramResource — wrapper around `ProgramInstanceData`-equivalent fields. */
export interface ProgramData {
    id: number;
    name: unknown;
    description: unknown;
    category_id: number;
    sub_category_id: number;
    protocol_id: number;
    program_image: unknown;
    category: unknown;
    subCategory: unknown;
    team: unknown;
    protocol: unknown;
    sale: unknown;
    feedback_avg_rating: unknown;
    ratings: unknown;
    subscriptionSale: unknown;
    tags: unknown;
    access_type: unknown;
    level: unknown;
    modules: unknown;
    price_signs: unknown;
    required_time: unknown;
    required_time_range: unknown;
    created_at: string;
    author: unknown;
    subscribed: unknown;
    purchase: unknown;
    borken: unknown;
    bookmarked: unknown;
    balance: unknown;
    attachedProtocols: unknown;
}
/** ProgramChainStepUsersResource — shape unknown in spec. */
export interface ProgramChainStepUsersData {
    [key: string]: unknown;
}
/** ProgramUsersResource — `{id, name}` rows. */
export interface ProgramUserSummary {
    id: number;
    name: unknown;
}
/** POST /api/program/validate-additional-protocol → `ValidateAdditionalProtocolRequest`. */
export interface ValidateAdditionalProtocolRequest {
    at_time: string;
    at_week_days: unknown[];
    protocol_category_id: number;
    protocol_id: number;
    protocol_mandatory?: boolean;
    run_after: number;
    run_every: string;
}
/** AdditionalProtocolValidationResource — shape unknown in spec. */
export interface AdditionalProtocolValidationResult {
    [key: string]: unknown;
}
/** SubprojectPermissionsResource — shape unknown in spec. */
export interface SubprojectPermissionsData {
    [key: string]: unknown;
}
/** SubprojectRoleResource — `{name, permissions}`. */
export interface SubprojectRoleData {
    name: unknown;
    permissions: unknown;
}
/** PUT /api/project-role/{project_role} → `UpdateSubprojectRoleRequest`. */
export interface UpdateSubprojectRoleRequest {
    name: string;
    permissions: unknown[];
}
/** RoleResource — `{name, id}`. Shared with /api/roles/all. */
export interface RoleResource {
    name: unknown;
    id: number;
}
/** POST /api/team/accept (and /reject, /remove*, /leave) → `{id}` body. */
export interface TeamMemberIdRequest {
    id: number;
}
/** UserTeamResource — generic team-action result; shape unknown in spec. */
export interface UserTeamResult {
    [key: string]: unknown;
}
/** UserPotentialTeamInviteResource — accept-invite/{token}; shape unknown. */
export interface UserPotentialTeamInviteData {
    [key: string]: unknown;
}
/** UserAllTeamMembersResource — `/api/team/all`. */
export interface UserAllTeamMember {
    id: number;
    name: unknown;
    roles: unknown;
}
/** POST /api/team/handle-role → `HandleRoleRequest`. */
export interface HandleTeamRoleRequest {
    id: number;
    role: string;
}
/**
 * POST /api/team/invite (and /network-invite, /network-invite-potential)
 * → `InviteMemberRequest` shape. `team_member` is open in the spec because
 * the FormRequest hand-rolls the lookup (id|email|username supported).
 */
export interface InviteTeamMemberRequest {
    team_member?: unknown;
    role: string;
}
/** UserTeamListResource — `/api/team/list/{status}`. */
export interface UserTeamListItem {
    id: number;
    member: unknown;
    roles: unknown;
    status: unknown;
}
/** UserInviteListResource — `/api/team/member/{status}`. */
export interface UserInviteListItem {
    id: number;
    owner: unknown;
    roles: unknown;
    status: unknown;
}
/** POST /api/team/network-search → `SearchNetworkRequest`. */
export interface NetworkSearchRequest {
    role: string;
    speciality?: string;
}
/** NetworkSearchResource — shape unknown in spec. */
export interface NetworkSearchResult {
    [key: string]: unknown;
}
/** UserTeamAvailableRolesResource — `/api/team/roles`. */
export interface UserTeamAvailableRole {
    id: number;
    name: unknown;
    pretty: unknown;
}
/** POST /api/team/search-members (and /search-users) → `{search}`. */
export interface TeamSearchRequest {
    search: string;
}
/** UserTeamSearchResource — shape unknown in spec. */
export interface UserTeamSearchResult {
    [key: string]: unknown;
}
//# sourceMappingURL=programs-team.d.ts.map