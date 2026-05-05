/**
 * Type contracts for `AgentCommunicationApiClient`.
 *
 * Source of truth: `sdk/spec/endpoints.json` — entries under
 * `/api/agent/{communicate,account,program-state,program-status,retry-creation,list}/*`.
 *
 * NOTE: These are app-side agent endpoints — distinct from the
 * `Modules/Agents` slice owned by `modules-agents-api-client`.
 */

/** POST /api/agent/account/finish-registration body. */
export interface AgentFinishRegistrationRequest {
  full_name: string;
  timezone: string;
  country_id: number;
  login: string;
  email: string;
  phone: string;
  password: string;
  /** Boolean — terms agreement. The API serializes booleans as `1`/`0`. */
  agreed: boolean;
}

/** POST /api/agent/account/{chain}/confirm-code body. */
export interface AgentConfirmCodeRequest {
  code: string;
}

/** POST /api/agent/communicate/{chain}/messages body — search filter for paginated chat history. */
export interface AgentListMessagesRequest {
  /** Optional free-text search filter. */
  search?: string;
  [key: string]: unknown;
}

/** POST /api/agent/communicate/{chain}/send-message body. */
export interface AgentSendMessageRequest {
  /** Target agent identifier (string id or numeric pk). */
  agent: string | number;
  /** Message body. */
  message: string;
  /** Optional list of attachments — URLs, ids, or files. */
  attachments?: ReadonlyArray<unknown>;
}

/** Generic agent record returned by index/list/show endpoints. */
export interface AgentRecord {
  id?: number | string;
  [key: string]: unknown;
}

/** Generic chain status / program-state / invitation payload — spec leaves shape empty. */
export interface AgentChainStatus {
  [key: string]: unknown;
}
