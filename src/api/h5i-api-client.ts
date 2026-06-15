/**
 * H5iApiClient — covers the H5i (i5h) messaging-protocol module
 * (`Modules/H5i/Routes/api.php`).
 *
 * Route inventory (source of truth = the api route file + each controller's
 * FormRequest / `validate()`, NOT guessed):
 *
 *   POST   /api/h5i/msg                              store         (auth:sanctum)
 *   GET    /api/h5i/msg/inbox                         inbox         (auth:sanctum)
 *   GET    /api/h5i/msg/channel/{channel}             channel       (auth:sanctum)
 *   GET    /api/h5i/msg/{id}                          show          (auth:sanctum)
 *   POST   /api/h5i/dev/seed-demo/{guid}              seedDemo      (auth:sanctum, SuperAdmin)
 *   GET    /api/h5i/deals/{guid}/public-messages      publicMessages (anonymous)
 *   POST   /api/broadcasting/public-auth              publicBroadcastAuth (anonymous)
 *
 * Unlike the standard `{success, message, data}` envelope endpoints, the H5i
 * controllers return bespoke top-level bodies (e.g. `{message, newly_created}`,
 * `{messages, channel}`). The method return types are `ApiResponse<TBody>`
 * where `TBody` is the full controller body; consumers read those fields off
 * the resolved value directly.
 *
 * `BaseApiClient` already handles, per the contract suite:
 *   - `Authorization: Bearer` injection (skipped per call via `{ auth: false }`)
 *   - `X-Domain` header from `getDomain`
 *   - 401 / 422 → callback + `ApiError`
 *
 * The two anonymous endpoints (`publicMessages`, `publicBroadcastAuth`) are
 * called with `{ auth: false }` so no Bearer token leaks onto them. `store`
 * returns 201 on first-write and 200 on a dedupe; both are inside the default
 * 2xx success range.
 */

import { BaseApiClient, type ApiRequestOptions, type ApiResponse } from '../api-client';
import type {
  H5iChannelResponse,
  H5iMessage,
  H5iMessageKind,
  H5iMessagePriority,
  H5iPublicBroadcastAuthRequest,
  H5iPublicBroadcastAuthResponse,
  H5iPublicMessagesResponse,
  H5iSeedDemoResponse,
  H5iShowMessageResponse,
  InboxH5iMessageQuery,
  InboxH5iMessageResponse,
  StoreH5iMessageRequest,
  StoreH5iMessageResponse,
} from '../types/h5i';

// Re-export the slice's types so consumers can import them from one place.
export type {
  H5iChannelResponse,
  H5iMessage,
  H5iMessageKind,
  H5iMessagePriority,
  H5iPublicBroadcastAuthRequest,
  H5iPublicBroadcastAuthResponse,
  H5iPublicMessagesResponse,
  H5iSeedDemoResponse,
  H5iShowMessageResponse,
  InboxH5iMessageQuery,
  InboxH5iMessageResponse,
  StoreH5iMessageRequest,
  StoreH5iMessageResponse,
};

export class H5iApiClient extends BaseApiClient {
  /**
   * POST /api/h5i/msg — send a new i5h message.
   *
   * The broker dedupes on the optional client `id`: 201 on first-write,
   * 200 on a replay (both surface `newly_created`). The `meta.kind_*`
   * render hints are `prohibited` server-side — the broker stamps them.
   */
  async sendMessage(
    body: StoreH5iMessageRequest,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<StoreH5iMessageResponse>> {
    return this.post<StoreH5iMessageResponse>('/api/h5i/msg', body, opts);
  }

  /**
   * GET /api/h5i/msg/inbox — pull unread messages for an agent on a channel.
   * `agent` + `channel` are required query params; `limit` (1..500) optional.
   */
  async getInbox(
    query: InboxH5iMessageQuery,
  ): Promise<ApiResponse<InboxH5iMessageResponse>> {
    const params: Record<string, string | number> = {
      agent: query.agent,
      channel: query.channel,
    };
    if (query.limit !== undefined) {
      params.limit = query.limit;
    }
    return this.get<InboxH5iMessageResponse>('/api/h5i/msg/inbox', params);
  }

  /**
   * GET /api/h5i/msg/channel/{channel} — full channel history.
   * `limit` (1..500) is clamped server-side (default 100).
   */
  async getChannel(
    channel: string,
    limit?: number,
  ): Promise<ApiResponse<H5iChannelResponse>> {
    const params = limit === undefined ? undefined : { limit };
    return this.get<H5iChannelResponse>(
      `/api/h5i/msg/channel/${encodeURIComponent(channel)}`,
      params,
    );
  }

  /** GET /api/h5i/msg/{id} — fetch one message by its 16-hex id. */
  async getMessage(id: string): Promise<ApiResponse<H5iShowMessageResponse>> {
    return this.get<H5iShowMessageResponse>(
      `/api/h5i/msg/${encodeURIComponent(id)}`,
    );
  }

  /**
   * POST /api/h5i/dev/seed-demo/{guid} — DEV/QA helper (SuperAdmin only,
   * throttled 6/min). Publishes the deal channel + emits 4 demo messages.
   * `guid` is a strict UUID v4.
   */
  async seedDemo(
    guid: string,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<H5iSeedDemoResponse>> {
    return this.post<H5iSeedDemoResponse>(
      `/api/h5i/dev/seed-demo/${encodeURIComponent(guid)}`,
      undefined,
      opts,
    );
  }

  /**
   * GET /api/h5i/deals/{guid}/public-messages — anonymous redacted history
   * for a published deal. The gate is an active PublicDealChannel row keyed
   * by the request HOSTNAME, NOT a Bearer token — sent with `{ auth: false }`.
   * `guid` is a strict UUID v4.
   */
  async getPublicMessages(
    guid: string,
    limit?: number,
  ): Promise<ApiResponse<H5iPublicMessagesResponse>> {
    const params = limit === undefined ? undefined : { limit };
    return this.get<H5iPublicMessagesResponse>(
      `/api/h5i/deals/${encodeURIComponent(guid)}/public-messages`,
      params,
      { auth: false },
    );
  }

  /**
   * POST /api/broadcasting/public-auth — anonymous Pusher auth for the
   * `public-deal-{hash}` channel family. All denial paths collapse to a
   * uniform 403 `{error:'forbidden'}`. Sent with `{ auth: false }`.
   */
  async publicBroadcastAuth(
    body: H5iPublicBroadcastAuthRequest,
  ): Promise<ApiResponse<H5iPublicBroadcastAuthResponse>> {
    return this.post<H5iPublicBroadcastAuthResponse>(
      '/api/broadcasting/public-auth',
      body,
      { auth: false },
    );
  }
}
