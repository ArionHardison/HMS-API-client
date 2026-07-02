/**
 * Types for `H5iApiClient` — the H5i (i5h) messaging-protocol module.
 *
 * Source of truth: `Modules/H5i/Routes/api.php`, the two FormRequests
 * (`StoreH5iMessageRequest`, `InboxH5iMessageRequest`), and
 * `H5iMessage::toWireFormat()`. The controller responses do NOT use the
 * `{success, message, data}` envelope — they return bespoke top-level
 * shapes, so the client types `ApiResponse<T>` where `T` is the full
 * controller body.
 */
/**
 * One i5h message in wire format (`H5iMessage::toWireFormat()`). The first
 * eight keys are always present; the remaining keys are only included when
 * non-empty on the row, so they are all optional here.
 */
export interface H5iMessage {
    id: string;
    ts: string;
    from: string;
    to: string;
    body: string;
    version: number;
    channel: string;
    kind?: string;
    tag?: string;
    reply_to?: string;
    thread_id?: string;
    priority?: string;
    status?: string;
    branch?: string;
    context_branch?: string;
    risk?: string;
    deadline?: string;
    /** Free-form server-assembled arrays/maps; typed loosely on purpose. */
    focus?: string[];
    links?: unknown[];
    meta?: Record<string, unknown>;
}
/** Canonical i5h message kinds (StoreH5iMessageRequest `kind` rule). */
export type H5iMessageKind = 'FYI' | 'ASK' | 'REVIEW_REQUEST' | 'RISK' | 'BLOCKED' | 'HANDOFF' | 'ACK' | 'DONE' | 'DECLINE' | 'FAILURE' | 'NOT_UNDERSTOOD';
/** i5h message priority (StoreH5iMessageRequest `priority` rule). */
export type H5iMessagePriority = 'low' | 'normal' | 'high' | 'urgent';
/**
 * Body for `POST /api/h5i/msg`. Only `from`, `to`, `body`, `channel` are
 * required; everything else is optional. The `meta.kind_label`,
 * `meta.kind_icon`, `meta.kind_verb` keys are `prohibited` server-side —
 * the broker stamps them — so callers must not supply them.
 */
export interface StoreH5iMessageRequest {
    from: string;
    to: string;
    body: string;
    channel: string;
    id?: string;
    ts?: string;
    version?: number;
    kind?: H5iMessageKind;
    tag?: string;
    reply_to?: string;
    thread_id?: string;
    priority?: H5iMessagePriority;
    status?: string;
    branch?: string;
    context_branch?: string;
    focus?: string[];
    risk?: string;
    deadline?: string;
    links?: unknown[];
    meta?: Record<string, unknown>;
    /** Helper field stripped by the controller; never lands on the row. */
    nonce?: string;
}
/** Response body for `POST /api/h5i/msg`. */
export interface StoreH5iMessageResponse {
    message: H5iMessage;
    newly_created: boolean;
}
/** Query for `GET /api/h5i/msg/inbox` (InboxH5iMessageRequest). */
export interface InboxH5iMessageQuery {
    agent: string;
    channel: string;
    /** 1..500, default 100. */
    limit?: number;
}
/** Response body for `GET /api/h5i/msg/inbox`. */
export interface InboxH5iMessageResponse {
    messages: H5iMessage[];
    agent: string;
    channel: string;
}
/** Response body for `GET /api/h5i/msg/channel/{channel}`. */
export interface H5iChannelResponse {
    messages: H5iMessage[];
    channel: string;
}
/** Response body for `GET /api/h5i/msg/{id}`. */
export interface H5iShowMessageResponse {
    message: H5iMessage;
}
/** Response body for `GET /api/h5i/deals/{guid}/public-messages` (anonymous). */
export interface H5iPublicMessagesResponse {
    /** Each message has been run through PublicMessageRedactor. */
    messages: Array<Record<string, unknown>>;
    channel: string;
    deal_guid: string;
}
/** Body for `POST /api/broadcasting/public-auth` (anonymous Pusher auth). */
export interface H5iPublicBroadcastAuthRequest {
    channel_name: string;
    socket_id: string;
}
/** Success body for `POST /api/broadcasting/public-auth`. */
export interface H5iPublicBroadcastAuthResponse {
    auth: string;
}
/** Response body for `POST /api/h5i/dev/seed-demo/{guid}` (SuperAdmin-only). */
export interface H5iSeedDemoResponse {
    deal_guid: string;
    public_channel: {
        id: number;
        deal_guid_hash: string;
        publish_state: string;
    };
    messages: Array<{
        id: string;
        kind: string;
        body: string;
    }>;
}
//# sourceMappingURL=h5i.d.ts.map