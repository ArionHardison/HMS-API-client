"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModulesAppealService = void 0;
const OpenAPI_1 = require("../core/OpenAPI");
const request_1 = require("../core/request");
class ModulesAppealService {
    /**
     * Modules\Appeal\Http\Controllers\AppealController@index
     * @returns any Success
     * @throws ApiError
     */
    static appealIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/appeal',
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
     * Modules\Appeal\Http\Controllers\AppealController@store
     * @returns any Success
     * @throws ApiError
     */
    static appealStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/appeal',
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
     * Modules\Appeal\Http\Controllers\AppealController@runGlobal
     * @returns get_api_appeal_run_global_item_itemResponse Success
     * @throws ApiError
     */
    static getApiAppealRunGlobalItemItem({ appeal, task, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/appeal/run-global/{appeal}/{task}',
            path: {
                'appeal': appeal,
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
     * Modules\Appeal\Http\Controllers\AppealController@run
     * @returns get_api_appeal_run_item_itemResponse Success
     * @throws ApiError
     */
    static getApiAppealRunItemItem({ appeal, chain, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/appeal/run/{appeal}/{chain}',
            path: {
                'appeal': appeal,
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
     * Modules\Appeal\Http\Controllers\AppealController@submit
     * @returns post_api_appeal_submitResponse Success
     * @throws ApiError
     */
    static postApiAppealSubmit({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/appeal/submit',
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
     * Modules\Appeal\Http\Controllers\AppealController@show
     * @returns any Success
     * @throws ApiError
     */
    static appealShow({ appeal, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/appeal/{appeal}',
            path: {
                'appeal': appeal,
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
     * Modules\Appeal\Http\Controllers\AppealController@update
     * @returns any Success
     * @throws ApiError
     */
    static appealUpdate({ appeal, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/appeal/{appeal}',
            path: {
                'appeal': appeal,
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
     * Modules\Appeal\Http\Controllers\AppealController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static appealDestroy({ appeal, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/appeal/{appeal}',
            path: {
                'appeal': appeal,
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
     * Modules\Appeal\Http\Controllers\AppealController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolAppealAll({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/appeal/all',
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
exports.ModulesAppealService = ModulesAppealService;
//# sourceMappingURL=ModulesAppealService.js.map