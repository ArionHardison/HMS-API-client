/**
 * Type definitions for `Modules/Services`.
 *
 * Structural interfaces only. Mirrors the resolver request shapes from
 * `sdk/spec/endpoints.json` (module === "Modules/Services"). All endpoints
 * sit under `/api/v1/services/*` and require `auth:api` (Bearer).
 */
/** Identifier alias for the protocol-personal-chain `chain_id` body field. */
export type ServiceChainId = number;
/**
 * Source enum mirrored from `ServiceResolutionSource` in the upstream
 * Laravel module. `reserve` / `release` accept exactly these three.
 *
 * NB: keeping this as a string literal union (not a TS enum) so the SDK
 * stays branding-stable for `sys/` per the consumer contract.
 */
export type ServiceResolutionSource = 'hrm' | 'lms' | 'external';
/**
 * `POST /api/v1/services/resolve` body. Spec rules:
 *   - chain_id      required|integer
 *   - service_name  required|string|max:255
 *   - near          nullable|string|max:255
 */
export interface ResolveServiceInput {
    chain_id: ServiceChainId;
    service_name: string;
    near?: string;
}
/**
 * `POST /api/v1/services/reserve` body. Mirrors `ReserveServiceSlotRequest`:
 *   - chain_id              required|integer
 *   - source                required|string|in:hrm,lms,external
 *   - slot_id               required_if:source,hrm|nullable|integer
 *   - course_id             required_if:source,lms|nullable|integer
 *   - external_candidate_id required_if:source,external|nullable|integer
 */
export interface ReserveServiceSlotInput {
    chain_id: ServiceChainId;
    source: ServiceResolutionSource;
    slot_id?: number | null;
    course_id?: number | null;
    external_candidate_id?: number | null;
}
/**
 * `POST /api/v1/services/release` body — same Form Request as reserve in
 * the upstream module, hence same shape.
 */
export type ReleaseServiceSlotInput = ReserveServiceSlotInput;
/** Open-shape resolve response — server emits a candidate list. */
export interface ResolveServiceResource {
    candidates?: unknown;
    [key: string]: unknown;
}
/** Reserve / release response — open shape. */
export interface ServiceReservationResource {
    reservation_id?: unknown;
    released?: unknown;
    [key: string]: unknown;
}
//# sourceMappingURL=modules-services.d.ts.map