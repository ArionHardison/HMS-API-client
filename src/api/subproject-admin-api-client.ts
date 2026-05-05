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

export class SubprojectAdminApiClient extends BaseApiClient {
  // ---------------------------------------------------------------------------
  // /api/subproject-admin/create/subproject/{section} — fresh subproject flow.
  // ---------------------------------------------------------------------------

  /** POST /api/subproject-admin/create/subproject/content */
  async createSubprojectContent(
    body: SubprojectContentRequest,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.post<SubprojectSectionResponse>(
      '/api/subproject-admin/create/subproject/content',
      body,
    );
  }

  /** POST /api/subproject-admin/create/subproject/domains */
  async createSubprojectDomains(
    body: SubprojectDomainsRequest,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.post<SubprojectSectionResponse>(
      '/api/subproject-admin/create/subproject/domains',
      body,
    );
  }

  /** POST /api/subproject-admin/create/subproject/layout */
  async createSubprojectLayout(
    body: SubprojectLayoutRequest,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.post<SubprojectSectionResponse>(
      '/api/subproject-admin/create/subproject/layout',
      body,
    );
  }

  /** POST /api/subproject-admin/create/subproject/seo */
  async createSubprojectSeo(
    body: SubprojectSeoRequest,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.post<SubprojectSectionResponse>(
      '/api/subproject-admin/create/subproject/seo',
      body,
    );
  }

  /** POST /api/subproject-admin/create/subproject/team */
  async createSubprojectTeam(
    body: SubprojectTeamRequest,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.post<SubprojectSectionResponse>(
      '/api/subproject-admin/create/subproject/team',
      body,
    );
  }

  /** POST /api/subproject-admin/create/subproject/template */
  async createSubprojectTemplate(
    body: SubprojectTemplateRequest,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.post<SubprojectSectionResponse>(
      '/api/subproject-admin/create/subproject/template',
      body,
    );
  }

  // ---------------------------------------------------------------------------
  // /api/subproject-admin/claim/subproject/{subproject}/{section} — claim/edit
  // an existing subproject.
  // ---------------------------------------------------------------------------

  /** POST /api/subproject-admin/claim/subproject/{subproject}/content */
  async claimSubprojectContent(
    subproject: number | string,
    body: SubprojectContentRequest,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.post<SubprojectSectionResponse>(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/content`,
      body,
    );
  }

  /** POST /api/subproject-admin/claim/subproject/{subproject}/domains */
  async claimSubprojectDomains(
    subproject: number | string,
    body: SubprojectDomainsRequest,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.post<SubprojectSectionResponse>(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/domains`,
      body,
    );
  }

  /** POST /api/subproject-admin/claim/subproject/{subproject}/layout */
  async claimSubprojectLayout(
    subproject: number | string,
    body: SubprojectLayoutRequest,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.post<SubprojectSectionResponse>(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/layout`,
      body,
    );
  }

  /** POST /api/subproject-admin/claim/subproject/{subproject}/seo */
  async claimSubprojectSeo(
    subproject: number | string,
    body: SubprojectSeoRequest,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.post<SubprojectSectionResponse>(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/seo`,
      body,
    );
  }

  /** POST /api/subproject-admin/claim/subproject/{subproject}/team */
  async claimSubprojectTeam(
    subproject: number | string,
    body: SubprojectTeamRequest,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.post<SubprojectSectionResponse>(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/team`,
      body,
    );
  }

  /** POST /api/subproject-admin/claim/subproject/{subproject}/template */
  async claimSubprojectTemplate(
    subproject: number | string,
    body: SubprojectTemplateRequest,
  ): Promise<ApiResponse<SubprojectSectionResponse>> {
    return this.post<SubprojectSectionResponse>(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(subproject))}/template`,
      body,
    );
  }
}
