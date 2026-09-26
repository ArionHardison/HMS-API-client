"use strict";
/**
 * Personal Chain + Wizard codify-state + Public-codify slice — request /
 * response types.
 *
 * Source of truth: `sdk/spec/endpoints.json` (filtered set captured in
 * `/tmp/personalchain-wizard-slice.json`). Each interface mirrors the
 * `request.shape` or `response.shape` of a single endpoint.
 *
 * `unknown` is used verbatim for fields the manifest could not concretize
 * (Laravel Resource `parent::toArray($request)` calls, etc.) — narrow them at
 * the call site. Structural interfaces only — no branded type aliases — so
 * `sys/` can drop its structural workarounds.
 */
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=personal-chain-wizard.js.map