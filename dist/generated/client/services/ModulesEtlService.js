"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModulesEtlService = void 0;
const OpenAPI_1 = require("../core/OpenAPI");
const request_1 = require("../core/request");
class ModulesEtlService {
    /**
     * Modules\ETL\Http\Controllers\ProtocolIntegrationController@all
     * @returns any Success
     * @throws ApiError
     */
    static etlProtocolAll({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/etl/all',
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
     * Modules\ETL\Http\Controllers\ETLController@processForAgent
     * @returns etl_agent_processResponse Success
     * @throws ApiError
     */
    static etlAgentProcess({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/etl/agent/process',
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
     * Modules\ETL\Http\Controllers\ETLController@cancel
     * @returns etl_cancelResponse Success
     * @throws ApiError
     */
    static etlCancel({ pipelineId, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/etl/cancel/{pipelineId}',
            path: {
                'pipelineId': pipelineId,
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
     * Modules\ETL\Http\Controllers\ETLController@components
     * @returns etl_componentsResponse Success
     * @throws ApiError
     */
    static etlComponents({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/v1/etl/components',
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
     * Modules\ETL\Http\Controllers\ETLController@process
     * @returns etl_processResponse Success
     * @throws ApiError
     */
    static etlProcess({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/etl/process',
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
     * Modules\ETL\Http\Controllers\ETLController@searchAndAnalyze
     * @returns etl_search_analyzeResponse Success
     * @throws ApiError
     */
    static etlSearchAnalyze({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/etl/search-analyze',
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
     * Modules\ETL\Http\Controllers\ETLController@status
     * @returns etl_statusResponse Success
     * @throws ApiError
     */
    static etlStatus({ pipelineId, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/v1/etl/status/{pipelineId}',
            path: {
                'pipelineId': pipelineId,
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
}
exports.ModulesEtlService = ModulesEtlService;
//# sourceMappingURL=ModulesEtlService.js.map