/**
 * Endpoint coverage for `AppealModuleApiClient` (`Modules/Appeal`).
 *
 * Each test follows the same recipe as `modules-agents.test.ts`:
 *   1. Register an MSW handler that captures the inbound `Request`.
 *   2. Drive the SDK method.
 *   3. Assert URL, raw HTTP method (PUT goes out as POST + `?_method=PUT`),
 *      Authorization (Bearer for `auth:api`), `X-Domain`, body, and
 *      response decoding.
 *
 * Spec source: `sdk/spec/endpoints.json` — module === "Modules/Appeal". 9
 * endpoints, one `it()` per endpoint.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectMethodOverride,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { AppealModuleApiClient } from '../modules-appeal-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'appeal-tkn-xyz';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): AppealModuleApiClient {
  return new AppealModuleApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('AppealModuleApiClient — Modules/Appeal', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  // ---------------------------------------------------------------------------
  // GET /api/appeal — appeal.index
  // ---------------------------------------------------------------------------
  it('list() — GET /api/appeal (sanctum, X-Domain)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/appeal`, ({ request }) => {
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
  // POST /api/appeal — appeal.store
  // ---------------------------------------------------------------------------
  it('create() — POST /api/appeal with body', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/appeal`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 7 } };
      }),
    );
    const body = { title: 'a1', description: 'x' };
    const res = await makeClient().create(body);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data).toEqual({ id: 7 });
  });

  // ---------------------------------------------------------------------------
  // POST /api/appeal/submit — post.api.appeal.submit
  // ---------------------------------------------------------------------------
  it('submit() — POST /api/appeal/submit', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/appeal/submit`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { success: true } };
      }),
    );
    const body = { ref: 'abc', payload: { foo: 'bar' } };
    const res = await makeClient().submit(body);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data).toMatchObject({ success: true });
  });

  // ---------------------------------------------------------------------------
  // GET /api/appeal/run-global/{appeal}/{task} — get.api.appeal.run-global.item.item
  // ---------------------------------------------------------------------------
  it('runGlobal() — GET /api/appeal/run-global/{appeal}/{task}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/appeal/run-global/12/55`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { data: {}, chain: {} } };
      }),
    );
    const res = await makeClient().runGlobal(12, 55);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toMatchObject({ data: {}, chain: {} });
  });

  // ---------------------------------------------------------------------------
  // GET /api/appeal/run/{appeal}/{chain} — get.api.appeal.run.item.item
  // ---------------------------------------------------------------------------
  it('run() — GET /api/appeal/run/{appeal}/{chain}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/appeal/run/12/77`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { data: {}, chain: {} } };
      }),
    );
    const res = await makeClient().run(12, 77);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toMatchObject({ data: {}, chain: {} });
  });

  // ---------------------------------------------------------------------------
  // GET /api/appeal/{appeal} — appeal.show
  // ---------------------------------------------------------------------------
  it('show() — GET /api/appeal/{appeal}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/appeal/42`, ({ request }) => {
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
  // PUT /api/appeal/{appeal} — appeal.update (Laravel POST + _method=PUT)
  // ---------------------------------------------------------------------------
  it('update() — PUT /api/appeal/{appeal} sent as POST + ?_method=PUT', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/appeal/42`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    const body = { title: 'renamed' };
    await makeClient().update(42, body);
    expectMethodOverride(captured.current!, 'PUT');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
  });

  // ---------------------------------------------------------------------------
  // DELETE /api/appeal/{appeal} — appeal.destroy
  // ---------------------------------------------------------------------------
  it('destroy() — DELETE /api/appeal/{appeal}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/appeal/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    await makeClient().destroy(42);
    expect(captured.current!.method).toBe('DELETE');
    expectAuthHeader(captured.current!, TOKEN);
  });

  // ---------------------------------------------------------------------------
  // GET /api/protocol/appeal/all — get.api.protocol.appeal.all
  // ---------------------------------------------------------------------------
  it('listProtocolAppeals() — GET /api/protocol/appeal/all', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/protocol/appeal/all`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 1 }] };
      }),
    );
    const res = await makeClient().listProtocolAppeals();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual([{ id: 1 }]);
  });

  // ---------------------------------------------------------------------------
  // String IDs round-trip in the path (route binding accepts string|number).
  // ---------------------------------------------------------------------------
  it('show() — accepts string IDs (route binding is string|number)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/appeal/appeal-slug`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    await makeClient().show('appeal-slug');
    expect(new URL(captured.current!.url).pathname).toBe('/api/appeal/appeal-slug');
  });
});
