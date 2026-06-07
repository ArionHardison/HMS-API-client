"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinbaseModuleApiClient = void 0;
/**
 * `Vendor/Coinbase` API client.
 *
 * Single endpoint from `sdk/spec/endpoints.json` with
 * `module === "Vendor/Coinbase"`:
 *
 *   - POST `/api/coinbase/webhook` — inbound Coinbase Commerce webhook
 *     receiver. `auth:public` AND tenant-context-free.
 *
 * Wiring contract (consumer-side, do NOT change without coordinating):
 * the consumer typically mounts a thin proxy at `/api/webhook/coinbase/*`
 * and constructs this client with `getDomain` returning `null` so the
 * SDK omits both Authorization and X-Domain headers. Callers always
 * pass `{ auth: false }` per call to skip Authorization.
 *
 * The class is named `CoinbaseModuleApiClient` to match the slice naming
 * policy even though the upstream module is `Vendor/Coinbase`.
 */
const api_client_1 = require("../api-client");
/**
 * Public client over `/api/coinbase/*`. Subclasses `BaseApiClient` even
 * though only one endpoint exists, so the same auth / domain / `_method`
 * machinery is available for future Coinbase routes.
 */
class CoinbaseModuleApiClient extends api_client_1.BaseApiClient {
    /**
     * POST `/api/coinbase/webhook` — Coinbase Commerce webhook receiver.
     * `auth:public`, tenant-context-free. (`coinbase-webhook`)
     *
     * Callers MUST pass `{ auth: false }` so the Authorization header is
     * omitted; configure the client itself with `getDomain: () => null`
     * so the X-Domain header is also omitted (Coinbase publishes to a
     * tenant-context-free public endpoint).
     */
    webhook(body, opts) {
        return this.post('/api/coinbase/webhook', body, opts);
    }
}
exports.CoinbaseModuleApiClient = CoinbaseModuleApiClient;
//# sourceMappingURL=modules-coinbase-api-client.js.map