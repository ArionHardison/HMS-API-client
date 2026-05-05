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
  CodifySolutionInput,
  SetupProgramInput,
  ExecuteProgramInput,
  VerifyOutcomeInput,
  ApiResponseData as WizardApiResponseData,
  VersionComparisonData,
} from './api/wizard-api-client';

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
// Examples (runtime-safe; no Vue imports — the Vue snippets are inside
// JSDoc comment blocks).
// =============================================================================
export * from './examples/programs-example';
export * from './examples/items-example';
export * from './examples/auth-example';
export * from './examples/chat-example';
