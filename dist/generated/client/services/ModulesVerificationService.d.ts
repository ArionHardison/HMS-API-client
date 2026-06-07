import type { CreateVerificationRequest } from '../models/CreateVerificationRequest';
import type { get_api_verification_run_global_item_itemResponse } from '../models/get_api_verification_run_global_item_itemResponse';
import type { get_api_verification_run_item_itemResponse } from '../models/get_api_verification_run_item_itemResponse';
import type { post_api_verification_submitBody } from '../models/post_api_verification_submitBody';
import type { post_api_verification_submitResponse } from '../models/post_api_verification_submitResponse';
import type { UpdateVerificationRequest } from '../models/UpdateVerificationRequest';
import type { VerificationResource } from '../models/VerificationResource';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class ModulesVerificationService {
    /**
     * Modules\Verification\Http\Controllers\VerificationController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolVerificationAll({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: VerificationResource;
    }>;
    /**
     * Modules\Verification\Http\Controllers\VerificationController@index
     * @returns any Success
     * @throws ApiError
     */
    static verificationIndex({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: Array<VerificationResource>;
        links?: Record<string, any>;
        meta?: Record<string, any>;
    }>;
    /**
     * Modules\Verification\Http\Controllers\VerificationController@store
     * @returns any Success
     * @throws ApiError
     */
    static verificationStore({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: CreateVerificationRequest;
    }): CancelablePromise<{
        data: VerificationResource;
    }>;
    /**
     * Modules\Verification\Http\Controllers\VerificationController@runGlobal
     * @returns get_api_verification_run_global_item_itemResponse Success
     * @throws ApiError
     */
    static getApiVerificationRunGlobalItemItem({ verification, task, xDomain, }: {
        verification: string;
        task: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<get_api_verification_run_global_item_itemResponse>;
    /**
     * Modules\Verification\Http\Controllers\VerificationController@run
     * @returns get_api_verification_run_item_itemResponse Success
     * @throws ApiError
     */
    static getApiVerificationRunItemItem({ verification, chain, xDomain, }: {
        verification: string;
        chain: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<get_api_verification_run_item_itemResponse>;
    /**
     * Modules\Verification\Http\Controllers\VerificationController@submit
     * @returns post_api_verification_submitResponse Success
     * @throws ApiError
     */
    static postApiVerificationSubmit({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: post_api_verification_submitBody;
    }): CancelablePromise<post_api_verification_submitResponse>;
    /**
     * Modules\Verification\Http\Controllers\VerificationController@show
     * @returns any Success
     * @throws ApiError
     */
    static verificationShow({ verification, xDomain, }: {
        /**
         * Bound to model Verification
         */
        verification: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: VerificationResource;
    }>;
    /**
     * Modules\Verification\Http\Controllers\VerificationController@update
     * @returns any Success
     * @throws ApiError
     */
    static verificationUpdate({ verification, xDomain, requestBody, }: {
        /**
         * Bound to model Verification
         */
        verification: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: UpdateVerificationRequest;
    }): CancelablePromise<{
        data: VerificationResource;
    }>;
    /**
     * Modules\Verification\Http\Controllers\VerificationController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static verificationDestroy({ verification, xDomain, }: {
        /**
         * Bound to model Verification
         */
        verification: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: VerificationResource;
    }>;
}
//# sourceMappingURL=ModulesVerificationService.d.ts.map