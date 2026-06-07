/**
 * Individual Module Exports for Tree-Shaking Optimization
 *
 * This file allows micro-frontends to import only the specific
 * API clients they need, reducing bundle size.
 */
export { AuthApiClient } from '../hms-api-client';
export { UserApiClient } from '../hms-api-client';
export { TeamApiClient } from '../hms-api-client';
export { ItemsApiClient } from '../hms-api-client';
export { ProgramsApiClient } from '../hms-api-client';
export { ProtocolApiClient } from '../hms-api-client';
export { OrderApiClient } from '../hms-api-client';
export { NudgeApiClient } from '../hms-api-client';
export { ChallengeApiClient } from '../hms-api-client';
export { AssessmentsApiClient } from '../hms-api-client';
export { ActivityApiClient } from '../hms-api-client';
export { FollowUpsApiClient } from '../hms-api-client';
export { KPIApiClient } from '../hms-api-client';
export { ChatApiClient } from '../hms-api-client';
export { NotificationApiClient } from '../hms-api-client';
export { StripeApiClient } from '../hms-api-client';
export { PaymentApiClient } from '../hms-api-client';
export type { ApiResponse, ApiMetaData, ApiClientConfig, ApiError, PaginationData, PaginatedResponse } from '../hms-api-client';
export type { UserData, AuthData, LoginData, RegisterData, ProfileUpdateData, BillingInfo } from '../hms-api-client';
export type { OrderData, OrderItemData, CheckoutData, CheckoutSession, OrderConfirmation, BillingAddress } from '../hms-api-client';
export { OrderStatus } from '../hms-api-client';
export type { ChallengeData, ChallengeSettings, ChallengeRunData, TaskData, TaskStartData, ResultData, VideoResponse } from '../hms-api-client';
export { ChallengeType, ChallengeStatus, TaskStatus } from '../hms-api-client';
export type { AssessmentData, AssessmentSettings, QuestionData, QuestionSettings, ChoiceData, ResponseData, CreateAssessmentData } from '../hms-api-client';
export { AssessmentStatus, QuestionType } from '../hms-api-client';
export type { ActivityData, ActivitySettings, ActivityQuery, LocationData, ProviderData, ReservationData, BookingData, EventData } from '../hms-api-client';
export { ActivityType, ActivityStatus, EventStatus } from '../hms-api-client';
export type { FollowUpData, FollowUpSettings, TimelineData, RecommendationData, VoiceResponse, VoiceFinalizeData, PaymentResult } from '../hms-api-client';
export { FollowUpType, FollowUpStatus, TimelineEventType, RecommendationType, PaymentStatus } from '../hms-api-client';
export type { NudgeData, NudgeSettings, CheckinData, CreateNudgeData } from '../hms-api-client';
export { NudgeStatus } from '../hms-api-client';
export type { ChainData, ChainProgress, ChainSettings } from '../hms-api-client';
export { ChainStatus } from '../hms-api-client';
export { processApiError, handleApiCall, createFormErrors, getErrorMessage } from '../error-handling';
import { ApiClientConfig } from '../hms-api-client';
/**
 * Create a minimal client with only specified modules
 * Perfect for micro-frontends that only need specific functionality
 */
export declare function createMinimalClient(config: ApiClientConfig, modules: string[]): any;
//# sourceMappingURL=index.d.ts.map