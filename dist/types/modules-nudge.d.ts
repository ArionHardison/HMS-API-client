/**
 * Type definitions for `Modules/Nudge`.
 *
 * Structural interfaces only. Mirrors the request shapes captured in
 * `sdk/spec/endpoints.json` (module === "Modules/Nudge"). Two auth tiers:
 *
 *   - Authed (Bearer): index, store, show, update, destroy, image-delete,
 *     `protocol/nudge/all`.
 *   - Public (no Authorization): `nudge-checkin/email` + `/sms` (vendor
 *     webhook receivers from Mailgun / Twilio), `nudge/check/{secret}`
 *     (one-time secret-link confirmation).
 *
 * The legacy `NudgeApiClient` in `hms-api-client.ts` already exists and is
 * NOT removed — these types are scoped to `NudgeModuleApiClient` to avoid
 * clashing with the legacy type aliases.
 */
/** Identifier alias for the `{nudge}` route binding. */
export type NudgeId = number | string;
/** One-time secret token for `nudge/check/{secret}` confirmation links. */
export type NudgeSecret = string;
/**
 * Canonical nudge record returned by index / show / store / update /
 * destroy. Open shape because the upstream resource transformer is
 * passthrough.
 */
export interface NudgeResource {
    id?: number;
    is_sms?: unknown;
    title?: unknown;
    sms_template?: unknown;
    email_template?: unknown;
    attached_file?: unknown;
    [key: string]: unknown;
}
/**
 * `POST /api/nudge` body. Mirrors `CreateNudgeRequest`:
 *   - is_sms          sometimes|boolean
 *   - title           required|string|max:64
 *   - sms_template    open
 *   - email_template  open
 *   - attached_file   open (File/Blob; auto multipart)
 */
export interface CreateNudgeInput {
    is_sms?: boolean;
    title: string;
    sms_template?: string;
    email_template?: string;
    attached_file?: Blob | File | null;
}
/**
 * `PUT /api/nudge/{nudge}` body. Mirrors `UpdateNudgeRequest`:
 *   - is_sms          sometimes|boolean
 *   - title           required|string|max:64
 *   - sms_template    required_without:email_template|max:128
 *   - email_template  required_without:sms_template|min:20|max:500
 */
export interface UpdateNudgeInput {
    is_sms?: boolean;
    title: string;
    sms_template?: string;
    email_template?: string;
    attached_file?: Blob | File | null;
}
/**
 * `POST /api/nudge-checkin/email` body — Mailgun webhook payload. All
 * fields required per `NudgeCheckInEmailRequest`.
 */
export interface NudgeCheckinEmailInput {
    References: string;
    sender: string;
    timestamp: number;
    token: string;
    signature: string;
    'stripped-text': string;
}
/**
 * `POST /api/nudge-checkin/sms` body — Twilio webhook payload. The
 * upstream Form Request is null so the shape is open.
 */
export interface NudgeCheckinSmsInput {
    [key: string]: unknown;
}
/** Open-shape protocol-integration listing. */
export interface NudgeProtocolIntegrationResource {
    [key: string]: unknown;
}
//# sourceMappingURL=modules-nudge.d.ts.map