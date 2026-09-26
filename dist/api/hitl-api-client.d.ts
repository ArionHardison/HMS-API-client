/**
 * HitlApiClient — covers the HITL (human-in-the-loop) staffing / escalation
 * module (`Modules/Hitl/Routes/api.php`, mounted under
 * `/api/v1/integrations/hitl`).
 *
 * Route inventory (source of truth = the api route file + the two
 * single-action controllers + their FormRequests):
 *
 *   POST /api/v1/integrations/hitl/requested   HitlRequestedController  (202)
 *   POST /api/v1/integrations/hitl/resume      HitlResumeController     (202)
 *
 * Both are `auth:api` + `abilities:hitl:writer` + `idempotency`. Callers send
 * an `Idempotency-Key` (uuid v4) so the global IdempotencyMiddleware can cache
 * the 202 for 24h. Both return HTTP 202, which is inside the default 2xx
 * success range so neither throws.
 *
 * `BaseApiClient` already handles `Authorization: Bearer` + `X-Domain`
 * injection and 401 / 422 → callback + `ApiError`.
 */
import { BaseApiClient, type ApiRequestOptions, type ApiResponse } from '../api-client';
import type { HitlDecision, HitlRequestedRequest, HitlRequestedResponse, HitlResumeRequest, HitlResumeResponse } from '../types/hitl';
export type { HitlDecision, HitlRequestedRequest, HitlRequestedResponse, HitlResumeRequest, HitlResumeResponse, };
export declare class HitlApiClient extends BaseApiClient {
    /**
     * POST /api/v1/integrations/hitl/requested — register a pending HITL
     * approval (emr-mcp and other agent runtimes). `args` is `present`+`array`
     * server-side, so send `{}` / `[]` when there are none. Returns 202.
     */
    requestApproval(body: HitlRequestedRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<HitlRequestedResponse>>;
    /**
     * POST /api/v1/integrations/hitl/resume — record a reviewer's
     * approve/reject/escalate decision against a pending approval. A 404 means
     * the approval_id is unknown for the resolved tenant; an already-resolved
     * approval returns the cached decision (202). Returns 202.
     */
    resume(body: HitlResumeRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<HitlResumeResponse>>;
}
//# sourceMappingURL=hitl-api-client.d.ts.map