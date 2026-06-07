import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ModulesReferralService {
    /**
     * Modules\Referral\Http\Controllers\ReferralController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolReferralAll({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/protocol/referral/all',
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
     * Modules\Referral\Http\Controllers\ReferralController@index
     * @returns any Success
     * @throws ApiError
     */
    static referralIndex({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/referral',
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
     * Modules\Referral\Http\Controllers\ReferralController@store
     * @returns any Success
     * @throws ApiError
     */
    static referralStore({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/referral',
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
     * Modules\Referral\Http\Controllers\ReferralController@confirm
     * @returns post_api_referral_confirmResponse Success
     * @throws ApiError
     */
    static postApiReferralConfirm({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/referral/confirm',
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
     * Modules\Referral\Http\Controllers\ReferralController@runGlobal
     * @returns get_api_referral_run_global_item_itemResponse Success
     * @throws ApiError
     */
    static getApiReferralRunGlobalItemItem({ referral, task, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/referral/run-global/{referral}/{task}',
            path: {
                'referral': referral,
                'task': task,
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
     * Modules\Referral\Http\Controllers\ReferralController@run
     * @returns get_api_referral_run_item_itemResponse Success
     * @throws ApiError
     */
    static getApiReferralRunItemItem({ referral, chain, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/referral/run/{referral}/{chain}',
            path: {
                'referral': referral,
                'chain': chain,
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
     * Modules\Referral\Http\Controllers\ReferralController@show
     * @returns any Success
     * @throws ApiError
     */
    static referralShow({ referral, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/referral/{referral}',
            path: {
                'referral': referral,
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
     * Modules\Referral\Http\Controllers\ReferralController@update
     * @returns any Success
     * @throws ApiError
     */
    static referralUpdate({ referral, xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/referral/{referral}',
            path: {
                'referral': referral,
            },
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
     * Modules\Referral\Http\Controllers\ReferralController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static referralDestroy({ referral, xDomain, }) {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/referral/{referral}',
            path: {
                'referral': referral,
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
//# sourceMappingURL=ModulesReferralService.js.map