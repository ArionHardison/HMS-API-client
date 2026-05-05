/**
 * `Modules/Order` API client.
 *
 * Covers the 22 endpoints documented in `sdk/spec/endpoints.json` with
 * `module === "Modules/Order"`:
 *
 *   - 5 user-facing CRUD endpoints (`order.{index,store,show,update,destroy}`)
 *   - 1 detached item delete (`DELETE /api/order-item/{item}`)
 *   - 7 checkout / payment lifecycle endpoints (`checkout`, `confirm-order`,
 *     `confirm-payment`, `cancel-order`, `pay`, `get-checkout-items`,
 *     `get-order-items`)
 *   - 2 protocol-runner endpoints (`run-global/{order}/{task}`,
 *     `run/{order}/{chain}`)
 *   - 2 item helpers (`get-item`, `validate-item`)
 *   - 4 admin-dashboard endpoints (`/api/orders/*`) gated upstream by
 *     `role:SuperAdmin` middleware. The SDK does NOT distinguish admin vs
 *     regular bearer — it just sends `Authorization: Bearer <token>`. Callers
 *     must pass an admin token; the API enforces the role.
 *   - 1 protocol integration listing (`/api/protocol/order/all`)
 *
 * Naming policy: methods follow `spec.id` minus the redundant `order.`
 * prefix, renamed to camelCase. Admin endpoints are prefixed `admin*` to
 * keep the user-facing surface (`list`, `show`, `update`, `destroy`)
 * uncluttered. Two methods sharing a final segment (`order.show` vs
 * `get.api.orders.show.item`) are disambiguated this way (`show` vs
 * `adminShow`).
 *
 * Class is named `OrderModuleApiClient` to avoid colliding with the legacy
 * `OrderApiClient` in `hms-api-client.ts`. The legacy client coexists; do
 * not refactor it.
 *
 * Integration with `src/index.ts`: this file's TDD slice does NOT modify
 * the barrel — see the integration block at the bottom for the lines a
 * future barrel-update step should add.
 */
import { BaseApiClient } from '../api-client';
import type { ApiRequestOptions, ApiResponse } from '../api-client';
import type {
  AttachedOrderInstanceResource,
  AttachedOrderItemId,
  AttachedOrderItemsResource,
  AttachedOrderListResource,
  AttachedOrderResource,
  AttachedOrderStatus,
  CancelOrderInput,
  CanceledOrderResource,
  ChainId,
  ConfirmedOrderResource,
  ConfirmOrderInput,
  ConfirmPaymentInput,
  CreateOrderInput,
  GetShopItemInput,
  OrderDeliveryStartedInput,
  OrderFetchShopItemResource,
  OrderId,
  OrderPaymentResource,
  OrderProtocolIntegrationResource,
  OrderResource,
  OrderWithItemsAndCollectionsResource,
  PutPriceOrderInput,
  RunningOrderResource,
  StartCheckoutInput,
  TaskId,
  UpdateOrderInput,
  ValidateOrderItemInput,
} from '../types/modules-order';

/**
 * Public client over the `/api/order/*`, `/api/order-item/*`,
 * `/api/orders/*`, and `/api/protocol/order/*` surfaces. Subclasses
 * `BaseApiClient` so it picks up auth / `X-Domain` / Laravel `_method`
 * override / `ApiError` normalization for free.
 */
export class OrderModuleApiClient extends BaseApiClient {
  // ---------------------------------------------------------------------------
  // Order CRUD
  // ---------------------------------------------------------------------------

  /** GET `/api/order` — list (paginated) the user's orders. (`order.index`) */
  list(opts?: ApiRequestOptions): Promise<ApiResponse<OrderResource[]>> {
    return this.get<OrderResource[]>('/api/order', undefined, opts);
  }

  /** POST `/api/order` — create a new order. (`order.store`) */
  create(body: CreateOrderInput, opts?: ApiRequestOptions): Promise<ApiResponse<OrderResource>> {
    return this.post<OrderResource>('/api/order', body, opts);
  }

  /** GET `/api/order/{order}` — show one order with items & collections. (`order.show`) */
  show(
    order: OrderId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<OrderWithItemsAndCollectionsResource>> {
    return this.get<OrderWithItemsAndCollectionsResource>(
      `/api/order/${encodeURIComponent(String(order))}`,
      undefined,
      opts,
    );
  }

  /** PUT `/api/order/{order}` — update title + items. Sent as POST + `?_method=PUT`. (`order.update`) */
  update(
    order: OrderId,
    body: UpdateOrderInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<OrderResource>> {
    return this.put<OrderResource>(`/api/order/${encodeURIComponent(String(order))}`, body, opts);
  }

  /** DELETE `/api/order/{order}` — destroy. (`order.destroy`) */
  destroy(order: OrderId, opts?: ApiRequestOptions): Promise<ApiResponse<OrderResource>> {
    return this.delete<OrderResource>(`/api/order/${encodeURIComponent(String(order))}`, opts);
  }

  /** DELETE `/api/order-item/{item}` — remove a single item from an order. */
  deleteItem(
    item: AttachedOrderItemId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<null>> {
    return this.delete<null>(`/api/order-item/${encodeURIComponent(String(item))}`, opts);
  }

  // ---------------------------------------------------------------------------
  // Checkout / payment lifecycle
  // ---------------------------------------------------------------------------

  /** POST `/api/order/cancel-order` — cancel a placed order. */
  cancel(
    body: CancelOrderInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<CanceledOrderResource>> {
    return this.post<CanceledOrderResource>('/api/order/cancel-order', body, opts);
  }

  /** POST `/api/order/checkout` — start checkout for an attached order. */
  checkout(
    body: StartCheckoutInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<AttachedOrderItemsResource>> {
    return this.post<AttachedOrderItemsResource>('/api/order/checkout', body, opts);
  }

  /** POST `/api/order/confirm-order` — submit shipping address + confirm. */
  confirmOrder(
    body: ConfirmOrderInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ConfirmedOrderResource>> {
    return this.post<ConfirmedOrderResource>('/api/order/confirm-order', body, opts);
  }

  /** POST `/api/order/confirm-payment` — confirm a placed payment. */
  confirmPayment(
    body: ConfirmPaymentInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<AttachedOrderResource>> {
    return this.post<AttachedOrderResource>('/api/order/confirm-payment', body, opts);
  }

  /** GET `/api/order/get-checkout-items/{order}` — items currently in checkout. */
  getCheckoutItems(
    order: OrderId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<AttachedOrderItemsResource>> {
    return this.get<AttachedOrderItemsResource>(
      `/api/order/get-checkout-items/${encodeURIComponent(String(order))}`,
      undefined,
      opts,
    );
  }

  /** POST `/api/order/get-item` — scrape an Amazon/eBay product page. */
  getItem(
    body: GetShopItemInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<OrderFetchShopItemResource>> {
    return this.post<OrderFetchShopItemResource>('/api/order/get-item', body, opts);
  }

  /** GET `/api/order/get-order-items/{order}` — items currently attached to an order. */
  getOrderItems(
    order: OrderId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<AttachedOrderItemsResource>> {
    return this.get<AttachedOrderItemsResource>(
      `/api/order/get-order-items/${encodeURIComponent(String(order))}`,
      undefined,
      opts,
    );
  }

  /** GET `/api/order/pay/{order}` — fetch the payment page / amount for an attached order. */
  pay(
    order: OrderId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<OrderPaymentResource>> {
    return this.get<OrderPaymentResource>(
      `/api/order/pay/${encodeURIComponent(String(order))}`,
      undefined,
      opts,
    );
  }

  /** POST `/api/order/validate-item` — validate a scraped item before adding it. */
  validateItem(
    body: ValidateOrderItemInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<OrderResource>> {
    return this.post<OrderResource>('/api/order/validate-item', body, opts);
  }

  // ---------------------------------------------------------------------------
  // Protocol runners
  // ---------------------------------------------------------------------------

  /** GET `/api/order/run-global/{order}/{task}` — execute a global task on an order. */
  runGlobal(
    order: OrderId,
    task: TaskId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<RunningOrderResource>> {
    return this.get<RunningOrderResource>(
      `/api/order/run-global/${encodeURIComponent(String(order))}/${encodeURIComponent(String(task))}`,
      undefined,
      opts,
    );
  }

  /** GET `/api/order/run/{order}/{chain}` — execute a chain step on an order. */
  run(
    order: OrderId,
    chain: ChainId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<RunningOrderResource>> {
    return this.get<RunningOrderResource>(
      `/api/order/run/${encodeURIComponent(String(order))}/${encodeURIComponent(String(chain))}`,
      undefined,
      opts,
    );
  }

  // ---------------------------------------------------------------------------
  // Admin dashboard (upstream `role:SuperAdmin` — caller supplies admin Bearer)
  // ---------------------------------------------------------------------------

  /** POST `/api/orders/confirm` — admin sets the final price + confirms an order. */
  adminConfirm(
    body: PutPriceOrderInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<AttachedOrderInstanceResource>> {
    return this.post<AttachedOrderInstanceResource>('/api/orders/confirm', body, opts);
  }

  /** POST `/api/orders/delivery-started` — admin marks the order as out-for-delivery. */
  adminDeliveryStarted(
    body: OrderDeliveryStartedInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<AttachedOrderInstanceResource>> {
    return this.post<AttachedOrderInstanceResource>('/api/orders/delivery-started', body, opts);
  }

  /** GET `/api/orders/show/{order}` — admin order detail. */
  adminShow(
    order: OrderId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<AttachedOrderInstanceResource>> {
    return this.get<AttachedOrderInstanceResource>(
      `/api/orders/show/${encodeURIComponent(String(order))}`,
      undefined,
      opts,
    );
  }

  /** GET `/api/orders/{status}` — admin paginated list filtered by attached-order status. */
  adminListByStatus(
    status: AttachedOrderStatus,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<AttachedOrderListResource[]>> {
    return this.get<AttachedOrderListResource[]>(
      `/api/orders/${encodeURIComponent(String(status))}`,
      undefined,
      opts,
    );
  }

  // ---------------------------------------------------------------------------
  // Protocol integration
  // ---------------------------------------------------------------------------

  /** GET `/api/protocol/order/all`. (`get.api.protocol.order.all`) */
  listProtocolOrders(
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<OrderProtocolIntegrationResource[]>> {
    return this.get<OrderProtocolIntegrationResource[]>('/api/protocol/order/all', undefined, opts);
  }
}
