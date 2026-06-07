/**
 * Type definitions for `Vendor/Coinbase`.
 *
 * Single-endpoint vendor webhook receiver. The upstream controller
 * (`Shakurov\Coinbase\Http\Controllers\WebhookController`) accepts the
 * Coinbase Commerce webhook envelope verbatim — we keep the input shape
 * open so consumers can forward whatever Coinbase published.
 *
 * Unauthenticated AND tenant-context-free: callers wire it as a thin
 * proxy at `/api/webhook/coinbase/*` with `auth: false` and a
 * `getDomain` that returns null.
 */
/** Coinbase event id passthrough. Use it to dedupe replays in the consumer. */
export type CoinbaseEventId = string;
/**
 * `POST /api/coinbase/webhook` body — open shape. Coinbase publishes
 * a `{ id, type, data }` envelope; we leave the inner shape unknown so
 * downstream consumers narrow per-`type`.
 */
export interface CoinbaseWebhookInput {
    id?: CoinbaseEventId;
    type?: string;
    data?: unknown;
    [key: string]: unknown;
}
/** Webhook acknowledgement response — controller emits an open envelope. */
export interface CoinbaseWebhookResource {
    received?: unknown;
    [key: string]: unknown;
}
//# sourceMappingURL=modules-coinbase.d.ts.map