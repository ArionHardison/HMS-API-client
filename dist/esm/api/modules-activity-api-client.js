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
/**
 * Public client over `/api/activity*`, `/api/activity-location/*`,
 * `/api/creator-activity/*`, `/api/service-location/*` and
 * `/api/protocol/activity/all`. Subclasses `BaseApiClient` so it inherits
 * auth / `X-Domain` / Laravel `_method` override / `ApiError` normalization.
 */
export class ActivityModuleApiClient extends BaseApiClient {
    // ---------------------------------------------------------------------------
    // activity-location resource — `activity-location.{index,store,show,update,destroy}`
    // ---------------------------------------------------------------------------
    /** GET `/api/activity-location` — paginated activity locations. (`activity-location.index`) */
    listLocations(opts) {
        return this.get('/api/activity-location', undefined, opts);
    }
    /** POST `/api/activity-location` — create an activity location. (`activity-location.store`) */
    createLocation(body, opts) {
        return this.post('/api/activity-location', body, opts);
    }
    /** GET `/api/activity-location/{activity_location}`. (`activity-location.show`) */
    showLocation(activityLocation, opts) {
        return this.get(`/api/activity-location/${encodeURIComponent(String(activityLocation))}`, undefined, opts);
    }
    /** PUT `/api/activity-location/{activity_location}` — POST + `?_method=PUT`. (`activity-location.update`) */
    updateLocation(activityLocation, body, opts) {
        return this.put(`/api/activity-location/${encodeURIComponent(String(activityLocation))}`, body, opts);
    }
    /** DELETE `/api/activity-location/{activity_location}`. (`activity-location.destroy`) */
    destroyLocation(activityLocation, opts) {
        return this.delete(`/api/activity-location/${encodeURIComponent(String(activityLocation))}`, opts);
    }
    // ---------------------------------------------------------------------------
    // activity execution surface — /api/activity/*
    // ---------------------------------------------------------------------------
    /** GET `/api/activity/booked-events-day/{date}`. (`get.api.activity.booked-events-day.item`) */
    bookedEventsDay(date, opts) {
        return this.get(`/api/activity/booked-events-day/${encodeURIComponent(date)}`, undefined, opts);
    }
    /** GET `/api/activity/booked-events-month/{date}`. (`get.api.activity.booked-events-month.item`) */
    bookedEventsMonth(date, opts) {
        return this.get(`/api/activity/booked-events-month/${encodeURIComponent(date)}`, undefined, opts);
    }
    /** POST `/api/activity/confirm-booking`. (`post.api.activity.confirm-booking`) */
    confirmBooking(body, opts) {
        return this.post('/api/activity/confirm-booking', body, opts);
    }
    /** GET `/api/activity/expert-finish/{booking}`. (`get.api.activity.expert-finish.item`) */
    expertFinish(booking, opts) {
        return this.get(`/api/activity/expert-finish/${encodeURIComponent(String(booking))}`, undefined, opts);
    }
    /** GET `/api/activity/failed-service/{booking}`. (`get.api.activity.failed-service.item`) */
    failedService(booking, opts) {
        return this.get(`/api/activity/failed-service/${encodeURIComponent(String(booking))}`, undefined, opts);
    }
    /**
     * GET `/api/activity/get-booking-windows/{location}/{service}/{week?}`.
     * The `week` segment is optional — the SDK omits it when undefined so the
     * 2-segment Laravel route also matches.
     * (`get.api.activity.get-booking-windows.item.item.item`)
     */
    getBookingWindows(location, service, week, opts) {
        const base = `/api/activity/get-booking-windows/${encodeURIComponent(String(location))}/${encodeURIComponent(String(service))}`;
        const url = week === undefined ? base : `${base}/${encodeURIComponent(String(week))}`;
        return this.get(url, undefined, opts);
    }
    /** GET `/api/activity/get-pending-amount`. (`get.api.activity.get-pending-amount`) */
    getPendingAmount(opts) {
        return this.get('/api/activity/get-pending-amount', undefined, opts);
    }
    /** GET `/api/activity/get-providers/{activity}`. (`get.api.activity.get-providers.item`) */
    getProviders(activity, opts) {
        return this.get(`/api/activity/get-providers/${encodeURIComponent(String(activity))}`, undefined, opts);
    }
    /** POST `/api/activity/handle-event`. (`post.api.activity.handle-event`) */
    handleEvent(body, opts) {
        return this.post('/api/activity/handle-event', body, opts);
    }
    /** POST `/api/activity/reset-reservation`. (`post.api.activity.reset-reservation`) */
    resetReservation(body, opts) {
        return this.post('/api/activity/reset-reservation', body, opts);
    }
    /** POST `/api/activity/running`. (`post.api.activity.running`) */
    runningActivity(body, opts) {
        return this.post('/api/activity/running', body, opts);
    }
    /** POST `/api/activity/set-reservation`. (`post.api.activity.set-reservation`) */
    setReservation(body, opts) {
        return this.post('/api/activity/set-reservation', body, opts);
    }
    /** GET `/api/activity/user-finish/{booking}`. (`get.api.activity.user-finish.item`) */
    userFinish(booking, opts) {
        return this.get(`/api/activity/user-finish/${encodeURIComponent(String(booking))}`, undefined, opts);
    }
    // ---------------------------------------------------------------------------
    // creator-activity resource — `creator-activity.{index,store,show,update,destroy}`
    // ---------------------------------------------------------------------------
    /** GET `/api/creator-activity`. (`creator-activity.index`) */
    listCreatorActivities(opts) {
        return this.get('/api/creator-activity', undefined, opts);
    }
    /** POST `/api/creator-activity`. (`creator-activity.store`) */
    createCreatorActivity(body, opts) {
        return this.post('/api/creator-activity', body, opts);
    }
    /** GET `/api/creator-activity/{creator_activity}`. (`creator-activity.show`) */
    showCreatorActivity(creatorActivity, opts) {
        return this.get(`/api/creator-activity/${encodeURIComponent(String(creatorActivity))}`, undefined, opts);
    }
    /** PUT `/api/creator-activity/{creator_activity}`. (`creator-activity.update`) */
    updateCreatorActivity(creatorActivity, body, opts) {
        return this.put(`/api/creator-activity/${encodeURIComponent(String(creatorActivity))}`, body, opts);
    }
    /** DELETE `/api/creator-activity/{creator_activity}`. (`creator-activity.destroy`) */
    destroyCreatorActivity(creatorActivity, opts) {
        return this.delete(`/api/creator-activity/${encodeURIComponent(String(creatorActivity))}`, opts);
    }
    // ---------------------------------------------------------------------------
    // protocol integration
    // ---------------------------------------------------------------------------
    /** GET `/api/protocol/activity/all`. (`get.api.protocol.activity.all`) */
    listProtocolActivities(opts) {
        return this.get('/api/protocol/activity/all', undefined, opts);
    }
    // ---------------------------------------------------------------------------
    // service-location surface — /api/service-location/*
    // ---------------------------------------------------------------------------
    /** POST `/api/service-location/create`. (`post.api.service-location.create`) */
    createServiceLocation(body, opts) {
        return this.post('/api/service-location/create', body, opts);
    }
    /** POST `/api/service-location/find`. (`post.api.service-location.find`) */
    findServiceLocation(body, opts) {
        return this.post('/api/service-location/find', body, opts);
    }
    /** GET `/api/service-location/location/{location}`. (`get.api.service-location.location.item`) */
    serviceLocationByLocation(location, opts) {
        return this.get(`/api/service-location/location/${encodeURIComponent(String(location))}`, undefined, opts);
    }
    /** GET `/api/service-location/service/{service}`. (`get.api.service-location.service.item`) */
    serviceLocationByService(service, opts) {
        return this.get(`/api/service-location/service/${encodeURIComponent(String(service))}`, undefined, opts);
    }
    /** DELETE `/api/service-location/service/{service}`. (`delete.api.service-location.service.item`) */
    destroyServiceLocationByService(service, opts) {
        return this.delete(`/api/service-location/service/${encodeURIComponent(String(service))}`, opts);
    }
    /** PUT `/api/service-location/update/{service}`. (`put.api.service-location.update.item`) */
    updateServiceLocation(service, body, opts) {
        return this.put(`/api/service-location/update/${encodeURIComponent(String(service))}`, body, opts);
    }
    /** GET `/api/service-location/{location}`. (`get.api.service-location.item`) */
    showServiceLocation(location, opts) {
        return this.get(`/api/service-location/${encodeURIComponent(String(location))}`, undefined, opts);
    }
}
//# sourceMappingURL=modules-activity-api-client.js.map