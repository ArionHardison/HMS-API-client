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
import { BaseApiClient } from '../api-client';
export class AgentCommunicationApiClient extends BaseApiClient {
    // ---------------------------------------------------------------------------
    // /api/agent/account/*
    // ---------------------------------------------------------------------------
    /** POST /api/agent/account/finish-registration */
    async finishAgentRegistration(body) {
        return this.post('/api/agent/account/finish-registration', body);
    }
    /** GET /api/agent/account/get-status */
    async getAgentAccountStatus() {
        return this.get('/api/agent/account/get-status');
    }
    /** POST /api/agent/account/{chain}/confirm-code */
    async confirmAgentAccountCode(chain, body) {
        return this.post(`/api/agent/account/${encodeURIComponent(String(chain))}/confirm-code`, body);
    }
    // ---------------------------------------------------------------------------
    // /api/agent/communicate/{chain}/*
    // ---------------------------------------------------------------------------
    /** GET /api/agent/communicate/{chain}/assigned-experts */
    async getAssignedExperts(chain) {
        return this.get(`/api/agent/communicate/${encodeURIComponent(String(chain))}/assigned-experts`);
    }
    /** GET /api/agent/communicate/{chain}/get-status */
    async getCommunicateStatus(chain) {
        return this.get(`/api/agent/communicate/${encodeURIComponent(String(chain))}/get-status`);
    }
    /** GET /api/agent/communicate/{chain}/initialize-agent */
    async initializeAgent(chain) {
        return this.get(`/api/agent/communicate/${encodeURIComponent(String(chain))}/initialize-agent`);
    }
    /** GET /api/agent/communicate/{chain}/invites */
    async getCommunicateInvites(chain) {
        return this.get(`/api/agent/communicate/${encodeURIComponent(String(chain))}/invites`);
    }
    /** POST /api/agent/communicate/{chain}/messages — paginated chat history search. */
    async listCommunicateMessages(chain, body = {}) {
        return this.post(`/api/agent/communicate/${encodeURIComponent(String(chain))}/messages`, body);
    }
    /** POST /api/agent/communicate/{chain}/send-message */
    async sendCommunicateMessage(chain, body) {
        return this.post(`/api/agent/communicate/${encodeURIComponent(String(chain))}/send-message`, body);
    }
    // ---------------------------------------------------------------------------
    // /api/agent/{list,program-state,program-status,retry-creation}
    // ---------------------------------------------------------------------------
    /** GET /api/agent/list */
    async listAgents() {
        return this.get('/api/agent/list');
    }
    /** GET /api/agent/program-state/{chain} */
    async getProgramState(chain) {
        return this.get(`/api/agent/program-state/${encodeURIComponent(String(chain))}`);
    }
    /** GET /api/agent/program-status/{chain} */
    async getProgramStatus(chain) {
        return this.get(`/api/agent/program-status/${encodeURIComponent(String(chain))}`);
    }
    /** GET /api/agent/retry-creation/{chain} */
    async retryAgentCreation(chain) {
        return this.get(`/api/agent/retry-creation/${encodeURIComponent(String(chain))}`);
    }
}
//# sourceMappingURL=agent-communication-api-client.js.map