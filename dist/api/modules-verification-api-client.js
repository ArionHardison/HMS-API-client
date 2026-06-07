"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationModuleApiClient = void 0;
/**
 * `Modules/Verification` API client.
 *
 * Covers the 9 endpoints documented in `sdk/spec/endpoints.json` with
 * `module === "Modules/Verification"`:
 *
 *   - 5 CRUD endpoints (`verification.{index,store,show,update,destroy}`)
 *   - 1 lifecycle endpoint (`POST /api/verification/submit`)
 *   - 2 protocol-run reads (`run-global/{verification}/{task}`,
 *     `run/{verification}/{chain}`) — raw `{ data, chain }` shape
 *   - 1 protocol-integration listing (`/api/protocol/verification/all`)
 *
 * Class: `VerificationModuleApiClient`. Auth: every route is `auth:api`.
 */
const api_client_1 = require("../api-client");
/**
 * Public client over `/api/verification/*` and `/api/protocol/verification/*`.
 * Subclasses `BaseApiClient` for auth / `X-Domain` / `_method` / `ApiError`.
 */
class VerificationModuleApiClient extends api_client_1.BaseApiClient {
    // ---------------------------------------------------------------------------
    // CRUD
    // ---------------------------------------------------------------------------
    /** GET `/api/verification`. (`verification.index`) */
    list(opts) {
        return this.get('/api/verification', undefined, opts);
    }
    /** POST `/api/verification`. (`verification.store`) */
    create(body, opts) {
        return this.post('/api/verification', body, opts);
    }
    /** GET `/api/verification/{verification}`. (`verification.show`) */
    show(verification, opts) {
        return this.get(`/api/verification/${encodeURIComponent(String(verification))}`, undefined, opts);
    }
    /** PUT `/api/verification/{verification}` — sent as POST + `?_method=PUT`. (`verification.update`) */
    update(verification, body, opts) {
        return this.put(`/api/verification/${encodeURIComponent(String(verification))}`, body, opts);
    }
    /** DELETE `/api/verification/{verification}`. (`verification.destroy`) */
    destroy(verification, opts) {
        return this.delete(`/api/verification/${encodeURIComponent(String(verification))}`, opts);
    }
    // ---------------------------------------------------------------------------
    // Lifecycle
    // ---------------------------------------------------------------------------
    /** POST `/api/verification/submit`. (`post.api.verification.submit`) */
    submit(body, opts) {
        return this.post('/api/verification/submit', body, opts);
    }
    // ---------------------------------------------------------------------------
    // Protocol run reads
    // ---------------------------------------------------------------------------
    /** GET `/api/verification/run-global/{verification}/{task}`. (`get.api.verification.run-global.item.item`) */
    runGlobal(verification, task, opts) {
        const v = encodeURIComponent(String(verification));
        const t = encodeURIComponent(String(task));
        return this.get(`/api/verification/run-global/${v}/${t}`, undefined, opts);
    }
    /** GET `/api/verification/run/{verification}/{chain}`. (`get.api.verification.run.item.item`) */
    run(verification, chain, opts) {
        const v = encodeURIComponent(String(verification));
        const c = encodeURIComponent(String(chain));
        return this.get(`/api/verification/run/${v}/${c}`, undefined, opts);
    }
    // ---------------------------------------------------------------------------
    // Protocol integration
    // ---------------------------------------------------------------------------
    /** GET `/api/protocol/verification/all`. (`get.api.protocol.verification.all`) */
    listProtocolVerifications(opts) {
        return this.get('/api/protocol/verification/all', undefined, opts);
    }
}
exports.VerificationModuleApiClient = VerificationModuleApiClient;
//# sourceMappingURL=modules-verification-api-client.js.map