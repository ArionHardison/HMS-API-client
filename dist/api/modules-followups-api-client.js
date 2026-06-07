"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowUpsModuleApiClient = void 0;
/**
 * `Modules/FollowUps` API client.
 *
 * Covers the 15 endpoints documented in `sdk/spec/endpoints.json` with
 * `module === "Modules/FollowUps"`:
 *
 *   - 5 follow-up resource endpoints (`follow-up.{index,store,show,update,destroy}`)
 *   - 8 read-side execution endpoints under `/api/follow-up/*`:
 *     `finish/{id}`, `get-current-followup`, `get-data/{chain}`,
 *     `get-timeline/{chain}`, `handle-recommendation/{recommendation}/{status}`,
 *     `payment/{followup}`, `recommendations/{followup}`, `run/{chain}`
 *   - 2 voice-recording endpoints — `voice-finalize` (JSON) and
 *     `voice-record` (multipart!)
 *
 * Naming policy: SDK methods are camelCase versions of the spec id minus the
 * redundant `follow-up.` prefix; bare `*.show/destroy/update` for the
 * resource keep a `FollowUp` suffix to avoid ambiguity with the execution
 * surface.
 *
 * Multipart: `voiceRecord` accepts `VoiceRecordInput.voice` as a `Blob`/`File`
 * — `BaseApiClient.serializeBody` detects the binary and switches the
 * request to `multipart/form-data`, mapping the rest of the payload through
 * Laravel's bracket-notation FormData encoder.
 *
 * Manifest oddity: `handle-recommendation/{recommendation}/{status}` is a
 * GET that mutates state (status transitions for a recommendation). The
 * upstream form-request layer accepts arbitrary status strings — the SDK
 * passes them through verbatim and types `status: string` to match.
 *
 * Class is named `FollowUpsModuleApiClient` to coexist with the legacy
 * `FollowUpsApiClient` in `hms-api-client.ts`.
 */
const api_client_1 = require("../api-client");
/**
 * Public client over `/api/follow-up*`. Subclasses `BaseApiClient` so it
 * inherits auth / `X-Domain` / Laravel `_method` override / multipart
 * serialization / `ApiError` normalization.
 */
class FollowUpsModuleApiClient extends api_client_1.BaseApiClient {
    // ---------------------------------------------------------------------------
    // follow-up resource
    // ---------------------------------------------------------------------------
    /** GET `/api/follow-up`. (`follow-up.index`) */
    listFollowUps(opts) {
        return this.get('/api/follow-up', undefined, opts);
    }
    /** POST `/api/follow-up`. (`follow-up.store`) */
    createFollowUp(body, opts) {
        return this.post('/api/follow-up', body, opts);
    }
    /** GET `/api/follow-up/{follow_up}`. (`follow-up.show`) */
    showFollowUp(followUp, opts) {
        return this.get(`/api/follow-up/${encodeURIComponent(String(followUp))}`, undefined, opts);
    }
    /** PUT `/api/follow-up/{follow_up}`. (`follow-up.update`) */
    updateFollowUp(followUp, body, opts) {
        return this.put(`/api/follow-up/${encodeURIComponent(String(followUp))}`, body, opts);
    }
    /** DELETE `/api/follow-up/{follow_up}`. (`follow-up.destroy`) */
    destroyFollowUp(followUp, opts) {
        return this.delete(`/api/follow-up/${encodeURIComponent(String(followUp))}`, opts);
    }
    // ---------------------------------------------------------------------------
    // execution surface (GET-driven, mostly read-side)
    // ---------------------------------------------------------------------------
    /** GET `/api/follow-up/finish/{id}`. (`get.api.follow-up.finish.item`) */
    finishFollowUp(id, opts) {
        return this.get(`/api/follow-up/finish/${encodeURIComponent(String(id))}`, undefined, opts);
    }
    /** GET `/api/follow-up/get-current-followup`. (`get.api.follow-up.get-current-followup`) */
    getCurrentFollowUp(opts) {
        return this.get('/api/follow-up/get-current-followup', undefined, opts);
    }
    /** GET `/api/follow-up/get-data/{chain}`. (`get.api.follow-up.get-data.item`) */
    getFollowUpData(chain, opts) {
        return this.get(`/api/follow-up/get-data/${encodeURIComponent(String(chain))}`, undefined, opts);
    }
    /** GET `/api/follow-up/get-timeline/{chain}`. (`get.api.follow-up.get-timeline.item`) */
    getFollowUpTimeline(chain, opts) {
        return this.get(`/api/follow-up/get-timeline/${encodeURIComponent(String(chain))}`, undefined, opts);
    }
    /** GET `/api/follow-up/handle-recommendation/{recommendation}/{status}`. */
    handleRecommendation(recommendation, status, opts) {
        return this.get(`/api/follow-up/handle-recommendation/${encodeURIComponent(String(recommendation))}/${encodeURIComponent(status)}`, undefined, opts);
    }
    /** GET `/api/follow-up/payment/{followup}`. (`get.api.follow-up.payment.item`) */
    followUpPayment(followup, opts) {
        return this.get(`/api/follow-up/payment/${encodeURIComponent(String(followup))}`, undefined, opts);
    }
    /** GET `/api/follow-up/recommendations/{followup}`. (`get.api.follow-up.recommendations.item`) */
    followUpRecommendations(followup, opts) {
        return this.get(`/api/follow-up/recommendations/${encodeURIComponent(String(followup))}`, undefined, opts);
    }
    /** GET `/api/follow-up/run/{chain}`. (`get.api.follow-up.run.item`) */
    runFollowUp(chain, opts) {
        return this.get(`/api/follow-up/run/${encodeURIComponent(String(chain))}`, undefined, opts);
    }
    // ---------------------------------------------------------------------------
    // voice recording
    // ---------------------------------------------------------------------------
    /** POST `/api/follow-up/voice-finalize`. (`post.api.follow-up.voice-finalize`) */
    voiceFinalize(body, opts) {
        return this.post('/api/follow-up/voice-finalize', body, opts);
    }
    /**
     * POST `/api/follow-up/voice-record` — multipart upload.
     *
     * `BaseApiClient.serializeBody` detects the `Blob`/`File` and switches the
     * request to `multipart/form-data`. Upstream rules: `voice` is required
     * (wav, max 1000kb), `chain_id` and `speech_id` are required strings,
     * `follow_up_id` is optional.
     */
    voiceRecord(body, opts) {
        return this.post('/api/follow-up/voice-record', body, opts);
    }
}
exports.FollowUpsModuleApiClient = FollowUpsModuleApiClient;
//# sourceMappingURL=modules-followups-api-client.js.map