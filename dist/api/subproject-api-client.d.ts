/**
 * SubprojectApiClient — the hierarchy-aware successor to the legacy
 * `TenancyApiClient`. Tenants are flat siblings; subprojects inherit
 * from parents (per the long-standing memory rule). The rename is
 * semantic, not cosmetic.
 *
 * This class is the canonical multi-tenant boot + subproject lifecycle
 * client. It covers the same surface the old `TenancyApiClient`
 * covered:
 *
 *   - CI-WWW boot endpoints (/api/load, /api/board, /api/leader,
 *     /api/interface/load-interface, /api/authenticate-at/{tenant},
 *     /api/public/logo/{tenant})
 *   - Subproject CRUD + search
 *   - Subproject admin lifecycle (account, claim, create-greenfield)
 *   - Subproject team (invites + permissions)
 *   - Subproject wizard (live editing)
 *   - Project settings (live, post-creation domain settings UI)
 *   - Tenant claim
 *   - Tenant interface graph
 *   - Domain interfaces
 *   - World locations / public country directory
 *   - Gov directory (public)
 *   - Frontend + SEO pages
 *   - Creator + featured (gov-side admin)
 *   - Contacts
 *   - Documentation
 *
 * What's new (Lane A / CI-MFE#12):
 *
 *   - `loadSubproject()` (override) — same endpoint (GET /api/load),
 *     but the returned payload is normalized to the hierarchy-aware
 *     `Subproject` shape, with `parent_subproject_id` and `chain`
 *     guaranteed present (null + [] when api/ omits them).
 *
 *   - `getDpgInstances(id)` — GET /api/subprojects/{id}/dpg-instances.
 *     Returns the DPG bindings for a subproject, including the
 *     `inherited_from_subproject_id` field that attributes inherited
 *     bindings back to the ancestor that contributed them.
 *
 * Source-of-truth for the existing endpoint shapes:
 * `sdk/spec/endpoints.json`. Every method here mirrors one entry from
 * that spec; the `tenant`-prefixed Laravel routes (tenant-claim,
 * tenant-interface-*, tenant-registration) keep their on-the-wire
 * paths but the SDK exposes them via subproject-named methods where
 * the rename makes sense — see method JSDoc on each.
 *
 * The class extends `BaseApiClient`, which already handles Bearer
 * injection (skippable per call via `{ auth: false }`), `X-Domain`
 * header, PUT/PATCH → POST + `_method=`, FormData switching for
 * `File`/`Blob` payloads, and 401/422 callback dispatch.
 */
import { BaseApiClient, type ApiResponse } from '../api-client';
import type { AuthenticateAtTenantData, CompleteTenantClaimRequest, ConfirmSubprojectAdminAccountRequest, ContactData, CreateCreatorRequest, CreateDocumentationRequest, CreateDomainInterfaceRequest, CreateSeoPageRequest, CreateWorldLocationCityRequest, CreateWorldLocationCountryRequest, CreateWorldLocationStateRequest, CreatorActivityData, CreatorData, CreatorRequestData, DocumentationItem, DomainInterface, DomainInterfaceByDomainResponse, EmptyOk, FindClaimableSubprojectRequest, FindContactsRequest, FrontendData, GovDirectoryItem, ImportContactsRequest, InitiateTenantClaimRequest, ListContactsRequest, LoadSubprojectResult, PaginatedPayload, PublicCountryData, PublicTenantLogoData, RegisterSubprojectAdministratorRequest, SaveContactRequest, SaveFeaturedCreatorsRequest, SaveFeaturedProgramsRequest, SaveFrontendRequest, SeoPageData, StartSubprojectClaimRequest, SubprojectAdminLoginRequest, SubprojectClientData, SubprojectDashboardDefaultData, SubprojectDetailData, SubprojectHasContactsRequest, SubprojectInterfaceData, SubprojectLeaderData, SubprojectListItem, SubprojectSearchRequest, SubprojectSectionPayload, SubprojectSendInvitesRequest, SubprojectUpdatePermissionsRequest, TenantClaimData, TenantClaimSearchItem, TenantClaimStatusData, TenantInterfaceBlockItem, TenantInterfaceItem, TenantInterfacePageItem, TenantRegistrationFee, UpdateCreatorRequest, UpdateDocumentationRequest, UpdateDomainInterfaceRequest, UpdateSeoPageRequest, VerifyTenantClaimRequest, WorldLocationCity, WorldLocationCountry, WorldLocationState } from '../types/tenancy';
import type { DpgInstance, SubprojectLoadResponse } from '../types/subproject';
export type { DpgInstance, DpgInstanceMode, Subproject, SubprojectBaseInterface, SubprojectLoadResponse, } from '../types/subproject';
/**
 * Open-shape payload for `GET /api/v1/subprojects/current/system`. The
 * Systems module is still maturing its DPG-config response, so we don't
 * lock the shape; callers can cast through `unknown` to a stricter type
 * once the upstream spec stabilizes.
 */
export interface SubprojectSystemData {
    [key: string]: unknown;
}
export type { AuthenticateAtTenantData, CompleteTenantClaimRequest, ConfirmSubprojectAdminAccountRequest, ContactData, CreateCreatorRequest, CreateDocumentationRequest, CreateDomainInterfaceRequest, CreateSeoPageRequest, CreateWorldLocationCityRequest, CreateWorldLocationCountryRequest, CreateWorldLocationStateRequest, CreatorActivityData, CreatorData, CreatorRequestData, DocumentationItem, DomainInterface, DomainInterfaceByDomainResponse, EmptyOk, FindClaimableSubprojectRequest, FindContactsRequest, FrontendData, GovDirectoryItem, ImportContactsRequest, InitiateTenantClaimRequest, ListContactsRequest, LoadSubprojectResult, PaginatedPayload, PublicCountryData, PublicTenantLogoData, RegisterSubprojectAdministratorRequest, SaveContactRequest, SaveFeaturedCreatorsRequest, SaveFeaturedProgramsRequest, SaveFrontendRequest, SeoPageData, StartSubprojectClaimRequest, SubprojectAdminLoginRequest, SubprojectClientData, SubprojectDashboardDefaultData, SubprojectDetailData, SubprojectHasContactsRequest, SubprojectInterfaceData, SubprojectLeaderData, SubprojectListItem, SubprojectSearchRequest, SubprojectSectionPayload, SubprojectSendInvitesRequest, SubprojectUpdatePermissionsRequest, TenantClaimData, TenantClaimSearchItem, TenantClaimStatusData, TenantInterfaceBlockItem, TenantInterfaceItem, TenantInterfacePageItem, TenantRegistrationFee, UpdateCreatorRequest, UpdateDocumentationRequest, UpdateDomainInterfaceRequest, UpdateSeoPageRequest, VerifyTenantClaimRequest, WorldLocationCity, WorldLocationCountry, WorldLocationState, };
export declare class SubprojectApiClient extends BaseApiClient {
    /**
     * GET /api/load — load the active subproject's boot data, normalized
     * to the hierarchy-aware `Subproject` shape.
     *
     * Public endpoint (no Bearer required). Special-cased: 404 must NOT
     * throw — CI-WWW renders a "subproject not found" page from the
     * false branch. Returns a discriminated union so callers can switch
     * on `.ok`.
     *
     * Normalization (additive over the legacy `TenancyApiClient`
     * version):
     *
     *   - `parent_subproject_id` defaults to `null` when missing on the
     *     api/ payload.
     *   - `chain` defaults to `[]` when missing. The api/ side is
     *     expected to project this as a pre-flattened ancestor list,
     *     leaf -> root, EXCLUDING the leaf — see the Subproject type
     *     docs. Until the sibling api/ ticket lands, every leaf will
     *     just see `chain: []` and behave like a root, which is
     *     intentional: existing flat-subproject installs keep working
     *     without any api/ change.
     *
     * Discriminator is *presence of `data`*, not a `success` flag. The
     * Laravel side emits `{"data": {…}}` on hit (via JsonResource or
     * manual wrap for the apex root) and `{"error": "Subproject not
     * found"}` with no `data` field on miss.
     */
    loadSubproject(): Promise<SubprojectLoadResponse>;
    /**
     * @deprecated Use `loadSubproject()` — we don't have "tenants", we
     * have subprojects. Kept as an alias so existing callers in `app/`,
     * `gov/`, and `sys/` keep working until they migrate. Will be
     * removed in 2.0.0.
     */
    loadTenant(): Promise<SubprojectLoadResponse>;
    /** GET /api/board — public dashboard defaults. */
    loadBoard(): Promise<ApiResponse<SubprojectDashboardDefaultData>>;
    /** GET /api/leader — public leader info. */
    loadLeader(): Promise<ApiResponse<SubprojectLeaderData>>;
    /** GET /api/interface/load-interface — public interface payload. */
    loadInterface(): Promise<ApiResponse<SubprojectInterfaceData>>;
    /** GET /api/authenticate-at/{tenant} — auth=api. */
    authenticateAtTenant(tenant: string): Promise<ApiResponse<AuthenticateAtTenantData>>;
    /** GET /api/public/logo/{tenant} — public tenant logo. */
    getPublicTenantLogo(tenant: string): Promise<ApiResponse<PublicTenantLogoData>>;
    /**
     * GET /api/subprojects/{id}/dpg-instances — return the DPG bindings
     * for a specific subproject, including which ancestor (if any)
     * contributed each binding via inheritance.
     *
     * Auth: api guard (Bearer required). The endpoint is per-subproject
     * by id rather than X-Domain-resolved because the hierarchy view
     * intentionally allows reading across the inheritance chain (an
     * ancestor's bindings show up on the leaf with
     * `inherited_from_subproject_id` set to the ancestor's id).
     *
     * IMPORTANT: as of SDK 1.3.0 the matching api/ route does not yet
     * exist — `subproject_dpg_instances` is modeled in
     * `api/Modules/Systems/` (`SubprojectDpgInstance` entity +
     * migration), but only the X-Domain-scoped `GET
     * /api/v1/subprojects/current/system` reads it today. Sibling api/
     * work is required to:
     *
     *   1. Add `Route::get('subprojects/{id}/dpg-instances', ...)` under
     *      the `auth:api` middleware (api/Modules/Systems/Routes/api.php).
     *   2. Resolve `inherited_from_subproject_id` server-side by walking
     *      the `parent_project` chain and overlaying the leaf's own
     *      bindings on top of each ancestor's (leaf wins per system_key).
     *
     * Consumers can mock this route via MSW in the meantime — see
     * `src/api/__tests__/subproject.test.ts` for the contract.
     */
    getDpgInstances(id: number | string): Promise<ApiResponse<DpgInstance[]>>;
    /**
     * GET /api/v1/subprojects/current/system — read-only DPG / system
     * config for the X-Domain-resolved subproject. Public endpoint (no
     * Bearer required); the data exposed is non-sensitive (DNS-derived).
     * The Systems module owns this route on the backend — see
     * `api/Modules/Systems/Routes/api.php` and `SubprojectSystemsController`.
     *
     * Shape is left open (`SubprojectSystemData`) because the upstream
     * controller is still maturing; consumers should cast to a stricter
     * type at the call site if they need one.
     */
    getCurrentSubprojectSystem(): Promise<ApiResponse<SubprojectSystemData>>;
    /** GET /api/subproject (paginated). */
    listSubprojects(params?: {
        page?: number;
        per_page?: number;
        [k: string]: unknown;
    }): Promise<ApiResponse<PaginatedPayload<SubprojectListItem>>>;
    /** GET /api/subproject/all */
    listAllSubprojects(): Promise<ApiResponse<SubprojectListItem[]>>;
    /** GET /api/subproject/{subproject} */
    showSubproject(subproject: number | string): Promise<ApiResponse<SubprojectDetailData>>;
    /** DELETE /api/subproject/{subproject} */
    deleteSubproject(subproject: number | string): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject/delete-category/{subproject} */
    deleteSubprojectCategory(subproject: number | string, body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/subproject-admin/account-data */
    getSubprojectAdminAccountData(): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-admin/confirm-account */
    confirmSubprojectAdminAccount(body: ConfirmSubprojectAdminAccountRequest): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-admin/create-account (public). */
    createSubprojectAdminAccount(body: RegisterSubprojectAdministratorRequest): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/subproject-admin/create-subscription */
    createSubprojectAdminSubscription(): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-admin/find-claimable */
    findClaimableSubproject(body: FindClaimableSubprojectRequest): Promise<ApiResponse<SubprojectListItem[]>>;
    /** GET /api/subproject-admin/get-allowed-countries (public). */
    getSubprojectAdminAllowedCountries(): Promise<ApiResponse<unknown[]>>;
    /** POST /api/subproject-admin/login (public). */
    subprojectAdminLogin(body: SubprojectAdminLoginRequest): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-admin/subproject/has-contacts */
    subprojectAdminHasContacts(body: SubprojectHasContactsRequest): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/subproject-admin/subscription-status */
    getSubprojectAdminSubscriptionStatus(): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-admin/start-claiming/{subproject}/claim */
    startSubprojectClaim(subproject: number | string, body: StartSubprojectClaimRequest): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-admin/claim/subproject/{subproject}/content */
    saveClaimedSubprojectContent(subproject: number | string, body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-admin/claim/subproject/{subproject}/domains */
    saveClaimedSubprojectDomains(subproject: number | string, body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-admin/claim/subproject/{subproject}/layout */
    saveClaimedSubprojectLayout(subproject: number | string, body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-admin/claim/subproject/{subproject}/seo */
    saveClaimedSubprojectSeo(subproject: number | string, body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-admin/claim/subproject/{subproject}/team */
    saveClaimedSubprojectTeam(subproject: number | string, body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-admin/claim/subproject/{subproject}/template */
    saveClaimedSubprojectTemplate(subproject: number | string, body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/subproject-admin/claim/subproject/{subproject}/wizard-instance */
    getClaimedSubprojectWizardInstance(subproject: number | string): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-admin/create/subproject/content */
    createSubprojectContent(body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-admin/create/subproject/domains */
    createSubprojectDomains(body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-admin/create/subproject/layout */
    createSubprojectLayout(body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-admin/create/subproject/seo */
    createSubprojectSeo(body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-admin/create/subproject/team */
    createSubprojectTeam(body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-admin/create/subproject/template */
    createSubprojectTemplate(body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-search */
    searchSubprojects(body: SubprojectSearchRequest): Promise<ApiResponse<SubprojectListItem[]>>;
    /** GET /api/subproject-settings */
    getSubprojectSettings(): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/subproject-types */
    getSubprojectTypes(): Promise<ApiResponse<EmptyOk[]>>;
    /** DELETE /api/subproject-team/delete-invite/{id}/{subproject?} */
    deleteSubprojectTeamInvite(id: number | string, subproject?: number | string): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/subproject-team/get-invites/{subproject?} */
    getSubprojectTeamInvites(subproject?: number | string): Promise<ApiResponse<EmptyOk[]>>;
    /** POST /api/subproject-team/renew-token/{subproject?} */
    renewSubprojectTeamToken(subprojectOrBody: number | string | Record<string, unknown>, body?: Record<string, unknown>): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-team/send-invites/{subproject?} */
    sendSubprojectTeamInvites(subprojectOrBody: number | string | SubprojectSendInvitesRequest, body?: SubprojectSendInvitesRequest): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-team/update-permissions/{subproject?} */
    updateSubprojectTeamPermissions(subprojectOrBody: number | string | SubprojectUpdatePermissionsRequest, body?: SubprojectUpdatePermissionsRequest): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-wizard/content/{id} */
    saveSubprojectWizardContent(id: number | string, body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/subproject-wizard/creation-started */
    getSubprojectWizardCreationStarted(): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-wizard/domains/{id} */
    saveSubprojectWizardDomains(id: number | string, body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/subproject-wizard/get */
    getSubprojectWizard(): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-wizard/layout/{id} */
    saveSubprojectWizardLayout(id: number | string, body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-wizard/seo/{id} */
    saveSubprojectWizardSeo(id: number | string, body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-wizard/team/{id} */
    saveSubprojectWizardTeam(id: number | string, body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/subproject-wizard/template/{id} */
    saveSubprojectWizardTemplate(id: number | string, body: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/project-settings/content/show/{subproject?} */
    getProjectSettingsContent(subproject?: number | string): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/project-settings/content/{subproject?} */
    saveProjectSettingsContent(subprojectOrBody: number | string | SubprojectSectionPayload, body?: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/project-settings/domain-settings/{subproject?} */
    getProjectSettingsDomainSettings(subproject?: number | string): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/project-settings/domains/show/{subproject?} */
    getProjectSettingsDomains(subproject?: number | string): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/project-settings/domains/{subproject?} */
    saveProjectSettingsDomains(subprojectOrBody: number | string | SubprojectSectionPayload, body?: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/project-settings/layout/show/{subproject?} */
    getProjectSettingsLayout(subproject?: number | string): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/project-settings/layout/{subproject?} */
    saveProjectSettingsLayout(subprojectOrBody: number | string | SubprojectSectionPayload, body?: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/project-settings/seo/show/{subproject?} */
    getProjectSettingsSeo(subproject?: number | string): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/project-settings/seo/{subproject?} */
    saveProjectSettingsSeo(subprojectOrBody: number | string | SubprojectSectionPayload, body?: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/project-settings/template/show/{subproject?} */
    getProjectSettingsTemplate(subproject?: number | string): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/project-settings/template/{subproject?} */
    saveProjectSettingsTemplate(subprojectOrBody: number | string | SubprojectSectionPayload, body?: SubprojectSectionPayload): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/tenant-claim/complete */
    completeTenantClaim(body: CompleteTenantClaimRequest): Promise<ApiResponse<TenantClaimStatusData>>;
    /** GET /api/tenant-claim/details/{id} */
    getTenantClaimDetails(id: number | string): Promise<ApiResponse<TenantClaimData>>;
    /** POST /api/tenant-claim/initiate */
    initiateTenantClaim(body: InitiateTenantClaimRequest): Promise<ApiResponse<TenantClaimData>>;
    /** GET /api/tenant-claim/my-claim */
    getMyTenantClaim(): Promise<ApiResponse<TenantClaimData | null>>;
    /** GET /api/tenant-claim/search */
    searchTenantClaims(params?: {
        q?: string;
        [k: string]: unknown;
    }): Promise<ApiResponse<TenantClaimSearchItem[]>>;
    /** GET /api/tenant-claim/status/{token} */
    getTenantClaimStatus(token: string): Promise<ApiResponse<TenantClaimStatusData>>;
    /**
     * POST /api/tenant-claim/verify (multipart/form-data; KYC docs).
     * `BaseApiClient.post` automatically switches to FormData when the body
     * carries a `Blob` / `File`.
     */
    verifyTenantClaim(body: VerifyTenantClaimRequest): Promise<ApiResponse<TenantClaimStatusData>>;
    /** GET /api/tenant-interface-block/by-page/{page_id} */
    getTenantInterfaceBlocksByPage(pageId: number | string): Promise<ApiResponse<TenantInterfaceBlockItem[]>>;
    /** GET /api/tenant-interface-page/all/{interface_id} */
    getTenantInterfacePagesAll(interfaceId: number | string): Promise<ApiResponse<TenantInterfacePageItem[]>>;
    /** GET /api/tenant-interface-page/interface/{interface_id} */
    getTenantInterfacePagesByInterface(interfaceId: number | string): Promise<ApiResponse<TenantInterfacePageItem[]>>;
    /** GET /api/tenant-interface/all */
    getTenantInterfacesAll(): Promise<ApiResponse<TenantInterfaceItem[]>>;
    /** GET /api/tenant-registration/fees (public). */
    getTenantRegistrationFees(): Promise<ApiResponse<TenantRegistrationFee[]>>;
    /** GET /api/domain-interfaces */
    listDomainInterfaces(): Promise<ApiResponse<DomainInterface[]>>;
    /** POST /api/domain-interfaces */
    createDomainInterface(body: CreateDomainInterfaceRequest): Promise<ApiResponse<DomainInterface>>;
    /**
     * GET /api/domain-interfaces/by-domain/{domain}.
     *
     * Returns the `{base, others}` envelope as api/ writes it (no
     * wrapping `data` field — the controller emits the two keys at the
     * top level). 404 from api/ (no rows mapped for the host) is
     * normalized to `{base: null, others: []}` so callers don't have to
     * try/catch around the lookup; the legitimate "no mapping" answer
     * and the "endpoint unreachable" answer are kept distinct: the
     * latter still throws via `ApiError`.
     */
    getDomainInterfaceByDomain(domain: string): Promise<DomainInterfaceByDomainResponse>;
    /** GET /api/domain-interfaces/{id} */
    getDomainInterface(id: number | string): Promise<ApiResponse<DomainInterface>>;
    /** PATCH /api/domain-interfaces/{id} (rewritten as POST?_method=PATCH). */
    patchDomainInterface(id: number | string, body: UpdateDomainInterfaceRequest): Promise<ApiResponse<DomainInterface>>;
    /** DELETE /api/domain-interfaces/{id} */
    deleteDomainInterface(id: number | string): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/world-locations/city */
    createWorldLocationCity(body: CreateWorldLocationCityRequest): Promise<ApiResponse<WorldLocationCity>>;
    /** GET /api/world-locations/city/{city} */
    getWorldLocationCity(city: number | string): Promise<ApiResponse<WorldLocationCity>>;
    /** POST /api/world-locations/country */
    createWorldLocationCountry(body: CreateWorldLocationCountryRequest): Promise<ApiResponse<WorldLocationCountry>>;
    /** GET /api/world-locations/country/{country} */
    getWorldLocationCountry(country: number | string): Promise<ApiResponse<WorldLocationCountry>>;
    /** POST /api/world-locations/state */
    createWorldLocationState(body: CreateWorldLocationStateRequest): Promise<ApiResponse<WorldLocationState>>;
    /** GET /api/world-locations/state/{state} */
    getWorldLocationState(state: number | string): Promise<ApiResponse<WorldLocationState>>;
    /** GET /api/public/countries/{country} (public). */
    getPublicCountry(country: string): Promise<ApiResponse<PublicCountryData>>;
    /** GET /api/public/countries/find-allowed (public). */
    getPublicAllowedCountries(): Promise<ApiResponse<PublicCountryData[]>>;
    /** GET /api/gov/agency-footer */
    getGovAgencyFooter(): Promise<ApiResponse<GovDirectoryItem[]>>;
    /** GET /api/gov/cities */
    getGovCities(): Promise<ApiResponse<GovDirectoryItem[]>>;
    /** GET /api/gov/city-agencies */
    getGovCityAgencies(): Promise<ApiResponse<GovDirectoryItem[]>>;
    /** GET /api/gov/federal-directory */
    getGovFederalDirectory(): Promise<ApiResponse<GovDirectoryItem[]>>;
    /** GET /api/gov/states */
    getGovStates(): Promise<ApiResponse<GovDirectoryItem[]>>;
    /** GET /api/gov/subprojects */
    getGovSubprojects(): Promise<ApiResponse<GovDirectoryItem[]>>;
    /** GET /api/gov/subprojects/by-domain */
    getGovSubprojectByDomain(): Promise<ApiResponse<GovDirectoryItem>>;
    /** GET /api/frontend/get-frontend */
    getFrontend(): Promise<ApiResponse<FrontendData>>;
    /** PUT /api/frontend/save-frontend (rewritten as POST?_method=PUT). */
    saveFrontend(body: SaveFrontendRequest): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/seo-page (paginated) */
    listSeoPages(): Promise<ApiResponse<PaginatedPayload<SeoPageData>>>;
    /** POST /api/seo-page */
    createSeoPage(body: CreateSeoPageRequest): Promise<ApiResponse<SeoPageData>>;
    /** DELETE /api/seo-page/item/{seoPageItem} */
    deleteSeoPageItem(seoPageItem: number | string): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/seo-page/{seo_page} */
    getSeoPage(seoPage: number | string): Promise<ApiResponse<SeoPageData>>;
    /** PUT /api/seo-page/{seo_page} */
    updateSeoPage(seoPage: number | string, body: UpdateSeoPageRequest): Promise<ApiResponse<SeoPageData>>;
    /** DELETE /api/seo-page/{seo_page} */
    deleteSeoPage(seoPage: number | string): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/creator */
    listCreators(): Promise<ApiResponse<CreatorData[]>>;
    /** POST /api/creator */
    createCreator(body: CreateCreatorRequest): Promise<ApiResponse<CreatorData>>;
    /** GET /api/creator/{creator} */
    getCreator(creator: number | string): Promise<ApiResponse<CreatorData>>;
    /** PUT /api/creator/{creator} */
    updateCreator(creator: number | string, body: UpdateCreatorRequest): Promise<ApiResponse<CreatorData>>;
    /** DELETE /api/creator/{creator} */
    deleteCreator(creator: number | string): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/creator-activity */
    listCreatorActivity(): Promise<ApiResponse<CreatorActivityData[]>>;
    /** POST /api/creator-activity */
    createCreatorActivity(body: Record<string, unknown>): Promise<ApiResponse<CreatorActivityData>>;
    /** GET /api/creator-activity/{creator_activity} */
    getCreatorActivity(creatorActivity: number | string): Promise<ApiResponse<CreatorActivityData>>;
    /** PUT /api/creator-activity/{creator_activity} */
    updateCreatorActivity(creatorActivity: number | string, body: Record<string, unknown>): Promise<ApiResponse<CreatorActivityData>>;
    /** DELETE /api/creator-activity/{creator_activity} */
    deleteCreatorActivity(creatorActivity: number | string): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/creator-request */
    listCreatorRequests(): Promise<ApiResponse<CreatorRequestData[]>>;
    /** POST /api/creator-request */
    createCreatorRequest(body: Record<string, unknown>): Promise<ApiResponse<CreatorRequestData>>;
    /** GET /api/creator-request/status */
    getCreatorRequestStatus(): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/creator-request/{creator_request} */
    getCreatorRequest(creatorRequest: number | string): Promise<ApiResponse<CreatorRequestData>>;
    /** PUT /api/creator-request/{creator_request} */
    updateCreatorRequest(creatorRequest: number | string, body: Record<string, unknown>): Promise<ApiResponse<CreatorRequestData>>;
    /** DELETE /api/creator-request/{creator_request} */
    deleteCreatorRequest(creatorRequest: number | string): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/featured/creators */
    saveFeaturedCreators(body: SaveFeaturedCreatorsRequest): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/featured/programs */
    saveFeaturedPrograms(body: SaveFeaturedProgramsRequest): Promise<ApiResponse<EmptyOk>>;
    /** DELETE /api/contacts/delete/{contact} */
    deleteContact(contact: number | string): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/contacts/find/{subproject?} */
    findContacts(body: FindContactsRequest, subproject?: number | string): Promise<ApiResponse<ContactData[]>>;
    /** GET /api/contacts/has-contacts */
    getContactsHasContacts(): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/contacts/import */
    importContacts(body: ImportContactsRequest): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/contacts/list */
    listContacts(body: ListContactsRequest): Promise<ApiResponse<ContactData[]>>;
    /** GET /api/contacts/running-import */
    getContactsRunningImport(): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/contacts/save */
    saveContact(body: SaveContactRequest): Promise<ApiResponse<ContactData>>;
    /** GET /api/documentation */
    listDocumentation(): Promise<ApiResponse<DocumentationItem[]>>;
    /** POST /api/documentation */
    createDocumentation(body: CreateDocumentationRequest): Promise<ApiResponse<DocumentationItem>>;
    /** GET /api/documentation/{documentation} */
    getDocumentation(documentation: number | string): Promise<ApiResponse<DocumentationItem>>;
    /** PUT /api/documentation/{documentation} */
    updateDocumentation(documentation: number | string, body: UpdateDocumentationRequest): Promise<ApiResponse<DocumentationItem>>;
    /** DELETE /api/documentation/{documentation} */
    deleteDocumentation(documentation: number | string): Promise<ApiResponse<EmptyOk>>;
}
//# sourceMappingURL=subproject-api-client.d.ts.map