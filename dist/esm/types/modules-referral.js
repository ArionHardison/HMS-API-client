/**
 * Type definitions for `Modules/Referral`.
 *
 * Structural interfaces only — no runtime code. Mirrors
 * `Modules\Referral\Transformers\ReferralResource`, a passthrough
 * resource. Shape kept open via `[key: string]: unknown` so callers can
 * narrow when they know the column set their tenant exposes.
 *
 * Manifest oddity: like Disbursement, Referral exposes
 * `POST /api/referral/confirm` rather than `submit` — the client method is
 * named `confirm()` accordingly.
 */
export {};
//# sourceMappingURL=modules-referral.js.map