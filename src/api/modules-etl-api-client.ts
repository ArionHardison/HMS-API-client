/**
 * `Modules/ETL` API client.
 *
 * Covers the 7 endpoints from `sdk/spec/endpoints.json` with
 * `module === "Modules/ETL"`:
 *
 *   - 1 protocol-integration listing (`/api/protocol/etl/all`) — unversioned
 *   - 5 versioned core endpoints under `/api/v1/etl/*`:
 *       * `agent/process`        — agent-driven ETL pipeline kickoff
 *       * `cancel/{pipelineId}`  — cancel a running pipeline
 *       * `components`           — discovery of registered ETL components
 *       * `process`              — start a generic ETL pipeline
 *       * `search-analyze`       — search + analyze pipeline shorthand
 *   - 1 versioned polling endpoint (`status/{pipelineId}`) exposed as
 *     `getStatus(pipelineId)`. Callers can poll this for completion —
 *     the SDK does NOT subscribe to broadcasts here.
 *
 * The `/api/v1/` prefix on the versioned endpoints is preserved as part
 * of each path string per the slice manifest. All endpoints are
 * `auth:sanctum` upstream — Bearer required.
 */
import { BaseApiClient } from '../api-client';
import type { ApiRequestOptions, ApiResponse } from '../api-client';
import type {
  ETLAgentProcessInput,
  ETLCancelResource,
  ETLComponentsResource,
  ETLPipelineResource,
  ETLProcessInput,
  ETLProtocolIntegrationResource,
  ETLSearchAnalyzeInput,
  ETLStatusResource,
  PipelineId,
} from '../types/modules-etl';

/**
 * Public client over `/api/v1/etl/*` (versioned) and
 * `/api/protocol/etl/all` (unversioned protocol listing). Subclasses
 * `BaseApiClient` for token / domain handling.
 */
export class ETLModuleApiClient extends BaseApiClient {
  // ---------------------------------------------------------------------------
  // Protocol integration (unversioned)
  // ---------------------------------------------------------------------------

  /** GET `/api/protocol/etl/all`. (`etl.protocol.all`) */
  listProtocolEtl(
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ETLProtocolIntegrationResource[]>> {
    return this.get<ETLProtocolIntegrationResource[]>(
      '/api/protocol/etl/all',
      undefined,
      opts,
    );
  }

  // ---------------------------------------------------------------------------
  // Pipeline kickoff (versioned)
  // ---------------------------------------------------------------------------

  /** POST `/api/v1/etl/process` — start a generic ETL pipeline. (`etl.process`) */
  process(
    body: ETLProcessInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ETLPipelineResource>> {
    return this.post<ETLPipelineResource>('/api/v1/etl/process', body, opts);
  }

  /** POST `/api/v1/etl/agent/process` — agent-driven ETL pipeline. (`etl.agent.process`) */
  agentProcess(
    body: ETLAgentProcessInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ETLPipelineResource>> {
    return this.post<ETLPipelineResource>('/api/v1/etl/agent/process', body, opts);
  }

  /** POST `/api/v1/etl/search-analyze` — search + analyze shorthand. (`etl.search-analyze`) */
  searchAnalyze(
    body: ETLSearchAnalyzeInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ETLPipelineResource>> {
    return this.post<ETLPipelineResource>('/api/v1/etl/search-analyze', body, opts);
  }

  // ---------------------------------------------------------------------------
  // Pipeline lifecycle (versioned)
  // ---------------------------------------------------------------------------

  /** POST `/api/v1/etl/cancel/{pipelineId}` — abort a running pipeline. (`etl.cancel`) */
  cancel(
    pipelineId: PipelineId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ETLCancelResource>> {
    const id = encodeURIComponent(String(pipelineId));
    return this.post<ETLCancelResource>(`/api/v1/etl/cancel/${id}`, undefined, opts);
  }

  /**
   * GET `/api/v1/etl/status/{pipelineId}` — current pipeline status.
   * Polling endpoint: callers can poll this method for completion. The
   * server returns `{ status, progress, ... }`; downstream callers
   * decide their own polling cadence and termination predicate.
   * (`etl.status`)
   */
  getStatus(
    pipelineId: PipelineId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ETLStatusResource>> {
    const id = encodeURIComponent(String(pipelineId));
    return this.get<ETLStatusResource>(`/api/v1/etl/status/${id}`, undefined, opts);
  }

  // ---------------------------------------------------------------------------
  // Discovery (versioned)
  // ---------------------------------------------------------------------------

  /** GET `/api/v1/etl/components` — list registered ETL components. (`etl.components`) */
  components(
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ETLComponentsResource>> {
    return this.get<ETLComponentsResource>('/api/v1/etl/components', undefined, opts);
  }
}
