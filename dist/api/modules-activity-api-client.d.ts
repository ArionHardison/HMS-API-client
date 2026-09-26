/**
 * `Modules/Activity` API client.
 *
 * Covers the 31 endpoints documented in `sdk/spec/endpoints.json` with
 * `module === "Modules/Activity"`:
 *
 *   - 5 activity-location resource endpoints (`activity-location.{index,store,
 *     show,update,destroy}`)
 *   - 13 activity-execution endpoints under `/api/activity/*`:
 *     `booked-events-day`, `booked-events-month`, `confirm-booking`,
 *     `expert-finish`, `failed-service`, `get-booking-windows` (single SDK
 *     method covering both the 2- and 3-segment route forms),
 *     `get-pending-amount`, `get-providers`, `handle-event`,
 *     `reset-reservation`, `running`, `set-reservation`, `user-finish`
 *   - 5 creator-activity resource endpoints (`creator-activity.{index,store,
 *     show,update,destroy}`)
 *   - 7 service-location endpoints under `/api/service-location/*`
 *   - 1 protocol-integration listing (`/api/protocol/activity/all`)
 *
 * Naming policy: SDK methods are camelCase versions of the spec id minus
 * redundant prefixes; conflicts (e.g. `*.show` for two different resources)
 * are namespaced (`showLocation`, `showCreatorActivity`,
 * `showServiceLocation`).
 *
 * Class is named `ActivityModuleApiClient` to coexist with the legacy
 * `ActivityApiClient` in `hms-api-client.ts`. Do not refactor the legacy
 * client — it ships under a different surface.
 *
 * Auth: all 31 endpoints are `auth: api` (Sanctum). The SDK adds
 * `Authorization: Bearer <token>` automatically when `getToken` is wired.
 *
 * Tenancy: every endpoint is tenant-scoped — callers pass `getDomain` so the
 * `X-Domain` header is attached.
 */
import { BaseApiClient } from '../api-client';
import type { ApiRequestOptions, ApiResponse } from '../api-client';
import type { ActivityBookingId, ActivityBookingResource, ActivityId, ActivityLocationId, ActivityLocationResource, ActivityProtocolIntegrationResource, ActivityResource, BookedEventsResponse, BookingWindowResource, ConfirmBookingInput, CreateActivityLocationInput, CreateCreatorActivityInput, CreateServiceLocationInput, DateString, FindServiceLocationInput, HandleEventInput, LocationId, PendingAmountResource, ProviderResource, ResetReservationInput, RunningActivityInput, ServiceId, ServiceLocationResource, SetReservationInput, UpdateServiceLocationInput } from '../types/modules-activity';
/**
 * Public client over `/api/activity*`, `/api/activity-location/*`,
 * `/api/creator-activity/*`, `/api/service-location/*` and
 * `/api/protocol/activity/all`. Subclasses `BaseApiClient` so it inherits
 * auth / `X-Domain` / Laravel `_method` override / `ApiError` normalization.
 */
export declare class ActivityModuleApiClient extends BaseApiClient {
    /** GET `/api/activity-location` — paginated activity locations. (`activity-location.index`) */
    listLocations(opts?: ApiRequestOptions): Promise<ApiResponse<ActivityLocationResource[]>>;
    /** POST `/api/activity-location` — create an activity location. (`activity-location.store`) */
    createLocation(body: CreateActivityLocationInput, opts?: ApiRequestOptions): Promise<ApiResponse<ActivityLocationResource>>;
    /** GET `/api/activity-location/{activity_location}`. (`activity-location.show`) */
    showLocation(activityLocation: ActivityLocationId, opts?: ApiRequestOptions): Promise<ApiResponse<ActivityLocationResource>>;
    /** PUT `/api/activity-location/{activity_location}` — POST + `?_method=PUT`. (`activity-location.update`) */
    updateLocation(activityLocation: ActivityLocationId, body: Partial<CreateActivityLocationInput>, opts?: ApiRequestOptions): Promise<ApiResponse<ActivityLocationResource>>;
    /** DELETE `/api/activity-location/{activity_location}`. (`activity-location.destroy`) */
    destroyLocation(activityLocation: ActivityLocationId, opts?: ApiRequestOptions): Promise<ApiResponse<null>>;
    /** GET `/api/activity/booked-events-day/{date}`. (`get.api.activity.booked-events-day.item`) */
    bookedEventsDay(date: DateString, opts?: ApiRequestOptions): Promise<ApiResponse<BookedEventsResponse>>;
    /** GET `/api/activity/booked-events-month/{date}`. (`get.api.activity.booked-events-month.item`) */
    bookedEventsMonth(date: DateString, opts?: ApiRequestOptions): Promise<ApiResponse<BookedEventsResponse>>;
    /** POST `/api/activity/confirm-booking`. (`post.api.activity.confirm-booking`) */
    confirmBooking(body: ConfirmBookingInput, opts?: ApiRequestOptions): Promise<ApiResponse<ActivityBookingResource>>;
    /** GET `/api/activity/expert-finish/{booking}`. (`get.api.activity.expert-finish.item`) */
    expertFinish(booking: ActivityBookingId, opts?: ApiRequestOptions): Promise<ApiResponse<ActivityBookingResource>>;
    /** GET `/api/activity/failed-service/{booking}`. (`get.api.activity.failed-service.item`) */
    failedService(booking: ActivityBookingId, opts?: ApiRequestOptions): Promise<ApiResponse<ActivityBookingResource>>;
    /**
     * GET `/api/activity/get-booking-windows/{location}/{service}/{week?}`.
     * The `week` segment is optional — the SDK omits it when undefined so the
     * 2-segment Laravel route also matches.
     * (`get.api.activity.get-booking-windows.item.item.item`)
     */
    getBookingWindows(location: LocationId, service: ServiceId, week?: number | string, opts?: ApiRequestOptions): Promise<ApiResponse<BookingWindowResource[]>>;
    /** GET `/api/activity/get-pending-amount`. (`get.api.activity.get-pending-amount`) */
    getPendingAmount(opts?: ApiRequestOptions): Promise<ApiResponse<PendingAmountResource>>;
    /** GET `/api/activity/get-providers/{activity}`. (`get.api.activity.get-providers.item`) */
    getProviders(activity: ActivityId, opts?: ApiRequestOptions): Promise<ApiResponse<ProviderResource[]>>;
    /** POST `/api/activity/handle-event`. (`post.api.activity.handle-event`) */
    handleEvent(body: HandleEventInput, opts?: ApiRequestOptions): Promise<ApiResponse<unknown>>;
    /** POST `/api/activity/reset-reservation`. (`post.api.activity.reset-reservation`) */
    resetReservation(body: ResetReservationInput, opts?: ApiRequestOptions): Promise<ApiResponse<unknown>>;
    /** POST `/api/activity/running`. (`post.api.activity.running`) */
    runningActivity(body: RunningActivityInput, opts?: ApiRequestOptions): Promise<ApiResponse<unknown>>;
    /** POST `/api/activity/set-reservation`. (`post.api.activity.set-reservation`) */
    setReservation(body: SetReservationInput, opts?: ApiRequestOptions): Promise<ApiResponse<unknown>>;
    /** GET `/api/activity/user-finish/{booking}`. (`get.api.activity.user-finish.item`) */
    userFinish(booking: ActivityBookingId, opts?: ApiRequestOptions): Promise<ApiResponse<ActivityBookingResource>>;
    /** GET `/api/creator-activity`. (`creator-activity.index`) */
    listCreatorActivities(opts?: ApiRequestOptions): Promise<ApiResponse<ActivityResource[]>>;
    /** POST `/api/creator-activity`. (`creator-activity.store`) */
    createCreatorActivity(body: CreateCreatorActivityInput, opts?: ApiRequestOptions): Promise<ApiResponse<ActivityResource>>;
    /** GET `/api/creator-activity/{creator_activity}`. (`creator-activity.show`) */
    showCreatorActivity(creatorActivity: ActivityId, opts?: ApiRequestOptions): Promise<ApiResponse<ActivityResource>>;
    /** PUT `/api/creator-activity/{creator_activity}`. (`creator-activity.update`) */
    updateCreatorActivity(creatorActivity: ActivityId, body: Partial<CreateCreatorActivityInput>, opts?: ApiRequestOptions): Promise<ApiResponse<ActivityResource>>;
    /** DELETE `/api/creator-activity/{creator_activity}`. (`creator-activity.destroy`) */
    destroyCreatorActivity(creatorActivity: ActivityId, opts?: ApiRequestOptions): Promise<ApiResponse<null>>;
    /** GET `/api/protocol/activity/all`. (`get.api.protocol.activity.all`) */
    listProtocolActivities(opts?: ApiRequestOptions): Promise<ApiResponse<ActivityProtocolIntegrationResource[]>>;
    /** POST `/api/service-location/create`. (`post.api.service-location.create`) */
    createServiceLocation(body: CreateServiceLocationInput, opts?: ApiRequestOptions): Promise<ApiResponse<ServiceLocationResource>>;
    /** POST `/api/service-location/find`. (`post.api.service-location.find`) */
    findServiceLocation(body: FindServiceLocationInput, opts?: ApiRequestOptions): Promise<ApiResponse<ServiceLocationResource[]>>;
    /** GET `/api/service-location/location/{location}`. (`get.api.service-location.location.item`) */
    serviceLocationByLocation(location: LocationId, opts?: ApiRequestOptions): Promise<ApiResponse<ServiceLocationResource[]>>;
    /** GET `/api/service-location/service/{service}`. (`get.api.service-location.service.item`) */
    serviceLocationByService(service: ServiceId, opts?: ApiRequestOptions): Promise<ApiResponse<ServiceLocationResource[]>>;
    /** DELETE `/api/service-location/service/{service}`. (`delete.api.service-location.service.item`) */
    destroyServiceLocationByService(service: ServiceId, opts?: ApiRequestOptions): Promise<ApiResponse<null>>;
    /** PUT `/api/service-location/update/{service}`. (`put.api.service-location.update.item`) */
    updateServiceLocation(service: ServiceId, body: UpdateServiceLocationInput, opts?: ApiRequestOptions): Promise<ApiResponse<ServiceLocationResource>>;
    /** GET `/api/service-location/{location}`. (`get.api.service-location.item`) */
    showServiceLocation(location: LocationId, opts?: ApiRequestOptions): Promise<ApiResponse<ServiceLocationResource>>;
}
//# sourceMappingURL=modules-activity-api-client.d.ts.map