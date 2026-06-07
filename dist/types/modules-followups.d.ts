/**
 * Type definitions for `Modules/FollowUps` (~15 endpoints).
 *
 * Structural interfaces only — no runtime code. Mirrors the Laravel resources
 * under `Modules\FollowUps\Transformers\*Resource`. Covers follow-up CRUD,
 * execution flow (run / get-data / get-timeline / get-current-followup /
 * finish), recommendation handling, payment, and the multipart voice
 * recording surface (`voice-record` + `voice-finalize`).
 *
 * Loose `unknown` fields preserve pass-through JSON columns. `voice-record`
 * is a multipart upload (see `VoiceRecordInput`).
 */
/** Route-bound id alias for `{follow_up}`. */
export type FollowUpId = number | string;
/** Route-bound id alias for `{recommendation}`. */
export type RecommendationId = number | string;
/** Route-bound id alias for `{chain}`. */
export type FollowUpChainId = number | string;
/** Route-bound id alias for `{followup}` (used by `payment` / `recommendations`). */
export type FollowUpInstanceId = number | string;
/**
 * Free-form recommendation status passed in the URL via
 * `/api/follow-up/handle-recommendation/{recommendation}/{status}`.
 */
export type RecommendationStatus = string;
/** Generic follow-up record. */
export interface FollowUpResource {
    id: number;
    name: unknown;
    description: unknown;
    type: unknown;
    status: unknown;
    metadata: unknown;
    created_at: string;
    updated_at: string;
}
/** Recommendation record. */
export interface FollowUpRecommendationResource {
    id: number;
    followup_id: number;
    status: unknown;
    metadata: unknown;
    created_at: string;
    updated_at: string;
}
/** Timeline entry returned by `get-timeline/{chain}`. */
export interface FollowUpTimelineEntry {
    id: number;
    type: unknown;
    occurred_at: string;
    metadata: unknown;
}
/** Payment summary returned by `payment/{followup}`. */
export interface FollowUpPaymentResource {
    id: number;
    followup_id: number;
    amount: number;
    currency?: string;
    status: unknown;
    metadata: unknown;
}
/** Voice-record finalize payload. */
export interface VoiceFinalizeResource {
    follow_up_id: number;
    speech_id: string;
    status: unknown;
    metadata?: unknown;
}
/** POST /api/follow-up — create body. */
export interface CreateFollowUpInput {
    name: string;
    description?: string;
    type?: string;
    metadata?: unknown;
    [key: string]: unknown;
}
/**
 * POST /api/follow-up/voice-record — multipart body. The form rules from the
 * spec require `voice` (wav, max 1000kb), `chain_id`, and `speech_id`; the
 * SDK keeps the `follow_up_id` field optional because the upstream rule is
 * empty-string ("no extra constraint").
 */
export interface VoiceRecordInput {
    voice: Blob | File;
    chain_id: number | string;
    speech_id: string;
    follow_up_id?: number | string;
    [key: string]: unknown;
}
/** POST /api/follow-up/voice-finalize body. */
export interface VoiceFinalizeInput {
    follow_up_id: number | string;
    speech_id: string;
    [key: string]: unknown;
}
//# sourceMappingURL=modules-followups.d.ts.map