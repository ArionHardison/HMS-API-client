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
import type { CreateDashboardProgramRequest, DashboardProgramRecord, DashboardSettingsResponse, ProtocolCategoryRecord, UpdateDashboardProgramRequest, UpdateProtocolCategoryRequest } from '../types/dashboard-program';
export type { CreateDashboardProgramRequest, DashboardProgramRecord, DashboardSettingsResponse, ProtocolCategoryRecord, UpdateDashboardProgramRequest, UpdateProtocolCategoryRequest, };
export interface EmptyOk {
    [key: string]: unknown;
}
export declare class DashboardProgramApiClient extends BaseApiClient {
    /** GET /api/dashboard-program */
    listDashboardPrograms(): Promise<ApiResponse<DashboardProgramRecord[]>>;
    /** POST /api/dashboard-program */
    createDashboardProgram(body?: CreateDashboardProgramRequest): Promise<ApiResponse<DashboardProgramRecord>>;
    /** GET /api/dashboard-program/{dashboard_program} */
    showDashboardProgram(dashboardProgram: number | string): Promise<ApiResponse<DashboardProgramRecord>>;
    /** PUT /api/dashboard-program/{dashboard_program} — POST + `?_method=PUT`. */
    updateDashboardProgram(dashboardProgram: number | string, body: UpdateDashboardProgramRequest): Promise<ApiResponse<DashboardProgramRecord>>;
    /** DELETE /api/dashboard-program/{dashboard_program} */
    destroyDashboardProgram(dashboardProgram: number | string): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/dashboard-settings/get — `auth: public`. */
    getDashboardSettings(): Promise<ApiResponse<DashboardSettingsResponse>>;
    /** PUT /api/protocol-category/{protocol_category} — POST + `?_method=PUT`. */
    updateProtocolCategory(protocolCategory: number | string, body: UpdateProtocolCategoryRequest): Promise<ApiResponse<ProtocolCategoryRecord>>;
}
//# sourceMappingURL=dashboard-program-api-client.d.ts.map