"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralModuleApiClient = void 0;
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
const api_client_1 = require("../api-client");
/**
 * Public client over `/api/referral/*` and `/api/protocol/referral/*`.
 * Subclasses `BaseApiClient` for auth / `X-Domain` / `_method` / `ApiError`.
 */
class ReferralModuleApiClient extends api_client_1.BaseApiClient {
    // ---------------------------------------------------------------------------
    // CRUD
    // ---------------------------------------------------------------------------
    /** GET `/api/referral`. (`referral.index`) */
    list(opts) {
        return this.get('/api/referral', undefined, opts);
    }
    /** POST `/api/referral`. (`referral.store`) */
    create(body, opts) {
        return this.post('/api/referral', body, opts);
    }
    /** GET `/api/referral/{referral}`. (`referral.show`) */
    show(referral, opts) {
        return this.get(`/api/referral/${encodeURIComponent(String(referral))}`, undefined, opts);
    }
    /** PUT `/api/referral/{referral}` — sent as POST + `?_method=PUT`. (`referral.update`) */
    update(referral, body, opts) {
        return this.put(`/api/referral/${encodeURIComponent(String(referral))}`, body, opts);
    }
    /** DELETE `/api/referral/{referral}`. (`referral.destroy`) */
    destroy(referral, opts) {
        return this.delete(`/api/referral/${encodeURIComponent(String(referral))}`, opts);
    }
    // ---------------------------------------------------------------------------
    // Lifecycle (note: this module uses `confirm`, not `submit`)
    // ---------------------------------------------------------------------------
    /** POST `/api/referral/confirm`. (`post.api.referral.confirm`) */
    confirm(body, opts) {
        return this.post('/api/referral/confirm', body, opts);
    }
    // ---------------------------------------------------------------------------
    // Protocol run reads
    // ---------------------------------------------------------------------------
    /** GET `/api/referral/run-global/{referral}/{task}`. (`get.api.referral.run-global.item.item`) */
    runGlobal(referral, task, opts) {
        const r = encodeURIComponent(String(referral));
        const t = encodeURIComponent(String(task));
        return this.get(`/api/referral/run-global/${r}/${t}`, undefined, opts);
    }
    /** GET `/api/referral/run/{referral}/{chain}`. (`get.api.referral.run.item.item`) */
    run(referral, chain, opts) {
        const r = encodeURIComponent(String(referral));
        const c = encodeURIComponent(String(chain));
        return this.get(`/api/referral/run/${r}/${c}`, undefined, opts);
    }
    // ---------------------------------------------------------------------------
    // Protocol integration
    // ---------------------------------------------------------------------------
    /** GET `/api/protocol/referral/all`. (`get.api.protocol.referral.all`) */
    listProtocolReferrals(opts) {
        return this.get('/api/protocol/referral/all', undefined, opts);
    }
}
exports.ReferralModuleApiClient = ReferralModuleApiClient;
//# sourceMappingURL=modules-referral-api-client.js.map