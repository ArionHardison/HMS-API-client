/**
 * IntegrationsApiClient — covers the subproject federation surface in
 * `api/Modules/Integrations/Routes/api.php` (15 routes): the machine-to-
 * machine glue the four standalone subprojects (IBD, PHM, MOB, NIO) + the
 * codify-careers HRM claim-back flow use to write events into P2X.
 *
 * Route inventory (source = the api route file + each controller/FormRequest):
 *
 *   Federated writes — auth:api + abilities:subproject:writer + tenant-match
 *   + idempotency (machine Bearer via getToken; pass an Idempotency-Key):
 *     POST /api/v1/integrations/ibd/users/upsert            upsertIbdUser
 *     POST /api/v1/integrations/phm/users/upsert            upsertPhmUser
 *     POST /api/v1/integrations/mob/users/upsert            upsertMobUser
 *     POST /api/v1/integrations/nio/users/upsert            upsertNioUser
 *     POST /api/v1/integrations/careers/users/upsert        upsertCareersUser
 *     POST /api/v1/integrations/ibd/applications            createIbdApplication
 *     POST /api/v1/integrations/ibd/kpi-events              createIbdKpiEvent
 *     POST /api/v1/integrations/mob/activity-locations/batch  batchMobActivityLocations
 *     POST /api/v1/integrations/mob/runs/complete           completeMobRun
 *     POST /api/v1/integrations/nio/assessments-responses   createNioAssessmentResponse
 *     POST /api/v1/integrations/nio/orders                  createNioOrder
 *     POST /api/v1/integrations/nio/coins/grant             grantNioCoins
 *     POST /api/v1/integrations/nio/coins/spend             spendNioCoins
 *
 *   Token mints — NO bearer required (the endpoint's own check IS the auth);
 *   tenant + idempotency still apply. Sent with `{ auth: false }` by default:
 *     POST /api/v1/integrations/nio/firebase-login          nioFirebaseLogin
 *     POST /api/v1/integrations/mob/guest-register          mobGuestRegister
 *
 * `BaseApiClient` already handles, per the contract suite:
 *   - `Authorization: Bearer` injection (skipped per call via `{ auth: false }`)
 *   - `X-Domain` header from `getDomain` (every endpoint resolves the tenant)
 *   - 401 / 422 → callback + `ApiError`
 *
 * Idempotency: the api expects an `Idempotency-Key` header on these writes so
 * retries are safe (the IdempotencyMiddleware caches the 202 for 24h). Every
 * write method takes an optional `idempotencyKey` sent verbatim as that
 * header (merged via `ApiRequestOptions.headers`).
 */
import { BaseApiClient, type ApiResponse, type ApiRequestOptions } from '../api-client';
import type { CareersUserUpsertRequest, CareersUserUpsertResponse, EventLogAcceptedResponse, IbdApplicationRequest, IbdKpiEventRequest, MobActivityLocationBatchRequest, MobGuestRegisterRequest, MobGuestRegisterResponse, MobRunCompleteRequest, NioAssessmentResponseRequest, NioCoinGrantRequest, NioCoinSpendRequest, NioCoinTransactionResponse, NioFirebaseLoginRequest, NioFirebaseLoginResponse, NioOrderRequest, UserUpsertRequest, UserUpsertResponse } from '../types/integrations';
export declare class IntegrationsApiClient extends BaseApiClient {
    /**
     * POST /api/v1/integrations/ibd/users/upsert — federate an IBD (Crohnie AI)
     * user. `external_id` is the upstream Mongo `_id`. 202 `{ user_id,
     * external_id, source: 'ibd', status: 'linked' }`.
     */
    upsertIbdUser(body: UserUpsertRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<UserUpsertResponse>>;
    /**
     * POST /api/v1/integrations/phm/users/upsert — federate a PHM user.
     * `external_id` is the upstream MariaDB integer (as a string). 202 linked.
     */
    upsertPhmUser(body: UserUpsertRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<UserUpsertResponse>>;
    /**
     * POST /api/v1/integrations/mob/users/upsert — federate a MOB (Run Tracker)
     * user. `external_id` is the device UUID. 202 linked.
     */
    upsertMobUser(body: UserUpsertRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<UserUpsertResponse>>;
    /**
     * POST /api/v1/integrations/nio/users/upsert — federate a NIO (NutriScan)
     * user. `external_id` is the Firebase UID. 202 linked.
     */
    upsertNioUser(body: UserUpsertRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<UserUpsertResponse>>;
    /**
     * POST /api/v1/integrations/careers/users/upsert — codify-careers HRM
     * claim-back federation upsert. At least one of `email` / `source_email`
     * is required. 202 `{ user_id, p2x_user_id, source, status: 'linked' }`.
     */
    upsertCareersUser(body: CareersUserUpsertRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<CareersUserUpsertResponse>>;
    /**
     * POST /api/v1/integrations/ibd/applications — push an IBD clinical-program
     * application. 202 `{ id, source: 'ibd', kind: 'application', status:
     * 'accepted' }`.
     */
    createIbdApplication(body: IbdApplicationRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<EventLogAcceptedResponse>>;
    /**
     * POST /api/v1/integrations/ibd/kpi-events — push an IBD KPI event
     * (`metric`, numeric `value`, `dimensions`, `occurred_at`). 202 accepted
     * (kind `kpi_event`).
     */
    createIbdKpiEvent(body: IbdKpiEventRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<EventLogAcceptedResponse>>;
    /**
     * POST /api/v1/integrations/mob/activity-locations/batch — upload a batch of
     * GPS points keyed by `device_uuid`. 202 accepted (kind `activity_location`).
     */
    batchMobActivityLocations(body: MobActivityLocationBatchRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<EventLogAcceptedResponse>>;
    /**
     * POST /api/v1/integrations/mob/runs/complete — push a run-completion event
     * (duration, distance, path GeoJSON). 202 accepted (kind `run_complete`).
     */
    completeMobRun(body: MobRunCompleteRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<EventLogAcceptedResponse>>;
    /**
     * POST /api/v1/integrations/nio/assessments-responses — submit a completed
     * NIO assessment (`assessment_key`, `responses`, optional `scoring`). 202
     * accepted (kind `assessment`).
     */
    createNioAssessmentResponse(body: NioAssessmentResponseRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<EventLogAcceptedResponse>>;
    /**
     * POST /api/v1/integrations/nio/orders — push a NIO subscription/order event
     * (`source` in {stripe,appstore,playstore}). 202 accepted (kind `order`).
     */
    createNioOrder(body: NioOrderRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<EventLogAcceptedResponse>>;
    /**
     * POST /api/v1/integrations/nio/coins/grant — credit the authenticated
     * user's coin balance. Returns `{ balance, transaction_id }`. The
     * `Idempotency-Key` makes a grant replay-safe (the ledger's unique index is
     * the durable backstop beyond the 24h cache window).
     */
    grantNioCoins(body: NioCoinGrantRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<NioCoinTransactionResponse>>;
    /**
     * POST /api/v1/integrations/nio/coins/spend — debit the authenticated user's
     * coin balance. Returns `{ balance, transaction_id }`. A spend that would
     * overdraw returns 422 `{ amount: ['Insufficient coin balance.'] }`.
     */
    spendNioCoins(body: NioCoinSpendRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<NioCoinTransactionResponse>>;
    /**
     * POST /api/v1/integrations/nio/firebase-login — swap a Firebase ID token
     * for a P2X Sanctum bearer. Sent WITHOUT an Authorization header by default
     * (the Firebase signature is the authentication); the tenant still resolves
     * from `X-Domain`, and `Idempotency-Key` makes a retried swap return the
     * cached token instead of minting a second. Returns `{ success, message,
     * data: { user, token } }`. A bad token → 401.
     */
    nioFirebaseLogin(body: NioFirebaseLoginRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<NioFirebaseLoginResponse>>;
    /**
     * POST /api/v1/integrations/mob/guest-register — mint the device's FIRST
     * Sanctum bearer from a stable `device_uuid`. Unauthenticated (no bearer);
     * sent with `{ auth: false }` by default. Throttled + idempotent server-side
     * (a repeat device_uuid resolves the same user). Returns
     * `{ data: { user, token } }` — 201 on first registration, 200 on a repeat.
     */
    mobGuestRegister(body: MobGuestRegisterRequest, idempotencyKey?: string, opts?: ApiRequestOptions): Promise<ApiResponse<MobGuestRegisterResponse>>;
}
//# sourceMappingURL=integrations-api-client.d.ts.map