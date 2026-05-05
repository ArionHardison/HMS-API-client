/**
 * Type contracts for `ScheduleApiClient`.
 *
 * Source of truth: `sdk/spec/endpoints.json` — entries under `/api/schedule*`
 * and `/api/schedule-call*`. Shapes are derived from each endpoint's
 * `request.shape` / `response.shape`. Where the spec leaves shapes empty
 * (i.e. `{}`), we fall back to permissive `Record<string, unknown>` so the
 * SDK doesn't pretend to know more than the controller does.
 */

/** Single schedule record. The API spec leaves `response.shape: {}` so we
 *  expose a permissive structural type — sufficient for IDE auto-complete
 *  without lying about fields. */
export interface ScheduleRecord {
  id?: number;
  [key: string]: unknown;
}

/** POST /api/schedule body — derived from `StoreScheduleRequest` rules. */
export interface CreateScheduleRequest {
  /** Schedule title — required string. */
  title: string;
  /** Optional notes / description. */
  description?: string;
  /** ISO date or human-readable start. */
  start_at?: string;
  /** ISO date or human-readable end. */
  end_at?: string;
  [key: string]: unknown;
}

/** PUT /api/schedule/{schedule} body — derived from `UpdateScheduleRequest`. */
export interface UpdateScheduleRequest {
  title?: string;
  description?: string;
  start_at?: string;
  end_at?: string;
  [key: string]: unknown;
}

/** Single schedule-call record. */
export interface ScheduleCallRecord {
  id?: number;
  [key: string]: unknown;
}

/** POST /api/schedule-call body. */
export interface CreateScheduleCallRequest {
  /** Topic / title of the call. */
  title?: string;
  /** Date/time the call starts. */
  scheduled_at?: string;
  /** Optional duration in minutes. */
  duration?: number;
  [key: string]: unknown;
}

/** PUT /api/schedule-call/{schedule_call} body. */
export interface UpdateScheduleCallRequest {
  title?: string;
  scheduled_at?: string;
  duration?: number;
  [key: string]: unknown;
}
