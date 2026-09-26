/**
 * `Modules/KPI` API client.
 *
 * Covers the 13 endpoints from `sdk/spec/endpoints.json` with
 * `module === "Modules/KPI"`:
 *
 *   - 4 KPI rule / settings endpoints (get-setup, save, save-setup,
 *     remove-rule)
 *   - 1 KPI scheduler snapshot (get) + 1 round-results write
 *     (save-round-results) + 1 parameter validator (validate-parameters)
 *   - 2 onboarding endpoints (get / save) — the controller lives in
 *     Modules/KPI even though the URL is `/api/onboarding/*`
 *   - 1 device listing (`/api/user-devices/list`)
 *   - 3 Withings integration endpoints (auth, callback, webhook)
 *
 * Naming policy: methods derive from `spec.id` minus the noisy
 * `get.api.kpi.` / `post.api.kpi.` prefixes, then camelCased. Class is
 * `KPIModuleApiClient` (not `KPIApiClient` — that's the older axios-based
 * class in `hms-api-client.ts` which we coexist with).
 */
import { BaseApiClient } from '../api-client';
/**
 * Public client over `/api/kpi/*`, `/api/onboarding/*`,
 * `/api/user-devices/list`, and `/api/withings/*`. Subclasses
 * `BaseApiClient` for token / domain / `_method` handling.
 */
export class KPIModuleApiClient extends BaseApiClient {
    // ---------------------------------------------------------------------------
    // KPI core
    // ---------------------------------------------------------------------------
    /** GET `/api/kpi/get-setup/{chain}/{protocol}`. (`get.api.kpi.get-setup.item.item`) */
    getSetup(chain, protocol, opts) {
        const c = encodeURIComponent(String(chain));
        const p = encodeURIComponent(String(protocol));
        return this.get(`/api/kpi/get-setup/${c}/${p}`, undefined, opts);
    }
    /**
     * GET `/api/kpi/get/{chain}`. (`get.api.kpi.get.item`)
     *
     * Named `getTasks` rather than `get` because the latter would shadow the
     * inherited `BaseApiClient.get()` verb wrapper and break every other
     * method on this class.
     */
    getTasks(chain, opts) {
        const c = encodeURIComponent(String(chain));
        return this.get(`/api/kpi/get/${c}`, undefined, opts);
    }
    /** DELETE `/api/kpi/remove-rule/{rule}`. (`delete.api.kpi.remove-rule.item`) */
    removeRule(rule, opts) {
        const r = encodeURIComponent(String(rule));
        return this.delete(`/api/kpi/remove-rule/${r}`, opts);
    }
    /** POST `/api/kpi/save`. (`post.api.kpi.save`) */
    save(body, opts) {
        return this.post('/api/kpi/save', body, opts);
    }
    /** POST `/api/kpi/save-round-results`. (`post.api.kpi.save-round-results`) */
    saveRoundResults(body, opts) {
        return this.post('/api/kpi/save-round-results', body, opts);
    }
    /** POST `/api/kpi/save-setup`. (`post.api.kpi.save-setup`) */
    saveSetup(body, opts) {
        return this.post('/api/kpi/save-setup', body, opts);
    }
    /** POST `/api/kpi/validate-parameters`. (`post.api.kpi.validate-parameters`) */
    validateParameters(body, opts) {
        return this.post('/api/kpi/validate-parameters', body, opts);
    }
    // ---------------------------------------------------------------------------
    // Onboarding (controllers live in Modules/KPI even though the path differs)
    // ---------------------------------------------------------------------------
    /** GET `/api/onboarding/get/{protocol}`. (`get.api.onboarding.get.item`) */
    getOnboarding(protocol, opts) {
        const p = encodeURIComponent(String(protocol));
        return this.get(`/api/onboarding/get/${p}`, undefined, opts);
    }
    /** POST `/api/onboarding/save/{protocol}`. (`post.api.onboarding.save.item`) */
    saveOnboarding(protocol, body, opts) {
        const p = encodeURIComponent(String(protocol));
        return this.post(`/api/onboarding/save/${p}`, body, opts);
    }
    // ---------------------------------------------------------------------------
    // Device listing
    // ---------------------------------------------------------------------------
    /** GET `/api/user-devices/list`. (`get.api.user-devices.list`) */
    listUserDevices(opts) {
        return this.get('/api/user-devices/list', undefined, opts);
    }
    // ---------------------------------------------------------------------------
    // Withings
    // ---------------------------------------------------------------------------
    /** GET `/api/withings/auth`. (`get.api.withings.auth`) */
    withingsAuth(opts) {
        return this.get('/api/withings/auth', undefined, opts);
    }
    /**
     * GET `/api/withings/callback`. (`get.api.withings.callback`)
     *
     * Withings' OAuth dance lands here with `code` + `state` query params; we
     * forward them via the `params` argument so they end up on the URL rather
     * than the body.
     */
    withingsCallback(params, opts) {
        return this.get('/api/withings/callback', params, opts);
    }
    /** POST `/api/withings/webhook`. (`post.api.withings.webhook`) */
    withingsWebhook(body, opts) {
        return this.post('/api/withings/webhook', body, opts);
    }
}
//# sourceMappingURL=modules-kpi-api-client.js.map