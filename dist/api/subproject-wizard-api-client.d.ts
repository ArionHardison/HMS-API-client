/**
 * SubprojectWizardApiClient — covers `/api/subproject-wizard/{section}/{id}`
 * (6 endpoints, one per section). All `auth: admin`.
 *
 * Same six sections as the admin/create + admin/claim flows
 * (`SubprojectAdminApiClient`), but parameterized by the existing wizard
 * record id rather than slugged under `claim/subproject/{subproject}`.
 *
 * Source of truth: `sdk/spec/endpoints.json`.
 */
import { BaseApiClient, type ApiResponse } from '../api-client';
import type { SubprojectContentRequest, SubprojectDomainsRequest, SubprojectLayoutRequest, SubprojectSectionResponse, SubprojectSeoRequest, SubprojectTeamRequest, SubprojectTemplateRequest } from '../types/subproject-sections';
export type { SubprojectContentRequest, SubprojectDomainsRequest, SubprojectLayoutRequest, SubprojectSectionResponse, SubprojectSeoRequest, SubprojectTeamRequest, SubprojectTemplateRequest, };
export declare class SubprojectWizardApiClient extends BaseApiClient {
    /** POST /api/subproject-wizard/content/{id} */
    wizardContent(id: number | string, body: SubprojectContentRequest): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** POST /api/subproject-wizard/domains/{id} */
    wizardDomains(id: number | string, body: SubprojectDomainsRequest): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** POST /api/subproject-wizard/layout/{id} */
    wizardLayout(id: number | string, body: SubprojectLayoutRequest): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** POST /api/subproject-wizard/seo/{id} */
    wizardSeo(id: number | string, body: SubprojectSeoRequest): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** POST /api/subproject-wizard/team/{id} */
    wizardTeam(id: number | string, body: SubprojectTeamRequest): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** POST /api/subproject-wizard/template/{id} */
    wizardTemplate(id: number | string, body: SubprojectTemplateRequest): Promise<ApiResponse<SubprojectSectionResponse>>;
}
//# sourceMappingURL=subproject-wizard-api-client.d.ts.map