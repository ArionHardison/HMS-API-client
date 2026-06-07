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
import type { ApiRequestOptions, ApiResponse } from '../api-client';
import type { ChainId, KPIParameterValidationResource, KPIRoundResultsResource, KPIRuleId, KPISettingsPreparedResource, KPISettingsResource, KPITaskResource, ProtocolId, ProtocolOnboardingResource, SaveKPIInput, SaveKPISetupInput, SaveOnboardingInput, SaveRoundResultsInput, ValidateParametersInput, WithingsDeviceResource, WithingsWebhookInput } from '../types/modules-kpi';
import type { UserDeviceData } from '../types/modules-kpi';
/**
 * Public client over `/api/kpi/*`, `/api/onboarding/*`,
 * `/api/user-devices/list`, and `/api/withings/*`. Subclasses
 * `BaseApiClient` for token / domain / `_method` handling.
 */
export declare class KPIModuleApiClient extends BaseApiClient {
    /** GET `/api/kpi/get-setup/{chain}/{protocol}`. (`get.api.kpi.get-setup.item.item`) */
    getSetup(chain: ChainId, protocol: ProtocolId, opts?: ApiRequestOptions): Promise<ApiResponse<KPISettingsPreparedResource>>;
    /**
     * GET `/api/kpi/get/{chain}`. (`get.api.kpi.get.item`)
     *
     * Named `getTasks` rather than `get` because the latter would shadow the
     * inherited `BaseApiClient.get()` verb wrapper and break every other
     * method on this class.
     */
    getTasks(chain: ChainId, opts?: ApiRequestOptions): Promise<ApiResponse<KPITaskResource>>;
    /** DELETE `/api/kpi/remove-rule/{rule}`. (`delete.api.kpi.remove-rule.item`) */
    removeRule(rule: KPIRuleId, opts?: ApiRequestOptions): Promise<ApiResponse<KPISettingsResource>>;
    /** POST `/api/kpi/save`. (`post.api.kpi.save`) */
    save(body: SaveKPIInput, opts?: ApiRequestOptions): Promise<ApiResponse<KPISettingsResource>>;
    /** POST `/api/kpi/save-round-results`. (`post.api.kpi.save-round-results`) */
    saveRoundResults(body: SaveRoundResultsInput, opts?: ApiRequestOptions): Promise<ApiResponse<KPIRoundResultsResource>>;
    /** POST `/api/kpi/save-setup`. (`post.api.kpi.save-setup`) */
    saveSetup(body: SaveKPISetupInput, opts?: ApiRequestOptions): Promise<ApiResponse<KPISettingsResource>>;
    /** POST `/api/kpi/validate-parameters`. (`post.api.kpi.validate-parameters`) */
    validateParameters(body: ValidateParametersInput, opts?: ApiRequestOptions): Promise<ApiResponse<KPIParameterValidationResource>>;
    /** GET `/api/onboarding/get/{protocol}`. (`get.api.onboarding.get.item`) */
    getOnboarding(protocol: ProtocolId, opts?: ApiRequestOptions): Promise<ApiResponse<ProtocolOnboardingResource>>;
    /** POST `/api/onboarding/save/{protocol}`. (`post.api.onboarding.save.item`) */
    saveOnboarding(protocol: ProtocolId, body: SaveOnboardingInput, opts?: ApiRequestOptions): Promise<ApiResponse<ProtocolOnboardingResource>>;
    /** GET `/api/user-devices/list`. (`get.api.user-devices.list`) */
    listUserDevices(opts?: ApiRequestOptions): Promise<ApiResponse<UserDeviceData[]>>;
    /** GET `/api/withings/auth`. (`get.api.withings.auth`) */
    withingsAuth(opts?: ApiRequestOptions): Promise<ApiResponse<WithingsDeviceResource>>;
    /**
     * GET `/api/withings/callback`. (`get.api.withings.callback`)
     *
     * Withings' OAuth dance lands here with `code` + `state` query params; we
     * forward them via the `params` argument so they end up on the URL rather
     * than the body.
     */
    withingsCallback(params?: Record<string, string | number>, opts?: ApiRequestOptions): Promise<ApiResponse<WithingsDeviceResource>>;
    /** POST `/api/withings/webhook`. (`post.api.withings.webhook`) */
    withingsWebhook(body: WithingsWebhookInput, opts?: ApiRequestOptions): Promise<ApiResponse<WithingsDeviceResource>>;
}
//# sourceMappingURL=modules-kpi-api-client.d.ts.map