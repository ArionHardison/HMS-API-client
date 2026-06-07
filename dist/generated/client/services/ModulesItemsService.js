"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModulesItemsService = void 0;
const OpenAPI_1 = require("../core/OpenAPI");
const request_1 = require("../core/request");
class ModulesItemsService {
    /**
     * Modules\Items\Http\Controllers\ItemsCollectionController@index
     * @returns any Success
     * @throws ApiError
     */
    static collectionIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/collection',
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Items\Http\Controllers\ItemsCollectionController@store
     * @returns any Success
     * @throws ApiError
     */
    static collectionStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/collection',
            headers: {
                'X-Domain': xDomain,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Items\Http\Controllers\ItemsCollectionController@addItemToCollection
     * @returns any Success
     * @throws ApiError
     */
    static postApiCollectionItem({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/collection-item',
            headers: {
                'X-Domain': xDomain,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Items\Http\Controllers\ItemsCollectionController@deleteItemFromCollection
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiCollectionItemItem({ item, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/collection-item/{item}',
            path: {
                'item': item,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Items\Http\Controllers\ItemsCollectionController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiCollectionList({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/collection-list',
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Items\Http\Controllers\ItemsCollectionController@show
     * @returns any Success
     * @throws ApiError
     */
    static collectionShow({ collection, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/collection/{collection}',
            path: {
                'collection': collection,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Items\Http\Controllers\ItemsCollectionController@update
     * @returns any Success
     * @throws ApiError
     */
    static collectionUpdate({ collection, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/collection/{collection}',
            path: {
                'collection': collection,
            },
            headers: {
                'X-Domain': xDomain,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Items\Http\Controllers\ItemsCollectionController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static collectionDestroy({ collection, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/collection/{collection}',
            path: {
                'collection': collection,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Items\Http\Controllers\ItemsController@index
     * @returns any Success
     * @throws ApiError
     */
    static itemsIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/items',
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Items\Http\Controllers\ItemsController@store
     * @returns any Success
     * @throws ApiError
     */
    static itemsStore({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/items',
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Items\Http\Controllers\UserItemsController@search
     * @returns any Success
     * @throws ApiError
     */
    static getApiItemsFindItemItemItem({ search, type, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/items/find-item/{search}/{type}',
            path: {
                'search': search,
                'type': type,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Items\Http\Controllers\ItemsController@foodCategories
     * @returns any Success
     * @throws ApiError
     */
    static getApiItemsFoodCategories({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/items/food-categories',
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Items\Http\Controllers\ItemsController@show
     * @returns any Success
     * @throws ApiError
     */
    static itemsShow({ item, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/items/{item}',
            path: {
                'item': item,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Items\Http\Controllers\ItemsController@update
     * @returns any Success
     * @throws ApiError
     */
    static itemsUpdate({ item, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/items/{item}',
            path: {
                'item': item,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Items\Http\Controllers\ItemsController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static itemsDestroy({ item, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/items/{item}',
            path: {
                'item': item,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Items\Http\Controllers\UserItemsController@index
     * @returns any Success
     * @throws ApiError
     */
    static userItemsIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/user-items',
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Items\Http\Controllers\UserItemsController@store
     * @returns any Success
     * @throws ApiError
     */
    static userItemsStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/user-items',
            headers: {
                'X-Domain': xDomain,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Items\Http\Controllers\UserItemsController@show
     * @returns any Success
     * @throws ApiError
     */
    static userItemsShow({ userItem, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/user-items/{user_item}',
            path: {
                'user_item': userItem,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Items\Http\Controllers\UserItemsController@update
     * @returns any Success
     * @throws ApiError
     */
    static userItemsUpdate({ userItem, xDomain, formData, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/user-items/{user_item}',
            path: {
                'user_item': userItem,
            },
            headers: {
                'X-Domain': xDomain,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Items\Http\Controllers\UserItemsController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static userItemsDestroy({ userItem, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/user-items/{user_item}',
            path: {
                'user_item': userItem,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
}
exports.ModulesItemsService = ModulesItemsService;
//# sourceMappingURL=ModulesItemsService.js.map