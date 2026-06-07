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
import { BaseApiClient } from '../api-client';
/** Append `/value` (URL-encoded) when value is provided; empty otherwise. */
function tail(value) {
    if (value === undefined || value === null || value === '')
        return '';
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
    async broadcastingAuth(body) {
        const params = new URLSearchParams();
        params.set('channel_name', body.channel_name);
        params.set('socket_id', body.socket_id);
        if (body.session_key !== undefined)
            params.set('session_key', body.session_key);
        return this.request('/api/broadcasting/auth', {
            method: 'POST',
            body: params,
            // Override Content-Type explicitly — defaultHeaders sets it to
            // application/json; Pusher needs urlencoded.
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }, { auth: false });
    }
    // ===========================================================================
    // Chat
    // ===========================================================================
    /** POST /api/chat/broadcast-message */
    async chatBroadcastMessage(body) {
        return this.post('/api/chat/broadcast-message', body);
    }
    /** GET /api/chat/broadcast-messages/{type}/{program?} */
    async chatBroadcastMessages(type, program) {
        return this.get(`/api/chat/broadcast-messages/${encodeURIComponent(type)}${tail(program)}`);
    }
    /** DELETE /api/chat/delete-message/{message} */
    async chatDeleteMessage(message) {
        return this.delete(`/api/chat/delete-message/${encodeURIComponent(String(message))}`);
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
    async chatDeleteChat(chat) {
        return this.delete(`/api/chat/delete-${'с'}hat/${encodeURIComponent(String(chat))}`);
    }
    /** GET /api/chat/find-user/{search} */
    async chatFindUser(search) {
        return this.get(`/api/chat/find-user/${encodeURIComponent(search)}`);
    }
    /** GET /api/chat/get-list/{search?} */
    async chatGetList(search) {
        return this.get(`/api/chat/get-list${tail(search)}`);
    }
    /** GET /api/chat/get-new-chat/{room} */
    async chatGetNewChat(room) {
        return this.get(`/api/chat/get-new-chat/${encodeURIComponent(String(room))}`);
    }
    /** POST /api/chat/get-room */
    async chatGetRoom(body) {
        return this.post('/api/chat/get-room', body);
    }
    /** GET /api/chat/get-room-by-id/{room} */
    async chatGetRoomById(room) {
        return this.get(`/api/chat/get-room-by-id/${encodeURIComponent(String(room))}`);
    }
    /** GET /api/chat/messages/{chat}/{search?} */
    async chatMessages(chat, search) {
        return this.get(`/api/chat/messages/${encodeURIComponent(String(chat))}${tail(search)}`);
    }
    /** GET /api/chat/programs */
    async chatPrograms() {
        return this.get('/api/chat/programs');
    }
    /** POST /api/chat/send-message */
    async chatSendMessage(body) {
        return this.post('/api/chat/send-message', body);
    }
    /** POST /api/chat/start */
    async chatStart(body) {
        return this.post('/api/chat/start', body);
    }
    // ===========================================================================
    // Notifications
    // ===========================================================================
    /** DELETE /api/notification/delete-notification/{notification} */
    async notificationDeleteNotification(notification) {
        return this.delete(`/api/notification/delete-notification/${encodeURIComponent(String(notification))}`);
    }
    /** GET /api/notification/get */
    async notificationGet() {
        return this.get('/api/notification/get');
    }
    /** GET /api/notification/get-unread */
    async notificationGetUnread() {
        return this.get('/api/notification/get-unread');
    }
    /** POST /api/notification/start-task */
    async notificationStartTask(body) {
        return this.post('/api/notification/start-task', body);
    }
    // ===========================================================================
    // Payment
    // ===========================================================================
    /** DELETE /api/payment/delete-payment-method/{id} */
    async paymentDeletePaymentMethod(id) {
        return this.delete(`/api/payment/delete-payment-method/${encodeURIComponent(String(id))}`);
    }
    /** GET /api/payment/get-payment-method */
    async paymentGetPaymentMethod() {
        return this.get('/api/payment/get-payment-method');
    }
    /** GET /api/payment/program-purchases (paginated) */
    async paymentProgramPurchases() {
        return this.get('/api/payment/program-purchases');
    }
    /** GET /api/payment/purchased-items */
    async paymentPurchasedItems() {
        return this.get('/api/payment/purchased-items');
    }
    /** POST /api/payment/save-payment-method */
    async paymentSavePaymentMethod(body) {
        return this.post('/api/payment/save-payment-method', body);
    }
    /** GET /api/payment/setup-payment-method */
    async paymentSetupPaymentMethod() {
        return this.get('/api/payment/setup-payment-method');
    }
    /** GET /api/payment/subscriptions (paginated) */
    async paymentSubscriptions() {
        return this.get('/api/payment/subscriptions');
    }
    // ===========================================================================
    // Stripe Connect
    // ===========================================================================
    /** GET /api/stripe/check-account */
    async stripeCheckAccount() {
        return this.get('/api/stripe/check-account');
    }
    /** GET /api/stripe/connect — returns the onboarding link payload. */
    async stripeConnect() {
        return this.get('/api/stripe/connect');
    }
    /** DELETE /api/stripe/delete-account */
    async stripeDeleteAccount() {
        return this.delete('/api/stripe/delete-account');
    }
    /** GET /api/stripe/transactions */
    async stripeTransactions() {
        return this.get('/api/stripe/transactions');
    }
    /** GET /api/stripe/withdraw */
    async stripeWithdraw() {
        return this.get('/api/stripe/withdraw');
    }
    // ===========================================================================
    // Subscriptions
    // ===========================================================================
    /** GET /api/subscription/cancel/{subscription} */
    async subscriptionCancel(subscription) {
        return this.get(`/api/subscription/cancel/${encodeURIComponent(String(subscription))}`);
    }
    /** POST /api/subscription/create */
    async subscriptionCreate(body) {
        return this.post('/api/subscription/create', body ?? {});
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
    async subscriptionGetMySubscribers() {
        return this.get('/api/subscription/get/my-subscribers');
    }
    /** GET /api/subscription/get/{user} */
    async subscriptionGet(user) {
        return this.get(`/api/subscription/get/${encodeURIComponent(String(user))}`);
    }
    /** GET /api/subscription/my-subscription */
    async subscriptionMy() {
        return this.get('/api/subscription/my-subscription');
    }
    /** DELETE /api/subscription/remove/{subscription} */
    async subscriptionRemove(subscription) {
        return this.delete(`/api/subscription/remove/${encodeURIComponent(String(subscription))}`);
    }
    /** GET /api/subscription/subscribe/{subscription} */
    async subscriptionSubscribe(subscription) {
        return this.get(`/api/subscription/subscribe/${encodeURIComponent(String(subscription))}`);
    }
    /** GET /api/subscription/subscribers */
    async subscriptionSubscribers() {
        return this.get('/api/subscription/subscribers');
    }
    /** GET /api/subscription/subscribes */
    async subscriptionSubscribes() {
        return this.get('/api/subscription/subscribes');
    }
    /** PATCH /api/subscription/update/{subscription} */
    async subscriptionUpdate(subscription, body) {
        return this.patch(`/api/subscription/update/${encodeURIComponent(String(subscription))}`, body);
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
    async stripePaymentWebhook(body) {
        return this.post('/api/webhook/stripe-payment/handle', body, { auth: false });
    }
}
//# sourceMappingURL=communications-api-client.js.map