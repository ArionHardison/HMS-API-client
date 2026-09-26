/**
 * Types for `LmsApiClient` — the Lms inbound grading webhook.
 *
 * Source of truth: `Modules/Lms/Routes/api.php`,
 * `LmsGradingWebhookController`, `StoreLmsGradingRequest`. Single endpoint,
 * `auth:sanctum` + `abilities:lms:writer` + idempotency. Returns HTTP 202
 * (status `accepted` on first write, `replayed` on a duplicate enrollment).
 */
/** Body for `POST /api/v1/integrations/lms/grading` (StoreLmsGradingRequest). */
export interface StoreLmsGradingRequest {
    external_enrollment_id: string;
    user_id: number;
    course_id: number;
    /** Server rule `between:0,1`. */
    score: number;
    /** A date string (server rule `date`). */
    completed_at: string;
    certificate_url?: string | null;
}
/** 202 body for `POST /api/v1/integrations/lms/grading`. */
export interface LmsGradingResponse {
    /** `accepted` on first write; `replayed` on a duplicate enrollment id. */
    status: 'accepted' | 'replayed';
    reward_id: number;
    rollout_id: number;
}
//# sourceMappingURL=lms.d.ts.map