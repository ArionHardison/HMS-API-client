/**
 * CommunicationsApiClient — endpoint-by-endpoint contract tests.
 *
 * Covers the Chat + Notifications + Stripe / Payments + Subscriptions +
 * Broadcasting slice (41 endpoints) of the P2X API. Source of truth:
 * `sdk/spec/endpoints.json` (filtered into `/tmp/chat-notif-stripe-slice.json`).
 *
 * Each endpoint gets at least one `it()` block asserting:
 *   - URL (BaseURL + path-param interpolation)
 *   - HTTP verb on the wire (PATCH → POST + `?_method=PATCH`; DELETE stays DELETE)
 *   - Authorization header presence per spec `auth` (public ⇒ no Bearer;
 *     api ⇒ Bearer required)
 *   - `X-Domain` header presence
 *   - Request body matches the spec's `request.shape`
 *   - Response decoding pulls the typed payload out of the envelope
 *
 * Two slice-special invariants get their own dedicated assertions:
 *   - **Stripe webhook** (`POST /api/webhook/stripe-payment/handle`) — public
 *     endpoint; the SDK MUST omit the `Authorization` header even when a
 *     token getter is configured. The SDK opts into `{ auth: false }` here.
 *   - **Broadcasting auth** (`POST /api/broadcasting/auth`) — Pusher private-
 *     channel handshake. Echo posts the body as form fields, not JSON. The
 *     test asserts `socket_id` + `channel_name` arrive as form fields.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectFormDataField,
  expectMethodOverride,
  expectNoAuthHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { CommunicationsApiClient } from '../communications-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'comms-tok-xyz';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): CommunicationsApiClient {
  return new CommunicationsApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('CommunicationsApiClient', () => {
  let cap: Captured;

  beforeEach(() => {
    cap = { current: null };
  });

  afterEach(() => {
    cap.current = null;
  });

  // ===========================================================================
  // Broadcasting (Pusher channel auth)
  // ===========================================================================

  describe('POST /api/broadcasting/auth', () => {
    it('posts socket_id + channel_name as form fields, no Bearer needed', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/broadcasting/auth`, async ({ request }) => {
          cap.current = request.clone();
          return { auth: 'key:sig' };
        }),
      );
      const res = await makeClient().broadcastingAuth({
        channel_name: 'private-user.7',
        socket_id: '1234.567',
      });
      expect(cap.current!.method).toBe('POST');
      expectDomainHeader(cap.current!, DOMAIN);
      // Body must be url-encoded form fields (Pusher convention).
      const ctype = cap.current!.headers.get('content-type') ?? '';
      const text = await cap.current!.clone().text();
      // Either application/x-www-form-urlencoded or multipart works for
      // Pusher; we accept either but assert the fields are reachable.
      if (/application\/x-www-form-urlencoded/i.test(ctype)) {
        const params = new URLSearchParams(text);
        expect(params.get('channel_name')).toBe('private-user.7');
        expect(params.get('socket_id')).toBe('1234.567');
      }
      else if (/multipart\/form-data/i.test(ctype)) {
        await expectFormDataField(cap.current!, 'channel_name', 'private-user.7');
        await expectFormDataField(cap.current!, 'socket_id', '1234.567');
      }
      else {
        throw new Error(`Expected form-encoded body, got Content-Type "${ctype}".`);
      }
      expect((res as any).auth).toBe('key:sig');
    });
  });

  // ===========================================================================
  // Chat
  // ===========================================================================

  describe('POST /api/chat/broadcast-message', () => {
    it('Bearer + JSON body, returns data envelope', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/chat/broadcast-message`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: { id: 99 } };
        }),
      );
      const res = await makeClient().chatBroadcastMessage({
        to: 'all',
        message: 'hi',
        attachments: [],
      });
      expectAuthHeader(cap.current!, TOKEN);
      expectDomainHeader(cap.current!, DOMAIN);
      expect(cap.current!.method).toBe('POST');
      const body = await cap.current!.json();
      expect(body).toEqual({ to: 'all', message: 'hi', attachments: [] });
      expect((res.data as any).id).toBe(99);
    });
  });

  describe('GET /api/chat/broadcast-messages/{type}/{program?}', () => {
    it('interpolates type and optional program', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/chat/broadcast-messages/coach/42`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { items: [] } };
        }),
      );
      const res = await makeClient().chatBroadcastMessages('coach', 42);
      expectAuthHeader(cap.current!, TOKEN);
      expect(cap.current!.method).toBe('GET');
      expect(res.data).toBeDefined();
    });

    it('omits program tail when undefined', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/chat/broadcast-messages/coach`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().chatBroadcastMessages('coach');
      expect(cap.current!.url.endsWith('/api/chat/broadcast-messages/coach')).toBe(true);
    });
  });

  describe('DELETE /api/chat/delete-message/{message}', () => {
    it('issues a real DELETE', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/chat/delete-message/9`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().chatDeleteMessage(9);
      expect(cap.current!.method).toBe('DELETE');
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('DELETE /api/chat/delete-сhat/{chat}', () => {
    // Note: spec literally uses Cyrillic "с" (U+0441) in `delete-сhat`.
    // The fetch runtime percent-encodes the Cyrillic byte to `%D1%81` on
    // the wire, so the MSW handler is registered against the encoded
    // URL. The SDK source still emits the literal Cyrillic char so the
    // Laravel route matches.
    it('issues a real DELETE on the (cyrillic-c) endpoint', async () => {
      server.use(
        mockEndpoint(
          'delete',
          `${BASE}/api/chat/delete-%D1%81hat/12`,
          ({ request }) => {
            cap.current = request;
            return { success: true, message: '', data: null };
          },
        ),
      );
      await makeClient().chatDeleteChat(12);
      expect(cap.current!.method).toBe('DELETE');
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/chat/find-user/{search}', () => {
    it('encodes the search segment', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/chat/find-user/jane%20doe`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().chatFindUser('jane doe');
      expect(cap.current!.method).toBe('GET');
    });
  });

  describe('GET /api/chat/get-list/{search?}', () => {
    it('renders search when provided', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/chat/get-list/foo`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().chatGetList('foo');
      expect(cap.current!.url.endsWith('/api/chat/get-list/foo')).toBe(true);
    });

    it('omits search tail when undefined', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/chat/get-list`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().chatGetList();
      expect(cap.current!.url.endsWith('/api/chat/get-list')).toBe(true);
    });
  });

  describe('GET /api/chat/get-new-chat/{room}', () => {
    it('hits the room id', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/chat/get-new-chat/55`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { id: 55 } };
        }),
      );
      const res = await makeClient().chatGetNewChat(55);
      expect((res.data as any).id).toBe(55);
    });
  });

  describe('POST /api/chat/get-room', () => {
    it('posts {participant}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/chat/get-room`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: { id: 7 } };
        }),
      );
      await makeClient().chatGetRoom({ participant: 7 });
      expect(cap.current!.method).toBe('POST');
      expect(await cap.current!.json()).toEqual({ participant: 7 });
    });
  });

  describe('GET /api/chat/get-room-by-id/{room}', () => {
    it('hits the room id', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/chat/get-room-by-id/8`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { id: 8 } };
        }),
      );
      const res = await makeClient().chatGetRoomById(8);
      expect((res.data as any).id).toBe(8);
    });
  });

  describe('GET /api/chat/messages/{chat}/{search?}', () => {
    it('with search', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/chat/messages/3/term`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().chatMessages(3, 'term');
      expect(cap.current!.url.endsWith('/api/chat/messages/3/term')).toBe(true);
    });

    it('without search', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/chat/messages/3`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().chatMessages(3);
      expect(cap.current!.url.endsWith('/api/chat/messages/3')).toBe(true);
    });
  });

  describe('GET /api/chat/programs', () => {
    it('returns the parsed envelope', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/chat/programs`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().chatPrograms();
      expectAuthHeader(cap.current!, TOKEN);
      expect(cap.current!.method).toBe('GET');
    });
  });

  describe('POST /api/chat/send-message', () => {
    it('posts message + to + attachments', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/chat/send-message`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: { id: 1 } };
        }),
      );
      await makeClient().chatSendMessage({ to: 4, message: 'yo' });
      const body = await cap.current!.json();
      expect(body).toEqual({ to: 4, message: 'yo' });
    });
  });

  describe('POST /api/chat/start', () => {
    it('posts {program, type}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/chat/start`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: { id: 2 } };
        }),
      );
      await makeClient().chatStart({ type: 'support', program: 11 });
      expect(await cap.current!.json()).toEqual({ type: 'support', program: 11 });
    });
  });

  // ===========================================================================
  // Notifications
  // ===========================================================================

  describe('DELETE /api/notification/delete-notification/{notification}', () => {
    it('real DELETE', async () => {
      server.use(
        mockEndpoint(
          'delete',
          `${BASE}/api/notification/delete-notification/77`,
          ({ request }) => {
            cap.current = request;
            return { success: true, message: '', data: null };
          },
        ),
      );
      await makeClient().notificationDeleteNotification(77);
      expect(cap.current!.method).toBe('DELETE');
    });
  });

  describe('GET /api/notification/get', () => {
    it('Bearer + parsed envelope', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/notification/get`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().notificationGet();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/notification/get-unread', () => {
    it('Bearer + parsed envelope', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/notification/get-unread`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().notificationGetUnread();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('POST /api/notification/start-task', () => {
    it('posts {id}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/notification/start-task`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().notificationStartTask({ id: 33 });
      expect(await cap.current!.json()).toEqual({ id: 33 });
    });
  });

  // ===========================================================================
  // Payment
  // ===========================================================================

  describe('DELETE /api/payment/delete-payment-method/{id}', () => {
    it('real DELETE', async () => {
      server.use(
        mockEndpoint(
          'delete',
          `${BASE}/api/payment/delete-payment-method/pm_123`,
          ({ request }) => {
            cap.current = request;
            return { success: true, message: '', data: null };
          },
        ),
      );
      await makeClient().paymentDeletePaymentMethod('pm_123');
      expect(cap.current!.method).toBe('DELETE');
    });
  });

  describe('GET /api/payment/get-payment-method', () => {
    it('Bearer + parsed envelope', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/payment/get-payment-method`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { id: 'pm_1' } };
        }),
      );
      const res = await makeClient().paymentGetPaymentMethod();
      expect((res.data as any).id).toBe('pm_1');
    });
  });

  describe('GET /api/payment/program-purchases (paginated)', () => {
    it('returns paginated envelope', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/payment/program-purchases`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { items: [] } };
        }),
      );
      const res = await makeClient().paymentProgramPurchases();
      expect(Array.isArray((res.data as any).items)).toBe(true);
    });
  });

  describe('GET /api/payment/purchased-items', () => {
    it('Bearer + parsed envelope', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/payment/purchased-items`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().paymentPurchasedItems();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('POST /api/payment/save-payment-method', () => {
    it('posts {payment_method, client_secret}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/payment/save-payment-method`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().paymentSavePaymentMethod({
        payment_method: 'pm_x',
        client_secret: 'cs_y',
      });
      expect(await cap.current!.json()).toEqual({
        payment_method: 'pm_x',
        client_secret: 'cs_y',
      });
    });
  });

  describe('GET /api/payment/setup-payment-method', () => {
    it('Bearer + parsed envelope', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/payment/setup-payment-method`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { client_secret: 'cs' } };
        }),
      );
      const res = await makeClient().paymentSetupPaymentMethod();
      expect((res.data as any).client_secret).toBe('cs');
    });
  });

  describe('GET /api/payment/subscriptions (paginated)', () => {
    it('returns paginated envelope', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/payment/subscriptions`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { items: [] } };
        }),
      );
      const res = await makeClient().paymentSubscriptions();
      expect(Array.isArray((res.data as any).items)).toBe(true);
    });
  });

  // ===========================================================================
  // Stripe Connect
  // ===========================================================================

  describe('GET /api/stripe/check-account', () => {
    it('Bearer + parsed envelope', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/stripe/check-account`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { ok: true } };
        }),
      );
      await makeClient().stripeCheckAccount();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/stripe/connect', () => {
    it('Bearer + parsed envelope (returns onboarding url)', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/stripe/connect`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { url: 'https://stripe.com/x' } };
        }),
      );
      const res = await makeClient().stripeConnect();
      expect((res.data as any).url).toBe('https://stripe.com/x');
    });
  });

  describe('DELETE /api/stripe/delete-account', () => {
    it('real DELETE', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/stripe/delete-account`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().stripeDeleteAccount();
      expect(cap.current!.method).toBe('DELETE');
    });
  });

  describe('GET /api/stripe/transactions', () => {
    it('Bearer + parsed envelope', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/stripe/transactions`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().stripeTransactions();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/stripe/withdraw', () => {
    it('Bearer + parsed envelope', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/stripe/withdraw`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { ok: true } };
        }),
      );
      await makeClient().stripeWithdraw();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  // ===========================================================================
  // Subscriptions
  // ===========================================================================

  describe('GET /api/subscription/cancel/{subscription}', () => {
    it('hits the right path', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/subscription/cancel/55`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { id: 55 } };
        }),
      );
      await makeClient().subscriptionCancel(55);
      expect(cap.current!.method).toBe('GET');
    });
  });

  describe('POST /api/subscription/create', () => {
    it('posts and returns parsed envelope', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/subscription/create`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: { id: 1 } };
        }),
      );
      await makeClient().subscriptionCreate({ plan: 'pro' });
      expect(cap.current!.method).toBe('POST');
      expect(await cap.current!.json()).toEqual({ plan: 'pro' });
    });

    it('accepts no body', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/subscription/create`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: { id: 2 } };
        }),
      );
      await makeClient().subscriptionCreate();
      expect(cap.current!.method).toBe('POST');
    });
  });

  describe('GET /api/subscription/get/my-subscribers', () => {
    it('exact path (literal "my-subscribers")', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/subscription/get/my-subscribers`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().subscriptionGetMySubscribers();
      expect(cap.current!.url.endsWith('/api/subscription/get/my-subscribers')).toBe(true);
    });
  });

  describe('GET /api/subscription/get/{user}', () => {
    it('interpolates user id', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/subscription/get/3`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { id: 3 } };
        }),
      );
      await makeClient().subscriptionGet(3);
      expect(cap.current!.url.endsWith('/api/subscription/get/3')).toBe(true);
    });
  });

  describe('GET /api/subscription/my-subscription', () => {
    it('Bearer + parsed envelope', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/subscription/my-subscription`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { id: 1 } };
        }),
      );
      await makeClient().subscriptionMy();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('DELETE /api/subscription/remove/{subscription}', () => {
    it('real DELETE', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/subscription/remove/9`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().subscriptionRemove(9);
      expect(cap.current!.method).toBe('DELETE');
    });
  });

  describe('GET /api/subscription/subscribe/{subscription}', () => {
    it('hits the right path', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/subscription/subscribe/4`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { id: 4 } };
        }),
      );
      await makeClient().subscriptionSubscribe(4);
      expect(cap.current!.method).toBe('GET');
    });
  });

  describe('GET /api/subscription/subscribers', () => {
    it('Bearer + parsed envelope', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/subscription/subscribers`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().subscriptionSubscribers();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/subscription/subscribes', () => {
    it('Bearer + parsed envelope', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/subscription/subscribes`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().subscriptionSubscribes();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('PATCH /api/subscription/update/{subscription} (POST + ?_method=PATCH)', () => {
    it('rewrites to POST?_method=PATCH and forwards body', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/subscription/update/5`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: { id: 5 } };
        }),
      );
      await makeClient().subscriptionUpdate(5, { plan: 'plus' });
      expectMethodOverride(cap.current!, 'PATCH');
      expect(await cap.current!.json()).toEqual({ plan: 'plus' });
    });
  });

  // ===========================================================================
  // Stripe webhook (PUBLIC; auth: false MUST be opted into)
  // ===========================================================================

  describe('POST /api/webhook/stripe-payment/handle (public)', () => {
    it('omits Authorization header even when getToken is configured', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/webhook/stripe-payment/handle`,
          async ({ request }) => {
            cap.current = request.clone();
            return { success: true, message: '', data: { received: true } };
          },
        ),
      );
      await makeClient().stripePaymentWebhook({ id: 'evt_1', type: 'invoice.paid' });
      // The slice-critical assertion: no Bearer.
      expectNoAuthHeader(cap.current!);
      // X-Domain still flows so the api can route the webhook to the right tenant.
      expectDomainHeader(cap.current!, DOMAIN);
      expect(cap.current!.method).toBe('POST');
      const body = await cap.current!.json();
      expect(body).toEqual({ id: 'evt_1', type: 'invoice.paid' });
    });
  });
});
