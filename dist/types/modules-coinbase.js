"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=modules-coinbase.js.map