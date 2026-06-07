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
/** Identifier alias matching the Laravel route binding (`{order}` accepts id or slug). */
export type OrderId = number | string;
/** Identifier alias matching the Laravel route binding (`{item}` accepts id or slug). */
export type AttachedOrderItemId = number | string;
/** Identifier alias for `{task}` and `{chain}` path params. */
export type TaskId = number | string;
/** Identifier alias for `{chain}` path param. */
export type ChainId = number | string;
/**
 * Status string used by the admin dashboard `GET /api/orders/{status}` route.
 * The controller accepts arbitrary strings (e.g. `placed`, `confirmed`,
 * `paid`, `delivery_started`, `finished`) so the type stays open.
 */
export type AttachedOrderStatus = string;
/** Canonical order record returned by `order.{index,store,update,destroy,validate-item}`. */
export interface OrderResource {
    id: number;
    title: unknown;
    amount: unknown;
    status: unknown;
    user_id: unknown;
    chain_id: unknown;
    created_at: unknown;
    updated_at: unknown;
}
/** Order with items + collections returned by `order.show`. */
export interface OrderWithItemsAndCollectionsResource {
    id: number;
    title: unknown;
    items: unknown;
}
/** "Running" order resource returned by `order.run/*` and `order.run-global/*`. */
export interface RunningOrderResource {
    id: number;
    title: unknown;
    amount: number;
    checkout_started: unknown;
    order_placed: unknown;
    order_confirmed: unknown;
    order_paid: unknown;
    order_finished: unknown;
}
/** Resource for the cancel endpoint. */
export interface CanceledOrderResource {
    id: number;
    status: unknown;
}
/** Resource for the confirm-order endpoint. */
export interface ConfirmedOrderResource {
    id: number;
    status: unknown;
    address_line1: unknown;
    address_line2: unknown;
    city: unknown;
    state: unknown;
    zip_code: unknown;
    phone: unknown;
    comment: unknown;
}
/** Resource returned for attached-order checkout / get-checkout-items / get-order-items. */
export interface AttachedOrderItemsResource {
    id: number;
    items: unknown;
}
/** Resource returned by `confirm-payment` — stamped attached order. */
export interface AttachedOrderResource {
    id: number;
    status: unknown;
    payment_status: unknown;
}
/** Resource returned by `GET /api/order/pay/{order}`. */
export interface OrderPaymentResource {
    id: number;
    amount: unknown;
    payment_url: unknown;
}
/** Resource returned by `POST /api/order/get-item` (Amazon/eBay scrape). */
export interface OrderFetchShopItemResource {
    url: unknown;
    title: unknown;
    price: unknown;
    image: unknown;
}
/** Admin dashboard list resource for `GET /api/orders/{status}`. */
export interface AttachedOrderListResource {
    id: number;
    order: unknown;
    user: unknown;
    created_at: string;
}
/** Admin dashboard detail resource for confirm / delivery-started / show. */
export interface AttachedOrderInstanceResource {
    id: number;
    status: unknown;
    price: unknown;
}
/** Protocol integration listing for `GET /api/protocol/order/all`. */
export interface OrderProtocolIntegrationResource {
    id: number;
    name: unknown;
    description: unknown;
}
/** POST `/api/order` body — see `CreateOrderRequest`. */
export interface CreateOrderInput {
    title: string;
}
/** PUT `/api/order/{order}` body — see `UpdateOrderRequest`. */
export interface UpdateOrderInput {
    title: string;
    items: UpdateOrderItemInput[];
}
/** Single item entry inside `UpdateOrderInput.items`. */
export interface UpdateOrderItemInput {
    id: number | string;
    url: string;
    title: string;
    image: string;
    quantity: number;
    price: number;
}
/** POST `/api/order/cancel-order` body — see `CancelOrderRequest`. */
export interface CancelOrderInput {
    id: number;
    chain_id: string | number;
}
/** POST `/api/order/checkout` body — see `StartCheckoutRequest`. */
export interface StartCheckoutInput {
    id: number;
    chain_id: string | number;
    order_id: number;
    items: CheckoutItemInput[];
}
/** Single item entry inside `StartCheckoutInput.items`. */
export interface CheckoutItemInput {
    own: boolean;
    item_id: number;
}
/** POST `/api/order/confirm-order` body — see `ConfirmOrderRequest`. */
export interface ConfirmOrderInput {
    id: number;
    chain_id: string | number;
    address_line1: string;
    address_line2?: string | null;
    city: string;
    state: string;
    zip_code: number;
    phone: string;
    comment: string;
}
/** POST `/api/order/confirm-payment` body — see `ConfirmPaymentRequest`. */
export interface ConfirmPaymentInput {
    id: number;
    chain_id: string | number;
}
/** POST `/api/order/get-item` body — see `GetShopItemRequest`. */
export interface GetShopItemInput {
    url: string;
}
/** POST `/api/order/validate-item` body — see `ValidateOrderItemRequest`. */
export interface ValidateOrderItemInput {
    url: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
}
/** POST `/api/orders/confirm` admin body — see `PutPriceOrderRequest`. */
export interface PutPriceOrderInput {
    id: number;
    price: number;
}
/** POST `/api/orders/delivery-started` admin body — see `OrderDeliveryStartedRequest`. */
export interface OrderDeliveryStartedInput {
    id: number;
}
//# sourceMappingURL=modules-order.d.ts.map