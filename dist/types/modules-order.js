"use strict";
/**
 * Type definitions for `Modules/Order`.
 *
 * Structural interfaces only — no runtime code. These mirror the Laravel
 * `Modules\Order\Transformers\*Resource` shapes from `sdk/spec/endpoints.json`.
 *
 * Many fields are typed `unknown` because the upstream `*Resource` files
 * pass-through arbitrary JSON columns. When a downstream caller knows the
 * inner shape they can narrow with their own type guard — the SDK is
 * intentionally not opinionated about it.
 *
 * Two route-binding aliases (`OrderId`, `AttachedOrderItemId`) keep call sites
 * honest: the underlying Laravel route accepts both numeric IDs and string
 * slugs (`{order}` / `{item}` / `{status}`), so the SDK accepts both.
 */
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=modules-order.js.map