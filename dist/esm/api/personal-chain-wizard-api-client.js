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
import { BaseApiClient } from '../api-client';
/**
 * Map a raw `CodifyStateRaw` into the `CodifyJobState` discriminated union.
 *
 * The Laravel resource exposes a flat object whose `running`, `finished`,
 * `successfully`, `preparation_finished` together encode a four-state job
 * machine. Centralizing the mapping here lets `sys/`, `gov/` and `app/`
 * write `switch (state.status)` blocks instead of re-deriving the state at
 * each call site.
 */
function mapCodifyState(raw) {
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
    async getByStatus(status) {
        const tail = status === undefined || status === null ? '' : `/${encodeURIComponent(String(status))}`;
        return this.get(`/api/personal-chain/by-status${tail}`);
    }
    /** POST /api/personal-chain/cancel-invitation */
    async cancelInvitation(body) {
        return this.post('/api/personal-chain/cancel-invitation', body);
    }
    /**
     * GET /api/personal-chain/decline/{invite}/{source?}
     *
     * Spec auth is `public` — no Bearer required. Used from invite emails
     * where the recipient may not be signed in yet.
     */
    async decline(invite, source) {
        const tail = source === undefined || source === null ? '' : `/${encodeURIComponent(String(source))}`;
        return this.get(`/api/personal-chain/decline/${encodeURIComponent(String(invite))}${tail}`, undefined, { auth: false });
    }
    /** POST /api/personal-chain/feedback/{chain} */
    async postFeedback(chain, body) {
        return this.post(`/api/personal-chain/feedback/${encodeURIComponent(String(chain))}`, body);
    }
    /** GET /api/personal-chain/feedback/{chain} */
    async getFeedback(chain) {
        return this.get(`/api/personal-chain/feedback/${encodeURIComponent(String(chain))}`);
    }
    /** POST /api/personal-chain/find-users-to-invite */
    async findUsersToInvite(body) {
        return this.post('/api/personal-chain/find-users-to-invite', body);
    }
    /** GET /api/personal-chain/finished-not-rated */
    async getFinishedNotRated() {
        return this.get('/api/personal-chain/finished-not-rated');
    }
    /** GET /api/personal-chain/force-defrost/{chain} */
    async forceDefrost(chain) {
        return this.get(`/api/personal-chain/force-defrost/${encodeURIComponent(String(chain))}`);
    }
    /** GET /api/personal-chain/get-recommended */
    async getRecommended() {
        return this.get('/api/personal-chain/get-recommended');
    }
    /** POST /api/personal-chain/invite */
    async invite(body) {
        return this.post('/api/personal-chain/invite', body);
    }
    /**
     * GET /api/personal-chain/join/{token}/{source?}
     *
     * Spec auth is `public`. Same pattern as decline — invite landing page.
     */
    async join(token, source) {
        const tail = source === undefined || source === null ? '' : `/${encodeURIComponent(String(source))}`;
        return this.get(`/api/personal-chain/join/${encodeURIComponent(token)}${tail}`, undefined, { auth: false });
    }
    /** GET /api/personal-chain/last-chain */
    async getLastChain() {
        return this.get('/api/personal-chain/last-chain');
    }
    /** POST /api/personal-chain/start-program/{chain} */
    async startProgram(chain, body) {
        return this.post(`/api/personal-chain/start-program/${encodeURIComponent(String(chain))}`, body);
    }
    /** GET /api/personal-chain/task/{taskId} */
    async getTask(taskId) {
        return this.get(`/api/personal-chain/task/${encodeURIComponent(String(taskId))}`);
    }
    /** GET /api/personal-chain/tasks */
    async getTasks() {
        return this.get('/api/personal-chain/tasks');
    }
    /** GET /api/personal-chain/user-join/{invite} */
    async userJoin(invite) {
        return this.get(`/api/personal-chain/user-join/${encodeURIComponent(String(invite))}`);
    }
    /** GET /api/personal-chain/user-reject/{invite} */
    async userReject(invite) {
        return this.get(`/api/personal-chain/user-reject/${encodeURIComponent(String(invite))}`);
    }
    /** GET /api/personal-chain/{personalChain} */
    async getPersonalChain(personalChain) {
        return this.get(`/api/personal-chain/${encodeURIComponent(String(personalChain))}`);
    }
    /** DELETE /api/personal-chain/{personalChain} */
    async deletePersonalChain(personalChain) {
        return this.delete(`/api/personal-chain/${encodeURIComponent(String(personalChain))}`);
    }
    // ---------------------------------------------------------------------------
    // /api/public/codify/* — public (auth: false on every call)
    // ---------------------------------------------------------------------------
    /** GET /api/public/codify/answers/{key} */
    async getCodifyAnswers(key) {
        return this.get(`/api/public/codify/answers/${encodeURIComponent(key)}`, undefined, { auth: false });
    }
    /** DELETE /api/public/codify/cancel/{key} */
    async cancelCodify(key) {
        return this.delete(`/api/public/codify/cancel/${encodeURIComponent(key)}`, { auth: false });
    }
    /**
     * POST /api/public/codify/run
     *
     * `codifyFile` triggers a multipart/form-data switch automatically inside
     * `BaseApiClient.serializeBody` (it walks the payload for any Blob / File).
     */
    async runCodify(body) {
        return this.post('/api/public/codify/run', body, { auth: false });
    }
    /** POST /api/public/codify/save-answer */
    async saveCodifyAnswer(body) {
        return this.post('/api/public/codify/save-answer', body, { auth: false });
    }
    /** POST /api/public/codify/start-session */
    async startCodifySession(body) {
        return this.post('/api/public/codify/start-session', body, { auth: false });
    }
    /**
     * GET /api/public/codify/state/{key} — raw envelope.
     *
     * For UI state machines, prefer {@link readCodifyJobState} which returns
     * the `CodifyJobState` discriminated union.
     */
    async getCodifyState(key) {
        return this.get(`/api/public/codify/state/${encodeURIComponent(key)}`, undefined, { auth: false });
    }
    /**
     * Convenience wrapper: GET the codify state and decode it into the
     * `CodifyJobState` discriminated union.
     *
     * Pair with a polling loop (e.g. `pollUntil`) to drive the wizard UI.
     */
    async readCodifyJobState(key) {
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
    async wizardCodify(protocol, body = {}) {
        return this.post(`/api/wizard/codify/${encodeURIComponent(String(protocol))}`, body);
    }
}
//# sourceMappingURL=personal-chain-wizard-api-client.js.map