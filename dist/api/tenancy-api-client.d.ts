/**
 * @deprecated Use `SubprojectApiClient` from
 * `@arionhardison/wizard-api-client/api/subproject-api-client` (or the
 * root barrel). Will be removed in 2.0.0.
 *
 * Why the rename:
 *
 *   The system we're building is not flat "tenancy" — subprojects form
 *   a tree (parent -> child) and inherit branding/theme/DPG bindings
 *   upward. Calling the client "Tenancy" forced consumers to write
 *   `.loadTenant()` next to `Subproject*` types and made the
 *   inheritance contract invisible. `SubprojectApiClient` exposes the
 *   same surface plus the new hierarchy-aware methods
 *   (`getDpgInstances(id)`) and a fully-typed `Subproject`
 *   discriminated union for `/api/load`.
 *
 * This file is now a thin shim:
 *   - Re-exports the `SubprojectApiClient` class as `TenancyApiClient`
 *     (via a wrapper subclass) so every existing method continues to
 *     work unchanged.
 *   - Re-exports the legacy type aliases (`LoadTenantResult` etc.) so
 *     `import { ..., LoadTenantResult } from '.../tenancy-api-client'`
 *     keeps compiling.
 *   - Emits a one-shot `console.warn` on first instantiation so users
 *     get a single, actionable nudge to migrate.
 *
 * Migration path (one minor of overlap):
 *   1. `import { SubprojectApiClient } from '@arionhardison/wizard-api-client'`
 *   2. `new SubprojectApiClient({...})`
 *   3. `.loadSubproject()` instead of `.loadTenant()`
 *   4. Replace `LoadTenantResult` / `LoadSubprojectResult` with
 *      `SubprojectLoadResponse` (the canonical type that includes
 *      the hierarchy fields).
 *
 * Removed in 2.0.0 alongside this file.
 */
import type { ApiClientConfig } from '../api-client';
import { SubprojectApiClient } from './subproject-api-client';
export type { AuthenticateAtTenantData, CompleteTenantClaimRequest, ConfirmSubprojectAdminAccountRequest, ContactData, CreateCreatorRequest, CreateDocumentationRequest, CreateDomainInterfaceRequest, CreateSeoPageRequest, CreateWorldLocationCityRequest, CreateWorldLocationCountryRequest, CreateWorldLocationStateRequest, CreatorActivityData, CreatorData, CreatorRequestData, DocumentationItem, DomainInterface, EmptyOk, FindClaimableSubprojectRequest, FindContactsRequest, FrontendData, GovDirectoryItem, ImportContactsRequest, InitiateTenantClaimRequest, ListContactsRequest, LoadSubprojectResult, LoadTenantResult, PaginatedPayload, PublicCountryData, PublicTenantLogoData, RegisterSubprojectAdministratorRequest, SaveContactRequest, SaveFeaturedCreatorsRequest, SaveFeaturedProgramsRequest, SaveFrontendRequest, SeoPageData, StartSubprojectClaimRequest, SubprojectAdminLoginRequest, SubprojectClientData, SubprojectDashboardDefaultData, SubprojectDetailData, SubprojectHasContactsRequest, SubprojectInterfaceData, SubprojectLeaderData, SubprojectListItem, SubprojectSearchRequest, SubprojectSectionPayload, SubprojectSendInvitesRequest, SubprojectUpdatePermissionsRequest, TenantClaimData, TenantClaimSearchItem, TenantClaimStatusData, TenantInterfaceBlockItem, TenantInterfaceItem, TenantInterfacePageItem, TenantRegistrationFee, UpdateCreatorRequest, UpdateDocumentationRequest, UpdateDomainInterfaceRequest, UpdateSeoPageRequest, VerifyTenantClaimRequest, WorldLocationCity, WorldLocationCountry, WorldLocationState, } from '../types/tenancy';
/**
 * @deprecated Use `SubprojectApiClient`. Will be removed in 2.0.0.
 *
 * Backward-compatible class that re-exports the entire
 * `SubprojectApiClient` surface (including the new hierarchy-aware
 * `loadSubproject()` + `getDpgInstances()` methods). The only
 * runtime difference from `SubprojectApiClient` is the one-shot
 * deprecation `console.warn` fired on first construction.
 */
export declare class TenancyApiClient extends SubprojectApiClient {
    constructor(config: ApiClientConfig);
}
//# sourceMappingURL=tenancy-api-client.d.ts.map