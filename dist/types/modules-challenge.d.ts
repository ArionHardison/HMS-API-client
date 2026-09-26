/**
 * Type definitions for `Modules/Challenge` (~18 endpoints).
 *
 * Structural interfaces only — no runtime code. Mirrors the Laravel resources
 * under `Modules\Challenge\Transformers\*Resource`. Covers challenge CRUD,
 * the challenge-execution surface (run / run-global / start-task / set-result
 * / record-video), task management, and the protocol integration listing.
 *
 * Loose `unknown` fields preserve the pass-through JSON columns the upstream
 * resources expose. The `record-video` endpoint is multipart — see
 * `RecordVideoInput`.
 */
/** Route-bound id alias for `{challenge}`. */
export type ChallengeId = number | string;
/** Route-bound id alias for `{attached}` (attached challenge instance). */
export type AttachedChallengeId = number | string;
/** Route-bound id alias for `{result}`. */
export type ChallengeResultId = number | string;
/** Route-bound id alias for `{task}` and `{chain}` route segments. */
export type ChallengeTaskOrChainId = number | string;
/** Generic challenge record. */
export interface ChallengeResource {
    id: number;
    name: unknown;
    description: unknown;
    type: unknown;
    status: unknown;
    metadata: unknown;
    created_at: string;
    updated_at: string;
}
/** Attached challenge — challenge bound to a user. */
export interface AttachedChallengeResource {
    id: number;
    challenge_id: number;
    user_id: number;
    status: unknown;
    metadata: unknown;
    created_at: string;
    updated_at: string;
}
/** Challenge task record (`get-challenge-tasks`, `get-challenge-global-tasks`). */
export interface ChallengeTaskResource {
    id: number;
    challenge_id: number;
    name: unknown;
    type: unknown;
    payload: unknown;
    metadata: unknown;
}
/** Challenge result record (`set-result/{result}`). */
export interface ChallengeResultResource {
    id: number;
    attached_challenge_id: number;
    task_id: number;
    value: unknown;
    metadata: unknown;
    created_at: string;
    updated_at: string;
}
/** Run / run-global response payload. */
export interface RunChallengeResponse {
    challenge_id: number;
    task_id?: number;
    chain_id?: number;
    state: unknown;
    metadata?: unknown;
}
/** POST /api/challenge — create body. */
export interface CreateChallengeInput {
    name: string;
    description?: string;
    type?: string;
    metadata?: unknown;
    [key: string]: unknown;
}
/** POST /api/challenge/run. */
export interface RunChallengeInput {
    challenge_id: number | string;
    chain_id?: number | string;
    metadata?: unknown;
    [key: string]: unknown;
}
/** POST /api/challenge/run-global. */
export interface RunGlobalChallengeInput {
    challenge_id: number | string;
    task_id?: number | string;
    metadata?: unknown;
    [key: string]: unknown;
}
/** POST /api/challenge/start-task. */
export interface StartChallengeTaskInput {
    challenge_id: number | string;
    task_id: number | string;
    metadata?: unknown;
    [key: string]: unknown;
}
/** POST /api/challenge/set-result/{result}. */
export interface SetChallengeResultInput {
    value?: unknown;
    metadata?: unknown;
    [key: string]: unknown;
}
/**
 * POST /api/challenge/record-video — multipart body. The route in
 * `Modules/Challenge/Routes/api.php` points at `recordVideo` but the
 * controller method is not yet present in the audited slice (manifest
 * oddity); the SDK still surfaces the endpoint and uses `multipart/form-data`
 * because video-upload is the documented intent.
 */
export interface RecordVideoInput {
    /** Binary video upload — typically `video/webm` or `video/mp4`. */
    video: Blob | File;
    /** Optional attached-challenge or task identifiers. */
    attached_challenge_id?: number | string;
    task_id?: number | string;
    metadata?: Record<string, unknown>;
    [key: string]: unknown;
}
/** Protocol integration listing record (`/api/protocol/challenge/all`). */
export interface ChallengeProtocolIntegrationResource {
    id: number;
    name: unknown;
    description: unknown;
    metadata: unknown;
}
//# sourceMappingURL=modules-challenge.d.ts.map