/**
 * Types for `LmsApiClient` — the Lms inbound grading webhook.
 *
 * Source of truth: `Modules/Lms/Routes/api.php`,
 * `LmsGradingWebhookController`, `StoreLmsGradingRequest`. Single endpoint,
 * `auth:sanctum` + `abilities:lms:writer` + idempotency. Returns HTTP 202
 * (status `accepted` on first write, `replayed` on a duplicate enrollment).
 */
export {};
//# sourceMappingURL=lms.js.map