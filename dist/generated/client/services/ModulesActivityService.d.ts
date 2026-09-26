import type { ActivityCalendarBookingItemsResource } from '../models/ActivityCalendarBookingItemsResource';
import type { ActivityCalendarBookingsResource } from '../models/ActivityCalendarBookingsResource';
import type { ActivityLocationBookingResource } from '../models/ActivityLocationBookingResource';
import type { ActivityLocationInstanceResource } from '../models/ActivityLocationInstanceResource';
import type { ActivityLocationResource } from '../models/ActivityLocationResource';
import type { ActivityPendingRequestsResource } from '../models/ActivityPendingRequestsResource';
import type { ActivityProvidersResource } from '../models/ActivityProvidersResource';
import type { ActivitySearchResource } from '../models/ActivitySearchResource';
import type { ActivityServiceFinishedResource } from '../models/ActivityServiceFinishedResource';
import type { ConfirmBookingRequest } from '../models/ConfirmBookingRequest';
import type { ConfirmBookingResource } from '../models/ConfirmBookingResource';
import type { CreateCreatorActivityRequest } from '../models/CreateCreatorActivityRequest';
import type { CreateLocationRequest } from '../models/CreateLocationRequest';
import type { CreateServiceRequest } from '../models/CreateServiceRequest';
import type { CreatorActivityResource } from '../models/CreatorActivityResource';
import type { FindActivityRequest } from '../models/FindActivityRequest';
import type { HandleBookedEventRequest } from '../models/HandleBookedEventRequest';
import type { LocationReservationBookingResource } from '../models/LocationReservationBookingResource';
import type { LocationServiceResource } from '../models/LocationServiceResource';
import type { ResetReservationRequest } from '../models/ResetReservationRequest';
import type { RunningServiceScheduleResource } from '../models/RunningServiceScheduleResource';
import type { SetReservationRequest } from '../models/SetReservationRequest';
import type { ShowRunningActivityRequest } from '../models/ShowRunningActivityRequest';
import type { UpdateCreatorActivityRequest } from '../models/UpdateCreatorActivityRequest';
import type { UpdateLocationRequest } from '../models/UpdateLocationRequest';
import type { UpdateServiceRequest } from '../models/UpdateServiceRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class ModulesActivityService {
    /**
     * Modules\Activity\Http\Controllers\LocationController@index
     * @returns any Success
     * @throws ApiError
     */
    static activityLocationIndex({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: Array<ActivityLocationResource>;
        links?: Record<string, any>;
        meta?: Record<string, any>;
    }>;
    /**
     * Modules\Activity\Http\Controllers\LocationController@store
     * @returns any Success
     * @throws ApiError
     */
    static activityLocationStore({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: CreateLocationRequest;
    }): CancelablePromise<{
        data: ActivityLocationResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\LocationController@show
     * @returns any Success
     * @throws ApiError
     */
    static activityLocationShow({ activityLocation, xDomain, }: {
        /**
         * Bound to model ActivityLocation
         */
        activityLocation: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ActivityLocationResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\LocationController@update
     * @returns any Success
     * @throws ApiError
     */
    static activityLocationUpdate({ activityLocation, xDomain, requestBody, }: {
        /**
         * Bound to model ActivityLocation
         */
        activityLocation: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: UpdateLocationRequest;
    }): CancelablePromise<{
        data: ActivityLocationResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\LocationController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static activityLocationDestroy({ activityLocation, xDomain, }: {
        /**
         * Bound to model ActivityLocation
         */
        activityLocation: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ActivityLocationResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\LocationServiceBookingController@showDayBookings
     * @returns any Success
     * @throws ApiError
     */
    static getApiActivityBookedEventsDayItem({ date, xDomain, }: {
        date: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ActivityCalendarBookingItemsResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\LocationServiceBookingController@showMonthBookings
     * @returns any Success
     * @throws ApiError
     */
    static getApiActivityBookedEventsMonthItem({ date, xDomain, }: {
        date: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ActivityCalendarBookingsResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\LocationServiceBookingController@confirmBooking
     * @returns any Success
     * @throws ApiError
     */
    static postApiActivityConfirmBooking({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: ConfirmBookingRequest;
    }): CancelablePromise<{
        data: ConfirmBookingResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\LocationServiceBookingController@finishByExpert
     * @returns any Success
     * @throws ApiError
     */
    static getApiActivityExpertFinishItem({ booking, xDomain, }: {
        booking: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ActivityServiceFinishedResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\LocationServiceBookingController@failedService
     * @returns any Success
     * @throws ApiError
     */
    static getApiActivityFailedServiceItem({ booking, xDomain, }: {
        booking: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ActivityServiceFinishedResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\LocationServiceBookingController@show
     * @returns any Success
     * @throws ApiError
     */
    static getApiActivityGetBookingWindowsItemItemItem({ location, service, xDomain, week, }: {
        location: string;
        service: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        week?: string;
    }): CancelablePromise<{
        data: ActivityLocationBookingResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\LocationServicesController@getPendingRequests
     * @returns any Success
     * @throws ApiError
     */
    static getApiActivityGetPendingAmount({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ActivityPendingRequestsResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\LocationServicesController@getProviders
     * @returns any Success
     * @throws ApiError
     */
    static getApiActivityGetProvidersItem({ activity, xDomain, }: {
        /**
         * Bound to model CreatorActivity
         */
        activity: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ActivityProvidersResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\LocationServiceBookingController@handleBookedEvents
     * @returns any Success
     * @throws ApiError
     */
    static postApiActivityHandleEvent({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: HandleBookedEventRequest;
    }): CancelablePromise<{
        data: ActivityLocationBookingResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\LocationServiceBookingController@resetReservation
     * @returns any Success
     * @throws ApiError
     */
    static postApiActivityResetReservation({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: ResetReservationRequest;
    }): CancelablePromise<{
        data: LocationReservationBookingResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\RunningServiceLocationController@show
     * @returns any Success
     * @throws ApiError
     */
    static postApiActivityRunning({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: ShowRunningActivityRequest;
    }): CancelablePromise<{
        data: RunningServiceScheduleResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\LocationServiceBookingController@setReservation
     * @returns any Success
     * @throws ApiError
     */
    static postApiActivitySetReservation({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: SetReservationRequest;
    }): CancelablePromise<{
        data: LocationReservationBookingResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\LocationServiceBookingController@finishByUser
     * @returns any Success
     * @throws ApiError
     */
    static getApiActivityUserFinishItem({ booking, xDomain, }: {
        booking: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ActivityServiceFinishedResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\CreatorActivityController@index
     * @returns any Success
     * @throws ApiError
     */
    static creatorActivityIndex({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: Array<CreatorActivityResource>;
        links?: Record<string, any>;
        meta?: Record<string, any>;
    }>;
    /**
     * Modules\Activity\Http\Controllers\CreatorActivityController@store
     * @returns any Success
     * @throws ApiError
     */
    static creatorActivityStore({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: CreateCreatorActivityRequest;
    }): CancelablePromise<{
        data: CreatorActivityResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\CreatorActivityController@show
     * @returns any Success
     * @throws ApiError
     */
    static creatorActivityShow({ creatorActivity, xDomain, }: {
        /**
         * Bound to model CreatorActivity
         */
        creatorActivity: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: CreatorActivityResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\CreatorActivityController@update
     * @returns any Success
     * @throws ApiError
     */
    static creatorActivityUpdate({ creatorActivity, xDomain, requestBody, }: {
        /**
         * Bound to model CreatorActivity
         */
        creatorActivity: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: UpdateCreatorActivityRequest;
    }): CancelablePromise<{
        data: CreatorActivityResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\CreatorActivityController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static creatorActivityDestroy({ creatorActivity, xDomain, }: {
        /**
         * Bound to model CreatorActivity
         */
        creatorActivity: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: CreatorActivityResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\CreatorActivityController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolActivityAll({ xDomain, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: CreatorActivityResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\LocationServicesController@create
     * @returns any Success
     * @throws ApiError
     */
    static postApiServiceLocationCreate({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: CreateServiceRequest;
    }): CancelablePromise<{
        data: LocationServiceResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\LocationServicesController@findServices
     * @returns any Success
     * @throws ApiError
     */
    static postApiServiceLocationFind({ xDomain, requestBody, }: {
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: FindActivityRequest;
    }): CancelablePromise<{
        data: ActivitySearchResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\LocationServicesController@servicesLocation
     * @returns any Success
     * @throws ApiError
     */
    static getApiServiceLocationLocationItem({ location, xDomain, }: {
        /**
         * Bound to model ActivityLocation
         */
        location: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: ActivityLocationInstanceResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\LocationServicesController@show
     * @returns any Success
     * @throws ApiError
     */
    static getApiServiceLocationServiceItem({ service, xDomain, }: {
        /**
         * Bound to model ActivityLocationService
         */
        service: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: LocationServiceResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\LocationServicesController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiServiceLocationServiceItem({ service, xDomain, }: {
        /**
         * Bound to model ActivityLocationService
         */
        service: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: LocationServiceResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\LocationServicesController@update
     * @returns any Success
     * @throws ApiError
     */
    static putApiServiceLocationUpdateItem({ service, xDomain, requestBody, }: {
        /**
         * Bound to model ActivityLocationService
         */
        service: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
        requestBody: UpdateServiceRequest;
    }): CancelablePromise<{
        data: LocationServiceResource;
    }>;
    /**
     * Modules\Activity\Http\Controllers\LocationServicesController@index
     * @returns any Success
     * @throws ApiError
     */
    static getApiServiceLocationItem({ location, xDomain, }: {
        location: string;
        /**
         * Tenant identifier — every frontend sends the hostname here. Resolves to a tenant via SetDomainContext middleware.
         */
        xDomain: string;
    }): CancelablePromise<{
        data: Array<LocationServiceResource>;
        links?: Record<string, any>;
        meta?: Record<string, any>;
    }>;
}
//# sourceMappingURL=ModulesActivityService.d.ts.map