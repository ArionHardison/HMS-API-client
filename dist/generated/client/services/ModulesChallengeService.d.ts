import type { AttachedChallengeResource } from '../models/AttachedChallengeResource';
import type { ChallengeResource } from '../models/ChallengeResource';
import type { ChallengeTaskResource } from '../models/ChallengeTaskResource';
import type { ChallengeTaskResultResource } from '../models/ChallengeTaskResultResource';
import type { CreateChallengeRequest } from '../models/CreateChallengeRequest';
import type { RunChallengeRequest } from '../models/RunChallengeRequest';
import type { RunGlobalModuleChallengeRequest } from '../models/RunGlobalModuleChallengeRequest';
import type { StartChallengeTaskRequest } from '../models/StartChallengeTaskRequest';
import type { UpdateChallengeRequest } from '../models/UpdateChallengeRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class ModulesChallengeService {
    /**
     * Modules\Challenge\Http\Controllers\ChallengeController@index
     * @returns any Success
     * @throws ApiError
     */
    static challengeIndex({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: Array<ChallengeResource>;
        links?: Record<string, any>;
        meta?: Record<string, any>;
    }>;
    /**
     * Modules\Challenge\Http\Controllers\ChallengeController@store
     * @returns any Success
     * @throws ApiError
     */
    static challengeStore({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: CreateChallengeRequest;
    }): CancelablePromise<{
        data: ChallengeResource;
    }>;
    /**
     * Modules\Challenge\Http\Controllers\AttachedChallengeController@finish
     * @returns any Success
     * @throws ApiError
     */
    static getApiChallengeFinishItem({ attached, xDomain, }: {
        attached: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: AttachedChallengeResource;
    }>;
    /**
     * Modules\Challenge\Http\Controllers\AttachedChallengeController@getGlobalTasks
     * @returns any Success
     * @throws ApiError
     */
    static getApiChallengeGetChallengeGlobalTasksItemItem({ challenge, task, xDomain, }: {
        challenge: string;
        task: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ChallengeTaskResource;
    }>;
    /**
     * Modules\Challenge\Http\Controllers\AttachedChallengeController@getTasks
     * @returns any Success
     * @throws ApiError
     */
    static getApiChallengeGetChallengeTasksItemItem({ challenge, chain, xDomain, }: {
        challenge: string;
        chain: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ChallengeTaskResource;
    }>;
    /**
     * Modules\Challenge\Http\Controllers\AttachedChallengeController@get
     * @returns any Success
     * @throws ApiError
     */
    static getApiChallengeGetChallengeItemItem({ challenge, chain, xDomain, }: {
        challenge: string;
        chain: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: AttachedChallengeResource;
    }>;
    /**
     * Modules\Challenge\Http\Controllers\AttachedChallengeController@getGlobalChallenge
     * @returns any Success
     * @throws ApiError
     */
    static getApiChallengeGetGlobalChallengeItemItem({ challenge, task, xDomain, }: {
        challenge: string;
        task: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: AttachedChallengeResource;
    }>;
    /**
     * Modules\Challenge\Http\Controllers\ChallengeController@getTypes
     * @returns any Success
     * @throws ApiError
     */
    static getApiChallengeGetTypes({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ChallengeResource;
    }>;
    /**
     * Modules\Challenge\Http\Controllers\AttachedChallengeController@recordVideo
     * method recordVideo not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static postApiChallengeRecordVideo({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<Record<string, any>>;
    /**
     * Modules\Challenge\Http\Controllers\AttachedChallengeController@run
     * @returns any Success
     * @throws ApiError
     */
    static postApiChallengeRun({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: RunChallengeRequest;
    }): CancelablePromise<{
        data: AttachedChallengeResource;
    }>;
    /**
     * Modules\Challenge\Http\Controllers\AttachedChallengeController@runGlobal
     * @returns any Success
     * @throws ApiError
     */
    static postApiChallengeRunGlobal({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: RunGlobalModuleChallengeRequest;
    }): CancelablePromise<{
        data: AttachedChallengeResource;
    }>;
    /**
     * Modules\Challenge\Http\Controllers\AttachedChallengeController@setResult
     * @returns any Success
     * @throws ApiError
     */
    static postApiChallengeSetResultItem({ result, xDomain, }: {
        /**
         * Bound to model AttachedChallengeTaskResults
         */
        result: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ChallengeTaskResultResource;
    }>;
    /**
     * Modules\Challenge\Http\Controllers\AttachedChallengeController@startTask
     * @returns any Success
     * @throws ApiError
     */
    static postApiChallengeStartTask({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: StartChallengeTaskRequest;
    }): CancelablePromise<{
        data: ChallengeTaskResource;
    }>;
    /**
     * Modules\Challenge\Http\Controllers\ChallengeController@destroyTask
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiChallengeTaskDestroyItem({ task, xDomain, }: {
        /**
         * Bound to model ChallengeTask
         */
        task: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ChallengeTaskResource;
    }>;
    /**
     * Modules\Challenge\Http\Controllers\ChallengeController@show
     * @returns any Success
     * @throws ApiError
     */
    static challengeShow({ challenge, xDomain, }: {
        /**
         * Bound to model Challenge
         */
        challenge: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ChallengeResource;
    }>;
    /**
     * Modules\Challenge\Http\Controllers\ChallengeController@update
     * @returns any Success
     * @throws ApiError
     */
    static challengeUpdate({ challenge, xDomain, requestBody, }: {
        /**
         * Bound to model Challenge
         */
        challenge: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: UpdateChallengeRequest;
    }): CancelablePromise<{
        data: ChallengeResource;
    }>;
    /**
     * Modules\Challenge\Http\Controllers\ChallengeController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static challengeDestroy({ challenge, xDomain, }: {
        /**
         * Bound to model Challenge
         */
        challenge: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ChallengeResource;
    }>;
    /**
     * Modules\Challenge\Http\Controllers\ChallengeController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolChallengeAll({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ChallengeResource;
    }>;
}
//# sourceMappingURL=ModulesChallengeService.d.ts.map