/**
 * SystemsApiClient — tenant-agnostic + per-tenant Systems read surface.
 *
 * Powers the sys/ MFE's Systems submenu (and any other consumer that
 * needs the global registry of non-generic codify-* systems).
 *
 * Routes (all under the `api` middleware group):
 *   GET /api/v1/systems/catalog               → listCatalog() — tenant-agnostic
 *   GET /api/v1/systems                       → listForCurrentSubproject()
 *   GET /api/v1/systems/{vertical}            → showVertical(vertical)
 *   GET /api/v1/systems/{vertical}/components → listComponents(vertical)
 *
 * `listCatalog()` is the only fully tenant-agnostic method on this slice
 * — it does not require `X-Domain` to resolve a subproject, returns the
 * same payload for every caller, and excludes the 4 platform_orchestrator
 * entries (GOV/SYS/APP/API) + GOOGLE_PLACES (external_service). The other
 * three methods resolve the current subproject via the `X-Domain` header
 * and return tenant-scoped data (local agency overrides, deployed flags
 * relative to the tenant's droplet, etc.).
 *
 * Source of truth: `api/app/Services/Systems/SystemMetadataService.php`.
 */

import { BaseApiClient, type ApiResponse } from '../api-client';
import type { SystemCatalogEntry, SystemComponent } from '../types/systems';

export type { SystemCatalogEntry, SystemComponent };

/**
 * Per-subproject home-grid card shape returned by
 * `GET /api/v1/systems` (the legacy first-wave endpoint). 4 entries,
 * locked order (employment, education, healthcare, nutrition).
 */
export interface SystemHomeCard {
  vertical: string;
  name: string;
  local_name: string;
  description: string;
  icon: string | null;
  component_count: number;
  agency_count: number;
  agencies: string[];
  url: string;
  deployed: boolean;
}

/**
 * Per-subproject detail block returned by
 * `GET /api/v1/systems/{vertical}`.
 */
export interface SystemDetail {
  vertical: string;
  name: string;
  local_name: string;
  description: string;
  icon: string | null;
  components: SystemComponent[];
  agencies: Array<{
    name: string;
    acronym: string | null;
    url: string | null;
    is_primary: boolean;
  }>;
  agents: Array<{
    key: string;
    name: string;
    description: string | null;
  }>;
}

export class SystemsApiClient extends BaseApiClient {
  /**
   * GET /api/v1/systems/catalog — every non-generic system grouped by
   * vertical. Tenant-agnostic; `X-Domain` not required but harmless.
   */
  async listCatalog(): Promise<ApiResponse<SystemCatalogEntry[]>> {
    return this.get<SystemCatalogEntry[]>('/api/v1/systems/catalog', undefined, {
      auth: false,
    });
  }

  /**
   * GET /api/v1/systems — first-wave home-grid cards for the current
   * subproject. Requires `X-Domain` to resolve a tenant; 404s otherwise.
   */
  async listForCurrentSubproject(): Promise<ApiResponse<SystemHomeCard[]>> {
    return this.get<SystemHomeCard[]>('/api/v1/systems');
  }

  /**
   * GET /api/v1/systems/{vertical} — detail block for one vertical
   * within the current subproject. 404s for unknown verticals or when
   * no tenant resolves.
   */
  async showVertical(vertical: string): Promise<ApiResponse<SystemDetail>> {
    return this.get<SystemDetail>(
      `/api/v1/systems/${encodeURIComponent(vertical)}`,
    );
  }

  /**
   * GET /api/v1/systems/{vertical}/components — flat component list for
   * one vertical. Unknown verticals return `{data: []}` (200, not 404)
   * so modal/list surfaces render empty gracefully.
   */
  async listComponents(
    vertical: string,
  ): Promise<ApiResponse<SystemComponent[]>> {
    return this.get<SystemComponent[]>(
      `/api/v1/systems/${encodeURIComponent(vertical)}/components`,
    );
  }
}
