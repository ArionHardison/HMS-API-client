/**
 * Type definitions for `Modules/Activity` (~31 endpoints).
 *
 * Structural interfaces only — no runtime code. Mirrors the resources surfaced
 * by the controllers under `Modules\Activity\Http\Controllers\*` and the
 * `Modules\Activity\Transformers\*Resource` shapes documented in
 * `sdk/spec/endpoints.json`.
 *
 * Many fields are typed `unknown` because the upstream `*Resource` files
 * pass-through arbitrary JSON columns (location metadata, booking payloads,
 * provider capability flags). Consumers that know the inner shape can narrow
 * with their own type guards — the SDK is intentionally permissive.
 */

/** Route-bound id alias — Laravel route binding accepts numeric id or slug. */
export type ActivityLocationId = number | string;
/** Route-bound id alias for `{activity}` / `{creator_activity}`. */
export type ActivityId = number | string;
/** Route-bound id alias for `{booking}`. */
export type ActivityBookingId = number | string;
/** Route-bound id alias for `{location}`. */
export type LocationId = number | string;
/** Route-bound id alias for `{service}`. */
export type ServiceId = number | string;
/** ISO date `YYYY-MM-DD` accepted by booked-events-day / booked-events-month. */
export type DateString = string;

/** Generic activity-location resource (`Modules\Activity\Transformers\ActivityLocationResource`). */
export interface ActivityLocationResource {
  id: number;
  name: unknown;
  address: unknown;
  city: unknown;
  state: unknown;
  zip: unknown;
  country: unknown;
  latitude: unknown;
  longitude: unknown;
  status: unknown;
  metadata: unknown;
  created_at: string;
  updated_at: string;
}

/** Activity / creator-activity resource. */
export interface ActivityResource {
  id: number;
  name: unknown;
  type: unknown;
  description: unknown;
  status: unknown;
  metadata: unknown;
  created_at: string;
  updated_at: string;
}

/** Activity booking resource. */
export interface ActivityBookingResource {
  id: number;
  user_id: number;
  activity_id: number;
  service_id: number;
  location_id: number;
  expert_id: number;
  status: unknown;
  starts_at: string;
  ends_at: string;
  metadata: unknown;
}

/** Booked-events-day / booked-events-month listing payload (loose shape). */
export interface BookedEventsResponse {
  date: string;
  events: unknown[];
}

/** Booking window listing returned by `get-booking-windows/{location}/{service}/{week?}`. */
export interface BookingWindowResource {
  starts_at: string;
  ends_at: string;
  available: boolean;
  metadata?: unknown;
}

/** Provider listing returned by `get-providers/{activity}`. */
export interface ProviderResource {
  id: number;
  name: unknown;
  metadata: unknown;
}

/** Service-location resource (`Modules\Activity\Transformers\ServiceLocationResource`). */
export interface ServiceLocationResource {
  id: number;
  service_id: number;
  location_id: number;
  metadata: unknown;
  created_at: string;
  updated_at: string;
}

/** Pending-amount summary returned by `get-pending-amount`. */
export interface PendingAmountResource {
  amount: number;
  currency?: string;
  details?: unknown;
}

// -----------------------------------------------------------------------------
// Inputs
// -----------------------------------------------------------------------------

/** POST /api/activity-location — create body (loose). */
export interface CreateActivityLocationInput {
  name: string;
  address?: unknown;
  metadata?: unknown;
  [key: string]: unknown;
}

/** POST /api/creator-activity — create body (loose). */
export interface CreateCreatorActivityInput {
  name: string;
  type?: string;
  metadata?: unknown;
  [key: string]: unknown;
}

/** POST /api/activity/confirm-booking. */
export interface ConfirmBookingInput {
  booking_id: number | string;
  [key: string]: unknown;
}

/** POST /api/activity/handle-event. */
export interface HandleEventInput {
  event: string;
  payload?: unknown;
  [key: string]: unknown;
}

/** POST /api/activity/reset-reservation. */
export interface ResetReservationInput {
  reservation_id: number | string;
  [key: string]: unknown;
}

/** POST /api/activity/set-reservation. */
export interface SetReservationInput {
  user_id?: number | string;
  service_id?: number | string;
  location_id?: number | string;
  starts_at?: string;
  ends_at?: string;
  [key: string]: unknown;
}

/** POST /api/activity/running. */
export interface RunningActivityInput {
  booking_id?: number | string;
  [key: string]: unknown;
}

/** POST /api/service-location/create. */
export interface CreateServiceLocationInput {
  service_id: number | string;
  location_id: number | string;
  [key: string]: unknown;
}

/** POST /api/service-location/find. */
export interface FindServiceLocationInput {
  service_id?: number | string;
  location_id?: number | string;
  [key: string]: unknown;
}

/** PUT /api/service-location/update/{service}. */
export interface UpdateServiceLocationInput {
  location_id?: number | string;
  metadata?: unknown;
  [key: string]: unknown;
}

/** Protocol integration listing record (`/api/protocol/activity/all`). */
export interface ActivityProtocolIntegrationResource {
  id: number;
  name: unknown;
  description: unknown;
  metadata: unknown;
}
