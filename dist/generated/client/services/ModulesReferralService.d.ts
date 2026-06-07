import type { CreateReferralRequest } from '../models/CreateReferralRequest';
import type { get_api_referral_run_global_item_itemResponse } from '../models/get_api_referral_run_global_item_itemResponse';
import type { get_api_referral_run_item_itemResponse } from '../models/get_api_referral_run_item_itemResponse';
import type { post_api_referral_confirmBody } from '../models/post_api_referral_confirmBody';
import type { post_api_referral_confirmResponse } from '../models/post_api_referral_confirmResponse';
import type { ReferralResource } from '../models/ReferralResource';
import type { UpdateReferralRequest } from '../models/UpdateReferralRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class ModulesReferralService {
    /**
     * Modules\Referral\Http\Controllers\ReferralController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolReferralAll({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ReferralResource;
    }>;
    /**
     * Modules\Referral\Http\Controllers\ReferralController@index
     * @returns any Success
     * @throws ApiError
     */
    static referralIndex({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: Array<ReferralResource>;
        links?: Record<string, any>;
        meta?: Record<string, any>;
    }>;
    /**
     * Modules\Referral\Http\Controllers\ReferralController@store
     * @returns any Success
     * @throws ApiError
     */
    static referralStore({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: CreateReferralRequest;
    }): CancelablePromise<{
        data: ReferralResource;
    }>;
    /**
     * Modules\Referral\Http\Controllers\ReferralController@confirm
     * @returns post_api_referral_confirmResponse Success
     * @throws ApiError
     */
    static postApiReferralConfirm({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: post_api_referral_confirmBody;
    }): CancelablePromise<post_api_referral_confirmResponse>;
    /**
     * Modules\Referral\Http\Controllers\ReferralController@runGlobal
     * @returns get_api_referral_run_global_item_itemResponse Success
     * @throws ApiError
     */
    static getApiReferralRunGlobalItemItem({ referral, task, xDomain, }: {
        referral: string;
        task: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<get_api_referral_run_global_item_itemResponse>;
    /**
     * Modules\Referral\Http\Controllers\ReferralController@run
     * @returns get_api_referral_run_item_itemResponse Success
     * @throws ApiError
     */
    static getApiReferralRunItemItem({ referral, chain, xDomain, }: {
        referral: string;
        chain: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<get_api_referral_run_item_itemResponse>;
    /**
     * Modules\Referral\Http\Controllers\ReferralController@show
     * @returns any Success
     * @throws ApiError
     */
    static referralShow({ referral, xDomain, }: {
        /**
         * Bound to model Referral
         */
        referral: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ReferralResource;
    }>;
    /**
     * Modules\Referral\Http\Controllers\ReferralController@update
     * @returns any Success
     * @throws ApiError
     */
    static referralUpdate({ referral, xDomain, requestBody, }: {
        /**
         * Bound to model Referral
         */
        referral: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: UpdateReferralRequest;
    }): CancelablePromise<{
        data: ReferralResource;
    }>;
    /**
     * Modules\Referral\Http\Controllers\ReferralController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static referralDestroy({ referral, xDomain, }: {
        /**
         * Bound to model Referral
         */
        referral: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ReferralResource;
    }>;
}
//# sourceMappingURL=ModulesReferralService.d.ts.map