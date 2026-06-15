/**
 * Endpoint coverage for `H5iApiClient` (`Modules/H5i`).
 *
 * 7 routes from `Modules/H5i/Routes/api.php`:
 *   POST   /api/h5i/msg
 *   GET    /api/h5i/msg/inbox
 *   GET    /api/h5i/msg/channel/{channel}
 *   GET    /api/h5i/msg/{id}
 *   POST   /api/h5i/dev/seed-demo/{guid}
 *   GET    /api/h5i/deals/{guid}/public-messages          (anonymous)
 *   POST   /api/broadcasting/public-auth                  (anonymous)
 *
 * The H5i controllers return bespoke top-level bodies (no
 * `{success, message, data}` envelope), so assertions read those fields off
 * the resolved value (cast through `unknown`).
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpResponse } from 'msw';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectNoAuthHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { ApiError } from '../error-handling';
import { H5iApiClient } from '../h5i-api-client';
import type {
  H5iChannelResponse,
  H5iPublicBroadcastAuthResponse,
  H5iPublicMessagesResponse,
  H5iSeedDemoResponse,
  H5iShowMessageResponse,
  InboxH5iMessageResponse,
  StoreH5iMessageResponse,
} from '../h5i-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'h5i-tkn-123';
const DOMAIN = 'ycaas.ai';
const GUID = '11111111-2222-4333-8444-555566667777';

interface Captured {
  current: Request | null;
}

function makeClient(overrides?: { onUnauthorized?: () => void }): H5iApiClient {
  return new H5iApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
    ...overrides,
  });
}

describe('H5iApiClient — Modules/H5i', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  it('sendMessage() — POST /api/h5i/msg, body + Bearer + X-Domain, 201', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/h5i/msg`, async ({ request }) => {
        captured.current = request.clone();
        return HttpResponse.json(
          {
            message: {
              id: 'aaaaaaaaaaaaaaaa',
              ts: '2026-06-15T00:00:00Z',
              from: 'nudge-agent',
              to: 'all',
              body: 'hi',
              version: 2,
              channel: 'deal:abc',
            },
            newly_created: true,
          },
          { status: 201 },
        );
      }),
    );
    const body = { from: 'nudge-agent', to: 'all', body: 'hi', channel: 'deal:abc' };
    const res = (await makeClient().sendMessage(
      body,
    )) as unknown as StoreH5iMessageResponse;
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.newly_created).toBe(true);
    expect(res.message.channel).toBe('deal:abc');
  });

  it('getInbox() — GET /api/h5i/msg/inbox with agent+channel+limit query', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/h5i/msg/inbox`, ({ request }) => {
        captured.current = request;
        return { messages: [], agent: 'a1', channel: 'deal:abc' };
      }),
    );
    const res = (await makeClient().getInbox({
      agent: 'a1',
      channel: 'deal:abc',
      limit: 50,
    })) as unknown as InboxH5iMessageResponse;
    const url = new URL(captured.current!.url);
    expect(url.pathname).toBe('/api/h5i/msg/inbox');
    expect(url.searchParams.get('agent')).toBe('a1');
    expect(url.searchParams.get('channel')).toBe('deal:abc');
    expect(url.searchParams.get('limit')).toBe('50');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.agent).toBe('a1');
  });

  it('getInbox() — omits limit when not supplied', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/h5i/msg/inbox`, ({ request }) => {
        captured.current = request;
        return { messages: [], agent: 'a1', channel: 'deal:abc' };
      }),
    );
    await makeClient().getInbox({ agent: 'a1', channel: 'deal:abc' });
    expect(new URL(captured.current!.url).searchParams.get('limit')).toBeNull();
  });

  it('getChannel() — GET /api/h5i/msg/channel/{channel}, encodes the slug', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/h5i/msg/channel/deal%3Aabc`, ({ request }) => {
        captured.current = request;
        return { messages: [{ id: 'x' }], channel: 'deal:abc' };
      }),
    );
    const res = (await makeClient().getChannel(
      'deal:abc',
      100,
    )) as unknown as H5iChannelResponse;
    expect(new URL(captured.current!.url).pathname).toBe('/api/h5i/msg/channel/deal%3Aabc');
    expect(new URL(captured.current!.url).searchParams.get('limit')).toBe('100');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.channel).toBe('deal:abc');
  });

  it('getMessage() — GET /api/h5i/msg/{id}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/h5i/msg/aaaaaaaaaaaaaaaa`, ({ request }) => {
        captured.current = request;
        return { message: { id: 'aaaaaaaaaaaaaaaa', channel: 'deal:abc' } };
      }),
    );
    const res = (await makeClient().getMessage(
      'aaaaaaaaaaaaaaaa',
    )) as unknown as H5iShowMessageResponse;
    expect(new URL(captured.current!.url).pathname).toBe('/api/h5i/msg/aaaaaaaaaaaaaaaa');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.message.id).toBe('aaaaaaaaaaaaaaaa');
  });

  it('seedDemo() — POST /api/h5i/dev/seed-demo/{guid}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/h5i/dev/seed-demo/${GUID}`, ({ request }) => {
        captured.current = request;
        return {
          deal_guid: GUID,
          public_channel: { id: 5, deal_guid_hash: 'abcd', publish_state: 'active' },
          messages: [{ id: 'm1', kind: 'ASK', body: 'x' }],
        };
      }),
    );
    const res = (await makeClient().seedDemo(GUID)) as unknown as H5iSeedDemoResponse;
    expect(captured.current!.method).toBe('POST');
    expect(new URL(captured.current!.url).pathname).toBe(`/api/h5i/dev/seed-demo/${GUID}`);
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.public_channel.publish_state).toBe('active');
  });

  it('getPublicMessages() — GET /api/h5i/deals/{guid}/public-messages, NO Bearer', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/h5i/deals/${GUID}/public-messages`,
        ({ request }) => {
          captured.current = request;
          return { messages: [{}], channel: 'public-deal-abcd', deal_guid: GUID };
        },
      ),
    );
    const res = (await makeClient().getPublicMessages(
      GUID,
    )) as unknown as H5iPublicMessagesResponse;
    expect(new URL(captured.current!.url).pathname).toBe(
      `/api/h5i/deals/${GUID}/public-messages`,
    );
    // Anonymous endpoint — Authorization MUST be omitted, but X-Domain stays.
    expectNoAuthHeader(captured.current!);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(res.deal_guid).toBe(GUID);
  });

  it('publicBroadcastAuth() — POST /api/broadcasting/public-auth, NO Bearer, body', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/broadcasting/public-auth`, async ({ request }) => {
        captured.current = request.clone();
        return { auth: 'pkey:sig' };
      }),
    );
    const body = { channel_name: 'public-deal-abcd', socket_id: '123.456' };
    const res = (await makeClient().publicBroadcastAuth(
      body,
    )) as unknown as H5iPublicBroadcastAuthResponse;
    expect(captured.current!.method).toBe('POST');
    expectNoAuthHeader(captured.current!);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.auth).toBe('pkey:sig');
  });

  it('surfaces a 422 schema validation failure via ApiError', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/h5i/msg`, () =>
        HttpResponse.json(
          { error: 'schema validation failed', errors: { from: ['required'] } },
          { status: 422 },
        ),
      ),
    );
    await expect(
      makeClient().sendMessage({ from: '', to: 'all', body: 'x', channel: 'deal:abc' }),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it('fires onUnauthorized and throws ApiError on a 401', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/h5i/msg/aaaaaaaaaaaaaaaa`, () =>
        HttpResponse.json({ message: 'Unauthenticated.' }, { status: 401 }),
      ),
    );
    const onUnauthorized = vi.fn();
    const client = makeClient({ onUnauthorized });
    await expect(client.getMessage('aaaaaaaaaaaaaaaa')).rejects.toBeInstanceOf(ApiError);
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });
});
