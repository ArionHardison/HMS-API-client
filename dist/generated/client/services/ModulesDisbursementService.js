"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModulesDisbursementService = void 0;
const OpenAPI_1 = require("../core/OpenAPI");
const request_1 = require("../core/request");
class ModulesDisbursementService {
    /**
     * Modules\Disbursement\Http\Controllers\DisbursementController@index
     * @returns any Success
     * @throws ApiError
     */
    static disbursementIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/disbursement',
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
     * Modules\Disbursement\Http\Controllers\DisbursementController@store
     * @returns any Success
     * @throws ApiError
     */
    static disbursementStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/disbursement',
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
     * Modules\Disbursement\Http\Controllers\DisbursementController@confirm
     * @returns post_api_disbursement_confirmResponse Success
     * @throws ApiError
     */
    static postApiDisbursementConfirm({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/disbursement/confirm',
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
     * Modules\Disbursement\Http\Controllers\DisbursementController@runGlobal
     * @returns get_api_disbursement_run_global_item_itemResponse Success
     * @throws ApiError
     */
    static getApiDisbursementRunGlobalItemItem({ disbursement, task, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/disbursement/run-global/{disbursement}/{task}',
            path: {
                'disbursement': disbursement,
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
     * Modules\Disbursement\Http\Controllers\DisbursementController@run
     * @returns get_api_disbursement_run_item_itemResponse Success
     * @throws ApiError
     */
    static getApiDisbursementRunItemItem({ disbursement, chain, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/disbursement/run/{disbursement}/{chain}',
            path: {
                'disbursement': disbursement,
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
     * Modules\Disbursement\Http\Controllers\DisbursementController@show
     * @returns any Success
     * @throws ApiError
     */
    static disbursementShow({ disbursement, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/disbursement/{disbursement}',
            path: {
                'disbursement': disbursement,
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
     * Modules\Disbursement\Http\Controllers\DisbursementController@update
     * @returns any Success
     * @throws ApiError
     */
    static disbursementUpdate({ disbursement, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/disbursement/{disbursement}',
            path: {
                'disbursement': disbursement,
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
     * Modules\Disbursement\Http\Controllers\DisbursementController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static disbursementDestroy({ disbursement, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/disbursement/{disbursement}',
            path: {
                'disbursement': disbursement,
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
     * Modules\Disbursement\Http\Controllers\DisbursementController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolDisbursementAll({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/disbursement/all',
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
exports.ModulesDisbursementService = ModulesDisbursementService;
//# sourceMappingURL=ModulesDisbursementService.js.map