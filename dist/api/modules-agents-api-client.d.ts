/**
 * `Modules/Agents` API client.
 *
 * Covers the 20 endpoints documented in `sdk/spec/endpoints.json` with
 * `module === "Modules/Agents"`:
 *
 *   - 5 agent CRUD endpoints (`agents.module.{index,store,show,update,destroy}`)
 *   - 4 lifecycle endpoints (`activate`, `deactivate`, `clone`, +
 *     `executeProtocol` / `resumeExecution` for orchestrating runs)
 *   - 2 read-only insights (`executions`, `statistics` per-agent;
 *     `intelligentStatistics` global)
 *   - 2 tool-binding endpoints (`addTool`, `removeTool`)
 *   - 4 intelligent-routing endpoints (entity / intent / batch / search) —
 *     these are `auth:public` upstream so callers should pass
 *     `{ auth: false }` per-call to skip the Authorization header
 *   - 1 protocol-integration listing (`/api/protocol/agents/all`)
 *
 * Naming policy: methods follow `spec.id` minus the redundant
 * `agents.module.` prefix and renamed to camelCase. Two endpoints sharing
 * the same final segment (`agents.module.statistics` vs
 * `agents.module.intelligent.statistics`) are disambiguated by namespace
 * (`statistics(id)` vs `intelligentStatistics()`).
 *
 * Class is named `AgentsModuleApiClient` — NOT `AgentApiClient` — to avoid
 * colliding with the legacy `AgentsApiClient` in `hms-api-client.ts`. The
 * legacy client coexists; do not refactor it.
 *
 * Integration with `src/index.ts`: the root barrel re-exports
 * `AgentsModuleApiClient` from this file. Owners of `src/index.ts` should
 * add the export line themselves — this file's TDD slice does not modify
 * the barrel.
 */
import { BaseApiClient } from '../api-client';
import type { ApiRequestOptions, ApiResponse } from '../api-client';
import type { AgentExecutionResource, AgentExecutionStatus, AgentId, AgentResource, AgentStatisticsResource, AgentsProtocolIntegrationResource, BatchIntentInput, CloneAgentInput, CreateAgentInput, ExecuteProtocolInput, IdentifyEntityInput, IntelligentResponse, IntelligentSearchInput, ProcessIntentInput, ResumeExecutionInput, ToolId } from '../types/modules-agents';
/**
 * Public client over the `/api/agents/*` and `/api/protocol/agents/*`
 * surfaces. Subclasses `BaseApiClient` so it picks up auth / `X-Domain` /
 * Laravel `_method` override / `ApiError` normalization for free.
 */
export declare class AgentsModuleApiClient extends BaseApiClient {
    /** GET `/api/agents` — list (paginated) all agents. (`agents.module.index`) */
    list(opts?: ApiRequestOptions): Promise<ApiResponse<AgentResource[]>>;
    /** POST `/api/agents` — create a new agent. (`agents.module.store`) */
    create(body: CreateAgentInput, opts?: ApiRequestOptions): Promise<ApiResponse<AgentResource>>;
    /** GET `/api/agents/{agent}` — show one agent. (`agents.module.show`) */
    show(agent: AgentId, opts?: ApiRequestOptions): Promise<ApiResponse<AgentResource>>;
    /** PUT `/api/agents/{agent}` — update. Sent as POST + `?_method=PUT`. (`agents.module.update`) */
    update(agent: AgentId, body: Partial<CreateAgentInput> & {
        name: string;
    }, opts?: ApiRequestOptions): Promise<ApiResponse<AgentResource>>;
    /** DELETE `/api/agents/{agent}`. (`agents.module.destroy`) */
    destroy(agent: AgentId, opts?: ApiRequestOptions): Promise<ApiResponse<null>>;
    /** POST `/api/agents/{agent}/activate`. (`agents.module.activate`) */
    activate(agent: AgentId, opts?: ApiRequestOptions): Promise<ApiResponse<AgentResource>>;
    /** POST `/api/agents/{agent}/deactivate`. (`agents.module.deactivate`) */
    deactivate(agent: AgentId, opts?: ApiRequestOptions): Promise<ApiResponse<AgentResource>>;
    /** POST `/api/agents/{agent}/clone`. (`agents.module.clone`) */
    clone(agent: AgentId, body: CloneAgentInput, opts?: ApiRequestOptions): Promise<ApiResponse<AgentResource>>;
    /** POST `/api/agents/execute-protocol` — kick off a protocol run. (`agents.module.execute.protocol`) */
    executeProtocol(body: ExecuteProtocolInput, opts?: ApiRequestOptions): Promise<ApiResponse<AgentExecutionStatus>>;
    /** POST `/api/agents/resume-execution` — feed input back into a paused run. (`agents.module.execute.resume`) */
    resumeExecution(body: ResumeExecutionInput, opts?: ApiRequestOptions): Promise<ApiResponse<AgentExecutionStatus>>;
    /**
     * GET `/api/agents/{agent}/executions` — execution history for an agent.
     * Doubles as a simple poll for current run status; the SDK does NOT
     * subscribe to broadcasts here — callers wire that up separately.
     * (`agents.module.executions`)
     */
    executions(agent: AgentId, opts?: ApiRequestOptions): Promise<ApiResponse<AgentExecutionResource[]>>;
    /** GET `/api/agents/{agent}/statistics`. (`agents.module.statistics`) */
    statistics(agent: AgentId, opts?: ApiRequestOptions): Promise<ApiResponse<AgentStatisticsResource>>;
    /** POST `/api/agents/{agent}/tools/{tool}` — attach a tool to an agent. (`agents.module.tools.add`) */
    addTool(agent: AgentId, tool: ToolId, opts?: ApiRequestOptions): Promise<ApiResponse<AgentResource>>;
    /** DELETE `/api/agents/{agent}/tools/{tool}`. (`agents.module.tools.remove`) */
    removeTool(agent: AgentId, tool: ToolId, opts?: ApiRequestOptions): Promise<ApiResponse<AgentResource>>;
    /** POST `/api/agents/intelligent/entity/identify`. (`agents.module.intelligent.entity.identify`) */
    identifyEntity(body: IdentifyEntityInput, opts?: ApiRequestOptions): Promise<ApiResponse<IntelligentResponse>>;
    /** POST `/api/agents/intelligent/intent/process`. (`agents.module.intelligent.process`) */
    processIntent(body: ProcessIntentInput, opts?: ApiRequestOptions): Promise<ApiResponse<IntelligentResponse>>;
    /** POST `/api/agents/intelligent/intent/batch`. (`agents.module.intelligent.batch`) */
    processIntentBatch(body: BatchIntentInput, opts?: ApiRequestOptions): Promise<ApiResponse<IntelligentResponse>>;
    /** POST `/api/agents/intelligent/search`. (`agents.module.intelligent.search`) */
    intelligentSearch(body: IntelligentSearchInput, opts?: ApiRequestOptions): Promise<ApiResponse<IntelligentResponse>>;
    /** GET `/api/agents/intelligent/statistics`. (`agents.module.intelligent.statistics`) */
    intelligentStatistics(opts?: ApiRequestOptions): Promise<ApiResponse<unknown>>;
    /** GET `/api/protocol/agents/all`. (`get.api.protocol.agents.all`) */
    listProtocolAgents(opts?: ApiRequestOptions): Promise<ApiResponse<AgentsProtocolIntegrationResource[]>>;
}
//# sourceMappingURL=modules-agents-api-client.d.ts.map