"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminApiClient = exports.CommunicationsApiClient = exports.PersonalChainWizardApiClient = exports.ProtocolDomainApiClient = exports.ProgramsTeamApiClient = exports.TenancyApiClient = exports.resolveInherited = exports.SubprojectApiClient = exports.AuthUserApiClient = exports.getErrorMessage = exports.createFormErrors = exports.handleApiCall = exports.processApiError = exports.ApiError = exports.DealWizardApiClient = exports.wizardApiClient = exports.wizardSteps = exports.WizardStepExecutor = exports.WizardApiClient = exports.PaymentApiClient = exports.OrderApiClient = exports.ChallengeApiClient = exports.AssessmentsApiClient = exports.ActivityApiClient = exports.FollowUpsApiClient = exports.NudgeApiClient = exports.StripeApiClient = exports.NotificationApiClient = exports.ChatApiClient = exports.KPIApiClient = exports.ProtocolApiClient = exports.ProgramsApiClient = exports.TeamApiClient = exports.UserApiClient = exports.DomainApiClient = exports.mfeApiClient = exports.mktApiClient = exports.govApiClient = exports.hmsApiClient = exports.createMfeApiClient = exports.createMktApiClient = exports.createGovApiClient = exports.createHmsApiClient = exports.operationIndex = exports.createTypedApiClient = exports.TypedApiClient = exports.createApiClient = exports.ItemsApiClient = exports.AuthApiClient = exports.BaseApiClient = void 0;
exports.IntegrationsApiClient = exports.CodifyApiClient = exports.dealTemplateToMermaid = exports.CodifyDomainApiClient = exports.IntakeModuleApiClient = exports.SubprojectWizardApiClient = exports.DashboardProgramApiClient = exports.ProjectSettingsApiClient = exports.WizardSetupApiClient = exports.MiscCoreApiClient = exports.SubprojectAdminApiClient = exports.AgentCommunicationApiClient = exports.ScheduleApiClient = exports.SystemsApiClient = exports.ChainApiClient = exports.FacilitiesApiClient = exports.LmsApiClient = exports.HrmApiClient = exports.HitlApiClient = exports.FailApiClient = exports.RlhfApiClient = exports.H5iApiClient = exports.CoinbaseModuleApiClient = exports.NudgeModuleApiClient = exports.ServicesModuleApiClient = exports.WorkflowModuleApiClient = exports.ETLModuleApiClient = exports.ConnectorModuleApiClient = exports.VerificationModuleApiClient = exports.ReportModuleApiClient = exports.ReferralModuleApiClient = exports.DisbursementModuleApiClient = exports.ApplicationModuleApiClient = exports.AppealModuleApiClient = exports.ItemsModuleApiClient = exports.OrderModuleApiClient = exports.FollowUpsModuleApiClient = exports.ChallengeModuleApiClient = exports.AssessmentsModuleApiClient = exports.ActivityModuleApiClient = exports.KPIModuleApiClient = exports.AgentsModuleApiClient = void 0;
// =============================================================================
// Core fetch-based client (the one the contract suite locks).
// =============================================================================
var api_client_1 = require("./api-client");
Object.defineProperty(exports, "BaseApiClient", { enumerable: true, get: function () { return api_client_1.BaseApiClient; } });
Object.defineProperty(exports, "AuthApiClient", { enumerable: true, get: function () { return api_client_1.AuthApiClient; } });
Object.defineProperty(exports, "ItemsApiClient", { enumerable: true, get: function () { return api_client_1.ItemsApiClient; } });
Object.defineProperty(exports, "createApiClient", { enumerable: true, get: function () { return api_client_1.createApiClient; } });
// =============================================================================
// Typed contract layer (SRE enforcement) — operationId-keyed client + the
// generic Request<E> / Response<E> helpers over the generated `operations`
// map. Compile-time-strict, no `any` on the public surface.
// =============================================================================
var typed_client_1 = require("./typed-client");
Object.defineProperty(exports, "TypedApiClient", { enumerable: true, get: function () { return typed_client_1.TypedApiClient; } });
Object.defineProperty(exports, "createTypedApiClient", { enumerable: true, get: function () { return typed_client_1.createTypedApiClient; } });
var operation_index_1 = require("./generated/operation-index");
Object.defineProperty(exports, "operationIndex", { enumerable: true, get: function () { return operation_index_1.operationIndex; } });
// =============================================================================
// Axios-based HMS suite + domain clients.
// =============================================================================
var hms_api_client_1 = require("./api/hms-api-client");
Object.defineProperty(exports, "createHmsApiClient", { enumerable: true, get: function () { return hms_api_client_1.createHmsApiClient; } });
Object.defineProperty(exports, "createGovApiClient", { enumerable: true, get: function () { return hms_api_client_1.createGovApiClient; } });
Object.defineProperty(exports, "createMktApiClient", { enumerable: true, get: function () { return hms_api_client_1.createMktApiClient; } });
Object.defineProperty(exports, "createMfeApiClient", { enumerable: true, get: function () { return hms_api_client_1.createMfeApiClient; } });
Object.defineProperty(exports, "hmsApiClient", { enumerable: true, get: function () { return hms_api_client_1.hmsApiClient; } });
Object.defineProperty(exports, "govApiClient", { enumerable: true, get: function () { return hms_api_client_1.govApiClient; } });
Object.defineProperty(exports, "mktApiClient", { enumerable: true, get: function () { return hms_api_client_1.mktApiClient; } });
Object.defineProperty(exports, "mfeApiClient", { enumerable: true, get: function () { return hms_api_client_1.mfeApiClient; } });
Object.defineProperty(exports, "DomainApiClient", { enumerable: true, get: function () { return hms_api_client_1.DomainApiClient; } });
// Domain-specific client classes
Object.defineProperty(exports, "UserApiClient", { enumerable: true, get: function () { return hms_api_client_1.UserApiClient; } });
Object.defineProperty(exports, "TeamApiClient", { enumerable: true, get: function () { return hms_api_client_1.TeamApiClient; } });
Object.defineProperty(exports, "ProgramsApiClient", { enumerable: true, get: function () { return hms_api_client_1.ProgramsApiClient; } });
Object.defineProperty(exports, "ProtocolApiClient", { enumerable: true, get: function () { return hms_api_client_1.ProtocolApiClient; } });
Object.defineProperty(exports, "KPIApiClient", { enumerable: true, get: function () { return hms_api_client_1.KPIApiClient; } });
Object.defineProperty(exports, "ChatApiClient", { enumerable: true, get: function () { return hms_api_client_1.ChatApiClient; } });
Object.defineProperty(exports, "NotificationApiClient", { enumerable: true, get: function () { return hms_api_client_1.NotificationApiClient; } });
Object.defineProperty(exports, "StripeApiClient", { enumerable: true, get: function () { return hms_api_client_1.StripeApiClient; } });
Object.defineProperty(exports, "NudgeApiClient", { enumerable: true, get: function () { return hms_api_client_1.NudgeApiClient; } });
Object.defineProperty(exports, "FollowUpsApiClient", { enumerable: true, get: function () { return hms_api_client_1.FollowUpsApiClient; } });
Object.defineProperty(exports, "ActivityApiClient", { enumerable: true, get: function () { return hms_api_client_1.ActivityApiClient; } });
Object.defineProperty(exports, "AssessmentsApiClient", { enumerable: true, get: function () { return hms_api_client_1.AssessmentsApiClient; } });
Object.defineProperty(exports, "ChallengeApiClient", { enumerable: true, get: function () { return hms_api_client_1.ChallengeApiClient; } });
Object.defineProperty(exports, "OrderApiClient", { enumerable: true, get: function () { return hms_api_client_1.OrderApiClient; } });
Object.defineProperty(exports, "PaymentApiClient", { enumerable: true, get: function () { return hms_api_client_1.PaymentApiClient; } });
// =============================================================================
// Five-Step Wizard client.
// =============================================================================
var wizard_api_client_1 = require("./api/wizard-api-client");
Object.defineProperty(exports, "WizardApiClient", { enumerable: true, get: function () { return wizard_api_client_1.WizardApiClient; } });
Object.defineProperty(exports, "WizardStepExecutor", { enumerable: true, get: function () { return wizard_api_client_1.WizardStepExecutor; } });
Object.defineProperty(exports, "wizardSteps", { enumerable: true, get: function () { return wizard_api_client_1.wizardSteps; } });
Object.defineProperty(exports, "wizardApiClient", { enumerable: true, get: function () { return wizard_api_client_1.wizardApiClient; } });
// =============================================================================
// Deal Runtime Wizard client — route-accurate fetch-based companion covering
// the 17 `/api/wizard/deal/*` routes (define → verify). Preferred over the
// legacy `WizardApiClient` for new consumers.
// =============================================================================
var deal_wizard_api_client_1 = require("./api/deal-wizard-api-client");
Object.defineProperty(exports, "DealWizardApiClient", { enumerable: true, get: function () { return deal_wizard_api_client_1.DealWizardApiClient; } });
// =============================================================================
// Error handling — `ApiError` is a class; `processApiError` etc. are helpers.
// =============================================================================
var error_handling_1 = require("./api/error-handling");
Object.defineProperty(exports, "ApiError", { enumerable: true, get: function () { return error_handling_1.ApiError; } });
Object.defineProperty(exports, "processApiError", { enumerable: true, get: function () { return error_handling_1.processApiError; } });
Object.defineProperty(exports, "handleApiCall", { enumerable: true, get: function () { return error_handling_1.handleApiCall; } });
Object.defineProperty(exports, "createFormErrors", { enumerable: true, get: function () { return error_handling_1.createFormErrors; } });
Object.defineProperty(exports, "getErrorMessage", { enumerable: true, get: function () { return error_handling_1.getErrorMessage; } });
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
var auth_user_api_client_1 = require("./api/auth-user-api-client");
Object.defineProperty(exports, "AuthUserApiClient", { enumerable: true, get: function () { return auth_user_api_client_1.AuthUserApiClient; } });
// -----------------------------------------------------------------------------
// Subproject (hierarchy-aware) — the canonical multi-tenant boot +
// subproject lifecycle client. `TenancyApiClient` (below) is a
// `@deprecated` alias retained for one minor; removed in 2.0.0.
// -----------------------------------------------------------------------------
var subproject_api_client_1 = require("./api/subproject-api-client");
Object.defineProperty(exports, "SubprojectApiClient", { enumerable: true, get: function () { return subproject_api_client_1.SubprojectApiClient; } });
var resolve_inherited_1 = require("./utils/resolve-inherited");
Object.defineProperty(exports, "resolveInherited", { enumerable: true, get: function () { return resolve_inherited_1.resolveInherited; } });
// -----------------------------------------------------------------------------
// Tenancy (deprecated alias — use SubprojectApiClient)
// -----------------------------------------------------------------------------
var tenancy_api_client_1 = require("./api/tenancy-api-client");
Object.defineProperty(exports, "TenancyApiClient", { enumerable: true, get: function () { return tenancy_api_client_1.TenancyApiClient; } });
// -----------------------------------------------------------------------------
// Programs + team
// -----------------------------------------------------------------------------
var programs_team_api_client_1 = require("./api/programs-team-api-client");
Object.defineProperty(exports, "ProgramsTeamApiClient", { enumerable: true, get: function () { return programs_team_api_client_1.ProgramsTeamApiClient; } });
// -----------------------------------------------------------------------------
// Protocol (new domain client; renamed to avoid collision with the legacy
// `ProtocolApiClient` re-exported from `hms-api-client`).
// -----------------------------------------------------------------------------
var protocol_api_client_1 = require("./api/protocol-api-client");
Object.defineProperty(exports, "ProtocolDomainApiClient", { enumerable: true, get: function () { return protocol_api_client_1.ProtocolApiClient; } });
// -----------------------------------------------------------------------------
// Personal-chain wizard (codify pipeline polling envelope)
// -----------------------------------------------------------------------------
var personal_chain_wizard_api_client_1 = require("./api/personal-chain-wizard-api-client");
Object.defineProperty(exports, "PersonalChainWizardApiClient", { enumerable: true, get: function () { return personal_chain_wizard_api_client_1.PersonalChainWizardApiClient; } });
// -----------------------------------------------------------------------------
// Communications (chat / notifications / Stripe Connect / webhook)
// -----------------------------------------------------------------------------
var communications_api_client_1 = require("./api/communications-api-client");
Object.defineProperty(exports, "CommunicationsApiClient", { enumerable: true, get: function () { return communications_api_client_1.CommunicationsApiClient; } });
// -----------------------------------------------------------------------------
// Admin
// -----------------------------------------------------------------------------
var admin_api_client_1 = require("./api/admin-api-client");
Object.defineProperty(exports, "AdminApiClient", { enumerable: true, get: function () { return admin_api_client_1.AdminApiClient; } });
// -----------------------------------------------------------------------------
// Module slice clients (Round 3 fan-out — one client per Laravel module)
// -----------------------------------------------------------------------------
// modules/agents
var modules_agents_api_client_1 = require("./api/modules-agents-api-client");
Object.defineProperty(exports, "AgentsModuleApiClient", { enumerable: true, get: function () { return modules_agents_api_client_1.AgentsModuleApiClient; } });
// modules/kpi
var modules_kpi_api_client_1 = require("./api/modules-kpi-api-client");
Object.defineProperty(exports, "KPIModuleApiClient", { enumerable: true, get: function () { return modules_kpi_api_client_1.KPIModuleApiClient; } });
// modules/activity
var modules_activity_api_client_1 = require("./api/modules-activity-api-client");
Object.defineProperty(exports, "ActivityModuleApiClient", { enumerable: true, get: function () { return modules_activity_api_client_1.ActivityModuleApiClient; } });
// modules/assessments
var modules_assessments_api_client_1 = require("./api/modules-assessments-api-client");
Object.defineProperty(exports, "AssessmentsModuleApiClient", { enumerable: true, get: function () { return modules_assessments_api_client_1.AssessmentsModuleApiClient; } });
// modules/challenge
var modules_challenge_api_client_1 = require("./api/modules-challenge-api-client");
Object.defineProperty(exports, "ChallengeModuleApiClient", { enumerable: true, get: function () { return modules_challenge_api_client_1.ChallengeModuleApiClient; } });
// modules/followups
var modules_followups_api_client_1 = require("./api/modules-followups-api-client");
Object.defineProperty(exports, "FollowUpsModuleApiClient", { enumerable: true, get: function () { return modules_followups_api_client_1.FollowUpsModuleApiClient; } });
// modules/order
// (`ChainId` exported once via `modules-kpi`; identical type here.)
var modules_order_api_client_1 = require("./api/modules-order-api-client");
Object.defineProperty(exports, "OrderModuleApiClient", { enumerable: true, get: function () { return modules_order_api_client_1.OrderModuleApiClient; } });
// modules/items
var modules_items_api_client_1 = require("./api/modules-items-api-client");
Object.defineProperty(exports, "ItemsModuleApiClient", { enumerable: true, get: function () { return modules_items_api_client_1.ItemsModuleApiClient; } });
// modules/appeal
var modules_appeal_api_client_1 = require("./api/modules-appeal-api-client");
Object.defineProperty(exports, "AppealModuleApiClient", { enumerable: true, get: function () { return modules_appeal_api_client_1.AppealModuleApiClient; } });
// modules/application
var modules_application_api_client_1 = require("./api/modules-application-api-client");
Object.defineProperty(exports, "ApplicationModuleApiClient", { enumerable: true, get: function () { return modules_application_api_client_1.ApplicationModuleApiClient; } });
// modules/disbursement
var modules_disbursement_api_client_1 = require("./api/modules-disbursement-api-client");
Object.defineProperty(exports, "DisbursementModuleApiClient", { enumerable: true, get: function () { return modules_disbursement_api_client_1.DisbursementModuleApiClient; } });
// modules/referral
var modules_referral_api_client_1 = require("./api/modules-referral-api-client");
Object.defineProperty(exports, "ReferralModuleApiClient", { enumerable: true, get: function () { return modules_referral_api_client_1.ReferralModuleApiClient; } });
// modules/report
var modules_report_api_client_1 = require("./api/modules-report-api-client");
Object.defineProperty(exports, "ReportModuleApiClient", { enumerable: true, get: function () { return modules_report_api_client_1.ReportModuleApiClient; } });
// modules/verification
var modules_verification_api_client_1 = require("./api/modules-verification-api-client");
Object.defineProperty(exports, "VerificationModuleApiClient", { enumerable: true, get: function () { return modules_verification_api_client_1.VerificationModuleApiClient; } });
// modules/connector
var modules_connector_api_client_1 = require("./api/modules-connector-api-client");
Object.defineProperty(exports, "ConnectorModuleApiClient", { enumerable: true, get: function () { return modules_connector_api_client_1.ConnectorModuleApiClient; } });
// modules/etl
var modules_etl_api_client_1 = require("./api/modules-etl-api-client");
Object.defineProperty(exports, "ETLModuleApiClient", { enumerable: true, get: function () { return modules_etl_api_client_1.ETLModuleApiClient; } });
// modules/workflow
var modules_workflow_api_client_1 = require("./api/modules-workflow-api-client");
Object.defineProperty(exports, "WorkflowModuleApiClient", { enumerable: true, get: function () { return modules_workflow_api_client_1.WorkflowModuleApiClient; } });
// modules/services
var modules_services_api_client_1 = require("./api/modules-services-api-client");
Object.defineProperty(exports, "ServicesModuleApiClient", { enumerable: true, get: function () { return modules_services_api_client_1.ServicesModuleApiClient; } });
// modules/nudge
var modules_nudge_api_client_1 = require("./api/modules-nudge-api-client");
Object.defineProperty(exports, "NudgeModuleApiClient", { enumerable: true, get: function () { return modules_nudge_api_client_1.NudgeModuleApiClient; } });
// modules/coinbase (public webhook — instantiate with `getDomain: () => null`
// and pass `{ auth: false }` per-call; see client header for details).
var modules_coinbase_api_client_1 = require("./api/modules-coinbase-api-client");
Object.defineProperty(exports, "CoinbaseModuleApiClient", { enumerable: true, get: function () { return modules_coinbase_api_client_1.CoinbaseModuleApiClient; } });
// -----------------------------------------------------------------------------
// Phase 2 small-module slice clients (one client per Laravel module)
// -----------------------------------------------------------------------------
// H5i (i5h messaging protocol — deal runtime)
var h5i_api_client_1 = require("./api/h5i-api-client");
Object.defineProperty(exports, "H5iApiClient", { enumerable: true, get: function () { return h5i_api_client_1.H5iApiClient; } });
// RLHF (CI-RLHF peer-service proxy)
var rlhf_api_client_1 = require("./api/rlhf-api-client");
Object.defineProperty(exports, "RlhfApiClient", { enumerable: true, get: function () { return rlhf_api_client_1.RlhfApiClient; } });
// Fail (failure-recovery event log)
var fail_api_client_1 = require("./api/fail-api-client");
Object.defineProperty(exports, "FailApiClient", { enumerable: true, get: function () { return fail_api_client_1.FailApiClient; } });
// Hitl (human-in-the-loop staffing / escalation)
var hitl_api_client_1 = require("./api/hitl-api-client");
Object.defineProperty(exports, "HitlApiClient", { enumerable: true, get: function () { return hitl_api_client_1.HitlApiClient; } });
// Hrm (codify-careers HRM relay)
var hrm_api_client_1 = require("./api/hrm-api-client");
Object.defineProperty(exports, "HrmApiClient", { enumerable: true, get: function () { return hrm_api_client_1.HrmApiClient; } });
// Lms (Teachify grading webhook)
var lms_api_client_1 = require("./api/lms-api-client");
Object.defineProperty(exports, "LmsApiClient", { enumerable: true, get: function () { return lms_api_client_1.LmsApiClient; } });
// Facilities (CriticalAsset venue / location proxy)
var facilities_api_client_1 = require("./api/facilities-api-client");
Object.defineProperty(exports, "FacilitiesApiClient", { enumerable: true, get: function () { return facilities_api_client_1.FacilitiesApiClient; } });
// -----------------------------------------------------------------------------
// Gap-fill slice clients (Round 3 follow-up)
// -----------------------------------------------------------------------------
// chain
var chain_api_client_1 = require("./api/chain-api-client");
Object.defineProperty(exports, "ChainApiClient", { enumerable: true, get: function () { return chain_api_client_1.ChainApiClient; } });
// systems — tenant-agnostic catalog of every codify-* non-generic system
// (powers sys/ MFE's sidebar Systems submenu) + the legacy tenant-scoped
// per-vertical endpoints.
var systems_api_client_1 = require("./api/systems-api-client");
Object.defineProperty(exports, "SystemsApiClient", { enumerable: true, get: function () { return systems_api_client_1.SystemsApiClient; } });
// schedule
var schedule_api_client_1 = require("./api/schedule-api-client");
Object.defineProperty(exports, "ScheduleApiClient", { enumerable: true, get: function () { return schedule_api_client_1.ScheduleApiClient; } });
// agent communication
var agent_communication_api_client_1 = require("./api/agent-communication-api-client");
Object.defineProperty(exports, "AgentCommunicationApiClient", { enumerable: true, get: function () { return agent_communication_api_client_1.AgentCommunicationApiClient; } });
// subproject admin
var subproject_admin_api_client_1 = require("./api/subproject-admin-api-client");
Object.defineProperty(exports, "SubprojectAdminApiClient", { enumerable: true, get: function () { return subproject_admin_api_client_1.SubprojectAdminApiClient; } });
// gap-fill clients (wired post-integration)
var misc_core_api_client_1 = require("./api/misc-core-api-client");
Object.defineProperty(exports, "MiscCoreApiClient", { enumerable: true, get: function () { return misc_core_api_client_1.MiscCoreApiClient; } });
var wizard_setup_api_client_1 = require("./api/wizard-setup-api-client");
Object.defineProperty(exports, "WizardSetupApiClient", { enumerable: true, get: function () { return wizard_setup_api_client_1.WizardSetupApiClient; } });
var project_settings_api_client_1 = require("./api/project-settings-api-client");
Object.defineProperty(exports, "ProjectSettingsApiClient", { enumerable: true, get: function () { return project_settings_api_client_1.ProjectSettingsApiClient; } });
var dashboard_program_api_client_1 = require("./api/dashboard-program-api-client");
Object.defineProperty(exports, "DashboardProgramApiClient", { enumerable: true, get: function () { return dashboard_program_api_client_1.DashboardProgramApiClient; } });
var subproject_wizard_api_client_1 = require("./api/subproject-wizard-api-client");
Object.defineProperty(exports, "SubprojectWizardApiClient", { enumerable: true, get: function () { return subproject_wizard_api_client_1.SubprojectWizardApiClient; } });
var modules_intake_api_client_1 = require("./api/modules-intake-api-client");
Object.defineProperty(exports, "IntakeModuleApiClient", { enumerable: true, get: function () { return modules_intake_api_client_1.IntakeModuleApiClient; } });
// Codify-domain client + types + Mermaid helper. Powers consumers that
// render the domain → intent → deal-template → comments surface
// (CI-MYC's /agent/:tld page being the first). dealTemplateToMermaid
// emits a sequenceDiagram string consumed by any Mermaid-rendering
// component.
var codify_domain_api_client_1 = require("./api/codify-domain-api-client");
Object.defineProperty(exports, "CodifyDomainApiClient", { enumerable: true, get: function () { return codify_domain_api_client_1.CodifyDomainApiClient; } });
var deal_template_to_mermaid_1 = require("./utils/deal-template-to-mermaid");
Object.defineProperty(exports, "dealTemplateToMermaid", { enumerable: true, get: function () { return deal_template_to_mermaid_1.dealTemplateToMermaid; } });
// Codify (codification surface) client — the admin HITL CRUD/approval
// workflow + public list/kind-render/lookup helpers that the public-read
// `CodifyDomainApiClient` does not cover. Distinct class name to avoid the
// existing `CodifyDomainApiClient` collision.
var codify_api_client_1 = require("./api/codify-api-client");
Object.defineProperty(exports, "CodifyApiClient", { enumerable: true, get: function () { return codify_api_client_1.CodifyApiClient; } });
// Integrations (subproject federation) client — the machine-to-machine glue
// IBD/PHM/MOB/NIO + codify-careers HRM use to write events into P2X. Writes
// carry the subproject:writer ability + an Idempotency-Key; the two token-
// mint endpoints (nioFirebaseLogin, mobGuestRegister) are unauthenticated.
var integrations_api_client_1 = require("./api/integrations-api-client");
Object.defineProperty(exports, "IntegrationsApiClient", { enumerable: true, get: function () { return integrations_api_client_1.IntegrationsApiClient; } });
// =============================================================================
// Examples (runtime-safe; no Vue imports — the Vue snippets are inside
// JSDoc comment blocks).
// =============================================================================
__exportStar(require("./examples/programs-example"), exports);
__exportStar(require("./examples/items-example"), exports);
__exportStar(require("./examples/auth-example"), exports);
__exportStar(require("./examples/chat-example"), exports);
//# sourceMappingURL=index.js.map