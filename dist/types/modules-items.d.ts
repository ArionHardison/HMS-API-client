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
/** Identifier alias matching the Laravel route binding for catalog items. */
export type ItemId = number | string;
/** Identifier alias for `{user_item}` route binding (CustomUserItem). */
export type UserItemId = number | string;
/** Identifier alias for `{collection}` route binding (ItemCollection). */
export type CollectionId = number | string;
/** Identifier alias for `{item}` on `/api/collection-item/{item}` (CollectionItem join row). */
export type CollectionItemId = number | string;
/** `find-item/{search}/{type}` accepts arbitrary string for the type discriminator. */
export type ItemFindType = string;
/**
 * Loose item record returned by `items.{index,store,show,update,destroy}`.
 * The endpoints are not formally typed upstream — the controller returns
 * mixed JSON so the SDK leaves the body open.
 */
export interface ItemResource {
    id: number;
    name: unknown;
    description: unknown;
    price: unknown;
    status: unknown;
    image_url: unknown;
    created_at: unknown;
    updated_at: unknown;
}
/** Custom user-item resource returned by `user-items.{*}` and `items/find-item`. */
export interface UserItemResource {
    id: number;
    name: unknown;
    food_item: unknown;
    food_category_id: unknown;
    item_image: unknown;
    user_id: unknown;
    created_at: unknown;
    updated_at: unknown;
}
/** Lightweight food-category record returned by `GET /api/items/food-categories`. */
export interface FoodCategoryResource {
    id: number;
    name: unknown;
}
/** Saved collection record returned by `collection.{index,store,update,destroy}`. */
export interface CollectionResource {
    id: number;
    name: unknown;
    note: unknown;
    user_id: unknown;
    created_at: unknown;
    updated_at: unknown;
}
/** Collection with embedded items returned by `collection.show`. */
export interface CollectionWithItemsResource {
    id: number;
    name: unknown;
    note: unknown;
    items: unknown;
}
/** Single item-in-collection join row — `POST /api/collection-item` / `DELETE /api/collection-item/{item}`. */
export interface CollectionItemResource {
    id: number;
    item_photo: unknown;
    name: unknown;
    collection_item_id: number;
    user_item: unknown;
    amount: unknown;
}
/** Listing of collections (sidebar style) returned by `GET /api/collection-list`. */
export interface CollectionListResource {
    id: number;
    name: unknown;
}
/** Single item-in-collection entry used by create/update collection requests. */
export interface CollectionItemEntry {
    id: number;
    user_item: boolean;
    amount: number;
}
/** POST `/api/collection` body — see `CreateCollectionRequest`. */
export interface CreateCollectionInput {
    name: string;
    note: string;
    items: CollectionItemEntry[];
}
/** PUT `/api/collection/{collection}` body — see `UpdateCollectionRequest`. */
export interface UpdateCollectionInput {
    name: string;
    note: string;
    items: CollectionItemEntry[];
}
/** POST `/api/collection-item` body — see `AddItemToCollectionRequest`. */
export interface AddItemToCollectionInput {
    id: number;
    user_item: boolean;
    amount: number;
    collection_id: number;
}
/** POST `/api/user-items` body — see `CreateUserItemRequest`. */
export interface CreateUserItemInput {
    name: string;
    food_item?: boolean | null;
    food_category_id?: number | null;
}
/**
 * PUT `/api/user-items/{user_item}` body — see `UpdateUserItemRequest`.
 *
 * Either `name` or `item_image` must be supplied (Laravel rule:
 * `required_without:`). `item_image` is a `File`/`Blob`, which forces the
 * SDK into multipart mode automatically.
 */
export interface UpdateUserItemInput {
    name?: string;
    item_image?: File | Blob;
}
/**
 * Free-form items.store / items.update body. The controller does not
 * enforce a FormRequest, so the SDK lets callers pass any JSON-serializable
 * payload and lets the server do shape validation.
 */
export type ItemMutationInput = Record<string, unknown>;
//# sourceMappingURL=modules-items.d.ts.map