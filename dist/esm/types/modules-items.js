/**
 * Type definitions for `Modules/Items`.
 *
 * Structural interfaces only — no runtime code. These mirror the Laravel
 * `Modules\Items\Transformers\*Resource` shapes from `sdk/spec/endpoints.json`.
 *
 * The "shopping context" surfaces three kinds of records:
 *
 *   - `Item` — a global catalog item (`/api/items`). Endpoints have minimal
 *     spec metadata (no `Resource` was annotated upstream); the SDK exposes
 *     the same `unknown`-leaning structural shape used by the controller.
 *   - `UserItem` — a per-user / custom item (`/api/user-items`).
 *   - `Collection` — a saved bundle of items (`/api/collection*`), with
 *     paired `CollectionItem` join records via `/api/collection-item*`.
 *
 * Many fields are typed `unknown` because the upstream `*Resource` files
 * pass-through arbitrary JSON columns. When a downstream caller knows the
 * inner shape they can narrow with their own type guard.
 */
export {};
//# sourceMappingURL=modules-items.js.map