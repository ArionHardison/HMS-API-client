/**
 * Type contracts for `DashboardProgramApiClient`.
 *
 * Source of truth: `sdk/spec/endpoints.json` — entries under
 * `/api/dashboard-program*`, `/api/dashboard-settings*`, and
 * `/api/protocol-category/{protocol_category}`.
 */

export interface DashboardProgramRecord {
  id?: number;
  [key: string]: unknown;
}

/** POST /api/dashboard-program body — spec leaves shape empty (controller-driven). */
export interface CreateDashboardProgramRequest {
  [key: string]: unknown;
}

/** PUT /api/dashboard-program/{dashboard_program} body. */
export interface UpdateDashboardProgramRequest {
  /** Featured flag — required by `UpdateDashboardProgramRequest`. */
  featured: boolean;
  [key: string]: unknown;
}

/** GET /api/dashboard-settings/get response payload — public endpoint. */
export interface DashboardSettingsResponse {
  [key: string]: unknown;
}

/** PUT /api/protocol-category/{protocol_category} body. */
export interface UpdateProtocolCategoryRequest {
  category_name: string;
}

/** Spec leaves response shape empty for protocol-category — keep it permissive. */
export interface ProtocolCategoryRecord {
  id?: number;
  category_name?: string;
  [key: string]: unknown;
}
