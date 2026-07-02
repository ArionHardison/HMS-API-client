/**
 * HrmApiClient — covers the HRM relay module (`Modules/Hrm/Routes/api.php`,
 * mounted under `/api/v1/integrations/hrm`).
 *
 * Route inventory (source of truth = the api route file +
 * `HrmRelayController` + `HrmRelayRequest`):
 *
 *   POST /api/v1/integrations/hrm/relay   HrmRelayController  (202)
 *
 * `auth:api` + `abilities:hrm:relay` + `idempotency`. The `event` field is
 * the full topic routing key (matched server-side against
 * `/^(workforce|training|hrm)\./`); the api relays `payload` verbatim onto
 * the resolved RabbitMQ topic exchange. Returns HTTP 202.
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
export class HrmApiClient extends BaseApiClient {
    /**
     * POST /api/v1/integrations/hrm/relay — relay a codify-careers/HRM domain
     * event onto the workforce/training topic exchange. `event` must match
     * `/^(workforce|training|hrm)\./`. Returns 202 with the resolved `exchange`.
     */
    async relay(body, idempotencyKey, opts) {
        return this.post('/api/v1/integrations/hrm/relay', body, withIdempotency(idempotencyKey, opts));
    }
}
//# sourceMappingURL=hrm-api-client.js.map