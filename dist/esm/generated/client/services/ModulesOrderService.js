import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ModulesOrderService {
    /**
     * Modules\Order\Http\Controllers\OrderController@index
     * @returns any Success
     * @throws ApiError
     */
    static orderIndex({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/order',
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
     * Modules\Order\Http\Controllers\OrderController@store
     * @returns any Success
     * @throws ApiError
     */
    static orderStore({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/order',
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
     * Modules\Order\Http\Controllers\OrderController@deleteItemFromOrder
     * method deleteItemFromOrder not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiOrderItemItem({ item, xDomain, }) {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/order-item/{item}',
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
     * Modules\Order\Http\Controllers\OrderController@cancelOrder
     * @returns any Success
     * @throws ApiError
     */
    static postApiOrderCancelOrder({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/order/cancel-order',
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
     * Modules\Order\Http\Controllers\OrderController@startCheckoutProcess
     * @returns any Success
     * @throws ApiError
     */
    static postApiOrderCheckout({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/order/checkout',
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
     * Modules\Order\Http\Controllers\OrderController@confirmOrder
     * @returns any Success
     * @throws ApiError
     */
    static postApiOrderConfirmOrder({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/order/confirm-order',
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
     * Modules\Order\Http\Controllers\OrderController@confirmPayment
     * @returns any Success
     * @throws ApiError
     */
    static postApiOrderConfirmPayment({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/order/confirm-payment',
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
     * Modules\Order\Http\Controllers\OrderController@getCheckoutItems
     * @returns any Success
     * @throws ApiError
     */
    static getApiOrderGetCheckoutItemsItem({ order, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/order/get-checkout-items/{order}',
            path: {
                'order': order,
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
     * Modules\Order\Http\Controllers\OrderController@getShopItem
     * @returns any Success
     * @throws ApiError
     */
    static postApiOrderGetItem({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/order/get-item',
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
     * Modules\Order\Http\Controllers\OrderController@getOrderItems
     * @returns any Success
     * @throws ApiError
     */
    static getApiOrderGetOrderItemsItem({ order, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/order/get-order-items/{order}',
            path: {
                'order': order,
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
     * Modules\Order\Http\Controllers\OrderController@buyItems
     * @returns any Success
     * @throws ApiError
     */
    static getApiOrderPayItem({ order, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/order/pay/{order}',
            path: {
                'order': order,
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
     * Modules\Order\Http\Controllers\OrderController@runRecurring
     * @returns any Success
     * @throws ApiError
     */
    static getApiOrderRunGlobalItemItem({ order, task, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/order/run-global/{order}/{task}',
            path: {
                'order': order,
                'task': task,
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
     * Modules\Order\Http\Controllers\OrderController@runOrder
     * @returns any Success
     * @throws ApiError
     */
    static getApiOrderRunItemItem({ order, chain, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/order/run/{order}/{chain}',
            path: {
                'order': order,
                'chain': chain,
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
     * Modules\Order\Http\Controllers\OrderController@validateOrderItem
     * @returns any Success
     * @throws ApiError
     */
    static postApiOrderValidateItem({ xDomain, formData, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/order/validate-item',
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
     * Modules\Order\Http\Controllers\OrderController@show
     * @returns any Success
     * @throws ApiError
     */
    static orderShow({ order, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/order/{order}',
            path: {
                'order': order,
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
     * Modules\Order\Http\Controllers\OrderController@update
     * @returns any Success
     * @throws ApiError
     */
    static orderUpdate({ order, xDomain, formData, }) {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/order/{order}',
            path: {
                'order': order,
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
     * Modules\Order\Http\Controllers\OrderController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static orderDestroy({ order, xDomain, }) {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/order/{order}',
            path: {
                'order': order,
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
     * Modules\Order\Http\Controllers\DashboardOrdersController@publishPrice
     * @returns any Success
     * @throws ApiError
     */
    static postApiOrdersConfirm({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/orders/confirm',
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
     * Modules\Order\Http\Controllers\DashboardOrdersController@deliveryStarted
     * @returns any Success
     * @throws ApiError
     */
    static postApiOrdersDeliveryStarted({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/orders/delivery-started',
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
     * Modules\Order\Http\Controllers\DashboardOrdersController@show
     * @returns any Success
     * @throws ApiError
     */
    static getApiOrdersShowItem({ order, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/orders/show/{order}',
            path: {
                'order': order,
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
     * Modules\Order\Http\Controllers\DashboardOrdersController@index
     * @returns any Success
     * @throws ApiError
     */
    static getApiOrdersItem({ status, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/orders/{status}',
            path: {
                'status': status,
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
     * Modules\Order\Http\Controllers\ProtocolIntegrationController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolOrderAll({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/protocol/order/all',
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
//# sourceMappingURL=ModulesOrderService.js.map