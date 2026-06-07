import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ModulesNudgeService {
    /**
     * Modules\Nudge\Http\Controllers\NudgeController@index
     * @returns any Success
     * @throws ApiError
     */
    static nudgeIndex({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/nudge',
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
     * Modules\Nudge\Http\Controllers\NudgeController@store
     * @returns any Success
     * @throws ApiError
     */
    static nudgeStore({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/nudge',
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
     * Modules\Nudge\Http\Controllers\NudgeController@checkInEmail
     * @returns any Success
     * @throws ApiError
     */
    static postApiNudgeCheckinEmail({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/nudge-checkin/email',
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
     * Modules\Nudge\Http\Controllers\NudgeController@checkInSms
     * @returns any Success
     * @throws ApiError
     */
    static postApiNudgeCheckinSms({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/nudge-checkin/sms',
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
     * Modules\Nudge\Http\Controllers\NudgeController@checkSecret
     * @returns any Success
     * @throws ApiError
     */
    static getApiNudgeCheckItem({ secret, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/nudge/check/{secret}',
            path: {
                'secret': secret,
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
     * Modules\Nudge\Http\Controllers\NudgeController@deleteImage
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiNudgeImageItem({ nudge, xDomain, }) {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/nudge/image/{nudge}',
            path: {
                'nudge': nudge,
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
     * Modules\Nudge\Http\Controllers\NudgeController@show
     * @returns any Success
     * @throws ApiError
     */
    static nudgeShow({ nudge, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/nudge/{nudge}',
            path: {
                'nudge': nudge,
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
     * Modules\Nudge\Http\Controllers\NudgeController@update
     * @returns any Success
     * @throws ApiError
     */
    static nudgeUpdate({ nudge, xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/nudge/{nudge}',
            path: {
                'nudge': nudge,
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
     * Modules\Nudge\Http\Controllers\NudgeController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static nudgeDestroy({ nudge, xDomain, }) {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/nudge/{nudge}',
            path: {
                'nudge': nudge,
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
     * Modules\Nudge\Http\Controllers\NudgeController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolNudgeAll({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/protocol/nudge/all',
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
//# sourceMappingURL=ModulesNudgeService.js.map