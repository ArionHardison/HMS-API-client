/**
 * Type definitions for the Deal Runtime Wizard slice of the P2X API —
 * the `POST/GET /api/wizard/deal/*` routes served by
 * `Modules\Deals\Http\Controllers\DealWizardController` and
 * `Modules\Deals\Http\Controllers\DealVerificationController`
 * (route file: `Modules/Deals/Routes/api.php`).
 *
 * Every request shape is derived from the controller action's
 * `$request->validate([...])` (or its FormRequest) and every response shape
 * from the controller's `response()->json(...)` payload / the
 * `Modules\Deals\Http\Resources\DealResource`. Nothing here is invented —
 * if a field isn't asserted by the api, it is typed `unknown` rather than
 * guessed.
 *
 * Wire notes that the SDK client layer handles, not these types:
 *   - `X-Domain` (tenant) + `Authorization: Bearer` on every call.
 *   - `Idempotency-Key` on writes (POST/PATCH/DELETE) — surfaced as the
 *     `idempotencyKey` argument on the write methods.
 *   - PATCH → POST + `?_method=PATCH` (Laravel verb override).
 */
/**
 * Full Deal snapshot. Returned standalone by `GET .../status` and merged into
 * the `{ deal_id, state, ... }` envelope by the mutation endpoints. JSON
 * envelope columns (`problem`, `solutions`, …) are `unknown`/loose because the
 * api persists free-form LLM output there; the lifecycle scalars are pinned.
 */
export interface DealResource {
    deal_id: string;
    user_id: number | null;
    subproject_id: number | null;
    tld: string | null;
    /**
     * Lifecycle state. The legacy enum is
     * analyzing → codified → setup → executing → verifying → completed, plus the
     * pre-runtime holding state `awaiting_compute` written by `submit`.
     */
    state: string;
    wizard_step: number | null;
    current_step_idx: number | null;
    problem: DealProblem | null;
    solutions: DealSolution[] | null;
    selected_solution_idx: number | null;
    stakeholders: DealStakeholder[] | null;
    financing: DealFinancing | null;
    expertise: Record<string, unknown> | null;
    pipeline_steps: unknown[] | null;
    outcome_score: number | null;
    outcome_report: Record<string, unknown> | null;
    ontology_class: string | null;
    ontology_version: string | null;
    created_at: string | null;
    updated_at: string | null;
    completed_at: string | null;
}
/** The `problem` JSON envelope on a Deal. */
export interface DealProblem {
    statement?: string;
    intent_slug?: string | null;
    classification?: unknown;
    ontology_class?: string | null;
    /** Step-1 follow-up questions (flat keys or `{key, question, ...}` entries). */
    required_info?: Array<string | DealRequiredInfoEntry>;
    /** Answers keyed by required-info key (define-time prefills + user echoes). */
    answers?: Record<string, unknown>;
    slot_resolution?: {
        prefilled?: string[];
        omitted?: string[];
        sources?: Record<string, unknown>;
    };
    /** Intake (F1) fields mirrored into the problem envelope by patchMetadata. */
    title?: string;
    description?: string;
    related_industries?: unknown[];
    [key: string]: unknown;
}
/** A single Step-1 required-info question entry. */
export interface DealRequiredInfoEntry {
    key: string;
    question?: string;
    required?: boolean;
    priority?: number | null;
    type?: string | null;
    enum_values?: unknown;
    depends_on?: unknown;
    label?: string | null;
    extraction_hints?: unknown;
    [key: string]: unknown;
}
/** A single generated solution (codify step). */
export interface DealSolution {
    id?: string;
    description?: string;
    confidence?: number;
    success_criteria?: unknown[];
    [key: string]: unknown;
}
/** A single stakeholder entry (codify step). */
export interface DealStakeholder {
    role?: string;
    onet_code?: string | null;
    actor_type?: string;
    actor_ref?: string;
    capability_required?: string;
    median_hourly_wage_cents?: number;
    estimated_hours?: number;
    involvement_level?: string;
    status?: string;
    [key: string]: unknown;
}
/** The `financing` envelope (codify step). */
export interface DealFinancing {
    total_cents?: number;
    currency?: string;
    breakdown?: unknown[];
    payment_model?: string;
    insurance_coverage?: Record<string, unknown>;
    [key: string]: unknown;
}
/**
 * Envelope returned by the mutation endpoints (define, required-info, codify,
 * select-solution, setup, start, metadata, details, path, submit): the
 * DealResource fields plus the redundant top-level `deal_id`/`state`. `define`
 * additionally adds a top-level `id` (canonical key the sys/ wizard reads).
 */
export interface DealMutationResponse extends DealResource {
    /** Redundant top-level alias; equals `deal_id`. */
    state: string;
    /** Only present on the `define` response — canonical id alias. */
    id?: string;
}
export interface DefineDealRequest {
    /** Free-text problem statement. api rule: required, string, 1–8000 chars. */
    statement: string;
    /**
     * Codify TLD — bare (`accountants`) or prefixed (`codify.accountants`).
     * api normalizes both to `codify.<tld>`. api rule: nullable, string, max 64.
     */
    tld?: string;
    /**
     * Optional partial override of the problem block. The controller reads
     * `problem.intent_slug` and `problem.required_parameters`; other keys pass
     * through into the persisted `problem` envelope.
     */
    problem?: {
        intent_slug?: string | null;
        required_parameters?: unknown[];
        [key: string]: unknown;
    };
    [key: string]: unknown;
}
export interface RequiredInfoRequest {
    /** Map of required-info key → answer value. */
    answers: Record<string, unknown>;
}
/** 422 body when a declared key is unanswered. */
export interface MissingRequiredInfoError {
    error: 'missing_required_info';
    missing: string[];
}
/** 502 body when strict-schema solution generation fails. */
export interface SolutionGenerationError {
    error: 'solution_generation_failed';
    message: string;
}
export interface SelectSolutionRequest {
    /** Zero-based index into the generated `solutions[]`. */
    solution_idx: number;
}
export type DealApplicantType = 'Builder' | 'Organizer' | 'Promoter';
export interface PatchMetadataRequest {
    title: string;
    description: string;
    applicant_type: DealApplicantType;
    related_industries?: unknown[] | null;
}
export type DealBudgetTier = 'lt5k' | 'lt30k' | 'lt100k' | 'gte100k';
export interface PatchDetailsRequest {
    customer_user_id?: number | null;
    start_date?: string | null;
    end_date?: string | null;
    budget_tier: DealBudgetTier;
}
export type DealFileType = 'document' | 'image' | 'logo';
export interface UploadFileRequest {
    /** The binary to upload — serialized as multipart/form-data by the client. */
    file: Blob;
    file_type: DealFileType;
}
/** The `deal_files` row returned (201) by uploadFile / read by deleteFile. */
export interface DealFileResource {
    id: number | string;
    deal_id: string;
    file_path: string;
    file_type: string;
    mime_type: string | null;
    uploaded_by_user_id: number | null;
    created_at?: string | null;
    updated_at?: string | null;
    [key: string]: unknown;
}
export type DealPathTier = 'pink' | 'green' | 'blue' | 'red' | 'black';
export interface PatchPathRequest {
    path_tier: DealPathTier;
}
/** 422 body when required intake fields are missing on submit. */
export interface MissingWizardDataError {
    error: 'missing_wizard_data';
    missing: string[];
}
/** The 5-tier compute deposit ladder (pink/green/blue/red/black), in cents. */
export type ComputeDepositAmountCents = 100 | 1000 | 10000 | 100000 | 1000000;
export interface ComputeDepositRequest {
    amount_cents: ComputeDepositAmountCents;
}
export interface ComputeDepositResponse {
    /** Stripe PaymentIntent client secret for the on-surface confirm step. */
    client_secret: string | null;
}
export interface VerifyOutcomeResponse {
    deal_id: string;
    state: string;
    outcome_score: number | null;
    outcome_class: string | null;
    outcome_report: Record<string, unknown>;
}
export interface DealEvent {
    deal_id: string;
    sequence: number;
    event_type: string;
    payload: Record<string, unknown> | null;
    actor_ref: string | null;
    created_at?: string | null;
    [key: string]: unknown;
}
export interface DealEventsResponse {
    events: DealEvent[];
    pagination: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
}
/** Query params accepted by `GET .../events`. */
export interface DealEventsQuery {
    /** Clamped server-side to 1–200; default 50. */
    per_page?: number;
}
//# sourceMappingURL=deal-wizard.d.ts.map