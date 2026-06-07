import type { FinalizeSpeechRequest } from '../models/FinalizeSpeechRequest';
import type { FollowUpDataResource } from '../models/FollowUpDataResource';
import type { FollowUpMeetingResource } from '../models/FollowUpMeetingResource';
import type { FollowUpPaymentResource } from '../models/FollowUpPaymentResource';
import type { FollowUpRecommendationsResource } from '../models/FollowUpRecommendationsResource';
import type { FollowUpTranscribeJobResource } from '../models/FollowUpTranscribeJobResource';
import type { ProgramTimelineResource } from '../models/ProgramTimelineResource';
import type { VoiceRecordRequest } from '../models/VoiceRecordRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class ModulesFollowUpsService {
    /**
     * Modules\FollowUps\Http\Controllers\FollowUpsController@index
     * method index not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static followUpIndex({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<Record<string, any>>;
    /**
     * Modules\FollowUps\Http\Controllers\FollowUpsController@store
     * method store not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static followUpStore({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<Record<string, any>>;
    /**
     * Modules\FollowUps\Http\Controllers\FollowUpsController@finishFollowUp
     * @returns any Success
     * @throws ApiError
     */
    static getApiFollowUpFinishItem({ id, xDomain, }: {
        id: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: FollowUpDataResource;
    }>;
    /**
     * Modules\FollowUps\Http\Controllers\FollowUpsController@getCurrentFollowUp
     * @returns any Success
     * @throws ApiError
     */
    static getApiFollowUpGetCurrentFollowup({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: FollowUpDataResource;
    }>;
    /**
     * Modules\FollowUps\Http\Controllers\FollowUpsController@getData
     * @returns any Success
     * @throws ApiError
     */
    static getApiFollowUpGetDataItem({ chain, xDomain, }: {
        chain: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: FollowUpDataResource;
    }>;
    /**
     * Modules\FollowUps\Http\Controllers\FollowUpsController@getTimeline
     * @returns any Success
     * @throws ApiError
     */
    static getApiFollowUpGetTimelineItem({ chain, xDomain, }: {
        chain: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ProgramTimelineResource;
    }>;
    /**
     * Modules\FollowUps\Http\Controllers\FollowUpsController@handleRecommendation
     * @returns any Success
     * @throws ApiError
     */
    static getApiFollowUpHandleRecommendationItemItem({ recommendation, status, xDomain, }: {
        recommendation: string;
        status: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: FollowUpDataResource;
    }>;
    /**
     * Modules\FollowUps\Http\Controllers\FollowUpsController@getPayment
     * @returns any Success
     * @throws ApiError
     */
    static getApiFollowUpPaymentItem({ followup, xDomain, }: {
        /**
         * Bound to model FollowupMeeting
         */
        followup: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: FollowUpPaymentResource;
    }>;
    /**
     * Modules\FollowUps\Http\Controllers\FollowUpsController@recommendations
     * @returns any Success
     * @throws ApiError
     */
    static getApiFollowUpRecommendationsItem({ followup, xDomain, }: {
        /**
         * Bound to model FollowupMeeting
         */
        followup: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: FollowUpRecommendationsResource;
    }>;
    /**
     * Modules\FollowUps\Http\Controllers\FollowUpsController@run
     * @returns any Success
     * @throws ApiError
     */
    static getApiFollowUpRunItem({ chain, xDomain, }: {
        chain: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: FollowUpMeetingResource;
    }>;
    /**
     * Modules\FollowUps\Http\Controllers\FollowUpsController@finalizeSpeech
     * @returns any Success
     * @throws ApiError
     */
    static postApiFollowUpVoiceFinalize({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: FinalizeSpeechRequest;
    }): CancelablePromise<{
        data: FollowUpTranscribeJobResource;
    }>;
    /**
     * Modules\FollowUps\Http\Controllers\FollowUpsController@storeVoice
     * @returns any Success
     * @throws ApiError
     */
    static postApiFollowUpVoiceRecord({ xDomain, formData, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        formData: VoiceRecordRequest;
    }): CancelablePromise<{
        data: FollowUpTranscribeJobResource;
    }>;
    /**
     * Modules\FollowUps\Http\Controllers\FollowUpsController@show
     * method show not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static followUpShow({ followUp, xDomain, }: {
        followUp: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<Record<string, any>>;
    /**
     * Modules\FollowUps\Http\Controllers\FollowUpsController@update
     * method update not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static followUpUpdate({ followUp, xDomain, }: {
        followUp: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<Record<string, any>>;
    /**
     * Modules\FollowUps\Http\Controllers\FollowUpsController@destroy
     * method destroy not found in declared class; may be inherited
     * @returns any Success
     * @throws ApiError
     */
    static followUpDestroy({ followUp, xDomain, }: {
        followUp: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<Record<string, any>>;
}
//# sourceMappingURL=ModulesFollowUpsService.d.ts.map