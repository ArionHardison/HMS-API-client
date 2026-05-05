/**
 * `Modules/Verification` API client.
 *
 * Covers the 9 endpoints documented in `sdk/spec/endpoints.json` with
 * `module === "Modules/Verification"`:
 *
 *   - 5 CRUD endpoints (`verification.{index,store,show,update,destroy}`)
 *   - 1 lifecycle endpoint (`POST /api/verification/submit`)
 *   - 2 protocol-run reads (`run-global/{verification}/{task}`,
 *     `run/{verification}/{chain}`) — raw `{ data, chain }` shape
 *   - 1 protocol-integration listing (`/api/protocol/verification/all`)
 *
 * Class: `VerificationModuleApiClient`. Auth: every route is `auth:api`.
 */
import { BaseApiClient } from '../api-client';
import type { ApiRequestOptions, ApiResponse } from '../api-client';
import type {
  VerificationChainId,
  VerificationId,
  VerificationResource,
  VerificationRunResource,
  VerificationStoreInput,
  VerificationSubmitInput,
  VerificationSubmitResource,
  VerificationTaskId,
  VerificationUpdateInput,
} from '../types/modules-verification';

/**
 * Public client over `/api/verification/*` and `/api/protocol/verification/*`.
 * Subclasses `BaseApiClient` for auth / `X-Domain` / `_method` / `ApiError`.
 */
export class VerificationModuleApiClient extends BaseApiClient {
  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------

  /** GET `/api/verification`. (`verification.index`) */
  list(opts?: ApiRequestOptions): Promise<ApiResponse<VerificationResource[]>> {
    return this.get<VerificationResource[]>('/api/verification', undefined, opts);
  }

  /** POST `/api/verification`. (`verification.store`) */
  create(
    body: VerificationStoreInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<VerificationResource>> {
    return this.post<VerificationResource>('/api/verification', body, opts);
  }

  /** GET `/api/verification/{verification}`. (`verification.show`) */
  show(
    verification: VerificationId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<VerificationResource>> {
    return this.get<VerificationResource>(
      `/api/verification/${encodeURIComponent(String(verification))}`,
      undefined,
      opts,
    );
  }

  /** PUT `/api/verification/{verification}` — sent as POST + `?_method=PUT`. (`verification.update`) */
  update(
    verification: VerificationId,
    body: VerificationUpdateInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<VerificationResource>> {
    return this.put<VerificationResource>(
      `/api/verification/${encodeURIComponent(String(verification))}`,
      body,
      opts,
    );
  }

  /** DELETE `/api/verification/{verification}`. (`verification.destroy`) */
  destroy(
    verification: VerificationId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<VerificationResource>> {
    return this.delete<VerificationResource>(
      `/api/verification/${encodeURIComponent(String(verification))}`,
      opts,
    );
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /** POST `/api/verification/submit`. (`post.api.verification.submit`) */
  submit(
    body: VerificationSubmitInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<VerificationSubmitResource>> {
    return this.post<VerificationSubmitResource>('/api/verification/submit', body, opts);
  }

  // ---------------------------------------------------------------------------
  // Protocol run reads
  // ---------------------------------------------------------------------------

  /** GET `/api/verification/run-global/{verification}/{task}`. (`get.api.verification.run-global.item.item`) */
  runGlobal(
    verification: VerificationId,
    task: VerificationTaskId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<VerificationRunResource>> {
    const v = encodeURIComponent(String(verification));
    const t = encodeURIComponent(String(task));
    return this.get<VerificationRunResource>(
      `/api/verification/run-global/${v}/${t}`,
      undefined,
      opts,
    );
  }

  /** GET `/api/verification/run/{verification}/{chain}`. (`get.api.verification.run.item.item`) */
  run(
    verification: VerificationId,
    chain: VerificationChainId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<VerificationRunResource>> {
    const v = encodeURIComponent(String(verification));
    const c = encodeURIComponent(String(chain));
    return this.get<VerificationRunResource>(`/api/verification/run/${v}/${c}`, undefined, opts);
  }

  // ---------------------------------------------------------------------------
  // Protocol integration
  // ---------------------------------------------------------------------------

  /** GET `/api/protocol/verification/all`. (`get.api.protocol.verification.all`) */
  listProtocolVerifications(
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<VerificationResource[]>> {
    return this.get<VerificationResource[]>('/api/protocol/verification/all', undefined, opts);
  }
}
