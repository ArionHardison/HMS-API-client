/**
 * CommunicationsApiClient — covers the Chat + Notifications + Stripe /
 * Payments + Subscriptions + Broadcasting slice of the P2X API. Source of
 * truth for shapes is `sdk/spec/endpoints.json`.
 *
 * Why these are co-located: every endpoint here is part of the "user
 * messaging + monetization" surface. They share two cross-cutting concerns
 * the rest of the SDK does not:
 *
 *   1. **Real-time / Pusher.** Chat messages and several notification
 *      events ride Laravel Echo on the `user-{id}` / `guest-{sessionKey}`
 *      private channels. Echo authorizes channel subscriptions through
 *      `POST /api/broadcasting/auth`, which is a Pusher convention — the
 *      body is `application/x-www-form-urlencoded` (`socket_id` +
 *      `channel_name`), NOT JSON, and it returns a Pusher-shaped
 *      `{ auth, channel_data? }` payload (`wrapper: "raw"` per the
 *      manifest). `broadcastingAuth()` posts a `URLSearchParams` body so
 *      `BaseApiClient` does not JSON-encode it; the response is returned
 *      verbatim as `unknown`.
 *
 *   2. **Stripe webhook is public.** `POST /api/webhook/stripe-payment/
 *      handle` is `auth: "public"` per the manifest — the SDK MUST omit
 *      the `Authorization` header even when a token getter is configured.
 *      We do this with `{ auth: false }` per call. The slice test pins
 *      this with `expectNoAuthHeader`. Every other endpoint here is
 *      `auth: "api"` (Sanctum), so `BaseApiClient` injects the Bearer
 *      automatically.
 *
 * Wrapper handling: most slice endpoints emit `wrapper: "data"` (single
 * Resource). Two payment list endpoints (`payment.program-purchases`,
 * `payment.subscriptions`) emit `wrapper: "paginated"` and are typed with
 * `PaginatedPayload<T>`. A handful (`chat.find-user`, `chat.programs`,
 * `payment.save-payment-method`, `payment.setup-payment-method`,
 * `subscription.get/my-subscribers`, `broadcasting.auth`) carry no wrapper
 * — the SDK still goes through `BaseApiClient.request<T>` which always
 * returns `ApiResponse<T>`, but callers should treat `.data` as
 * `unknown`-ish and narrow at the call site.
 *
 * The class extends `BaseApiClient`, which already handles:
 *   - Bearer token injection (skipped per call via `{ auth: false }`)
 *   - `X-Domain` header from `getDomain`
 *   - PUT/PATCH → POST + `?_method=PUT|PATCH` (Laravel)
 *   - FormData switching when payload contains a `File`/`Blob`
 *   - 401 / 422 → callback + `ApiError`
 */

import { BaseApiClient, type ApiResponse } from '../api-client';
import type {
  BroadcastingAuthRequest,
  BroadcastingAuthResponse,
  ChatBroadcastMessageRequest,
  ChatGetRoomRequest,
  ChatMessageData,
  ChatRoomData,
  ChatSendMessageRequest,
  ChatStartRequest,
  EmptyOk,
  NotificationData,
  NotificationStartTaskRequest,
  PaginatedPayload,
  PaymentMethodData,
  PaymentMethodSaveRequest,
  ProgramPurchaseData,
  PurchasedItemData,
  SetupPaymentMethodData,
  StripeAccountStatusData,
  StripeConnectData,
  StripePaymentWebhookRequest,
  StripePaymentWebhookResponse,
  StripeTransactionsData,
  StripeWithdrawData,
  SubscriptionData,
  SubscriptionListItem,
  SubscriptionRollupData,
} from '../types/communications';

// Re-export so consumers can import types from one place.
export type {
  BroadcastingAuthRequest,
  BroadcastingAuthResponse,
  ChatBroadcastMessageRequest,
  ChatGetRoomRequest,
  ChatMessageData,
  ChatRoomData,
  ChatSendMessageRequest,
  ChatStartRequest,
  EmptyOk,
  NotificationData,
  NotificationStartTaskRequest,
  PaginatedPayload,
  PaymentMethodData,
  PaymentMethodSaveRequest,
  ProgramPurchaseData,
  PurchasedItemData,
  SetupPaymentMethodData,
  StripeAccountStatusData,
  StripeConnectData,
  StripePaymentWebhookRequest,
  StripePaymentWebhookResponse,
  StripeTransactionsData,
  StripeWithdrawData,
  SubscriptionData,
  SubscriptionListItem,
  SubscriptionRollupData,
};

/** Append `/value` (URL-encoded) when value is provided; empty otherwise. */
function tail(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === '') return '';
  return `/${encodeURIComponent(String(value))}`;
}

export class CommunicationsApiClient extends BaseApiClient {
  // ===========================================================================
  // Broadcasting (Pusher channel auth)
  //
  // The Echo browser client posts to this endpoint as form fields, not
  // JSON. We construct a `URLSearchParams` body so `BaseApiClient.request`
  // does not JSON-stringify it. `auth: false` because Pusher private
  // channel auth is keyed by Laravel's session — Sanctum does not gate it
  // by default in our manifest (`auth: public`).
  // ===========================================================================

  /** POST /api/broadcasting/auth */
  async broadcastingAuth(
    body: BroadcastingAuthRequest,
  ): Promise<ApiResponse<BroadcastingAuthResponse>> {
    const params = new URLSearchParams();
    params.set('channel_name', body.channel_name);
    params.set('socket_id', body.socket_id);
    if (body.session_key !== undefined) params.set('session_key', body.session_key);
    return this.request<BroadcastingAuthResponse>(
      '/api/broadcasting/auth',
      {
        method: 'POST',
        body: params,
        // Override Content-Type explicitly — defaultHeaders sets it to
        // application/json; Pusher needs urlencoded.
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
      { auth: false },
    );
  }

  // ===========================================================================
  // Chat
  // ===========================================================================

  /** POST /api/chat/broadcast-message */
  async chatBroadcastMessage(
    body: ChatBroadcastMessageRequest,
  ): Promise<ApiResponse<ChatMessageData>> {
    return this.post<ChatMessageData>('/api/chat/broadcast-message', body);
  }

  /** GET /api/chat/broadcast-messages/{type}/{program?} */
  async chatBroadcastMessages(
    type: string,
    program?: number | string,
  ): Promise<ApiResponse<ChatMessageData[]>> {
    return this.get<ChatMessageData[]>(
      `/api/chat/broadcast-messages/${encodeURIComponent(type)}${tail(program)}`,
    );
  }

  /** DELETE /api/chat/delete-message/{message} */
  async chatDeleteMessage(message: number | string): Promise<ApiResponse<EmptyOk>> {
    return this.delete<EmptyOk>(
      `/api/chat/delete-message/${encodeURIComponent(String(message))}`,
    );
  }

  /**
   * DELETE /api/chat/delete-сhat/{chat}
   *
   * NOTE: the manifest URI literally contains a Cyrillic "с" (U+0441) in
   * "delete-сhat". This is preserved verbatim because the Laravel route
   * registration uses the same string — changing it to ASCII "c" would
   * 404. Test pin: `chat-notif-stripe.test.ts` references the same
   * Cyrillic character.
   */
  async chatDeleteChat(chat: number | string): Promise<ApiResponse<EmptyOk>> {
    return this.delete<EmptyOk>(
      `/api/chat/delete-${'с'}hat/${encodeURIComponent(String(chat))}`,
    );
  }

  /** GET /api/chat/find-user/{search} */
  async chatFindUser(search: string): Promise<ApiResponse<unknown[]>> {
    return this.get<unknown[]>(`/api/chat/find-user/${encodeURIComponent(search)}`);
  }

  /** GET /api/chat/get-list/{search?} */
  async chatGetList(search?: string): Promise<ApiResponse<ChatRoomData[]>> {
    return this.get<ChatRoomData[]>(`/api/chat/get-list${tail(search)}`);
  }

  /** GET /api/chat/get-new-chat/{room} */
  async chatGetNewChat(room: number | string): Promise<ApiResponse<ChatRoomData>> {
    return this.get<ChatRoomData>(
      `/api/chat/get-new-chat/${encodeURIComponent(String(room))}`,
    );
  }

  /** POST /api/chat/get-room */
  async chatGetRoom(body: ChatGetRoomRequest): Promise<ApiResponse<ChatRoomData>> {
    return this.post<ChatRoomData>('/api/chat/get-room', body);
  }

  /** GET /api/chat/get-room-by-id/{room} */
  async chatGetRoomById(room: number | string): Promise<ApiResponse<ChatRoomData>> {
    return this.get<ChatRoomData>(
      `/api/chat/get-room-by-id/${encodeURIComponent(String(room))}`,
    );
  }

  /** GET /api/chat/messages/{chat}/{search?} */
  async chatMessages(
    chat: number | string,
    search?: string,
  ): Promise<ApiResponse<ChatMessageData[]>> {
    return this.get<ChatMessageData[]>(
      `/api/chat/messages/${encodeURIComponent(String(chat))}${tail(search)}`,
    );
  }

  /** GET /api/chat/programs */
  async chatPrograms(): Promise<ApiResponse<unknown[]>> {
    return this.get<unknown[]>('/api/chat/programs');
  }

  /** POST /api/chat/send-message */
  async chatSendMessage(body: ChatSendMessageRequest): Promise<ApiResponse<ChatMessageData>> {
    return this.post<ChatMessageData>('/api/chat/send-message', body);
  }

  /** POST /api/chat/start */
  async chatStart(body: ChatStartRequest): Promise<ApiResponse<ChatRoomData>> {
    return this.post<ChatRoomData>('/api/chat/start', body);
  }

  // ===========================================================================
  // Notifications
  // ===========================================================================

  /** DELETE /api/notification/delete-notification/{notification} */
  async notificationDeleteNotification(
    notification: number | string,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.delete<EmptyOk>(
      `/api/notification/delete-notification/${encodeURIComponent(String(notification))}`,
    );
  }

  /** GET /api/notification/get */
  async notificationGet(): Promise<ApiResponse<NotificationData[]>> {
    return this.get<NotificationData[]>('/api/notification/get');
  }

  /** GET /api/notification/get-unread */
  async notificationGetUnread(): Promise<ApiResponse<NotificationData[]>> {
    return this.get<NotificationData[]>('/api/notification/get-unread');
  }

  /** POST /api/notification/start-task */
  async notificationStartTask(
    body: NotificationStartTaskRequest,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>('/api/notification/start-task', body);
  }

  // ===========================================================================
  // Payment
  // ===========================================================================

  /** DELETE /api/payment/delete-payment-method/{id} */
  async paymentDeletePaymentMethod(id: number | string): Promise<ApiResponse<EmptyOk>> {
    return this.delete<EmptyOk>(
      `/api/payment/delete-payment-method/${encodeURIComponent(String(id))}`,
    );
  }

  /** GET /api/payment/get-payment-method */
  async paymentGetPaymentMethod(): Promise<ApiResponse<PaymentMethodData>> {
    return this.get<PaymentMethodData>('/api/payment/get-payment-method');
  }

  /** GET /api/payment/program-purchases (paginated) */
  async paymentProgramPurchases(): Promise<ApiResponse<PaginatedPayload<ProgramPurchaseData>>> {
    return this.get<PaginatedPayload<ProgramPurchaseData>>('/api/payment/program-purchases');
  }

  /** GET /api/payment/purchased-items */
  async paymentPurchasedItems(): Promise<ApiResponse<PurchasedItemData[]>> {
    return this.get<PurchasedItemData[]>('/api/payment/purchased-items');
  }

  /** POST /api/payment/save-payment-method */
  async paymentSavePaymentMethod(
    body: PaymentMethodSaveRequest,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.post<EmptyOk>('/api/payment/save-payment-method', body);
  }

  /** GET /api/payment/setup-payment-method */
  async paymentSetupPaymentMethod(): Promise<ApiResponse<SetupPaymentMethodData>> {
    return this.get<SetupPaymentMethodData>('/api/payment/setup-payment-method');
  }

  /** GET /api/payment/subscriptions (paginated) */
  async paymentSubscriptions(): Promise<ApiResponse<PaginatedPayload<SubscriptionListItem>>> {
    return this.get<PaginatedPayload<SubscriptionListItem>>('/api/payment/subscriptions');
  }

  // ===========================================================================
  // Stripe Connect
  // ===========================================================================

  /** GET /api/stripe/check-account */
  async stripeCheckAccount(): Promise<ApiResponse<StripeAccountStatusData>> {
    return this.get<StripeAccountStatusData>('/api/stripe/check-account');
  }

  /** GET /api/stripe/connect — returns the onboarding link payload. */
  async stripeConnect(): Promise<ApiResponse<StripeConnectData>> {
    return this.get<StripeConnectData>('/api/stripe/connect');
  }

  /** DELETE /api/stripe/delete-account */
  async stripeDeleteAccount(): Promise<ApiResponse<EmptyOk>> {
    return this.delete<EmptyOk>('/api/stripe/delete-account');
  }

  /** GET /api/stripe/transactions */
  async stripeTransactions(): Promise<ApiResponse<StripeTransactionsData>> {
    return this.get<StripeTransactionsData>('/api/stripe/transactions');
  }

  /** GET /api/stripe/withdraw */
  async stripeWithdraw(): Promise<ApiResponse<StripeWithdrawData>> {
    return this.get<StripeWithdrawData>('/api/stripe/withdraw');
  }

  // ===========================================================================
  // Subscriptions
  // ===========================================================================

  /** GET /api/subscription/cancel/{subscription} */
  async subscriptionCancel(
    subscription: number | string,
  ): Promise<ApiResponse<SubscriptionData>> {
    return this.get<SubscriptionData>(
      `/api/subscription/cancel/${encodeURIComponent(String(subscription))}`,
    );
  }

  /** POST /api/subscription/create */
  async subscriptionCreate(
    body?: Record<string, unknown>,
  ): Promise<ApiResponse<SubscriptionData>> {
    return this.post<SubscriptionData>('/api/subscription/create', body ?? {});
  }

  /**
   * GET /api/subscription/get/my-subscribers
   *
   * NOTE: this MUST come before the parameterized
   * `subscription.get/{user}` method on the wire too — the manifest lists
   * both routes against `/api/subscription/get/...`. Laravel resolves the
   * literal `my-subscribers` first; we expose them as two distinct
   * methods so callers don't have to worry about the routing precedence.
   */
  async subscriptionGetMySubscribers(): Promise<ApiResponse<SubscriptionRollupData>> {
    return this.get<SubscriptionRollupData>('/api/subscription/get/my-subscribers');
  }

  /** GET /api/subscription/get/{user} */
  async subscriptionGet(user: number | string): Promise<ApiResponse<SubscriptionData>> {
    return this.get<SubscriptionData>(
      `/api/subscription/get/${encodeURIComponent(String(user))}`,
    );
  }

  /** GET /api/subscription/my-subscription */
  async subscriptionMy(): Promise<ApiResponse<SubscriptionData>> {
    return this.get<SubscriptionData>('/api/subscription/my-subscription');
  }

  /** DELETE /api/subscription/remove/{subscription} */
  async subscriptionRemove(
    subscription: number | string,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.delete<EmptyOk>(
      `/api/subscription/remove/${encodeURIComponent(String(subscription))}`,
    );
  }

  /** GET /api/subscription/subscribe/{subscription} */
  async subscriptionSubscribe(
    subscription: number | string,
  ): Promise<ApiResponse<SubscriptionData>> {
    return this.get<SubscriptionData>(
      `/api/subscription/subscribe/${encodeURIComponent(String(subscription))}`,
    );
  }

  /** GET /api/subscription/subscribers */
  async subscriptionSubscribers(): Promise<ApiResponse<SubscriptionData[]>> {
    return this.get<SubscriptionData[]>('/api/subscription/subscribers');
  }

  /** GET /api/subscription/subscribes */
  async subscriptionSubscribes(): Promise<ApiResponse<SubscriptionData[]>> {
    return this.get<SubscriptionData[]>('/api/subscription/subscribes');
  }

  /** PATCH /api/subscription/update/{subscription} */
  async subscriptionUpdate(
    subscription: number | string,
    body: Record<string, unknown>,
  ): Promise<ApiResponse<SubscriptionData>> {
    return this.patch<SubscriptionData>(
      `/api/subscription/update/${encodeURIComponent(String(subscription))}`,
      body,
    );
  }

  // ===========================================================================
  // Stripe webhook (PUBLIC — `auth: false` is load-bearing)
  // ===========================================================================

  /**
   * POST /api/webhook/stripe-payment/handle
   *
   * Public endpoint. Stripe POSTs the raw event payload here. The SDK
   * MUST NOT inject the `Authorization` header, so we pass
   * `{ auth: false }` per the manifest. The endpoint is still tenant-
   * scoped (Stripe Connect events carry the tenant via the connected
   * account id), so `X-Domain` is still sent.
   */
  async stripePaymentWebhook(
    body: StripePaymentWebhookRequest,
  ): Promise<ApiResponse<StripePaymentWebhookResponse>> {
    return this.post<StripePaymentWebhookResponse>(
      '/api/webhook/stripe-payment/handle',
      body,
      { auth: false },
    );
  }
}
