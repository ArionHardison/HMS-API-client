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
export {};
//# sourceMappingURL=integrations.js.map