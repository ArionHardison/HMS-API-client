/**
 * Types for `HitlApiClient` — the HITL (human-in-the-loop) staffing /
 * escalation module.
 *
 * Source of truth: `Modules/Hitl/Routes/api.php`, `HitlRequestedController`,
 * `HitlResumeController`, and the two FormRequests. Both endpoints are
 * `auth:api` + `abilities:hitl:writer` + `idempotency` (callers send an
 * `Idempotency-Key` header). Both return HTTP 202.
 */
export {};
//# sourceMappingURL=hitl.js.map