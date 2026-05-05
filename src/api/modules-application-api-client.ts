/**
 * `Modules/Application` API client.
 *
 * Covers the 9 endpoints documented in `sdk/spec/endpoints.json` with
 * `module === "Modules/Application"`:
 *
 *   - 5 CRUD endpoints (`application.{index,store,show,update,destroy}`)
 *   - 1 lifecycle endpoint (`POST /api/application/submit`)
 *   - 2 protocol-run reads (`run-global/{application}/{task}`,
 *     `run/{application}/{chain}`) — raw `{ data, chain }` shape, no
 *     Resource wrapper
 *   - 1 protocol-integration listing (`/api/protocol/application/all`)
 *
 * Class: `ApplicationModuleApiClient`. Auth: every route is `auth:api`.
 */
import { BaseApiClient } from '../api-client';
import type { ApiRequestOptions, ApiResponse } from '../api-client';
import type {
  ApplicationChainId,
  ApplicationId,
  ApplicationResource,
  ApplicationRunResource,
  ApplicationStoreInput,
  ApplicationSubmitInput,
  ApplicationSubmitResource,
  ApplicationTaskId,
  ApplicationUpdateInput,
} from '../types/modules-application';

/**
 * Public client over the `/api/application/*` and `/api/protocol/application/*`
 * surfaces. Subclasses `BaseApiClient` for auth / `X-Domain` / `_method` /
 * `ApiError` handling.
 */
export class ApplicationModuleApiClient extends BaseApiClient {
  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------

  /** GET `/api/application`. (`application.index`) */
  list(opts?: ApiRequestOptions): Promise<ApiResponse<ApplicationResource[]>> {
    return this.get<ApplicationResource[]>('/api/application', undefined, opts);
  }

  /** POST `/api/application`. (`application.store`) */
  create(
    body: ApplicationStoreInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ApplicationResource>> {
    return this.post<ApplicationResource>('/api/application', body, opts);
  }

  /** GET `/api/application/{application}`. (`application.show`) */
  show(
    application: ApplicationId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ApplicationResource>> {
    return this.get<ApplicationResource>(
      `/api/application/${encodeURIComponent(String(application))}`,
      undefined,
      opts,
    );
  }

  /** PUT `/api/application/{application}` — sent as POST + `?_method=PUT`. (`application.update`) */
  update(
    application: ApplicationId,
    body: ApplicationUpdateInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ApplicationResource>> {
    return this.put<ApplicationResource>(
      `/api/application/${encodeURIComponent(String(application))}`,
      body,
      opts,
    );
  }

  /** DELETE `/api/application/{application}`. (`application.destroy`) */
  destroy(
    application: ApplicationId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ApplicationResource>> {
    return this.delete<ApplicationResource>(
      `/api/application/${encodeURIComponent(String(application))}`,
      opts,
    );
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /** POST `/api/application/submit`. (`post.api.application.submit`) */
  submit(
    body: ApplicationSubmitInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ApplicationSubmitResource>> {
    return this.post<ApplicationSubmitResource>('/api/application/submit', body, opts);
  }

  // ---------------------------------------------------------------------------
  // Protocol run reads
  // ---------------------------------------------------------------------------

  /** GET `/api/application/run-global/{application}/{task}`. (`get.api.application.run-global.item.item`) */
  runGlobal(
    application: ApplicationId,
    task: ApplicationTaskId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ApplicationRunResource>> {
    const a = encodeURIComponent(String(application));
    const t = encodeURIComponent(String(task));
    return this.get<ApplicationRunResource>(`/api/application/run-global/${a}/${t}`, undefined, opts);
  }

  /** GET `/api/application/run/{application}/{chain}`. (`get.api.application.run.item.item`) */
  run(
    application: ApplicationId,
    chain: ApplicationChainId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ApplicationRunResource>> {
    const a = encodeURIComponent(String(application));
    const c = encodeURIComponent(String(chain));
    return this.get<ApplicationRunResource>(`/api/application/run/${a}/${c}`, undefined, opts);
  }

  // ---------------------------------------------------------------------------
  // Protocol integration
  // ---------------------------------------------------------------------------

  /** GET `/api/protocol/application/all`. (`get.api.protocol.application.all`) */
  listProtocolApplications(
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ApplicationResource[]>> {
    return this.get<ApplicationResource[]>('/api/protocol/application/all', undefined, opts);
  }
}
