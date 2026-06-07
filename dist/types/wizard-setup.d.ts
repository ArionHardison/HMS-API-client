/**
 * Type contracts for `WizardSetupApiClient`.
 *
 * Source of truth: `sdk/spec/endpoints.json` — entries under `/api/wizard/*`
 * that are NOT part of the Five-Step Wizard methods on `WizardApiClient`.
 *
 * These endpoints drive the program-creation onboarding flow: assessments,
 * profile completion, account confirmation, member invitations, Stripe
 * connection, etc. All `auth: api`.
 */
/** POST /api/wizard/complete-profile/{protocol} body. */
export interface WizardCompleteProfileRequest {
    birth_date: string;
    address: string;
    city: string;
    state: string;
    zip: string;
}
/** POST /api/wizard/confirm-account/{protocol} body — same shape as agent finish-registration. */
export interface WizardConfirmAccountRequest {
    full_name: string;
    timezone: string;
    country_id: number;
    login: string;
    email: string;
    phone: string;
    password: string;
    agreed: boolean;
}
/** POST /api/wizard/confirm-code/{protocol} body. */
export interface WizardConfirmCodeRequest {
    code: string;
}
/** POST /api/wizard/confirm-preview/{protocol} body. */
export interface WizardConfirmPreviewRequest {
    /** Image reference — typically a File for upload, or URL string. */
    program_image: unknown;
}
/** POST /api/wizard/creator-request/{protocol} body — KYC documents. */
export interface WizardCreatorRequestPayload {
    id_photo: unknown;
    id_photo_back: unknown;
    sign_photo: unknown;
}
/** POST /api/wizard/find-members body. */
export interface WizardFindMembersRequest {
    /** Protocol id this search runs against. */
    protocol: number | string;
    /** Free-text search query. */
    query: string;
    /** Required role slug for the member. */
    role: string;
}
/** POST /api/wizard/invite-members/{protocol} body. */
export interface WizardInviteMembersRequest {
    /** Members to invite — typically `{ user_id, role }` records. */
    members: ReadonlyArray<unknown>;
}
/** POST /api/wizard/invite-users/{protocol} body. */
export interface WizardInviteUsersRequest {
    /** Emails to invite as new users. */
    emails: ReadonlyArray<string>;
}
/** POST /api/wizard/publish-program/{protocol} body. */
export interface WizardPublishProgramRequest {
    /** When true, publish immediately. */
    publish_now: boolean;
    /** Optional price/amount for the published program. */
    amount?: number;
}
/** POST /api/wizard/set-agent/{protocol} body. */
export interface WizardSetAgentRequest {
    /** Agent identifier (string id or numeric pk). */
    agent: string | number;
}
/** POST /api/wizard/set-distribution-type/{protocol} body. */
export interface WizardSetDistributionTypeRequest {
    /** Free distribution flag. */
    is_free: boolean;
}
/** POST /api/wizard/set-finances/{protocol} body — spec leaves shape empty. */
export interface WizardSetFinancesRequest {
    [key: string]: unknown;
}
/** POST /api/wizard/validate-email body. */
export interface WizardValidateEmailRequest {
    email: string;
}
/** Generic response payload — most spec response shapes are empty. */
export interface WizardSetupResponse {
    [key: string]: unknown;
}
//# sourceMappingURL=wizard-setup.d.ts.map