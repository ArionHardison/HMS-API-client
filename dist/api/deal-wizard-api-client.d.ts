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
import { BaseApiClient, type ApiResponse, type ApiRequestOptions } from '../api-client';
import type { ComputeDepositRequest, ComputeDepositResponse, DealEventsQuery, DealEventsResponse, DealFileResource, DealMutationResponse, DealResource, DefineDealRequest, PatchDetailsRequest, PatchMetadataRequest, PatchPathRequest, RequiredInfoRequest, SelectSolutionRequest, UploadFileRequest, VerifyOutcomeResponse } from '../types/deal-wizard';
export type { ComputeDepositAmountCents, ComputeDepositRequest, ComputeDepositResponse, DealApplicantType, DealBudgetTier, DealEvent, DealEventsQuery, DealEventsResponse, DealFileResource, DealFileType, DealFinancing, DealMutationResponse, DealPathTier, DealProblem, DealRequiredInfoEntry, DealResource, DealSolution, DealStakeholder, DefineDealRequest, MissingRequiredInfoError, MissingWizardDataError, PatchDetailsRequest, PatchMetadataRequest, PatchPathRequest, RequiredInfoRequest, SelectSolutionRequest, SolutionGenerationError, UploadFileRequest, VerifyOutcomeResponse, } from '../types/deal-wizard';
export declare class DealWizardApiClient extends BaseApiClient {
    /**
     * POST /api/wizard/deal/define — create a Deal from a free-text statement.
     *
     * api validates `statement` (1–8000 chars) + optional `tld`; resolves the
     * tenant from the explicit `tld` / `X-Domain` header, classifies the problem
     * (LLM) and computes `required_info` before persisting. Returns the new Deal
     * in `state=analyzing`, `wizard_step=1` with a top-level `id` alias.
     */
    defineDeal(body: DefineDealRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<DealMutationResponse>>;
    /** GET /api/wizard/deal/{deal_id}/status — full DealResource snapshot. */
    getStatus(dealId: string): Promise<ApiResponse<DealResource>>;
    /**
     * GET /api/wizard/deal/{deal_id}/events — paginated append-only audit log.
     * `per_page` is clamped server-side to 1–200 (default 50).
     */
    getEvents(dealId: string, query?: DealEventsQuery): Promise<ApiResponse<DealEventsResponse>>;
    /**
     * POST /api/wizard/deal/{deal_id}/required-info — submit answers to the
     * Step-1 follow-up questions. Advances `analyzing` → `codified`. Returns a
     * 422 `{error:'missing_required_info', missing:[...]}` when a declared key
     * is unanswered.
     */
    submitRequiredInfo(dealId: string, body: RequiredInfoRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<DealMutationResponse>>;
    /**
     * POST /api/wizard/deal/{deal_id}/codify — Step 2 solution generation.
     * No request body (LLM-driven). Requires `state=codified`. When the
     * `deals.step2_strict_schema` flag is on, a generation failure returns
     * 502 `{error:'solution_generation_failed', message}`.
     */
    codify(dealId: string, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<DealMutationResponse>>;
    /**
     * POST /api/wizard/deal/{deal_id}/select-solution — pick one of the
     * generated solutions by zero-based index. Does not advance state.
     */
    selectSolution(dealId: string, body: SelectSolutionRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<DealMutationResponse>>;
    /**
     * POST /api/wizard/deal/{deal_id}/setup — Step 3. Materializes pipeline
     * steps and advances `codified` → `setup`. No request body.
     */
    setup(dealId: string, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<DealMutationResponse>>;
    /**
     * POST /api/wizard/deal/{deal_id}/start — Step 3→4 transition. Advances
     * `setup` → `executing`. No request body.
     */
    start(dealId: string, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<DealMutationResponse>>;
    /**
     * PATCH /api/wizard/deal/{deal_id}/metadata — intake step 1: title,
     * description (≥50 chars), applicant_type, optional related_industries.
     * Caller must be the deal creator/owner (403 otherwise). PATCH is sent as
     * POST + `?_method=PATCH`.
     */
    patchMetadata(dealId: string, body: PatchMetadataRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<DealMutationResponse>>;
    /**
     * PATCH /api/wizard/deal/{deal_id}/details — intake step 2: customer,
     * program window, budget_tier. Creator/owner only.
     */
    patchDetails(dealId: string, body: PatchDetailsRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<DealMutationResponse>>;
    /**
     * POST /api/wizard/deal/{deal_id}/files — intake step 3: multipart upload.
     * `file` (≤10 MB) + `file_type` in {document,image,logo}. The `File`/`Blob`
     * in the body auto-promotes the request to `multipart/form-data` via
     * `BaseApiClient`. Returns 201 with the new `deal_files` row. Creator/owner
     * only.
     */
    uploadFile(dealId: string, body: UploadFileRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<DealFileResource>>;
    /**
     * DELETE /api/wizard/deal/{deal_id}/files/{file_id} — mid-wizard file
     * removal. Idempotent: 204 on delete/no-op, 404 if the file is unknown.
     * Creator/owner only. A real DELETE on the wire.
     */
    deleteFile(dealId: string, fileId: string | number, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<null>>;
    /**
     * PATCH /api/wizard/deal/{deal_id}/path — intake step 4: path_tier in
     * {pink,green,blue,red,black}. Creator/owner only.
     */
    patchPath(dealId: string, body: PatchPathRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<DealMutationResponse>>;
    /**
     * POST /api/wizard/deal/{deal_id}/submit — intake step 5: finalize and
     * transition to `awaiting_compute`. Gates on applicant_type/title/
     * description/budget_tier/path_tier being present (422
     * `{error:'missing_wizard_data', missing:[...]}` otherwise). No request
     * body. Creator/owner only.
     */
    submit(dealId: string, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<DealMutationResponse>>;
    /**
     * POST /api/wizard/deal/{deal_id}/compute-deposit — mint a Stripe
     * PaymentIntent for the 5-tier deposit ladder. `amount_cents` must be one of
     * 100 / 1000 / 10000 / 100000 / 1000000. Returns `{ client_secret }`.
     */
    computeDeposit(dealId: string, body: ComputeDepositRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<ComputeDepositResponse>>;
    /**
     * POST /api/wizard/deal/{deal_id}/verify/{execution_id} — Step 5 synchronous
     * outcome verification. Empty body. `execution_id` is numeric (api route
     * constraint `[0-9]+`). Returns `{ deal_id, state, outcome_score,
     * outcome_class, outcome_report }`. Illegal state transitions return 409.
     */
    verifyOutcome(dealId: string, executionId: number | string, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<VerifyOutcomeResponse>>;
}
//# sourceMappingURL=deal-wizard-api-client.d.ts.map