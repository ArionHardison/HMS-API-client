/**
 * `Modules/Disbursement` API client.
 *
 * Covers the 9 endpoints documented in `sdk/spec/endpoints.json` with
 * `module === "Modules/Disbursement"`:
 *
 *   - 5 CRUD endpoints (`disbursement.{index,store,show,update,destroy}`)
 *   - 1 lifecycle endpoint (`POST /api/disbursement/confirm`)
 *   - 2 protocol-run reads (`run-global/{disbursement}/{task}`,
 *     `run/{disbursement}/{chain}`) — raw `{ data, chain }` shape
 *   - 1 protocol-integration listing (`/api/protocol/disbursement/all`)
 *
 * Manifest oddity: this module exposes `confirm`, NOT `submit`. The
 * client method name follows the upstream route. Auth: every route is
 * `auth:api`.
 */
import { BaseApiClient } from '../api-client';
import type { ApiRequestOptions, ApiResponse } from '../api-client';
import type {
  DisbursementChainId,
  DisbursementConfirmInput,
  DisbursementConfirmResource,
  DisbursementId,
  DisbursementResource,
  DisbursementRunResource,
  DisbursementStoreInput,
  DisbursementTaskId,
  DisbursementUpdateInput,
} from '../types/modules-disbursement';

/**
 * Public client over `/api/disbursement/*` and `/api/protocol/disbursement/*`.
 * Subclasses `BaseApiClient` for auth / `X-Domain` / `_method` / `ApiError`.
 */
export class DisbursementModuleApiClient extends BaseApiClient {
  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------

  /** GET `/api/disbursement`. (`disbursement.index`) */
  list(opts?: ApiRequestOptions): Promise<ApiResponse<DisbursementResource[]>> {
    return this.get<DisbursementResource[]>('/api/disbursement', undefined, opts);
  }

  /** POST `/api/disbursement`. (`disbursement.store`) */
  create(
    body: DisbursementStoreInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<DisbursementResource>> {
    return this.post<DisbursementResource>('/api/disbursement', body, opts);
  }

  /** GET `/api/disbursement/{disbursement}`. (`disbursement.show`) */
  show(
    disbursement: DisbursementId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<DisbursementResource>> {
    return this.get<DisbursementResource>(
      `/api/disbursement/${encodeURIComponent(String(disbursement))}`,
      undefined,
      opts,
    );
  }

  /** PUT `/api/disbursement/{disbursement}` — sent as POST + `?_method=PUT`. (`disbursement.update`) */
  update(
    disbursement: DisbursementId,
    body: DisbursementUpdateInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<DisbursementResource>> {
    return this.put<DisbursementResource>(
      `/api/disbursement/${encodeURIComponent(String(disbursement))}`,
      body,
      opts,
    );
  }

  /** DELETE `/api/disbursement/{disbursement}`. (`disbursement.destroy`) */
  destroy(
    disbursement: DisbursementId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<DisbursementResource>> {
    return this.delete<DisbursementResource>(
      `/api/disbursement/${encodeURIComponent(String(disbursement))}`,
      opts,
    );
  }

  // ---------------------------------------------------------------------------
  // Lifecycle (note: this module uses `confirm`, not `submit`)
  // ---------------------------------------------------------------------------

  /** POST `/api/disbursement/confirm`. (`post.api.disbursement.confirm`) */
  confirm(
    body: DisbursementConfirmInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<DisbursementConfirmResource>> {
    return this.post<DisbursementConfirmResource>('/api/disbursement/confirm', body, opts);
  }

  // ---------------------------------------------------------------------------
  // Protocol run reads
  // ---------------------------------------------------------------------------

  /** GET `/api/disbursement/run-global/{disbursement}/{task}`. (`get.api.disbursement.run-global.item.item`) */
  runGlobal(
    disbursement: DisbursementId,
    task: DisbursementTaskId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<DisbursementRunResource>> {
    const d = encodeURIComponent(String(disbursement));
    const t = encodeURIComponent(String(task));
    return this.get<DisbursementRunResource>(`/api/disbursement/run-global/${d}/${t}`, undefined, opts);
  }

  /** GET `/api/disbursement/run/{disbursement}/{chain}`. (`get.api.disbursement.run.item.item`) */
  run(
    disbursement: DisbursementId,
    chain: DisbursementChainId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<DisbursementRunResource>> {
    const d = encodeURIComponent(String(disbursement));
    const c = encodeURIComponent(String(chain));
    return this.get<DisbursementRunResource>(`/api/disbursement/run/${d}/${c}`, undefined, opts);
  }

  // ---------------------------------------------------------------------------
  // Protocol integration
  // ---------------------------------------------------------------------------

  /** GET `/api/protocol/disbursement/all`. (`get.api.protocol.disbursement.all`) */
  listProtocolDisbursements(
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<DisbursementResource[]>> {
    return this.get<DisbursementResource[]>('/api/protocol/disbursement/all', undefined, opts);
  }
}
