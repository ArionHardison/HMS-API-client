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
import { BaseApiClient, type ApiResponse } from '../api-client';
import type { FailEventResource, FailEventShowResponse, FailEventSummaryResponse, FailEventsListResponse, FailEventsQuery, FailRecoveryActionResource } from '../types/fail';
export type { FailEventResource, FailEventShowResponse, FailEventSummaryResponse, FailEventsListResponse, FailEventsQuery, FailRecoveryActionResource, };
export declare class FailApiClient extends BaseApiClient {
    /**
     * GET /api/fail/events — paginated, newest first. Optional filters:
     * `per_page` (1..100, default 25), `root_cause_code`, `protocol_id`.
     * The resource array lands on `ApiResponse.data`; pagination `links`/`meta`
     * ride on the envelope.
     */
    listEvents(query?: FailEventsQuery): Promise<ApiResponse<FailEventsListResponse>>;
    /** GET /api/fail/events/summary — total + per-root-cause counts. */
    getSummary(): Promise<ApiResponse<FailEventSummaryResponse>>;
    /** GET /api/fail/events/{id} — single event with eager-loaded recovery actions. */
    getEvent(id: number): Promise<ApiResponse<FailEventShowResponse>>;
}
//# sourceMappingURL=fail-api-client.d.ts.map