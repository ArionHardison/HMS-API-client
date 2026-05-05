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
import type {
  SubprojectContentRequest,
  SubprojectDomainsRequest,
  SubprojectLayoutRequest,
  SubprojectSectionResponse,
  SubprojectSeoRequest,
  SubprojectTeamRequest,
  SubprojectTemplateRequest,
} from '../types/subproject-sections';

export type {
  SubprojectContentRequest,
  SubprojectDomainsRequest,
  SubprojectLayoutRequest,
  SubprojectSectionResponse,
  SubprojectSeoRequest,
  SubprojectTeamRequest,
  SubprojectTemplateRequest,
};

export class SubprojectWizardApiClient extends BaseApiClient {
  /** POST /api/subproject-wizard/content/{id} */
  async wizardContent(
    id: number | string,
    body: SubprojectContentRequest,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.post<SubprojectSectionResponse>(
      `/api/subproject-wizard/content/${encodeURIComponent(String(id))}`,
      body,
    );
  }

  /** POST /api/subproject-wizard/domains/{id} */
  async wizardDomains(
    id: number | string,
    body: SubprojectDomainsRequest,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.post<SubprojectSectionResponse>(
      `/api/subproject-wizard/domains/${encodeURIComponent(String(id))}`,
      body,
    );
  }

  /** POST /api/subproject-wizard/layout/{id} */
  async wizardLayout(
    id: number | string,
    body: SubprojectLayoutRequest,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.post<SubprojectSectionResponse>(
      `/api/subproject-wizard/layout/${encodeURIComponent(String(id))}`,
      body,
    );
  }

  /** POST /api/subproject-wizard/seo/{id} */
  async wizardSeo(
    id: number | string,
    body: SubprojectSeoRequest,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.post<SubprojectSectionResponse>(
      `/api/subproject-wizard/seo/${encodeURIComponent(String(id))}`,
      body,
    );
  }

  /** POST /api/subproject-wizard/team/{id} */
  async wizardTeam(
    id: number | string,
    body: SubprojectTeamRequest,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.post<SubprojectSectionResponse>(
      `/api/subproject-wizard/team/${encodeURIComponent(String(id))}`,
      body,
    );
  }

  /** POST /api/subproject-wizard/template/{id} */
  async wizardTemplate(
    id: number | string,
    body: SubprojectTemplateRequest,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.post<SubprojectSectionResponse>(
      `/api/subproject-wizard/template/${encodeURIComponent(String(id))}`,
      body,
    );
  }
}

// =============================================================================
// Re-export hint for `src/index.ts`
// -----------------------------------------------------------------------------
//   export { SubprojectWizardApiClient } from './api/subproject-wizard-api-client';
//   // Types re-exported from ./api/subproject-admin-api-client (shared shape).
// =============================================================================
