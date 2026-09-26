"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModulesWorkflowService = void 0;
const OpenAPI_1 = require("../core/OpenAPI");
const request_1 = require("../core/request");
class ModulesWorkflowService {
    /**
     * Modules\Workflow\Http\Controllers\ProtocolIntegrationController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolWorkflowAll({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/workflow/all',
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
     * Modules\Workflow\Http\Controllers\CodifyPipelineController@checkCodifyPipeline
     * @returns any Success
     * @throws ApiError
     */
    static getApiWorkflowCodifyPipelineCheckPipelineItem({ session, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/workflow/codify-pipeline/check-pipeline/{session}',
            path: {
                'session': session,
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
     * Modules\Workflow\Http\Controllers\CodifyPipelineController@saveFollowupQuestionResponse
     * @returns any Success
     * @throws ApiError
     */
    static postApiWorkflowCodifyPipelineSaveResponse({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/workflow/codify-pipeline/save-response',
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
     * Modules\Workflow\Http\Controllers\CodifyPipelineController@startCodifyPipeline
     * @returns any Success
     * @throws ApiError
     */
    static postApiWorkflowCodifyPipelineStart({ xDomain, formData, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/workflow/codify-pipeline/start',
            headers: {
                'X-Domain': xDomain,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                401: `Unauthenticated`,
                403: `Forbidden`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Modules\Workflow\Http\Controllers\CodifyPipelineController@stopCodifyPipeline
     * @returns any Success
     * @throws ApiError
     */
    static getApiWorkflowCodifyPipelineStopItem({ session, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/workflow/codify-pipeline/stop/{session}',
            path: {
                'session': session,
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
exports.ModulesWorkflowService = ModulesWorkflowService;
//# sourceMappingURL=ModulesWorkflowService.js.map