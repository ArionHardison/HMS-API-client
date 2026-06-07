import type { AddItemToCollectionRequest } from '../models/AddItemToCollectionRequest';
import type { CollectionItemResource } from '../models/CollectionItemResource';
import type { CollectionListResource } from '../models/CollectionListResource';
import type { CollectionResource } from '../models/CollectionResource';
import type { CollectionWithItemsResource } from '../models/CollectionWithItemsResource';
import type { CreateCollectionRequest } from '../models/CreateCollectionRequest';
import type { CreateUserItemRequest } from '../models/CreateUserItemRequest';
import type { FoodCategoryResource } from '../models/FoodCategoryResource';
import type { UpdateCollectionRequest } from '../models/UpdateCollectionRequest';
import type { UpdateUserItemRequest } from '../models/UpdateUserItemRequest';
import type { UserItemResource } from '../models/UserItemResource';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class ModulesItemsService {
    /**
     * Modules\Items\Http\Controllers\ItemsCollectionController@index
     * @returns any Success
     * @throws ApiError
     */
    static collectionIndex({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: Array<CollectionResource>;
        links?: Record<string, any>;
        meta?: Record<string, any>;
    }>;
    /**
     * Modules\Items\Http\Controllers\ItemsCollectionController@store
     * @returns any Success
     * @throws ApiError
     */
    static collectionStore({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: CreateCollectionRequest;
    }): CancelablePromise<{
        data: CollectionResource;
    }>;
    /**
     * Modules\Items\Http\Controllers\ItemsCollectionController@addItemToCollection
     * @returns any Success
     * @throws ApiError
     */
    static postApiCollectionItem({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: AddItemToCollectionRequest;
    }): CancelablePromise<{
        data: CollectionItemResource;
    }>;
    /**
     * Modules\Items\Http\Controllers\ItemsCollectionController@deleteItemFromCollection
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiCollectionItemItem({ item, xDomain, }: {
        /**
         * Bound to model CollectionItem
         */
        item: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: CollectionItemResource;
    }>;
    /**
     * Modules\Items\Http\Controllers\ItemsCollectionController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiCollectionList({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: CollectionListResource;
    }>;
    /**
     * Modules\Items\Http\Controllers\ItemsCollectionController@show
     * @returns any Success
     * @throws ApiError
     */
    static collectionShow({ collection, xDomain, }: {
        /**
         * Bound to model ItemCollection
         */
        collection: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: CollectionWithItemsResource;
    }>;
    /**
     * Modules\Items\Http\Controllers\ItemsCollectionController@update
     * @returns any Success
     * @throws ApiError
     */
    static collectionUpdate({ collection, xDomain, requestBody, }: {
        /**
         * Bound to model ItemCollection
         */
        collection: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: UpdateCollectionRequest;
    }): CancelablePromise<{
        data: CollectionResource;
    }>;
    /**
     * Modules\Items\Http\Controllers\ItemsCollectionController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static collectionDestroy({ collection, xDomain, }: {
        /**
         * Bound to model ItemCollection
         */
        collection: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: CollectionResource;
    }>;
    /**
     * Modules\Items\Http\Controllers\ItemsController@index
     * @returns any Success
     * @throws ApiError
     */
    static itemsIndex({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<Record<string, any>>;
    /**
     * Modules\Items\Http\Controllers\ItemsController@store
     * @returns any Success
     * @throws ApiError
     */
    static itemsStore({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<Record<string, any>>;
    /**
     * Modules\Items\Http\Controllers\UserItemsController@search
     * @returns any Success
     * @throws ApiError
     */
    static getApiItemsFindItemItemItem({ search, type, xDomain, }: {
        search: string;
        type: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: UserItemResource;
    }>;
    /**
     * Modules\Items\Http\Controllers\ItemsController@foodCategories
     * @returns any Success
     * @throws ApiError
     */
    static getApiItemsFoodCategories({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: FoodCategoryResource;
    }>;
    /**
     * Modules\Items\Http\Controllers\ItemsController@show
     * @returns any Success
     * @throws ApiError
     */
    static itemsShow({ item, xDomain, }: {
        item: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<Record<string, any>>;
    /**
     * Modules\Items\Http\Controllers\ItemsController@update
     * @returns any Success
     * @throws ApiError
     */
    static itemsUpdate({ item, xDomain, }: {
        item: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<Record<string, any>>;
    /**
     * Modules\Items\Http\Controllers\ItemsController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static itemsDestroy({ item, xDomain, }: {
        item: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<Record<string, any>>;
    /**
     * Modules\Items\Http\Controllers\UserItemsController@index
     * @returns any Success
     * @throws ApiError
     */
    static userItemsIndex({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: Array<UserItemResource>;
        links?: Record<string, any>;
        meta?: Record<string, any>;
    }>;
    /**
     * Modules\Items\Http\Controllers\UserItemsController@store
     * @returns any Success
     * @throws ApiError
     */
    static userItemsStore({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: CreateUserItemRequest;
    }): CancelablePromise<{
        data: UserItemResource;
    }>;
    /**
     * Modules\Items\Http\Controllers\UserItemsController@show
     * @returns any Success
     * @throws ApiError
     */
    static userItemsShow({ userItem, xDomain, }: {
        /**
         * Bound to model CustomUserItem
         */
        userItem: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: UserItemResource;
    }>;
    /**
     * Modules\Items\Http\Controllers\UserItemsController@update
     * @returns any Success
     * @throws ApiError
     */
    static userItemsUpdate({ userItem, xDomain, formData, }: {
        /**
         * Bound to model CustomUserItem
         */
        userItem: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        formData: UpdateUserItemRequest;
    }): CancelablePromise<{
        data: UserItemResource;
    }>;
    /**
     * Modules\Items\Http\Controllers\UserItemsController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static userItemsDestroy({ userItem, xDomain, }: {
        /**
         * Bound to model CustomUserItem
         */
        userItem: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: UserItemResource;
    }>;
}
//# sourceMappingURL=ModulesItemsService.d.ts.map