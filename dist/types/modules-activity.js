"use strict";
/**
 * Type definitions for `Modules/Activity` (~31 endpoints).
 *
 * Structural interfaces only — no runtime code. Mirrors the resources surfaced
 * by the controllers under `Modules\Activity\Http\Controllers\*` and the
 * `Modules\Activity\Transformers\*Resource` shapes documented in
 * `sdk/spec/endpoints.json`.
 *
 * Many fields are typed `unknown` because the upstream `*Resource` files
 * pass-through arbitrary JSON columns (location metadata, booking payloads,
 * provider capability flags). Consumers that know the inner shape can narrow
 * with their own type guards — the SDK is intentionally permissive.
 */
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=modules-activity.js.map