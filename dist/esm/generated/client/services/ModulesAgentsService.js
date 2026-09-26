import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ModulesAgentsService {
    /**
     * Modules\Agents\Http\Controllers\AgentController@index
     * @returns any Success
     * @throws ApiError
     */
    static agentsModuleIndex({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/agents',
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Agents\Http\Controllers\AgentController@store
     * @returns any Success
     * @throws ApiError
     */
    static agentsModuleStore({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/agents',
            headers: {
                'X-Domain': xDomain,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Agents\Http\Controllers\AgentController@executeProtocol
     * @returns agents_module_execute_protocolResponse Success
     * @throws ApiError
     */
    static agentsModuleExecuteProtocol({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/agents/execute-protocol',
            headers: {
                'X-Domain': xDomain,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Agents\Http\Controllers\IntentRoutingController@identifyEntity
     * @returns agents_module_intelligent_entity_identifyResponse Success
     * @throws ApiError
     */
    static agentsModuleIntelligentEntityIdentify({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/agents/intelligent/entity/identify',
            headers: {
                'X-Domain': xDomain,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Agents\Http\Controllers\IntentRoutingController@batchProcess
     * @returns agents_module_intelligent_batchResponse Success
     * @throws ApiError
     */
    static agentsModuleIntelligentBatch({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/agents/intelligent/intent/batch',
            headers: {
                'X-Domain': xDomain,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Agents\Http\Controllers\IntentRoutingController@processIntent
     * @returns agents_module_intelligent_processResponse Success
     * @throws ApiError
     */
    static agentsModuleIntelligentProcess({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/agents/intelligent/intent/process',
            headers: {
                'X-Domain': xDomain,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Agents\Http\Controllers\IntentRoutingController@searchAgents
     * @returns agents_module_intelligent_searchResponse Success
     * @throws ApiError
     */
    static agentsModuleIntelligentSearch({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/agents/intelligent/search',
            headers: {
                'X-Domain': xDomain,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Agents\Http\Controllers\IntentRoutingController@getStatistics
     * @returns agents_module_intelligent_statisticsResponse Success
     * @throws ApiError
     */
    static agentsModuleIntelligentStatistics({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/agents/intelligent/statistics',
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Agents\Http\Controllers\AgentController@resumeExecution
     * @returns agents_module_execute_resumeResponse Success
     * @throws ApiError
     */
    static agentsModuleExecuteResume({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/agents/resume-execution',
            headers: {
                'X-Domain': xDomain,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Agents\Http\Controllers\AgentController@show
     * @returns any Success
     * @throws ApiError
     */
    static agentsModuleShow({ agent, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/agents/{agent}',
            path: {
                'agent': agent,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Agents\Http\Controllers\AgentController@update
     * @returns any Success
     * @throws ApiError
     */
    static agentsModuleUpdate({ agent, xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/agents/{agent}',
            path: {
                'agent': agent,
            },
            headers: {
                'X-Domain': xDomain,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Agents\Http\Controllers\AgentController@destroy
     * @returns agents_module_destroyResponse Success
     * @throws ApiError
     */
    static agentsModuleDestroy({ agent, xDomain, }) {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/agents/{agent}',
            path: {
                'agent': agent,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Agents\Http\Controllers\AgentController@activate
     * @returns any Success
     * @throws ApiError
     */
    static agentsModuleActivate({ agent, xDomain, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/agents/{agent}/activate',
            path: {
                'agent': agent,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Agents\Http\Controllers\AgentController@clone
     * @returns any Success
     * @throws ApiError
     */
    static agentsModuleClone({ agent, xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/agents/{agent}/clone',
            path: {
                'agent': agent,
            },
            headers: {
                'X-Domain': xDomain,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Agents\Http\Controllers\AgentController@deactivate
     * @returns any Success
     * @throws ApiError
     */
    static agentsModuleDeactivate({ agent, xDomain, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/agents/{agent}/deactivate',
            path: {
                'agent': agent,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Agents\Http\Controllers\AgentController@executions
     * @returns any Success
     * @throws ApiError
     */
    static agentsModuleExecutions({ agent, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/agents/{agent}/executions',
            path: {
                'agent': agent,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Agents\Http\Controllers\AgentController@statistics
     * @returns any Success
     * @throws ApiError
     */
    static agentsModuleStatistics({ agent, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/agents/{agent}/statistics',
            path: {
                'agent': agent,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Agents\Http\Controllers\AgentController@addTool
     * @returns any Success
     * @throws ApiError
     */
    static agentsModuleToolsAdd({ agent, tool, xDomain, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/agents/{agent}/tools/{tool}',
            path: {
                'agent': agent,
                'tool': tool,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Agents\Http\Controllers\AgentController@removeTool
     * @returns any Success
     * @throws ApiError
     */
    static agentsModuleToolsRemove({ agent, tool, xDomain, }) {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/agents/{agent}/tools/{tool}',
            path: {
                'agent': agent,
                'tool': tool,
            },
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Agents\Http\Controllers\ProtocolIntegrationController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolAgentsAll({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/protocol/agents/all',
            headers: {
                'X-Domain': xDomain,
            },
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
}
//# sourceMappingURL=ModulesAgentsService.js.map