/**
 * Type definitions for `Modules/Agents`.
 *
 * Structural interfaces only — no runtime code. These mirror the Laravel
 * `Modules\Agents\Transformers\*Resource` shapes from `sdk/spec/endpoints.json`.
 *
 * Lots of fields are typed `unknown` because the upstream `*Resource` files
 * pass-through arbitrary JSON columns (capabilities, configuration, tools,
 * memory, metadata). When a downstream caller knows the inner shape they can
 * narrow with their own type guard — the SDK is intentionally not opinionated
 * about it.
 */
/** Identifier alias matching the Laravel route binding (`{agent}` accepts id or slug). */
export type AgentId = number | string;
/** Identifier alias matching the Laravel route binding (`{tool}` accepts id or slug). */
export type ToolId = number | string;
/**
 * The canonical agent record returned by `agents.module.{index,show,store,update,clone,activate,deactivate}`.
 * See `Modules\Agents\Transformers\AgentResource`.
 */
export interface AgentResource {
    id: number;
    name: unknown;
    type: unknown;
    description: unknown;
    status: unknown;
    capabilities: unknown;
    configuration: unknown;
    model: unknown;
    temperature: unknown;
    max_tokens: unknown;
    system_prompt: unknown;
    tools: unknown;
    memory: unknown;
    user_id: number;
    parent_agent_id: number;
    metadata: unknown;
    last_active_at: string;
    created_at: string;
    updated_at: string;
}
/** Single execution record returned by `agents.module.executions`. */
export interface AgentExecutionResource {
    id: number;
    agent_id: number;
    user_id: number;
    protocol_id: number;
    deal_id: number;
    task_type: unknown;
    input: unknown;
    output: unknown;
    status: unknown;
    error_message: unknown;
    execution_time: unknown;
    tokens_used: unknown;
    cost: unknown;
    metadata: unknown;
    started_at: string;
    completed_at: string;
    created_at: string;
    updated_at: string;
    agent: unknown;
    protocol: unknown;
    user: unknown;
}
/** Per-agent rollup statistics returned by `agents.module.statistics`. */
export interface AgentStatisticsResource {
    agent_id: number;
    total_executions: unknown;
    successful_executions: unknown;
    failed_executions: unknown;
    success_rate: unknown;
    average_execution_time: unknown;
    total_tokens_used: unknown;
    total_cost: unknown;
    last_active_at: string;
}
/** Lightweight protocol-integration listing returned by `get.api.protocol.agents.all`. */
export interface AgentsProtocolIntegrationResource {
    id: number;
    name: unknown;
    description: unknown;
}
/** POST `/api/agents` body — see `CreateAgentRequest`. */
export interface CreateAgentInput {
    name: string;
    type: string;
    description?: string;
    capabilities?: unknown[];
    configuration?: unknown[];
    model?: unknown;
    temperature?: number;
    max_tokens?: number;
    system_prompt?: string;
    metadata?: unknown[];
    parent_agent_id?: unknown;
}
/** PUT `/api/agents/{agent}` body — see `UpdateAgentRequest`. */
export interface UpdateAgentInput {
    name: string;
    description?: string;
    configuration?: unknown[];
    model?: unknown;
    temperature?: number;
    max_tokens?: number;
    system_prompt?: string;
    metadata?: unknown[];
}
/** POST `/api/agents/{agent}/clone` body. Same shape as create. */
export type CloneAgentInput = CreateAgentInput;
/** POST `/api/agents/execute-protocol` body. */
export interface ExecuteProtocolInput {
    protocol_id?: unknown;
    agent_id?: unknown;
    input?: unknown[];
}
/** POST `/api/agents/resume-execution` body. */
export interface ResumeExecutionInput {
    execution_id?: unknown;
    input: unknown[];
}
/**
 * Generic execution status payload. Used for both protocol execution and
 * resume responses (controllers return raw arrays with this shape).
 */
export interface AgentExecutionStatus {
    success: unknown;
    execution_id: unknown;
    status: unknown;
    output: unknown;
    needs_input: unknown;
    prompt: unknown;
}
/** Generic intelligent-routing response envelope. */
export interface IntelligentResponse {
    status: unknown;
    message: unknown;
    errors: unknown;
}
/** POST `/api/agents/intelligent/entity/identify` body. */
export interface IdentifyEntityInput {
    entity?: unknown;
}
/** POST `/api/agents/intelligent/intent/process` body. */
export interface ProcessIntentInput {
    intent?: unknown;
    context?: unknown;
}
/** POST `/api/agents/intelligent/intent/batch` body. */
export interface BatchIntentInput {
    intents?: unknown;
    context?: unknown;
}
/** POST `/api/agents/intelligent/search` body. */
export interface IntelligentSearchInput {
    limit?: unknown;
    capability?: unknown;
    agency?: unknown;
    state?: unknown;
    type?: unknown;
}
//# sourceMappingURL=modules-agents.d.ts.map