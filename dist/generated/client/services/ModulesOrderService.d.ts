import type { AttachedOrderInstanceResource } from '../models/AttachedOrderInstanceResource';
import type { AttachedOrderItemsResource } from '../models/AttachedOrderItemsResource';
import type { AttachedOrderListResource } from '../models/AttachedOrderListResource';
import type { AttachedOrderResource } from '../models/AttachedOrderResource';
import type { CanceledOrderResource } from '../models/CanceledOrderResource';
import type { CancelOrderRequest } from '../models/CancelOrderRequest';
import type { ConfirmedOrderResource } from '../models/ConfirmedOrderResource';
import type { ConfirmOrderRequest } from '../models/ConfirmOrderRequest';
import type { ConfirmPaymentRequest } from '../models/ConfirmPaymentRequest';
import type { CreateOrderRequest } from '../models/CreateOrderRequest';
import type { GetShopItemRequest } from '../models/GetShopItemRequest';
import type { OrderDeliveryStartedRequest } from '../models/OrderDeliveryStartedRequest';
import type { OrderFetchShopItemResource } from '../models/OrderFetchShopItemResource';
import type { OrderPaymentResource } from '../models/OrderPaymentResource';
import type { OrderProtocolIntegrationResource } from '../models/OrderProtocolIntegrationResource';
import type { OrderResource } from '../models/OrderResource';
import type { OrderWithItemsAndCollectionsResource } from '../models/OrderWithItemsAndCollectionsResource';
import type { PutPriceOrderRequest } from '../models/PutPriceOrderRequest';
import type { RunningOrderResource } from '../models/RunningOrderResource';
import type { StartCheckoutRequest } from '../models/StartCheckoutRequest';
import type { UpdateOrderRequest } from '../models/UpdateOrderRequest';
import type { ValidateOrderItemRequest } from '../models/ValidateOrderItemRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class ModulesOrderService {
    /**
     * Modules\Order\Http\Controllers\OrderController@index
     * @returns any Success
     * @throws ApiError
     */
    static orderIndex({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: Array<OrderResource>;
        links?: Record<string, any>;
        meta?: Record<string, any>;
    }>;
    /**
     * Modules\Order\Http\Controllers\OrderController@store
     * @returns any Success
     * @throws ApiError
     */
    static orderStore({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: CreateOrderRequest;
    }): CancelablePromise<{
        data: OrderResource;
    }>;
    /**
     * Modules\Order\Http\Controllers\OrderController@deleteItemFromOrder
     * method deleteItemFromOrder not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiOrderItemItem({ item, xDomain, }: {
        item: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<Record<string, any>>;
    /**
     * Modules\Order\Http\Controllers\OrderController@cancelOrder
     * @returns any Success
     * @throws ApiError
     */
    static postApiOrderCancelOrder({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: CancelOrderRequest;
    }): CancelablePromise<{
        data: CanceledOrderResource;
    }>;
    /**
     * Modules\Order\Http\Controllers\OrderController@startCheckoutProcess
     * @returns any Success
     * @throws ApiError
     */
    static postApiOrderCheckout({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: StartCheckoutRequest;
    }): CancelablePromise<{
        data: AttachedOrderItemsResource;
    }>;
    /**
     * Modules\Order\Http\Controllers\OrderController@confirmOrder
     * @returns any Success
     * @throws ApiError
     */
    static postApiOrderConfirmOrder({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: ConfirmOrderRequest;
    }): CancelablePromise<{
        data: ConfirmedOrderResource;
    }>;
    /**
     * Modules\Order\Http\Controllers\OrderController@confirmPayment
     * @returns any Success
     * @throws ApiError
     */
    static postApiOrderConfirmPayment({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: ConfirmPaymentRequest;
    }): CancelablePromise<{
        data: AttachedOrderResource;
    }>;
    /**
     * Modules\Order\Http\Controllers\OrderController@getCheckoutItems
     * @returns any Success
     * @throws ApiError
     */
    static getApiOrderGetCheckoutItemsItem({ order, xDomain, }: {
        order: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: AttachedOrderItemsResource;
    }>;
    /**
     * Modules\Order\Http\Controllers\OrderController@getShopItem
     * @returns any Success
     * @throws ApiError
     */
    static postApiOrderGetItem({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: GetShopItemRequest;
    }): CancelablePromise<{
        data: OrderFetchShopItemResource;
    }>;
    /**
     * Modules\Order\Http\Controllers\OrderController@getOrderItems
     * @returns any Success
     * @throws ApiError
     */
    static getApiOrderGetOrderItemsItem({ order, xDomain, }: {
        order: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: AttachedOrderItemsResource;
    }>;
    /**
     * Modules\Order\Http\Controllers\OrderController@buyItems
     * @returns any Success
     * @throws ApiError
     */
    static getApiOrderPayItem({ order, xDomain, }: {
        /**
         * Bound to model AttachedOrder
         */
        order: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: OrderPaymentResource;
    }>;
    /**
     * Modules\Order\Http\Controllers\OrderController@runRecurring
     * @returns any Success
     * @throws ApiError
     */
    static getApiOrderRunGlobalItemItem({ order, task, xDomain, }: {
        /**
         * Bound to model Order
         */
        order: string;
        task: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: RunningOrderResource;
    }>;
    /**
     * Modules\Order\Http\Controllers\OrderController@runOrder
     * @returns any Success
     * @throws ApiError
     */
    static getApiOrderRunItemItem({ order, chain, xDomain, }: {
        order: string;
        chain: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: RunningOrderResource;
    }>;
    /**
     * Modules\Order\Http\Controllers\OrderController@validateOrderItem
     * @returns any Success
     * @throws ApiError
     */
    static postApiOrderValidateItem({ xDomain, formData, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        formData: ValidateOrderItemRequest;
    }): CancelablePromise<{
        data: OrderResource;
    }>;
    /**
     * Modules\Order\Http\Controllers\OrderController@show
     * @returns any Success
     * @throws ApiError
     */
    static orderShow({ order, xDomain, }: {
        /**
         * Bound to model Order
         */
        order: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: OrderWithItemsAndCollectionsResource;
    }>;
    /**
     * Modules\Order\Http\Controllers\OrderController@update
     * @returns any Success
     * @throws ApiError
     */
    static orderUpdate({ order, xDomain, formData, }: {
        /**
         * Bound to model Order
         */
        order: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        formData: UpdateOrderRequest;
    }): CancelablePromise<{
        data: OrderResource;
    }>;
    /**
     * Modules\Order\Http\Controllers\OrderController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static orderDestroy({ order, xDomain, }: {
        /**
         * Bound to model Order
         */
        order: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: OrderResource;
    }>;
    /**
     * Modules\Order\Http\Controllers\DashboardOrdersController@publishPrice
     * @returns any Success
     * @throws ApiError
     */
    static postApiOrdersConfirm({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: PutPriceOrderRequest;
    }): CancelablePromise<{
        data: AttachedOrderInstanceResource;
    }>;
    /**
     * Modules\Order\Http\Controllers\DashboardOrdersController@deliveryStarted
     * @returns any Success
     * @throws ApiError
     */
    static postApiOrdersDeliveryStarted({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: OrderDeliveryStartedRequest;
    }): CancelablePromise<{
        data: AttachedOrderInstanceResource;
    }>;
    /**
     * Modules\Order\Http\Controllers\DashboardOrdersController@show
     * @returns any Success
     * @throws ApiError
     */
    static getApiOrdersShowItem({ order, xDomain, }: {
        /**
         * Bound to model AttachedOrder
         */
        order: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: AttachedOrderInstanceResource;
    }>;
    /**
     * Modules\Order\Http\Controllers\DashboardOrdersController@index
     * @returns any Success
     * @throws ApiError
     */
    static getApiOrdersItem({ status, xDomain, }: {
        status: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: Array<AttachedOrderListResource>;
        links?: Record<string, any>;
        meta?: Record<string, any>;
    }>;
    /**
     * Modules\Order\Http\Controllers\ProtocolIntegrationController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolOrderAll({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: OrderProtocolIntegrationResource;
    }>;
}
//# sourceMappingURL=ModulesOrderService.d.ts.map