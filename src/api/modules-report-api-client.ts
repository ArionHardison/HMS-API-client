/**
 * `Modules/Report` API client.
 *
 * Covers the 9 endpoints documented in `sdk/spec/endpoints.json` with
 * `module === "Modules/Report"`:
 *
 *   - 5 CRUD endpoints (`report.{index,store,show,update,destroy}`)
 *   - 1 lifecycle endpoint (`POST /api/report/submit`)
 *   - 2 protocol-run reads (`run-global/{report}/{task}`,
 *     `run/{report}/{chain}`) — raw `{ data, chain }` shape
 *   - 1 protocol-integration listing (`/api/protocol/report/all`)
 *
 * Class: `ReportModuleApiClient`. Auth: every route is `auth:api`.
 */
import { BaseApiClient } from '../api-client';
import type { ApiRequestOptions, ApiResponse } from '../api-client';
import type {
  ReportChainId,
  ReportId,
  ReportResource,
  ReportRunResource,
  ReportStoreInput,
  ReportSubmitInput,
  ReportSubmitResource,
  ReportTaskId,
  ReportUpdateInput,
} from '../types/modules-report';

/**
 * Public client over `/api/report/*` and `/api/protocol/report/*`.
 * Subclasses `BaseApiClient` for auth / `X-Domain` / `_method` / `ApiError`.
 */
export class ReportModuleApiClient extends BaseApiClient {
  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------

  /** GET `/api/report`. (`report.index`) */
  list(opts?: ApiRequestOptions): Promise<ApiResponse<ReportResource[]>> {
    return this.get<ReportResource[]>('/api/report', undefined, opts);
  }

  /** POST `/api/report`. (`report.store`) */
  create(body: ReportStoreInput, opts?: ApiRequestOptions): Promise<ApiResponse<ReportResource>> {
    return this.post<ReportResource>('/api/report', body, opts);
  }

  /** GET `/api/report/{report}`. (`report.show`) */
  show(report: ReportId, opts?: ApiRequestOptions): Promise<ApiResponse<ReportResource>> {
    return this.get<ReportResource>(
      `/api/report/${encodeURIComponent(String(report))}`,
      undefined,
      opts,
    );
  }

  /** PUT `/api/report/{report}` — sent as POST + `?_method=PUT`. (`report.update`) */
  update(
    report: ReportId,
    body: ReportUpdateInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ReportResource>> {
    return this.put<ReportResource>(
      `/api/report/${encodeURIComponent(String(report))}`,
      body,
      opts,
    );
  }

  /** DELETE `/api/report/{report}`. (`report.destroy`) */
  destroy(report: ReportId, opts?: ApiRequestOptions): Promise<ApiResponse<ReportResource>> {
    return this.delete<ReportResource>(
      `/api/report/${encodeURIComponent(String(report))}`,
      opts,
    );
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /** POST `/api/report/submit`. (`post.api.report.submit`) */
  submit(
    body: ReportSubmitInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ReportSubmitResource>> {
    return this.post<ReportSubmitResource>('/api/report/submit', body, opts);
  }

  // ---------------------------------------------------------------------------
  // Protocol run reads
  // ---------------------------------------------------------------------------

  /** GET `/api/report/run-global/{report}/{task}`. (`get.api.report.run-global.item.item`) */
  runGlobal(
    report: ReportId,
    task: ReportTaskId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ReportRunResource>> {
    const r = encodeURIComponent(String(report));
    const t = encodeURIComponent(String(task));
    return this.get<ReportRunResource>(`/api/report/run-global/${r}/${t}`, undefined, opts);
  }

  /** GET `/api/report/run/{report}/{chain}`. (`get.api.report.run.item.item`) */
  run(
    report: ReportId,
    chain: ReportChainId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ReportRunResource>> {
    const r = encodeURIComponent(String(report));
    const c = encodeURIComponent(String(chain));
    return this.get<ReportRunResource>(`/api/report/run/${r}/${c}`, undefined, opts);
  }

  // ---------------------------------------------------------------------------
  // Protocol integration
  // ---------------------------------------------------------------------------

  /** GET `/api/protocol/report/all`. (`get.api.protocol.report.all`) */
  listProtocolReports(opts?: ApiRequestOptions): Promise<ApiResponse<ReportResource[]>> {
    return this.get<ReportResource[]>('/api/protocol/report/all', undefined, opts);
  }
}
