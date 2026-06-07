import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ModulesWorkflowService {
    /**
     * Modules\Workflow\Http\Controllers\ProtocolIntegrationController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolWorkflowAll({ xDomain, }) {
        return __request(OpenAPI, {
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
        return __request(OpenAPI, {
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
        return __request(OpenAPI, {
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
        return __request(OpenAPI, {
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
        return __request(OpenAPI, {
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
//# sourceMappingURL=ModulesWorkflowService.js.map