/**
 * `Modules/Referral` API client.
 *
 * Covers the 9 endpoints documented in `sdk/spec/endpoints.json` with
 * `module === "Modules/Referral"`:
 *
 *   - 5 CRUD endpoints (`referral.{index,store,show,update,destroy}`)
 *   - 1 lifecycle endpoint (`POST /api/referral/confirm`)
 *   - 2 protocol-run reads (`run-global/{referral}/{task}`,
 *     `run/{referral}/{chain}`) — raw `{ data, chain }` shape
 *   - 1 protocol-integration listing (`/api/protocol/referral/all`)
 *
 * Manifest oddity: like Disbursement, this module uses `confirm`, not
 * `submit`. The client method follows the upstream route. Auth: every
 * route is `auth:api`.
 */
import { BaseApiClient } from '../api-client';
import type { ApiRequestOptions, ApiResponse } from '../api-client';
import type { ReferralChainId, ReferralConfirmInput, ReferralConfirmResource, ReferralId, ReferralResource, ReferralRunResource, ReferralStoreInput, ReferralTaskId, ReferralUpdateInput } from '../types/modules-referral';
/**
 * Public client over `/api/referral/*` and `/api/protocol/referral/*`.
 * Subclasses `BaseApiClient` for auth / `X-Domain` / `_method` / `ApiError`.
 */
export declare class ReferralModuleApiClient extends BaseApiClient {
    /** GET `/api/referral`. (`referral.index`) */
    list(opts?: ApiRequestOptions): Promise<ApiResponse<ReferralResource[]>>;
    /** POST `/api/referral`. (`referral.store`) */
    create(body: ReferralStoreInput, opts?: ApiRequestOptions): Promise<ApiResponse<ReferralResource>>;
    /** GET `/api/referral/{referral}`. (`referral.show`) */
    show(referral: ReferralId, opts?: ApiRequestOptions): Promise<ApiResponse<ReferralResource>>;
    /** PUT `/api/referral/{referral}` — sent as POST + `?_method=PUT`. (`referral.update`) */
    update(referral: ReferralId, body: ReferralUpdateInput, opts?: ApiRequestOptions): Promise<ApiResponse<ReferralResource>>;
    /** DELETE `/api/referral/{referral}`. (`referral.destroy`) */
    destroy(referral: ReferralId, opts?: ApiRequestOptions): Promise<ApiResponse<ReferralResource>>;
    /** POST `/api/referral/confirm`. (`post.api.referral.confirm`) */
    confirm(body: ReferralConfirmInput, opts?: ApiRequestOptions): Promise<ApiResponse<ReferralConfirmResource>>;
    /** GET `/api/referral/run-global/{referral}/{task}`. (`get.api.referral.run-global.item.item`) */
    runGlobal(referral: ReferralId, task: ReferralTaskId, opts?: ApiRequestOptions): Promise<ApiResponse<ReferralRunResource>>;
    /** GET `/api/referral/run/{referral}/{chain}`. (`get.api.referral.run.item.item`) */
    run(referral: ReferralId, chain: ReferralChainId, opts?: ApiRequestOptions): Promise<ApiResponse<ReferralRunResource>>;
    /** GET `/api/protocol/referral/all`. (`get.api.protocol.referral.all`) */
    listProtocolReferrals(opts?: ApiRequestOptions): Promise<ApiResponse<ReferralResource[]>>;
}
//# sourceMappingURL=modules-referral-api-client.d.ts.map