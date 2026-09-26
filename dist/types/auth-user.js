"use strict";
/**
 * Auth + User Profile slice — request / response types.
 *
 * Source of truth: `sdk/spec/endpoints.json`. Each interface mirrors the
 * `request.shape` or `response.shape` of a single endpoint. `unknown` is used
 * verbatim for fields the manifest could not concretize (Laravel Resource
 * `parent::toArray($request)` calls, etc.) — narrow them at the call site.
 *
 * Structural interfaces only — no branded type aliases. (See top-level
 * CLAUDE.md guidance.)
 */
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=auth-user.js.map