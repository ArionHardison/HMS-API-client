/**
 * `Modules/Items` API client.
 *
 * Covers the 20 endpoints documented in `sdk/spec/endpoints.json` with
 * `module === "Modules/Items"`:
 *
 *   - 5 catalog-item CRUD endpoints (`items.{index,store,show,update,destroy}`)
 *   - 2 catalog helpers (`find-item/{search}/{type}`, `food-categories`)
 *   - 5 user-item CRUD endpoints (`user-items.{index,store,show,update,destroy}`)
 *   - 5 collection CRUD endpoints (`collection.{index,store,show,update,destroy}`)
 *   - 1 collection sidebar (`GET /api/collection-list`)
 *   - 2 collection-item join endpoints (`POST /api/collection-item`,
 *     `DELETE /api/collection-item/{item}`)
 *
 * Naming policy: methods are scoped by surface (`*Items`, `*UserItems`,
 * `*Collection*`) so two endpoints sharing a final segment (`items.index`
 * vs `user-items.index` vs `collection.index`) don't collide on a generic
 * `list()` name.
 *
 * Class is named `ItemsModuleApiClient` to avoid colliding with the legacy
 * `ItemsApiClient` in `api-client.ts` / `hms-api-client.ts`. The legacy
 * client coexists; do not refactor it.
 *
 * Integration with `src/index.ts`: this file's TDD slice does NOT modify
 * the barrel — see the integration block at the bottom for the lines a
 * future barrel-update step should add.
 */
import { BaseApiClient } from '../api-client';
import type { ApiRequestOptions, ApiResponse } from '../api-client';
import type {
  AddItemToCollectionInput,
  CollectionId,
  CollectionItemId,
  CollectionItemResource,
  CollectionListResource,
  CollectionResource,
  CollectionWithItemsResource,
  CreateCollectionInput,
  CreateUserItemInput,
  FoodCategoryResource,
  ItemFindType,
  ItemId,
  ItemMutationInput,
  ItemResource,
  UpdateCollectionInput,
  UpdateUserItemInput,
  UserItemId,
  UserItemResource,
} from '../types/modules-items';

/**
 * Public client over the `/api/items/*`, `/api/user-items/*`,
 * `/api/collection*`, and `/api/collection-item*` surfaces. Subclasses
 * `BaseApiClient` so it picks up auth / `X-Domain` / Laravel `_method`
 * override / `ApiError` normalization for free.
 */
export class ItemsModuleApiClient extends BaseApiClient {
  // ---------------------------------------------------------------------------
  // Catalog items (`/api/items/*`)
  // ---------------------------------------------------------------------------

  /** GET `/api/items` — list catalog items. (`items.index`) */
  listItems(opts?: ApiRequestOptions): Promise<ApiResponse<ItemResource[]>> {
    return this.get<ItemResource[]>('/api/items', undefined, opts);
  }

  /** POST `/api/items` — create a catalog item. (`items.store`) */
  createItem(
    body: ItemMutationInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ItemResource>> {
    return this.post<ItemResource>('/api/items', body, opts);
  }

  /** GET `/api/items/{item}` — show a catalog item. (`items.show`) */
  showItem(item: ItemId, opts?: ApiRequestOptions): Promise<ApiResponse<ItemResource>> {
    return this.get<ItemResource>(`/api/items/${encodeURIComponent(String(item))}`, undefined, opts);
  }

  /** PUT `/api/items/{item}` — update. Sent as POST + `?_method=PUT`. (`items.update`) */
  updateItem(
    item: ItemId,
    body: ItemMutationInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ItemResource>> {
    return this.put<ItemResource>(`/api/items/${encodeURIComponent(String(item))}`, body, opts);
  }

  /** DELETE `/api/items/{item}`. (`items.destroy`) */
  destroyItem(item: ItemId, opts?: ApiRequestOptions): Promise<ApiResponse<null>> {
    return this.delete<null>(`/api/items/${encodeURIComponent(String(item))}`, opts);
  }

  /** GET `/api/items/find-item/{search}/{type}` — fuzzy lookup of catalog or user items. */
  findItem(
    search: string,
    type: ItemFindType,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<UserItemResource>> {
    return this.get<UserItemResource>(
      `/api/items/find-item/${encodeURIComponent(search)}/${encodeURIComponent(type)}`,
      undefined,
      opts,
    );
  }

  /** GET `/api/items/food-categories` — list food categories used by user-items. */
  foodCategories(opts?: ApiRequestOptions): Promise<ApiResponse<FoodCategoryResource[]>> {
    return this.get<FoodCategoryResource[]>('/api/items/food-categories', undefined, opts);
  }

  // ---------------------------------------------------------------------------
  // User items (`/api/user-items/*`)
  // ---------------------------------------------------------------------------

  /** GET `/api/user-items` — list (paginated) the user's custom items. (`user-items.index`) */
  listUserItems(opts?: ApiRequestOptions): Promise<ApiResponse<UserItemResource[]>> {
    return this.get<UserItemResource[]>('/api/user-items', undefined, opts);
  }

  /** POST `/api/user-items` — create a user-item. (`user-items.store`) */
  createUserItem(
    body: CreateUserItemInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<UserItemResource>> {
    return this.post<UserItemResource>('/api/user-items', body, opts);
  }

  /** GET `/api/user-items/{user_item}` — show. (`user-items.show`) */
  showUserItem(
    userItem: UserItemId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<UserItemResource>> {
    return this.get<UserItemResource>(
      `/api/user-items/${encodeURIComponent(String(userItem))}`,
      undefined,
      opts,
    );
  }

  /**
   * PUT `/api/user-items/{user_item}` — update.
   *
   * Sent as POST + `?_method=PUT`. If `body.item_image` is a `File`/`Blob`
   * the base client automatically switches to `multipart/form-data`.
   * (`user-items.update`)
   */
  updateUserItem(
    userItem: UserItemId,
    body: UpdateUserItemInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<UserItemResource>> {
    return this.put<UserItemResource>(
      `/api/user-items/${encodeURIComponent(String(userItem))}`,
      body,
      opts,
    );
  }

  /** DELETE `/api/user-items/{user_item}`. (`user-items.destroy`) */
  destroyUserItem(
    userItem: UserItemId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<UserItemResource>> {
    return this.delete<UserItemResource>(
      `/api/user-items/${encodeURIComponent(String(userItem))}`,
      opts,
    );
  }

  // ---------------------------------------------------------------------------
  // Collections (`/api/collection*`)
  // ---------------------------------------------------------------------------

  /** GET `/api/collection` — list (paginated) the user's collections. (`collection.index`) */
  listCollections(opts?: ApiRequestOptions): Promise<ApiResponse<CollectionResource[]>> {
    return this.get<CollectionResource[]>('/api/collection', undefined, opts);
  }

  /** POST `/api/collection` — create a collection with embedded items. (`collection.store`) */
  createCollection(
    body: CreateCollectionInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<CollectionResource>> {
    return this.post<CollectionResource>('/api/collection', body, opts);
  }

  /** GET `/api/collection/{collection}` — show with embedded items. (`collection.show`) */
  showCollection(
    collection: CollectionId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<CollectionWithItemsResource>> {
    return this.get<CollectionWithItemsResource>(
      `/api/collection/${encodeURIComponent(String(collection))}`,
      undefined,
      opts,
    );
  }

  /** PUT `/api/collection/{collection}` — update. Sent as POST + `?_method=PUT`. (`collection.update`) */
  updateCollection(
    collection: CollectionId,
    body: UpdateCollectionInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<CollectionResource>> {
    return this.put<CollectionResource>(
      `/api/collection/${encodeURIComponent(String(collection))}`,
      body,
      opts,
    );
  }

  /** DELETE `/api/collection/{collection}`. (`collection.destroy`) */
  destroyCollection(
    collection: CollectionId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<CollectionResource>> {
    return this.delete<CollectionResource>(
      `/api/collection/${encodeURIComponent(String(collection))}`,
      opts,
    );
  }

  /** GET `/api/collection-list` — sidebar-style listing of collection summaries. */
  collectionList(opts?: ApiRequestOptions): Promise<ApiResponse<CollectionListResource[]>> {
    return this.get<CollectionListResource[]>('/api/collection-list', undefined, opts);
  }

  // ---------------------------------------------------------------------------
  // Collection-items (`/api/collection-item*`)
  // ---------------------------------------------------------------------------

  /** POST `/api/collection-item` — append an item to a collection. */
  addItemToCollection(
    body: AddItemToCollectionInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<CollectionItemResource>> {
    return this.post<CollectionItemResource>('/api/collection-item', body, opts);
  }

  /** DELETE `/api/collection-item/{item}` — remove a single join row. */
  removeItemFromCollection(
    item: CollectionItemId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<null>> {
    return this.delete<null>(`/api/collection-item/${encodeURIComponent(String(item))}`, opts);
  }
}
