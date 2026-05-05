/**
 * DashboardProgramApiClient — covers `/api/dashboard-program*`,
 * `/api/dashboard-settings/get`, and `/api/protocol-category/{protocol_category}`
 * (7 endpoints).
 *
 * Auth bands:
 *   - dashboard-program/* → `auth: api`
 *   - dashboard-settings/get → `auth: public` (call with `{ auth: false }`)
 *   - protocol-category/{id} (PUT) → `auth: api`
 *
 * Source of truth: `sdk/spec/endpoints.json`.
 */

import { BaseApiClient, type ApiResponse } from '../api-client';
import type {
  CreateDashboardProgramRequest,
  DashboardProgramRecord,
  DashboardSettingsResponse,
  ProtocolCategoryRecord,
  UpdateDashboardProgramRequest,
  UpdateProtocolCategoryRequest,
} from '../types/dashboard-program';

export type {
  CreateDashboardProgramRequest,
  DashboardProgramRecord,
  DashboardSettingsResponse,
  ProtocolCategoryRecord,
  UpdateDashboardProgramRequest,
  UpdateProtocolCategoryRequest,
};

export interface EmptyOk {
  [key: string]: unknown;
}

export class DashboardProgramApiClient extends BaseApiClient {
  // ---------------------------------------------------------------------------
  // /api/dashboard-program (resource — index, store, show, update, destroy)
  // ---------------------------------------------------------------------------

  /** GET /api/dashboard-program */
  async listDashboardPrograms(): Promise<ApiResponse<DashboardProgramRecord[]>> {
    return this.get<DashboardProgramRecord[]>('/api/dashboard-program');
  }

  /** POST /api/dashboard-program */
  async createDashboardProgram(
    body: CreateDashboardProgramRequest = {},
  ): Promise<ApiResponse<DashboardProgramRecord>> {
    return this.post<DashboardProgramRecord>('/api/dashboard-program', body);
  }

  /** GET /api/dashboard-program/{dashboard_program} */
  async showDashboardProgram(
    dashboardProgram: number | string,
  ): Promise<ApiResponse<DashboardProgramRecord>> {
    return this.get<DashboardProgramRecord>(
      `/api/dashboard-program/${encodeURIComponent(String(dashboardProgram))}`,
    );
  }

  /** PUT /api/dashboard-program/{dashboard_program} — POST + `?_method=PUT`. */
  async updateDashboardProgram(
    dashboardProgram: number | string,
    body: UpdateDashboardProgramRequest,
  ): Promise<ApiResponse<DashboardProgramRecord>> {
    return this.put<DashboardProgramRecord>(
      `/api/dashboard-program/${encodeURIComponent(String(dashboardProgram))}`,
      body,
    );
  }

  /** DELETE /api/dashboard-program/{dashboard_program} */
  async destroyDashboardProgram(
    dashboardProgram: number | string,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.delete<EmptyOk>(
      `/api/dashboard-program/${encodeURIComponent(String(dashboardProgram))}`,
    );
  }

  // ---------------------------------------------------------------------------
  // /api/dashboard-settings/get (public)
  // ---------------------------------------------------------------------------

  /** GET /api/dashboard-settings/get — `auth: public`. */
  async getDashboardSettings(): Promise<ApiResponse<DashboardSettingsResponse>> {
    return this.get<DashboardSettingsResponse>(
      '/api/dashboard-settings/get',
      undefined,
      { auth: false },
    );
  }

  // ---------------------------------------------------------------------------
  // /api/protocol-category/{protocol_category} (PUT only — the rest are owned
  // by another slice).
  // ---------------------------------------------------------------------------

  /** PUT /api/protocol-category/{protocol_category} — POST + `?_method=PUT`. */
  async updateProtocolCategory(
    protocolCategory: number | string,
    body: UpdateProtocolCategoryRequest,
  ): Promise<ApiResponse<ProtocolCategoryRecord>> {
    return this.put<ProtocolCategoryRecord>(
      `/api/protocol-category/${encodeURIComponent(String(protocolCategory))}`,
      body,
    );
  }
}

// =============================================================================
// Re-export hint for `src/index.ts`
// -----------------------------------------------------------------------------
//   export { DashboardProgramApiClient } from './api/dashboard-program-api-client';
//   export type {
//     CreateDashboardProgramRequest,
//     DashboardProgramRecord,
//     DashboardSettingsResponse,
//     ProtocolCategoryRecord,
//     UpdateDashboardProgramRequest,
//     UpdateProtocolCategoryRequest,
//   } from './api/dashboard-program-api-client';
// =============================================================================
