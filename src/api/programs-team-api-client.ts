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
import type {
  AdditionalProtocolValidationResult,
  AllProgramData,
  BuyProgramResult,
  DetachProgramProtocolRequest,
  DetachProgramProtocolResult,
  EmptyOk,
  HandleTeamRoleRequest,
  InviteTeamMemberRequest,
  NetworkSearchRequest,
  NetworkSearchResult,
  PaginatedPayload,
  ProgramAddTagRequest,
  ProgramBookmarkRequest,
  ProgramBookmarkResult,
  ProgramBuyRequest,
  ProgramChainStepUsersData,
  ProgramData,
  ProgramDataToUse,
  ProgramHomeSearchResult,
  ProgramInstanceData,
  ProgramSaleData,
  ProgramSalePriceData,
  ProgramSimulationData,
  ProgramTagData,
  ProgramUserSummary,
  ProgramValidationResult,
  ProgramsFilterRequest,
  PublishProgramData,
  PublishProgramRequest,
  RoleResource,
  RunPersonalProgramRequest,
  RunPersonalProgramResult,
  SearchProgramRequest,
  SubprojectPermissionsData,
  SubprojectRoleData,
  TeamMemberIdRequest,
  TeamSearchRequest,
  UpdateProgramRequest,
  UpdateSubprojectRoleRequest,
  UserAllTeamMember,
  UserInviteListItem,
  UserPotentialTeamInviteData,
  UserTeamAvailableRole,
  UserTeamListItem,
  UserTeamResult,
  UserTeamSearchResult,
  ValidateAdditionalProtocolRequest,
  ValidateProgramRequest,
} from '../types/programs-team';

// Re-export so consumers can import types from one place.
export type {
  AdditionalProtocolValidationResult,
  AllProgramData,
  BuyProgramResult,
  DetachProgramProtocolRequest,
  DetachProgramProtocolResult,
  EmptyOk,
  HandleTeamRoleRequest,
  InviteTeamMemberRequest,
  NetworkSearchRequest,
  NetworkSearchResult,
  PaginatedPayload,
  ProgramAddTagRequest,
  ProgramBookmarkRequest,
  ProgramBookmarkResult,
  ProgramBuyRequest,
  ProgramChainStepUsersData,
  ProgramData,
  ProgramDataToUse,
  ProgramHomeSearchResult,
  ProgramInstanceData,
  ProgramSaleData,
  ProgramSalePriceData,
  ProgramSimulationData,
  ProgramTagData,
  ProgramUserSummary,
  ProgramValidationResult,
  ProgramsFilterRequest,
  PublishProgramData,
  PublishProgramRequest,
  RoleResource,
  RunPersonalProgramRequest,
  RunPersonalProgramResult,
  SearchProgramRequest,
  SubprojectPermissionsData,
  SubprojectRoleData,
  TeamMemberIdRequest,
  TeamSearchRequest,
  UpdateProgramRequest,
  UpdateSubprojectRoleRequest,
  UserAllTeamMember,
  UserInviteListItem,
  UserPotentialTeamInviteData,
  UserTeamAvailableRole,
  UserTeamListItem,
  UserTeamResult,
  UserTeamSearchResult,
  ValidateAdditionalProtocolRequest,
  ValidateProgramRequest,
};

export class ProgramsTeamApiClient extends BaseApiClient {
  // ===========================================================================
  // /api/program-sale/* — purchase + listing flow
  // ===========================================================================

  /** POST /api/program-sale/buy */
  async buyProgram(body: ProgramBuyRequest): Promise<ApiResponse<BuyProgramResult>> {
    return this.post<BuyProgramResult>('/api/program-sale/buy', body);
  }

  /** POST /api/program-sale/list (auth=public) */
  async listProgramSale(
    body: ProgramsFilterRequest,
  ): Promise<ApiResponse<ProgramSaleData>> {
    return this.post<ProgramSaleData>('/api/program-sale/list', body, {
      auth: false,
    });
  }

  /** GET /api/program-sale/list-by-author/{username} (auth=public) */
  async listProgramSaleByAuthor(
    username: string,
  ): Promise<ApiResponse<ProgramSaleData>> {
    return this.get<ProgramSaleData>(
      `/api/program-sale/list-by-author/${encodeURIComponent(username)}`,
      undefined,
      { auth: false },
    );
  }

  /** GET /api/program-sale/list/random/{username}/{ignore} (auth=public) */
  async listProgramSaleRandom(
    username: string,
    ignore: string | number,
  ): Promise<ApiResponse<ProgramSaleData>> {
    return this.get<ProgramSaleData>(
      `/api/program-sale/list/random/${encodeURIComponent(username)}/${encodeURIComponent(String(ignore))}`,
      undefined,
      { auth: false },
    );
  }

  /** GET /api/program-sale/salary/{program} */
  async getProgramSaleSalary(
    program: number | string,
  ): Promise<ApiResponse<ProgramSalePriceData>> {
    return this.get<ProgramSalePriceData>(`/api/program-sale/salary/${program}`);
  }

  /** GET /api/program-sale/tags (auth=public) */
  async getProgramSaleTags(): Promise<ApiResponse<ProgramTagData>> {
    return this.get<ProgramTagData>('/api/program-sale/tags', undefined, {
      auth: false,
    });
  }

  /** GET /api/program-sale/{program_sale} */
  async showProgramSale(
    programSale: number | string,
  ): Promise<ApiResponse<ProgramSalePriceData>> {
    return this.get<ProgramSalePriceData>(`/api/program-sale/${programSale}`);
  }

  /** PUT /api/program-sale/{program_sale} */
  async updateProgramSale(
    programSale: number | string,
    body: Record<string, unknown>,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.put<EmptyOk>(`/api/program-sale/${programSale}`, body);
  }

  /** DELETE /api/program-sale/{program_sale} */
  async destroyProgramSale(
    programSale: number | string,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.delete<EmptyOk>(`/api/program-sale/${programSale}`);
  }

  // ===========================================================================
  // /api/program/* — program CRUD, history, run-personal, publish
  // ===========================================================================

  /** GET /api/program/all */
  async getAllPrograms(): Promise<ApiResponse<AllProgramData>> {
    return this.get<AllProgramData>('/api/program/all');
  }

  /** GET /api/program/chains/{program}/{user} */
  async getProgramChains(
    program: number | string,
    user: number | string,
  ): Promise<ApiResponse<{ id: number; name: unknown }>> {
    return this.get<{ id: number; name: unknown }>(
      `/api/program/chains/${program}/${user}`,
    );
  }

  /** POST /api/program/detach-protocol */
  async detachProtocol(
    body: DetachProgramProtocolRequest,
  ): Promise<ApiResponse<DetachProgramProtocolResult>> {
    return this.post<DetachProgramProtocolResult>(
      '/api/program/detach-protocol',
      body,
    );
  }

  /** GET /api/program/get-bookmarks (paginated) */
  async getProgramBookmarks(): Promise<
    ApiResponse<PaginatedPayload<ProgramSaleData>>
  > {
    return this.get<PaginatedPayload<ProgramSaleData>>(
      '/api/program/get-bookmarks',
    );
  }

  /** GET /api/program/history */
  async getProgramHistory(): Promise<ApiResponse<AllProgramData>> {
    return this.get<AllProgramData>('/api/program/history');
  }

  /** GET /api/program/history/{chain} */
  async getProgramHistoryByChain(
    chain: number | string,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.get<EmptyOk>(`/api/program/history/${chain}`);
  }

  /** GET /api/program/last-purchases */
  async getLastPurchases(): Promise<ApiResponse<EmptyOk>> {
    return this.get<EmptyOk>('/api/program/last-purchases');
  }

  /** POST /api/program/program-check */
  async programCheck(
    body: ValidateProgramRequest,
  ): Promise<ApiResponse<ProgramValidationResult>> {
    return this.post<ProgramValidationResult>('/api/program/program-check', body);
  }

  /**
   * GET /api/program/program-data/{program?}
   * `program` is optional — when omitted the trailing path segment is dropped.
   */
  async getProgramData(
    program?: number | string,
  ): Promise<ApiResponse<ProgramDataToUse>> {
    const tail = program === undefined || program === null ? '' : `/${program}`;
    return this.get<ProgramDataToUse>(`/api/program/program-data${tail}`);
  }

  /** POST /api/program/program/add-tag */
  async addProgramTag(body: ProgramAddTagRequest): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>('/api/program/program/add-tag', body);
  }

  /** DELETE /api/program/program/delete-tag/{program}/{tag} */
  async deleteProgramTag(
    program: number | string,
    tag: string | number,
  ): Promise<ApiResponse<ProgramTagData>> {
    return this.delete<ProgramTagData>(
      `/api/program/program/delete-tag/${program}/${encodeURIComponent(String(tag))}`,
    );
  }

  /** GET /api/program/publications/{program} */
  async getProgramPublications(
    program: number | string,
  ): Promise<ApiResponse<PublishProgramData>> {
    return this.get<PublishProgramData>(`/api/program/publications/${program}`);
  }

  /** POST /api/program/publish */
  async publishProgram(
    body: PublishProgramRequest,
  ): Promise<ApiResponse<PublishProgramData>> {
    return this.post<PublishProgramData>('/api/program/publish', body);
  }

  /** POST /api/program/publish/cancel */
  async cancelPublishProgram(
    body: PublishProgramRequest,
  ): Promise<ApiResponse<PublishProgramData>> {
    return this.post<PublishProgramData>('/api/program/publish/cancel', body);
  }

  /** POST /api/program/run-personal */
  async runPersonalProgram(
    body: RunPersonalProgramRequest,
  ): Promise<ApiResponse<RunPersonalProgramResult>> {
    return this.post<RunPersonalProgramResult>('/api/program/run-personal', body);
  }

  /** POST /api/program/search */
  async searchPrograms(
    body: SearchProgramRequest,
  ): Promise<ApiResponse<ProgramHomeSearchResult>> {
    return this.post<ProgramHomeSearchResult>('/api/program/search', body);
  }

  /** GET /api/program/show/{program} */
  async showProgram(
    program: number | string,
  ): Promise<ApiResponse<ProgramInstanceData>> {
    return this.get<ProgramInstanceData>(`/api/program/show/${program}`);
  }

  /** GET /api/program/simulation/{program} */
  async simulateProgram(
    program: number | string,
  ): Promise<ApiResponse<ProgramSimulationData>> {
    return this.get<ProgramSimulationData>(`/api/program/simulation/${program}`);
  }

  /** POST /api/program/toggle-bookmark */
  async toggleProgramBookmark(
    body: ProgramBookmarkRequest,
  ): Promise<ApiResponse<ProgramBookmarkResult>> {
    return this.post<ProgramBookmarkResult>('/api/program/toggle-bookmark', body);
  }

  /**
   * PUT /api/program/update-program/{program}
   *
   * Spec leaves `request.shape` empty (the FormRequest applies conditional
   * step-based rules), so the body type is open. Multipart kicks in
   * automatically when any value is a `File`/`Blob` (e.g. `program_image`).
   */
  async updateProgram(
    program: number | string,
    body: UpdateProgramRequest,
  ): Promise<ApiResponse<ProgramData>> {
    return this.put<ProgramData>(`/api/program/update-program/${program}`, body);
  }

  /** GET /api/program/users-additional-steps/{program}/{protocol} */
  async getProgramUsersAdditionalSteps(
    program: number | string,
    protocol: number | string,
  ): Promise<ApiResponse<ProgramChainStepUsersData>> {
    return this.get<ProgramChainStepUsersData>(
      `/api/program/users-additional-steps/${program}/${protocol}`,
    );
  }

  /** GET /api/program/users-steps/{program} */
  async getProgramUsersSteps(
    program: number | string,
  ): Promise<ApiResponse<ProgramChainStepUsersData>> {
    return this.get<ProgramChainStepUsersData>(
      `/api/program/users-steps/${program}`,
    );
  }

  /** GET /api/program/users/{program} */
  async getProgramUsers(
    program: number | string,
  ): Promise<ApiResponse<ProgramUserSummary>> {
    return this.get<ProgramUserSummary>(`/api/program/users/${program}`);
  }

  /** POST /api/program/validate-additional-protocol */
  async validateAdditionalProtocol(
    body: ValidateAdditionalProtocolRequest,
  ): Promise<ApiResponse<AdditionalProtocolValidationResult>> {
    return this.post<AdditionalProtocolValidationResult>(
      '/api/program/validate-additional-protocol',
      body,
    );
  }

  // ===========================================================================
  // /api/project-role/* — Subproject role CRUD (admin guard)
  // ===========================================================================

  /** GET /api/project-role/permissions */
  async getProjectRolePermissions(): Promise<
    ApiResponse<SubprojectPermissionsData>
  > {
    return this.get<SubprojectPermissionsData>('/api/project-role/permissions');
  }

  /** GET /api/project-role/{project_role} */
  async showProjectRole(
    projectRole: number | string,
  ): Promise<ApiResponse<SubprojectRoleData>> {
    return this.get<SubprojectRoleData>(`/api/project-role/${projectRole}`);
  }

  /** PUT /api/project-role/{project_role} */
  async updateProjectRole(
    projectRole: number | string,
    body: UpdateSubprojectRoleRequest,
  ): Promise<ApiResponse<SubprojectRoleData>> {
    return this.put<SubprojectRoleData>(`/api/project-role/${projectRole}`, body);
  }

  /** DELETE /api/project-role/{project_role} */
  async destroyProjectRole(
    projectRole: number | string,
  ): Promise<ApiResponse<SubprojectRoleData>> {
    return this.delete<SubprojectRoleData>(`/api/project-role/${projectRole}`);
  }

  // ===========================================================================
  // /api/role + /api/roles/* — User role CRUD
  // ===========================================================================

  /** GET /api/role */
  async listRoles(): Promise<ApiResponse<RoleResource>> {
    return this.get<RoleResource>('/api/role');
  }

  /**
   * POST /api/role — spec leaves request/response shape empty.
   * Body kept open so callers can pass a name + permission map.
   */
  async createRole(body: Record<string, unknown>): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>('/api/role', body);
  }

  /** GET /api/role/{role} */
  async showRole(role: number | string): Promise<ApiResponse<EmptyOk>> {
    return this.get<EmptyOk>(`/api/role/${role}`);
  }

  /** PUT /api/role/{role} */
  async updateRole(
    role: number | string,
    body: Record<string, unknown>,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.put<EmptyOk>(`/api/role/${role}`, body);
  }

  /** DELETE /api/role/{role} */
  async destroyRole(role: number | string): Promise<ApiResponse<EmptyOk>> {
    return this.delete<EmptyOk>(`/api/role/${role}`);
  }

  /** GET /api/roles/all */
  async getAllRoles(): Promise<ApiResponse<RoleResource>> {
    return this.get<RoleResource>('/api/roles/all');
  }

  // ===========================================================================
  // /api/team/* — Team membership, invites, role mgmt, network search
  // ===========================================================================

  /** POST /api/team/accept */
  async acceptTeamInvite(
    body: TeamMemberIdRequest,
  ): Promise<ApiResponse<UserTeamResult>> {
    return this.post<UserTeamResult>('/api/team/accept', body);
  }

  /** GET /api/team/accept-invite/{token} */
  async acceptTeamInviteByToken(
    token: string,
  ): Promise<ApiResponse<UserPotentialTeamInviteData>> {
    return this.get<UserPotentialTeamInviteData>(
      `/api/team/accept-invite/${encodeURIComponent(token)}`,
    );
  }

  /** GET /api/team/all */
  async getAllTeamMembers(): Promise<ApiResponse<UserAllTeamMember>> {
    return this.get<UserAllTeamMember>('/api/team/all');
  }

  /** POST /api/team/handle-role */
  async handleTeamRole(
    body: HandleTeamRoleRequest,
  ): Promise<ApiResponse<UserTeamResult>> {
    return this.post<UserTeamResult>('/api/team/handle-role', body);
  }

  /** POST /api/team/invite */
  async inviteTeamMember(
    body: InviteTeamMemberRequest,
  ): Promise<ApiResponse<UserTeamResult>> {
    return this.post<UserTeamResult>('/api/team/invite', body);
  }

  /** POST /api/team/leave */
  async leaveTeam(
    body: TeamMemberIdRequest,
  ): Promise<ApiResponse<UserTeamResult>> {
    return this.post<UserTeamResult>('/api/team/leave', body);
  }

  /** GET /api/team/list/{status} */
  async listTeam(
    status: string | number,
  ): Promise<ApiResponse<UserTeamListItem>> {
    return this.get<UserTeamListItem>(
      `/api/team/list/${encodeURIComponent(String(status))}`,
    );
  }

  /** GET /api/team/member/{status} */
  async listTeamInvites(
    status: string | number,
  ): Promise<ApiResponse<UserInviteListItem>> {
    return this.get<UserInviteListItem>(
      `/api/team/member/${encodeURIComponent(String(status))}`,
    );
  }

  /** POST /api/team/network-invite */
  async inviteNetworkMember(
    body: InviteTeamMemberRequest,
  ): Promise<ApiResponse<UserTeamResult>> {
    return this.post<UserTeamResult>('/api/team/network-invite', body);
  }

  /** POST /api/team/network-invite-potential */
  async inviteNetworkPotentialMember(
    body: InviteTeamMemberRequest,
  ): Promise<ApiResponse<UserTeamResult>> {
    return this.post<UserTeamResult>('/api/team/network-invite-potential', body);
  }

  /** POST /api/team/network-search */
  async searchNetwork(
    body: NetworkSearchRequest,
  ): Promise<ApiResponse<NetworkSearchResult>> {
    return this.post<NetworkSearchResult>('/api/team/network-search', body);
  }

  /** POST /api/team/reject */
  async rejectTeamInvite(
    body: TeamMemberIdRequest,
  ): Promise<ApiResponse<UserTeamResult>> {
    return this.post<UserTeamResult>('/api/team/reject', body);
  }

  /** POST /api/team/remove */
  async removeTeamMember(
    body: TeamMemberIdRequest,
  ): Promise<ApiResponse<UserTeamResult>> {
    return this.post<UserTeamResult>('/api/team/remove', body);
  }

  /** POST /api/team/remove-potential */
  async removePotentialTeamMember(
    body: TeamMemberIdRequest,
  ): Promise<ApiResponse<UserTeamResult>> {
    return this.post<UserTeamResult>('/api/team/remove-potential', body);
  }

  /** GET /api/team/roles */
  async getTeamRoles(): Promise<ApiResponse<UserTeamAvailableRole>> {
    return this.get<UserTeamAvailableRole>('/api/team/roles');
  }

  /** POST /api/team/search-members */
  async searchTeamMembers(
    body: TeamSearchRequest,
  ): Promise<ApiResponse<UserTeamSearchResult>> {
    return this.post<UserTeamSearchResult>('/api/team/search-members', body);
  }

  /** POST /api/team/search-users */
  async searchTeamUsers(
    body: TeamSearchRequest,
  ): Promise<ApiResponse<UserTeamSearchResult>> {
    return this.post<UserTeamSearchResult>('/api/team/search-users', body);
  }
}
