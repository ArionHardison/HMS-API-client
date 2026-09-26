"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModulesKpiService = void 0;
const OpenAPI_1 = require("../core/OpenAPI");
const request_1 = require("../core/request");
class ModulesKpiService {
    /**
     * Modules\KPI\Http\Controllers\KPISetupController@getSetup
     * @returns any Success
     * @throws ApiError
     */
    static getApiKpiGetSetupItemItem({ chain, protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/kpi/get-setup/{chain}/{protocol}',
            path: {
                'chain': chain,
                'protocol': protocol,
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
     * Modules\KPI\Http\Controllers\KPISetupController@getStepParameters
     * @returns any Success
     * @throws ApiError
     */
    static getApiKpiGetItem({ chain, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/kpi/get/{chain}',
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
     * Modules\KPI\Http\Controllers\KPISetupController@removeRule
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiKpiRemoveRuleItem({ rule, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'DELETE',
            url: '/api/kpi/remove-rule/{rule}',
            path: {
                'rule': rule,
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
     * Modules\KPI\Http\Controllers\KPISetupController@saveChainItemKPISettings
     * @returns any Success
     * @throws ApiError
     */
    static postApiKpiSave({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/kpi/save',
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
     * Modules\KPI\Http\Controllers\KPISetupController@saveRoundResults
     * @returns any Success
     * @throws ApiError
     */
    static postApiKpiSaveRoundResults({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/kpi/save-round-results',
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
     * Modules\KPI\Http\Controllers\KPISetupController@saveSetup
     * @returns any Success
     * @throws ApiError
     */
    static postApiKpiSaveSetup({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/kpi/save-setup',
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
     * Modules\KPI\Http\Controllers\KPISetupController@validateParameters
     * @returns any Success
     * @throws ApiError
     */
    static postApiKpiValidateParameters({ xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/kpi/validate-parameters',
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
     * Modules\KPI\Http\Controllers\KPIController@getOnboarding
     * @returns any Success
     * @throws ApiError
     */
    static getApiOnboardingGetItem({ protocol, xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/onboarding/get/{protocol}',
            path: {
                'protocol': protocol,
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
     * Modules\KPI\Http\Controllers\KPIController@storeOnboarding
     * @returns any Success
     * @throws ApiError
     */
    static postApiOnboardingSaveItem({ protocol, xDomain, requestBody, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/onboarding/save/{protocol}',
            path: {
                'protocol': protocol,
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
     * Modules\KPI\Http\Controllers\UserDeviceController@getUserDevices
     * @returns any Success
     * @throws ApiError
     */
    static getApiUserDevicesList({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/user-devices/list',
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
     * Modules\KPI\Http\Controllers\WithingsController@redirectToWithings
     * @returns any Success
     * @throws ApiError
     */
    static getApiWithingsAuth({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/withings/auth',
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
     * Modules\KPI\Http\Controllers\WithingsController@handleCallback
     * @returns any Success
     * @throws ApiError
     */
    static getApiWithingsCallback({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'GET',
            url: '/api/withings/callback',
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
     * Modules\KPI\Http\Controllers\WithingsController@getData
     * @returns any Success
     * @throws ApiError
     */
    static postApiWithingsWebhook({ xDomain, }) {
        return (0, request_1.request)(OpenAPI_1.OpenAPI, {
            method: 'POST',
            url: '/api/withings/webhook',
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
exports.ModulesKpiService = ModulesKpiService;
//# sourceMappingURL=ModulesKpiService.js.map