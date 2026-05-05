/**
 * Endpoint coverage for `ItemsModuleApiClient` (`Modules/Items`).
 *
 * Spec source: `sdk/spec/endpoints.json` — module === "Modules/Items". 20
 * endpoints split across:
 *
 *   - `/api/items/*`        catalog items (5 CRUD + find + food-categories)
 *   - `/api/user-items/*`   per-user custom items (5 CRUD)
 *   - `/api/collection*`    saved collections + their join rows (8)
 *
 * All routes use `auth:api` upstream → SDK callers attach a Bearer token.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectMethodOverride,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { ItemsModuleApiClient } from '../modules-items-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'items-tkn-xyz';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): ItemsModuleApiClient {
  return new ItemsModuleApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('ItemsModuleApiClient — Modules/Items', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  // ===========================================================================
  // Items CRUD
  // ===========================================================================

  it('listItems() — GET /api/items', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/items`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 1 }] };
      }),
    );
    const res = await makeClient().listItems();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(res.data).toEqual([{ id: 1 }]);
  });

  it('createItem() — POST /api/items with body', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/items`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 9 } };
      }),
    );
    const body = { name: 'Apple', description: 'fruit' };
    await makeClient().createItem(body);
    expect(captured.current!.method).toBe('POST');
    expect(await captured.current!.json()).toEqual(body);
  });

  it('showItem() — GET /api/items/{item}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/items/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    const res = await makeClient().showItem(42);
    expect(captured.current!.method).toBe('GET');
    expect(res.data).toEqual({ id: 42 });
  });

  it('updateItem() — PUT /api/items/{item} sent as POST + ?_method=PUT', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/items/42`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    const body = { name: 'renamed' };
    await makeClient().updateItem(42, body);
    expectMethodOverride(captured.current!, 'PUT');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('destroyItem() — DELETE /api/items/{item}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/items/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().destroyItem(42);
    expect(captured.current!.method).toBe('DELETE');
    expectAuthHeader(captured.current!, TOKEN);
  });

  // ---------------------------------------------------------------------------
  // GET /api/items/find-item/{search}/{type}
  // ---------------------------------------------------------------------------
  it('findItem() — GET /api/items/find-item/{search}/{type}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/items/find-item/banana/food`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    const res = await makeClient().findItem('banana', 'food');
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(new URL(captured.current!.url).pathname).toBe('/api/items/find-item/banana/food');
    expect(res.data).toEqual({ id: 1 });
  });

  // ---------------------------------------------------------------------------
  // GET /api/items/food-categories
  // ---------------------------------------------------------------------------
  it('foodCategories() — GET /api/items/food-categories', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/items/food-categories`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 1, name: 'Fruit' }] };
      }),
    );
    const res = await makeClient().foodCategories();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual([{ id: 1, name: 'Fruit' }]);
  });

  // ===========================================================================
  // User Items CRUD
  // ===========================================================================

  it('listUserItems() — GET /api/user-items', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/user-items`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 1 }] };
      }),
    );
    const res = await makeClient().listUserItems();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual([{ id: 1 }]);
  });

  it('createUserItem() — POST /api/user-items', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/user-items`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 9 } };
      }),
    );
    const body = { name: 'Apple', food_item: true, food_category_id: 3 };
    await makeClient().createUserItem(body);
    expect(captured.current!.method).toBe('POST');
    expect(await captured.current!.json()).toEqual(body);
  });

  it('showUserItem() — GET /api/user-items/{user_item}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/user-items/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    const res = await makeClient().showUserItem(42);
    expect(captured.current!.method).toBe('GET');
    expect(res.data).toEqual({ id: 42 });
  });

  it('updateUserItem() — PUT /api/user-items/{user_item} as POST + ?_method=PUT', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/user-items/42`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    const body = { name: 'renamed' };
    await makeClient().updateUserItem(42, body);
    expectMethodOverride(captured.current!, 'PUT');
    expect(await captured.current!.json()).toEqual(body);
  });

  it('destroyUserItem() — DELETE /api/user-items/{user_item}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/user-items/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().destroyUserItem(42);
    expect(captured.current!.method).toBe('DELETE');
    expectAuthHeader(captured.current!, TOKEN);
  });

  // ===========================================================================
  // Collections
  // ===========================================================================

  it('listCollections() — GET /api/collection', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/collection`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 1 }] };
      }),
    );
    const res = await makeClient().listCollections();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual([{ id: 1 }]);
  });

  it('createCollection() — POST /api/collection with body', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/collection`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 9 } };
      }),
    );
    const body = {
      name: 'Pantry',
      note: 'staples for the week',
      items: [{ id: 1, user_item: false, amount: 2 }],
    };
    await makeClient().createCollection(body);
    expect(captured.current!.method).toBe('POST');
    expect(await captured.current!.json()).toEqual(body);
  });

  it('showCollection() — GET /api/collection/{collection}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/collection/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42, items: [] } };
      }),
    );
    const res = await makeClient().showCollection(42);
    expect(captured.current!.method).toBe('GET');
    expect(res.data).toMatchObject({ id: 42 });
  });

  it('updateCollection() — PUT /api/collection/{collection} as POST + ?_method=PUT', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/collection/42`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    const body = {
      name: 'Pantry-2',
      note: 'updated notes here',
      items: [{ id: 1, user_item: false, amount: 5 }],
    };
    await makeClient().updateCollection(42, body);
    expectMethodOverride(captured.current!, 'PUT');
    expect(await captured.current!.json()).toEqual(body);
  });

  it('destroyCollection() — DELETE /api/collection/{collection}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/collection/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().destroyCollection(42);
    expect(captured.current!.method).toBe('DELETE');
    expectAuthHeader(captured.current!, TOKEN);
  });

  // ---------------------------------------------------------------------------
  // GET /api/collection-list
  // ---------------------------------------------------------------------------
  it('collectionList() — GET /api/collection-list', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/collection-list`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 1, name: 'Pantry' }] };
      }),
    );
    const res = await makeClient().collectionList();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual([{ id: 1, name: 'Pantry' }]);
  });

  // ---------------------------------------------------------------------------
  // POST /api/collection-item
  // ---------------------------------------------------------------------------
  it('addItemToCollection() — POST /api/collection-item', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/collection-item`, async ({ request }) => {
        captured.current = request.clone();
        return {
          success: true,
          message: '',
          data: { id: 1, name: '', collection_item_id: 2, item_photo: '', user_item: false, amount: 1 },
        };
      }),
    );
    const body = { id: 1, user_item: true, amount: 1, collection_id: 5 };
    const res = await makeClient().addItemToCollection(body);
    expect(captured.current!.method).toBe('POST');
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data).toMatchObject({ collection_item_id: 2 });
  });

  // ---------------------------------------------------------------------------
  // DELETE /api/collection-item/{item}
  // ---------------------------------------------------------------------------
  it('removeItemFromCollection() — DELETE /api/collection-item/{item}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/collection-item/77`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().removeItemFromCollection(77);
    expect(captured.current!.method).toBe('DELETE');
    expectAuthHeader(captured.current!, TOKEN);
  });

  // ---------------------------------------------------------------------------
  // Cross-cutting: string IDs round-trip in the path.
  // ---------------------------------------------------------------------------
  it('showCollection() — accepts string IDs (route binding is string|number)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/collection/pantry-slug`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 1, items: [] } };
      }),
    );
    await makeClient().showCollection('pantry-slug');
    expect(new URL(captured.current!.url).pathname).toBe('/api/collection/pantry-slug');
  });
});
