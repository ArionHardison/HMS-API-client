/**
 * @arionhardison/wizard-api-client — root barrel.
 *
 * The root entry intentionally exports ONLY framework-agnostic primitives:
 *   - HTTP clients (fetch- and axios-based) and their config / DTO types
 *   - The Five-Step Wizard client
 *   - Every HMS domain API client class
 *   - The shared `ApiError` and error helpers
 *
 * Vue 3 composables, Pinia stores, and the router live behind the
 * `./vue3` subpath so Vue 2 / Node / SSR consumers never pull Vue 3 into
 * their bundle. See `src/vue3/index.ts`.
 */
// =============================================================================
// Core fetch-based client (the one the contract suite locks).
// =============================================================================
export { BaseApiClient, AuthApiClient, ItemsApiClient, createApiClient, } from './api-client';
// =============================================================================
// Axios-based HMS suite + domain clients.
// =============================================================================
export { createHmsApiClient, createGovApiClient, createMktApiClient, createMfeApiClient, hmsApiClient, govApiClient, mktApiClient, mfeApiClient, DomainApiClient, 
// Domain-specific client classes
UserApiClient, TeamApiClient, ProgramsApiClient, ProtocolApiClient, KPIApiClient, ChatApiClient, NotificationApiClient, StripeApiClient, NudgeApiClient, FollowUpsApiClient, ActivityApiClient, AssessmentsApiClient, ChallengeApiClient, OrderApiClient, PaymentApiClient, } from './api/hms-api-client';
// =============================================================================
// Five-Step Wizard client.
// =============================================================================
export { WizardApiClient, WizardStepExecutor, wizardSteps, wizardApiClient } from './api/wizard-api-client';
// =============================================================================
// Error handling — `ApiError` is a class; `processApiError` etc. are helpers.
// =============================================================================
export { ApiError, processApiError, handleApiCall, createFormErrors, getErrorMessage, } from './api/error-handling';
// =============================================================================
// Round 2 + Round 3 slice clients.
// -----------------------------------------------------------------------------
// Each "slice" mirrors one Laravel module (or a tightly-coupled cluster).
// Renames + dedupes documented inline:
//   - `EmptyOk` and `PaginatedPayload` are structurally identical across the
//     auth-user, protocol, and programs-team slices. We export them ONCE
//     from `auth-user-api-client` and skip the duplicates from the other
//     two slices.
//   - `tenancy-api-client` and `communications-api-client` already expose
//     their helpers under slice-prefixed names.
//   - `admin-api-client` exposes `AdminEmptyOk` / `AdminPaginatedPayload`
//     (renamed at the source) plus `AdminUserData as AdminApiUserData` to
//     avoid the auth-user collision.
//   - `programs-team-api-client.ProgramData` collides with the legacy
//     `ProgramData` in `hms-api-client.ts`; we re-export it as
//     `ProgramsTeamProgramData`.
//   - `programs-team-api-client.ProgramTagData` collides with admin's
//     differently-shaped `ProgramTagData`; we keep the programs-team one
//     and re-export admin's as `AdminProgramTagData`.
//   - `programs-team-api-client.TeamSearchRequest` collides with admin's
//     `TeamSearchRequest`; we keep the programs-team one and re-export
//     admin's as `AdminTeamSearchRequest`.
//   - `protocol-api-client.ProtocolApiClient` (new) collides with the
//     legacy `ProtocolApiClient` class re-exported from `hms-api-client`;
//     we re-export the new one as `ProtocolDomainApiClient`.
//   - `modules-order.ChainId` and `modules-kpi.ChainId` are structurally
//     identical (`number | string`); we export `ChainId` once from
//     `modules-kpi` and skip the duplicate from `modules-order`.
// =============================================================================
// -----------------------------------------------------------------------------
// Auth + user
// -----------------------------------------------------------------------------
export { AuthUserApiClient } from './api/auth-user-api-client';
// -----------------------------------------------------------------------------
// Subproject (hierarchy-aware) — the canonical multi-tenant boot +
// subproject lifecycle client. `TenancyApiClient` (below) is a
// `@deprecated` alias retained for one minor; removed in 2.0.0.
// -----------------------------------------------------------------------------
export { SubprojectApiClient } from './api/subproject-api-client';
export { resolveInherited } from './utils/resolve-inherited';
// -----------------------------------------------------------------------------
// Tenancy (deprecated alias — use SubprojectApiClient)
// -----------------------------------------------------------------------------
export { TenancyApiClient } from './api/tenancy-api-client';
// -----------------------------------------------------------------------------
// Programs + team
// -----------------------------------------------------------------------------
export { ProgramsTeamApiClient } from './api/programs-team-api-client';
// -----------------------------------------------------------------------------
// Protocol (new domain client; renamed to avoid collision with the legacy
// `ProtocolApiClient` re-exported from `hms-api-client`).
// -----------------------------------------------------------------------------
export { ProtocolApiClient as ProtocolDomainApiClient } from './api/protocol-api-client';
// -----------------------------------------------------------------------------
// Personal-chain wizard (codify pipeline polling envelope)
// -----------------------------------------------------------------------------
export { PersonalChainWizardApiClient } from './api/personal-chain-wizard-api-client';
// -----------------------------------------------------------------------------
// Communications (chat / notifications / Stripe Connect / webhook)
// -----------------------------------------------------------------------------
export { CommunicationsApiClient } from './api/communications-api-client';
// -----------------------------------------------------------------------------
// Admin
// -----------------------------------------------------------------------------
export { AdminApiClient } from './api/admin-api-client';
// -----------------------------------------------------------------------------
// Module slice clients (Round 3 fan-out — one client per Laravel module)
// -----------------------------------------------------------------------------
// modules/agents
export { AgentsModuleApiClient } from './api/modules-agents-api-client';
// modules/kpi
export { KPIModuleApiClient } from './api/modules-kpi-api-client';
// modules/activity
export { ActivityModuleApiClient } from './api/modules-activity-api-client';
// modules/assessments
export { AssessmentsModuleApiClient } from './api/modules-assessments-api-client';
// modules/challenge
export { ChallengeModuleApiClient } from './api/modules-challenge-api-client';
// modules/followups
export { FollowUpsModuleApiClient } from './api/modules-followups-api-client';
// modules/order
// (`ChainId` exported once via `modules-kpi`; identical type here.)
export { OrderModuleApiClient } from './api/modules-order-api-client';
// modules/items
export { ItemsModuleApiClient } from './api/modules-items-api-client';
// modules/appeal
export { AppealModuleApiClient } from './api/modules-appeal-api-client';
// modules/application
export { ApplicationModuleApiClient } from './api/modules-application-api-client';
// modules/disbursement
export { DisbursementModuleApiClient } from './api/modules-disbursement-api-client';
// modules/referral
export { ReferralModuleApiClient } from './api/modules-referral-api-client';
// modules/report
export { ReportModuleApiClient } from './api/modules-report-api-client';
// modules/verification
export { VerificationModuleApiClient } from './api/modules-verification-api-client';
// modules/connector
export { ConnectorModuleApiClient } from './api/modules-connector-api-client';
// modules/etl
export { ETLModuleApiClient } from './api/modules-etl-api-client';
// modules/workflow
export { WorkflowModuleApiClient } from './api/modules-workflow-api-client';
// modules/services
export { ServicesModuleApiClient } from './api/modules-services-api-client';
// modules/nudge
export { NudgeModuleApiClient } from './api/modules-nudge-api-client';
// modules/coinbase (public webhook — instantiate with `getDomain: () => null`
// and pass `{ auth: false }` per-call; see client header for details).
export { CoinbaseModuleApiClient } from './api/modules-coinbase-api-client';
// -----------------------------------------------------------------------------
// Gap-fill slice clients (Round 3 follow-up)
// -----------------------------------------------------------------------------
// chain
export { ChainApiClient } from './api/chain-api-client';
// systems — tenant-agnostic catalog of every codify-* non-generic system
// (powers sys/ MFE's sidebar Systems submenu) + the legacy tenant-scoped
// per-vertical endpoints.
export { SystemsApiClient } from './api/systems-api-client';
// schedule
export { ScheduleApiClient } from './api/schedule-api-client';
// agent communication
export { AgentCommunicationApiClient } from './api/agent-communication-api-client';
// subproject admin
export { SubprojectAdminApiClient } from './api/subproject-admin-api-client';
// gap-fill clients (wired post-integration)
export { MiscCoreApiClient } from './api/misc-core-api-client';
export { WizardSetupApiClient } from './api/wizard-setup-api-client';
export { ProjectSettingsApiClient } from './api/project-settings-api-client';
export { DashboardProgramApiClient } from './api/dashboard-program-api-client';
export { SubprojectWizardApiClient } from './api/subproject-wizard-api-client';
export { IntakeModuleApiClient } from './api/modules-intake-api-client';
// Codify-domain client + types + Mermaid helper. Powers consumers that
// render the domain → intent → deal-template → comments surface
// (CI-MYC's /agent/:tld page being the first). dealTemplateToMermaid
// emits a sequenceDiagram string consumed by any Mermaid-rendering
// component.
export { CodifyDomainApiClient } from './api/codify-domain-api-client';
export { dealTemplateToMermaid } from './utils/deal-template-to-mermaid';
// =============================================================================
// Examples (runtime-safe; no Vue imports — the Vue snippets are inside
// JSDoc comment blocks).
// =============================================================================
export * from './examples/programs-example';
export * from './examples/items-example';
export * from './examples/auth-example';
export * from './examples/chat-example';
//# sourceMappingURL=index.js.map