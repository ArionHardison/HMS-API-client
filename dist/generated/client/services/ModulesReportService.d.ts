import type { CreateReportRequest } from '../models/CreateReportRequest';
import type { get_api_report_run_global_item_itemResponse } from '../models/get_api_report_run_global_item_itemResponse';
import type { get_api_report_run_item_itemResponse } from '../models/get_api_report_run_item_itemResponse';
import type { post_api_report_submitBody } from '../models/post_api_report_submitBody';
import type { post_api_report_submitResponse } from '../models/post_api_report_submitResponse';
import type { ReportResource } from '../models/ReportResource';
import type { UpdateReportRequest } from '../models/UpdateReportRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class ModulesReportService {
    /**
     * Modules\Report\Http\Controllers\ReportController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolReportAll({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ReportResource;
    }>;
    /**
     * Modules\Report\Http\Controllers\ReportController@index
     * @returns any Success
     * @throws ApiError
     */
    static reportIndex({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: Array<ReportResource>;
        links?: Record<string, any>;
        meta?: Record<string, any>;
    }>;
    /**
     * Modules\Report\Http\Controllers\ReportController@store
     * @returns any Success
     * @throws ApiError
     */
    static reportStore({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: CreateReportRequest;
    }): CancelablePromise<{
        data: ReportResource;
    }>;
    /**
     * Modules\Report\Http\Controllers\ReportController@runGlobal
     * @returns get_api_report_run_global_item_itemResponse Success
     * @throws ApiError
     */
    static getApiReportRunGlobalItemItem({ report, task, xDomain, }: {
        report: string;
        task: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<get_api_report_run_global_item_itemResponse>;
    /**
     * Modules\Report\Http\Controllers\ReportController@run
     * @returns get_api_report_run_item_itemResponse Success
     * @throws ApiError
     */
    static getApiReportRunItemItem({ report, chain, xDomain, }: {
        report: string;
        chain: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<get_api_report_run_item_itemResponse>;
    /**
     * Modules\Report\Http\Controllers\ReportController@submit
     * @returns post_api_report_submitResponse Success
     * @throws ApiError
     */
    static postApiReportSubmit({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: post_api_report_submitBody;
    }): CancelablePromise<post_api_report_submitResponse>;
    /**
     * Modules\Report\Http\Controllers\ReportController@show
     * @returns any Success
     * @throws ApiError
     */
    static reportShow({ report, xDomain, }: {
        /**
         * Bound to model Report
         */
        report: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ReportResource;
    }>;
    /**
     * Modules\Report\Http\Controllers\ReportController@update
     * @returns any Success
     * @throws ApiError
     */
    static reportUpdate({ report, xDomain, requestBody, }: {
        /**
         * Bound to model Report
         */
        report: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: UpdateReportRequest;
    }): CancelablePromise<{
        data: ReportResource;
    }>;
    /**
     * Modules\Report\Http\Controllers\ReportController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static reportDestroy({ report, xDomain, }: {
        /**
         * Bound to model Report
         */
        report: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ReportResource;
    }>;
}
//# sourceMappingURL=ModulesReportService.d.ts.map