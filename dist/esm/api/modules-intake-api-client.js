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
    start(body = {}, opts) {
        return this.post('/api/v1/intake/start', body, { auth: false, ...(opts ?? {}) });
    }
    /**
     * POST `/api/v1/intake/handoff/{token}/exchange` — exchange a handoff
     * token for a full user-bearer once the intake is complete. Public —
     * the handoff token IS the credential. Rate-limited 10/min upstream.
     */
    exchange(token, body = {}, opts) {
        const t = encodeURIComponent(token);
        return this.post(`/api/v1/intake/handoff/${t}/exchange`, body, { auth: false, ...(opts ?? {}) });
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
    voiceRecord(intake, body, opts) {
        const id = encodeURIComponent(String(intake));
        return this.post(`/api/v1/intake/${id}/voice-record`, body, opts);
    }
    /**
     * POST `/api/v1/intake/{intake}/voice-finalize` — finalize the
     * speech-to-text pipeline for an intake. Bearer required. Heavily
     * rate-limited (2/min) upstream so this is a one-shot call after
     * recording is done.
     */
    voiceFinalize(intake, body = {}, opts) {
        const id = encodeURIComponent(String(intake));
        return this.post(`/api/v1/intake/${id}/voice-finalize`, body, opts);
    }
    /**
     * POST `/api/v1/intake/{intake}/answers` — submit structured answers
     * for the current intake. Bearer required.
     */
    submitAnswers(intake, body, opts) {
        const id = encodeURIComponent(String(intake));
        return this.post(`/api/v1/intake/${id}/answers`, body, opts);
    }
    /**
     * POST `/api/v1/intake/{intake}/audience` — set the audience for the
     * intake (which subproject / role tier the intake targets). Bearer
     * required.
     */
    setAudience(intake, body, opts) {
        const id = encodeURIComponent(String(intake));
        return this.post(`/api/v1/intake/${id}/audience`, body, opts);
    }
    /**
     * POST `/api/v1/intake/{intake}/handoff` — initiate the handoff
     * flow: the controller mints a handoff token (returned in the
     * response) which the consumer then exchanges via `exchange()` from
     * a public context to upgrade to a full user-bearer.
     */
    initiateHandoff(intake, body = {}, opts) {
        const id = encodeURIComponent(String(intake));
        return this.post(`/api/v1/intake/${id}/handoff`, body, opts);
    }
    /**
     * GET `/api/v1/intake/{intake}/status` — current intake progress /
     * completion state. Bearer required. Suitable for polling.
     */
    getStatus(intake, opts) {
        const id = encodeURIComponent(String(intake));
        return this.get(`/api/v1/intake/${id}/status`, undefined, opts);
    }
}
//# sourceMappingURL=modules-intake-api-client.js.map