/**
 * ProgramsTeamApiClient — covers the Programs + Program Sale + Team + Role +
 * Project-Role + Members slice of the P2X API. Source of truth for shapes is
 * `sdk/spec/endpoints.json`.
 *
 * The class extends `BaseApiClient`, which already handles:
 *   - Bearer token injection (skipped per call via `{ auth: false }`)
 *   - `X-Domain` header from `getDomain`
 *   - PUT/PATCH → POST + `?_method=PUT|PATCH` (Laravel)
 *   - FormData switching when payload contains a `File`/`Blob`
 *   - 401 / 422 → callback + `ApiError`
 *
 * Wrapper handling: nearly every slice endpoint emits `wrapper: "data"` (single
 * Resource), so the SDK consumes the parsed envelope (`{ success, message,
 * data }`) and the typed payload sits in `.data`. The single
 * `wrapper: "paginated"` endpoint (`/api/program/get-bookmarks`) surfaces the
 * envelope with `.data` carrying `items[]` + pagination — typed as
 * `PaginatedPayload<T>` (re-exported below).
 *
 * The slice spans six top-level prefixes:
 *
 *   - `/api/program-sale/*`       — purchase + listing flow
 *   - `/api/program/*`            — program CRUD, history, run-personal, publish
 *   - `/api/project-role/*`       — Subproject role CRUD (admin guard)
 *   - `/api/role` + `/api/roles/*`— User role CRUD
 *   - `/api/team/*`               — Team membership, invites, role mgmt
 *
 * 60 endpoints total (see `/tmp/programs-team-slice.json` for the filtered
 * manifest used during TDD).
 */
import { BaseApiClient, type ApiResponse } from '../api-client';
import type { AdditionalProtocolValidationResult, AllProgramData, BuyProgramResult, DetachProgramProtocolRequest, DetachProgramProtocolResult, EmptyOk, HandleTeamRoleRequest, InviteTeamMemberRequest, NetworkSearchRequest, NetworkSearchResult, PaginatedPayload, ProgramAddTagRequest, ProgramBookmarkRequest, ProgramBookmarkResult, ProgramBuyRequest, ProgramChainStepUsersData, ProgramData, ProgramDataToUse, ProgramHomeSearchResult, ProgramInstanceData, ProgramSaleData, ProgramSalePriceData, ProgramSimulationData, ProgramTagData, ProgramUserSummary, ProgramValidationResult, ProgramsFilterRequest, PublishProgramData, PublishProgramRequest, RoleResource, RunPersonalProgramRequest, RunPersonalProgramResult, SearchProgramRequest, SubprojectPermissionsData, SubprojectRoleData, TeamMemberIdRequest, TeamSearchRequest, UpdateProgramRequest, UpdateSubprojectRoleRequest, UserAllTeamMember, UserInviteListItem, UserPotentialTeamInviteData, UserTeamAvailableRole, UserTeamListItem, UserTeamResult, UserTeamSearchResult, ValidateAdditionalProtocolRequest, ValidateProgramRequest } from '../types/programs-team';
export type { AdditionalProtocolValidationResult, AllProgramData, BuyProgramResult, DetachProgramProtocolRequest, DetachProgramProtocolResult, EmptyOk, HandleTeamRoleRequest, InviteTeamMemberRequest, NetworkSearchRequest, NetworkSearchResult, PaginatedPayload, ProgramAddTagRequest, ProgramBookmarkRequest, ProgramBookmarkResult, ProgramBuyRequest, ProgramChainStepUsersData, ProgramData, ProgramDataToUse, ProgramHomeSearchResult, ProgramInstanceData, ProgramSaleData, ProgramSalePriceData, ProgramSimulationData, ProgramTagData, ProgramUserSummary, ProgramValidationResult, ProgramsFilterRequest, PublishProgramData, PublishProgramRequest, RoleResource, RunPersonalProgramRequest, RunPersonalProgramResult, SearchProgramRequest, SubprojectPermissionsData, SubprojectRoleData, TeamMemberIdRequest, TeamSearchRequest, UpdateProgramRequest, UpdateSubprojectRoleRequest, UserAllTeamMember, UserInviteListItem, UserPotentialTeamInviteData, UserTeamAvailableRole, UserTeamListItem, UserTeamResult, UserTeamSearchResult, ValidateAdditionalProtocolRequest, ValidateProgramRequest, };
export declare class ProgramsTeamApiClient extends BaseApiClient {
    /** POST /api/program-sale/buy */
    buyProgram(body: ProgramBuyRequest): Promise<ApiResponse<BuyProgramResult>>;
    /** POST /api/program-sale/list (auth=public) */
    listProgramSale(body: ProgramsFilterRequest): Promise<ApiResponse<ProgramSaleData>>;
    /** GET /api/program-sale/list-by-author/{username} (auth=public) */
    listProgramSaleByAuthor(username: string): Promise<ApiResponse<ProgramSaleData>>;
    /** GET /api/program-sale/list/random/{username}/{ignore} (auth=public) */
    listProgramSaleRandom(username: string, ignore: string | number): Promise<ApiResponse<ProgramSaleData>>;
    /** GET /api/program-sale/salary/{program} */
    getProgramSaleSalary(program: number | string): Promise<ApiResponse<ProgramSalePriceData>>;
    /** GET /api/program-sale/tags (auth=public) */
    getProgramSaleTags(): Promise<ApiResponse<ProgramTagData>>;
    /** GET /api/program-sale/{program_sale} */
    showProgramSale(programSale: number | string): Promise<ApiResponse<ProgramSalePriceData>>;
    /** PUT /api/program-sale/{program_sale} */
    updateProgramSale(programSale: number | string, body: Record<string, unknown>): Promise<ApiResponse<EmptyOk>>;
    /** DELETE /api/program-sale/{program_sale} */
    destroyProgramSale(programSale: number | string): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/program/all */
    getAllPrograms(): Promise<ApiResponse<AllProgramData>>;
    /** GET /api/program/chains/{program}/{user} */
    getProgramChains(program: number | string, user: number | string): Promise<ApiResponse<{
        id: number;
        name: unknown;
    }>>;
    /** POST /api/program/detach-protocol */
    detachProtocol(body: DetachProgramProtocolRequest): Promise<ApiResponse<DetachProgramProtocolResult>>;
    /** GET /api/program/get-bookmarks (paginated) */
    getProgramBookmarks(): Promise<ApiResponse<PaginatedPayload<ProgramSaleData>>>;
    /** GET /api/program/history */
    getProgramHistory(): Promise<ApiResponse<AllProgramData>>;
    /** GET /api/program/history/{chain} */
    getProgramHistoryByChain(chain: number | string): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/program/last-purchases */
    getLastPurchases(): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/program/program-check */
    programCheck(body: ValidateProgramRequest): Promise<ApiResponse<ProgramValidationResult>>;
    /**
     * GET /api/program/program-data/{program?}
     * `program` is optional — when omitted the trailing path segment is dropped.
     */
    getProgramData(program?: number | string): Promise<ApiResponse<ProgramDataToUse>>;
    /** POST /api/program/program/add-tag */
    addProgramTag(body: ProgramAddTagRequest): Promise<ApiResponse<EmptyOk>>;
    /** DELETE /api/program/program/delete-tag/{program}/{tag} */
    deleteProgramTag(program: number | string, tag: string | number): Promise<ApiResponse<ProgramTagData>>;
    /** GET /api/program/publications/{program} */
    getProgramPublications(program: number | string): Promise<ApiResponse<PublishProgramData>>;
    /** POST /api/program/publish */
    publishProgram(body: PublishProgramRequest): Promise<ApiResponse<PublishProgramData>>;
    /** POST /api/program/publish/cancel */
    cancelPublishProgram(body: PublishProgramRequest): Promise<ApiResponse<PublishProgramData>>;
    /** POST /api/program/run-personal */
    runPersonalProgram(body: RunPersonalProgramRequest): Promise<ApiResponse<RunPersonalProgramResult>>;
    /** POST /api/program/search */
    searchPrograms(body: SearchProgramRequest): Promise<ApiResponse<ProgramHomeSearchResult>>;
    /** GET /api/program/show/{program} */
    showProgram(program: number | string): Promise<ApiResponse<ProgramInstanceData>>;
    /** GET /api/program/simulation/{program} */
    simulateProgram(program: number | string): Promise<ApiResponse<ProgramSimulationData>>;
    /** POST /api/program/toggle-bookmark */
    toggleProgramBookmark(body: ProgramBookmarkRequest): Promise<ApiResponse<ProgramBookmarkResult>>;
    /**
     * PUT /api/program/update-program/{program}
     *
     * Spec leaves `request.shape` empty (the FormRequest applies conditional
     * step-based rules), so the body type is open. Multipart kicks in
     * automatically when any value is a `File`/`Blob` (e.g. `program_image`).
     */
    updateProgram(program: number | string, body: UpdateProgramRequest): Promise<ApiResponse<ProgramData>>;
    /** GET /api/program/users-additional-steps/{program}/{protocol} */
    getProgramUsersAdditionalSteps(program: number | string, protocol: number | string): Promise<ApiResponse<ProgramChainStepUsersData>>;
    /** GET /api/program/users-steps/{program} */
    getProgramUsersSteps(program: number | string): Promise<ApiResponse<ProgramChainStepUsersData>>;
    /** GET /api/program/users/{program} */
    getProgramUsers(program: number | string): Promise<ApiResponse<ProgramUserSummary>>;
    /** POST /api/program/validate-additional-protocol */
    validateAdditionalProtocol(body: ValidateAdditionalProtocolRequest): Promise<ApiResponse<AdditionalProtocolValidationResult>>;
    /** GET /api/project-role/permissions */
    getProjectRolePermissions(): Promise<ApiResponse<SubprojectPermissionsData>>;
    /** GET /api/project-role/{project_role} */
    showProjectRole(projectRole: number | string): Promise<ApiResponse<SubprojectRoleData>>;
    /** PUT /api/project-role/{project_role} */
    updateProjectRole(projectRole: number | string, body: UpdateSubprojectRoleRequest): Promise<ApiResponse<SubprojectRoleData>>;
    /** DELETE /api/project-role/{project_role} */
    destroyProjectRole(projectRole: number | string): Promise<ApiResponse<SubprojectRoleData>>;
    /** GET /api/role */
    listRoles(): Promise<ApiResponse<RoleResource>>;
    /**
     * POST /api/role — spec leaves request/response shape empty.
     * Body kept open so callers can pass a name + permission map.
     */
    createRole(body: Record<string, unknown>): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/role/{role} */
    showRole(role: number | string): Promise<ApiResponse<EmptyOk>>;
    /** PUT /api/role/{role} */
    updateRole(role: number | string, body: Record<string, unknown>): Promise<ApiResponse<EmptyOk>>;
    /** DELETE /api/role/{role} */
    destroyRole(role: number | string): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/roles/all */
    getAllRoles(): Promise<ApiResponse<RoleResource>>;
    /** POST /api/team/accept */
    acceptTeamInvite(body: TeamMemberIdRequest): Promise<ApiResponse<UserTeamResult>>;
    /** GET /api/team/accept-invite/{token} */
    acceptTeamInviteByToken(token: string): Promise<ApiResponse<UserPotentialTeamInviteData>>;
    /** GET /api/team/all */
    getAllTeamMembers(): Promise<ApiResponse<UserAllTeamMember>>;
    /** POST /api/team/handle-role */
    handleTeamRole(body: HandleTeamRoleRequest): Promise<ApiResponse<UserTeamResult>>;
    /** POST /api/team/invite */
    inviteTeamMember(body: InviteTeamMemberRequest): Promise<ApiResponse<UserTeamResult>>;
    /** POST /api/team/leave */
    leaveTeam(body: TeamMemberIdRequest): Promise<ApiResponse<UserTeamResult>>;
    /** GET /api/team/list/{status} */
    listTeam(status: string | number): Promise<ApiResponse<UserTeamListItem>>;
    /** GET /api/team/member/{status} */
    listTeamInvites(status: string | number): Promise<ApiResponse<UserInviteListItem>>;
    /** POST /api/team/network-invite */
    inviteNetworkMember(body: InviteTeamMemberRequest): Promise<ApiResponse<UserTeamResult>>;
    /** POST /api/team/network-invite-potential */
    inviteNetworkPotentialMember(body: InviteTeamMemberRequest): Promise<ApiResponse<UserTeamResult>>;
    /** POST /api/team/network-search */
    searchNetwork(body: NetworkSearchRequest): Promise<ApiResponse<NetworkSearchResult>>;
    /** POST /api/team/reject */
    rejectTeamInvite(body: TeamMemberIdRequest): Promise<ApiResponse<UserTeamResult>>;
    /** POST /api/team/remove */
    removeTeamMember(body: TeamMemberIdRequest): Promise<ApiResponse<UserTeamResult>>;
    /** POST /api/team/remove-potential */
    removePotentialTeamMember(body: TeamMemberIdRequest): Promise<ApiResponse<UserTeamResult>>;
    /** GET /api/team/roles */
    getTeamRoles(): Promise<ApiResponse<UserTeamAvailableRole>>;
    /** POST /api/team/search-members */
    searchTeamMembers(body: TeamSearchRequest): Promise<ApiResponse<UserTeamSearchResult>>;
    /** POST /api/team/search-users */
    searchTeamUsers(body: TeamSearchRequest): Promise<ApiResponse<UserTeamSearchResult>>;
}
//# sourceMappingURL=programs-team-api-client.d.ts.map