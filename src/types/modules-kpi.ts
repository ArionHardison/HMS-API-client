/**
 * Type definitions for `Modules/KPI`.
 *
 * Structural interfaces only. Re-exports `KPISetupData` / `KPIRuleData` /
 * `UserDeviceData` from the legacy `hms-api-client` so we don't end up with
 * two divergent shapes for the same JSON envelope.
 */

export type {
  KPISetupData,
  KPIRuleData,
  UserDeviceData,
} from '../api/hms-api-client';

/** Identifier alias for the protocol-personal-chain route binding. */
export type ChainId = number | string;

/** Identifier alias for the protocol route binding. */
export type ProtocolId = number | string;

/** Identifier alias for the KPI rule (`KPISettingsExecution`) route binding. */
export type KPIRuleId = number | string;

/**
 * Snapshot of the KPI scheduler / task state for a chain. Returned by
 * `GET /api/kpi/get/{chain}` (`Modules\KPI\Transformers\KPITaskResource`).
 */
export interface KPITaskResource {
  /** Server-computed: this is a passthrough resource so we keep it open. */
  [key: string]: unknown;
}

/**
 * Setup payload returned by `GET /api/kpi/get-setup/{chain}/{protocol}`
 * (`KPISettingsPreparedResource`).
 */
export interface KPISettingsPreparedResource {
  [key: string]: unknown;
}

/** `KPISettingsResource` — returned by save / save-setup / remove-rule. */
export interface KPISettingsResource {
  [key: string]: unknown;
}

/** `KPIRoundResultsResource` — returned by save-round-results. */
export interface KPIRoundResultsResource {
  [key: string]: unknown;
}

/** `KPIParameterValidationResource` — returned by validate-parameters. */
export interface KPIParameterValidationResource {
  valid?: unknown;
  errors?: unknown;
  [key: string]: unknown;
}

/** `ProtocolOnboardingResource` — returned by onboarding GET / save. */
export interface ProtocolOnboardingResource {
  [key: string]: unknown;
}

/** `WithingsDeviceResource` — returned by Withings auth / callback / webhook. */
export interface WithingsDeviceResource {
  [key: string]: unknown;
}

/** POST `/api/kpi/save` body. */
export interface SaveKPIInput {
  chain_item?: unknown;
  perform_rules: boolean;
  protocol_id?: unknown;
  track_parameters: boolean;
  parameters_to_track?: unknown;
  rules?: unknown[];
}

/** POST `/api/kpi/save-setup` body — controller takes the request raw. */
export type SaveKPISetupInput = Record<string, unknown>;

/** POST `/api/kpi/save-round-results` body — controller takes the request raw. */
export type SaveRoundResultsInput = Record<string, unknown>;

/** POST `/api/kpi/validate-parameters` body. */
export interface ValidateParametersInput {
  value?: string;
  time?: number;
  executions?: number;
  frequency_at?: string;
  frequency_from?: string;
  frequency_to?: string;
}

/** POST `/api/onboarding/save/{protocol}` body. */
export interface SaveOnboardingInput {
  setup?: unknown[];
}

/**
 * Generic Withings webhook payload. Withings posts form-encoded fields here;
 * we keep the type open so callers can pass whatever the upstream sends.
 */
export type WithingsWebhookInput = Record<string, unknown>;
