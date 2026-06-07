import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ModulesActivityService {
    /**
     * Modules\Activity\Http\Controllers\LocationController@index
     * @returns any Success
     * @throws ApiError
     */
    static activityLocationIndex({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/activity-location',
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
     * Modules\Activity\Http\Controllers\LocationController@store
     * @returns any Success
     * @throws ApiError
     */
    static activityLocationStore({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/activity-location',
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
     * Modules\Activity\Http\Controllers\LocationController@show
     * @returns any Success
     * @throws ApiError
     */
    static activityLocationShow({ activityLocation, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/activity-location/{activity_location}',
            path: {
                'activity_location': activityLocation,
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
     * Modules\Activity\Http\Controllers\LocationController@update
     * @returns any Success
     * @throws ApiError
     */
    static activityLocationUpdate({ activityLocation, xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/activity-location/{activity_location}',
            path: {
                'activity_location': activityLocation,
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
     * Modules\Activity\Http\Controllers\LocationController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static activityLocationDestroy({ activityLocation, xDomain, }) {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/activity-location/{activity_location}',
            path: {
                'activity_location': activityLocation,
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
     * Modules\Activity\Http\Controllers\LocationServiceBookingController@showDayBookings
     * @returns any Success
     * @throws ApiError
     */
    static getApiActivityBookedEventsDayItem({ date, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/activity/booked-events-day/{date}',
            path: {
                'date': date,
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
     * Modules\Activity\Http\Controllers\LocationServiceBookingController@showMonthBookings
     * @returns any Success
     * @throws ApiError
     */
    static getApiActivityBookedEventsMonthItem({ date, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/activity/booked-events-month/{date}',
            path: {
                'date': date,
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
     * Modules\Activity\Http\Controllers\LocationServiceBookingController@confirmBooking
     * @returns any Success
     * @throws ApiError
     */
    static postApiActivityConfirmBooking({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/activity/confirm-booking',
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
     * Modules\Activity\Http\Controllers\LocationServiceBookingController@finishByExpert
     * @returns any Success
     * @throws ApiError
     */
    static getApiActivityExpertFinishItem({ booking, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/activity/expert-finish/{booking}',
            path: {
                'booking': booking,
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
     * Modules\Activity\Http\Controllers\LocationServiceBookingController@failedService
     * @returns any Success
     * @throws ApiError
     */
    static getApiActivityFailedServiceItem({ booking, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/activity/failed-service/{booking}',
            path: {
                'booking': booking,
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
     * Modules\Activity\Http\Controllers\LocationServiceBookingController@show
     * @returns any Success
     * @throws ApiError
     */
    static getApiActivityGetBookingWindowsItemItemItem({ location, service, xDomain, week, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/activity/get-booking-windows/{location}/{service}/{week}',
            path: {
                'location': location,
                'service': service,
                'week': week,
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
     * Modules\Activity\Http\Controllers\LocationServicesController@getPendingRequests
     * @returns any Success
     * @throws ApiError
     */
    static getApiActivityGetPendingAmount({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/activity/get-pending-amount',
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
     * Modules\Activity\Http\Controllers\LocationServicesController@getProviders
     * @returns any Success
     * @throws ApiError
     */
    static getApiActivityGetProvidersItem({ activity, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/activity/get-providers/{activity}',
            path: {
                'activity': activity,
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
     * Modules\Activity\Http\Controllers\LocationServiceBookingController@handleBookedEvents
     * @returns any Success
     * @throws ApiError
     */
    static postApiActivityHandleEvent({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/activity/handle-event',
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
     * Modules\Activity\Http\Controllers\LocationServiceBookingController@resetReservation
     * @returns any Success
     * @throws ApiError
     */
    static postApiActivityResetReservation({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/activity/reset-reservation',
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
     * Modules\Activity\Http\Controllers\RunningServiceLocationController@show
     * @returns any Success
     * @throws ApiError
     */
    static postApiActivityRunning({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/activity/running',
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
     * Modules\Activity\Http\Controllers\LocationServiceBookingController@setReservation
     * @returns any Success
     * @throws ApiError
     */
    static postApiActivitySetReservation({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/activity/set-reservation',
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
     * Modules\Activity\Http\Controllers\LocationServiceBookingController@finishByUser
     * @returns any Success
     * @throws ApiError
     */
    static getApiActivityUserFinishItem({ booking, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/activity/user-finish/{booking}',
            path: {
                'booking': booking,
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
     * Modules\Activity\Http\Controllers\CreatorActivityController@index
     * @returns any Success
     * @throws ApiError
     */
    static creatorActivityIndex({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/creator-activity',
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
     * Modules\Activity\Http\Controllers\CreatorActivityController@store
     * @returns any Success
     * @throws ApiError
     */
    static creatorActivityStore({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/creator-activity',
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
     * Modules\Activity\Http\Controllers\CreatorActivityController@show
     * @returns any Success
     * @throws ApiError
     */
    static creatorActivityShow({ creatorActivity, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/creator-activity/{creator_activity}',
            path: {
                'creator_activity': creatorActivity,
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
     * Modules\Activity\Http\Controllers\CreatorActivityController@update
     * @returns any Success
     * @throws ApiError
     */
    static creatorActivityUpdate({ creatorActivity, xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/creator-activity/{creator_activity}',
            path: {
                'creator_activity': creatorActivity,
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
     * Modules\Activity\Http\Controllers\CreatorActivityController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static creatorActivityDestroy({ creatorActivity, xDomain, }) {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/creator-activity/{creator_activity}',
            path: {
                'creator_activity': creatorActivity,
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
     * Modules\Activity\Http\Controllers\CreatorActivityController@all
     * @returns any Success
     * @throws ApiError
     */
    static getApiProtocolActivityAll({ xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/protocol/activity/all',
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
     * Modules\Activity\Http\Controllers\LocationServicesController@create
     * @returns any Success
     * @throws ApiError
     */
    static postApiServiceLocationCreate({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/service-location/create',
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
     * Modules\Activity\Http\Controllers\LocationServicesController@findServices
     * @returns any Success
     * @throws ApiError
     */
    static postApiServiceLocationFind({ xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/service-location/find',
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
     * Modules\Activity\Http\Controllers\LocationServicesController@servicesLocation
     * @returns any Success
     * @throws ApiError
     */
    static getApiServiceLocationLocationItem({ location, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/service-location/location/{location}',
            path: {
                'location': location,
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
     * Modules\Activity\Http\Controllers\LocationServicesController@show
     * @returns any Success
     * @throws ApiError
     */
    static getApiServiceLocationServiceItem({ service, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/service-location/service/{service}',
            path: {
                'service': service,
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
     * Modules\Activity\Http\Controllers\LocationServicesController@destroy
     * @returns any Success
     * @throws ApiError
     */
    static deleteApiServiceLocationServiceItem({ service, xDomain, }) {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/service-location/service/{service}',
            path: {
                'service': service,
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
     * Modules\Activity\Http\Controllers\LocationServicesController@update
     * @returns any Success
     * @throws ApiError
     */
    static putApiServiceLocationUpdateItem({ service, xDomain, requestBody, }) {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/service-location/update/{service}',
            path: {
                'service': service,
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
     * Modules\Activity\Http\Controllers\LocationServicesController@index
     * @returns any Success
     * @throws ApiError
     */
    static getApiServiceLocationItem({ location, xDomain, }) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/service-location/{location}',
            path: {
                'location': location,
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
//# sourceMappingURL=ModulesActivityService.js.map