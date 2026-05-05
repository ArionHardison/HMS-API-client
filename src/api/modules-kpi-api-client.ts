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
import type {
  ChainId,
  KPIParameterValidationResource,
  KPIRoundResultsResource,
  KPIRuleId,
  KPISettingsPreparedResource,
  KPISettingsResource,
  KPITaskResource,
  ProtocolId,
  ProtocolOnboardingResource,
  SaveKPIInput,
  SaveKPISetupInput,
  SaveOnboardingInput,
  SaveRoundResultsInput,
  ValidateParametersInput,
  WithingsDeviceResource,
  WithingsWebhookInput,
} from '../types/modules-kpi';
import type { UserDeviceData } from '../types/modules-kpi';

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
  getSetup(
    chain: ChainId,
    protocol: ProtocolId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<KPISettingsPreparedResource>> {
    const c = encodeURIComponent(String(chain));
    const p = encodeURIComponent(String(protocol));
    return this.get<KPISettingsPreparedResource>(`/api/kpi/get-setup/${c}/${p}`, undefined, opts);
  }

  /**
   * GET `/api/kpi/get/{chain}`. (`get.api.kpi.get.item`)
   *
   * Named `getTasks` rather than `get` because the latter would shadow the
   * inherited `BaseApiClient.get()` verb wrapper and break every other
   * method on this class.
   */
  getTasks(chain: ChainId, opts?: ApiRequestOptions): Promise<ApiResponse<KPITaskResource>> {
    const c = encodeURIComponent(String(chain));
    return this.get<KPITaskResource>(`/api/kpi/get/${c}`, undefined, opts);
  }

  /** DELETE `/api/kpi/remove-rule/{rule}`. (`delete.api.kpi.remove-rule.item`) */
  removeRule(rule: KPIRuleId, opts?: ApiRequestOptions): Promise<ApiResponse<KPISettingsResource>> {
    const r = encodeURIComponent(String(rule));
    return this.delete<KPISettingsResource>(`/api/kpi/remove-rule/${r}`, opts);
  }

  /** POST `/api/kpi/save`. (`post.api.kpi.save`) */
  save(body: SaveKPIInput, opts?: ApiRequestOptions): Promise<ApiResponse<KPISettingsResource>> {
    return this.post<KPISettingsResource>('/api/kpi/save', body, opts);
  }

  /** POST `/api/kpi/save-round-results`. (`post.api.kpi.save-round-results`) */
  saveRoundResults(
    body: SaveRoundResultsInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<KPIRoundResultsResource>> {
    return this.post<KPIRoundResultsResource>('/api/kpi/save-round-results', body, opts);
  }

  /** POST `/api/kpi/save-setup`. (`post.api.kpi.save-setup`) */
  saveSetup(
    body: SaveKPISetupInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<KPISettingsResource>> {
    return this.post<KPISettingsResource>('/api/kpi/save-setup', body, opts);
  }

  /** POST `/api/kpi/validate-parameters`. (`post.api.kpi.validate-parameters`) */
  validateParameters(
    body: ValidateParametersInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<KPIParameterValidationResource>> {
    return this.post<KPIParameterValidationResource>('/api/kpi/validate-parameters', body, opts);
  }

  // ---------------------------------------------------------------------------
  // Onboarding (controllers live in Modules/KPI even though the path differs)
  // ---------------------------------------------------------------------------

  /** GET `/api/onboarding/get/{protocol}`. (`get.api.onboarding.get.item`) */
  getOnboarding(
    protocol: ProtocolId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ProtocolOnboardingResource>> {
    const p = encodeURIComponent(String(protocol));
    return this.get<ProtocolOnboardingResource>(`/api/onboarding/get/${p}`, undefined, opts);
  }

  /** POST `/api/onboarding/save/{protocol}`. (`post.api.onboarding.save.item`) */
  saveOnboarding(
    protocol: ProtocolId,
    body: SaveOnboardingInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ProtocolOnboardingResource>> {
    const p = encodeURIComponent(String(protocol));
    return this.post<ProtocolOnboardingResource>(`/api/onboarding/save/${p}`, body, opts);
  }

  // ---------------------------------------------------------------------------
  // Device listing
  // ---------------------------------------------------------------------------

  /** GET `/api/user-devices/list`. (`get.api.user-devices.list`) */
  listUserDevices(opts?: ApiRequestOptions): Promise<ApiResponse<UserDeviceData[]>> {
    return this.get<UserDeviceData[]>('/api/user-devices/list', undefined, opts);
  }

  // ---------------------------------------------------------------------------
  // Withings
  // ---------------------------------------------------------------------------

  /** GET `/api/withings/auth`. (`get.api.withings.auth`) */
  withingsAuth(opts?: ApiRequestOptions): Promise<ApiResponse<WithingsDeviceResource>> {
    return this.get<WithingsDeviceResource>('/api/withings/auth', undefined, opts);
  }

  /**
   * GET `/api/withings/callback`. (`get.api.withings.callback`)
   *
   * Withings' OAuth dance lands here with `code` + `state` query params; we
   * forward them via the `params` argument so they end up on the URL rather
   * than the body.
   */
  withingsCallback(
    params?: Record<string, string | number>,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<WithingsDeviceResource>> {
    return this.get<WithingsDeviceResource>('/api/withings/callback', params, opts);
  }

  /** POST `/api/withings/webhook`. (`post.api.withings.webhook`) */
  withingsWebhook(
    body: WithingsWebhookInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<WithingsDeviceResource>> {
    return this.post<WithingsDeviceResource>('/api/withings/webhook', body, opts);
  }
}

// =============================================================================
// Integration note (do not delete — referenced by sdk/CLAUDE.md):
//
// To surface this client from the package root, add the following lines to
// `src/index.ts` in the next root-barrel update (the TDD slice owner does
// NOT modify the barrel directly):
//
//   export { KPIModuleApiClient } from './api/modules-kpi-api-client';
//   export type {
//     ChainId,
//     ProtocolId,
//     KPIRuleId,
//     KPITaskResource,
//     KPISettingsPreparedResource,
//     KPISettingsResource,
//     KPIRoundResultsResource,
//     KPIParameterValidationResource,
//     ProtocolOnboardingResource,
//     WithingsDeviceResource,
//     SaveKPIInput,
//     SaveKPISetupInput,
//     SaveRoundResultsInput,
//     ValidateParametersInput,
//     SaveOnboardingInput,
//     WithingsWebhookInput,
//     KPISetupData,
//     KPIRuleData,
//     UserDeviceData,
//   } from './types/modules-kpi';
// =============================================================================
