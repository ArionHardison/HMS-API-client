"use strict";
/**
 * Type definitions for the Deal Runtime Wizard slice of the P2X API —
 * the `POST/GET /api/wizard/deal/*` routes served by
 * `Modules\Deals\Http\Controllers\DealWizardController` and
 * `Modules\Deals\Http\Controllers\DealVerificationController`
 * (route file: `Modules/Deals/Routes/api.php`).
 *
 * Every request shape is derived from the controller action's
 * `$request->validate([...])` (or its FormRequest) and every response shape
 * from the controller's `response()->json(...)` payload / the
 * `Modules\Deals\Http\Resources\DealResource`. Nothing here is invented —
 * if a field isn't asserted by the api, it is typed `unknown` rather than
 * guessed.
 *
 * Wire notes that the SDK client layer handles, not these types:
 *   - `X-Domain` (tenant) + `Authorization: Bearer` on every call.
 *   - `Idempotency-Key` on writes (POST/PATCH/DELETE) — surfaced as the
 *     `idempotencyKey` argument on the write methods.
 *   - PATCH → POST + `?_method=PATCH` (Laravel verb override).
 */
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=deal-wizard.js.map