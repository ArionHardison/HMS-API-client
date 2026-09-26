/**
 * RlhfApiClient — covers the CI-RLHF peer-service proxy
 * (`Modules/RLHF/Routes/api.php`, mounted under `/api/v1/rlhf`).
 *
 * Route inventory (source of truth = the api route file + the three proxy
 * controllers in `app/Http/Controllers/RLHF/`):
 *
 *   POST /api/v1/rlhf/submissions                         store (abilities:rlhf:writer)
 *   POST /api/v1/rlhf/grades/{course_id}/{assignment_id}  store (abilities:rlhf:writer)
 *   GET  /api/v1/rlhf/rubrics/{question_id}               show  (abilities:rlhf:reader)
 *
 * Every controller is a thin proxy: it forwards the request body verbatim to
 * the upstream Gradescope fork (rl.tlnt.ai), attaches the caller's
 * `Idempotency-Key`, and surfaces the upstream JSON body + status code
 * unchanged. There is no inner-envelope validation in api/, so request and
 * response bodies are typed loosely.
 *
 * The two writes carry the global `IdempotencyMiddleware`, so callers should
 * pass an `Idempotency-Key` (folded onto `ApiRequestOptions.headers`) for
 * safe retries.
 *
 * `BaseApiClient` already handles `Authorization: Bearer` + `X-Domain`
 * injection and 401 / 422 → callback + `ApiError`.
 */
import { BaseApiClient, type ApiRequestOptions, type ApiResponse } from '../api-client';
import type { RlhfGradeRequest, RlhfProxyResponse, RlhfSubmissionRequest } from '../types/rlhf';
export type { RlhfGradeRequest, RlhfProxyResponse, RlhfSubmissionRequest };
export declare class RlhfApiClient extends BaseApiClient {
    /**
     * POST /api/v1/rlhf/submissions → upstream POST /api/mobile/v1/submissions.
     * Body forwarded verbatim. Pass an `idempotencyKey` so the upstream cache
     * key matches api/'s IdempotencyMiddleware. Requires `rlhf:writer`.
     */
    submit(body: RlhfSubmissionRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<RlhfProxyResponse>>;
    /**
     * POST /api/v1/rlhf/grades/{course_id}/{assignment_id} → upstream
     * POST /api/courses/:c/assignments/:a/grades. Requires `rlhf:writer`.
     */
    grade(courseId: string | number, assignmentId: string | number, body: RlhfGradeRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<RlhfProxyResponse>>;
    /**
     * GET /api/v1/rlhf/rubrics/{question_id} → upstream GET
     * /api/questions/:id/rubric. Read-only; requires `rlhf:reader`.
     */
    getRubric(questionId: string | number): Promise<ApiResponse<RlhfProxyResponse>>;
}
//# sourceMappingURL=rlhf-api-client.d.ts.map