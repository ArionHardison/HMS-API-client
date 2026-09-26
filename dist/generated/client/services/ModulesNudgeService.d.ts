import type { ChekInResponseResource } from '../models/ChekInResponseResource';
import type { CreateNudgeRequest } from '../models/CreateNudgeRequest';
import type { NudgeAuthResource } from '../models/NudgeAuthResource';
import type { NudgeCheckInEmailRequest } from '../models/NudgeCheckInEmailRequest';
import type { NudgeResource } from '../models/NudgeResource';
import type { UpdateNudgeRequest } from '../models/UpdateNudgeRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class ModulesNudgeService {
    /**
     * Modules\Nudge\Http\Controllers\NudgeController@index
     * @returns any Success
     * @throws ApiError
     */
    static nudgeIndex({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: Array<NudgeResource>;
        links?: Record<string, any>;
        meta?: Record<string, any>;
    }>;
    /**
     * Modules\Nudge\Http\Controllers\NudgeController@store
     * @returns any Success
     * @throws ApiError
     */
    static nudgeStore({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: CreateNudgeRequest;
    }): CancelablePromise<{
        data: NudgeResource;
    }>;
    /**
     * Modules\Nudge\Http\Controllers\NudgeController@checkInEmail
     * @returns any Success
     * @throws ApiError
     */
    static postApiNudgeCheckinEmail({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: NudgeCheckInEmailRequest;
    }): CancelablePromise<{
        data: ChekInResponseResource;
    }>;
    /**
     * Modules\Nudge\Http\Controllers\NudgeController@checkInSms
     * @returns any Success
     * @throws ApiError
     */
    static postApiNudgeCheckinSms({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ChekInResponseResource;
    }>;
    /**
     * Modules\Nudge\Http\Controllers\NudgeController@checkSecret
     * @returns any Success
     * @throws ApiError
     */
    static getApiNudgeCheckItem({ secret, xDomain, }: {
        secret: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: NudgeAuthResource;
    }>;
    /**
     * Modules\Nudge\Http\Controllers\NudgeController@deleteImage
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiNudgeImageItem({ nudge, xDomain, }: {
        /**
         * Bound to model Nudge
         */
        nudge: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: NudgeResource;
    }>;
    /**
     * Modules\Nudge\Http\Controllers\NudgeController@show
     * @returns any Success
     * @throws ApiError
     */
    static nudgeShow({ nudge, xDomain, }: {
        /**
         * Bound to model Nudge
         */
        nudge: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: NudgeResource;
    }>;
    /**
     * Modules\Nudge\Http\Controllers\NudgeController@update
     * @returns any Success
     * @throws ApiError
     */
    static nudgeUpdate({ nudge, xDomain, requestBody, }: {
        /**
         * Bound to model Nudge
         */
        nudge: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: UpdateNudgeRequest;
    }): CancelablePromise<{
        data: NudgeResource;
    }>;
    /**
     * Modules\Nudge\Http\Controllers\NudgeController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static nudgeDestroy({ nudge, xDomain, }: {
        /**
         * Bound to model Nudge
         */
        nudge: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: NudgeResource;
    }>;
    /**
     * Modules\Nudge\Http\Controllers\NudgeController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolNudgeAll({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: NudgeResource;
    }>;
}
//# sourceMappingURL=ModulesNudgeService.d.ts.map