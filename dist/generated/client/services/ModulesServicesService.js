"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModulesServicesService = void 0;
const OpenAPI_1 = require("../core/OpenAPI");
const request_1 = require("../core/request");
class ModulesServicesService {
    /**
     * Modules\Services\Http\Controllers\ServiceResolverController@release
     * @returns post_api_v1_services_releaseResponse Success
     * @throws ApiError
     */
    static postApiV1ServicesRelease({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/services/release',
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
     * Modules\Services\Http\Controllers\ServiceResolverController@reserve
     * @returns post_api_v1_services_reserveResponse Success
     * @throws ApiError
     */
    static postApiV1ServicesReserve({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/services/reserve',
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
     * Modules\Services\Http\Controllers\ServiceResolverController@resolve
     * @returns post_api_v1_services_resolveResponse Success
     * @throws ApiError
     */
    static postApiV1ServicesResolve({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/v1/services/resolve',
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
}
exports.ModulesServicesService = ModulesServicesService;
//# sourceMappingURL=ModulesServicesService.js.map