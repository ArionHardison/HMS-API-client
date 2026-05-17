/**
 * `Modules/Intake` API client — guest + authenticated intake-session
 * lifecycle. Mounted on the backend under `/api/v1/intake/*`
 * (`Modules/Intake/Routes/api.php`).
 *
 * Auth model:
 *   - `start()` and `exchange()` are public (no Bearer required). The
 *     bearer returned by `start()` and the handoff token passed to
 *     `exchange()` are the credentials, respectively.
 *   - Everything else under `/{intake}/*` requires `auth:api`; the
 *     bearer must carry an `intake:{id}` ability that the upstream
 *     controller verifies.
 *
 * Idempotency: every write endpoint runs through the `idempotency`
 * middleware on the backend. Callers retrying on a network blip should
 * send the same `Idempotency-Key` header (consumers manage this header
 * themselves; `BaseApiClient` does not auto-generate one).
 *
 * Rate limits:
 *   - `start` — 5/min
 *   - `exchange` — 10/min
 *   - `voiceRecord` — 60/min
 *   - `voiceFinalize` — 2/min
 *
 * 11 endpoints catalog-wide; 8 are exposed here. The 3 callable from
 * either platform (mobile or web) live on the same surface as
 * server-side CI-WWW callers, so no consumer-side gating is needed.
 */

import { BaseApiClient } from '../api-client';
import type { ApiRequestOptions, ApiResponse } from '../api-client';

/** Open-shape payload for intake responses — server contract is still maturing. */
export interface IntakeResponse {
  [key: string]: unknown;
}

/** Response from `POST /api/v1/intake/start` — guest user + intake session. */
export interface IntakeStartResponse {
  /** Bearer token scoped to this intake's `{id}` ability. */
  token?: string;
  /** Newly-created intake ID, embedded in subsequent `/{intake}/*` paths. */
  intake_id?: number | string;
  [key: string]: unknown;
}

/** Response from `POST /api/v1/intake/handoff/{token}/exchange`. */
export interface IntakeExchangeResponse {
  /** Upgraded bearer (full user-bearer) when intake is complete. */
  token?: string;
  /** True once the intake has been linked to a real user. */
  complete?: boolean;
  [key: string]: unknown;
}

/** Body for `POST /api/v1/intake/{intake}/answers` — open shape. */
export interface IntakeAnswersBody {
  [key: string]: unknown;
}

/** Body for `POST /api/v1/intake/{intake}/audience` — open shape. */
export interface IntakeAudienceBody {
  [key: string]: unknown;
}

/** Body for `POST /api/v1/intake/{intake}/handoff` — open shape. */
export interface IntakeHandoffBody {
  [key: string]: unknown;
}

/** Body for `POST /api/v1/intake/start` — open shape. */
export interface IntakeStartBody {
  [key: string]: unknown;
}

/**
 * Public client over `/api/v1/intake/*`. Subclasses `BaseApiClient` for
 * token / domain handling. Public endpoints opt out of Bearer injection
 * via `{ auth: false }`.
 */
export class IntakeModuleApiClient extends BaseApiClient {
  // ---------------------------------------------------------------------------
  // Public / guest endpoints
  // ---------------------------------------------------------------------------

  /**
   * POST `/api/v1/intake/start` — kick off a guest intake session.
   * Creates a guest user + intake row and returns a bearer scoped to
   * the new intake's `{id}` ability. Public — no Bearer required.
   * Rate-limited 5/min upstream.
   */
  start(
    body: IntakeStartBody = {},
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<IntakeStartResponse>> {
    return this.post<IntakeStartResponse>(
      '/api/v1/intake/start',
      body,
      { auth: false, ...(opts ?? {}) },
    );
  }

  /**
   * POST `/api/v1/intake/handoff/{token}/exchange` — exchange a handoff
   * token for a full user-bearer once the intake is complete. Public —
   * the handoff token IS the credential. Rate-limited 10/min upstream.
   */
  exchange(
    token: string,
    body: Record<string, unknown> = {},
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<IntakeExchangeResponse>> {
    const t = encodeURIComponent(token);
    return this.post<IntakeExchangeResponse>(
      `/api/v1/intake/handoff/${t}/exchange`,
      body,
      { auth: false, ...(opts ?? {}) },
    );
  }

  // ---------------------------------------------------------------------------
  // Authenticated endpoints (Bearer with intake:{id} ability)
  // ---------------------------------------------------------------------------

  /**
   * POST `/api/v1/intake/{intake}/voice-record` — upload a voice chunk.
   * Bearer required. Rate-limited 60/min upstream. Callers should send
   * an Idempotency-Key header to make retries safe across network
   * blips. Body shape is open — FormData / File payloads are picked up
   * automatically by `BaseApiClient` via the `hasBinary` check.
   */
  voiceRecord(
    intake: number | string,
    body: Record<string, unknown> | FormData,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<IntakeResponse>> {
    const id = encodeURIComponent(String(intake));
    return this.post<IntakeResponse>(
      `/api/v1/intake/${id}/voice-record`,
      body,
      opts,
    );
  }

  /**
   * POST `/api/v1/intake/{intake}/voice-finalize` — finalize the
   * speech-to-text pipeline for an intake. Bearer required. Heavily
   * rate-limited (2/min) upstream so this is a one-shot call after
   * recording is done.
   */
  voiceFinalize(
    intake: number | string,
    body: Record<string, unknown> = {},
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<IntakeResponse>> {
    const id = encodeURIComponent(String(intake));
    return this.post<IntakeResponse>(
      `/api/v1/intake/${id}/voice-finalize`,
      body,
      opts,
    );
  }

  /**
   * POST `/api/v1/intake/{intake}/answers` — submit structured answers
   * for the current intake. Bearer required.
   */
  submitAnswers(
    intake: number | string,
    body: IntakeAnswersBody,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<IntakeResponse>> {
    const id = encodeURIComponent(String(intake));
    return this.post<IntakeResponse>(`/api/v1/intake/${id}/answers`, body, opts);
  }

  /**
   * POST `/api/v1/intake/{intake}/audience` — set the audience for the
   * intake (which subproject / role tier the intake targets). Bearer
   * required.
   */
  setAudience(
    intake: number | string,
    body: IntakeAudienceBody,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<IntakeResponse>> {
    const id = encodeURIComponent(String(intake));
    return this.post<IntakeResponse>(`/api/v1/intake/${id}/audience`, body, opts);
  }

  /**
   * POST `/api/v1/intake/{intake}/handoff` — initiate the handoff
   * flow: the controller mints a handoff token (returned in the
   * response) which the consumer then exchanges via `exchange()` from
   * a public context to upgrade to a full user-bearer.
   */
  initiateHandoff(
    intake: number | string,
    body: IntakeHandoffBody = {},
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<IntakeResponse>> {
    const id = encodeURIComponent(String(intake));
    return this.post<IntakeResponse>(`/api/v1/intake/${id}/handoff`, body, opts);
  }

  /**
   * GET `/api/v1/intake/{intake}/status` — current intake progress /
   * completion state. Bearer required. Suitable for polling.
   */
  getStatus(
    intake: number | string,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<IntakeResponse>> {
    const id = encodeURIComponent(String(intake));
    return this.get<IntakeResponse>(`/api/v1/intake/${id}/status`, undefined, opts);
  }
}
