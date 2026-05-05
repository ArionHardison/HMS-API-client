/**
 * Chat + Notifications + Stripe / Payments + Subscriptions + Broadcasting slice
 * — request / response types.
 *
 * Source of truth: `sdk/spec/endpoints.json`. Each interface mirrors the
 * `request.shape` or `response.shape` of a single endpoint. `unknown` is
 * used verbatim for fields the manifest could not concretize (Laravel
 * Resource `parent::toArray($request)` calls, dynamic Stripe payloads,
 * etc.) — narrow at the call site.
 *
 * Structural interfaces only — no branded type aliases. The four frontends
 * (sys, gov, app, CI-WWW) re-declare input shapes structurally; we keep the
 * shapes plain so they line up.
 */

// =============================================================================
// Common building blocks
// =============================================================================

/** Sentinel for "no payload" / Laravel `204` / `{ success: true }` returns. */
export type EmptyOk = Record<string, unknown> | null;

/**
 * The shared `wrapper: "paginated"` shape: a Laravel Resource Collection
 * envelope where `data` itself is `{ items, meta?, links? }`. Other slices
 * may flesh out `meta` / `links` — kept loose here so this file stays
 * independent.
 */
export interface PaginatedPayload<T> {
  items: T[];
  meta?: unknown;
  links?: unknown;
}

// =============================================================================
// Broadcasting (Pusher channel auth)
// =============================================================================

/**
 * `POST /api/broadcasting/auth` — Laravel/Pusher private-channel auth.
 * The Echo client posts these as form fields (URL-encoded). `session_key`
 * is the P2X-specific guest channel token.
 */
export interface BroadcastingAuthRequest {
  channel_name: string;
  socket_id: string;
  session_key?: string;
}

/**
 * Pusher returns `{ auth: "<key:signature>", channel_data?: "<json>" }`.
 * This endpoint is `wrapper: "raw"` per the manifest (no `success`/`data`
 * envelope) — see `BroadcastingApiClient.broadcastingAuth` notes.
 */
export interface BroadcastingAuthResponse {
  auth: string;
  channel_data?: string;
}

// =============================================================================
// Chat
// =============================================================================

/** `BroadcastMessageRequest` — `to`, optional `program`, message + attachments. */
export interface ChatBroadcastMessageRequest {
  to: string;
  program?: number | string;
  message?: string;
  attachments?: unknown[];
}

/** `SendMessageRequest` — single-room send. */
export interface ChatSendMessageRequest {
  to: number;
  message?: string;
  attachments?: ChatSendMessageAttachment[];
}

/** Attachment shape per the validation rules. */
export interface ChatSendMessageAttachment {
  id?: number;
  type?: string;
  attachment?: string;
}

/** `GetChatByUserIdRequest` — find/start a 1:1 room with a participant. */
export interface ChatGetRoomRequest {
  participant: number;
}

/** `StartSpecialChatRequest` — start a contextual / program-pinned chat. */
export interface ChatStartRequest {
  program?: number;
  type: string;
}

/** Generic chat-room shape (Resource is `parent::toArray`). */
export interface ChatRoomData {
  id: number;
  [k: string]: unknown;
}

/** Chat message shape (Resource is `parent::toArray`). */
export interface ChatMessageData {
  id: number;
  [k: string]: unknown;
}

// =============================================================================
// Notifications
// =============================================================================

export interface NotificationData {
  id: number;
  [k: string]: unknown;
}

/** `StartNotificationActionRequest` — fire the action attached to a notification. */
export interface NotificationStartTaskRequest {
  id: number;
}

// =============================================================================
// Stripe Connect
// =============================================================================

/** Generic Stripe Connect status payload (Resource is dynamic). */
export interface StripeAccountStatusData {
  [k: string]: unknown;
}

/** Connect onboarding link payload. */
export interface StripeConnectData {
  url?: string;
  [k: string]: unknown;
}

/** Withdraw link / payout payload. */
export interface StripeWithdrawData {
  [k: string]: unknown;
}

/** Stripe transactions list payload (single Resource — not paginated). */
export interface StripeTransactionsData {
  [k: string]: unknown;
}

// =============================================================================
// Subscriptions
// =============================================================================

/** Subscription record (Resource is dynamic). */
export interface SubscriptionData {
  id: number;
  [k: string]: unknown;
}

/** "Who I am subscribed to / who is subscribed to me" rollups. */
export interface SubscriptionRollupData {
  [k: string]: unknown;
}

// =============================================================================
// Payments
// =============================================================================

export interface PaymentMethodData {
  id: string;
  [k: string]: unknown;
}

export interface PaymentMethodSaveRequest {
  payment_method: string;
  client_secret: string;
}

export interface PurchasedItemData {
  id: number;
  [k: string]: unknown;
}

export interface ProgramPurchaseData {
  id: number;
  [k: string]: unknown;
}

export interface SubscriptionListItem {
  id: number;
  [k: string]: unknown;
}

export interface SetupPaymentMethodData {
  client_secret?: string;
  [k: string]: unknown;
}

// =============================================================================
// Stripe webhook
// =============================================================================

/**
 * `POST /api/webhook/stripe-payment/handle` — public, unauthenticated.
 * The body is the raw Stripe event payload; the SDK does not narrow it
 * because every consumer may forward a different event family.
 */
export type StripePaymentWebhookRequest = Record<string, unknown>;

export type StripePaymentWebhookResponse = Record<string, unknown>;
