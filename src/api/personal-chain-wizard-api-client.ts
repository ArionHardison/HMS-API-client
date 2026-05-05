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
import type {
  CancelInvitationRequestBody,
  CodifyAck,
  CodifyJobState,
  CodifyRunRequestBody,
  CodifySaveAnswerRequestBody,
  CodifyStartSessionRequestBody,
  CodifyStateRaw,
  FindUsersToInviteRequestBody,
  FinishedNotRatedProgramSummary,
  InviteUserToPersonalChainRequestBody,
  LastChainSummary,
  PersonalChainAck,
  ProgramFeedbackData,
  ProtocolPersonalChainSummary,
  ProtocolStepData,
  StartProgramRequestBody,
  StoreFeedbackRequestBody,
  WizardCodifyRequestBody,
} from '../types/personal-chain-wizard';

// Re-export types so consumers can import them from one place.
export type {
  CancelInvitationRequestBody,
  CodifyAck,
  CodifyJobState,
  CodifyRunRequestBody,
  CodifySaveAnswerRequestBody,
  CodifyStartSessionRequestBody,
  CodifyStateRaw,
  FindUsersToInviteRequestBody,
  FinishedNotRatedProgramSummary,
  InviteUserToPersonalChainRequestBody,
  LastChainSummary,
  PersonalChainAck,
  ProgramFeedbackData,
  ProtocolPersonalChainSummary,
  ProtocolStepData,
  StartProgramRequestBody,
  StoreFeedbackRequestBody,
  WizardCodifyRequestBody,
};

/**
 * Map a raw `CodifyStateRaw` into the `CodifyJobState` discriminated union.
 *
 * The Laravel resource exposes a flat object whose `running`, `finished`,
 * `successfully`, `preparation_finished` together encode a four-state job
 * machine. Centralizing the mapping here lets `sys/`, `gov/` and `app/`
 * write `switch (state.status)` blocks instead of re-deriving the state at
 * each call site.
 */
function mapCodifyState(raw: CodifyStateRaw): CodifyJobState {
  const finished = raw.finished === true;
  const running = raw.running === true;
  const successful = raw.successfully === true;

  if (finished && successful) {
    return {
      status: 'completed',
      codify: raw.codify,
      preferredSubproject: raw.preferred_subproject,
      raw,
    };
  }
  if (finished) {
    return { status: 'failed', raw };
  }
  if (running) {
    return {
      status: 'running',
      step: raw.step,
      questions: raw.questions,
      preparationFinished: raw.preparation_finished,
      raw,
    };
  }
  return { status: 'pending', raw };
}

export class PersonalChainWizardApiClient extends BaseApiClient {
  // ---------------------------------------------------------------------------
  // /api/personal-chain/* — authenticated unless flagged otherwise
  // ---------------------------------------------------------------------------

  /**
   * GET /api/personal-chain/by-status/{status?}
   *
   * Spec lists `status` as optional; we omit the trailing segment entirely
   * when undefined so Laravel routes to the catch-all variant.
   */
  async getByStatus(
    status?: string | number,
  ): Promise<ApiResponse<ProtocolPersonalChainSummary[]>> {
    const tail = status === undefined || status === null ? '' : `/${encodeURIComponent(String(status))}`;
    return this.get<ProtocolPersonalChainSummary[]>(`/api/personal-chain/by-status${tail}`);
  }

  /** POST /api/personal-chain/cancel-invitation */
  async cancelInvitation(
    body: CancelInvitationRequestBody,
  ): Promise<ApiResponse<PersonalChainAck>> {
    return this.post<PersonalChainAck>('/api/personal-chain/cancel-invitation', body);
  }

  /**
   * GET /api/personal-chain/decline/{invite}/{source?}
   *
   * Spec auth is `public` — no Bearer required. Used from invite emails
   * where the recipient may not be signed in yet.
   */
  async decline(
    invite: string | number,
    source?: string | number,
  ): Promise<ApiResponse<PersonalChainAck>> {
    const tail = source === undefined || source === null ? '' : `/${encodeURIComponent(String(source))}`;
    return this.get<PersonalChainAck>(
      `/api/personal-chain/decline/${encodeURIComponent(String(invite))}${tail}`,
      undefined,
      { auth: false },
    );
  }

  /** POST /api/personal-chain/feedback/{chain} */
  async postFeedback(
    chain: string | number,
    body: StoreFeedbackRequestBody,
  ): Promise<ApiResponse<ProgramFeedbackData>> {
    return this.post<ProgramFeedbackData>(
      `/api/personal-chain/feedback/${encodeURIComponent(String(chain))}`,
      body,
    );
  }

  /** GET /api/personal-chain/feedback/{chain} */
  async getFeedback(
    chain: string | number,
  ): Promise<ApiResponse<ProgramFeedbackData>> {
    return this.get<ProgramFeedbackData>(
      `/api/personal-chain/feedback/${encodeURIComponent(String(chain))}`,
    );
  }

  /** POST /api/personal-chain/find-users-to-invite */
  async findUsersToInvite(
    body: FindUsersToInviteRequestBody,
  ): Promise<ApiResponse<PersonalChainAck>> {
    return this.post<PersonalChainAck>('/api/personal-chain/find-users-to-invite', body);
  }

  /** GET /api/personal-chain/finished-not-rated */
  async getFinishedNotRated(): Promise<ApiResponse<FinishedNotRatedProgramSummary[]>> {
    return this.get<FinishedNotRatedProgramSummary[]>(
      '/api/personal-chain/finished-not-rated',
    );
  }

  /** GET /api/personal-chain/force-defrost/{chain} */
  async forceDefrost(chain: string | number): Promise<ApiResponse<PersonalChainAck>> {
    return this.get<PersonalChainAck>(
      `/api/personal-chain/force-defrost/${encodeURIComponent(String(chain))}`,
    );
  }

  /** GET /api/personal-chain/get-recommended */
  async getRecommended(): Promise<ApiResponse<PersonalChainAck>> {
    return this.get<PersonalChainAck>('/api/personal-chain/get-recommended');
  }

  /** POST /api/personal-chain/invite */
  async invite(
    body: InviteUserToPersonalChainRequestBody,
  ): Promise<ApiResponse<PersonalChainAck>> {
    return this.post<PersonalChainAck>('/api/personal-chain/invite', body);
  }

  /**
   * GET /api/personal-chain/join/{token}/{source?}
   *
   * Spec auth is `public`. Same pattern as decline — invite landing page.
   */
  async join(
    token: string,
    source?: string | number,
  ): Promise<ApiResponse<PersonalChainAck>> {
    const tail = source === undefined || source === null ? '' : `/${encodeURIComponent(String(source))}`;
    return this.get<PersonalChainAck>(
      `/api/personal-chain/join/${encodeURIComponent(token)}${tail}`,
      undefined,
      { auth: false },
    );
  }

  /** GET /api/personal-chain/last-chain */
  async getLastChain(): Promise<ApiResponse<LastChainSummary>> {
    return this.get<LastChainSummary>('/api/personal-chain/last-chain');
  }

  /** POST /api/personal-chain/start-program/{chain} */
  async startProgram(
    chain: string | number,
    body: StartProgramRequestBody,
  ): Promise<ApiResponse<ProtocolStepData>> {
    return this.post<ProtocolStepData>(
      `/api/personal-chain/start-program/${encodeURIComponent(String(chain))}`,
      body,
    );
  }

  /** GET /api/personal-chain/task/{taskId} */
  async getTask(taskId: string | number): Promise<ApiResponse<PersonalChainAck>> {
    return this.get<PersonalChainAck>(
      `/api/personal-chain/task/${encodeURIComponent(String(taskId))}`,
    );
  }

  /** GET /api/personal-chain/tasks */
  async getTasks(): Promise<ApiResponse<{ user: unknown; global: unknown }>> {
    return this.get<{ user: unknown; global: unknown }>('/api/personal-chain/tasks');
  }

  /** GET /api/personal-chain/user-join/{invite} */
  async userJoin(invite: string | number): Promise<ApiResponse<PersonalChainAck>> {
    return this.get<PersonalChainAck>(
      `/api/personal-chain/user-join/${encodeURIComponent(String(invite))}`,
    );
  }

  /** GET /api/personal-chain/user-reject/{invite} */
  async userReject(invite: string | number): Promise<ApiResponse<PersonalChainAck>> {
    return this.get<PersonalChainAck>(
      `/api/personal-chain/user-reject/${encodeURIComponent(String(invite))}`,
    );
  }

  /** GET /api/personal-chain/{personalChain} */
  async getPersonalChain(
    personalChain: string | number,
  ): Promise<ApiResponse<ProtocolStepData>> {
    return this.get<ProtocolStepData>(
      `/api/personal-chain/${encodeURIComponent(String(personalChain))}`,
    );
  }

  /** DELETE /api/personal-chain/{personalChain} */
  async deletePersonalChain(
    personalChain: string | number,
  ): Promise<ApiResponse<PersonalChainAck>> {
    return this.delete<PersonalChainAck>(
      `/api/personal-chain/${encodeURIComponent(String(personalChain))}`,
    );
  }

  // ---------------------------------------------------------------------------
  // /api/public/codify/* — public (auth: false on every call)
  // ---------------------------------------------------------------------------

  /** GET /api/public/codify/answers/{key} */
  async getCodifyAnswers(key: string): Promise<ApiResponse<CodifyAck>> {
    return this.get<CodifyAck>(
      `/api/public/codify/answers/${encodeURIComponent(key)}`,
      undefined,
      { auth: false },
    );
  }

  /** DELETE /api/public/codify/cancel/{key} */
  async cancelCodify(key: string): Promise<ApiResponse<CodifyAck>> {
    return this.delete<CodifyAck>(
      `/api/public/codify/cancel/${encodeURIComponent(key)}`,
      { auth: false },
    );
  }

  /**
   * POST /api/public/codify/run
   *
   * `codifyFile` triggers a multipart/form-data switch automatically inside
   * `BaseApiClient.serializeBody` (it walks the payload for any Blob / File).
   */
  async runCodify(body: CodifyRunRequestBody): Promise<ApiResponse<CodifyAck>> {
    return this.post<CodifyAck>('/api/public/codify/run', body, { auth: false });
  }

  /** POST /api/public/codify/save-answer */
  async saveCodifyAnswer(
    body: CodifySaveAnswerRequestBody,
  ): Promise<ApiResponse<CodifyAck>> {
    return this.post<CodifyAck>('/api/public/codify/save-answer', body, { auth: false });
  }

  /** POST /api/public/codify/start-session */
  async startCodifySession(
    body: CodifyStartSessionRequestBody,
  ): Promise<ApiResponse<CodifyAck>> {
    return this.post<CodifyAck>('/api/public/codify/start-session', body, { auth: false });
  }

  /**
   * GET /api/public/codify/state/{key} — raw envelope.
   *
   * For UI state machines, prefer {@link readCodifyJobState} which returns
   * the `CodifyJobState` discriminated union.
   */
  async getCodifyState(key: string): Promise<ApiResponse<CodifyStateRaw>> {
    return this.get<CodifyStateRaw>(
      `/api/public/codify/state/${encodeURIComponent(key)}`,
      undefined,
      { auth: false },
    );
  }

  /**
   * Convenience wrapper: GET the codify state and decode it into the
   * `CodifyJobState` discriminated union.
   *
   * Pair with a polling loop (e.g. `pollUntil`) to drive the wizard UI.
   */
  async readCodifyJobState(key: string): Promise<CodifyJobState> {
    const res = await this.getCodifyState(key);
    return mapCodifyState(res.data);
  }

  // ---------------------------------------------------------------------------
  // /api/wizard/codify/{protocol} — Bearer required (auth=api)
  // ---------------------------------------------------------------------------

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
  async wizardCodify(
    protocol: string | number,
    body: WizardCodifyRequestBody = {},
  ): Promise<ApiResponse<CodifyAck>> {
    return this.post<CodifyAck>(
      `/api/wizard/codify/${encodeURIComponent(String(protocol))}`,
      body,
    );
  }
}
