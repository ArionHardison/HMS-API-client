/**
 * `Modules/Nudge` API client.
 *
 * Covers the 10 endpoints from `sdk/spec/endpoints.json` with
 * `module === "Modules/Nudge"`:
 *
 *   - 5 RESTful CRUD endpoints (`nudge.{index,store,show,update,destroy}`)
 *   - 1 image-delete (`DELETE /api/nudge/image/{nudge}`)
 *   - 2 inbound-vendor-webhook receivers (`auth:public`):
 *       * `POST /api/nudge-checkin/email` (Mailgun)
 *       * `POST /api/nudge-checkin/sms`   (Twilio)
 *   - 1 secret-link confirmation (`GET /api/nudge/check/{secret}`,
 *     `auth:public`)
 *   - 1 protocol-integration listing (`/api/protocol/nudge/all`)
 *
 * Auth tiers: authed endpoints use Bearer; the three public ones require
 * `{ auth: false }` per call so the SDK omits Authorization.
 *
 * Class is named `NudgeModuleApiClient` to coexist with the legacy
 * axios-based `NudgeApiClient` exported from `hms-api-client.ts`. The
 * legacy client is NOT removed — both ship in the package.
 */
import { BaseApiClient } from '../api-client';
import type { ApiRequestOptions, ApiResponse } from '../api-client';
import type { CreateNudgeInput, NudgeCheckinEmailInput, NudgeCheckinSmsInput, NudgeId, NudgeProtocolIntegrationResource, NudgeResource, NudgeSecret, UpdateNudgeInput } from '../types/modules-nudge';
/**
 * Public client over `/api/nudge/*`, `/api/nudge-checkin/*`, and
 * `/api/protocol/nudge/all`. Subclasses `BaseApiClient`.
 */
export declare class NudgeModuleApiClient extends BaseApiClient {
    /** GET `/api/nudge` — list nudges. (`nudge.index`) */
    list(opts?: ApiRequestOptions): Promise<ApiResponse<NudgeResource[]>>;
    /** POST `/api/nudge` — create a nudge. (`nudge.store`) */
    create(body: CreateNudgeInput, opts?: ApiRequestOptions): Promise<ApiResponse<NudgeResource>>;
    /** GET `/api/nudge/{nudge}`. (`nudge.show`) */
    show(nudge: NudgeId, opts?: ApiRequestOptions): Promise<ApiResponse<NudgeResource>>;
    /** PUT `/api/nudge/{nudge}` — sent as POST + `?_method=PUT`. (`nudge.update`) */
    update(nudge: NudgeId, body: UpdateNudgeInput, opts?: ApiRequestOptions): Promise<ApiResponse<NudgeResource>>;
    /** DELETE `/api/nudge/{nudge}`. (`nudge.destroy`) */
    destroy(nudge: NudgeId, opts?: ApiRequestOptions): Promise<ApiResponse<null>>;
    /** DELETE `/api/nudge/image/{nudge}` — drop the attached image. (`delete.api.nudge.image.item`) */
    deleteImage(nudge: NudgeId, opts?: ApiRequestOptions): Promise<ApiResponse<null>>;
    /**
     * POST `/api/nudge-checkin/email` — inbound Mailgun webhook receiver.
     * `auth:public`. (`post.api.nudge-checkin.email`)
     */
    checkinEmail(body: NudgeCheckinEmailInput, opts?: ApiRequestOptions): Promise<ApiResponse<unknown>>;
    /**
     * POST `/api/nudge-checkin/sms` — inbound Twilio webhook receiver.
     * `auth:public`. (`post.api.nudge-checkin.sms`)
     */
    checkinSms(body: NudgeCheckinSmsInput, opts?: ApiRequestOptions): Promise<ApiResponse<unknown>>;
    /**
     * GET `/api/nudge/check/{secret}` — one-time secret-link
     * confirmation flow. `auth:public`. (`get.api.nudge.check.item`)
     */
    checkSecret(secret: NudgeSecret, opts?: ApiRequestOptions): Promise<ApiResponse<unknown>>;
    /** GET `/api/protocol/nudge/all`. (`get.api.protocol.nudge.all`) */
    listProtocolNudges(opts?: ApiRequestOptions): Promise<ApiResponse<NudgeProtocolIntegrationResource[]>>;
}
//# sourceMappingURL=modules-nudge-api-client.d.ts.map