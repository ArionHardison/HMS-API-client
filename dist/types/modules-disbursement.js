"use strict";
/**
 * Type definitions for `Modules/Disbursement`.
 *
 * Structural interfaces only — no runtime code. Mirrors
 * `Modules\Disbursement\Transformers\DisbursementResource`, a passthrough
 * resource. Shape kept open via `[key: string]: unknown` so callers can
 * narrow when they know the columns their tenant exposes.
 *
 * Manifest oddity: this module exposes `POST /api/disbursement/confirm`
 * instead of the `submit` action used by Appeal / Application / Report /
 * Verification. Methods on the client reflect that — see `confirm()`.
 */
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=modules-disbursement.js.map