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
export class HitlApiClient extends BaseApiClient {
    /**
     * POST /api/v1/integrations/hitl/requested — register a pending HITL
     * approval (emr-mcp and other agent runtimes). `args` is `present`+`array`
     * server-side, so send `{}` / `[]` when there are none. Returns 202.
     */
    async requestApproval(body, idempotencyKey, opts) {
        return this.post('/api/v1/integrations/hitl/requested', body, withIdempotency(idempotencyKey, opts));
    }
    /**
     * POST /api/v1/integrations/hitl/resume — record a reviewer's
     * approve/reject/escalate decision against a pending approval. A 404 means
     * the approval_id is unknown for the resolved tenant; an already-resolved
     * approval returns the cached decision (202). Returns 202.
     */
    async resume(body, idempotencyKey, opts) {
        return this.post('/api/v1/integrations/hitl/resume', body, withIdempotency(idempotencyKey, opts));
    }
}
//# sourceMappingURL=hitl-api-client.js.map