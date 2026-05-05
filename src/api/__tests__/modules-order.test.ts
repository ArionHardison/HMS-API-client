/**
 * Endpoint coverage for `OrderModuleApiClient` (`Modules/Order`).
 *
 * Each test follows the `modules-agents` recipe:
 *   1. Register an MSW handler that captures the inbound `Request`.
 *   2. Drive the SDK method.
 *   3. Assert URL, raw HTTP method (post/put/patch are POST + `?_method=`),
 *      Authorization (Bearer for `auth:api`), `X-Domain`, body, and response
 *      decoding.
 *
 * Spec source: `sdk/spec/endpoints.json` — module === "Modules/Order". 22
 * endpoints total. Routes prefixed `/api/orders/...` are admin-only
 * (`role:SuperAdmin` middleware in spec). The SDK does NOT distinguish
 * admin vs regular bearer — it just sends `Authorization: Bearer <token>`
 * — so admin tests assert standard Bearer.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectMethodOverride,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { OrderModuleApiClient } from '../modules-order-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'order-tkn-xyz';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): OrderModuleApiClient {
  return new OrderModuleApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('OrderModuleApiClient — Modules/Order', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  // ---------------------------------------------------------------------------
  // GET /api/order — order.index
  // ---------------------------------------------------------------------------
  it('list() — GET /api/order (sanctum, X-Domain)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/order`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 1 }] };
      }),
    );
    const res = await makeClient().list();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(res.data).toEqual([{ id: 1 }]);
  });

  // ---------------------------------------------------------------------------
  // POST /api/order — order.store
  // ---------------------------------------------------------------------------
  it('create() — POST /api/order with body', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/order`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 7, title: 'My Order' } };
      }),
    );
    const body = { title: 'My Order' };
    const res = await makeClient().create(body);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data).toMatchObject({ id: 7 });
  });

  // ---------------------------------------------------------------------------
  // GET /api/order/{order} — order.show
  // ---------------------------------------------------------------------------
  it('show() — GET /api/order/{order}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/order/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    const res = await makeClient().show(42);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual({ id: 42 });
  });

  // ---------------------------------------------------------------------------
  // PUT /api/order/{order} — order.update (Laravel POST + _method=PUT)
  // ---------------------------------------------------------------------------
  it('update() — PUT /api/order/{order} sent as POST + ?_method=PUT', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/order/42`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    const body = {
      title: 'updated',
      items: [
        {
          id: 1,
          url: 'https://amazon.com/x',
          title: 'thing',
          image: 'https://x.test/y.png',
          quantity: 1,
          price: 9.99,
        },
      ],
    };
    await makeClient().update(42, body);
    expectMethodOverride(captured.current!, 'PUT');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
  });

  // ---------------------------------------------------------------------------
  // DELETE /api/order/{order} — order.destroy
  // ---------------------------------------------------------------------------
  it('destroy() — DELETE /api/order/{order}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/order/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().destroy(42);
    expect(captured.current!.method).toBe('DELETE');
    expectAuthHeader(captured.current!, TOKEN);
  });

  // ---------------------------------------------------------------------------
  // DELETE /api/order-item/{item}
  // ---------------------------------------------------------------------------
  it('deleteItem() — DELETE /api/order-item/{item}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/order-item/77`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().deleteItem(77);
    expect(captured.current!.method).toBe('DELETE');
    expectAuthHeader(captured.current!, TOKEN);
  });

  // ---------------------------------------------------------------------------
  // POST /api/order/cancel-order
  // ---------------------------------------------------------------------------
  it('cancel() — POST /api/order/cancel-order', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/order/cancel-order`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 5, status: 'cancelled' } };
      }),
    );
    const body = { id: 5, chain_id: 'chain-9' };
    const res = await makeClient().cancel(body);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data).toMatchObject({ status: 'cancelled' });
  });

  // ---------------------------------------------------------------------------
  // POST /api/order/checkout
  // ---------------------------------------------------------------------------
  it('checkout() — POST /api/order/checkout', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/order/checkout`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 5, items: [] } };
      }),
    );
    const body = {
      id: 5,
      chain_id: 'chain-9',
      order_id: 12,
      items: [{ own: true, item_id: 1 }],
    };
    await makeClient().checkout(body);
    expect(captured.current!.method).toBe('POST');
    expect(await captured.current!.json()).toEqual(body);
  });

  // ---------------------------------------------------------------------------
  // POST /api/order/confirm-order
  // ---------------------------------------------------------------------------
  it('confirmOrder() — POST /api/order/confirm-order', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/order/confirm-order`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 5, status: 'confirmed' } };
      }),
    );
    const body = {
      id: 5,
      chain_id: 'chain-9',
      address_line1: '1 Main St',
      city: 'Austin',
      state: 'TX',
      zip_code: 78701,
      phone: '555-555-55-55',
      comment: 'leave at door',
    };
    await makeClient().confirmOrder(body);
    expect(await captured.current!.json()).toEqual(body);
    expectAuthHeader(captured.current!, TOKEN);
  });

  // ---------------------------------------------------------------------------
  // POST /api/order/confirm-payment
  // ---------------------------------------------------------------------------
  it('confirmPayment() — POST /api/order/confirm-payment', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/order/confirm-payment`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 5, status: 'paid' } };
      }),
    );
    const body = { id: 5, chain_id: 'chain-9' };
    const res = await makeClient().confirmPayment(body);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data).toMatchObject({ status: 'paid' });
  });

  // ---------------------------------------------------------------------------
  // GET /api/order/get-checkout-items/{order}
  // ---------------------------------------------------------------------------
  it('getCheckoutItems() — GET /api/order/get-checkout-items/{order}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/order/get-checkout-items/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42, items: [] } };
      }),
    );
    const res = await makeClient().getCheckoutItems(42);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toMatchObject({ id: 42 });
  });

  // ---------------------------------------------------------------------------
  // POST /api/order/get-item
  // ---------------------------------------------------------------------------
  it('getItem() — POST /api/order/get-item', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/order/get-item`, async ({ request }) => {
        captured.current = request.clone();
        return {
          success: true,
          message: '',
          data: { url: 'https://amazon.com/x', title: 't', price: 1, image: 'i' },
        };
      }),
    );
    const body = { url: 'https://amazon.com/x' };
    const res = await makeClient().getItem(body);
    expect(captured.current!.method).toBe('POST');
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data).toMatchObject({ url: 'https://amazon.com/x' });
  });

  // ---------------------------------------------------------------------------
  // GET /api/order/get-order-items/{order}
  // ---------------------------------------------------------------------------
  it('getOrderItems() — GET /api/order/get-order-items/{order}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/order/get-order-items/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42, items: [] } };
      }),
    );
    const res = await makeClient().getOrderItems(42);
    expect(captured.current!.method).toBe('GET');
    expect(res.data).toMatchObject({ id: 42 });
  });

  // ---------------------------------------------------------------------------
  // GET /api/order/pay/{order}
  // ---------------------------------------------------------------------------
  it('pay() — GET /api/order/pay/{order}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/order/pay/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42, payment_url: 'https://pay.test/x' } };
      }),
    );
    const res = await makeClient().pay(42);
    expect(captured.current!.method).toBe('GET');
    expect(res.data).toMatchObject({ id: 42 });
  });

  // ---------------------------------------------------------------------------
  // GET /api/order/run-global/{order}/{task}
  // ---------------------------------------------------------------------------
  it('runGlobal() — GET /api/order/run-global/{order}/{task}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/order/run-global/42/9`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42, amount: 100 } };
      }),
    );
    const res = await makeClient().runGlobal(42, 9);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toMatchObject({ id: 42 });
  });

  // ---------------------------------------------------------------------------
  // GET /api/order/run/{order}/{chain}
  // ---------------------------------------------------------------------------
  it('run() — GET /api/order/run/{order}/{chain}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/order/run/42/chain-9`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42, amount: 50 } };
      }),
    );
    const res = await makeClient().run(42, 'chain-9');
    expect(captured.current!.method).toBe('GET');
    expect(new URL(captured.current!.url).pathname).toBe('/api/order/run/42/chain-9');
    expect(res.data).toMatchObject({ id: 42 });
  });

  // ---------------------------------------------------------------------------
  // POST /api/order/validate-item
  // ---------------------------------------------------------------------------
  it('validateItem() — POST /api/order/validate-item', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/order/validate-item`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    const body = {
      url: 'https://amazon.com/x',
      title: 'thing',
      price: 9.99,
      image: 'https://x.test/y.png',
      quantity: 2,
    };
    await makeClient().validateItem(body);
    expect(captured.current!.method).toBe('POST');
    expect(await captured.current!.json()).toEqual(body);
  });

  // ---------------------------------------------------------------------------
  // POST /api/orders/confirm — admin (SuperAdmin role middleware upstream)
  // ---------------------------------------------------------------------------
  it('adminConfirm() — POST /api/orders/confirm sends standard Bearer (admin route)', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/orders/confirm`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 5, price: 100 } };
      }),
    );
    const body = { id: 5, price: 100 };
    await makeClient().adminConfirm(body);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
  });

  // ---------------------------------------------------------------------------
  // POST /api/orders/delivery-started — admin
  // ---------------------------------------------------------------------------
  it('adminDeliveryStarted() — POST /api/orders/delivery-started sends standard Bearer', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/orders/delivery-started`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 5, status: 'delivery_started' } };
      }),
    );
    const body = { id: 5 };
    await makeClient().adminDeliveryStarted(body);
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
  });

  // ---------------------------------------------------------------------------
  // GET /api/orders/show/{order} — admin
  // ---------------------------------------------------------------------------
  it('adminShow() — GET /api/orders/show/{order}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/orders/show/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    const res = await makeClient().adminShow(42);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual({ id: 42 });
  });

  // ---------------------------------------------------------------------------
  // GET /api/orders/{status} — admin
  // ---------------------------------------------------------------------------
  it('adminListByStatus() — GET /api/orders/{status}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/orders/placed`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 1 }] };
      }),
    );
    const res = await makeClient().adminListByStatus('placed');
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual([{ id: 1 }]);
  });

  // ---------------------------------------------------------------------------
  // GET /api/protocol/order/all
  // ---------------------------------------------------------------------------
  it('listProtocolOrders() — GET /api/protocol/order/all', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/protocol/order/all`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 1, name: 'p' }] };
      }),
    );
    const res = await makeClient().listProtocolOrders();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual([{ id: 1, name: 'p' }]);
  });

  // ---------------------------------------------------------------------------
  // Cross-cutting: string IDs round-trip in the path.
  // ---------------------------------------------------------------------------
  it('show() — accepts string IDs (route binding is string|number)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/order/order-slug`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    await makeClient().show('order-slug');
    expect(new URL(captured.current!.url).pathname).toBe('/api/order/order-slug');
  });
});
