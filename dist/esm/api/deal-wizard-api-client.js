/**
 * DealWizardApiClient — covers the full Deal Runtime Wizard slice of the P2X
 * API: the 17 `/api/wizard/deal/*` routes in `Modules/Deals/Routes/api.php`
 * served by `DealWizardController` + `DealVerificationController`.
 *
 * Route inventory (source of truth = the api route file + each controller
 * action's validate()/FormRequest, NOT guessed):
 *
 *   POST   /api/wizard/deal/define                       defineDeal
 *   GET    /api/wizard/deal/{id}/status                  getStatus
 *   GET    /api/wizard/deal/{id}/events                  getEvents
 *   POST   /api/wizard/deal/{id}/required-info           submitRequiredInfo
 *   POST   /api/wizard/deal/{id}/codify                  codify
 *   POST   /api/wizard/deal/{id}/select-solution         selectSolution
 *   POST   /api/wizard/deal/{id}/setup                   setup
 *   POST   /api/wizard/deal/{id}/start                   start
 *   PATCH  /api/wizard/deal/{id}/metadata                patchMetadata
 *   PATCH  /api/wizard/deal/{id}/details                 patchDetails
 *   POST   /api/wizard/deal/{id}/files                   uploadFile (multipart)
 *   DELETE /api/wizard/deal/{id}/files/{fileId}          deleteFile
 *   PATCH  /api/wizard/deal/{id}/path                    patchPath
 *   POST   /api/wizard/deal/{id}/submit                  submit
 *   POST   /api/wizard/deal/{id}/compute-deposit         computeDeposit
 *   POST   /api/wizard/deal/{id}/verify/{executionId}    verifyOutcome
 *
 * This is the route-accurate, fetch-based companion to the legacy
 * `WizardApiClient` (in `wizard-api-client.ts`), which still extends the older
 * axios base and carries stale `/step/*` + snapshot routes. New consumers
 * should use this client.
 *
 * `BaseApiClient` already handles, per the contract suite:
 *   - `Authorization: Bearer` injection (skipped per call via `{ auth: false }`)
 *   - `X-Domain` header from `getDomain`
 *   - PATCH → POST + `?_method=PATCH` (Laravel); DELETE stays a real DELETE
 *   - FormData switching when a payload carries a `File`/`Blob` (uploadFile)
 *   - 401 / 422 → callback + `ApiError`
 *
 * Idempotency: the api expects an `Idempotency-Key` header on writes so
 * retries are safe. Every write method takes an optional `idempotencyKey`
 * which is sent verbatim as that header (merged via `ApiRequestOptions.headers`).
 */
import { BaseApiClient } from '../api-client';
/**
 * Fold an optional `Idempotency-Key` into the per-call request options without
 * clobbering any caller-supplied `opts.headers`.
 */
function withIdempotency(idempotencyKey, opts) {
    if (!idempotencyKey) {
        return opts;
    }
    return {
        ...(opts ?? {}),
        headers: { ...(opts?.headers ?? {}), 'Idempotency-Key': idempotencyKey },
    };
}
export class DealWizardApiClient extends BaseApiClient {
    // ---------------------------------------------------------------------------
    // Step 1 — define + read snapshots
    // ---------------------------------------------------------------------------
    /**
     * POST /api/wizard/deal/define — create a Deal from a free-text statement.
     *
     * api validates `statement` (1–8000 chars) + optional `tld`; resolves the
     * tenant from the explicit `tld` / `X-Domain` header, classifies the problem
     * (LLM) and computes `required_info` before persisting. Returns the new Deal
     * in `state=analyzing`, `wizard_step=1` with a top-level `id` alias.
     */
    async defineDeal(body, idempotencyKey, opts) {
        return this.post('/api/wizard/deal/define', body, withIdempotency(idempotencyKey, opts));
    }
    /** GET /api/wizard/deal/{deal_id}/status — full DealResource snapshot. */
    async getStatus(dealId) {
        return this.get(`/api/wizard/deal/${encodeURIComponent(dealId)}/status`);
    }
    /**
     * GET /api/wizard/deal/{deal_id}/events — paginated append-only audit log.
     * `per_page` is clamped server-side to 1–200 (default 50).
     */
    async getEvents(dealId, query) {
        const params = query?.per_page === undefined ? undefined : { per_page: query.per_page };
        return this.get(`/api/wizard/deal/${encodeURIComponent(dealId)}/events`, params);
    }
    // ---------------------------------------------------------------------------
    // Step 1 continuation → Step 2 (codify) → Step 3 (setup) → Step 4 (start)
    // ---------------------------------------------------------------------------
    /**
     * POST /api/wizard/deal/{deal_id}/required-info — submit answers to the
     * Step-1 follow-up questions. Advances `analyzing` → `codified`. Returns a
     * 422 `{error:'missing_required_info', missing:[...]}` when a declared key
     * is unanswered.
     */
    async submitRequiredInfo(dealId, body, idempotencyKey, opts) {
        return this.post(`/api/wizard/deal/${encodeURIComponent(dealId)}/required-info`, body, withIdempotency(idempotencyKey, opts));
    }
    /**
     * POST /api/wizard/deal/{deal_id}/codify — Step 2 solution generation.
     * No request body (LLM-driven). Requires `state=codified`. When the
     * `deals.step2_strict_schema` flag is on, a generation failure returns
     * 502 `{error:'solution_generation_failed', message}`.
     */
    async codify(dealId, idempotencyKey, opts) {
        return this.post(`/api/wizard/deal/${encodeURIComponent(dealId)}/codify`, undefined, withIdempotency(idempotencyKey, opts));
    }
    /**
     * POST /api/wizard/deal/{deal_id}/select-solution — pick one of the
     * generated solutions by zero-based index. Does not advance state.
     */
    async selectSolution(dealId, body, idempotencyKey, opts) {
        return this.post(`/api/wizard/deal/${encodeURIComponent(dealId)}/select-solution`, body, withIdempotency(idempotencyKey, opts));
    }
    /**
     * POST /api/wizard/deal/{deal_id}/setup — Step 3. Materializes pipeline
     * steps and advances `codified` → `setup`. No request body.
     */
    async setup(dealId, idempotencyKey, opts) {
        return this.post(`/api/wizard/deal/${encodeURIComponent(dealId)}/setup`, undefined, withIdempotency(idempotencyKey, opts));
    }
    /**
     * POST /api/wizard/deal/{deal_id}/start — Step 3→4 transition. Advances
     * `setup` → `executing`. No request body.
     */
    async start(dealId, idempotencyKey, opts) {
        return this.post(`/api/wizard/deal/${encodeURIComponent(dealId)}/start`, undefined, withIdempotency(idempotencyKey, opts));
    }
    // ---------------------------------------------------------------------------
    // Intake (F1/F2) steps — metadata / details / files / path / submit
    // ---------------------------------------------------------------------------
    /**
     * PATCH /api/wizard/deal/{deal_id}/metadata — intake step 1: title,
     * description (≥50 chars), applicant_type, optional related_industries.
     * Caller must be the deal creator/owner (403 otherwise). PATCH is sent as
     * POST + `?_method=PATCH`.
     */
    async patchMetadata(dealId, body, idempotencyKey, opts) {
        return this.patch(`/api/wizard/deal/${encodeURIComponent(dealId)}/metadata`, body, withIdempotency(idempotencyKey, opts));
    }
    /**
     * PATCH /api/wizard/deal/{deal_id}/details — intake step 2: customer,
     * program window, budget_tier. Creator/owner only.
     */
    async patchDetails(dealId, body, idempotencyKey, opts) {
        return this.patch(`/api/wizard/deal/${encodeURIComponent(dealId)}/details`, body, withIdempotency(idempotencyKey, opts));
    }
    /**
     * POST /api/wizard/deal/{deal_id}/files — intake step 3: multipart upload.
     * `file` (≤10 MB) + `file_type` in {document,image,logo}. The `File`/`Blob`
     * in the body auto-promotes the request to `multipart/form-data` via
     * `BaseApiClient`. Returns 201 with the new `deal_files` row. Creator/owner
     * only.
     */
    async uploadFile(dealId, body, idempotencyKey, opts) {
        return this.post(`/api/wizard/deal/${encodeURIComponent(dealId)}/files`, body, withIdempotency(idempotencyKey, opts));
    }
    /**
     * DELETE /api/wizard/deal/{deal_id}/files/{file_id} — mid-wizard file
     * removal. Idempotent: 204 on delete/no-op, 404 if the file is unknown.
     * Creator/owner only. A real DELETE on the wire.
     */
    async deleteFile(dealId, fileId, idempotencyKey, opts) {
        return this.delete(`/api/wizard/deal/${encodeURIComponent(dealId)}/files/${encodeURIComponent(String(fileId))}`, withIdempotency(idempotencyKey, opts));
    }
    /**
     * PATCH /api/wizard/deal/{deal_id}/path — intake step 4: path_tier in
     * {pink,green,blue,red,black}. Creator/owner only.
     */
    async patchPath(dealId, body, idempotencyKey, opts) {
        return this.patch(`/api/wizard/deal/${encodeURIComponent(dealId)}/path`, body, withIdempotency(idempotencyKey, opts));
    }
    /**
     * POST /api/wizard/deal/{deal_id}/submit — intake step 5: finalize and
     * transition to `awaiting_compute`. Gates on applicant_type/title/
     * description/budget_tier/path_tier being present (422
     * `{error:'missing_wizard_data', missing:[...]}` otherwise). No request
     * body. Creator/owner only.
     */
    async submit(dealId, idempotencyKey, opts) {
        return this.post(`/api/wizard/deal/${encodeURIComponent(dealId)}/submit`, undefined, withIdempotency(idempotencyKey, opts));
    }
    // ---------------------------------------------------------------------------
    // Compute deposit (F3) + Step 5 outcome verification
    // ---------------------------------------------------------------------------
    /**
     * POST /api/wizard/deal/{deal_id}/compute-deposit — mint a Stripe
     * PaymentIntent for the 5-tier deposit ladder. `amount_cents` must be one of
     * 100 / 1000 / 10000 / 100000 / 1000000. Returns `{ client_secret }`.
     */
    async computeDeposit(dealId, body, idempotencyKey, opts) {
        return this.post(`/api/wizard/deal/${encodeURIComponent(dealId)}/compute-deposit`, body, withIdempotency(idempotencyKey, opts));
    }
    /**
     * POST /api/wizard/deal/{deal_id}/verify/{execution_id} — Step 5 synchronous
     * outcome verification. Empty body. `execution_id` is numeric (api route
     * constraint `[0-9]+`). Returns `{ deal_id, state, outcome_score,
     * outcome_class, outcome_report }`. Illegal state transitions return 409.
     */
    async verifyOutcome(dealId, executionId, idempotencyKey, opts) {
        return this.post(`/api/wizard/deal/${encodeURIComponent(dealId)}/verify/${encodeURIComponent(String(executionId))}`, undefined, withIdempotency(idempotencyKey, opts));
    }
}
//# sourceMappingURL=deal-wizard-api-client.js.map