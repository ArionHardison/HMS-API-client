import type { AgentExecutionResource } from '../models/AgentExecutionResource';
import type { AgentResource } from '../models/AgentResource';
import type { agents_module_destroyResponse } from '../models/agents_module_destroyResponse';
import type { agents_module_execute_protocolResponse } from '../models/agents_module_execute_protocolResponse';
import type { agents_module_execute_resumeResponse } from '../models/agents_module_execute_resumeResponse';
import type { agents_module_intelligent_batchBody } from '../models/agents_module_intelligent_batchBody';
import type { agents_module_intelligent_batchResponse } from '../models/agents_module_intelligent_batchResponse';
import type { agents_module_intelligent_entity_identifyBody } from '../models/agents_module_intelligent_entity_identifyBody';
import type { agents_module_intelligent_entity_identifyResponse } from '../models/agents_module_intelligent_entity_identifyResponse';
import type { agents_module_intelligent_processBody } from '../models/agents_module_intelligent_processBody';
import type { agents_module_intelligent_processResponse } from '../models/agents_module_intelligent_processResponse';
import type { agents_module_intelligent_searchBody } from '../models/agents_module_intelligent_searchBody';
import type { agents_module_intelligent_searchResponse } from '../models/agents_module_intelligent_searchResponse';
import type { agents_module_intelligent_statisticsResponse } from '../models/agents_module_intelligent_statisticsResponse';
import type { AgentsProtocolIntegrationResource } from '../models/AgentsProtocolIntegrationResource';
import type { AgentStatisticsResource } from '../models/AgentStatisticsResource';
import type { CreateAgentRequest } from '../models/CreateAgentRequest';
import type { ExecuteProtocolRequest } from '../models/ExecuteProtocolRequest';
import type { ResumeExecutionRequest } from '../models/ResumeExecutionRequest';
import type { UpdateAgentRequest } from '../models/UpdateAgentRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class ModulesAgentsService {
    /**
     * Modules\Agents\Http\Controllers\AgentController@index
     * @returns any Success
     * @throws ApiError
     */
    static agentsModuleIndex({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: AgentResource;
    }>;
    /**
     * Modules\Agents\Http\Controllers\AgentController@store
     * @returns any Success
     * @throws ApiError
     */
    static agentsModuleStore({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: CreateAgentRequest;
    }): CancelablePromise<{
        data: AgentResource;
    }>;
    /**
     * Modules\Agents\Http\Controllers\AgentController@executeProtocol
     * @returns agents_module_execute_protocolResponse Success
     * @throws ApiError
     */
    static agentsModuleExecuteProtocol({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: ExecuteProtocolRequest;
    }): CancelablePromise<agents_module_execute_protocolResponse>;
    /**
     * Modules\Agents\Http\Controllers\IntentRoutingController@identifyEntity
     * @returns agents_module_intelligent_entity_identifyResponse Success
     * @throws ApiError
     */
    static agentsModuleIntelligentEntityIdentify({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: agents_module_intelligent_entity_identifyBody;
    }): CancelablePromise<agents_module_intelligent_entity_identifyResponse>;
    /**
     * Modules\Agents\Http\Controllers\IntentRoutingController@batchProcess
     * @returns agents_module_intelligent_batchResponse Success
     * @throws ApiError
     */
    static agentsModuleIntelligentBatch({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: agents_module_intelligent_batchBody;
    }): CancelablePromise<agents_module_intelligent_batchResponse>;
    /**
     * Modules\Agents\Http\Controllers\IntentRoutingController@processIntent
     * @returns agents_module_intelligent_processResponse Success
     * @throws ApiError
     */
    static agentsModuleIntelligentProcess({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: agents_module_intelligent_processBody;
    }): CancelablePromise<agents_module_intelligent_processResponse>;
    /**
     * Modules\Agents\Http\Controllers\IntentRoutingController@searchAgents
     * @returns agents_module_intelligent_searchResponse Success
     * @throws ApiError
     */
    static agentsModuleIntelligentSearch({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: agents_module_intelligent_searchBody;
    }): CancelablePromise<agents_module_intelligent_searchResponse>;
    /**
     * Modules\Agents\Http\Controllers\IntentRoutingController@getStatistics
     * @returns agents_module_intelligent_statisticsResponse Success
     * @throws ApiError
     */
    static agentsModuleIntelligentStatistics({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<agents_module_intelligent_statisticsResponse>;
    /**
     * Modules\Agents\Http\Controllers\AgentController@resumeExecution
     * @returns agents_module_execute_resumeResponse Success
     * @throws ApiError
     */
    static agentsModuleExecuteResume({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: ResumeExecutionRequest;
    }): CancelablePromise<agents_module_execute_resumeResponse>;
    /**
     * Modules\Agents\Http\Controllers\AgentController@show
     * @returns any Success
     * @throws ApiError
     */
    static agentsModuleShow({ agent, xDomain, }: {
        agent: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: AgentResource;
    }>;
    /**
     * Modules\Agents\Http\Controllers\AgentController@update
     * @returns any Success
     * @throws ApiError
     */
    static agentsModuleUpdate({ agent, xDomain, requestBody, }: {
        agent: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: UpdateAgentRequest;
    }): CancelablePromise<{
        data: AgentResource;
    }>;
    /**
     * Modules\Agents\Http\Controllers\AgentController@destroy
     * @returns agents_module_destroyResponse Success
     * @throws ApiError
     */
    static agentsModuleDestroy({ agent, xDomain, }: {
        agent: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<agents_module_destroyResponse>;
    /**
     * Modules\Agents\Http\Controllers\AgentController@activate
     * @returns any Success
     * @throws ApiError
     */
    static agentsModuleActivate({ agent, xDomain, }: {
        agent: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: AgentResource;
    }>;
    /**
     * Modules\Agents\Http\Controllers\AgentController@clone
     * @returns any Success
     * @throws ApiError
     */
    static agentsModuleClone({ agent, xDomain, requestBody, }: {
        agent: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: CreateAgentRequest;
    }): CancelablePromise<{
        data: AgentResource;
    }>;
    /**
     * Modules\Agents\Http\Controllers\AgentController@deactivate
     * @returns any Success
     * @throws ApiError
     */
    static agentsModuleDeactivate({ agent, xDomain, }: {
        agent: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: AgentResource;
    }>;
    /**
     * Modules\Agents\Http\Controllers\AgentController@executions
     * @returns any Success
     * @throws ApiError
     */
    static agentsModuleExecutions({ agent, xDomain, }: {
        agent: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: AgentExecutionResource;
    }>;
    /**
     * Modules\Agents\Http\Controllers\AgentController@statistics
     * @returns any Success
     * @throws ApiError
     */
    static agentsModuleStatistics({ agent, xDomain, }: {
        agent: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: AgentStatisticsResource;
    }>;
    /**
     * Modules\Agents\Http\Controllers\AgentController@addTool
     * @returns any Success
     * @throws ApiError
     */
    static agentsModuleToolsAdd({ agent, tool, xDomain, }: {
        agent: string;
        tool: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: AgentResource;
    }>;
    /**
     * Modules\Agents\Http\Controllers\AgentController@removeTool
     * @returns any Success
     * @throws ApiError
     */
    static agentsModuleToolsRemove({ agent, tool, xDomain, }: {
        agent: string;
        tool: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: AgentResource;
    }>;
    /**
     * Modules\Agents\Http\Controllers\ProtocolIntegrationController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolAgentsAll({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: AgentsProtocolIntegrationResource;
    }>;
}
//# sourceMappingURL=ModulesAgentsService.d.ts.map