/**
 * Type definitions for `Modules/Assessments` (~31 endpoints).
 *
 * Structural interfaces only — no runtime code. Mirrors the Laravel resources
 * surfaced under `Modules\Assessments\Transformers\*Resource`. The slice
 * covers survey/assessment execution, attend lifecycle, choice deletion,
 * questions, and responses.
 *
 * Most fields are typed `unknown` because the upstream `*Resource` exposes
 * pass-through JSON columns. Tighten downstream when you know what you want.
 */
/** Route-bound id alias for `{assessment}`. */
export type AssessmentId = number | string;
/** Route-bound id alias for `{attend}`. */
export type AttendId = number | string;
/** Route-bound id alias for `{question}`. */
export type QuestionId = number | string;
/** Route-bound id alias for `{response}`. */
export type ResponseId = number | string;
/** Route-bound id alias for `{choice}`. */
export type ChoiceId = number | string;
/** Route-bound id alias for `{task}` / `{chain}` parameters used by `run-global` / `run`. */
export type ChainOrTaskId = number | string;
/** Generic assessment record. */
export interface AssessmentResource {
    id: number;
    name: unknown;
    description: unknown;
    type: unknown;
    status: unknown;
    metadata: unknown;
    created_at: string;
    updated_at: string;
}
/** `attend` record — execution of an assessment. */
export interface AttendResource {
    id: number;
    user_id: number;
    assessment_id: number;
    status: unknown;
    metadata: unknown;
    created_at: string;
    updated_at: string;
}
/** Question record. */
export interface QuestionResource {
    id: number;
    assessment_id: number;
    body: unknown;
    type: unknown;
    choices: unknown;
    metadata: unknown;
    created_at: string;
    updated_at: string;
}
/** Response record. */
export interface ResponseResource {
    id: number;
    attend_id: number;
    question_id: number;
    value: unknown;
    metadata: unknown;
    created_at: string;
    updated_at: string;
}
/** Item-instance record returned by `/api/protocol/assessment/item-instances/{assessment}`. */
export interface AssessmentItemInstanceResource {
    id: number;
    assessment_id: number;
    metadata: unknown;
}
/** Run-* response payload (loose). */
export interface RunAssessmentResponse {
    assessment_id: number;
    task_id?: number;
    chain_id?: number;
    state: unknown;
    metadata?: unknown;
}
/** POST /api/assessment — create body (loose). */
export interface CreateAssessmentInput {
    name: string;
    description?: string;
    type?: string;
    metadata?: unknown;
    [key: string]: unknown;
}
/** POST /api/attend — create body. */
export interface CreateAttendInput {
    assessment_id: number | string;
    user_id?: number | string;
    metadata?: unknown;
    [key: string]: unknown;
}
/** POST /api/question — create body. */
export interface CreateQuestionInput {
    assessment_id: number | string;
    body: string;
    type?: string;
    choices?: unknown;
    metadata?: unknown;
    [key: string]: unknown;
}
/** POST /api/response — create body. */
export interface CreateResponseInput {
    attend_id: number | string;
    question_id: number | string;
    value: unknown;
    metadata?: unknown;
    [key: string]: unknown;
}
/** Protocol integration listing record (`/api/protocol/assessment/all`). */
export interface AssessmentsProtocolIntegrationResource {
    id: number;
    name: unknown;
    description: unknown;
    metadata: unknown;
}
//# sourceMappingURL=modules-assessments.d.ts.map