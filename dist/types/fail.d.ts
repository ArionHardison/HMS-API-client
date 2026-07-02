/**
 * Types for `FailApiClient` — the Fail (failure-recovery) module.
 *
 * Source of truth: `Modules/Fail/Routes/api.php`, `FailEventController`,
 * `FailEventResource`, `FailRecoveryActionResource`. All three endpoints are
 * read-only (`auth:api`).
 */
/** One recovery action attached to a fail event (FailRecoveryActionResource). */
export interface FailRecoveryActionResource {
    id: number;
    fail_event_id: number;
    action_type: string | null;
    status: string | null;
    module_resource: string | null;
    module_item_id: number | string | null;
    parameters: Record<string, unknown> | null;
    response: Record<string, unknown> | null;
    executed_at: string | null;
    created_at: string | null;
}
/** One fail event (FailEventResource). `recovery_actions` only present on show(). */
export interface FailEventResource {
    id: number;
    subproject_id: number | null;
    user_id: number | null;
    protocol_id: number | null;
    protocol_chain_id: number | null;
    personal_chain_id: number | null;
    step_node_id: number | string | null;
    step_type: string | null;
    next_step_condition: string | null;
    root_cause_code: string | null;
    status: string | null;
    context: Record<string, unknown> | null;
    occurred_at: string | null;
    created_at: string | null;
    recovery_actions?: FailRecoveryActionResource[];
}
/** Query for `GET /api/fail/events`. */
export interface FailEventsQuery {
    /** 1..100, default 25. */
    per_page?: number;
    root_cause_code?: string;
    protocol_id?: number | string;
}
/**
 * `GET /api/fail/events` returns a Laravel paginated AnonymousResourceCollection:
 * `{ data: FailEventResource[], links, meta }`. The SDK's `ApiResponse.data`
 * holds the resource array; `links`/`meta` ride alongside on the envelope.
 */
export type FailEventsListResponse = FailEventResource[];
/**
 * `GET /api/fail/events/{id}` returns `{ data: FailEventResource }`. The SDK
 * surfaces the inner `FailEventResource` directly on `ApiResponse.data`.
 */
export type FailEventShowResponse = FailEventResource;
/**
 * `GET /api/fail/events/summary` returns `{ data: {...} }`. The SDK surfaces
 * this inner object directly on `ApiResponse.data`.
 */
export interface FailEventSummaryResponse {
    total: number;
    /** Map of root_cause_code → count. */
    by_root_cause: Record<string, number>;
}
//# sourceMappingURL=fail.d.ts.map