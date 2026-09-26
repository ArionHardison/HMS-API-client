"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesModuleApiClient = void 0;
/**
 * `Modules/Services` API client.
 *
 * Covers the 3 endpoints from `sdk/spec/endpoints.json` with
 * `module === "Modules/Services"` — the service resolver:
 *
 *   - POST `/api/v1/services/resolve`  — discover candidates from HRM /
 *     LMS / external for a `service_name` against a chain.
 *   - POST `/api/v1/services/reserve`  — claim a slot or candidate.
 *   - POST `/api/v1/services/release`  — release a previously-reserved
 *     slot or candidate.
 *
 * The `/api/v1/` prefix is preserved as part of each path string per the
 * slice manifest (Services and ETL are the only versioned modules in the
 * SDK). All endpoints are `auth:api` upstream — Bearer required.
 *
 * Reserve and release share the same upstream Form Request
 * (`ReserveServiceSlotRequest`) so they take the same body shape.
 */
const api_client_1 = require("../api-client");
/**
 * Public client over `/api/v1/services/*`. Subclasses `BaseApiClient`
 * for token / domain handling.
 */
class ServicesModuleApiClient extends api_client_1.BaseApiClient {
    // ---------------------------------------------------------------------------
    // Resolver
    // ---------------------------------------------------------------------------
    /**
     * POST `/api/v1/services/resolve` — discover candidates for a service
     * name, optionally filtered by `near` (e.g., locality string). The
     * returned list is open-shaped because resolvers vary by source.
     * (`post.api.v1.services.resolve`)
     */
    resolve(body, opts) {
        return this.post('/api/v1/services/resolve', body, opts);
    }
    /**
     * POST `/api/v1/services/reserve` — claim a slot for the chain. The
     * `source` enum determines which of `slot_id` / `course_id` /
     * `external_candidate_id` is required upstream.
     * (`post.api.v1.services.reserve`)
     */
    reserve(body, opts) {
        return this.post('/api/v1/services/reserve', body, opts);
    }
    /**
     * POST `/api/v1/services/release` — release a previously-claimed
     * slot or candidate. Same body shape as `reserve` per the upstream
     * controller. (`post.api.v1.services.release`)
     */
    release(body, opts) {
        return this.post('/api/v1/services/release', body, opts);
    }
}
exports.ServicesModuleApiClient = ServicesModuleApiClient;
//# sourceMappingURL=modules-services-api-client.js.map