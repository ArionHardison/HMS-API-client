/**
 * Personal Chain + Wizard codify-state + Public-codify slice — request /
 * response types.
 *
 * Source of truth: `sdk/spec/endpoints.json` (filtered set captured in
 * `/tmp/personalchain-wizard-slice.json`). Each interface mirrors the
 * `request.shape` or `response.shape` of a single endpoint.
 *
 * `unknown` is used verbatim for fields the manifest could not concretize
 * (Laravel Resource `parent::toArray($request)` calls, etc.) — narrow them at
 * the call site. Structural interfaces only — no branded type aliases — so
 * `sys/` can drop its structural workarounds.
 */

// =============================================================================
// Personal Chain — request bodies
// =============================================================================

/**
 * POST /api/personal-chain/cancel-invitation — body for
 * `CancelInvitationRequest`. `id` is optional; the controller really keys off
 * `personal_chain_id`.
 */
export interface CancelInvitationRequestBody {
  id?: number;
  personal_chain_id: number;
}

/**
 * POST /api/personal-chain/feedback/{chain} — body for
 * `StoreFeebackRequest`. The path param duplicates `chain` because the
 * server validates both.
 */
export interface StoreFeedbackRequestBody {
  feedback: string;
  rating: number;
  chain: number;
}

/** POST /api/personal-chain/find-users-to-invite */
export interface FindUsersToInviteRequestBody {
  chain: number;
  search?: string;
}

/** POST /api/personal-chain/invite */
export interface InviteUserToPersonalChainRequestBody {
  user_id: number;
  source: string;
  personal_chain_id: number;
}

/** POST /api/personal-chain/start-program/{chain} */
export interface StartProgramRequestBody {
  id: number;
}

// =============================================================================
// Personal Chain — response shapes
// =============================================================================

/** GET /api/personal-chain/by-status/{status?} item shape. */
export interface ProtocolPersonalChainSummary {
  id: number;
  name: unknown;
  program_image: unknown;
  status: unknown;
  program: unknown;
  updated_at: string;
}

/** GET /api/personal-chain/finished-not-rated item shape. */
export interface FinishedNotRatedProgramSummary {
  id: number;
  name: unknown;
  image: unknown;
  author: unknown;
}

/** GET /api/personal-chain/last-chain. */
export interface LastChainSummary {
  id: number;
  name: unknown;
  author: unknown;
  program_image: unknown;
  required_time: unknown;
  required_time_range: unknown;
  level: unknown;
}

/**
 * GET /api/personal-chain/{personalChain} — protocol-step resource. Same
 * resource that POST /start-program/{chain} returns.
 */
export interface ProtocolStepData {
  is_attached: boolean;
  is_attached_to: boolean;
  round: unknown;
  require_setup: unknown;
  program_id: number;
  program_name: unknown;
  program_image: unknown;
  is_personal: boolean;
  required_time: unknown;
  required_time_range: unknown;
  author: unknown;
  level: unknown;
  frozen: unknown;
  until: unknown;
  id: number;
  setup_started: unknown;
  type: unknown;
  required_role: unknown;
  module: unknown;
  module_item_id: number;
  title: unknown;
  reason: unknown;
  desc: unknown;
  status: unknown;
  target: unknown;
  started_at: string;
  last_step_time: unknown;
  auto_fail: unknown;
  user: unknown;
  authenticatedUser: unknown;
}

/** GET /api/personal-chain/feedback/{chain} | POST /feedback/{chain}. */
export interface ProgramFeedbackData {
  rating: unknown;
  feedback: unknown;
  user: unknown;
  full_name: unknown;
  profile_picture: unknown;
  username: unknown;
  program: unknown;
  name: unknown;
}

/** Empty-shape resources — endpoints that ack the operation. */
export interface PersonalChainAck {
  [key: string]: unknown;
}

// =============================================================================
// Public Codify — request bodies
// =============================================================================

/**
 * POST /api/public/codify/run — body for `CodifyJobRequest`. `codifyFile`
 * may be a `File` / `Blob` (the controller flags `fileUpload: true`); when
 * present, `BaseApiClient` switches to `multipart/form-data` automatically.
 */
export interface CodifyRunRequestBody {
  codify?: string;
  codifyFile?: Blob | File;
  profile?: string;
  mode?: unknown;
  session: string;
  timezone: string;
}

/** POST /api/public/codify/save-answer */
export interface CodifySaveAnswerRequestBody {
  answer?: string;
  question: string;
  session?: string;
  protocol?: string | number;
}

/** POST /api/public/codify/start-session */
export interface CodifyStartSessionRequestBody {
  session: string;
  is_personal: boolean;
}

// =============================================================================
// Public Codify — response shapes
// =============================================================================

/**
 * GET /api/public/codify/state/{key} — the polling endpoint.
 *
 * The Laravel resource exposes a flat object whose `step`, `running`,
 * `successfully`, `finished`, `preparation_finished` together encode a
 * job-state machine. The SDK exposes a discriminated union (`CodifyJobState`)
 * that callers can `switch` over without re-deriving the state from the raw
 * fields.
 */
export interface CodifyStateRaw {
  running: unknown;
  codify: unknown;
  successfully: unknown;
  finished: unknown;
  preparation_finished: unknown;
  step: unknown;
  questions: unknown;
  preferred_subproject: unknown;
}

/**
 * Pending — the codify job exists but hasn't started executing yet.
 * Mapped from `running === false && finished === false`.
 */
export interface CodifyJobStatePending {
  status: 'pending';
  raw: CodifyStateRaw;
}

/**
 * Running — actively codifying. Mapped from `running === true && finished
 * === false`. `step`, `questions`, `preparation_finished` are surfaced for
 * progress UI.
 */
export interface CodifyJobStateRunning {
  status: 'running';
  step: unknown;
  questions: unknown;
  preparationFinished: unknown;
  raw: CodifyStateRaw;
}

/**
 * Completed — codify reached a terminal state and `successfully === true`.
 */
export interface CodifyJobStateCompleted {
  status: 'completed';
  codify: unknown;
  preferredSubproject: unknown;
  raw: CodifyStateRaw;
}

/**
 * Failed — `finished === true && successfully === false`. Same payload as
 * completed minus the success flag, kept as `raw` for the UI to inspect.
 */
export interface CodifyJobStateFailed {
  status: 'failed';
  raw: CodifyStateRaw;
}

/** Discriminated union returned by the polling helper. */
export type CodifyJobState =
  | CodifyJobStatePending
  | CodifyJobStateRunning
  | CodifyJobStateCompleted
  | CodifyJobStateFailed;

/** Empty-shape codify resources. */
export interface CodifyAck {
  [key: string]: unknown;
}

// =============================================================================
// Wizard codify (auth=api, separate from the Five-Step `WizardApiClient`)
// =============================================================================

/**
 * POST /api/wizard/codify/{protocol} — body for `CodifyWizardRequest`.
 * Either `codify` (text) or `codifyFile` (Blob/File) may be present.
 */
export interface WizardCodifyRequestBody {
  codify?: string;
  codifyFile?: Blob | File;
}
