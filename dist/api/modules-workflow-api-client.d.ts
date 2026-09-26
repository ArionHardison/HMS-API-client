/**
 * `Modules/Workflow` API client.
 *
 * Covers the 5 endpoints from `sdk/spec/endpoints.json` with
 * `module === "Modules/Workflow"`:
 *
 *   - 4 Codify-pipeline endpoints — `start`, `save-response`,
 *     `check-pipeline/{session}` (polling), `stop/{session}`. These are
 *     `auth:public` upstream — callers MUST pass `{ auth: false }` per
 *     call so the SDK omits the Authorization header.
 *   - 1 protocol-integration listing (`/api/protocol/workflow/all`),
 *     `auth:api` (Bearer required).
 *
 * Public-endpoint policy: this client does NOT default `auth: false` for
 * the codify-pipeline methods so the BaseApiClient contract stays
 * uniform across the SDK. Callers always opt out per-call.
 *
 * `checkPipeline(session)` is the polling endpoint — callers can poll it
 * for codify-pipeline progress until `status` reaches a terminal state.
 */
import { BaseApiClient } from '../api-client';
import type { ApiRequestOptions, ApiResponse } from '../api-client';
import type { CodifyPipelineSaveResponseResource, CodifyPipelineSessionId, CodifyPipelineStateResource, CodifyPipelineStopResource, SaveCodifyPipelineResponseInput, StartCodifyPipelineInput, WorkflowProtocolIntegrationResource } from '../types/modules-workflow';
/**
 * Public client over `/api/workflow/codify-pipeline/*` (public) and
 * `/api/protocol/workflow/all` (authed). Subclasses `BaseApiClient`.
 */
export declare class WorkflowModuleApiClient extends BaseApiClient {
    /** GET `/api/protocol/workflow/all`. (`get.api.protocol.workflow.all`) */
    listProtocolWorkflows(opts?: ApiRequestOptions): Promise<ApiResponse<WorkflowProtocolIntegrationResource[]>>;
    /**
     * POST `/api/workflow/codify-pipeline/start` — kick off a codify run.
     * `auth:public`. (`post.api.workflow.codify-pipeline.start`)
     *
     * Pass `{ auth: false }` to omit the Authorization header. If the
     * input contains a `file` (`Blob`/`File`) the BaseApiClient switches
     * to multipart automatically.
     */
    start(body: StartCodifyPipelineInput, opts?: ApiRequestOptions): Promise<ApiResponse<CodifyPipelineStateResource>>;
    /**
     * POST `/api/workflow/codify-pipeline/save-response` — feed a
     * user-provided answer back into a running pipeline. `auth:public`.
     * (`post.api.workflow.codify-pipeline.save-response`)
     */
    saveResponse(body: SaveCodifyPipelineResponseInput, opts?: ApiRequestOptions): Promise<ApiResponse<CodifyPipelineSaveResponseResource>>;
    /**
     * GET `/api/workflow/codify-pipeline/check-pipeline/{session}` —
     * polling endpoint. `auth:public`.
     * (`get.api.workflow.codify-pipeline.check-pipeline.item`)
     *
     * Callers can poll this method for codify-pipeline progress; the SDK
     * does NOT subscribe to broadcasts here — wire that up separately.
     */
    checkPipeline(session: CodifyPipelineSessionId, opts?: ApiRequestOptions): Promise<ApiResponse<CodifyPipelineStateResource>>;
    /**
     * GET `/api/workflow/codify-pipeline/stop/{session}` — abort a run.
     * `auth:public`. (`get.api.workflow.codify-pipeline.stop.item`)
     *
     * NB: this is a GET in the upstream router — POST would be more
     * RESTful but we mirror the actual route definition.
     */
    stop(session: CodifyPipelineSessionId, opts?: ApiRequestOptions): Promise<ApiResponse<CodifyPipelineStopResource>>;
}
//# sourceMappingURL=modules-workflow-api-client.d.ts.map