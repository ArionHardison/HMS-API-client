/**
 * PersonalChainWizardApiClient — covers every endpoint in the
 * **PersonalChain + Wizard codify-state + Public-codify** slice of the P2X
 * API. Source of truth: `sdk/spec/endpoints.json` (filtered set captured in
 * `/tmp/personalchain-wizard-slice.json` during the worktree run).
 *
 * Scope (26 routes):
 *   - `/api/personal-chain/*`   (start-program, by-status, tasks, feedback,
 *                                invite/decline/join/reject/cancel, force-defrost,
 *                                last-chain, get-recommended, finished-not-rated)
 *   - `/api/public/codify/*`    (codify-state polling, run, save-answer,
 *                                start-session, answers, cancel)
 *   - `/api/wizard/codify/*`    (the **codify entry**, NOT the existing
 *                                Five-Step methods on `WizardApiClient`)
 *
 * The Five-Step Wizard methods (`/wizard/start`, `/wizard/deal/*`,
 * `/wizard/job/*`) live on `WizardApiClient` and are intentionally untouched
 * here — see the integration block at the bottom of this file for how the
 * two clients fit together.
 *
 * The class extends `BaseApiClient`, which already handles:
 *   - Bearer token injection (skipped per call via `{ auth: false }`)
 *   - `X-Domain` header from `getDomain`
 *   - PUT/PATCH → POST + `?_method=...` (no PUT/PATCH in this slice)
 *   - DELETE stays a real DELETE
 *   - FormData switching when payload contains a `File`/`Blob`
 *   - 401 / 422 → callback + normalized `ApiError`
 *
 * Wrapper handling: every endpoint in this slice emits `wrapper: "data"`, so
 * the typed payload sits in `.data` of the standard envelope.
 */
import { BaseApiClient, type ApiResponse } from '../api-client';
import type { CancelInvitationRequestBody, CodifyAck, CodifyJobState, CodifyRunRequestBody, CodifySaveAnswerRequestBody, CodifyStartSessionRequestBody, CodifyStateRaw, FindUsersToInviteRequestBody, FinishedNotRatedProgramSummary, InviteUserToPersonalChainRequestBody, LastChainSummary, PersonalChainAck, ProgramFeedbackData, ProtocolPersonalChainSummary, ProtocolStepData, StartProgramRequestBody, StoreFeedbackRequestBody, WizardCodifyRequestBody } from '../types/personal-chain-wizard';
export type { CancelInvitationRequestBody, CodifyAck, CodifyJobState, CodifyRunRequestBody, CodifySaveAnswerRequestBody, CodifyStartSessionRequestBody, CodifyStateRaw, FindUsersToInviteRequestBody, FinishedNotRatedProgramSummary, InviteUserToPersonalChainRequestBody, LastChainSummary, PersonalChainAck, ProgramFeedbackData, ProtocolPersonalChainSummary, ProtocolStepData, StartProgramRequestBody, StoreFeedbackRequestBody, WizardCodifyRequestBody, };
export declare class PersonalChainWizardApiClient extends BaseApiClient {
    /**
     * GET /api/personal-chain/by-status/{status?}
     *
     * Spec lists `status` as optional; we omit the trailing segment entirely
     * when undefined so Laravel routes to the catch-all variant.
     */
    getByStatus(status?: string | number): Promise<ApiResponse<ProtocolPersonalChainSummary[]>>;
    /** POST /api/personal-chain/cancel-invitation */
    cancelInvitation(body: CancelInvitationRequestBody): Promise<ApiResponse<PersonalChainAck>>;
    /**
     * GET /api/personal-chain/decline/{invite}/{source?}
     *
     * Spec auth is `public` — no Bearer required. Used from invite emails
     * where the recipient may not be signed in yet.
     */
    decline(invite: string | number, source?: string | number): Promise<ApiResponse<PersonalChainAck>>;
    /** POST /api/personal-chain/feedback/{chain} */
    postFeedback(chain: string | number, body: StoreFeedbackRequestBody): Promise<ApiResponse<ProgramFeedbackData>>;
    /** GET /api/personal-chain/feedback/{chain} */
    getFeedback(chain: string | number): Promise<ApiResponse<ProgramFeedbackData>>;
    /** POST /api/personal-chain/find-users-to-invite */
    findUsersToInvite(body: FindUsersToInviteRequestBody): Promise<ApiResponse<PersonalChainAck>>;
    /** GET /api/personal-chain/finished-not-rated */
    getFinishedNotRated(): Promise<ApiResponse<FinishedNotRatedProgramSummary[]>>;
    /** GET /api/personal-chain/force-defrost/{chain} */
    forceDefrost(chain: string | number): Promise<ApiResponse<PersonalChainAck>>;
    /** GET /api/personal-chain/get-recommended */
    getRecommended(): Promise<ApiResponse<PersonalChainAck>>;
    /** POST /api/personal-chain/invite */
    invite(body: InviteUserToPersonalChainRequestBody): Promise<ApiResponse<PersonalChainAck>>;
    /**
     * GET /api/personal-chain/join/{token}/{source?}
     *
     * Spec auth is `public`. Same pattern as decline — invite landing page.
     */
    join(token: string, source?: string | number): Promise<ApiResponse<PersonalChainAck>>;
    /** GET /api/personal-chain/last-chain */
    getLastChain(): Promise<ApiResponse<LastChainSummary>>;
    /** POST /api/personal-chain/start-program/{chain} */
    startProgram(chain: string | number, body: StartProgramRequestBody): Promise<ApiResponse<ProtocolStepData>>;
    /** GET /api/personal-chain/task/{taskId} */
    getTask(taskId: string | number): Promise<ApiResponse<PersonalChainAck>>;
    /** GET /api/personal-chain/tasks */
    getTasks(): Promise<ApiResponse<{
        user: unknown;
        global: unknown;
    }>>;
    /** GET /api/personal-chain/user-join/{invite} */
    userJoin(invite: string | number): Promise<ApiResponse<PersonalChainAck>>;
    /** GET /api/personal-chain/user-reject/{invite} */
    userReject(invite: string | number): Promise<ApiResponse<PersonalChainAck>>;
    /** GET /api/personal-chain/{personalChain} */
    getPersonalChain(personalChain: string | number): Promise<ApiResponse<ProtocolStepData>>;
    /** DELETE /api/personal-chain/{personalChain} */
    deletePersonalChain(personalChain: string | number): Promise<ApiResponse<PersonalChainAck>>;
    /** GET /api/public/codify/answers/{key} */
    getCodifyAnswers(key: string): Promise<ApiResponse<CodifyAck>>;
    /** DELETE /api/public/codify/cancel/{key} */
    cancelCodify(key: string): Promise<ApiResponse<CodifyAck>>;
    /**
     * POST /api/public/codify/run
     *
     * `codifyFile` triggers a multipart/form-data switch automatically inside
     * `BaseApiClient.serializeBody` (it walks the payload for any Blob / File).
     */
    runCodify(body: CodifyRunRequestBody): Promise<ApiResponse<CodifyAck>>;
    /** POST /api/public/codify/save-answer */
    saveCodifyAnswer(body: CodifySaveAnswerRequestBody): Promise<ApiResponse<CodifyAck>>;
    /** POST /api/public/codify/start-session */
    startCodifySession(body: CodifyStartSessionRequestBody): Promise<ApiResponse<CodifyAck>>;
    /**
     * GET /api/public/codify/state/{key} — raw envelope.
     *
     * For UI state machines, prefer {@link readCodifyJobState} which returns
     * the `CodifyJobState` discriminated union.
     */
    getCodifyState(key: string): Promise<ApiResponse<CodifyStateRaw>>;
    /**
     * Convenience wrapper: GET the codify state and decode it into the
     * `CodifyJobState` discriminated union.
     *
     * Pair with a polling loop (e.g. `pollUntil`) to drive the wizard UI.
     */
    readCodifyJobState(key: string): Promise<CodifyJobState>;
    /**
     * POST /api/wizard/codify/{protocol}
     *
     * Distinct from the existing `WizardApiClient.startWizard` /
     * `WizardApiClient.defineProblems` etc. — those drive the **Five-Step**
     * wizard (`/wizard/start`, `/wizard/deal/{id}/step/...`). This route is
     * the codify entry point on a specific protocol and `{protocol}` is the
     * Laravel `Protocol` route binding.
     *
     * `codifyFile` triggers `multipart/form-data` automatically.
     */
    wizardCodify(protocol: string | number, body?: WizardCodifyRequestBody): Promise<ApiResponse<CodifyAck>>;
}
//# sourceMappingURL=personal-chain-wizard-api-client.d.ts.map