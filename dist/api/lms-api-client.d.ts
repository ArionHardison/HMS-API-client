/**
 * LmsApiClient — covers the Lms inbound grading webhook
 * (`Modules/Lms/Routes/api.php`, mounted under `/api/v1/integrations/lms`).
 *
 * Route inventory (source of truth = the api route file +
 * `LmsGradingWebhookController` + `StoreLmsGradingRequest`):
 *
 *   POST /api/v1/integrations/lms/grading   store  (202)
 *
 * `auth:sanctum` + `abilities:lms:writer` + idempotency. Teachify
 * (codify-education) fires this on course-completion; the api persists an
 * `agent_rollouts` + `rewards` pair (the RLVR signal). Idempotency is keyed
 * on `external_enrollment_id` at the DB level too, so a replay returns 202
 * with `status: 'replayed'`. First write returns `status: 'accepted'`.
 *
 * `BaseApiClient` already handles `Authorization: Bearer` + `X-Domain`
 * injection and 401 / 422 → callback + `ApiError`.
 */
import { BaseApiClient, type ApiRequestOptions, type ApiResponse } from '../api-client';
import type { LmsGradingResponse, StoreLmsGradingRequest } from '../types/lms';
export type { LmsGradingResponse, StoreLmsGradingRequest };
export declare class LmsApiClient extends BaseApiClient {
    /**
     * POST /api/v1/integrations/lms/grading — record a Teachify
     * course-completion event. `score` is `between:0,1`. Returns 202;
     * `status` is `accepted` on first write, `replayed` on a duplicate
     * `external_enrollment_id`.
     */
    submitGrading(body: StoreLmsGradingRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<LmsGradingResponse>>;
}
//# sourceMappingURL=lms-api-client.d.ts.map