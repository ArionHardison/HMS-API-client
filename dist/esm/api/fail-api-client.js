/**
 * FailApiClient — covers the Fail (failure-recovery) module
 * (`Modules/Fail/Routes/api.php`, mounted under `/api/fail`).
 *
 * Route inventory (source of truth = the api route file + `FailEventController`
 * + the two JsonResources):
 *
 *   GET /api/fail/events           index   (auth:api) — paginated list
 *   GET /api/fail/events/summary   summary (auth:api) — counts by root cause
 *   GET /api/fail/events/{id}      show    (auth:api) — single event + actions
 *
 * All three are read-only. `index` returns a Laravel paginated
 * AnonymousResourceCollection — `{ data: FailEventResource[], links, meta }`,
 * which maps onto the SDK's `ApiResponse<FailEventResource[]>`. `show` and
 * `summary` return a bare `{ data: ... }` body; their methods type the inner
 * object so consumers read it off `res.data.data`.
 *
 * `BaseApiClient` already handles `Authorization: Bearer` + `X-Domain`
 * injection and 401 / 422 → callback + `ApiError`.
 */
import { BaseApiClient } from '../api-client';
export class FailApiClient extends BaseApiClient {
    /**
     * GET /api/fail/events — paginated, newest first. Optional filters:
     * `per_page` (1..100, default 25), `root_cause_code`, `protocol_id`.
     * The resource array lands on `ApiResponse.data`; pagination `links`/`meta`
     * ride on the envelope.
     */
    async listEvents(query) {
        const params = {};
        if (query?.per_page !== undefined) {
            params.per_page = query.per_page;
        }
        if (query?.root_cause_code !== undefined) {
            params.root_cause_code = query.root_cause_code;
        }
        if (query?.protocol_id !== undefined) {
            params.protocol_id = query.protocol_id;
        }
        return this.get('/api/fail/events', Object.keys(params).length > 0 ? params : undefined);
    }
    /** GET /api/fail/events/summary — total + per-root-cause counts. */
    async getSummary() {
        return this.get('/api/fail/events/summary');
    }
    /** GET /api/fail/events/{id} — single event with eager-loaded recovery actions. */
    async getEvent(id) {
        return this.get(`/api/fail/events/${id}`);
    }
}
//# sourceMappingURL=fail-api-client.js.map