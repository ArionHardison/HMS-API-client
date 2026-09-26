/**
 * ProjectSettingsApiClient — covers `/api/project-settings/{section}/{...}`
 * (10 endpoints — 5 sections × {show GET, save POST}). All `auth: admin`.
 *
 * Five sections: content, domains, layout, seo, template. NOTE: there is
 * NO `team` section under `/api/project-settings/*` (team lives under the
 * subproject-admin / subproject-wizard surfaces).
 *
 * The `{subproject?}` path param is optional in Laravel — when omitted the
 * controller defaults to the caller's primary subproject. The SDK accepts
 * `undefined` to omit the segment entirely.
 *
 * Source of truth: `sdk/spec/endpoints.json`.
 */
import { BaseApiClient, type ApiResponse } from '../api-client';
import type { SubprojectLayoutRequest, SubprojectSectionResponse, SubprojectSeoRequest, SubprojectTemplateRequest } from '../types/subproject-sections';
export type { SubprojectLayoutRequest, SubprojectSectionResponse, SubprojectSeoRequest, SubprojectTemplateRequest, };
/**
 * Project-settings content body — like SubprojectContentRequest but the
 * endpoint also accepts a subproject `id` in the body.
 */
export interface ProjectSettingsContentRequest {
    /** Subproject id; required when no path param is supplied. */
    id: number | string;
    name: string;
    parent_project: string | number;
    categories: ReadonlyArray<unknown>;
    placeholders: Record<string, unknown>;
}
/**
 * Project-settings domains body — like SubprojectDomainsRequest but with an
 * `id` field for the subproject.
 */
export interface ProjectSettingsDomainsRequest {
    id: number | string;
    state_id: number | null;
    city_id: number | null;
    country_id: number | null;
    domain: string;
    aliases: ReadonlyArray<string>;
}
export declare class ProjectSettingsApiClient extends BaseApiClient {
    /** GET /api/project-settings/content/show/{subproject?} */
    showContent(subproject?: number | string): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** POST /api/project-settings/content/{subproject?} */
    saveContent(body: ProjectSettingsContentRequest, subproject?: number | string): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** GET /api/project-settings/domains/show/{subproject?} */
    showDomains(subproject?: number | string): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** POST /api/project-settings/domains/{subproject?} */
    saveDomains(body: ProjectSettingsDomainsRequest, subproject?: number | string): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** GET /api/project-settings/layout/show/{subproject?} */
    showLayout(subproject?: number | string): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** POST /api/project-settings/layout/{subproject?} */
    saveLayout(body: SubprojectLayoutRequest, subproject?: number | string): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** GET /api/project-settings/seo/show/{subproject?} */
    showSeo(subproject?: number | string): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** POST /api/project-settings/seo/{subproject?} */
    saveSeo(body: SubprojectSeoRequest, subproject?: number | string): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** GET /api/project-settings/template/show/{subproject?} */
    showTemplate(subproject?: number | string): Promise<ApiResponse<SubprojectSectionResponse>>;
    /** POST /api/project-settings/template/{subproject?} */
    saveTemplate(body: SubprojectTemplateRequest, subproject?: number | string): Promise<ApiResponse<SubprojectSectionResponse>>;
}
//# sourceMappingURL=project-settings-api-client.d.ts.map