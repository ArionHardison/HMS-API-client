"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModulesVerificationService = void 0;
const OpenAPI_1 = require("../core/OpenAPI");
const request_1 = require("../core/request");
class ModulesVerificationService {
    /**
     * Modules\Verification\Http\Controllers\VerificationController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolVerificationAll({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/protocol/verification/all',
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
     * Modules\Verification\Http\Controllers\VerificationController@index
     * @returns any Success
     * @throws ApiError
     */
    static verificationIndex({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/verification',
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
     * Modules\Verification\Http\Controllers\VerificationController@store
     * @returns any Success
     * @throws ApiError
     */
    static verificationStore({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/verification',
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
     * Modules\Verification\Http\Controllers\VerificationController@runGlobal
     * @returns get_api_verification_run_global_item_itemResponse Success
     * @throws ApiError
     */
    static getApiVerificationRunGlobalItemItem({ verification, task, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/verification/run-global/{verification}/{task}',
            path: {
                'verification': verification,
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
     * Modules\Verification\Http\Controllers\VerificationController@run
     * @returns get_api_verification_run_item_itemResponse Success
     * @throws ApiError
     */
    static getApiVerificationRunItemItem({ verification, chain, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/verification/run/{verification}/{chain}',
            path: {
                'verification': verification,
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
     * Modules\Verification\Http\Controllers\VerificationController@submit
     * @returns post_api_verification_submitResponse Success
     * @throws ApiError
     */
    static postApiVerificationSubmit({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/verification/submit',
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
     * Modules\Verification\Http\Controllers\VerificationController@show
     * @returns any Success
     * @throws ApiError
     */
    static verificationShow({ verification, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/verification/{verification}',
            path: {
                'verification': verification,
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
     * Modules\Verification\Http\Controllers\VerificationController@update
     * @returns any Success
     * @throws ApiError
     */
    static verificationUpdate({ verification, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'PUT',
            url: '/api/verification/{verification}',
            path: {
                'verification': verification,
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
     * Modules\Verification\Http\Controllers\VerificationController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static verificationDestroy({ verification, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/verification/{verification}',
            path: {
                'verification': verification,
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
exports.ModulesVerificationService = ModulesVerificationService;
//# sourceMappingURL=ModulesVerificationService.js.map