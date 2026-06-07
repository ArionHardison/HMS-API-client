"use strict";
/**
 * Chat + Notifications + Stripe / Payments + Subscriptions + Broadcasting slice
 * — request / response types.
 *
 * Source of truth: `sdk/spec/endpoints.json`. Each interface mirrors the
 * `request.shape` or `response.shape` of a single endpoint. `unknown` is
 * used verbatim for fields the manifest could not concretize (Laravel
 * Resource `parent::toArray($request)` calls, dynamic Stripe payloads,
 * etc.) — narrow at the call site.
 *
 * Structural interfaces only — no branded type aliases. The four frontends
 * (sys, gov, app, CI-WWW) re-declare input shapes structurally; we keep the
 * shapes plain so they line up.
 */
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=communications.js.map