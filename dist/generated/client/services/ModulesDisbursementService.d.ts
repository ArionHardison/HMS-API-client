import type { CreateDisbursementRequest } from '../models/CreateDisbursementRequest';
import type { DisbursementResource } from '../models/DisbursementResource';
import type { get_api_disbursement_run_global_item_itemResponse } from '../models/get_api_disbursement_run_global_item_itemResponse';
import type { get_api_disbursement_run_item_itemResponse } from '../models/get_api_disbursement_run_item_itemResponse';
import type { post_api_disbursement_confirmBody } from '../models/post_api_disbursement_confirmBody';
import type { post_api_disbursement_confirmResponse } from '../models/post_api_disbursement_confirmResponse';
import type { UpdateDisbursementRequest } from '../models/UpdateDisbursementRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class ModulesDisbursementService {
    /**
     * Modules\Disbursement\Http\Controllers\DisbursementController@index
     * @returns any Success
     * @throws ApiError
     */
    static disbursementIndex({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: Array<DisbursementResource>;
        links?: Record<string, any>;
        meta?: Record<string, any>;
    }>;
    /**
     * Modules\Disbursement\Http\Controllers\DisbursementController@store
     * @returns any Success
     * @throws ApiError
     */
    static disbursementStore({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: CreateDisbursementRequest;
    }): CancelablePromise<{
        data: DisbursementResource;
    }>;
    /**
     * Modules\Disbursement\Http\Controllers\DisbursementController@confirm
     * @returns post_api_disbursement_confirmResponse Success
     * @throws ApiError
     */
    static postApiDisbursementConfirm({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: post_api_disbursement_confirmBody;
    }): CancelablePromise<post_api_disbursement_confirmResponse>;
    /**
     * Modules\Disbursement\Http\Controllers\DisbursementController@runGlobal
     * @returns get_api_disbursement_run_global_item_itemResponse Success
     * @throws ApiError
     */
    static getApiDisbursementRunGlobalItemItem({ disbursement, task, xDomain, }: {
        disbursement: string;
        task: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<get_api_disbursement_run_global_item_itemResponse>;
    /**
     * Modules\Disbursement\Http\Controllers\DisbursementController@run
     * @returns get_api_disbursement_run_item_itemResponse Success
     * @throws ApiError
     */
    static getApiDisbursementRunItemItem({ disbursement, chain, xDomain, }: {
        disbursement: string;
        chain: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<get_api_disbursement_run_item_itemResponse>;
    /**
     * Modules\Disbursement\Http\Controllers\DisbursementController@show
     * @returns any Success
     * @throws ApiError
     */
    static disbursementShow({ disbursement, xDomain, }: {
        /**
         * Bound to model Disbursement
         */
        disbursement: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: DisbursementResource;
    }>;
    /**
     * Modules\Disbursement\Http\Controllers\DisbursementController@update
     * @returns any Success
     * @throws ApiError
     */
    static disbursementUpdate({ disbursement, xDomain, requestBody, }: {
        /**
         * Bound to model Disbursement
         */
        disbursement: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: UpdateDisbursementRequest;
    }): CancelablePromise<{
        data: DisbursementResource;
    }>;
    /**
     * Modules\Disbursement\Http\Controllers\DisbursementController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static disbursementDestroy({ disbursement, xDomain, }: {
        /**
         * Bound to model Disbursement
         */
        disbursement: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: DisbursementResource;
    }>;
    /**
     * Modules\Disbursement\Http\Controllers\DisbursementController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolDisbursementAll({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: DisbursementResource;
    }>;
}
//# sourceMappingURL=ModulesDisbursementService.d.ts.map