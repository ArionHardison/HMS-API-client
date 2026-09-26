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
import { BaseApiClient } from '../api-client';
export class WizardSetupApiClient extends BaseApiClient {
    // ---------------------------------------------------------------------------
    // Assessment lookups
    // ---------------------------------------------------------------------------
    /** GET /api/wizard/assessment/answers/{protocol} */
    async getAssessmentAnswers(protocol) {
        return this.get(`/api/wizard/assessment/answers/${encodeURIComponent(String(protocol))}`);
    }
    /** GET /api/wizard/assessment/questions/{protocol} */
    async getAssessmentQuestions(protocol) {
        return this.get(`/api/wizard/assessment/questions/${encodeURIComponent(String(protocol))}`);
    }
    // ---------------------------------------------------------------------------
    // Profile + account
    // ---------------------------------------------------------------------------
    /** POST /api/wizard/complete-profile/{protocol} */
    async completeProfile(protocol, body) {
        return this.post(`/api/wizard/complete-profile/${encodeURIComponent(String(protocol))}`, body);
    }
    /** POST /api/wizard/confirm-account/{protocol} */
    async confirmAccount(protocol, body) {
        return this.post(`/api/wizard/confirm-account/${encodeURIComponent(String(protocol))}`, body);
    }
    /** POST /api/wizard/confirm-code/{protocol} */
    async confirmCode(protocol, body) {
        return this.post(`/api/wizard/confirm-code/${encodeURIComponent(String(protocol))}`, body);
    }
    /** POST /api/wizard/confirm-preview/{protocol} — accepts a program image (File OK). */
    async confirmPreview(protocol, body) {
        return this.post(`/api/wizard/confirm-preview/${encodeURIComponent(String(protocol))}`, body);
    }
    /** POST /api/wizard/creator-request/{protocol} — KYC photos (File OK). */
    async submitCreatorRequest(protocol, body) {
        return this.post(`/api/wizard/creator-request/${encodeURIComponent(String(protocol))}`, body);
    }
    // ---------------------------------------------------------------------------
    // Stripe + finances
    // ---------------------------------------------------------------------------
    /** GET /api/wizard/connect-stripe/{protocol} */
    async connectStripe(protocol) {
        return this.get(`/api/wizard/connect-stripe/${encodeURIComponent(String(protocol))}`);
    }
    /** GET /api/wizard/verify-stripe/{protocol} */
    async verifyStripe(protocol) {
        return this.get(`/api/wizard/verify-stripe/${encodeURIComponent(String(protocol))}`);
    }
    /** GET /api/wizard/finances/{protocol} */
    async getFinances(protocol) {
        return this.get(`/api/wizard/finances/${encodeURIComponent(String(protocol))}`);
    }
    /** POST /api/wizard/set-finances/{protocol} */
    async setFinances(protocol, body = {}) {
        return this.post(`/api/wizard/set-finances/${encodeURIComponent(String(protocol))}`, body);
    }
    // ---------------------------------------------------------------------------
    // State + finalization
    // ---------------------------------------------------------------------------
    /** GET /api/wizard/finalization-state/{protocol} */
    async getFinalizationState(protocol) {
        return this.get(`/api/wizard/finalization-state/${encodeURIComponent(String(protocol))}`);
    }
    /** GET /api/wizard/get-state/{protocol} */
    async getWizardState(protocol) {
        return this.get(`/api/wizard/get-state/${encodeURIComponent(String(protocol))}`);
    }
    /** GET /api/wizard/program-data/{protocol} */
    async getProgramData(protocol) {
        return this.get(`/api/wizard/program-data/${encodeURIComponent(String(protocol))}`);
    }
    /** GET /api/wizard/public-program-created/{protocol} */
    async getPublicProgramCreated(protocol) {
        return this.get(`/api/wizard/public-program-created/${encodeURIComponent(String(protocol))}`);
    }
    /** GET /api/wizard/retry-creation/{protocol} */
    async retryCreation(protocol) {
        return this.get(`/api/wizard/retry-creation/${encodeURIComponent(String(protocol))}`);
    }
    /** GET /api/wizard/start-program/{protocol} */
    async startProgram(protocol) {
        return this.get(`/api/wizard/start-program/${encodeURIComponent(String(protocol))}`);
    }
    /** GET /api/wizard/step-back/{protocol} */
    async stepBack(protocol) {
        return this.get(`/api/wizard/step-back/${encodeURIComponent(String(protocol))}`);
    }
    // ---------------------------------------------------------------------------
    // Members / team
    // ---------------------------------------------------------------------------
    /** POST /api/wizard/find-members */
    async findMembers(body) {
        return this.post('/api/wizard/find-members', body);
    }
    /** GET /api/wizard/get-required-roles/{protocol} */
    async getRequiredRoles(protocol) {
        return this.get(`/api/wizard/get-required-roles/${encodeURIComponent(String(protocol))}`);
    }
    /** POST /api/wizard/invite-members/{protocol} */
    async inviteMembers(protocol, body) {
        return this.post(`/api/wizard/invite-members/${encodeURIComponent(String(protocol))}`, body);
    }
    /** POST /api/wizard/invite-users/{protocol} */
    async inviteUsers(protocol, body) {
        return this.post(`/api/wizard/invite-users/${encodeURIComponent(String(protocol))}`, body);
    }
    /** GET /api/wizard/team/roles-to-invite/{protocol} */
    async getRolesToInvite(protocol) {
        return this.get(`/api/wizard/team/roles-to-invite/${encodeURIComponent(String(protocol))}`);
    }
    // ---------------------------------------------------------------------------
    // Misc setup
    // ---------------------------------------------------------------------------
    /** POST /api/wizard/publish-program/{protocol} */
    async publishProgram(protocol, body) {
        return this.post(`/api/wizard/publish-program/${encodeURIComponent(String(protocol))}`, body);
    }
    /** POST /api/wizard/set-agent/{protocol} */
    async setAgent(protocol, body) {
        return this.post(`/api/wizard/set-agent/${encodeURIComponent(String(protocol))}`, body);
    }
    /** POST /api/wizard/set-distribution-type/{protocol} */
    async setDistributionType(protocol, body) {
        return this.post(`/api/wizard/set-distribution-type/${encodeURIComponent(String(protocol))}`, body);
    }
    /** POST /api/wizard/validate-email */
    async validateEmail(body) {
        return this.post('/api/wizard/validate-email', body);
    }
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
    async startWizard(body) {
        return this.post('/api/wizard/start', body);
    }
}
// =============================================================================
// Re-export hint for `src/index.ts`
// -----------------------------------------------------------------------------
//   export { WizardSetupApiClient } from './api/wizard-setup-api-client';
//   export type {
//     WizardCompleteProfileRequest,
//     WizardConfirmAccountRequest,
//     WizardConfirmCodeRequest,
//     WizardConfirmPreviewRequest,
//     WizardCreatorRequestPayload,
//     WizardFindMembersRequest,
//     WizardInviteMembersRequest,
//     WizardInviteUsersRequest,
//     WizardPublishProgramRequest,
//     WizardSetAgentRequest,
//     WizardSetDistributionTypeRequest,
//     WizardSetFinancesRequest,
//     WizardSetupResponse,
//     WizardValidateEmailRequest,
//   } from './api/wizard-setup-api-client';
// =============================================================================
//# sourceMappingURL=wizard-setup-api-client.js.map