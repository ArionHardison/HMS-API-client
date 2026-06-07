import type { post_api_v1_services_releaseResponse } from '../models/post_api_v1_services_releaseResponse';
import type { post_api_v1_services_reserveResponse } from '../models/post_api_v1_services_reserveResponse';
import type { post_api_v1_services_resolveResponse } from '../models/post_api_v1_services_resolveResponse';
import type { ReserveServiceSlotRequest } from '../models/ReserveServiceSlotRequest';
import type { ResolveServiceRequest } from '../models/ResolveServiceRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class ModulesServicesService {
    /**
     * Modules\Services\Http\Controllers\ServiceResolverController@release
     * @returns post_api_v1_services_releaseResponse Success
     * @throws ApiError
     */
    static postApiV1ServicesRelease({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: ReserveServiceSlotRequest;
    }): CancelablePromise<post_api_v1_services_releaseResponse>;
    /**
     * Modules\Services\Http\Controllers\ServiceResolverController@reserve
     * @returns post_api_v1_services_reserveResponse Success
     * @throws ApiError
     */
    static postApiV1ServicesReserve({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: ReserveServiceSlotRequest;
    }): CancelablePromise<post_api_v1_services_reserveResponse>;
    /**
     * Modules\Services\Http\Controllers\ServiceResolverController@resolve
     * @returns post_api_v1_services_resolveResponse Success
     * @throws ApiError
     */
    static postApiV1ServicesResolve({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: ResolveServiceRequest;
    }): CancelablePromise<post_api_v1_services_resolveResponse>;
}
//# sourceMappingURL=ModulesServicesService.d.ts.map