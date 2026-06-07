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
    list(opts) {
        return this.get('/api/order', undefined, opts);
    }
    /** POST `/api/order` — create a new order. (`order.store`) */
    create(body, opts) {
        return this.post('/api/order', body, opts);
    }
    /** GET `/api/order/{order}` — show one order with items & collections. (`order.show`) */
    show(order, opts) {
        return this.get(`/api/order/${encodeURIComponent(String(order))}`, undefined, opts);
    }
    /** PUT `/api/order/{order}` — update title + items. Sent as POST + `?_method=PUT`. (`order.update`) */
    update(order, body, opts) {
        return this.put(`/api/order/${encodeURIComponent(String(order))}`, body, opts);
    }
    /** DELETE `/api/order/{order}` — destroy. (`order.destroy`) */
    destroy(order, opts) {
        return this.delete(`/api/order/${encodeURIComponent(String(order))}`, opts);
    }
    /** DELETE `/api/order-item/{item}` — remove a single item from an order. */
    deleteItem(item, opts) {
        return this.delete(`/api/order-item/${encodeURIComponent(String(item))}`, opts);
    }
    // ---------------------------------------------------------------------------
    // Checkout / payment lifecycle
    // ---------------------------------------------------------------------------
    /** POST `/api/order/cancel-order` — cancel a placed order. */
    cancel(body, opts) {
        return this.post('/api/order/cancel-order', body, opts);
    }
    /** POST `/api/order/checkout` — start checkout for an attached order. */
    checkout(body, opts) {
        return this.post('/api/order/checkout', body, opts);
    }
    /** POST `/api/order/confirm-order` — submit shipping address + confirm. */
    confirmOrder(body, opts) {
        return this.post('/api/order/confirm-order', body, opts);
    }
    /** POST `/api/order/confirm-payment` — confirm a placed payment. */
    confirmPayment(body, opts) {
        return this.post('/api/order/confirm-payment', body, opts);
    }
    /** GET `/api/order/get-checkout-items/{order}` — items currently in checkout. */
    getCheckoutItems(order, opts) {
        return this.get(`/api/order/get-checkout-items/${encodeURIComponent(String(order))}`, undefined, opts);
    }
    /** POST `/api/order/get-item` — scrape an Amazon/eBay product page. */
    getItem(body, opts) {
        return this.post('/api/order/get-item', body, opts);
    }
    /** GET `/api/order/get-order-items/{order}` — items currently attached to an order. */
    getOrderItems(order, opts) {
        return this.get(`/api/order/get-order-items/${encodeURIComponent(String(order))}`, undefined, opts);
    }
    /** GET `/api/order/pay/{order}` — fetch the payment page / amount for an attached order. */
    pay(order, opts) {
        return this.get(`/api/order/pay/${encodeURIComponent(String(order))}`, undefined, opts);
    }
    /** POST `/api/order/validate-item` — validate a scraped item before adding it. */
    validateItem(body, opts) {
        return this.post('/api/order/validate-item', body, opts);
    }
    // ---------------------------------------------------------------------------
    // Protocol runners
    // ---------------------------------------------------------------------------
    /** GET `/api/order/run-global/{order}/{task}` — execute a global task on an order. */
    runGlobal(order, task, opts) {
        return this.get(`/api/order/run-global/${encodeURIComponent(String(order))}/${encodeURIComponent(String(task))}`, undefined, opts);
    }
    /** GET `/api/order/run/{order}/{chain}` — execute a chain step on an order. */
    run(order, chain, opts) {
        return this.get(`/api/order/run/${encodeURIComponent(String(order))}/${encodeURIComponent(String(chain))}`, undefined, opts);
    }
    // ---------------------------------------------------------------------------
    // Admin dashboard (upstream `role:SuperAdmin` — caller supplies admin Bearer)
    // ---------------------------------------------------------------------------
    /** POST `/api/orders/confirm` — admin sets the final price + confirms an order. */
    adminConfirm(body, opts) {
        return this.post('/api/orders/confirm', body, opts);
    }
    /** POST `/api/orders/delivery-started` — admin marks the order as out-for-delivery. */
    adminDeliveryStarted(body, opts) {
        return this.post('/api/orders/delivery-started', body, opts);
    }
    /** GET `/api/orders/show/{order}` — admin order detail. */
    adminShow(order, opts) {
        return this.get(`/api/orders/show/${encodeURIComponent(String(order))}`, undefined, opts);
    }
    /** GET `/api/orders/{status}` — admin paginated list filtered by attached-order status. */
    adminListByStatus(status, opts) {
        return this.get(`/api/orders/${encodeURIComponent(String(status))}`, undefined, opts);
    }
    // ---------------------------------------------------------------------------
    // Protocol integration
    // ---------------------------------------------------------------------------
    /** GET `/api/protocol/order/all`. (`get.api.protocol.order.all`) */
    listProtocolOrders(opts) {
        return this.get('/api/protocol/order/all', undefined, opts);
    }
}
//# sourceMappingURL=modules-order-api-client.js.map