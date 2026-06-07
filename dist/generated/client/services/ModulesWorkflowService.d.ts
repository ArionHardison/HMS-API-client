import type { CodifyPipelineStartedResource } from '../models/CodifyPipelineStartedResource';
import type { CodifyPipelineStatusResource } from '../models/CodifyPipelineStatusResource';
import type { StartCodifyPipelineRequest } from '../models/StartCodifyPipelineRequest';
import type { WorkflowProtocolIntegrationResource } from '../models/WorkflowProtocolIntegrationResource';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class ModulesWorkflowService {
    /**
     * Modules\Workflow\Http\Controllers\ProtocolIntegrationController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolWorkflowAll({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: WorkflowProtocolIntegrationResource;
    }>;
    /**
     * Modules\Workflow\Http\Controllers\CodifyPipelineController@checkCodifyPipeline
     * @returns any Success
     * @throws ApiError
     */
    static getApiWorkflowCodifyPipelineCheckPipelineItem({ session, xDomain, }: {
        session: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: CodifyPipelineStatusResource;
    }>;
    /**
     * Modules\Workflow\Http\Controllers\CodifyPipelineController@saveFollowupQuestionResponse
     * @returns any Success
     * @throws ApiError
     */
    static postApiWorkflowCodifyPipelineSaveResponse({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: CodifyPipelineStatusResource;
    }>;
    /**
     * Modules\Workflow\Http\Controllers\CodifyPipelineController@startCodifyPipeline
     * @returns any Success
     * @throws ApiError
     */
    static postApiWorkflowCodifyPipelineStart({ xDomain, formData, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        formData: StartCodifyPipelineRequest;
    }): CancelablePromise<{
        data: CodifyPipelineStartedResource;
    }>;
    /**
     * Modules\Workflow\Http\Controllers\CodifyPipelineController@stopCodifyPipeline
     * @returns any Success
     * @throws ApiError
     */
    static getApiWorkflowCodifyPipelineStopItem({ session, xDomain, }: {
        session: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: CodifyPipelineStatusResource;
    }>;
}
//# sourceMappingURL=ModulesWorkflowService.d.ts.map