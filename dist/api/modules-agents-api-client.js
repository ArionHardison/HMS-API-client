"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentsModuleApiClient = void 0;
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
const api_client_1 = require("../api-client");
/**
 * Public client over the `/api/agents/*` and `/api/protocol/agents/*`
 * surfaces. Subclasses `BaseApiClient` so it picks up auth / `X-Domain` /
 * Laravel `_method` override / `ApiError` normalization for free.
 */
class AgentsModuleApiClient extends api_client_1.BaseApiClient {
    // ---------------------------------------------------------------------------
    // CRUD
    // ---------------------------------------------------------------------------
    /** GET `/api/agents` — list (paginated) all agents. (`agents.module.index`) */
    list(opts) {
        return this.get('/api/agents', undefined, opts);
    }
    /** POST `/api/agents` — create a new agent. (`agents.module.store`) */
    create(body, opts) {
        return this.post('/api/agents', body, opts);
    }
    /** GET `/api/agents/{agent}` — show one agent. (`agents.module.show`) */
    show(agent, opts) {
        return this.get(`/api/agents/${encodeURIComponent(String(agent))}`, undefined, opts);
    }
    /** PUT `/api/agents/{agent}` — update. Sent as POST + `?_method=PUT`. (`agents.module.update`) */
    update(agent, body, opts) {
        return this.put(`/api/agents/${encodeURIComponent(String(agent))}`, body, opts);
    }
    /** DELETE `/api/agents/{agent}`. (`agents.module.destroy`) */
    destroy(agent, opts) {
        return this.delete(`/api/agents/${encodeURIComponent(String(agent))}`, opts);
    }
    // ---------------------------------------------------------------------------
    // Lifecycle
    // ---------------------------------------------------------------------------
    /** POST `/api/agents/{agent}/activate`. (`agents.module.activate`) */
    activate(agent, opts) {
        return this.post(`/api/agents/${encodeURIComponent(String(agent))}/activate`, undefined, opts);
    }
    /** POST `/api/agents/{agent}/deactivate`. (`agents.module.deactivate`) */
    deactivate(agent, opts) {
        return this.post(`/api/agents/${encodeURIComponent(String(agent))}/deactivate`, undefined, opts);
    }
    /** POST `/api/agents/{agent}/clone`. (`agents.module.clone`) */
    clone(agent, body, opts) {
        return this.post(`/api/agents/${encodeURIComponent(String(agent))}/clone`, body, opts);
    }
    /** POST `/api/agents/execute-protocol` — kick off a protocol run. (`agents.module.execute.protocol`) */
    executeProtocol(body, opts) {
        return this.post('/api/agents/execute-protocol', body, opts);
    }
    /** POST `/api/agents/resume-execution` — feed input back into a paused run. (`agents.module.execute.resume`) */
    resumeExecution(body, opts) {
        return this.post('/api/agents/resume-execution', body, opts);
    }
    // ---------------------------------------------------------------------------
    // Insights / polling
    // ---------------------------------------------------------------------------
    /**
     * GET `/api/agents/{agent}/executions` — execution history for an agent.
     * Doubles as a simple poll for current run status; the SDK does NOT
     * subscribe to broadcasts here — callers wire that up separately.
     * (`agents.module.executions`)
     */
    executions(agent, opts) {
        return this.get(`/api/agents/${encodeURIComponent(String(agent))}/executions`, undefined, opts);
    }
    /** GET `/api/agents/{agent}/statistics`. (`agents.module.statistics`) */
    statistics(agent, opts) {
        return this.get(`/api/agents/${encodeURIComponent(String(agent))}/statistics`, undefined, opts);
    }
    // ---------------------------------------------------------------------------
    // Tool binding
    // ---------------------------------------------------------------------------
    /** POST `/api/agents/{agent}/tools/{tool}` — attach a tool to an agent. (`agents.module.tools.add`) */
    addTool(agent, tool, opts) {
        return this.post(`/api/agents/${encodeURIComponent(String(agent))}/tools/${encodeURIComponent(String(tool))}`, undefined, opts);
    }
    /** DELETE `/api/agents/{agent}/tools/{tool}`. (`agents.module.tools.remove`) */
    removeTool(agent, tool, opts) {
        return this.delete(`/api/agents/${encodeURIComponent(String(agent))}/tools/${encodeURIComponent(String(tool))}`, opts);
    }
    // ---------------------------------------------------------------------------
    // Intelligent routing (auth: public — pass `{ auth: false }` per-call)
    // ---------------------------------------------------------------------------
    /** POST `/api/agents/intelligent/entity/identify`. (`agents.module.intelligent.entity.identify`) */
    identifyEntity(body, opts) {
        return this.post('/api/agents/intelligent/entity/identify', body, opts);
    }
    /** POST `/api/agents/intelligent/intent/process`. (`agents.module.intelligent.process`) */
    processIntent(body, opts) {
        return this.post('/api/agents/intelligent/intent/process', body, opts);
    }
    /** POST `/api/agents/intelligent/intent/batch`. (`agents.module.intelligent.batch`) */
    processIntentBatch(body, opts) {
        return this.post('/api/agents/intelligent/intent/batch', body, opts);
    }
    /** POST `/api/agents/intelligent/search`. (`agents.module.intelligent.search`) */
    intelligentSearch(body, opts) {
        return this.post('/api/agents/intelligent/search', body, opts);
    }
    /** GET `/api/agents/intelligent/statistics`. (`agents.module.intelligent.statistics`) */
    intelligentStatistics(opts) {
        return this.get('/api/agents/intelligent/statistics', undefined, opts);
    }
    // ---------------------------------------------------------------------------
    // Protocol integration
    // ---------------------------------------------------------------------------
    /** GET `/api/protocol/agents/all`. (`get.api.protocol.agents.all`) */
    listProtocolAgents(opts) {
        return this.get('/api/protocol/agents/all', undefined, opts);
    }
}
exports.AgentsModuleApiClient = AgentsModuleApiClient;
//# sourceMappingURL=modules-agents-api-client.js.map