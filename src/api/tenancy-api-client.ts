/**
 * TenancyApiClient — covers the multi-tenant boot surface + subproject
 * lifecycle + tenant-claim + domain-interfaces + world-locations + gov
 * directory + frontend/SEO + creator/featured + contacts + documentation
 * slice of the P2X API. Source of truth for shapes is
 * `sdk/spec/endpoints.json`.
 *
 * The class extends `BaseApiClient`, which already handles:
 *   - Bearer token injection (skipped per call via `{ auth: false }`)
 *   - `X-Domain` header from `getDomain`
 *   - PUT/PATCH → POST + `?_method=PUT|PATCH` (Laravel)
 *   - FormData switching when payload contains a `File`/`Blob`
 *   - 401 / 422 → callback + `ApiError`
 *
 * Wrapper handling: most slice endpoints emit `wrapper: "data"` (single
 * Resource), so the SDK consumes the parsed envelope (`{ success, message,
 * data }`) and the typed payload sits in `.data`. `wrapper: "paginated"`
 * endpoints surface the same envelope but `.data` carries an `items[]` +
 * pagination — typed as `PaginatedPayload<T>` (re-exported from this file).
 *
 * Special-case for `loadTenant()`: CI-WWW relies on `/api/load` preserving
 * the 200 vs 404 distinction without throwing. The method opts into
 * `{ validateStatus: () => true, auth: false }` and returns a discriminated
 * union (`LoadTenantResult`).
 */

import { BaseApiClient, type ApiResponse } from '../api-client';
import type {
  AuthenticateAtTenantData,
  CompleteTenantClaimRequest,
  ConfirmSubprojectAdminAccountRequest,
  ContactData,
  CreateCreatorRequest,
  CreateDocumentationRequest,
  CreateDomainInterfaceRequest,
  CreateSeoPageRequest,
  CreateWorldLocationCityRequest,
  CreateWorldLocationCountryRequest,
  CreateWorldLocationStateRequest,
  CreatorActivityData,
  CreatorData,
  CreatorRequestData,
  DocumentationItem,
  DomainInterface,
  EmptyOk,
  FindClaimableSubprojectRequest,
  FindContactsRequest,
  FrontendData,
  GovDirectoryItem,
  ImportContactsRequest,
  InitiateTenantClaimRequest,
  ListContactsRequest,
  LoadTenantResult,
  PaginatedPayload,
  PublicCountryData,
  PublicTenantLogoData,
  RegisterSubprojectAdministratorRequest,
  SaveContactRequest,
  SaveFeaturedCreatorsRequest,
  SaveFeaturedProgramsRequest,
  SaveFrontendRequest,
  SeoPageData,
  StartSubprojectClaimRequest,
  SubprojectAdminLoginRequest,
  SubprojectClientData,
  SubprojectDashboardDefaultData,
  SubprojectDetailData,
  SubprojectHasContactsRequest,
  SubprojectInterfaceData,
  SubprojectLeaderData,
  SubprojectListItem,
  SubprojectSearchRequest,
  SubprojectSectionPayload,
  SubprojectSendInvitesRequest,
  SubprojectUpdatePermissionsRequest,
  TenantClaimData,
  TenantClaimSearchItem,
  TenantClaimStatusData,
  TenantInterfaceBlockItem,
  TenantInterfaceItem,
  TenantInterfacePageItem,
  TenantRegistrationFee,
  UpdateCreatorRequest,
  UpdateDocumentationRequest,
  UpdateDomainInterfaceRequest,
  UpdateSeoPageRequest,
  VerifyTenantClaimRequest,
  WorldLocationCity,
  WorldLocationCountry,
  WorldLocationState,
} from '../types/tenancy';

// Re-export so consumers can import types from one place.
export type {
  AuthenticateAtTenantData,
  CompleteTenantClaimRequest,
  ConfirmSubprojectAdminAccountRequest,
  ContactData,
  CreateCreatorRequest,
  CreateDocumentationRequest,
  CreateDomainInterfaceRequest,
  CreateSeoPageRequest,
  CreateWorldLocationCityRequest,
  CreateWorldLocationCountryRequest,
  CreateWorldLocationStateRequest,
  CreatorActivityData,
  CreatorData,
  CreatorRequestData,
  DocumentationItem,
  DomainInterface,
  EmptyOk,
  FindClaimableSubprojectRequest,
  FindContactsRequest,
  FrontendData,
  GovDirectoryItem,
  ImportContactsRequest,
  InitiateTenantClaimRequest,
  ListContactsRequest,
  LoadTenantResult,
  PaginatedPayload,
  PublicCountryData,
  PublicTenantLogoData,
  RegisterSubprojectAdministratorRequest,
  SaveContactRequest,
  SaveFeaturedCreatorsRequest,
  SaveFeaturedProgramsRequest,
  SaveFrontendRequest,
  SeoPageData,
  StartSubprojectClaimRequest,
  SubprojectAdminLoginRequest,
  SubprojectClientData,
  SubprojectDashboardDefaultData,
  SubprojectDetailData,
  SubprojectHasContactsRequest,
  SubprojectInterfaceData,
  SubprojectLeaderData,
  SubprojectListItem,
  SubprojectSearchRequest,
  SubprojectSectionPayload,
  SubprojectSendInvitesRequest,
  SubprojectUpdatePermissionsRequest,
  TenantClaimData,
  TenantClaimSearchItem,
  TenantClaimStatusData,
  TenantInterfaceBlockItem,
  TenantInterfaceItem,
  TenantInterfacePageItem,
  TenantRegistrationFee,
  UpdateCreatorRequest,
  UpdateDocumentationRequest,
  UpdateDomainInterfaceRequest,
  UpdateSeoPageRequest,
  VerifyTenantClaimRequest,
  WorldLocationCity,
  WorldLocationCountry,
  WorldLocationState,
};

/**
 * Helper: append an optional path segment when a value is provided. Used
 * for the `{subproject?}` Laravel optional path parameters scattered across
 * this slice.
 */
function tail(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === '') return '';
  return `/${encodeURIComponent(String(value))}`;
}

export class TenancyApiClient extends BaseApiClient {
  // ===========================================================================
  // CI-WWW boot endpoints
  // ===========================================================================

  /**
   * GET /api/load — load tenant boot data. Public (no Bearer).
   *
   * Special-cased: 404 must NOT throw — CI-WWW renders a "tenant not found"
   * page from the false branch. Returns a discriminated union so callers
   * can switch on `.ok`.
   */
  async loadTenant(): Promise<LoadTenantResult> {
    const res = await this.request<SubprojectClientData>(
      '/api/load',
      { method: 'GET' },
      { auth: false, validateStatus: () => true },
    );
    // `request<T>` returns `parsed as ApiResponse<T>`; the parsed envelope
    // either has `data` populated (200) or null (404). Discriminate purely
    // on the response status the SDK saw — but `request` doesn't surface
    // status. The cheapest reliable signal we have is `success`: Laravel
    // emits `{ success: false }` on the 404 branch and `{ success: true }`
    // on the 200 branch. If `data` is present we treat it as a hit.
    const env = res as unknown as { success?: boolean; data?: SubprojectClientData | null };
    if (env && env.success && env.data) {
      return { status: 200, ok: true, data: env.data };
    }
    return { status: 404, ok: false, data: null };
  }

  /** GET /api/board — public dashboard defaults. */
  async loadBoard(): Promise<ApiResponse<SubprojectDashboardDefaultData>> {
    return this.get<SubprojectDashboardDefaultData>(
      '/api/board',
      undefined,
      { auth: false },
    );
  }

  /** GET /api/leader — public leader info. */
  async loadLeader(): Promise<ApiResponse<SubprojectLeaderData>> {
    return this.get<SubprojectLeaderData>('/api/leader', undefined, { auth: false });
  }

  /** GET /api/interface/load-interface — public interface payload. */
  async loadInterface(): Promise<ApiResponse<SubprojectInterfaceData>> {
    return this.get<SubprojectInterfaceData>(
      '/api/interface/load-interface',
      undefined,
      { auth: false },
    );
  }

  /** GET /api/authenticate-at/{tenant} — auth=api. */
  async authenticateAtTenant(tenant: string): Promise<ApiResponse<AuthenticateAtTenantData>> {
    return this.get<AuthenticateAtTenantData>(
      `/api/authenticate-at/${encodeURIComponent(tenant)}`,
    );
  }

  /** GET /api/public/logo/{tenant} — public tenant logo. */
  async getPublicTenantLogo(tenant: string): Promise<ApiResponse<PublicTenantLogoData>> {
    return this.get<PublicTenantLogoData>(
      `/api/public/logo/${encodeURIComponent(tenant)}`,
      undefined,
      { auth: false },
    );
  }

  // ===========================================================================
  // Subproject CRUD
  // ===========================================================================

  /** GET /api/subproject (paginated). */
  async listSubprojects(
    params?: { page?: number; per_page?: number; [k: string]: unknown },
  ): Promise<ApiResponse<PaginatedPayload<SubprojectListItem>>> {
    return this.get<PaginatedPayload<SubprojectListItem>>('/api/subproject', params as any);
  }

  /** GET /api/subproject/all */
  async listAllSubprojects(): Promise<ApiResponse<SubprojectListItem[]>> {
    return this.get<SubprojectListItem[]>('/api/subproject/all');
  }

  /** GET /api/subproject/{subproject} */
  async showSubproject(subproject: number | string): Promise<ApiResponse<SubprojectDetailData>> {
    return this.get<SubprojectDetailData>(`/api/subproject/${encodeURIComponent(String(subproject))}`);
  }

  /** DELETE /api/subproject/{subproject} */
  async deleteSubproject(subproject: number | string): Promise<ApiResponse<EmptyOk>> {
    return this.delete<EmptyOk>(`/api/subproject/${encodeURIComponent(String(subproject))}`);
  }

  /** POST /api/subproject/delete-category/{subproject} */
  async deleteSubprojectCategory(
    subproject: number | string,
    body: SubprojectSectionPayload,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>(
      `/api/subproject/delete-category/${encodeURIComponent(String(subproject))}`,
      body,
    );
  }

  // ===========================================================================
  // Subproject admin lifecycle
  // ===========================================================================

  /** GET /api/subproject-admin/account-data */
  async getSubprojectAdminAccountData(): Promise<ApiResponse<EmptyOk>> {
    return this.get<EmptyOk>('/api/subproject-admin/account-data');
  }

  /** POST /api/subproject-admin/confirm-account */
  async confirmSubprojectAdminAccount(
    body: ConfirmSubprojectAdminAccountRequest,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>('/api/subproject-admin/confirm-account', body);
  }

  /** POST /api/subproject-admin/create-account (public). */
  async createSubprojectAdminAccount(
    body: RegisterSubprojectAdministratorRequest,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>(
      '/api/subproject-admin/create-account',
      body,
      { auth: false },
    );
  }

  /** GET /api/subproject-admin/create-subscription */
  async createSubprojectAdminSubscription(): Promise<ApiResponse<EmptyOk>> {
    return this.get<EmptyOk>('/api/subproject-admin/create-subscription');
  }

  /** POST /api/subproject-admin/find-claimable */
  async findClaimableSubproject(
    body: FindClaimableSubprojectRequest,
  ): Promise<ApiResponse<SubprojectListItem[]>> {
    return this.post<SubprojectListItem[]>('/api/subproject-admin/find-claimable', body);
  }

  /** GET /api/subproject-admin/get-allowed-countries (public). */
  async getSubprojectAdminAllowedCountries(): Promise<ApiResponse<unknown[]>> {
    return this.get<unknown[]>(
      '/api/subproject-admin/get-allowed-countries',
      undefined,
      { auth: false },
    );
  }

  /** POST /api/subproject-admin/login (public). */
  async subprojectAdminLogin(
    body: SubprojectAdminLoginRequest,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>('/api/subproject-admin/login', body, { auth: false });
  }

  /** POST /api/subproject-admin/subproject/has-contacts */
  async subprojectAdminHasContacts(
    body: SubprojectHasContactsRequest,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>('/api/subproject-admin/subproject/has-contacts', body);
  }

  /** GET /api/subproject-admin/subscription-status */
  async getSubprojectAdminSubscriptionStatus(): Promise<ApiResponse<EmptyOk>> {
    return this.get<EmptyOk>('/api/subproject-admin/subscription-status');
  }

  /** POST /api/subproject-admin/start-claiming/{subproject}/claim */
  async startSubprojectClaim(
    subproject: number | string,
    body: StartSubprojectClaimRequest,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>(
      `/api/subproject-admin/start-claiming/${encodeURIComponent(String(subproject))}/claim`,
      body,
    );
  }

  // -- claim sections (saving step bodies for an in-flight claim) -------------

  /** POST /api/subproject-admin/claim/subproject/{subproject}/content */
  async saveClaimedSubprojectContent(
    subproject: number | string,
    body: SubprojectSectionPayload,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/content`,
      body,
    );
  }

  /** POST /api/subproject-admin/claim/subproject/{subproject}/domains */
  async saveClaimedSubprojectDomains(
    subproject: number | string,
    body: SubprojectSectionPayload,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/domains`,
      body,
    );
  }

  /** POST /api/subproject-admin/claim/subproject/{subproject}/layout */
  async saveClaimedSubprojectLayout(
    subproject: number | string,
    body: SubprojectSectionPayload,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/layout`,
      body,
    );
  }

  /** POST /api/subproject-admin/claim/subproject/{subproject}/seo */
  async saveClaimedSubprojectSeo(
    subproject: number | string,
    body: SubprojectSectionPayload,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/seo`,
      body,
    );
  }

  /** POST /api/subproject-admin/claim/subproject/{subproject}/team */
  async saveClaimedSubprojectTeam(
    subproject: number | string,
    body: SubprojectSectionPayload,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/team`,
      body,
    );
  }

  /** POST /api/subproject-admin/claim/subproject/{subproject}/template */
  async saveClaimedSubprojectTemplate(
    subproject: number | string,
    body: SubprojectSectionPayload,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/template`,
      body,
    );
  }

  /** GET /api/subproject-admin/claim/subproject/{subproject}/wizard-instance */
  async getClaimedSubprojectWizardInstance(
    subproject: number | string,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.get<EmptyOk>(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/wizard-instance`,
    );
  }

  // -- create sections (greenfield subproject creation flow) ------------------

  /** POST /api/subproject-admin/create/subproject/content */
  async createSubprojectContent(body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>('/api/subproject-admin/create/subproject/content', body);
  }

  /** POST /api/subproject-admin/create/subproject/domains */
  async createSubprojectDomains(body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>('/api/subproject-admin/create/subproject/domains', body);
  }

  /** POST /api/subproject-admin/create/subproject/layout */
  async createSubprojectLayout(body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>('/api/subproject-admin/create/subproject/layout', body);
  }

  /** POST /api/subproject-admin/create/subproject/seo */
  async createSubprojectSeo(body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>('/api/subproject-admin/create/subproject/seo', body);
  }

  /** POST /api/subproject-admin/create/subproject/team */
  async createSubprojectTeam(body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>('/api/subproject-admin/create/subproject/team', body);
  }

  /** POST /api/subproject-admin/create/subproject/template */
  async createSubprojectTemplate(body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>('/api/subproject-admin/create/subproject/template', body);
  }

  // ===========================================================================
  // Subproject misc
  // ===========================================================================

  /** POST /api/subproject-search */
  async searchSubprojects(body: SubprojectSearchRequest): Promise<ApiResponse<SubprojectListItem[]>> {
    return this.post<SubprojectListItem[]>('/api/subproject-search', body);
  }

  /** GET /api/subproject-settings */
  async getSubprojectSettings(): Promise<ApiResponse<EmptyOk>> {
    return this.get<EmptyOk>('/api/subproject-settings');
  }

  /** GET /api/subproject-types */
  async getSubprojectTypes(): Promise<ApiResponse<EmptyOk[]>> {
    return this.get<EmptyOk[]>('/api/subproject-types');
  }

  // ===========================================================================
  // Subproject team
  // ===========================================================================

  /** DELETE /api/subproject-team/delete-invite/{id}/{subproject?} */
  async deleteSubprojectTeamInvite(
    id: number | string,
    subproject?: number | string,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.delete<EmptyOk>(
      `/api/subproject-team/delete-invite/${encodeURIComponent(String(id))}${tail(subproject)}`,
    );
  }

  /** GET /api/subproject-team/get-invites/{subproject?} */
  async getSubprojectTeamInvites(
    subproject?: number | string,
  ): Promise<ApiResponse<EmptyOk[]>> {
    return this.get<EmptyOk[]>(`/api/subproject-team/get-invites${tail(subproject)}`);
  }

  /** POST /api/subproject-team/renew-token/{subproject?} */
  async renewSubprojectTeamToken(
    subprojectOrBody: number | string | Record<string, unknown>,
    body?: Record<string, unknown>,
  ): Promise<ApiResponse<EmptyOk>> {
    // Two call shapes supported: (subproject, body) or (body) without
    // subproject. The first positional is the optional path param.
    const isPathFirst =
      typeof subprojectOrBody === 'number' ||
      typeof subprojectOrBody === 'string';
    const subproject = isPathFirst ? (subprojectOrBody as number | string) : undefined;
    const payload = isPathFirst ? (body ?? {}) : (subprojectOrBody as Record<string, unknown>);
    return this.post<EmptyOk>(
      `/api/subproject-team/renew-token${tail(subproject)}`,
      payload,
    );
  }

  /** POST /api/subproject-team/send-invites/{subproject?} */
  async sendSubprojectTeamInvites(
    subprojectOrBody: number | string | SubprojectSendInvitesRequest,
    body?: SubprojectSendInvitesRequest,
  ): Promise<ApiResponse<EmptyOk>> {
    const isPathFirst =
      typeof subprojectOrBody === 'number' ||
      typeof subprojectOrBody === 'string';
    const subproject = isPathFirst ? (subprojectOrBody as number | string) : undefined;
    const payload: SubprojectSendInvitesRequest = isPathFirst
      ? (body ?? {})
      : (subprojectOrBody as SubprojectSendInvitesRequest);
    return this.post<EmptyOk>(
      `/api/subproject-team/send-invites${tail(subproject)}`,
      payload,
    );
  }

  /** POST /api/subproject-team/update-permissions/{subproject?} */
  async updateSubprojectTeamPermissions(
    subprojectOrBody: number | string | SubprojectUpdatePermissionsRequest,
    body?: SubprojectUpdatePermissionsRequest,
  ): Promise<ApiResponse<EmptyOk>> {
    const isPathFirst =
      typeof subprojectOrBody === 'number' ||
      typeof subprojectOrBody === 'string';
    const subproject = isPathFirst ? (subprojectOrBody as number | string) : undefined;
    const payload: SubprojectUpdatePermissionsRequest = isPathFirst
      ? (body ?? {})
      : (subprojectOrBody as SubprojectUpdatePermissionsRequest);
    return this.post<EmptyOk>(
      `/api/subproject-team/update-permissions${tail(subproject)}`,
      payload,
    );
  }

  // ===========================================================================
  // Subproject wizard
  // ===========================================================================

  /** POST /api/subproject-wizard/content/{id} */
  async saveSubprojectWizardContent(
    id: number | string,
    body: SubprojectSectionPayload,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>(
      `/api/subproject-wizard/content/${encodeURIComponent(String(id))}`,
      body,
    );
  }

  /** GET /api/subproject-wizard/creation-started */
  async getSubprojectWizardCreationStarted(): Promise<ApiResponse<EmptyOk>> {
    return this.get<EmptyOk>('/api/subproject-wizard/creation-started');
  }

  /** POST /api/subproject-wizard/domains/{id} */
  async saveSubprojectWizardDomains(
    id: number | string,
    body: SubprojectSectionPayload,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>(
      `/api/subproject-wizard/domains/${encodeURIComponent(String(id))}`,
      body,
    );
  }

  /** GET /api/subproject-wizard/get */
  async getSubprojectWizard(): Promise<ApiResponse<EmptyOk>> {
    return this.get<EmptyOk>('/api/subproject-wizard/get');
  }

  /** POST /api/subproject-wizard/layout/{id} */
  async saveSubprojectWizardLayout(
    id: number | string,
    body: SubprojectSectionPayload,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>(
      `/api/subproject-wizard/layout/${encodeURIComponent(String(id))}`,
      body,
    );
  }

  /** POST /api/subproject-wizard/seo/{id} */
  async saveSubprojectWizardSeo(
    id: number | string,
    body: SubprojectSectionPayload,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>(
      `/api/subproject-wizard/seo/${encodeURIComponent(String(id))}`,
      body,
    );
  }

  /** POST /api/subproject-wizard/team/{id} */
  async saveSubprojectWizardTeam(
    id: number | string,
    body: SubprojectSectionPayload,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>(
      `/api/subproject-wizard/team/${encodeURIComponent(String(id))}`,
      body,
    );
  }

  /** POST /api/subproject-wizard/template/{id} */
  async saveSubprojectWizardTemplate(
    id: number | string,
    body: SubprojectSectionPayload,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>(
      `/api/subproject-wizard/template/${encodeURIComponent(String(id))}`,
      body,
    );
  }

  // ===========================================================================
  // Project settings (the live, post-creation domain settings UI)
  // ===========================================================================

  /** GET /api/project-settings/content/show/{subproject?} */
  async getProjectSettingsContent(subproject?: number | string): Promise<ApiResponse<EmptyOk>> {
    return this.get<EmptyOk>(`/api/project-settings/content/show${tail(subproject)}`);
  }

  /** POST /api/project-settings/content/{subproject?} */
  async saveProjectSettingsContent(
    subprojectOrBody: number | string | SubprojectSectionPayload,
    body?: SubprojectSectionPayload,
  ): Promise<ApiResponse<EmptyOk>> {
    const isPathFirst =
      typeof subprojectOrBody === 'number' ||
      typeof subprojectOrBody === 'string';
    const subproject = isPathFirst ? (subprojectOrBody as number | string) : undefined;
    const payload: SubprojectSectionPayload = isPathFirst
      ? (body ?? {})
      : (subprojectOrBody as SubprojectSectionPayload);
    return this.post<EmptyOk>(
      `/api/project-settings/content${tail(subproject)}`,
      payload,
    );
  }

  /** GET /api/project-settings/domain-settings/{subproject?} */
  async getProjectSettingsDomainSettings(
    subproject?: number | string,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.get<EmptyOk>(`/api/project-settings/domain-settings${tail(subproject)}`);
  }

  /** GET /api/project-settings/domains/show/{subproject?} */
  async getProjectSettingsDomains(subproject?: number | string): Promise<ApiResponse<EmptyOk>> {
    return this.get<EmptyOk>(`/api/project-settings/domains/show${tail(subproject)}`);
  }

  /** POST /api/project-settings/domains/{subproject?} */
  async saveProjectSettingsDomains(
    subprojectOrBody: number | string | SubprojectSectionPayload,
    body?: SubprojectSectionPayload,
  ): Promise<ApiResponse<EmptyOk>> {
    const isPathFirst =
      typeof subprojectOrBody === 'number' ||
      typeof subprojectOrBody === 'string';
    const subproject = isPathFirst ? (subprojectOrBody as number | string) : undefined;
    const payload: SubprojectSectionPayload = isPathFirst
      ? (body ?? {})
      : (subprojectOrBody as SubprojectSectionPayload);
    return this.post<EmptyOk>(
      `/api/project-settings/domains${tail(subproject)}`,
      payload,
    );
  }

  /** GET /api/project-settings/layout/show/{subproject?} */
  async getProjectSettingsLayout(subproject?: number | string): Promise<ApiResponse<EmptyOk>> {
    return this.get<EmptyOk>(`/api/project-settings/layout/show${tail(subproject)}`);
  }

  /** POST /api/project-settings/layout/{subproject?} */
  async saveProjectSettingsLayout(
    subprojectOrBody: number | string | SubprojectSectionPayload,
    body?: SubprojectSectionPayload,
  ): Promise<ApiResponse<EmptyOk>> {
    const isPathFirst =
      typeof subprojectOrBody === 'number' ||
      typeof subprojectOrBody === 'string';
    const subproject = isPathFirst ? (subprojectOrBody as number | string) : undefined;
    const payload: SubprojectSectionPayload = isPathFirst
      ? (body ?? {})
      : (subprojectOrBody as SubprojectSectionPayload);
    return this.post<EmptyOk>(
      `/api/project-settings/layout${tail(subproject)}`,
      payload,
    );
  }

  /** GET /api/project-settings/seo/show/{subproject?} */
  async getProjectSettingsSeo(subproject?: number | string): Promise<ApiResponse<EmptyOk>> {
    return this.get<EmptyOk>(`/api/project-settings/seo/show${tail(subproject)}`);
  }

  /** POST /api/project-settings/seo/{subproject?} */
  async saveProjectSettingsSeo(
    subprojectOrBody: number | string | SubprojectSectionPayload,
    body?: SubprojectSectionPayload,
  ): Promise<ApiResponse<EmptyOk>> {
    const isPathFirst =
      typeof subprojectOrBody === 'number' ||
      typeof subprojectOrBody === 'string';
    const subproject = isPathFirst ? (subprojectOrBody as number | string) : undefined;
    const payload: SubprojectSectionPayload = isPathFirst
      ? (body ?? {})
      : (subprojectOrBody as SubprojectSectionPayload);
    return this.post<EmptyOk>(`/api/project-settings/seo${tail(subproject)}`, payload);
  }

  /** GET /api/project-settings/template/show/{subproject?} */
  async getProjectSettingsTemplate(subproject?: number | string): Promise<ApiResponse<EmptyOk>> {
    return this.get<EmptyOk>(`/api/project-settings/template/show${tail(subproject)}`);
  }

  /** POST /api/project-settings/template/{subproject?} */
  async saveProjectSettingsTemplate(
    subprojectOrBody: number | string | SubprojectSectionPayload,
    body?: SubprojectSectionPayload,
  ): Promise<ApiResponse<EmptyOk>> {
    const isPathFirst =
      typeof subprojectOrBody === 'number' ||
      typeof subprojectOrBody === 'string';
    const subproject = isPathFirst ? (subprojectOrBody as number | string) : undefined;
    const payload: SubprojectSectionPayload = isPathFirst
      ? (body ?? {})
      : (subprojectOrBody as SubprojectSectionPayload);
    return this.post<EmptyOk>(
      `/api/project-settings/template${tail(subproject)}`,
      payload,
    );
  }

  // ===========================================================================
  // Tenant claim
  // ===========================================================================

  /** POST /api/tenant-claim/complete */
  async completeTenantClaim(
    body: CompleteTenantClaimRequest,
  ): Promise<ApiResponse<TenantClaimStatusData>> {
    return this.post<TenantClaimStatusData>('/api/tenant-claim/complete', body);
  }

  /** GET /api/tenant-claim/details/{id} */
  async getTenantClaimDetails(id: number | string): Promise<ApiResponse<TenantClaimData>> {
    return this.get<TenantClaimData>(
      `/api/tenant-claim/details/${encodeURIComponent(String(id))}`,
    );
  }

  /** POST /api/tenant-claim/initiate */
  async initiateTenantClaim(
    body: InitiateTenantClaimRequest,
  ): Promise<ApiResponse<TenantClaimData>> {
    return this.post<TenantClaimData>('/api/tenant-claim/initiate', body);
  }

  /** GET /api/tenant-claim/my-claim */
  async getMyTenantClaim(): Promise<ApiResponse<TenantClaimData | null>> {
    return this.get<TenantClaimData | null>('/api/tenant-claim/my-claim');
  }

  /** GET /api/tenant-claim/search */
  async searchTenantClaims(
    params?: { q?: string; [k: string]: unknown },
  ): Promise<ApiResponse<TenantClaimSearchItem[]>> {
    return this.get<TenantClaimSearchItem[]>('/api/tenant-claim/search', params as any);
  }

  /** GET /api/tenant-claim/status/{token} */
  async getTenantClaimStatus(token: string): Promise<ApiResponse<TenantClaimStatusData>> {
    return this.get<TenantClaimStatusData>(
      `/api/tenant-claim/status/${encodeURIComponent(token)}`,
    );
  }

  /**
   * POST /api/tenant-claim/verify (multipart/form-data; KYC docs).
   * `BaseApiClient.post` automatically switches to FormData when the body
   * carries a `Blob` / `File`.
   */
  async verifyTenantClaim(
    body: VerifyTenantClaimRequest,
  ): Promise<ApiResponse<TenantClaimStatusData>> {
    return this.post<TenantClaimStatusData>('/api/tenant-claim/verify', body);
  }

  // ===========================================================================
  // Tenant interface graph
  // ===========================================================================

  /** GET /api/tenant-interface-block/by-page/{page_id} */
  async getTenantInterfaceBlocksByPage(
    pageId: number | string,
  ): Promise<ApiResponse<TenantInterfaceBlockItem[]>> {
    return this.get<TenantInterfaceBlockItem[]>(
      `/api/tenant-interface-block/by-page/${encodeURIComponent(String(pageId))}`,
    );
  }

  /** GET /api/tenant-interface-page/all/{interface_id} */
  async getTenantInterfacePagesAll(
    interfaceId: number | string,
  ): Promise<ApiResponse<TenantInterfacePageItem[]>> {
    return this.get<TenantInterfacePageItem[]>(
      `/api/tenant-interface-page/all/${encodeURIComponent(String(interfaceId))}`,
    );
  }

  /** GET /api/tenant-interface-page/interface/{interface_id} */
  async getTenantInterfacePagesByInterface(
    interfaceId: number | string,
  ): Promise<ApiResponse<TenantInterfacePageItem[]>> {
    return this.get<TenantInterfacePageItem[]>(
      `/api/tenant-interface-page/interface/${encodeURIComponent(String(interfaceId))}`,
    );
  }

  /** GET /api/tenant-interface/all */
  async getTenantInterfacesAll(): Promise<ApiResponse<TenantInterfaceItem[]>> {
    return this.get<TenantInterfaceItem[]>('/api/tenant-interface/all');
  }

  /** GET /api/tenant-registration/fees (public). */
  async getTenantRegistrationFees(): Promise<ApiResponse<TenantRegistrationFee[]>> {
    return this.get<TenantRegistrationFee[]>(
      '/api/tenant-registration/fees',
      undefined,
      { auth: false },
    );
  }

  // ===========================================================================
  // Domain interfaces
  // ===========================================================================

  /** GET /api/domain-interfaces */
  async listDomainInterfaces(): Promise<ApiResponse<DomainInterface[]>> {
    return this.get<DomainInterface[]>('/api/domain-interfaces');
  }

  /** POST /api/domain-interfaces */
  async createDomainInterface(
    body: CreateDomainInterfaceRequest,
  ): Promise<ApiResponse<DomainInterface>> {
    return this.post<DomainInterface>('/api/domain-interfaces', body);
  }

  /** GET /api/domain-interfaces/by-domain/{domain} */
  async getDomainInterfaceByDomain(domain: string): Promise<ApiResponse<DomainInterface>> {
    return this.get<DomainInterface>(
      `/api/domain-interfaces/by-domain/${encodeURIComponent(domain)}`,
    );
  }

  /** GET /api/domain-interfaces/{id} */
  async getDomainInterface(id: number | string): Promise<ApiResponse<DomainInterface>> {
    return this.get<DomainInterface>(
      `/api/domain-interfaces/${encodeURIComponent(String(id))}`,
    );
  }

  /** PATCH /api/domain-interfaces/{id} (rewritten as POST?_method=PATCH). */
  async patchDomainInterface(
    id: number | string,
    body: UpdateDomainInterfaceRequest,
  ): Promise<ApiResponse<DomainInterface>> {
    return this.patch<DomainInterface>(
      `/api/domain-interfaces/${encodeURIComponent(String(id))}`,
      body,
    );
  }

  /** DELETE /api/domain-interfaces/{id} */
  async deleteDomainInterface(id: number | string): Promise<ApiResponse<EmptyOk>> {
    return this.delete<EmptyOk>(
      `/api/domain-interfaces/${encodeURIComponent(String(id))}`,
    );
  }

  // ===========================================================================
  // World locations / public country directory
  // ===========================================================================

  /** POST /api/world-locations/city */
  async createWorldLocationCity(
    body: CreateWorldLocationCityRequest,
  ): Promise<ApiResponse<WorldLocationCity>> {
    return this.post<WorldLocationCity>('/api/world-locations/city', body);
  }

  /** GET /api/world-locations/city/{city} */
  async getWorldLocationCity(city: number | string): Promise<ApiResponse<WorldLocationCity>> {
    return this.get<WorldLocationCity>(
      `/api/world-locations/city/${encodeURIComponent(String(city))}`,
    );
  }

  /** POST /api/world-locations/country */
  async createWorldLocationCountry(
    body: CreateWorldLocationCountryRequest,
  ): Promise<ApiResponse<WorldLocationCountry>> {
    return this.post<WorldLocationCountry>('/api/world-locations/country', body);
  }

  /** GET /api/world-locations/country/{country} */
  async getWorldLocationCountry(
    country: number | string,
  ): Promise<ApiResponse<WorldLocationCountry>> {
    return this.get<WorldLocationCountry>(
      `/api/world-locations/country/${encodeURIComponent(String(country))}`,
    );
  }

  /** POST /api/world-locations/state */
  async createWorldLocationState(
    body: CreateWorldLocationStateRequest,
  ): Promise<ApiResponse<WorldLocationState>> {
    return this.post<WorldLocationState>('/api/world-locations/state', body);
  }

  /** GET /api/world-locations/state/{state} */
  async getWorldLocationState(state: number | string): Promise<ApiResponse<WorldLocationState>> {
    return this.get<WorldLocationState>(
      `/api/world-locations/state/${encodeURIComponent(String(state))}`,
    );
  }

  /** GET /api/public/countries/{country} (public). */
  async getPublicCountry(country: string): Promise<ApiResponse<PublicCountryData>> {
    return this.get<PublicCountryData>(
      `/api/public/countries/${encodeURIComponent(country)}`,
      undefined,
      { auth: false },
    );
  }

  /** GET /api/public/countries/find-allowed (public). */
  async getPublicAllowedCountries(): Promise<ApiResponse<PublicCountryData[]>> {
    return this.get<PublicCountryData[]>(
      '/api/public/countries/find-allowed',
      undefined,
      { auth: false },
    );
  }

  // ===========================================================================
  // Gov directory (all public)
  // ===========================================================================

  /** GET /api/gov/agency-footer */
  async getGovAgencyFooter(): Promise<ApiResponse<GovDirectoryItem[]>> {
    return this.get<GovDirectoryItem[]>('/api/gov/agency-footer', undefined, { auth: false });
  }

  /** GET /api/gov/cities */
  async getGovCities(): Promise<ApiResponse<GovDirectoryItem[]>> {
    return this.get<GovDirectoryItem[]>('/api/gov/cities', undefined, { auth: false });
  }

  /** GET /api/gov/city-agencies */
  async getGovCityAgencies(): Promise<ApiResponse<GovDirectoryItem[]>> {
    return this.get<GovDirectoryItem[]>('/api/gov/city-agencies', undefined, { auth: false });
  }

  /** GET /api/gov/federal-directory */
  async getGovFederalDirectory(): Promise<ApiResponse<GovDirectoryItem[]>> {
    return this.get<GovDirectoryItem[]>(
      '/api/gov/federal-directory',
      undefined,
      { auth: false },
    );
  }

  /** GET /api/gov/states */
  async getGovStates(): Promise<ApiResponse<GovDirectoryItem[]>> {
    return this.get<GovDirectoryItem[]>('/api/gov/states', undefined, { auth: false });
  }

  /** GET /api/gov/subprojects */
  async getGovSubprojects(): Promise<ApiResponse<GovDirectoryItem[]>> {
    return this.get<GovDirectoryItem[]>('/api/gov/subprojects', undefined, { auth: false });
  }

  /** GET /api/gov/subprojects/by-domain */
  async getGovSubprojectByDomain(): Promise<ApiResponse<GovDirectoryItem>> {
    return this.get<GovDirectoryItem>(
      '/api/gov/subprojects/by-domain',
      undefined,
      { auth: false },
    );
  }

  // ===========================================================================
  // Frontend + SEO pages
  // ===========================================================================

  /** GET /api/frontend/get-frontend */
  async getFrontend(): Promise<ApiResponse<FrontendData>> {
    return this.get<FrontendData>('/api/frontend/get-frontend');
  }

  /** PUT /api/frontend/save-frontend (rewritten as POST?_method=PUT). */
  async saveFrontend(body: SaveFrontendRequest): Promise<ApiResponse<EmptyOk>> {
    return this.put<EmptyOk>('/api/frontend/save-frontend', body);
  }

  /** GET /api/seo-page (paginated) */
  async listSeoPages(): Promise<ApiResponse<PaginatedPayload<SeoPageData>>> {
    return this.get<PaginatedPayload<SeoPageData>>('/api/seo-page');
  }

  /** POST /api/seo-page */
  async createSeoPage(body: CreateSeoPageRequest): Promise<ApiResponse<SeoPageData>> {
    return this.post<SeoPageData>('/api/seo-page', body);
  }

  /** DELETE /api/seo-page/item/{seoPageItem} */
  async deleteSeoPageItem(seoPageItem: number | string): Promise<ApiResponse<EmptyOk>> {
    return this.delete<EmptyOk>(
      `/api/seo-page/item/${encodeURIComponent(String(seoPageItem))}`,
    );
  }

  /** GET /api/seo-page/{seo_page} */
  async getSeoPage(seoPage: number | string): Promise<ApiResponse<SeoPageData>> {
    return this.get<SeoPageData>(`/api/seo-page/${encodeURIComponent(String(seoPage))}`);
  }

  /** PUT /api/seo-page/{seo_page} */
  async updateSeoPage(
    seoPage: number | string,
    body: UpdateSeoPageRequest,
  ): Promise<ApiResponse<SeoPageData>> {
    return this.put<SeoPageData>(
      `/api/seo-page/${encodeURIComponent(String(seoPage))}`,
      body,
    );
  }

  /** DELETE /api/seo-page/{seo_page} */
  async deleteSeoPage(seoPage: number | string): Promise<ApiResponse<EmptyOk>> {
    return this.delete<EmptyOk>(`/api/seo-page/${encodeURIComponent(String(seoPage))}`);
  }

  // ===========================================================================
  // Creator + featured (gov-side admin)
  // ===========================================================================

  /** GET /api/creator */
  async listCreators(): Promise<ApiResponse<CreatorData[]>> {
    return this.get<CreatorData[]>('/api/creator');
  }

  /** POST /api/creator */
  async createCreator(body: CreateCreatorRequest): Promise<ApiResponse<CreatorData>> {
    return this.post<CreatorData>('/api/creator', body);
  }

  /** GET /api/creator/{creator} */
  async getCreator(creator: number | string): Promise<ApiResponse<CreatorData>> {
    return this.get<CreatorData>(`/api/creator/${encodeURIComponent(String(creator))}`);
  }

  /** PUT /api/creator/{creator} */
  async updateCreator(
    creator: number | string,
    body: UpdateCreatorRequest,
  ): Promise<ApiResponse<CreatorData>> {
    return this.put<CreatorData>(
      `/api/creator/${encodeURIComponent(String(creator))}`,
      body,
    );
  }

  /** DELETE /api/creator/{creator} */
  async deleteCreator(creator: number | string): Promise<ApiResponse<EmptyOk>> {
    return this.delete<EmptyOk>(`/api/creator/${encodeURIComponent(String(creator))}`);
  }

  /** GET /api/creator-activity */
  async listCreatorActivity(): Promise<ApiResponse<CreatorActivityData[]>> {
    return this.get<CreatorActivityData[]>('/api/creator-activity');
  }

  /** POST /api/creator-activity */
  async createCreatorActivity(
    body: Record<string, unknown>,
  ): Promise<ApiResponse<CreatorActivityData>> {
    return this.post<CreatorActivityData>('/api/creator-activity', body);
  }

  /** GET /api/creator-activity/{creator_activity} */
  async getCreatorActivity(
    creatorActivity: number | string,
  ): Promise<ApiResponse<CreatorActivityData>> {
    return this.get<CreatorActivityData>(
      `/api/creator-activity/${encodeURIComponent(String(creatorActivity))}`,
    );
  }

  /** PUT /api/creator-activity/{creator_activity} */
  async updateCreatorActivity(
    creatorActivity: number | string,
    body: Record<string, unknown>,
  ): Promise<ApiResponse<CreatorActivityData>> {
    return this.put<CreatorActivityData>(
      `/api/creator-activity/${encodeURIComponent(String(creatorActivity))}`,
      body,
    );
  }

  /** DELETE /api/creator-activity/{creator_activity} */
  async deleteCreatorActivity(creatorActivity: number | string): Promise<ApiResponse<EmptyOk>> {
    return this.delete<EmptyOk>(
      `/api/creator-activity/${encodeURIComponent(String(creatorActivity))}`,
    );
  }

  /** GET /api/creator-request */
  async listCreatorRequests(): Promise<ApiResponse<CreatorRequestData[]>> {
    return this.get<CreatorRequestData[]>('/api/creator-request');
  }

  /** POST /api/creator-request */
  async createCreatorRequest(
    body: Record<string, unknown>,
  ): Promise<ApiResponse<CreatorRequestData>> {
    return this.post<CreatorRequestData>('/api/creator-request', body);
  }

  /** GET /api/creator-request/status */
  async getCreatorRequestStatus(): Promise<ApiResponse<EmptyOk>> {
    return this.get<EmptyOk>('/api/creator-request/status');
  }

  /** GET /api/creator-request/{creator_request} */
  async getCreatorRequest(
    creatorRequest: number | string,
  ): Promise<ApiResponse<CreatorRequestData>> {
    return this.get<CreatorRequestData>(
      `/api/creator-request/${encodeURIComponent(String(creatorRequest))}`,
    );
  }

  /** PUT /api/creator-request/{creator_request} */
  async updateCreatorRequest(
    creatorRequest: number | string,
    body: Record<string, unknown>,
  ): Promise<ApiResponse<CreatorRequestData>> {
    return this.put<CreatorRequestData>(
      `/api/creator-request/${encodeURIComponent(String(creatorRequest))}`,
      body,
    );
  }

  /** DELETE /api/creator-request/{creator_request} */
  async deleteCreatorRequest(creatorRequest: number | string): Promise<ApiResponse<EmptyOk>> {
    return this.delete<EmptyOk>(
      `/api/creator-request/${encodeURIComponent(String(creatorRequest))}`,
    );
  }

  /** POST /api/featured/creators */
  async saveFeaturedCreators(
    body: SaveFeaturedCreatorsRequest,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>('/api/featured/creators', body);
  }

  /** POST /api/featured/programs */
  async saveFeaturedPrograms(
    body: SaveFeaturedProgramsRequest,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>('/api/featured/programs', body);
  }

  // ===========================================================================
  // Contacts
  // ===========================================================================

  /** DELETE /api/contacts/delete/{contact} */
  async deleteContact(contact: number | string): Promise<ApiResponse<EmptyOk>> {
    return this.delete<EmptyOk>(`/api/contacts/delete/${encodeURIComponent(String(contact))}`);
  }

  /** POST /api/contacts/find/{subproject?} */
  async findContacts(
    body: FindContactsRequest,
    subproject?: number | string,
  ): Promise<ApiResponse<ContactData[]>> {
    return this.post<ContactData[]>(`/api/contacts/find${tail(subproject)}`, body);
  }

  /** GET /api/contacts/has-contacts */
  async getContactsHasContacts(): Promise<ApiResponse<EmptyOk>> {
    return this.get<EmptyOk>('/api/contacts/has-contacts');
  }

  /** POST /api/contacts/import */
  async importContacts(body: ImportContactsRequest): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>('/api/contacts/import', body);
  }

  /** POST /api/contacts/list */
  async listContacts(body: ListContactsRequest): Promise<ApiResponse<ContactData[]>> {
    return this.post<ContactData[]>('/api/contacts/list', body);
  }

  /** GET /api/contacts/running-import */
  async getContactsRunningImport(): Promise<ApiResponse<EmptyOk>> {
    return this.get<EmptyOk>('/api/contacts/running-import');
  }

  /** POST /api/contacts/save */
  async saveContact(body: SaveContactRequest): Promise<ApiResponse<ContactData>> {
    return this.post<ContactData>('/api/contacts/save', body);
  }

  // ===========================================================================
  // Documentation
  // ===========================================================================

  /** GET /api/documentation */
  async listDocumentation(): Promise<ApiResponse<DocumentationItem[]>> {
    return this.get<DocumentationItem[]>('/api/documentation');
  }

  /** POST /api/documentation */
  async createDocumentation(
    body: CreateDocumentationRequest,
  ): Promise<ApiResponse<DocumentationItem>> {
    return this.post<DocumentationItem>('/api/documentation', body);
  }

  /** GET /api/documentation/{documentation} */
  async getDocumentation(
    documentation: number | string,
  ): Promise<ApiResponse<DocumentationItem>> {
    return this.get<DocumentationItem>(
      `/api/documentation/${encodeURIComponent(String(documentation))}`,
    );
  }

  /** PUT /api/documentation/{documentation} */
  async updateDocumentation(
    documentation: number | string,
    body: UpdateDocumentationRequest,
  ): Promise<ApiResponse<DocumentationItem>> {
    return this.put<DocumentationItem>(
      `/api/documentation/${encodeURIComponent(String(documentation))}`,
      body,
    );
  }

  /** DELETE /api/documentation/{documentation} */
  async deleteDocumentation(documentation: number | string): Promise<ApiResponse<EmptyOk>> {
    return this.delete<EmptyOk>(
      `/api/documentation/${encodeURIComponent(String(documentation))}`,
    );
  }
}
