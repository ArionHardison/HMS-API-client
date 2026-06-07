import type { ApplicationResource } from '../models/ApplicationResource';
import type { CreateApplicationRequest } from '../models/CreateApplicationRequest';
import type { get_api_application_run_global_item_itemResponse } from '../models/get_api_application_run_global_item_itemResponse';
import type { get_api_application_run_item_itemResponse } from '../models/get_api_application_run_item_itemResponse';
import type { post_api_application_submitBody } from '../models/post_api_application_submitBody';
import type { post_api_application_submitResponse } from '../models/post_api_application_submitResponse';
import type { UpdateApplicationRequest } from '../models/UpdateApplicationRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class ModulesApplicationService {
    /**
     * Modules\Application\Http\Controllers\ApplicationController@index
     * @returns any Success
     * @throws ApiError
     */
    static applicationIndex({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: Array<ApplicationResource>;
        links?: Record<string, any>;
        meta?: Record<string, any>;
    }>;
    /**
     * Modules\Application\Http\Controllers\ApplicationController@store
     * @returns any Success
     * @throws ApiError
     */
    static applicationStore({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: CreateApplicationRequest;
    }): CancelablePromise<{
        data: ApplicationResource;
    }>;
    /**
     * Modules\Application\Http\Controllers\ApplicationController@runGlobal
     * @returns get_api_application_run_global_item_itemResponse Success
     * @throws ApiError
     */
    static getApiApplicationRunGlobalItemItem({ application, task, xDomain, }: {
        application: string;
        task: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<get_api_application_run_global_item_itemResponse>;
    /**
     * Modules\Application\Http\Controllers\ApplicationController@run
     * @returns get_api_application_run_item_itemResponse Success
     * @throws ApiError
     */
    static getApiApplicationRunItemItem({ application, chain, xDomain, }: {
        application: string;
        chain: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<get_api_application_run_item_itemResponse>;
    /**
     * Modules\Application\Http\Controllers\ApplicationController@submit
     * @returns post_api_application_submitResponse Success
     * @throws ApiError
     */
    static postApiApplicationSubmit({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: post_api_application_submitBody;
    }): CancelablePromise<post_api_application_submitResponse>;
    /**
     * Modules\Application\Http\Controllers\ApplicationController@show
     * @returns any Success
     * @throws ApiError
     */
    static applicationShow({ application, xDomain, }: {
        /**
         * Bound to model Application
         */
        application: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ApplicationResource;
    }>;
    /**
     * Modules\Application\Http\Controllers\ApplicationController@update
     * @returns any Success
     * @throws ApiError
     */
    static applicationUpdate({ application, xDomain, requestBody, }: {
        /**
         * Bound to model Application
         */
        application: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: UpdateApplicationRequest;
    }): CancelablePromise<{
        data: ApplicationResource;
    }>;
    /**
     * Modules\Application\Http\Controllers\ApplicationController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static applicationDestroy({ application, xDomain, }: {
        /**
         * Bound to model Application
         */
        application: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ApplicationResource;
    }>;
    /**
     * Modules\Application\Http\Controllers\ApplicationController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolApplicationAll({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ApplicationResource;
    }>;
}
//# sourceMappingURL=ModulesApplicationService.d.ts.map