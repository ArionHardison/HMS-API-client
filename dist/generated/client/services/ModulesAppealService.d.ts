import type { AppealResource } from '../models/AppealResource';
import type { CreateAppealRequest } from '../models/CreateAppealRequest';
import type { get_api_appeal_run_global_item_itemResponse } from '../models/get_api_appeal_run_global_item_itemResponse';
import type { get_api_appeal_run_item_itemResponse } from '../models/get_api_appeal_run_item_itemResponse';
import type { post_api_appeal_submitBody } from '../models/post_api_appeal_submitBody';
import type { post_api_appeal_submitResponse } from '../models/post_api_appeal_submitResponse';
import type { UpdateAppealRequest } from '../models/UpdateAppealRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class ModulesAppealService {
    /**
     * Modules\Appeal\Http\Controllers\AppealController@index
     * @returns any Success
     * @throws ApiError
     */
    static appealIndex({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: Array<AppealResource>;
        links?: Record<string, any>;
        meta?: Record<string, any>;
    }>;
    /**
     * Modules\Appeal\Http\Controllers\AppealController@store
     * @returns any Success
     * @throws ApiError
     */
    static appealStore({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: CreateAppealRequest;
    }): CancelablePromise<{
        data: AppealResource;
    }>;
    /**
     * Modules\Appeal\Http\Controllers\AppealController@runGlobal
     * @returns get_api_appeal_run_global_item_itemResponse Success
     * @throws ApiError
     */
    static getApiAppealRunGlobalItemItem({ appeal, task, xDomain, }: {
        appeal: string;
        task: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<get_api_appeal_run_global_item_itemResponse>;
    /**
     * Modules\Appeal\Http\Controllers\AppealController@run
     * @returns get_api_appeal_run_item_itemResponse Success
     * @throws ApiError
     */
    static getApiAppealRunItemItem({ appeal, chain, xDomain, }: {
        appeal: string;
        chain: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<get_api_appeal_run_item_itemResponse>;
    /**
     * Modules\Appeal\Http\Controllers\AppealController@submit
     * @returns post_api_appeal_submitResponse Success
     * @throws ApiError
     */
    static postApiAppealSubmit({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: post_api_appeal_submitBody;
    }): CancelablePromise<post_api_appeal_submitResponse>;
    /**
     * Modules\Appeal\Http\Controllers\AppealController@show
     * @returns any Success
     * @throws ApiError
     */
    static appealShow({ appeal, xDomain, }: {
        /**
         * Bound to model Appeal
         */
        appeal: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: AppealResource;
    }>;
    /**
     * Modules\Appeal\Http\Controllers\AppealController@update
     * @returns any Success
     * @throws ApiError
     */
    static appealUpdate({ appeal, xDomain, requestBody, }: {
        /**
         * Bound to model Appeal
         */
        appeal: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: UpdateAppealRequest;
    }): CancelablePromise<{
        data: AppealResource;
    }>;
    /**
     * Modules\Appeal\Http\Controllers\AppealController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static appealDestroy({ appeal, xDomain, }: {
        /**
         * Bound to model Appeal
         */
        appeal: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: AppealResource;
    }>;
    /**
     * Modules\Appeal\Http\Controllers\AppealController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolAppealAll({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: AppealResource;
    }>;
}
//# sourceMappingURL=ModulesAppealService.d.ts.map