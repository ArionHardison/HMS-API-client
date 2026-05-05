/**
 * `Modules/Appeal` API client.
 *
 * Covers the 9 endpoints documented in `sdk/spec/endpoints.json` with
 * `module === "Modules/Appeal"`:
 *
 *   - 5 CRUD endpoints (`appeal.{index,store,show,update,destroy}`)
 *   - 1 lifecycle endpoint (`POST /api/appeal/submit`)
 *   - 2 protocol-run reads (`run-global/{appeal}/{task}`,
 *     `run/{appeal}/{chain}`) — the controller returns a raw
 *     `{ data, chain }` shape, no Resource wrapper
 *   - 1 protocol-integration listing (`/api/protocol/appeal/all`)
 *
 * Naming policy: methods follow `spec.id` minus the `appeal.` prefix,
 * camelCased. The protocol-integration endpoint is exposed as
 * `listProtocolAppeals()` to mirror `AgentsModuleApiClient.listProtocolAgents()`.
 *
 * Class is named `AppealModuleApiClient` (not `AppealApiClient`) so it
 * lines up with `AgentsModuleApiClient` / `KPIModuleApiClient` and avoids
 * any future collision with a singular-noun legacy client.
 *
 * Auth: every route is `auth:api` (Sanctum). No `auth: false` overrides
 * required.
 */
import { BaseApiClient } from '../api-client';
import type { ApiRequestOptions, ApiResponse } from '../api-client';
import type {
  AppealChainId,
  AppealId,
  AppealResource,
  AppealRunResource,
  AppealStoreInput,
  AppealSubmitInput,
  AppealSubmitResource,
  AppealTaskId,
  AppealUpdateInput,
} from '../types/modules-appeal';

/**
 * Public client over the `/api/appeal/*` and `/api/protocol/appeal/*`
 * surfaces. Subclasses `BaseApiClient` so it picks up auth / `X-Domain` /
 * Laravel `_method` override / `ApiError` normalization for free.
 */
export class AppealModuleApiClient extends BaseApiClient {
  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------

  /** GET `/api/appeal` — list (paginated) appeals. (`appeal.index`) */
  list(opts?: ApiRequestOptions): Promise<ApiResponse<AppealResource[]>> {
    return this.get<AppealResource[]>('/api/appeal', undefined, opts);
  }

  /** POST `/api/appeal` — create a new appeal. (`appeal.store`) */
  create(body: AppealStoreInput, opts?: ApiRequestOptions): Promise<ApiResponse<AppealResource>> {
    return this.post<AppealResource>('/api/appeal', body, opts);
  }

  /** GET `/api/appeal/{appeal}` — show one appeal. (`appeal.show`) */
  show(appeal: AppealId, opts?: ApiRequestOptions): Promise<ApiResponse<AppealResource>> {
    return this.get<AppealResource>(`/api/appeal/${encodeURIComponent(String(appeal))}`, undefined, opts);
  }

  /** PUT `/api/appeal/{appeal}` — sent as POST + `?_method=PUT`. (`appeal.update`) */
  update(
    appeal: AppealId,
    body: AppealUpdateInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<AppealResource>> {
    return this.put<AppealResource>(`/api/appeal/${encodeURIComponent(String(appeal))}`, body, opts);
  }

  /** DELETE `/api/appeal/{appeal}`. (`appeal.destroy`) */
  destroy(appeal: AppealId, opts?: ApiRequestOptions): Promise<ApiResponse<AppealResource>> {
    return this.delete<AppealResource>(`/api/appeal/${encodeURIComponent(String(appeal))}`, opts);
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /** POST `/api/appeal/submit`. (`post.api.appeal.submit`) */
  submit(
    body: AppealSubmitInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<AppealSubmitResource>> {
    return this.post<AppealSubmitResource>('/api/appeal/submit', body, opts);
  }

  // ---------------------------------------------------------------------------
  // Protocol run reads
  // ---------------------------------------------------------------------------

  /** GET `/api/appeal/run-global/{appeal}/{task}`. (`get.api.appeal.run-global.item.item`) */
  runGlobal(
    appeal: AppealId,
    task: AppealTaskId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<AppealRunResource>> {
    const a = encodeURIComponent(String(appeal));
    const t = encodeURIComponent(String(task));
    return this.get<AppealRunResource>(`/api/appeal/run-global/${a}/${t}`, undefined, opts);
  }

  /** GET `/api/appeal/run/{appeal}/{chain}`. (`get.api.appeal.run.item.item`) */
  run(
    appeal: AppealId,
    chain: AppealChainId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<AppealRunResource>> {
    const a = encodeURIComponent(String(appeal));
    const c = encodeURIComponent(String(chain));
    return this.get<AppealRunResource>(`/api/appeal/run/${a}/${c}`, undefined, opts);
  }

  // ---------------------------------------------------------------------------
  // Protocol integration
  // ---------------------------------------------------------------------------

  /** GET `/api/protocol/appeal/all`. (`get.api.protocol.appeal.all`) */
  listProtocolAppeals(
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<AppealResource[]>> {
    return this.get<AppealResource[]>('/api/protocol/appeal/all', undefined, opts);
  }
}
