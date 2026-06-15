/**
 * Endpoint coverage for `FailApiClient` (`Modules/Fail`, prefix /api/fail).
 *
 * 3 routes from `Modules/Fail/Routes/api.php`:
 *   GET /api/fail/events           (auth:api, paginated)
 *   GET /api/fail/events/summary   (auth:api)
 *   GET /api/fail/events/{id}      (auth:api)
 *
 * `events` returns a Laravel paginated resource collection
 * (`{data, links, meta}`); `summary` + `{id}` return a bare `{data}` body.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpResponse } from 'msw';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { ApiError } from '../error-handling';
import { FailApiClient } from '../fail-api-client';
import type { FailEventShowResponse, FailEventSummaryResponse } from '../fail-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'fail-tkn-1';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(overrides?: { onUnauthorized?: () => void }): FailApiClient {
  return new FailApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
    ...overrides,
  });
}

describe('FailApiClient — Modules/Fail', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  it('listEvents() — GET /api/fail/events with filters; data is the resource array', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/fail/events`, ({ request }) => {
        captured.current = request;
        return {
          data: [{ id: 1, root_cause_code: 'timeout' }],
          links: {},
          meta: { current_page: 1, total: 1 },
        };
      }),
    );
    const res = await makeClient().listEvents({
      per_page: 50,
      root_cause_code: 'timeout',
      protocol_id: 9,
    });
    const url = new URL(captured.current!.url);
    expect(url.pathname).toBe('/api/fail/events');
    expect(url.searchParams.get('per_page')).toBe('50');
    expect(url.searchParams.get('root_cause_code')).toBe('timeout');
    expect(url.searchParams.get('protocol_id')).toBe('9');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(res.data).toEqual([{ id: 1, root_cause_code: 'timeout' }]);
  });

  it('listEvents() — no query → no params on the URL', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/fail/events`, ({ request }) => {
        captured.current = request;
        return { data: [], links: {}, meta: {} };
      }),
    );
    await makeClient().listEvents();
    expect(new URL(captured.current!.url).search).toBe('');
  });

  it('getSummary() — GET /api/fail/events/summary', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/fail/events/summary`, ({ request }) => {
        captured.current = request;
        return { data: { total: 3, by_root_cause: { timeout: 2, network: 1 } } };
      }),
    );
    const res = await makeClient().getSummary();
    expect(new URL(captured.current!.url).pathname).toBe('/api/fail/events/summary');
    expectAuthHeader(captured.current!, TOKEN);
    const body: FailEventSummaryResponse = res.data;
    expect(body.total).toBe(3);
    expect(body.by_root_cause.timeout).toBe(2);
  });

  it('getEvent() — GET /api/fail/events/{id}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/fail/events/42`, ({ request }) => {
        captured.current = request;
        return { data: { id: 42, root_cause_code: 'network', recovery_actions: [] } };
      }),
    );
    const res = await makeClient().getEvent(42);
    expect(new URL(captured.current!.url).pathname).toBe('/api/fail/events/42');
    expectAuthHeader(captured.current!, TOKEN);
    const body: FailEventShowResponse = res.data;
    expect(body.id).toBe(42);
  });

  it('surfaces a 422 via ApiError', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/fail/events`, () =>
        HttpResponse.json({ message: 'Invalid', errors: { per_page: ['integer'] } }, { status: 422 }),
      ),
    );
    await expect(makeClient().listEvents()).rejects.toBeInstanceOf(ApiError);
  });

  it('fires onUnauthorized and throws ApiError on a 401', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/fail/events/42`, () =>
        HttpResponse.json({ message: 'Unauthenticated.' }, { status: 401 }),
      ),
    );
    const onUnauthorized = vi.fn();
    const client = makeClient({ onUnauthorized });
    await expect(client.getEvent(42)).rejects.toBeInstanceOf(ApiError);
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });
});
