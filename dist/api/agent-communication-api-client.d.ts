/**
 * AgentCommunicationApiClient — covers app-side agent flows under
 * `/api/agent/communicate`, `/api/agent/account`, `/api/agent/program-state`,
 * `/api/agent/program-status`, `/api/agent/retry-creation`, and
 * `/api/agent/list` (13 endpoints). All `auth: api`.
 *
 * NOTE: This is distinct from `ModulesAgentsApiClient` which targets
 * `/api/agents/*` in the `Modules/Agents` slice.
 *
 * Source of truth: `sdk/spec/endpoints.json`.
 */
import { BaseApiClient, type ApiResponse } from '../api-client';
import type { AgentChainStatus, AgentConfirmCodeRequest, AgentFinishRegistrationRequest, AgentListMessagesRequest, AgentRecord, AgentSendMessageRequest } from '../types/agent-communication';
export type { AgentChainStatus, AgentConfirmCodeRequest, AgentFinishRegistrationRequest, AgentListMessagesRequest, AgentRecord, AgentSendMessageRequest, };
export interface EmptyOk {
    [key: string]: unknown;
}
export declare class AgentCommunicationApiClient extends BaseApiClient {
    /** POST /api/agent/account/finish-registration */
    finishAgentRegistration(body: AgentFinishRegistrationRequest): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/agent/account/get-status */
    getAgentAccountStatus(): Promise<ApiResponse<AgentChainStatus>>;
    /** POST /api/agent/account/{chain}/confirm-code */
    confirmAgentAccountCode(chain: number | string, body: AgentConfirmCodeRequest): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/agent/communicate/{chain}/assigned-experts */
    getAssignedExperts(chain: number | string): Promise<ApiResponse<AgentChainStatus>>;
    /** GET /api/agent/communicate/{chain}/get-status */
    getCommunicateStatus(chain: number | string): Promise<ApiResponse<AgentChainStatus>>;
    /** GET /api/agent/communicate/{chain}/initialize-agent */
    initializeAgent(chain: number | string): Promise<ApiResponse<AgentChainStatus>>;
    /** GET /api/agent/communicate/{chain}/invites */
    getCommunicateInvites(chain: number | string): Promise<ApiResponse<AgentChainStatus>>;
    /** POST /api/agent/communicate/{chain}/messages — paginated chat history search. */
    listCommunicateMessages(chain: number | string, body?: AgentListMessagesRequest): Promise<ApiResponse<AgentChainStatus>>;
    /** POST /api/agent/communicate/{chain}/send-message */
    sendCommunicateMessage(chain: number | string, body: AgentSendMessageRequest): Promise<ApiResponse<AgentChainStatus>>;
    /** GET /api/agent/list */
    listAgents(): Promise<ApiResponse<AgentRecord[]>>;
    /** GET /api/agent/program-state/{chain} */
    getProgramState(chain: number | string): Promise<ApiResponse<AgentChainStatus>>;
    /** GET /api/agent/program-status/{chain} */
    getProgramStatus(chain: number | string): Promise<ApiResponse<AgentChainStatus>>;
    /** GET /api/agent/retry-creation/{chain} */
    retryAgentCreation(chain: number | string): Promise<ApiResponse<AgentChainStatus>>;
}
//# sourceMappingURL=agent-communication-api-client.d.ts.map