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
export {
  BaseApiClient,
  AuthApiClient,
  ItemsApiClient,
  createApiClient,
} from './api-client';

export type {
  ApiResponse,
  ApiClientConfig,
  ApiMetaData,
  ApiRequestOptions,
  AuthData,
  LoginData,
  UserData,
  ItemData,
  ItemStatus,
  ItemCollectionData,
  FoodData,
  PaginatedResponse,
  PaginationData,
} from './api-client';

// =============================================================================
// Axios-based HMS suite + domain clients.
// =============================================================================
export {
  createHmsApiClient,
  createGovApiClient,
  createMktApiClient,
  createMfeApiClient,
  hmsApiClient,
  govApiClient,
  mktApiClient,
  mfeApiClient,
  DomainApiClient,
  // Domain-specific client classes
  UserApiClient,
  TeamApiClient,
  ProgramsApiClient,
  ProtocolApiClient,
  KPIApiClient,
  ChatApiClient,
  NotificationApiClient,
  StripeApiClient,
  NudgeApiClient,
  FollowUpsApiClient,
  ActivityApiClient,
  AssessmentsApiClient,
  ChallengeApiClient,
  OrderApiClient,
  PaymentApiClient,
} from './api/hms-api-client';

export type {
  HmsApiClient,
  ApiModule,
  ProgramData,
  ProtocolData,
  TeamMemberData,
  DomainData,
} from './api/hms-api-client';

// =============================================================================
// Five-Step Wizard client.
// =============================================================================
export { WizardApiClient, WizardStepExecutor, wizardSteps, wizardApiClient } from './api/wizard-api-client';
export type {
  DealData,
  DealSnapshotData,
  ProgramData as WizardProgramData,
  ProtocolData as WizardProtocolData,
  StepResultData,
  JobStatusData,
  DefineProblemInput,
  DefineDealInput,
  CodifySolutionInput,
  SetupProgramInput,
  ExecuteProgramInput,
  VerifyOutcomeInput,
  ApiResponseData as WizardApiResponseData,
  VersionComparisonData,
} from './api/wizard-api-client';

// =============================================================================
// Deal Runtime Wizard client — route-accurate fetch-based companion covering
// the 17 `/api/wizard/deal/*` routes (define → verify). Preferred over the
// legacy `WizardApiClient` for new consumers.
// =============================================================================
export { DealWizardApiClient } from './api/deal-wizard-api-client';
export type {
  ComputeDepositAmountCents,
  ComputeDepositRequest,
  ComputeDepositResponse,
  DealApplicantType,
  DealBudgetTier,
  DealEvent,
  DealEventsQuery,
  DealEventsResponse,
  DealFileResource,
  DealFileType,
  DealFinancing,
  DealMutationResponse,
  DealPathTier,
  DealProblem,
  DealRequiredInfoEntry,
  DealResource,
  DealSolution,
  DealStakeholder,
  DefineDealRequest,
  MissingRequiredInfoError,
  MissingWizardDataError,
  PatchDetailsRequest,
  PatchMetadataRequest,
  PatchPathRequest,
  RequiredInfoRequest,
  SelectSolutionRequest,
  SolutionGenerationError,
  UploadFileRequest,
  VerifyOutcomeResponse,
} from './api/deal-wizard-api-client';

// =============================================================================
// Error handling — `ApiError` is a class; `processApiError` etc. are helpers.
// =============================================================================
export {
  ApiError,
  processApiError,
  handleApiCall,
  createFormErrors,
  getErrorMessage,
} from './api/error-handling';
export type { ApiErrorInit } from './api/error-handling';

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
export type {
  AdminLoginBySocialTokenResponse,
  AdminUpdateUserRequest,
  AdminUserData,
  BasicUserSummary,
  ChangeUserCoverRequest,
  ChangeUserPhotoRequest,
  CurrentUserData,
  DashboardAuthBySocialTokenRequest,
  DashboardJoinByTokenRequest,
  DashboardJoinRequest,
  DashboardLoginRequest,
  DashboardLoginResponse,
  DeleteRoleRequest,
  DeleteUserRequest,
  EmptyOk,
  FinishCodifyRegistrationRequest,
  FinishSocialRegistrationRequest,
  GetCodeRequest,
  HandleUserTagRequest,
  InvitedUserSummary,
  NewPasswordRequest,
  PaginatedPayload,
  PublicUserProfile,
  ResetPasswordRequest,
  RestrictUserRequest,
  RestrictedUserSummary,
  RoleRecord,
  SetRoleRequest,
  SetTimezoneRequest,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  UpdateBillingInfoRequest,
  UpdatePasswordRequest,
  UpdatePhoneRequest,
  UpdatePricingRequest,
  UpdateUserRequest,
  UsersChangeCoverRequest,
  UsersChangePhotoRequest,
} from './api/auth-user-api-client';

// -----------------------------------------------------------------------------
// Subproject (hierarchy-aware) — the canonical multi-tenant boot +
// subproject lifecycle client. `TenancyApiClient` (below) is a
// `@deprecated` alias retained for one minor; removed in 2.0.0.
// -----------------------------------------------------------------------------
export { SubprojectApiClient } from './api/subproject-api-client';
export type {
  DpgInstance,
  DpgInstanceMode,
  Subproject,
  SubprojectBaseInterface,
  SubprojectLoadResponse,
} from './types/subproject';
export { resolveInherited } from './utils/resolve-inherited';

// -----------------------------------------------------------------------------
// Tenancy (deprecated alias — use SubprojectApiClient)
// -----------------------------------------------------------------------------
export { TenancyApiClient } from './api/tenancy-api-client';
export type {
  AuthenticateAtTenantData,
  CompleteTenantClaimRequest,
  ConfirmSubprojectAdminAccountRequest,
  ContactData,
  CreateCreatorRequest,
  CreateDocumentationRequest,
  CreateDomainInterfaceRequest,
  CreateSeoPageRequest,
  CreateWorldLocationCityRequest,
  CreateWorldLocationCountryRequest,
  CreateWorldLocationStateRequest,
  CreatorActivityData,
  CreatorData,
  CreatorRequestData,
  DocumentationItem,
  DomainInterface,
  EmptyOk as TenancyEmptyOk,
  FindClaimableSubprojectRequest,
  FindContactsRequest,
  FrontendData,
  GovDirectoryItem,
  ImportContactsRequest,
  InitiateTenantClaimRequest,
  ListContactsRequest,
  LoadSubprojectResult,
  LoadTenantResult,
  PaginatedPayload as TenancyPaginatedPayload,
  PublicCountryData,
  PublicTenantLogoData,
  RegisterSubprojectAdministratorRequest,
  SaveContactRequest,
  SaveFeaturedCreatorsRequest,
  SaveFeaturedProgramsRequest,
  SaveFrontendRequest,
  SeoPageData,
  StartSubprojectClaimRequest,
  SubprojectAdminLoginRequest,
  SubprojectClientData,
  SubprojectDashboardDefaultData,
  SubprojectDetailData,
  SubprojectHasContactsRequest,
  SubprojectInterfaceData,
  SubprojectLeaderData,
  SubprojectListItem,
  SubprojectSearchRequest,
  SubprojectSectionPayload,
  SubprojectSendInvitesRequest,
  SubprojectUpdatePermissionsRequest,
  TenantClaimData,
  TenantClaimSearchItem,
  TenantClaimStatusData,
  TenantInterfaceBlockItem,
  TenantInterfaceItem,
  TenantInterfacePageItem,
  TenantRegistrationFee,
  UpdateCreatorRequest,
  UpdateDocumentationRequest,
  UpdateDomainInterfaceRequest,
  UpdateSeoPageRequest,
  VerifyTenantClaimRequest,
  WorldLocationCity,
  WorldLocationCountry,
  WorldLocationState,
} from './api/tenancy-api-client';

// -----------------------------------------------------------------------------
// Programs + team
// -----------------------------------------------------------------------------
export { ProgramsTeamApiClient } from './api/programs-team-api-client';
export type {
  AdditionalProtocolValidationResult,
  AllProgramData,
  BuyProgramResult,
  DetachProgramProtocolRequest,
  DetachProgramProtocolResult,
  HandleTeamRoleRequest,
  InviteTeamMemberRequest,
  NetworkSearchRequest,
  NetworkSearchResult,
  ProgramAddTagRequest,
  ProgramBookmarkRequest,
  ProgramBookmarkResult,
  ProgramBuyRequest,
  ProgramChainStepUsersData,
  ProgramData as ProgramsTeamProgramData,
  ProgramDataToUse,
  ProgramHomeSearchResult,
  ProgramInstanceData,
  ProgramSaleData,
  ProgramSalePriceData,
  ProgramSimulationData,
  ProgramTagData,
  ProgramUserSummary,
  ProgramValidationResult,
  ProgramsFilterRequest,
  PublishProgramData,
  PublishProgramRequest,
  RoleResource,
  RunPersonalProgramRequest,
  RunPersonalProgramResult,
  SearchProgramRequest,
  SubprojectPermissionsData,
  SubprojectRoleData,
  TeamMemberIdRequest,
  TeamSearchRequest,
  UpdateProgramRequest,
  UpdateSubprojectRoleRequest,
  UserAllTeamMember,
  UserInviteListItem,
  UserPotentialTeamInviteData,
  UserTeamAvailableRole,
  UserTeamListItem,
  UserTeamResult,
  UserTeamSearchResult,
  ValidateAdditionalProtocolRequest,
  ValidateProgramRequest,
} from './api/programs-team-api-client';

// -----------------------------------------------------------------------------
// Protocol (new domain client; renamed to avoid collision with the legacy
// `ProtocolApiClient` re-exported from `hms-api-client`).
// -----------------------------------------------------------------------------
export { ProtocolApiClient as ProtocolDomainApiClient } from './api/protocol-api-client';
export type {
  AddProtocolPlanBranchItemResource,
  ChainItemMemberResource,
  CodifyPipelineStartedResource,
  CodifyPipelineStatusResource,
  ConfirmPlanResource,
  ConfirmProtocolPlanRequest,
  CreateProtocolCategoryRequest,
  EditProtocolPlanBranchItemRequest,
  EditProtocolPlanBranchResource,
  EditProtocolPlanModuleItemRequest,
  EditProtocolPlanModuleResource,
  EtlProtocolIntegrationItem,
  ModuleValidationResource,
  ProtocolAiCreationResource,
  ProtocolAiCreateItemRequest,
  ProtocolAiCreateWholeRequest,
  ProtocolAiPlanResource,
  ProtocolBranchPlanRequest,
  ProtocolCategoryResource,
  ProtocolGlobalModuleResource,
  ProtocolGlobalModuleShowResource,
  ProtocolIntegrationItem,
  ProtocolModuleSummary,
  ProtocolResource,
  ProtocolSaleResource,
  ProtocolSettingsResource,
  ProtocolStepResource,
  ProtocolStoreSettingsRequest,
  ProtocolSwitchMemberRequest,
  StartCodifyPipelineRequest,
  StoreGlobalModuleRequest,
  StoreProtocolRequest,
  StoreSaleRequest,
  UpdateGlobalModuleRequest,
  UpdateProtocolCategoryRequest,
  UpdateProtocolRequest,
  UpdateSaleRequest,
  ValidateBranchModuleRequest,
  ValidateModuleRequest,
} from './api/protocol-api-client';

// -----------------------------------------------------------------------------
// Personal-chain wizard (codify pipeline polling envelope)
// -----------------------------------------------------------------------------
export { PersonalChainWizardApiClient } from './api/personal-chain-wizard-api-client';
export type {
  CancelInvitationRequestBody,
  CodifyAck,
  CodifyJobState,
  CodifyRunRequestBody,
  CodifySaveAnswerRequestBody,
  CodifyStartSessionRequestBody,
  CodifyStateRaw,
  FindUsersToInviteRequestBody,
  FinishedNotRatedProgramSummary,
  InviteUserToPersonalChainRequestBody,
  LastChainSummary,
  PersonalChainAck,
  ProgramFeedbackData,
  ProtocolPersonalChainSummary,
  ProtocolStepData,
  StartProgramRequestBody,
  StoreFeedbackRequestBody,
  WizardCodifyRequestBody,
} from './api/personal-chain-wizard-api-client';

// -----------------------------------------------------------------------------
// Communications (chat / notifications / Stripe Connect / webhook)
// -----------------------------------------------------------------------------
export { CommunicationsApiClient } from './api/communications-api-client';
export type {
  BroadcastingAuthRequest,
  BroadcastingAuthResponse,
  ChatBroadcastMessageRequest,
  ChatGetRoomRequest,
  ChatMessageData,
  ChatRoomData,
  ChatSendMessageRequest,
  ChatStartRequest,
  EmptyOk as CommunicationsEmptyOk,
  NotificationData,
  NotificationStartTaskRequest,
  PaginatedPayload as CommunicationsPaginatedPayload,
  PaymentMethodData,
  PaymentMethodSaveRequest,
  ProgramPurchaseData,
  PurchasedItemData,
  SetupPaymentMethodData,
  StripeAccountStatusData,
  StripeConnectData,
  StripePaymentWebhookRequest,
  StripePaymentWebhookResponse,
  StripeTransactionsData,
  StripeWithdrawData,
  SubscriptionData,
  SubscriptionListItem,
  SubscriptionRollupData,
} from './api/communications-api-client';

// -----------------------------------------------------------------------------
// Admin
// -----------------------------------------------------------------------------
export { AdminApiClient } from './api/admin-api-client';
export type {
  AdministratorData,
  AdminCreateUserRequest,
  AdminEmptyOk,
  AdminPaginatedPayload,
  AdminSearchRequest,
  AdminUserData as AdminApiUserData,
  AiInstallationStatusData,
  AiLogData,
  AiLogRequest,
  AiModelData,
  AiPolicyData,
  AiPolicyRequest,
  AiPromptData,
  AiSettingsData,
  AttachPromptToPolicyRequest,
  CreateAdministratorRequest,
  CreateAiPromptRequest,
  CreateProgramCategoryRequest,
  CreateProgramSubCategoryRequest,
  DomainSettingsData,
  FeeSettingsData,
  FindFeeUsersRequest,
  ProgramCategoryData,
  ProgramSubCategoryData,
  ProgramTagData as AdminProgramTagData,
  ProgramTagRequest,
  ProjectRoleData,
  ProjectRoleRequest,
  ProviderData,
  ProviderRolesData,
  RolesToAssignData,
  SaveAiSettingsRequest,
  SaveDashboardSettingsRequest,
  SaveFeeSettingsRequest,
  StatisticData,
  StatisticRequest,
  TeamSearchRequest as AdminTeamSearchRequest,
  UpdateAdministratorRequest,
  UpdateAiPromptRequest,
  UpdateProgramCategoryRequest,
  UpdateProgramSubCategoryRequest,
  UserFeeSettingsData,
  UserFeeSettingsRequest,
} from './api/admin-api-client';

// -----------------------------------------------------------------------------
// Module slice clients (Round 3 fan-out — one client per Laravel module)
// -----------------------------------------------------------------------------

// modules/agents
export { AgentsModuleApiClient } from './api/modules-agents-api-client';
export type {
  AgentId,
  ToolId,
  AgentResource,
  AgentExecutionResource,
  AgentStatisticsResource,
  AgentsProtocolIntegrationResource,
  CreateAgentInput,
  UpdateAgentInput,
  CloneAgentInput,
  ExecuteProtocolInput,
  ResumeExecutionInput,
  AgentExecutionStatus,
  IntelligentResponse,
  IdentifyEntityInput,
  ProcessIntentInput,
  BatchIntentInput,
  IntelligentSearchInput,
} from './types/modules-agents';

// modules/kpi
export { KPIModuleApiClient } from './api/modules-kpi-api-client';
export type {
  ChainId,
  ProtocolId,
  KPIRuleId,
  KPITaskResource,
  KPISettingsPreparedResource,
  KPISettingsResource,
  KPIRoundResultsResource,
  KPIParameterValidationResource,
  ProtocolOnboardingResource,
  WithingsDeviceResource,
  SaveKPIInput,
  SaveKPISetupInput,
  SaveRoundResultsInput,
  ValidateParametersInput,
  SaveOnboardingInput,
  WithingsWebhookInput,
  KPISetupData,
  KPIRuleData,
  UserDeviceData,
} from './types/modules-kpi';

// modules/activity
export { ActivityModuleApiClient } from './api/modules-activity-api-client';
export type {
  ActivityLocationId,
  ActivityId,
  ActivityBookingId,
  LocationId,
  ServiceId,
  DateString,
  ActivityLocationResource,
  ActivityResource,
  ActivityBookingResource,
  BookedEventsResponse,
  BookingWindowResource,
  ProviderResource,
  ServiceLocationResource,
  PendingAmountResource,
  CreateActivityLocationInput,
  CreateCreatorActivityInput,
  ConfirmBookingInput,
  HandleEventInput,
  ResetReservationInput,
  SetReservationInput,
  RunningActivityInput,
  CreateServiceLocationInput,
  FindServiceLocationInput,
  UpdateServiceLocationInput,
  ActivityProtocolIntegrationResource,
} from './types/modules-activity';

// modules/assessments
export { AssessmentsModuleApiClient } from './api/modules-assessments-api-client';
export type {
  AssessmentId,
  AttendId,
  QuestionId,
  ResponseId,
  ChoiceId,
  ChainOrTaskId,
  AssessmentResource,
  AttendResource,
  QuestionResource,
  ResponseResource,
  AssessmentItemInstanceResource,
  RunAssessmentResponse,
  CreateAssessmentInput,
  CreateAttendInput,
  CreateQuestionInput,
  CreateResponseInput,
  AssessmentsProtocolIntegrationResource,
} from './types/modules-assessments';

// modules/challenge
export { ChallengeModuleApiClient } from './api/modules-challenge-api-client';
export type {
  ChallengeId,
  AttachedChallengeId,
  ChallengeResultId,
  ChallengeTaskOrChainId,
  ChallengeResource,
  AttachedChallengeResource,
  ChallengeTaskResource,
  ChallengeResultResource,
  RunChallengeResponse,
  CreateChallengeInput,
  RunChallengeInput,
  RunGlobalChallengeInput,
  StartChallengeTaskInput,
  SetChallengeResultInput,
  RecordVideoInput,
  ChallengeProtocolIntegrationResource,
} from './types/modules-challenge';

// modules/followups
export { FollowUpsModuleApiClient } from './api/modules-followups-api-client';
export type {
  FollowUpId,
  FollowUpChainId,
  FollowUpInstanceId,
  RecommendationId,
  RecommendationStatus,
  FollowUpResource,
  FollowUpRecommendationResource,
  FollowUpTimelineEntry,
  FollowUpPaymentResource,
  VoiceFinalizeResource,
  CreateFollowUpInput,
  VoiceRecordInput,
  VoiceFinalizeInput,
} from './types/modules-followups';

// modules/order
// (`ChainId` exported once via `modules-kpi`; identical type here.)
export { OrderModuleApiClient } from './api/modules-order-api-client';
export type {
  OrderId,
  AttachedOrderItemId,
  TaskId,
  AttachedOrderStatus,
  OrderResource,
  OrderWithItemsAndCollectionsResource,
  RunningOrderResource,
  CanceledOrderResource,
  ConfirmedOrderResource,
  AttachedOrderItemsResource,
  AttachedOrderResource,
  OrderPaymentResource,
  OrderFetchShopItemResource,
  AttachedOrderListResource,
  AttachedOrderInstanceResource,
  OrderProtocolIntegrationResource,
  CreateOrderInput,
  UpdateOrderInput,
  UpdateOrderItemInput,
  CancelOrderInput,
  StartCheckoutInput,
  CheckoutItemInput,
  ConfirmOrderInput,
  ConfirmPaymentInput,
  GetShopItemInput,
  ValidateOrderItemInput,
  PutPriceOrderInput,
  OrderDeliveryStartedInput,
} from './types/modules-order';

// modules/items
export { ItemsModuleApiClient } from './api/modules-items-api-client';
export type {
  ItemId,
  UserItemId,
  CollectionId,
  CollectionItemId,
  ItemFindType,
  ItemResource,
  UserItemResource,
  FoodCategoryResource,
  CollectionResource,
  CollectionWithItemsResource,
  CollectionItemResource,
  CollectionListResource,
  CreateCollectionInput,
  UpdateCollectionInput,
  CollectionItemEntry,
  AddItemToCollectionInput,
  CreateUserItemInput,
  UpdateUserItemInput,
  ItemMutationInput,
} from './types/modules-items';

// modules/appeal
export { AppealModuleApiClient } from './api/modules-appeal-api-client';
export type {
  AppealId,
  AppealTaskId,
  AppealChainId,
  AppealResource,
  AppealRunResource,
  AppealStoreInput,
  AppealUpdateInput,
  AppealSubmitInput,
  AppealSubmitResource,
} from './types/modules-appeal';

// modules/application
export { ApplicationModuleApiClient } from './api/modules-application-api-client';
export type {
  ApplicationId,
  ApplicationTaskId,
  ApplicationChainId,
  ApplicationResource,
  ApplicationRunResource,
  ApplicationStoreInput,
  ApplicationUpdateInput,
  ApplicationSubmitInput,
  ApplicationSubmitResource,
} from './types/modules-application';

// modules/disbursement
export { DisbursementModuleApiClient } from './api/modules-disbursement-api-client';
export type {
  DisbursementId,
  DisbursementTaskId,
  DisbursementChainId,
  DisbursementResource,
  DisbursementRunResource,
  DisbursementStoreInput,
  DisbursementUpdateInput,
  DisbursementConfirmInput,
  DisbursementConfirmResource,
} from './types/modules-disbursement';

// modules/referral
export { ReferralModuleApiClient } from './api/modules-referral-api-client';
export type {
  ReferralId,
  ReferralTaskId,
  ReferralChainId,
  ReferralResource,
  ReferralRunResource,
  ReferralStoreInput,
  ReferralUpdateInput,
  ReferralConfirmInput,
  ReferralConfirmResource,
} from './types/modules-referral';

// modules/report
export { ReportModuleApiClient } from './api/modules-report-api-client';
export type {
  ReportId,
  ReportTaskId,
  ReportChainId,
  ReportResource,
  ReportRunResource,
  ReportStoreInput,
  ReportUpdateInput,
  ReportSubmitInput,
  ReportSubmitResource,
} from './types/modules-report';

// modules/verification
export { VerificationModuleApiClient } from './api/modules-verification-api-client';
export type {
  VerificationId,
  VerificationTaskId,
  VerificationChainId,
  VerificationResource,
  VerificationRunResource,
  VerificationStoreInput,
  VerificationUpdateInput,
  VerificationSubmitInput,
  VerificationSubmitResource,
} from './types/modules-verification';

// modules/connector
export { ConnectorModuleApiClient } from './api/modules-connector-api-client';
export type {
  ConnectorId,
  ConnectorChainId,
  ConnectorTaskId,
  ConnectorResource,
  ConnectorExecuteResult,
  ConnectorDiscoverResult,
  CreateConnectorInput,
  UpdateConnectorInput,
  ExecuteConnectorInput,
} from './types/modules-connector';

// modules/etl
export { ETLModuleApiClient } from './api/modules-etl-api-client';
export type {
  PipelineId,
  ETLProtocolIntegrationResource,
  ETLPipelineResource,
  ETLStatusResource,
  ETLComponentsResource,
  ETLCancelResource,
  ETLProcessInput,
  ETLAgentProcessInput,
  ETLSearchAnalyzeInput,
} from './types/modules-etl';

// modules/workflow
export { WorkflowModuleApiClient } from './api/modules-workflow-api-client';
export type {
  CodifyPipelineSessionId,
  CodifyPipelineStateResource,
  CodifyPipelineStopResource,
  CodifyPipelineSaveResponseResource,
  WorkflowProtocolIntegrationResource,
  StartCodifyPipelineInput,
  SaveCodifyPipelineResponseInput,
} from './types/modules-workflow';

// modules/services
export { ServicesModuleApiClient } from './api/modules-services-api-client';
export type {
  ServiceChainId,
  ServiceResolutionSource,
  ResolveServiceInput,
  ReserveServiceSlotInput,
  ReleaseServiceSlotInput,
  ResolveServiceResource,
  ServiceReservationResource,
} from './types/modules-services';

// modules/nudge
export { NudgeModuleApiClient } from './api/modules-nudge-api-client';
export type {
  NudgeId,
  NudgeSecret,
  NudgeResource,
  NudgeProtocolIntegrationResource,
  CreateNudgeInput,
  UpdateNudgeInput,
  NudgeCheckinEmailInput,
  NudgeCheckinSmsInput,
} from './types/modules-nudge';

// modules/coinbase (public webhook — instantiate with `getDomain: () => null`
// and pass `{ auth: false }` per-call; see client header for details).
export { CoinbaseModuleApiClient } from './api/modules-coinbase-api-client';
export type {
  CoinbaseEventId,
  CoinbaseWebhookInput,
  CoinbaseWebhookResource,
} from './types/modules-coinbase';

// -----------------------------------------------------------------------------
// Phase 2 small-module slice clients (one client per Laravel module)
// -----------------------------------------------------------------------------

// H5i (i5h messaging protocol — deal runtime)
export { H5iApiClient } from './api/h5i-api-client';
export type {
  H5iChannelResponse,
  H5iMessage,
  H5iMessageKind,
  H5iMessagePriority,
  H5iPublicBroadcastAuthRequest,
  H5iPublicBroadcastAuthResponse,
  H5iPublicMessagesResponse,
  H5iSeedDemoResponse,
  H5iShowMessageResponse,
  InboxH5iMessageQuery,
  InboxH5iMessageResponse,
  StoreH5iMessageRequest,
  StoreH5iMessageResponse,
} from './api/h5i-api-client';

// RLHF (CI-RLHF peer-service proxy)
export { RlhfApiClient } from './api/rlhf-api-client';
export type {
  RlhfGradeRequest,
  RlhfProxyResponse,
  RlhfSubmissionRequest,
} from './api/rlhf-api-client';

// Fail (failure-recovery event log)
export { FailApiClient } from './api/fail-api-client';
export type {
  FailEventResource,
  FailEventShowResponse,
  FailEventSummaryResponse,
  FailEventsListResponse,
  FailEventsQuery,
  FailRecoveryActionResource,
} from './api/fail-api-client';

// Hitl (human-in-the-loop staffing / escalation)
export { HitlApiClient } from './api/hitl-api-client';
export type {
  HitlDecision,
  HitlRequestedRequest,
  HitlRequestedResponse,
  HitlResumeRequest,
  HitlResumeResponse,
} from './api/hitl-api-client';

// Hrm (codify-careers HRM relay)
export { HrmApiClient } from './api/hrm-api-client';
export type { HrmRelayRequest, HrmRelayResponse } from './api/hrm-api-client';

// Lms (Teachify grading webhook)
export { LmsApiClient } from './api/lms-api-client';
export type { LmsGradingResponse, StoreLmsGradingRequest } from './api/lms-api-client';

// Facilities (CriticalAsset venue / location proxy)
export { FacilitiesApiClient } from './api/facilities-api-client';
export type {
  FacilitiesPortfolioRollupResponse,
  FacilitiesRollupCell,
  FacilitiesRollupRow,
  FacilitiesSystemGroup,
  FacilitiesThemeSignal,
  FacilitiesThemeSignalsResponse,
  FacilitiesThemeTimeSeriesBucket,
} from './api/facilities-api-client';

// -----------------------------------------------------------------------------
// Gap-fill slice clients (Round 3 follow-up)
// -----------------------------------------------------------------------------

// chain
export { ChainApiClient } from './api/chain-api-client';
export type {
  ChainRecord,
  CreateChainRequest,
  SwitchChainParentRequest,
  UpdateChainRequest,
} from './api/chain-api-client';

// systems — tenant-agnostic catalog of every codify-* non-generic system
// (powers sys/ MFE's sidebar Systems submenu) + the legacy tenant-scoped
// per-vertical endpoints.
export { SystemsApiClient } from './api/systems-api-client';
export type {
  SystemCatalogEntry,
  SystemComponent,
  SystemDetail,
  SystemHomeCard,
} from './api/systems-api-client';

// schedule
export { ScheduleApiClient } from './api/schedule-api-client';
export type {
  CreateScheduleCallRequest,
  CreateScheduleRequest,
  ScheduleCallRecord,
  ScheduleRecord,
  UpdateScheduleCallRequest,
  UpdateScheduleRequest,
} from './api/schedule-api-client';

// agent communication
export { AgentCommunicationApiClient } from './api/agent-communication-api-client';
export type {
  AgentChainStatus,
  AgentConfirmCodeRequest,
  AgentFinishRegistrationRequest,
  AgentListMessagesRequest,
  AgentRecord,
  AgentSendMessageRequest,
} from './api/agent-communication-api-client';

// subproject admin
export { SubprojectAdminApiClient } from './api/subproject-admin-api-client';
export type {
  SubprojectContentRequest,
  SubprojectDomainsRequest,
  SubprojectLayoutRequest,
  SubprojectSectionResponse,
  SubprojectSeoRequest,
  SubprojectTeamRequest,
  SubprojectTemplateRequest,
} from './api/subproject-admin-api-client';

// gap-fill clients (wired post-integration)
export { MiscCoreApiClient } from './api/misc-core-api-client';
export type {
  AdminUpdateUserBody,
  ChangeForcedPasswordRequest,
  CreateLoginTransactionDashboardBody,
  CreateLoginTransactionPublicBody,
  GovCitiesQuery,
  GovCityAgenciesQuery,
  GovStatesQuery,
  GovSubprojectsQuery,
  InterfaceGetSmsBody,
  InterfaceVerifyCodeBody,
  MiscCoreResponse,
  PublicAuthBySocialTokenBody,
  PublicContactBody,
  PublicCreatorsFilterBody,
  PublicSubprojectsSearchBody,
  PublicVerifySocialTokenBody,
  SaveFrontendBody,
  SetProgramStatusBody,
  UpdateAiLogRequest,
  UpdateAiPolicyRequest,
  UpdateBillingInfoBody,
  UpdateCreatorBody,
  UpdateCreatorRequestBody,
  UpdateDomainInterfaceBody,
  UpdateFeeRequest,
  UpdatePhoneBody,
  UpdateProgramBody,
  UpdateProgramTagRequest,
  UpdateProjectRoleRequest,
  UpdateProtocolBody,
  UpdateProtocolSaleBody,
  UpdateRoleBody,
  UpdateSeoPageBody,
  UpdateStatisticRequest,
  UpdateSubscriptionBody,
  UpdateUserBody,
  UpdateUserPasswordBody,
  VerifyCodeRequest,
} from './api/misc-core-api-client';

export { WizardSetupApiClient } from './api/wizard-setup-api-client';
export type {
  WizardCompleteProfileRequest,
  WizardConfirmAccountRequest,
  WizardConfirmCodeRequest,
  WizardConfirmPreviewRequest,
  WizardCreatorRequestPayload,
  WizardFindMembersRequest,
  WizardInviteMembersRequest,
  WizardInviteUsersRequest,
  WizardPublishProgramRequest,
  WizardSetAgentRequest,
  WizardSetDistributionTypeRequest,
  WizardSetFinancesRequest,
  WizardSetupResponse,
  WizardValidateEmailRequest,
} from './api/wizard-setup-api-client';

export { ProjectSettingsApiClient } from './api/project-settings-api-client';
export type {
  ProjectSettingsContentRequest,
  ProjectSettingsDomainsRequest,
} from './api/project-settings-api-client';

export { DashboardProgramApiClient } from './api/dashboard-program-api-client';
export type {
  CreateDashboardProgramRequest,
  DashboardProgramRecord,
  DashboardSettingsResponse,
  ProtocolCategoryRecord,
  UpdateDashboardProgramRequest,
} from './api/dashboard-program-api-client';

export { SubprojectWizardApiClient } from './api/subproject-wizard-api-client';

export { IntakeModuleApiClient } from './api/modules-intake-api-client';
export type {
  IntakeAnswersBody,
  IntakeAudienceBody,
  IntakeExchangeResponse,
  IntakeHandoffBody,
  IntakeResponse,
  IntakeStartBody,
  IntakeStartResponse,
} from './api/modules-intake-api-client';

// Codify-domain client + types + Mermaid helper. Powers consumers that
// render the domain → intent → deal-template → comments surface
// (CI-MYC's /agent/:tld page being the first). dealTemplateToMermaid
// emits a sequenceDiagram string consumed by any Mermaid-rendering
// component.
export { CodifyDomainApiClient } from './api/codify-domain-api-client';
export type {
  AgentComment,
  CodifyDealTemplate,
  CodifyIntent,
  CodifyIntentParameter,
  CreateCommentRequest,
  CreateCommentResponse,
  DealTemplateFinancialModel,
  DealTemplatePipelineStep,
  DealTemplateStakeholder,
  DealTemplateSuccessCriterion,
  DealTemplateSystem,
  DomainAgentProfile,
  DomainStakeholder,
  IntentOutcomeRollup,
  ListCommentsResponse,
  ListIntentsResponse,
} from './types/codify-domain';
export { dealTemplateToMermaid } from './utils/deal-template-to-mermaid';

// =============================================================================
// Examples (runtime-safe; no Vue imports — the Vue snippets are inside
// JSDoc comment blocks).
// =============================================================================
export * from './examples/programs-example';
export * from './examples/items-example';
export * from './examples/auth-example';
export * from './examples/chat-example';
