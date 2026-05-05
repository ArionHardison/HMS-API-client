/**
 * Tenancy + Subproject + Domain slice — request / response types.
 *
 * Source of truth: `sdk/spec/endpoints.json`. Each interface mirrors the
 * `request.shape` or `response.shape` of one or more endpoints. `unknown`
 * preserves the spec's "shape unknown" cases (Laravel Resource
 * `parent::toArray($request)`, scraped `request->input('x')` keys, etc.).
 *
 * Structural interfaces only — no branded type aliases.
 */

// =============================================================================
// Boot-data resources (CI-WWW)
// =============================================================================

/** GET /api/load → `SubprojectClientDataResource`. */
export interface SubprojectClientData {
  id: number;
  name: unknown;
  style: unknown;
  domain: unknown;
  special_style: unknown;
  font_color: unknown;
  title: unknown;
  description: unknown;
  tagline: unknown;
  first_principles: unknown;
  keywords: unknown;
  background_type: unknown;
  background_value: unknown;
  logo: unknown;
  icon: unknown;
  classification: unknown;
  acronym: unknown;
  country_id: number;
  country: unknown;
  state_id: number;
  state: unknown;
  city_id: number;
  primary_color: unknown;
  buttons_font_color: unknown;
  danger_color: unknown;
  warning_color: unknown;
  success_color: unknown;
  info_color: unknown;
  background_color: unknown;
  disabled_color: unknown;
  link_color: unknown;
  meta: unknown;
  type: unknown;
  content: unknown;
  extra: unknown;
  slug: unknown;
  placeholders: unknown;
}

/**
 * `loadTenant()` returns a discriminated union: either a `200 OK` envelope
 * carrying `SubprojectClientData`, or a `404 Not Found` indicator (CI-WWW
 * has to render a "tenant not found" page without throwing). The 404 branch
 * preserves the parsed envelope verbatim when the API supplies one.
 */
export type LoadTenantResult =
  | { status: 200; ok: true; data: SubprojectClientData }
  | { status: 404; ok: false; data: null };

/** GET /api/board → `SubprojectDashboardDefaultDataResource`. */
export interface SubprojectDashboardDefaultData {
  created: unknown;
  is_sub: boolean;
  title: unknown;
  description: unknown;
  keywords: unknown;
  meta: unknown;
  logo: unknown;
  icon: unknown;
  name: unknown;
  colors: unknown;
  font: unknown;
  buttons_font: unknown;
  primary: unknown;
  info: unknown;
  danger: unknown;
  warning: unknown;
  success: unknown;
  background: unknown;
  disabled: unknown;
  link: unknown;
}

/** GET /api/leader → `SubprojectLeaderResource`. */
export interface SubprojectLeaderData {
  id: number;
  username: unknown;
  full_name: unknown;
  profile_picture: unknown;
  description: unknown;
  title: unknown;
  location: unknown;
  party: unknown;
}

/** GET /api/interface/load-interface → `SubprojectInterfaceDataResource`. Shape unknown. */
export interface SubprojectInterfaceData {
  [key: string]: unknown;
}

// =============================================================================
// Subproject CRUD + admin / wizard surface
// =============================================================================

/** GET /api/subproject → `SubprojectsResource` (paginated). */
export interface SubprojectListItem {
  id: number;
  name: unknown;
  domain: unknown;
  logo: unknown;
  team_count: number;
  latest_team_member: unknown;
  latest_team_members: unknown;
}

/** GET /api/subproject/{subproject} → `SubprojectResource`. Shape unknown. */
export interface SubprojectDetailData {
  [key: string]: unknown;
}

/** POST /api/subproject-admin/create-account body. */
export interface RegisterSubprojectAdministratorRequest {
  timezone: string;
  full_name: string;
  country_id?: unknown;
  login: string;
  email?: unknown;
  phone?: number | null;
  password: string;
  agreed: boolean;
  registration_type?: unknown;
}

/** POST /api/subproject-admin/login body. */
export interface SubprojectAdminLoginRequest {
  login: string;
  password: string;
  remember?: boolean;
}

/** POST /api/subproject-admin/confirm-account body. */
export interface ConfirmSubprojectAdminAccountRequest {
  code?: string;
  token?: string;
  [key: string]: unknown;
}

/** POST /api/subproject-admin/find-claimable body. */
export interface FindClaimableSubprojectRequest {
  domain?: string;
  q?: string;
  [key: string]: unknown;
}

/** POST /api/subproject-admin/subproject/has-contacts body. */
export interface SubprojectHasContactsRequest {
  subproject?: string | number;
  [key: string]: unknown;
}

/** POST /api/subproject-admin/start-claiming/{subproject}/claim body. */
export interface StartSubprojectClaimRequest {
  [key: string]: unknown;
}

/** POST /api/subproject-search body. */
export interface SubprojectSearchRequest {
  q?: string;
  filters?: Record<string, unknown>;
  [key: string]: unknown;
}

/** Subproject wizard / claim section payload — section bodies are open-shape. */
export interface SubprojectSectionPayload {
  [key: string]: unknown;
}

// Team section
/** POST /api/subproject-team/send-invites/{subproject?} body. */
export interface SubprojectSendInvitesRequest {
  emails?: string[];
  invites?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

/** POST /api/subproject-team/update-permissions/{subproject?} body. */
export interface SubprojectUpdatePermissionsRequest {
  user_id?: number;
  permissions?: string[];
  [key: string]: unknown;
}

// =============================================================================
// Tenant claim
// =============================================================================

/** POST /api/tenant-claim/initiate body. */
export interface InitiateTenantClaimRequest {
  tenant_id: string;
}

/** POST /api/tenant-claim/initiate response. */
export interface TenantClaimData {
  claim_token: unknown;
  tenant_id: number;
  status: unknown;
  verification_requirements: unknown;
  expires_at: string;
}

/** POST /api/tenant-claim/verify body — multipart (File or already-uploaded id string). */
export interface VerifyTenantClaimRequest {
  claim_token: string;
  id_front: File | Blob | string;
  id_back: File | Blob | string;
  business_registration: File | Blob | string;
  domain_proof: File | Blob | string;
}

/** POST /api/tenant-claim/complete body. */
export interface CompleteTenantClaimRequest {
  claim_token: string;
  [key: string]: unknown;
}

/** Generic tenant-claim status payload. */
export interface TenantClaimStatusData {
  [key: string]: unknown;
}

/** GET /api/tenant-claim/search response item. */
export interface TenantClaimSearchItem {
  [key: string]: unknown;
}

// =============================================================================
// Tenant interface / pages / blocks
// =============================================================================

export interface TenantInterfaceItem {
  [key: string]: unknown;
}

export interface TenantInterfacePageItem {
  [key: string]: unknown;
}

export interface TenantInterfaceBlockItem {
  [key: string]: unknown;
}

export interface TenantRegistrationFee {
  [key: string]: unknown;
}

// =============================================================================
// Domain interfaces
// =============================================================================

export interface DomainInterface {
  id?: number | string;
  domain?: string;
  [key: string]: unknown;
}

export interface CreateDomainInterfaceRequest {
  domain: string;
  [key: string]: unknown;
}

export interface UpdateDomainInterfaceRequest {
  domain?: string;
  [key: string]: unknown;
}

// =============================================================================
// World locations / public country directory
// =============================================================================

export interface WorldLocationCountry {
  id?: number;
  name?: unknown;
  [key: string]: unknown;
}

export interface WorldLocationState {
  id?: number;
  country_id?: number;
  name?: unknown;
  [key: string]: unknown;
}

export interface WorldLocationCity {
  id?: number;
  state_id?: number;
  name?: unknown;
  [key: string]: unknown;
}

export interface CreateWorldLocationCountryRequest {
  [key: string]: unknown;
}

export interface CreateWorldLocationStateRequest {
  country_id?: number;
  [key: string]: unknown;
}

export interface CreateWorldLocationCityRequest {
  state_id?: number;
  [key: string]: unknown;
}

export interface PublicCountryData {
  [key: string]: unknown;
}

// =============================================================================
// Gov directory
// =============================================================================

export interface GovDirectoryItem {
  [key: string]: unknown;
}

// =============================================================================
// Frontend / SEO pages
// =============================================================================

export interface FrontendData {
  [key: string]: unknown;
}

export interface SaveFrontendRequest {
  [key: string]: unknown;
}

/** SEO page DTO — no concrete shape from spec. */
export interface SeoPageData {
  [key: string]: unknown;
}

/** POST /api/seo-page body. */
export interface CreateSeoPageRequest {
  page: string;
  call: string;
  items: Array<Record<string, unknown>>;
}

/** PUT /api/seo-page/{seo_page} body. */
export interface UpdateSeoPageRequest {
  page?: string;
  call?: string;
  items?: Array<Record<string, unknown>>;
}

// =============================================================================
// Creator + creator-request + featured
// =============================================================================

export interface CreatorData {
  [key: string]: unknown;
}

export interface CreateCreatorRequest {
  [key: string]: unknown;
}

export interface UpdateCreatorRequest {
  [key: string]: unknown;
}

export interface CreatorActivityData {
  [key: string]: unknown;
}

export interface CreatorRequestData {
  [key: string]: unknown;
}

export interface SaveFeaturedCreatorsRequest {
  ids?: number[];
  [key: string]: unknown;
}

export interface SaveFeaturedProgramsRequest {
  ids?: number[];
  [key: string]: unknown;
}

// =============================================================================
// Contacts
// =============================================================================

export interface ContactData {
  [key: string]: unknown;
}

export interface FindContactsRequest {
  q?: string;
  filters?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ListContactsRequest {
  page?: number;
  per_page?: number;
  [key: string]: unknown;
}

export interface SaveContactRequest {
  [key: string]: unknown;
}

export interface ImportContactsRequest {
  contacts?: Array<Record<string, unknown>>;
  file?: File | Blob;
  [key: string]: unknown;
}

// =============================================================================
// Documentation
// =============================================================================

export interface DocumentationItem {
  [key: string]: unknown;
}

export interface CreateDocumentationRequest {
  [key: string]: unknown;
}

export interface UpdateDocumentationRequest {
  [key: string]: unknown;
}

// =============================================================================
// Public tenant assets / authenticate-at
// =============================================================================

export interface AuthenticateAtTenantData {
  [key: string]: unknown;
}

export interface PublicTenantLogoData {
  [key: string]: unknown;
}

// =============================================================================
// Generic envelope helpers (kept identical across slices)
// =============================================================================

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
