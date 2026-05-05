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
import type {
  SubprojectLayoutRequest,
  SubprojectSectionResponse,
  SubprojectSeoRequest,
  SubprojectTemplateRequest,
} from '../types/subproject-sections';

export type {
  SubprojectLayoutRequest,
  SubprojectSectionResponse,
  SubprojectSeoRequest,
  SubprojectTemplateRequest,
};

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

function buildSectionPath(section: string, subproject?: number | string): string {
  return subproject == null
    ? `/api/project-settings/${section}`
    : `/api/project-settings/${section}/${encodeURIComponent(String(subproject))}`;
}

function buildShowPath(section: string, subproject?: number | string): string {
  return subproject == null
    ? `/api/project-settings/${section}/show`
    : `/api/project-settings/${section}/show/${encodeURIComponent(String(subproject))}`;
}

export class ProjectSettingsApiClient extends BaseApiClient {
  // ---------------------------------------------------------------------------
  // content
  // ---------------------------------------------------------------------------

  /** GET /api/project-settings/content/show/{subproject?} */
  async showContent(
    subproject?: number | string,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.get<SubprojectSectionResponse>(buildShowPath('content', subproject));
  }

  /** POST /api/project-settings/content/{subproject?} */
  async saveContent(
    body: ProjectSettingsContentRequest,
    subproject?: number | string,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.post<SubprojectSectionResponse>(
      buildSectionPath('content', subproject),
      body,
    );
  }

  // ---------------------------------------------------------------------------
  // domains
  // ---------------------------------------------------------------------------

  /** GET /api/project-settings/domains/show/{subproject?} */
  async showDomains(
    subproject?: number | string,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.get<SubprojectSectionResponse>(buildShowPath('domains', subproject));
  }

  /** POST /api/project-settings/domains/{subproject?} */
  async saveDomains(
    body: ProjectSettingsDomainsRequest,
    subproject?: number | string,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.post<SubprojectSectionResponse>(
      buildSectionPath('domains', subproject),
      body,
    );
  }

  // ---------------------------------------------------------------------------
  // layout
  // ---------------------------------------------------------------------------

  /** GET /api/project-settings/layout/show/{subproject?} */
  async showLayout(
    subproject?: number | string,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.get<SubprojectSectionResponse>(buildShowPath('layout', subproject));
  }

  /** POST /api/project-settings/layout/{subproject?} */
  async saveLayout(
    body: SubprojectLayoutRequest,
    subproject?: number | string,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.post<SubprojectSectionResponse>(
      buildSectionPath('layout', subproject),
      body,
    );
  }

  // ---------------------------------------------------------------------------
  // seo
  // ---------------------------------------------------------------------------

  /** GET /api/project-settings/seo/show/{subproject?} */
  async showSeo(
    subproject?: number | string,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.get<SubprojectSectionResponse>(buildShowPath('seo', subproject));
  }

  /** POST /api/project-settings/seo/{subproject?} */
  async saveSeo(
    body: SubprojectSeoRequest,
    subproject?: number | string,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.post<SubprojectSectionResponse>(
      buildSectionPath('seo', subproject),
      body,
    );
  }

  // ---------------------------------------------------------------------------
  // template
  // ---------------------------------------------------------------------------

  /** GET /api/project-settings/template/show/{subproject?} */
  async showTemplate(
    subproject?: number | string,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.get<SubprojectSectionResponse>(buildShowPath('template', subproject));
  }

  /** POST /api/project-settings/template/{subproject?} */
  async saveTemplate(
    body: SubprojectTemplateRequest,
    subproject?: number | string,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.post<SubprojectSectionResponse>(
      buildSectionPath('template', subproject),
      body,
    );
  }
}

// =============================================================================
// Re-export hint for `src/index.ts`
// -----------------------------------------------------------------------------
//   export { ProjectSettingsApiClient } from './api/project-settings-api-client';
//   export type {
//     ProjectSettingsContentRequest,
//     ProjectSettingsDomainsRequest,
//   } from './api/project-settings-api-client';
// =============================================================================
