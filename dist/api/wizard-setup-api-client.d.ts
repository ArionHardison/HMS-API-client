/**
 * WizardSetupApiClient — covers `/api/wizard/*` setup endpoints (27 in
 * total). All `auth: api`.
 *
 * NOTE: The Five-Step Wizard methods (`/api/wizard/define-problem`,
 * `/api/wizard/codify-solution`, `/api/wizard/setup-program`,
 * `/api/wizard/execute-program`, `/api/wizard/verify-outcome`) are owned
 * by `WizardApiClient` (`src/api/wizard-api-client.ts`) and are NOT
 * included here.
 *
 * This client covers the *program-creation onboarding* surface:
 * assessments, profile completion, account confirmation, member
 * invitations, Stripe connection, publishing, and state management.
 *
 * Source of truth: `sdk/spec/endpoints.json`.
 */
import { BaseApiClient, type ApiResponse } from '../api-client';
import type { WizardCompleteProfileRequest, WizardConfirmAccountRequest, WizardConfirmCodeRequest, WizardConfirmPreviewRequest, WizardCreatorRequestPayload, WizardFindMembersRequest, WizardInviteMembersRequest, WizardInviteUsersRequest, WizardPublishProgramRequest, WizardSetAgentRequest, WizardSetDistributionTypeRequest, WizardSetFinancesRequest, WizardSetupResponse, WizardValidateEmailRequest } from '../types/wizard-setup';
export type { WizardCompleteProfileRequest, WizardConfirmAccountRequest, WizardConfirmCodeRequest, WizardConfirmPreviewRequest, WizardCreatorRequestPayload, WizardFindMembersRequest, WizardInviteMembersRequest, WizardInviteUsersRequest, WizardPublishProgramRequest, WizardSetAgentRequest, WizardSetDistributionTypeRequest, WizardSetFinancesRequest, WizardSetupResponse, WizardValidateEmailRequest, };
export declare class WizardSetupApiClient extends BaseApiClient {
    /** GET /api/wizard/assessment/answers/{protocol} */
    getAssessmentAnswers(protocol: number | string): Promise<ApiResponse<WizardSetupResponse>>;
    /** GET /api/wizard/assessment/questions/{protocol} */
    getAssessmentQuestions(protocol: number | string): Promise<ApiResponse<WizardSetupResponse>>;
    /** POST /api/wizard/complete-profile/{protocol} */
    completeProfile(protocol: number | string, body: WizardCompleteProfileRequest): Promise<ApiResponse<WizardSetupResponse>>;
    /** POST /api/wizard/confirm-account/{protocol} */
    confirmAccount(protocol: number | string, body: WizardConfirmAccountRequest): Promise<ApiResponse<WizardSetupResponse>>;
    /** POST /api/wizard/confirm-code/{protocol} */
    confirmCode(protocol: number | string, body: WizardConfirmCodeRequest): Promise<ApiResponse<WizardSetupResponse>>;
    /** POST /api/wizard/confirm-preview/{protocol} — accepts a program image (File OK). */
    confirmPreview(protocol: number | string, body: WizardConfirmPreviewRequest): Promise<ApiResponse<WizardSetupResponse>>;
    /** POST /api/wizard/creator-request/{protocol} — KYC photos (File OK). */
    submitCreatorRequest(protocol: number | string, body: WizardCreatorRequestPayload): Promise<ApiResponse<WizardSetupResponse>>;
    /** GET /api/wizard/connect-stripe/{protocol} */
    connectStripe(protocol: number | string): Promise<ApiResponse<WizardSetupResponse>>;
    /** GET /api/wizard/verify-stripe/{protocol} */
    verifyStripe(protocol: number | string): Promise<ApiResponse<WizardSetupResponse>>;
    /** GET /api/wizard/finances/{protocol} */
    getFinances(protocol: number | string): Promise<ApiResponse<WizardSetupResponse>>;
    /** POST /api/wizard/set-finances/{protocol} */
    setFinances(protocol: number | string, body?: WizardSetFinancesRequest): Promise<ApiResponse<WizardSetupResponse>>;
    /** GET /api/wizard/finalization-state/{protocol} */
    getFinalizationState(protocol: number | string): Promise<ApiResponse<WizardSetupResponse>>;
    /** GET /api/wizard/get-state/{protocol} */
    getWizardState(protocol: number | string): Promise<ApiResponse<WizardSetupResponse>>;
    /** GET /api/wizard/program-data/{protocol} */
    getProgramData(protocol: number | string): Promise<ApiResponse<WizardSetupResponse>>;
    /** GET /api/wizard/public-program-created/{protocol} */
    getPublicProgramCreated(protocol: number | string): Promise<ApiResponse<WizardSetupResponse>>;
    /** GET /api/wizard/retry-creation/{protocol} */
    retryCreation(protocol: number | string): Promise<ApiResponse<WizardSetupResponse>>;
    /** GET /api/wizard/start-program/{protocol} */
    startProgram(protocol: number | string): Promise<ApiResponse<WizardSetupResponse>>;
    /** GET /api/wizard/step-back/{protocol} */
    stepBack(protocol: number | string): Promise<ApiResponse<WizardSetupResponse>>;
    /** POST /api/wizard/find-members */
    findMembers(body: WizardFindMembersRequest): Promise<ApiResponse<WizardSetupResponse>>;
    /** GET /api/wizard/get-required-roles/{protocol} */
    getRequiredRoles(protocol: number | string): Promise<ApiResponse<WizardSetupResponse>>;
    /** POST /api/wizard/invite-members/{protocol} */
    inviteMembers(protocol: number | string, body: WizardInviteMembersRequest): Promise<ApiResponse<WizardSetupResponse>>;
    /** POST /api/wizard/invite-users/{protocol} */
    inviteUsers(protocol: number | string, body: WizardInviteUsersRequest): Promise<ApiResponse<WizardSetupResponse>>;
    /** GET /api/wizard/team/roles-to-invite/{protocol} */
    getRolesToInvite(protocol: number | string): Promise<ApiResponse<WizardSetupResponse>>;
    /** POST /api/wizard/publish-program/{protocol} */
    publishProgram(protocol: number | string, body: WizardPublishProgramRequest): Promise<ApiResponse<WizardSetupResponse>>;
    /** POST /api/wizard/set-agent/{protocol} */
    setAgent(protocol: number | string, body: WizardSetAgentRequest): Promise<ApiResponse<WizardSetupResponse>>;
    /** POST /api/wizard/set-distribution-type/{protocol} */
    setDistributionType(protocol: number | string, body: WizardSetDistributionTypeRequest): Promise<ApiResponse<WizardSetupResponse>>;
    /** POST /api/wizard/validate-email */
    validateEmail(body: WizardValidateEmailRequest): Promise<ApiResponse<WizardSetupResponse>>;
    /**
     * POST /api/wizard/start — single-payload subproject create / gov-shape
     * 5-step flow kickoff. Routed to `WizardStartController` (a single
     * invokable controller) on the backend, NOT the per-step
     * `WizardController` that owns the other `/api/wizard/*` endpoints.
     *
     * Bearer required (auth:api). The payload shape is intentionally
     * open: the gov front-end submits the entire 5-step questionnaire
     * (organization name, mission, contacts, etc.) in one POST and the
     * controller decides what to persist where. Callers should treat
     * the response payload as the boot context for the newly-created
     * subproject — typically including its `id`, `domain`, and seed
     * settings.
     */
    startWizard(body: Record<string, unknown>): Promise<ApiResponse<WizardSetupResponse>>;
}
//# sourceMappingURL=wizard-setup-api-client.d.ts.map