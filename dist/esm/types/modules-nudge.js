/**
 * Type definitions for `Modules/Nudge`.
 *
 * Structural interfaces only. Mirrors the request shapes captured in
 * `sdk/spec/endpoints.json` (module === "Modules/Nudge"). Two auth tiers:
 *
 *   - Authed (Bearer): index, store, show, update, destroy, image-delete,
 *     `protocol/nudge/all`.
 *   - Public (no Authorization): `nudge-checkin/email` + `/sms` (vendor
 *     webhook receivers from Mailgun / Twilio), `nudge/check/{secret}`
 *     (one-time secret-link confirmation).
 *
 * The legacy `NudgeApiClient` in `hms-api-client.ts` already exists and is
 * NOT removed — these types are scoped to `NudgeModuleApiClient` to avoid
 * clashing with the legacy type aliases.
 */
export {};
//# sourceMappingURL=modules-nudge.js.map