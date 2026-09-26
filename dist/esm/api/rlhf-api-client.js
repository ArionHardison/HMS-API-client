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
import { BaseApiClient } from '../api-client';
/**
 * Fold an optional `Idempotency-Key` into the per-call request options
 * without clobbering any caller-supplied `opts.headers`.
 */
function withIdempotency(idempotencyKey, opts) {
    if (!idempotencyKey) {
        return opts;
    }
    return {
        ...(opts ?? {}),
        headers: { ...(opts?.headers ?? {}), 'Idempotency-Key': idempotencyKey },
    };
}
export class RlhfApiClient extends BaseApiClient {
    /**
     * POST /api/v1/rlhf/submissions → upstream POST /api/mobile/v1/submissions.
     * Body forwarded verbatim. Pass an `idempotencyKey` so the upstream cache
     * key matches api/'s IdempotencyMiddleware. Requires `rlhf:writer`.
     */
    async submit(body, idempotencyKey, opts) {
        return this.post('/api/v1/rlhf/submissions', body, withIdempotency(idempotencyKey, opts));
    }
    /**
     * POST /api/v1/rlhf/grades/{course_id}/{assignment_id} → upstream
     * POST /api/courses/:c/assignments/:a/grades. Requires `rlhf:writer`.
     */
    async grade(courseId, assignmentId, body, idempotencyKey, opts) {
        return this.post(`/api/v1/rlhf/grades/${encodeURIComponent(String(courseId))}/${encodeURIComponent(String(assignmentId))}`, body, withIdempotency(idempotencyKey, opts));
    }
    /**
     * GET /api/v1/rlhf/rubrics/{question_id} → upstream GET
     * /api/questions/:id/rubric. Read-only; requires `rlhf:reader`.
     */
    async getRubric(questionId) {
        return this.get(`/api/v1/rlhf/rubrics/${encodeURIComponent(String(questionId))}`);
    }
}
//# sourceMappingURL=rlhf-api-client.js.map