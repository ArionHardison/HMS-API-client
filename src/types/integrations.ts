/**
 * Integrations (subproject federation) types — request/response shapes for
 * `api/Modules/Integrations/Routes/api.php`. This is the machine-to-machine
 * glue the four standalone subprojects (IBD, PHM, MOB, NIO) + the
 * codify-careers HRM claim-back flow use to write events into P2X.
 *
 * Source of truth = the api route file + each controller / FormRequest, NOT
 * guessed. Free-form upstream payloads (`attributes`, `intake_payload`,
 * `dimensions`, `responses`, `scoring`, `path_geojson`, GPS points) are typed
 * loosely (`Record<string, unknown>` / open arrays) because their shape is
 * owned by the upstream product, not the P2X schema.
 *
 * Auth bands:
 *   - Federated writes (user upserts, IBD/MOB/NIO event logs, NIO coins):
 *     `auth:api` + `abilities:subproject:writer` + tenant-match + idempotency.
 *     Pass a machine Bearer via `getToken` and an `Idempotency-Key` on writes.
 *   - NIO firebase-login: NO bearer (the Firebase token IS the auth) — call
 *     with `{ auth: false }` per the client method's default; still tenant +
 *     idempotency scoped.
 *   - MOB guest-register: UNAUTHENTICATED token mint — `{ auth: false }`,
 *     throttled + idempotent. Mints the device's first Sanctum bearer.
 */

// ─── Shared envelopes ───────────────────────────────────────────────────

/**
 * 202 response of the four `users/upsert` endpoints (IBD/PHM/MOB/NIO),
 * which extend AbstractUserUpsertController. `status` is always `'linked'`.
 */
export interface UserUpsertResponse {
  user_id: number;
  external_id: string;
  source: string;
  status: 'linked';
}

/**
 * 202 response of the careers (HRM claim-back) upsert. Carries BOTH
 * `user_id` and `p2x_user_id` (the claim service reads the latter); there is
 * no `external_id` echo (the external link is keyed on `source_id`).
 */
export interface CareersUserUpsertResponse {
  user_id: number;
  p2x_user_id: number;
  source: string;
  status: 'linked';
}

/**
 * 202 response of every AbstractEventLogController endpoint (IBD
 * applications + kpi-events, MOB activity-locations + runs, NIO
 * assessments-responses + orders). `status` is always `'accepted'`.
 */
export interface EventLogAcceptedResponse {
  id: number;
  source: string;
  kind: string;
  status: 'accepted';
}

// ─── User upsert requests ───────────────────────────────────────────────

/**
 * Body for the four `users/upsert` endpoints. `external_id` is the
 * upstream identifier (Mongo `_id` for IBD, MariaDB int for PHM, device UUID
 * for MOB, Firebase UID for NIO) — required, length-capped only. `attributes`
 * is free-form metadata stored on the link row.
 */
export interface UserUpsertRequest {
  external_id: string;
  email?: string | null;
  attributes?: Record<string, unknown> | null;
}

/**
 * Body for `POST /api/v1/integrations/careers/users/upsert`. At least one of
 * `email` / `source_email` is required (the P2X identity is keyed on email).
 * `source_id` is the upstream candidate id; when present an external link is
 * created keyed by `(subproject, source, source_id)`.
 */
export interface CareersUserUpsertRequest {
  email?: string | null;
  source_email?: string | null;
  name?: string | null;
  source?: string | null;
  source_id?: string | null;
  tenant_domain?: string | null;
  attributes?: Record<string, unknown> | null;
}

// ─── IBD event requests ─────────────────────────────────────────────────

/** Body for `POST /api/v1/integrations/ibd/applications`. */
export interface IbdApplicationRequest {
  external_id?: string | null;
  patient_external_id: string;
  program_code: string;
  intake_payload?: Record<string, unknown> | null;
}

/** Body for `POST /api/v1/integrations/ibd/kpi-events`. */
export interface IbdKpiEventRequest {
  external_id?: string | null;
  metric: string;
  value: number;
  dimensions?: Record<string, unknown> | null;
  occurred_at: string;
}

// ─── MOB event requests ─────────────────────────────────────────────────

/** One GPS point in a MOB activity-location batch. */
export interface MobActivityPoint {
  run_id: string;
  lat: number;
  lng: number;
  recorded_at: string;
}

/** Body for `POST /api/v1/integrations/mob/activity-locations/batch`. */
export interface MobActivityLocationBatchRequest {
  external_id?: string | null;
  device_uuid: string;
  points: MobActivityPoint[];
}

/** Body for `POST /api/v1/integrations/mob/runs/complete`. */
export interface MobRunCompleteRequest {
  external_id?: string | null;
  run_id: string;
  total_seconds: number;
  distance_meters: number;
  path_geojson?: Record<string, unknown> | null;
}

// ─── MOB guest registration (token mint) ────────────────────────────────

/**
 * Body for `POST /api/v1/integrations/mob/guest-register` (unauthenticated).
 * `device_uuid` is the canonical field; the api also accepts `device_id` as
 * an alias.
 */
export interface MobGuestRegisterRequest {
  device_uuid: string;
  platform?: string;
  app_version?: string;
}

/** The user shape the MOB guest-register endpoint presents. */
export interface MobGuestUser {
  id: number;
  name: string;
  email: string;
  roles: string[];
  subproject_id: number | null;
  created_at: string | null;
}

/** A minted Sanctum bearer (MOB guest / generic token block). */
export interface IssuedToken {
  access_token: string;
  token_type: 'Bearer';
  /** Present on the NIO firebase token block; absent on MOB guest. */
  expires_at?: string | null;
}

/**
 * Response of `POST /api/v1/integrations/mob/guest-register` — wrapped in a
 * `{ data: {...} }` envelope. 201 on first registration, 200 on a repeat
 * device_uuid (the same user is resolved, a fresh token is still minted).
 */
export interface MobGuestRegisterResponse {
  data: {
    user: MobGuestUser;
    token: IssuedToken;
  };
}

// ─── NIO event requests ─────────────────────────────────────────────────

/** Body for `POST /api/v1/integrations/nio/assessments-responses`. */
export interface NioAssessmentResponseRequest {
  external_id?: string | null;
  assessment_key: string;
  responses: Record<string, unknown>;
  scoring?: Record<string, unknown> | null;
}

/** `source` enum for NIO orders. */
export type NioOrderSource = 'stripe' | 'appstore' | 'playstore';

/** Body for `POST /api/v1/integrations/nio/orders`. */
export interface NioOrderRequest {
  external_id?: string | null;
  source: NioOrderSource;
  external_order_id: string;
  amount_cents: number;
  status: string;
}

// ─── NIO coin economy ───────────────────────────────────────────────────

/** Body for `POST /api/v1/integrations/nio/coins/grant`. */
export interface NioCoinGrantRequest {
  amount: number;
  reason?: string | null;
}

/** Body for `POST /api/v1/integrations/nio/coins/spend`. */
export interface NioCoinSpendRequest {
  amount: number;
  reason?: string | null;
}

/**
 * Response of the NIO coin grant/spend endpoints — server-authoritative
 * balance after the move + the ledger transaction id. A spend that would
 * overdraw returns 422 `{ amount: ['Insufficient coin balance.'] }`.
 */
export interface NioCoinTransactionResponse {
  balance: number;
  transaction_id: number;
}

// ─── NIO Firebase login (token swap) ────────────────────────────────────

/**
 * Body for `POST /api/v1/integrations/nio/firebase-login` (unauthenticated).
 * `firebase_id_token` is the raw Firebase RS256 JWT obtained on device.
 */
export interface NioFirebaseLoginRequest {
  firebase_id_token: string;
}

/** The user shape the NIO firebase-login endpoint presents. */
export interface NioFirebaseUser {
  id: number;
  name: string | null;
  username: string;
  email: string | null;
  roles: string[];
  email_verified_at: string | null;
}

/**
 * Response of `POST /api/v1/integrations/nio/firebase-login` — the
 * `{ success, message, data: { user, token } }` envelope the YCaaS Flutter
 * SDK FirebaseSwapClient expects. On a bad token: 401 `{ success: false,
 * message: 'Invalid Firebase ID token' }`.
 */
export interface NioFirebaseLoginResponse {
  success: boolean;
  message: string;
  data: {
    user: NioFirebaseUser;
    token: IssuedToken;
  };
}
