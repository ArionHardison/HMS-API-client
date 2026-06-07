/**
 * SubprojectAdminApiClient — covers the create-section and claim-section flows
 * under `/api/subproject-admin/create/subproject/*` and
 * `/api/subproject-admin/claim/subproject/{subproject}/*` (12 endpoints).
 * All `auth: admin` (Bearer required, admin-scoped).
 *
 * NOTE: The non-section endpoints under `/api/subproject-admin/*`
 * (account-data, confirm-account, create-account, etc.) are owned by
 * `TenancyApiClient` and are NOT included here.
 *
 * Source of truth: `sdk/spec/endpoints.json`.
 */
import { BaseApiClient, type ApiResponse } from '../api-client';
import type { SubprojectContentRequest, SubprojectDomainsRequest, SubprojectLayoutRequest, SubprojectSectionResponse, SubprojectSeoRequest, SubprojectTeamRequest, SubprojectTemplateRequest } from '../types/subproject-sections';
export type { SubprojectContentRequest, SubprojectDomainsRequest, SubprojectLayoutRequest, SubprojectSectionResponse, SubprojectSeoRequest, SubprojectTeamRequest, SubprojectTemplateRequest, };
export declare class SubprojectAdminApiClient extends BaseApiClient {
    /** POST /api/subproject-admin/create/subproject/content */
    createSubprojectContent(body: SubprojectContentRequest): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** POST /api/subproject-admin/create/subproject/domains */
    createSubprojectDomains(body: SubprojectDomainsRequest): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** POST /api/subproject-admin/create/subproject/layout */
    createSubprojectLayout(body: SubprojectLayoutRequest): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** POST /api/subproject-admin/create/subproject/seo */
    createSubprojectSeo(body: SubprojectSeoRequest): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** POST /api/subproject-admin/create/subproject/team */
    createSubprojectTeam(body: SubprojectTeamRequest): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** POST /api/subproject-admin/create/subproject/template */
    createSubprojectTemplate(body: SubprojectTemplateRequest): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** POST /api/subproject-admin/claim/subproject/{subproject}/content */
    claimSubprojectContent(subproject: number | string, body: SubprojectContentRequest): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** POST /api/subproject-admin/claim/subproject/{subproject}/domains */
    claimSubprojectDomains(subproject: number | string, body: SubprojectDomainsRequest): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** POST /api/subproject-admin/claim/subproject/{subproject}/layout */
    claimSubprojectLayout(subproject: number | string, body: SubprojectLayoutRequest): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** POST /api/subproject-admin/claim/subproject/{subproject}/seo */
    claimSubprojectSeo(subproject: number | string, body: SubprojectSeoRequest): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** POST /api/subproject-admin/claim/subproject/{subproject}/team */
    claimSubprojectTeam(subproject: number | string, body: SubprojectTeamRequest): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** POST /api/subproject-admin/claim/subproject/{subproject}/template */
    claimSubprojectTemplate(subproject: number | string, body: SubprojectTemplateRequest): Promise<ApiResponse<SubprojectSectionResponse>>;
}
//# sourceMappingURL=subproject-admin-api-client.d.ts.map