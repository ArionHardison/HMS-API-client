import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ModulesReportService {
    /**
     * Modules\Report\Http\Controllers\ReportController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolReportAll({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/protocol/report/all',
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
     * Modules\Report\Http\Controllers\ReportController@index
     * @returns any Success
     * @throws ApiError
     */
    static reportIndex({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/report',
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
     * Modules\Report\Http\Controllers\ReportController@store
     * @returns any Success
     * @throws ApiError
     */
    static reportStore({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/report',
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
     * Modules\Report\Http\Controllers\ReportController@runGlobal
     * @returns get_api_report_run_global_item_itemResponse Success
     * @throws ApiError
     */
    static getApiReportRunGlobalItemItem({ report, task, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/report/run-global/{report}/{task}',
            path: {
                'report': report,
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
     * Modules\Report\Http\Controllers\ReportController@run
     * @returns get_api_report_run_item_itemResponse Success
     * @throws ApiError
     */
    static getApiReportRunItemItem({ report, chain, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/report/run/{report}/{chain}',
            path: {
                'report': report,
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
     * Modules\Report\Http\Controllers\ReportController@submit
     * @returns post_api_report_submitResponse Success
     * @throws ApiError
     */
    static postApiReportSubmit({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/report/submit',
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
     * Modules\Report\Http\Controllers\ReportController@show
     * @returns any Success
     * @throws ApiError
     */
    static reportShow({ report, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/report/{report}',
            path: {
                'report': report,
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
     * Modules\Report\Http\Controllers\ReportController@update
     * @returns any Success
     * @throws ApiError
     */
    static reportUpdate({ report, xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/report/{report}',
            path: {
                'report': report,
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
     * Modules\Report\Http\Controllers\ReportController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static reportDestroy({ report, xDomain, }) {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/report/{report}',
            path: {
                'report': report,
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
//# sourceMappingURL=ModulesReportService.js.map