import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ModulesApplicationService {
    /**
     * Modules\Application\Http\Controllers\ApplicationController@index
     * @returns any Success
     * @throws ApiError
     */
    static applicationIndex({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/application',
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
     * Modules\Application\Http\Controllers\ApplicationController@store
     * @returns any Success
     * @throws ApiError
     */
    static applicationStore({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/application',
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
     * Modules\Application\Http\Controllers\ApplicationController@runGlobal
     * @returns get_api_application_run_global_item_itemResponse Success
     * @throws ApiError
     */
    static getApiApplicationRunGlobalItemItem({ application, task, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/application/run-global/{application}/{task}',
            path: {
                'application': application,
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
     * Modules\Application\Http\Controllers\ApplicationController@run
     * @returns get_api_application_run_item_itemResponse Success
     * @throws ApiError
     */
    static getApiApplicationRunItemItem({ application, chain, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/application/run/{application}/{chain}',
            path: {
                'application': application,
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
     * Modules\Application\Http\Controllers\ApplicationController@submit
     * @returns post_api_application_submitResponse Success
     * @throws ApiError
     */
    static postApiApplicationSubmit({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/application/submit',
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
     * Modules\Application\Http\Controllers\ApplicationController@show
     * @returns any Success
     * @throws ApiError
     */
    static applicationShow({ application, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/application/{application}',
            path: {
                'application': application,
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
     * Modules\Application\Http\Controllers\ApplicationController@update
     * @returns any Success
     * @throws ApiError
     */
    static applicationUpdate({ application, xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/application/{application}',
            path: {
                'application': application,
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
     * Modules\Application\Http\Controllers\ApplicationController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static applicationDestroy({ application, xDomain, }) {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/application/{application}',
            path: {
                'application': application,
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
     * Modules\Application\Http\Controllers\ApplicationController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolApplicationAll({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/protocol/application/all',
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
//# sourceMappingURL=ModulesApplicationService.js.map