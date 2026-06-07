import type { etl_agent_processBody } from '../models/etl_agent_processBody';
import type { etl_agent_processResponse } from '../models/etl_agent_processResponse';
import type { etl_cancelResponse } from '../models/etl_cancelResponse';
import type { etl_componentsResponse } from '../models/etl_componentsResponse';
import type { etl_processBody } from '../models/etl_processBody';
import type { etl_processResponse } from '../models/etl_processResponse';
import type { etl_search_analyzeBody } from '../models/etl_search_analyzeBody';
import type { etl_search_analyzeResponse } from '../models/etl_search_analyzeResponse';
import type { etl_statusResponse } from '../models/etl_statusResponse';
import type { ETLProtocolIntegrationResource } from '../models/ETLProtocolIntegrationResource';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class ModulesEtlService {
    /**
     * Modules\ETL\Http\Controllers\ProtocolIntegrationController@all
     * @returns any Success
     * @throws ApiError
     */
    static etlProtocolAll({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ETLProtocolIntegrationResource;
    }>;
    /**
     * Modules\ETL\Http\Controllers\ETLController@processForAgent
     * @returns etl_agent_processResponse Success
     * @throws ApiError
     */
    static etlAgentProcess({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: etl_agent_processBody;
    }): CancelablePromise<etl_agent_processResponse>;
    /**
     * Modules\ETL\Http\Controllers\ETLController@cancel
     * @returns etl_cancelResponse Success
     * @throws ApiError
     */
    static etlCancel({ pipelineId, xDomain, }: {
        pipelineId: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<etl_cancelResponse>;
    /**
     * Modules\ETL\Http\Controllers\ETLController@components
     * @returns etl_componentsResponse Success
     * @throws ApiError
     */
    static etlComponents({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<etl_componentsResponse>;
    /**
     * Modules\ETL\Http\Controllers\ETLController@process
     * @returns etl_processResponse Success
     * @throws ApiError
     */
    static etlProcess({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: etl_processBody;
    }): CancelablePromise<etl_processResponse>;
    /**
     * Modules\ETL\Http\Controllers\ETLController@searchAndAnalyze
     * @returns etl_search_analyzeResponse Success
     * @throws ApiError
     */
    static etlSearchAnalyze({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: etl_search_analyzeBody;
    }): CancelablePromise<etl_search_analyzeResponse>;
    /**
     * Modules\ETL\Http\Controllers\ETLController@status
     * @returns etl_statusResponse Success
     * @throws ApiError
     */
    static etlStatus({ pipelineId, xDomain, }: {
        pipelineId: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<etl_statusResponse>;
}
//# sourceMappingURL=ModulesEtlService.d.ts.map