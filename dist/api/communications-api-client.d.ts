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
import type { BroadcastingAuthRequest, BroadcastingAuthResponse, ChatBroadcastMessageRequest, ChatGetRoomRequest, ChatMessageData, ChatRoomData, ChatSendMessageRequest, ChatStartRequest, EmptyOk, NotificationData, NotificationStartTaskRequest, PaginatedPayload, PaymentMethodData, PaymentMethodSaveRequest, ProgramPurchaseData, PurchasedItemData, SetupPaymentMethodData, StripeAccountStatusData, StripeConnectData, StripePaymentWebhookRequest, StripePaymentWebhookResponse, StripeTransactionsData, StripeWithdrawData, SubscriptionData, SubscriptionListItem, SubscriptionRollupData } from '../types/communications';
export type { BroadcastingAuthRequest, BroadcastingAuthResponse, ChatBroadcastMessageRequest, ChatGetRoomRequest, ChatMessageData, ChatRoomData, ChatSendMessageRequest, ChatStartRequest, EmptyOk, NotificationData, NotificationStartTaskRequest, PaginatedPayload, PaymentMethodData, PaymentMethodSaveRequest, ProgramPurchaseData, PurchasedItemData, SetupPaymentMethodData, StripeAccountStatusData, StripeConnectData, StripePaymentWebhookRequest, StripePaymentWebhookResponse, StripeTransactionsData, StripeWithdrawData, SubscriptionData, SubscriptionListItem, SubscriptionRollupData, };
export declare class CommunicationsApiClient extends BaseApiClient {
    /** POST /api/broadcasting/auth */
    broadcastingAuth(body: BroadcastingAuthRequest): Promise<ApiResponse<BroadcastingAuthResponse>>;
    /** POST /api/chat/broadcast-message */
    chatBroadcastMessage(body: ChatBroadcastMessageRequest): Promise<ApiResponse<ChatMessageData>>;
    /** GET /api/chat/broadcast-messages/{type}/{program?} */
    chatBroadcastMessages(type: string, program?: number | string): Promise<ApiResponse<ChatMessageData[]>>;
    /** DELETE /api/chat/delete-message/{message} */
    chatDeleteMessage(message: number | string): Promise<ApiResponse<EmptyOk>>;
    /**
     * DELETE /api/chat/delete-сhat/{chat}
     *
     * NOTE: the manifest URI literally contains a Cyrillic "с" (U+0441) in
     * "delete-сhat". This is preserved verbatim because the Laravel route
     * registration uses the same string — changing it to ASCII "c" would
     * 404. Test pin: `chat-notif-stripe.test.ts` references the same
     * Cyrillic character.
     */
    chatDeleteChat(chat: number | string): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/chat/find-user/{search} */
    chatFindUser(search: string): Promise<ApiResponse<unknown[]>>;
    /** GET /api/chat/get-list/{search?} */
    chatGetList(search?: string): Promise<ApiResponse<ChatRoomData[]>>;
    /** GET /api/chat/get-new-chat/{room} */
    chatGetNewChat(room: number | string): Promise<ApiResponse<ChatRoomData>>;
    /** POST /api/chat/get-room */
    chatGetRoom(body: ChatGetRoomRequest): Promise<ApiResponse<ChatRoomData>>;
    /** GET /api/chat/get-room-by-id/{room} */
    chatGetRoomById(room: number | string): Promise<ApiResponse<ChatRoomData>>;
    /** GET /api/chat/messages/{chat}/{search?} */
    chatMessages(chat: number | string, search?: string): Promise<ApiResponse<ChatMessageData[]>>;
    /** GET /api/chat/programs */
    chatPrograms(): Promise<ApiResponse<unknown[]>>;
    /** POST /api/chat/send-message */
    chatSendMessage(body: ChatSendMessageRequest): Promise<ApiResponse<ChatMessageData>>;
    /** POST /api/chat/start */
    chatStart(body: ChatStartRequest): Promise<ApiResponse<ChatRoomData>>;
    /** DELETE /api/notification/delete-notification/{notification} */
    notificationDeleteNotification(notification: number | string): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/notification/get */
    notificationGet(): Promise<ApiResponse<NotificationData[]>>;
    /** GET /api/notification/get-unread */
    notificationGetUnread(): Promise<ApiResponse<NotificationData[]>>;
    /** POST /api/notification/start-task */
    notificationStartTask(body: NotificationStartTaskRequest): Promise<ApiResponse<EmptyOk>>;
    /** DELETE /api/payment/delete-payment-method/{id} */
    paymentDeletePaymentMethod(id: number | string): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/payment/get-payment-method */
    paymentGetPaymentMethod(): Promise<ApiResponse<PaymentMethodData>>;
    /** GET /api/payment/program-purchases (paginated) */
    paymentProgramPurchases(): Promise<ApiResponse<PaginatedPayload<ProgramPurchaseData>>>;
    /** GET /api/payment/purchased-items */
    paymentPurchasedItems(): Promise<ApiResponse<PurchasedItemData[]>>;
    /** POST /api/payment/save-payment-method */
    paymentSavePaymentMethod(body: PaymentMethodSaveRequest): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/payment/setup-payment-method */
    paymentSetupPaymentMethod(): Promise<ApiResponse<SetupPaymentMethodData>>;
    /** GET /api/payment/subscriptions (paginated) */
    paymentSubscriptions(): Promise<ApiResponse<PaginatedPayload<SubscriptionListItem>>>;
    /** GET /api/stripe/check-account */
    stripeCheckAccount(): Promise<ApiResponse<StripeAccountStatusData>>;
    /** GET /api/stripe/connect — returns the onboarding link payload. */
    stripeConnect(): Promise<ApiResponse<StripeConnectData>>;
    /** DELETE /api/stripe/delete-account */
    stripeDeleteAccount(): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/stripe/transactions */
    stripeTransactions(): Promise<ApiResponse<StripeTransactionsData>>;
    /** GET /api/stripe/withdraw */
    stripeWithdraw(): Promise<ApiResponse<StripeWithdrawData>>;
    /** GET /api/subscription/cancel/{subscription} */
    subscriptionCancel(subscription: number | string): Promise<ApiResponse<SubscriptionData>>;
    /** POST /api/subscription/create */
    subscriptionCreate(body?: Record<string, unknown>): Promise<ApiResponse<SubscriptionData>>;
    /**
     * GET /api/subscription/get/my-subscribers
     *
     * NOTE: this MUST come before the parameterized
     * `subscription.get/{user}` method on the wire too — the manifest lists
     * both routes against `/api/subscription/get/...`. Laravel resolves the
     * literal `my-subscribers` first; we expose them as two distinct
     * methods so callers don't have to worry about the routing precedence.
     */
    subscriptionGetMySubscribers(): Promise<ApiResponse<SubscriptionRollupData>>;
    /** GET /api/subscription/get/{user} */
    subscriptionGet(user: number | string): Promise<ApiResponse<SubscriptionData>>;
    /** GET /api/subscription/my-subscription */
    subscriptionMy(): Promise<ApiResponse<SubscriptionData>>;
    /** DELETE /api/subscription/remove/{subscription} */
    subscriptionRemove(subscription: number | string): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/subscription/subscribe/{subscription} */
    subscriptionSubscribe(subscription: number | string): Promise<ApiResponse<SubscriptionData>>;
    /** GET /api/subscription/subscribers */
    subscriptionSubscribers(): Promise<ApiResponse<SubscriptionData[]>>;
    /** GET /api/subscription/subscribes */
    subscriptionSubscribes(): Promise<ApiResponse<SubscriptionData[]>>;
    /** PATCH /api/subscription/update/{subscription} */
    subscriptionUpdate(subscription: number | string, body: Record<string, unknown>): Promise<ApiResponse<SubscriptionData>>;
    /**
     * POST /api/webhook/stripe-payment/handle
     *
     * Public endpoint. Stripe POSTs the raw event payload here. The SDK
     * MUST NOT inject the `Authorization` header, so we pass
     * `{ auth: false }` per the manifest. The endpoint is still tenant-
     * scoped (Stripe Connect events carry the tenant via the connected
     * account id), so `X-Domain` is still sent.
     */
    stripePaymentWebhook(body: StripePaymentWebhookRequest): Promise<ApiResponse<StripePaymentWebhookResponse>>;
}
//# sourceMappingURL=communications-api-client.d.ts.map