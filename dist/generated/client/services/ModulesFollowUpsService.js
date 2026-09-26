"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModulesFollowUpsService = void 0;
const OpenAPI_1 = require("../core/OpenAPI");
const request_1 = require("../core/request");
class ModulesFollowUpsService {
    /**
     * Modules\FollowUps\Http\Controllers\FollowUpsController@index
     * method index not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static followUpIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
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
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
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
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
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
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
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
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
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
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
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
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
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
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
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
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
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
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
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
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
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
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
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
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
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
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
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
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
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
exports.ModulesFollowUpsService = ModulesFollowUpsService;
//# sourceMappingURL=ModulesFollowUpsService.js.map