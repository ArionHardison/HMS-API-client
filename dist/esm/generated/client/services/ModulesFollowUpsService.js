import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ModulesFollowUpsService {
    /**
     * Modules\FollowUps\Http\Controllers\FollowUpsController@index
     * method index not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static followUpIndex({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/follow-up',
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
     * Modules\FollowUps\Http\Controllers\FollowUpsController@store
     * method store not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static followUpStore({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/follow-up',
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
     * Modules\FollowUps\Http\Controllers\FollowUpsController@finishFollowUp
     * @returns any Success
     * @throws ApiError
     */
    static getApiFollowUpFinishItem({ id, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/follow-up/finish/{id}',
            path: {
                'id': id,
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
     * Modules\FollowUps\Http\Controllers\FollowUpsController@getCurrentFollowUp
     * @returns any Success
     * @throws ApiError
     */
    static getApiFollowUpGetCurrentFollowup({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/follow-up/get-current-followup',
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
     * Modules\FollowUps\Http\Controllers\FollowUpsController@getData
     * @returns any Success
     * @throws ApiError
     */
    static getApiFollowUpGetDataItem({ chain, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/follow-up/get-data/{chain}',
            path: {
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
     * Modules\FollowUps\Http\Controllers\FollowUpsController@getTimeline
     * @returns any Success
     * @throws ApiError
     */
    static getApiFollowUpGetTimelineItem({ chain, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/follow-up/get-timeline/{chain}',
            path: {
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
     * Modules\FollowUps\Http\Controllers\FollowUpsController@handleRecommendation
     * @returns any Success
     * @throws ApiError
     */
    static getApiFollowUpHandleRecommendationItemItem({ recommendation, status, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/follow-up/handle-recommendation/{recommendation}/{status}',
            path: {
                'recommendation': recommendation,
                'status': status,
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
     * Modules\FollowUps\Http\Controllers\FollowUpsController@getPayment
     * @returns any Success
     * @throws ApiError
     */
    static getApiFollowUpPaymentItem({ followup, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/follow-up/payment/{followup}',
            path: {
                'followup': followup,
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
     * Modules\FollowUps\Http\Controllers\FollowUpsController@recommendations
     * @returns any Success
     * @throws ApiError
     */
    static getApiFollowUpRecommendationsItem({ followup, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/follow-up/recommendations/{followup}',
            path: {
                'followup': followup,
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
     * Modules\FollowUps\Http\Controllers\FollowUpsController@run
     * @returns any Success
     * @throws ApiError
     */
    static getApiFollowUpRunItem({ chain, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/follow-up/run/{chain}',
            path: {
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
     * Modules\FollowUps\Http\Controllers\FollowUpsController@finalizeSpeech
     * @returns any Success
     * @throws ApiError
     */
    static postApiFollowUpVoiceFinalize({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/follow-up/voice-finalize',
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
     * Modules\FollowUps\Http\Controllers\FollowUpsController@storeVoice
     * @returns any Success
     * @throws ApiError
     */
    static postApiFollowUpVoiceRecord({ xDomain, formData, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/follow-up/voice-record',
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
     * Modules\FollowUps\Http\Controllers\FollowUpsController@show
     * method show not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static followUpShow({ followUp, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/follow-up/{follow_up}',
            path: {
                'follow_up': followUp,
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
     * Modules\FollowUps\Http\Controllers\FollowUpsController@update
     * method update not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static followUpUpdate({ followUp, xDomain, }) {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/follow-up/{follow_up}',
            path: {
                'follow_up': followUp,
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
     * Modules\FollowUps\Http\Controllers\FollowUpsController@destroy
     * method destroy not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static followUpDestroy({ followUp, xDomain, }) {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/follow-up/{follow_up}',
            path: {
                'follow_up': followUp,
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
//# sourceMappingURL=ModulesFollowUpsService.js.map