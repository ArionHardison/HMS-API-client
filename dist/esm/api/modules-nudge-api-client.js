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
/**
 * Public client over `/api/nudge/*`, `/api/nudge-checkin/*`, and
 * `/api/protocol/nudge/all`. Subclasses `BaseApiClient`.
 */
export class NudgeModuleApiClient extends BaseApiClient {
    // ---------------------------------------------------------------------------
    // CRUD (auth:api)
    // ---------------------------------------------------------------------------
    /** GET `/api/nudge` — list nudges. (`nudge.index`) */
    list(opts) {
        return this.get('/api/nudge', undefined, opts);
    }
    /** POST `/api/nudge` — create a nudge. (`nudge.store`) */
    create(body, opts) {
        return this.post('/api/nudge', body, opts);
    }
    /** GET `/api/nudge/{nudge}`. (`nudge.show`) */
    show(nudge, opts) {
        const n = encodeURIComponent(String(nudge));
        return this.get(`/api/nudge/${n}`, undefined, opts);
    }
    /** PUT `/api/nudge/{nudge}` — sent as POST + `?_method=PUT`. (`nudge.update`) */
    update(nudge, body, opts) {
        const n = encodeURIComponent(String(nudge));
        return this.put(`/api/nudge/${n}`, body, opts);
    }
    /** DELETE `/api/nudge/{nudge}`. (`nudge.destroy`) */
    destroy(nudge, opts) {
        const n = encodeURIComponent(String(nudge));
        return this.delete(`/api/nudge/${n}`, opts);
    }
    /** DELETE `/api/nudge/image/{nudge}` — drop the attached image. (`delete.api.nudge.image.item`) */
    deleteImage(nudge, opts) {
        const n = encodeURIComponent(String(nudge));
        return this.delete(`/api/nudge/image/${n}`, opts);
    }
    // ---------------------------------------------------------------------------
    // Public webhook receivers (auth:public — pass `{ auth: false }` per call)
    // ---------------------------------------------------------------------------
    /**
     * POST `/api/nudge-checkin/email` — inbound Mailgun webhook receiver.
     * `auth:public`. (`post.api.nudge-checkin.email`)
     */
    checkinEmail(body, opts) {
        return this.post('/api/nudge-checkin/email', body, opts);
    }
    /**
     * POST `/api/nudge-checkin/sms` — inbound Twilio webhook receiver.
     * `auth:public`. (`post.api.nudge-checkin.sms`)
     */
    checkinSms(body, opts) {
        return this.post('/api/nudge-checkin/sms', body, opts);
    }
    /**
     * GET `/api/nudge/check/{secret}` — one-time secret-link
     * confirmation flow. `auth:public`. (`get.api.nudge.check.item`)
     */
    checkSecret(secret, opts) {
        const s = encodeURIComponent(String(secret));
        return this.get(`/api/nudge/check/${s}`, undefined, opts);
    }
    // ---------------------------------------------------------------------------
    // Protocol integration
    // ---------------------------------------------------------------------------
    /** GET `/api/protocol/nudge/all`. (`get.api.protocol.nudge.all`) */
    listProtocolNudges(opts) {
        return this.get('/api/protocol/nudge/all', undefined, opts);
    }
}
//# sourceMappingURL=modules-nudge-api-client.js.map