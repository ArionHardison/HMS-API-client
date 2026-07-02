/**
 * HMS API TypeScript Client Library
 *
 * This client library provides type-safe access to all HMS API endpoints
 * organized by modules and functionality.
 */
import { AxiosInstance, AxiosResponse } from 'axios';
/**
 * Decide whether a failed request may be retried. Only idempotent methods
 * (GET/HEAD/OPTIONS/DELETE/PUT) are retried automatically; non-idempotent
 * POST/PATCH are retried ONLY when the caller supplied an `Idempotency-Key`,
 * so a create/charge is never silently duplicated. A `status` of `undefined`
 * means a network error (no response).
 */
export declare function isRetryableRequest(method: string | undefined, status: number | undefined, hasIdempotencyKey: boolean): boolean;
/**
 * Base API response structure
 */
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
    meta?: ApiMetaData;
}
/**
 * Metadata included in API responses
 */
export interface ApiMetaData {
    timestamp: string;
    apiVersion: string;
}
/**
 * Configuration options for the API client
 */
export interface ApiClientConfig {
    baseURL: string;
    timeout?: number;
    withCredentials?: boolean;
    headers?: Record<string, string>;
    tenantId?: string;
    environment?: 'gov' | 'mkt' | 'mfe';
    enableRetry?: boolean;
    maxRetries?: number;
    enableLogging?: boolean;
}
/**
 * Generic Error interface for API Errors
 */
export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
    code?: string;
}
/**
 * Pagination data
 */
export interface PaginationData {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
}
/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
    items: T[];
    pagination: PaginationData;
}
/**
 * User data
 */
export interface UserData {
    id: number;
    name: string;
    email: string;
    roles: string[];
    createdAt: string;
    updatedAt: string;
    profileData?: {
        photoUrl?: string;
        coverUrl?: string;
        bio?: string;
        phone?: string;
        timezone?: string;
    };
}
/**
 * Authentication data
 */
export interface AuthData {
    token: string;
    user: UserData;
    expiresAt: string;
}
/**
 * Login credentials
 */
export interface LoginData {
    email: string;
    password: string;
    rememberMe?: boolean;
}
/**
 * Registration data
 */
export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    terms: boolean;
}
/**
 * Password reset request
 */
export interface PasswordResetRequest {
    email: string;
}
/**
 * New password submission
 */
export interface NewPasswordRequest {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
}
/**
 * Profile update data
 */
export interface ProfileUpdateData {
    name?: string;
    bio?: string;
    phone?: string;
    timezone?: string;
}
/**
 * Billing information
 */
export interface BillingInfo {
    billingName?: string;
    billingAddress?: string;
    billingCity?: string;
    billingState?: string;
    billingZip?: string;
    billingCountry?: string;
}
/**
 * Team member data
 */
export interface TeamMemberData {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    joinedAt?: string;
    photoUrl?: string;
}
/**
 * Team invite data
 */
export interface TeamInviteData {
    id: number;
    email: string;
    name?: string;
    role: string;
    status: string;
    token: string;
    expiresAt: string;
}
/**
 * Team invite request
 */
export interface TeamInviteRequest {
    email: string;
    name?: string;
    role: string;
    message?: string;
}
/**
 * Item data
 */
export interface ItemData {
    id: number;
    name: string;
    description: string;
    price: number;
    status: ItemStatus;
    imageUrl?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
}
/**
 * Item collection data
 */
export interface ItemCollectionData {
    id: number;
    name: string;
    description: string;
    items: ItemData[];
    createdAt: string;
    updatedAt: string;
}
/**
 * Item status enum
 */
export declare enum ItemStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PENDING = "pending",
    DELETED = "deleted"
}
/**
 * Food data
 */
export interface FoodData {
    id: number;
    name: string;
    description: string | null;
    protein: number | null;
    carbs: number | null;
    fat: number | null;
    calories: number | null;
    categoryId: number | null;
    createdAt: string | null;
    updatedAt: string | null;
}
/**
 * Food category
 */
export interface FoodCategory {
    id: number;
    name: string;
    description: string | null;
}
/**
 * Program data
 */
export interface ProgramData {
    id: number;
    name: string;
    description: string;
    imageUrl?: string;
    status: ProgramStatus;
    price: number;
    authorId: number;
    author: UserData;
    categoryId: number;
    category: CategoryData;
    createdAt: string;
    updatedAt: string;
}
/**
 * Program status enum
 */
export declare enum ProgramStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
/**
 * Category data
 */
export interface CategoryData {
    id: number;
    name: string;
    description: string | null;
    parentId: number | null;
}
/**
 * Program feedback
 */
export interface ProgramFeedback {
    id: number;
    userId: number;
    programId: number;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
        name: string;
        photoUrl?: string;
    };
}
/**
 * Protocol data
 */
export interface ProtocolData {
    id: number;
    name: string;
    description: string;
    status: ProtocolStatus;
    categoryId: number;
    category: CategoryData;
    createdAt: string;
    updatedAt: string;
}
/**
 * Protocol status enum
 */
export declare enum ProtocolStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    INACTIVE = "inactive"
}
/**
 * Protocol module data
 */
export interface ProtocolModuleData {
    id: number;
    name: string;
    type: string;
    description: string;
    settings: Record<string, any>;
}
/**
 * User device data
 */
export interface UserDeviceData {
    id: number;
    userId: number;
    deviceType: string;
    deviceId: string;
    name: string;
    status: string;
    lastSyncAt: string | null;
    createdAt: string;
    updatedAt: string;
}
/**
 * KPI setup data
 */
export interface KPISetupData {
    id: number;
    protocolId: number;
    chainId: number;
    parameters: Record<string, any>;
    rules: KPIRuleData[];
}
/**
 * KPI rule data
 */
export interface KPIRuleData {
    id: number;
    setupId: number;
    parameter: string;
    operator: string;
    value: string;
    action: string;
}
/**
 * Order data
 */
export interface OrderData {
    id: number;
    userId: number;
    chainId: number;
    protocolId: number;
    status: OrderStatus;
    totalAmount: number;
    currency: string;
    items: OrderItemData[];
    createdAt: string;
    updatedAt: string;
}
/**
 * Order status enum
 */
export declare enum OrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    PROCESSING = "processing",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    FAILED = "failed"
}
/**
 * Order item data
 */
export interface OrderItemData {
    id: number;
    orderId: number;
    itemId: number;
    quantity: number;
    price: number;
    item: ItemData;
}
/**
 * Checkout data
 */
export interface CheckoutData {
    chainId: number;
    items: Array<{
        itemId: number;
        quantity: number;
    }>;
    paymentMethodId?: string;
}
/**
 * Checkout session
 */
export interface CheckoutSession {
    sessionId: string;
    totalAmount: number;
    currency: string;
    expiresAt: string;
}
/**
 * Order confirmation data
 */
export interface OrderConfirmation {
    sessionId: string;
    paymentMethodId: string;
    billingAddress?: BillingAddress;
}
/**
 * Billing address
 */
export interface BillingAddress {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}
/**
 * Nudge data
 */
export interface NudgeData {
    id: number;
    name: string;
    description: string;
    secret: string;
    protocolId: number;
    chainId: number;
    status: NudgeStatus;
    settings: NudgeSettings;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}
/**
 * Nudge status enum
 */
export declare enum NudgeStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SCHEDULED = "scheduled"
}
/**
 * Nudge settings
 */
export interface NudgeSettings {
    frequency: string;
    channels: string[];
    targetAudience?: string;
    customMessage?: string;
}
/**
 * Check-in data
 */
export interface CheckinData {
    nudgeId: number;
    response?: string;
    metadata?: Record<string, any>;
}
/**
 * Create nudge data
 */
export interface CreateNudgeData {
    name: string;
    description: string;
    protocolId: number;
    chainId: number;
    settings: NudgeSettings;
    image?: File;
}
/**
 * Challenge data
 */
export interface ChallengeData {
    id: number;
    name: string;
    description: string;
    type: ChallengeType;
    protocolId: number;
    chainId: number;
    status: ChallengeStatus;
    settings: ChallengeSettings;
    videoUrl?: string;
    createdAt: string;
    updatedAt: string;
}
/**
 * Challenge type enum
 */
export declare enum ChallengeType {
    VIDEO = "video",
    TASK = "task",
    QUIZ = "quiz",
    PHOTO = "photo"
}
/**
 * Challenge status enum
 */
export declare enum ChallengeStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    COMPLETED = "completed"
}
/**
 * Challenge settings
 */
export interface ChallengeSettings {
    duration?: number;
    maxAttempts?: number;
    requiredCompletion: boolean;
    instructions?: string;
}
/**
 * Challenge run data
 */
export interface ChallengeRunData {
    challengeId: number;
    chainId: number;
    parameters?: Record<string, any>;
}
/**
 * Task data
 */
export interface TaskData {
    id: number;
    challengeId: number;
    name: string;
    description: string;
    status: TaskStatus;
    startedAt?: string;
    completedAt?: string;
}
/**
 * Task status enum
 */
export declare enum TaskStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    FAILED = "failed"
}
/**
 * Task start data
 */
export interface TaskStartData {
    taskId: number;
    parameters?: Record<string, any>;
}
/**
 * Result data
 */
export interface ResultData {
    score?: number;
    data: Record<string, any>;
    notes?: string;
}
/**
 * Video response
 */
export interface VideoResponse {
    videoId: string;
    videoUrl: string;
    thumbnailUrl?: string;
    duration?: number;
}
/**
 * Assessment data
 */
export interface AssessmentData {
    id: number;
    name: string;
    description: string;
    protocolId: number;
    chainId: number;
    status: AssessmentStatus;
    questions: QuestionData[];
    settings: AssessmentSettings;
    createdAt: string;
    updatedAt: string;
}
/**
 * Assessment status enum
 */
export declare enum AssessmentStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    INACTIVE = "inactive",
    ARCHIVED = "archived"
}
/**
 * Assessment settings
 */
export interface AssessmentSettings {
    timeLimit?: number;
    randomizeQuestions: boolean;
    showResults: boolean;
    passingScore?: number;
}
/**
 * Question data
 */
export interface QuestionData {
    id: number;
    assessmentId: number;
    text: string;
    type: QuestionType;
    order: number;
    required: boolean;
    choices: ChoiceData[];
    settings?: QuestionSettings;
}
/**
 * Question type enum
 */
export declare enum QuestionType {
    MULTIPLE_CHOICE = "multiple_choice",
    SINGLE_CHOICE = "single_choice",
    TEXT = "text",
    SCALE = "scale",
    YES_NO = "yes_no"
}
/**
 * Question settings
 */
export interface QuestionSettings {
    minValue?: number;
    maxValue?: number;
    maxLength?: number;
    placeholder?: string;
}
/**
 * Choice data
 */
export interface ChoiceData {
    id: number;
    questionId: number;
    text: string;
    value: string | number;
    order: number;
    isCorrect?: boolean;
}
/**
 * Response data
 */
export interface ResponseData {
    assessmentId: number;
    questionId: number;
    choiceId?: number;
    textValue?: string;
    numericValue?: number;
}
/**
 * Create assessment data
 */
export interface CreateAssessmentData {
    name: string;
    description: string;
    protocolId: number;
    chainId: number;
    settings: AssessmentSettings;
    questions: Omit<QuestionData, 'id' | 'assessmentId'>[];
}
/**
 * Activity data
 */
export interface ActivityData {
    id: number;
    name: string;
    description: string;
    type: ActivityType;
    location?: LocationData;
    provider?: ProviderData;
    status: ActivityStatus;
    settings: ActivitySettings;
    createdAt: string;
    updatedAt: string;
}
/**
 * Activity type enum
 */
export declare enum ActivityType {
    EXERCISE = "exercise",
    APPOINTMENT = "appointment",
    CLASS = "class",
    EVENT = "event",
    WORKSHOP = "workshop"
}
/**
 * Activity status enum
 */
export declare enum ActivityStatus {
    AVAILABLE = "available",
    BOOKED = "booked",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
/**
 * Activity settings
 */
export interface ActivitySettings {
    capacity?: number;
    duration: number;
    price?: number;
    cancellationPolicy?: string;
}
/**
 * Location data
 */
export interface LocationData {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    facilities?: string[];
}
/**
 * Provider data
 */
export interface ProviderData {
    id: number;
    name: string;
    description: string;
    rating?: number;
    specialties: string[];
    contactInfo: {
        email?: string;
        phone?: string;
        website?: string;
    };
    avatar?: string;
}
/**
 * Activity query parameters
 */
export interface ActivityQuery {
    type?: ActivityType;
    locationId?: number;
    providerId?: number;
    startDate?: string;
    endDate?: string;
    available?: boolean;
}
/**
 * Reservation data
 */
export interface ReservationData {
    activityId: number;
    startTime: string;
    endTime: string;
    participants: number;
    notes?: string;
}
/**
 * Booking data
 */
export interface BookingData {
    reservationId: number;
    paymentMethodId?: string;
    confirmationRequired: boolean;
}
/**
 * Event data
 */
export interface EventData {
    id: number;
    activityId: number;
    startTime: string;
    endTime: string;
    status: EventStatus;
    participants: number;
    maxParticipants: number;
    activity: ActivityData;
}
/**
 * Event status enum
 */
export declare enum EventStatus {
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
/**
 * Follow-up data
 */
export interface FollowUpData {
    id: number;
    name: string;
    description: string;
    chainId: number;
    protocolId: number;
    type: FollowUpType;
    status: FollowUpStatus;
    settings: FollowUpSettings;
    scheduledAt?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
}
/**
 * Follow-up type enum
 */
export declare enum FollowUpType {
    REMINDER = "reminder",
    CHECK_IN = "check_in",
    ASSESSMENT = "assessment",
    RECOMMENDATION = "recommendation",
    VOICE_CALL = "voice_call"
}
/**
 * Follow-up status enum
 */
export declare enum FollowUpStatus {
    PENDING = "pending",
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
/**
 * Follow-up settings
 */
export interface FollowUpSettings {
    frequency?: string;
    priority: 'low' | 'medium' | 'high';
    autoExecute: boolean;
    requiresResponse: boolean;
    timeoutMinutes?: number;
}
/**
 * Timeline data
 */
export interface TimelineData {
    id: number;
    chainId: number;
    type: TimelineEventType;
    title: string;
    description: string;
    data: Record<string, any>;
    timestamp: string;
    userId: number;
    user: {
        id: number;
        name: string;
        avatar?: string;
    };
}
/**
 * Timeline event type enum
 */
export declare enum TimelineEventType {
    FOLLOW_UP = "follow_up",
    ASSESSMENT = "assessment",
    CHALLENGE = "challenge",
    ORDER = "order",
    ACTIVITY = "activity",
    NOTE = "note"
}
/**
 * Recommendation data
 */
export interface RecommendationData {
    id: number;
    followUpId: number;
    type: RecommendationType;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    actionUrl?: string;
    metadata: Record<string, any>;
    createdAt: string;
}
/**
 * Recommendation type enum
 */
export declare enum RecommendationType {
    PROGRAM = "program",
    ACTIVITY = "activity",
    ITEM = "item",
    ASSESSMENT = "assessment",
    CUSTOM = "custom"
}
/**
 * Voice response
 */
export interface VoiceResponse {
    recordingId: string;
    audioUrl: string;
    duration: number;
    transcript?: string;
}
/**
 * Voice finalize data
 */
export interface VoiceFinalizeData {
    recordingId: string;
    transcript?: string;
    summary?: string;
}
/**
 * Payment result
 */
export interface PaymentResult {
    transactionId: string;
    status: PaymentStatus;
    amount: number;
    currency: string;
    receiptUrl?: string;
}
/**
 * Payment status enum
 */
export declare enum PaymentStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded"
}
/**
 * Chain data - shared across all modules
 */
export interface ChainData {
    id: number;
    name: string;
    description: string;
    protocolId: number;
    userId: number;
    status: ChainStatus;
    progress: ChainProgress;
    settings: ChainSettings;
    createdAt: string;
    updatedAt: string;
}
/**
 * Chain status enum
 */
export declare enum ChainStatus {
    ACTIVE = "active",
    PAUSED = "paused",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
/**
 * Chain progress
 */
export interface ChainProgress {
    currentStep: number;
    totalSteps: number;
    completedSteps: number;
    percentComplete: number;
}
/**
 * Chain settings
 */
export interface ChainSettings {
    autoAdvance: boolean;
    requireCompletion: boolean;
    allowSkip: boolean;
    timeoutDays?: number;
}
/**
 * Chat room data
 */
export interface ChatRoomData {
    id: number;
    type: string;
    participants: UserData[];
    lastMessage: ChatMessageData | null;
    unreadCount: number;
    createdAt: string;
    updatedAt: string;
}
/**
 * Chat message data
 */
export interface ChatMessageData {
    id: number;
    roomId: number;
    userId: number;
    message: string;
    attachments: any[];
    readAt: string | null;
    createdAt: string;
    updatedAt: string;
    user: {
        id: number;
        name: string;
        photoUrl?: string;
    };
}
/**
 * New message request
 */
export interface NewMessageRequest {
    roomId: number;
    message: string;
    attachments?: File[];
}
/**
 * Base API Client class
 */
export declare class BaseApiClient {
    protected readonly client: AxiosInstance;
    protected readonly config: ApiClientConfig;
    constructor(config: ApiClientConfig);
    /** Logging is honored only when explicitly enabled AND not in production. */
    private get loggingEnabled();
    /**
     * Setup request and response interceptors
     */
    private setupInterceptors;
    /**
     * Determine if a request should be retried
     */
    private shouldRetry;
    /**
     * Retry a failed request with exponential backoff
     */
    private retryRequest;
}
/**
 * Authentication API Client
 */
export declare class AuthApiClient extends BaseApiClient {
    /**
     * Login with email and password
     * @param data - Login credentials
     */
    login(data: LoginData): Promise<AxiosResponse<ApiResponse<AuthData>>>;
    /**
     * Register a new user
     * @param data - Registration data
     */
    register(data: RegisterData): Promise<AxiosResponse<ApiResponse<AuthData>>>;
    /**
     * Logout the current user
     */
    logout(): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Get the currently authenticated user
     */
    getCurrentUser(): Promise<AxiosResponse<ApiResponse<UserData>>>;
    /**
     * Request password reset
     * @param data - Password reset request data
     */
    requestPasswordReset(data: PasswordResetRequest): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Set new password
     * @param data - New password data
     */
    setNewPassword(data: NewPasswordRequest): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Check if the user is authenticated
     */
    isAuthenticated(): boolean;
}
/**
 * User API Client
 */
export declare class UserApiClient extends BaseApiClient {
    /**
     * Update user profile
     * @param userId - User ID
     * @param data - Profile update data
     */
    updateProfile(userId: number, data: ProfileUpdateData): Promise<AxiosResponse<ApiResponse<UserData>>>;
    /**
     * Update billing information
     * @param data - Billing information
     */
    updateBillingInfo(data: BillingInfo): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Update phone number
     * @param phone - Phone number
     */
    updatePhone(phone: string): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Update password
     * @param userId - User ID
     * @param currentPassword - Current password
     * @param newPassword - New password
     * @param newPasswordConfirmation - New password confirmation
     */
    updatePassword(userId: number, currentPassword: string, newPassword: string, newPasswordConfirmation: string): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Upload profile photo
     * @param userId - User ID
     * @param photo - Photo file
     */
    uploadProfilePhoto(userId: number, photo: File): Promise<AxiosResponse<ApiResponse<{
        photoUrl: string;
    }>>>;
    /**
     * Upload cover photo
     * @param userId - User ID
     * @param cover - Cover photo file
     */
    uploadCoverPhoto(userId: number, cover: File): Promise<AxiosResponse<ApiResponse<{
        coverUrl: string;
    }>>>;
    /**
     * Get user by username
     * @param username - Username
     */
    getUserByUsername(username: string): Promise<AxiosResponse<ApiResponse<UserData>>>;
    /**
     * Get user by ID
     * @param userId - User ID
     */
    getUserById(userId: number): Promise<AxiosResponse<ApiResponse<UserData>>>;
    /**
     * Search for users
     * @param query - Search query
     */
    searchUsers(query: string): Promise<AxiosResponse<ApiResponse<UserData[]>>>;
    /**
     * Delete account
     * @param userId - User ID
     */
    deleteAccount(userId: number): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Get user wallet balance
     */
    getWalletBalance(): Promise<AxiosResponse<ApiResponse<{
        balance: number;
        currency: string;
    }>>>;
}
/**
 * Team API Client
 */
export declare class TeamApiClient extends BaseApiClient {
    /**
     * Get all team members
     */
    getAllMembers(): Promise<AxiosResponse<ApiResponse<TeamMemberData[]>>>;
    /**
     * Get team members by status
     * @param status - Member status
     */
    getMembersByStatus(status: string): Promise<AxiosResponse<ApiResponse<TeamMemberData[]>>>;
    /**
     * Get invites
     */
    getInvites(): Promise<AxiosResponse<ApiResponse<TeamInviteData[]>>>;
    /**
     * Invite team member
     * @param data - Invite data
     */
    inviteMember(data: TeamInviteRequest): Promise<AxiosResponse<ApiResponse<TeamInviteData>>>;
    /**
     * Invite network member
     * @param userId - User ID
     * @param role - Role
     */
    inviteNetworkMember(userId: number, role: string): Promise<AxiosResponse<ApiResponse<TeamInviteData>>>;
    /**
     * Search network members
     * @param query - Search query
     */
    searchNetworkMembers(query: string): Promise<AxiosResponse<ApiResponse<UserData[]>>>;
    /**
     * Accept invite
     * @param inviteId - Invite ID
     */
    acceptInvite(inviteId: number): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Reject invite
     * @param inviteId - Invite ID
     */
    rejectInvite(inviteId: number): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Leave team
     * @param teamId - Team ID
     */
    leaveTeam(teamId: number): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Remove member
     * @param memberId - Member ID
     */
    removeMember(memberId: number): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Get invite by token
     * @param token - Invite token
     */
    getInviteByToken(token: string): Promise<AxiosResponse<ApiResponse<TeamInviteData>>>;
    /**
     * Accept invite by token
     * @param token - Invite token
     */
    acceptInviteByToken(token: string): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Reject invite by token
     * @param token - Invite token
     */
    rejectInviteByToken(token: string): Promise<AxiosResponse<ApiResponse<null>>>;
}
/**
 * Items API Client
 */
export declare class ItemsApiClient extends BaseApiClient {
    /**
     * Get all items
     * @param params - Query parameters
     */
    getItems(params?: {
        status?: ItemStatus;
        page?: number;
        perPage?: number;
    }): Promise<AxiosResponse<ApiResponse<PaginatedResponse<ItemData>>>>;
    /**
     * Get item by ID
     * @param id - Item ID
     */
    getItem(id: number): Promise<AxiosResponse<ApiResponse<ItemData>>>;
    /**
     * Create item
     * @param data - Item data
     */
    createItem(data: Omit<ItemData, 'id' | 'createdAt' | 'updatedAt'>): Promise<AxiosResponse<ApiResponse<ItemData>>>;
    /**
     * Update item
     * @param id - Item ID
     * @param data - Item data
     */
    updateItem(id: number, data: Partial<Omit<ItemData, 'id' | 'createdAt' | 'updatedAt'>>): Promise<AxiosResponse<ApiResponse<ItemData>>>;
    /**
     * Delete item
     * @param id - Item ID
     */
    deleteItem(id: number): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Search items
     * @param search - Search query
     * @param type - Item type
     */
    searchItems(search: string, type: string): Promise<AxiosResponse<ApiResponse<ItemData[]>>>;
    /**
     * Get food categories
     */
    getFoodCategories(): Promise<AxiosResponse<ApiResponse<FoodCategory[]>>>;
    /**
     * Get all item collections
     */
    getCollections(): Promise<AxiosResponse<ApiResponse<ItemCollectionData[]>>>;
    /**
     * Get collection by ID
     * @param id - Collection ID
     */
    getCollection(id: number): Promise<AxiosResponse<ApiResponse<ItemCollectionData>>>;
    /**
     * Create collection
     * @param data - Collection data
     */
    createCollection(data: {
        name: string;
        description: string;
    }): Promise<AxiosResponse<ApiResponse<ItemCollectionData>>>;
    /**
     * Add item to collection
     * @param collectionId - Collection ID
     * @param itemId - Item ID
     */
    addItemToCollection(collectionId: number, itemId: number): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Remove item from collection
     * @param itemId - Collection item ID
     */
    removeItemFromCollection(itemId: number): Promise<AxiosResponse<ApiResponse<null>>>;
}
/**
 * Programs API Client
 */
export declare class ProgramsApiClient extends BaseApiClient {
    /**
     * Get featured programs
     */
    getFeaturedPrograms(): Promise<AxiosResponse<ApiResponse<ProgramData[]>>>;
    /**
     * Get recent programs
     */
    getRecentPrograms(): Promise<AxiosResponse<ApiResponse<ProgramData[]>>>;
    /**
     * Get program by ID
     * @param id - Program ID
     */
    getProgram(id: number): Promise<AxiosResponse<ApiResponse<ProgramData>>>;
    /**
     * Get program feedback
     * @param id - Program ID
     */
    getProgramFeedback(id: number): Promise<AxiosResponse<ApiResponse<ProgramFeedback[]>>>;
    /**
     * Search programs
     * @param query - Search query
     * @param category - Category ID
     */
    searchPrograms(query: string, category?: number): Promise<AxiosResponse<ApiResponse<ProgramData[]>>>;
    /**
     * Get programs by user
     * @param userId - User ID
     */
    getUserPrograms(userId: number): Promise<AxiosResponse<ApiResponse<ProgramData[]>>>;
    /**
     * Get featured programs by user
     * @param userId - User ID
     */
    getUserFeaturedPrograms(userId: number): Promise<AxiosResponse<ApiResponse<ProgramData[]>>>;
    /**
     * Toggle program bookmark
     * @param programId - Program ID
     */
    toggleBookmark(programId: number): Promise<AxiosResponse<ApiResponse<{
        bookmarked: boolean;
    }>>>;
    /**
     * Get bookmarked programs
     */
    getBookmarks(): Promise<AxiosResponse<ApiResponse<ProgramData[]>>>;
    /**
     * Get program categories
     */
    getCategories(): Promise<AxiosResponse<ApiResponse<CategoryData[]>>>;
}
/**
 * Protocol API Client
 */
export declare class ProtocolApiClient extends BaseApiClient {
    /**
     * Get protocol by ID
     * @param id - Protocol ID
     */
    getProtocol(id: number): Promise<AxiosResponse<ApiResponse<ProtocolData>>>;
    /**
     * Get protocols by category
     * @param categoryId - Category ID
     */
    getProtocolsByCategory(categoryId?: number): Promise<AxiosResponse<ApiResponse<ProtocolData[]>>>;
    /**
     * Get available protocol modules
     * @param recurring - Get recurring modules only
     */
    getModules(recurring?: boolean): Promise<AxiosResponse<ApiResponse<ProtocolModuleData[]>>>;
    /**
     * Get protocol steps
     * @param protocolId - Protocol ID
     */
    getProtocolSteps(protocolId: number): Promise<AxiosResponse<ApiResponse<any[]>>>;
    /**
     * Get protocol categories
     */
    getCategories(): Promise<AxiosResponse<ApiResponse<CategoryData[]>>>;
}
/**
 * KPI API Client
 */
export declare class KPIApiClient extends BaseApiClient {
    /**
     * Get user devices
     */
    getUserDevices(): Promise<AxiosResponse<ApiResponse<UserDeviceData[]>>>;
    /**
     * Redirect to Withings for authentication
     */
    authorizeWithings(): Promise<AxiosResponse<ApiResponse<{
        redirectUrl: string;
    }>>>;
    /**
     * Get KPI setup for a chain
     * @param chainId - Chain ID
     * @param protocolId - Protocol ID
     */
    getKPISetup(chainId: number, protocolId: number): Promise<AxiosResponse<ApiResponse<KPISetupData>>>;
    /**
     * Save KPI setup
     * @param data - KPI setup data
     */
    saveKPISetup(data: Omit<KPISetupData, 'id' | 'rules'>): Promise<AxiosResponse<ApiResponse<KPISetupData>>>;
    /**
     * Remove KPI rule
     * @param ruleId - Rule ID
     */
    removeKPIRule(ruleId: number): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Save round results
     * @param data - Round results data
     */
    saveRoundResults(data: any): Promise<AxiosResponse<ApiResponse<null>>>;
}
/**
 * Chat API Client
 */
export declare class ChatApiClient extends BaseApiClient {
    /**
     * Get chat list
     * @param search - Search query
     */
    getChatList(search?: string): Promise<AxiosResponse<ApiResponse<ChatRoomData[]>>>;
    /**
     * List conversations (alias for getChatList). Added 2026-05-21 (v1.6.0)
     * so sys/src/stores/chat.ts can drop its raw HTTP TODO and call the
     * SDK with the name the consumer expects. Same wire path as getChatList.
     *
     * @param search - Search query
     */
    listConversations(search?: string): Promise<AxiosResponse<ApiResponse<ChatRoomData[]>>>;
    /**
     * Get chat room
     * @param userId - User ID (to create or get a 1:1 chat)
     */
    getChatRoom(userId: number): Promise<AxiosResponse<ApiResponse<ChatRoomData>>>;
    /**
     * Get chat room by ID
     * @param roomId - Room ID
     */
    getChatRoomById(roomId: number): Promise<AxiosResponse<ApiResponse<ChatRoomData>>>;
    /**
     * Get messages for a chat
     * @param chatId - Chat ID
     * @param search - Search query
     */
    getMessages(chatId: number, search?: string): Promise<AxiosResponse<ApiResponse<ChatMessageData[]>>>;
    /**
     * List messages for a conversation (alias for getMessages). Added
     * 2026-05-21 (v1.6.0) — matches the name sys/'s chat store expects.
     *
     * @param conversationId - Conversation (chat) ID
     * @param search - Search query
     */
    listMessages(conversationId: number, search?: string): Promise<AxiosResponse<ApiResponse<ChatMessageData[]>>>;
    /**
     * Send message
     * @param data - Message data
     */
    sendMessage(data: NewMessageRequest): Promise<AxiosResponse<ApiResponse<ChatMessageData>>>;
    /**
     * Find user to chat with
     * @param search - Search query
     */
    findUserToChat(search: string): Promise<AxiosResponse<ApiResponse<UserData[]>>>;
    /**
     * Delete message
     * @param messageId - Message ID
     */
    deleteMessage(messageId: number): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Delete chat
     * @param chatId - Chat ID
     */
    deleteChat(chatId: number): Promise<AxiosResponse<ApiResponse<null>>>;
}
/**
 * Notification API Client
 */
export declare class NotificationApiClient extends BaseApiClient {
    /**
     * Get notifications
     */
    getNotifications(): Promise<AxiosResponse<ApiResponse<any[]>>>;
    /**
     * Get unread notifications count
     */
    getUnreadCount(): Promise<AxiosResponse<ApiResponse<{
        count: number;
    }>>>;
    /**
     * Delete notification
     * @param notificationId - Notification ID
     */
    deleteNotification(notificationId: number): Promise<AxiosResponse<ApiResponse<null>>>;
}
/**
 * Stripe API Client
 */
export declare class StripeApiClient extends BaseApiClient {
    /**
     * Connect to Stripe
     */
    connectToStripe(): Promise<AxiosResponse<ApiResponse<{
        redirectUrl: string;
    }>>>;
    /**
     * Withdraw money
     */
    withdrawMoney(): Promise<AxiosResponse<ApiResponse<any>>>;
    /**
     * Get transactions
     */
    getTransactions(): Promise<AxiosResponse<ApiResponse<any[]>>>;
    /**
     * Check Stripe account
     */
    checkAccount(): Promise<AxiosResponse<ApiResponse<{
        connected: boolean;
        accountId?: string;
    }>>>;
    /**
     * Delete Stripe account
     */
    deleteAccount(): Promise<AxiosResponse<ApiResponse<null>>>;
}
/**
 * Nudge API Client
 */
export declare class NudgeApiClient extends BaseApiClient {
    /**
     * Check nudge secret (Public endpoint - no authentication required)
     * @param secret - Nudge secret
     */
    checkNudgeSecret(secret: string): Promise<AxiosResponse<ApiResponse<boolean>>>;
    /**
     * Email check-in (Public endpoint - no authentication required)
     * @param email - Email address
     * @param data - Check-in data
     */
    emailCheckin(email: string, data: CheckinData): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * SMS check-in (Public endpoint - no authentication required)
     * @param phone - Phone number
     * @param data - Check-in data
     */
    smsCheckin(phone: string, data: CheckinData): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Delete nudge image
     * @param nudgeId - Nudge ID
     */
    deleteNudgeImage(nudgeId: number): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Get all protocol nudges
     */
    getAllProtocolNudges(): Promise<AxiosResponse<ApiResponse<NudgeData[]>>>;
    /**
     * Get all nudges
     */
    getNudges(): Promise<AxiosResponse<ApiResponse<NudgeData[]>>>;
    /**
     * Get nudge by ID
     * @param nudgeId - Nudge ID
     */
    getNudge(nudgeId: number): Promise<AxiosResponse<ApiResponse<NudgeData>>>;
    /**
     * Create nudge
     * @param data - Nudge creation data
     */
    createNudge(data: CreateNudgeData): Promise<AxiosResponse<ApiResponse<NudgeData>>>;
    /**
     * Update nudge
     * @param nudgeId - Nudge ID
     * @param data - Nudge update data
     */
    updateNudge(nudgeId: number, data: Partial<NudgeData>): Promise<AxiosResponse<ApiResponse<NudgeData>>>;
    /**
     * Delete nudge
     * @param nudgeId - Nudge ID
     */
    deleteNudge(nudgeId: number): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Upload nudge image
     * @param nudgeId - Nudge ID
     * @param imageFile - Image file
     */
    uploadNudgeImage(nudgeId: number, imageFile: File): Promise<AxiosResponse<ApiResponse<{
        imageUrl: string;
    }>>>;
    /**
     * Activate nudge
     * @param nudgeId - Nudge ID
     */
    activateNudge(nudgeId: number): Promise<AxiosResponse<ApiResponse<NudgeData>>>;
    /**
     * Deactivate nudge
     * @param nudgeId - Nudge ID
     */
    deactivateNudge(nudgeId: number): Promise<AxiosResponse<ApiResponse<NudgeData>>>;
    /**
     * Schedule nudge
     * @param nudgeId - Nudge ID
     * @param scheduledAt - Scheduled date and time
     */
    scheduleNudge(nudgeId: number, scheduledAt: string): Promise<AxiosResponse<ApiResponse<NudgeData>>>;
    /**
     * Get nudge analytics
     * @param nudgeId - Nudge ID
     */
    getNudgeAnalytics(nudgeId: number): Promise<AxiosResponse<ApiResponse<any>>>;
    /**
     * Get nudge check-ins
     * @param nudgeId - Nudge ID
     */
    getNudgeCheckins(nudgeId: number): Promise<AxiosResponse<ApiResponse<CheckinData[]>>>;
    /**
     * Send test nudge
     * @param nudgeId - Nudge ID
     * @param recipients - Test recipients (email or phone)
     */
    sendTestNudge(nudgeId: number, recipients: string[]): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Get nudges by protocol
     * @param protocolId - Protocol ID
     */
    getNudgesByProtocol(protocolId: number): Promise<AxiosResponse<ApiResponse<NudgeData[]>>>;
    /**
     * Get nudges by chain
     * @param chainId - Chain ID
     */
    getNudgesByChain(chainId: number): Promise<AxiosResponse<ApiResponse<NudgeData[]>>>;
}
/**
 * FollowUps API Client
 */
export declare class FollowUpsApiClient extends BaseApiClient {
    /**
     * Run follow-up
     * @param chainId - Chain ID
     */
    runFollowUp(chainId: number): Promise<AxiosResponse<ApiResponse<any>>>;
    /**
     * Get timeline for chain
     * @param chainId - Chain ID
     */
    getTimeline(chainId: number): Promise<AxiosResponse<ApiResponse<TimelineData[]>>>;
    /**
     * Get recommendations for follow-up
     * @param followupId - Follow-up ID
     */
    getRecommendations(followupId: number): Promise<AxiosResponse<ApiResponse<RecommendationData[]>>>;
    /**
     * Record voice for follow-up
     * @param audioFile - Audio file
     * @param followupId - Follow-up ID
     * @param metadata - Additional metadata
     */
    recordVoice(audioFile: File, followupId: number, metadata?: Record<string, any>): Promise<AxiosResponse<ApiResponse<VoiceResponse>>>;
    /**
     * Finalize voice recording
     * @param data - Voice finalize data
     */
    finalizeVoice(data: VoiceFinalizeData): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Process payment for follow-up
     * @param data - Payment data
     */
    processPayment(data: {
        followupId: number;
        paymentMethodId: string;
        amount: number;
    }): Promise<AxiosResponse<ApiResponse<PaymentResult>>>;
    /**
     * Get all follow-ups
     */
    getFollowUps(): Promise<AxiosResponse<ApiResponse<FollowUpData[]>>>;
    /**
     * Get follow-up by ID
     * @param followupId - Follow-up ID
     */
    getFollowUp(followupId: number): Promise<AxiosResponse<ApiResponse<FollowUpData>>>;
    /**
     * Create follow-up
     * @param data - Follow-up creation data
     */
    createFollowUp(data: Omit<FollowUpData, 'id' | 'createdAt' | 'updatedAt'>): Promise<AxiosResponse<ApiResponse<FollowUpData>>>;
    /**
     * Update follow-up
     * @param followupId - Follow-up ID
     * @param data - Follow-up update data
     */
    updateFollowUp(followupId: number, data: Partial<FollowUpData>): Promise<AxiosResponse<ApiResponse<FollowUpData>>>;
    /**
     * Delete follow-up
     * @param followupId - Follow-up ID
     */
    deleteFollowUp(followupId: number): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Schedule follow-up
     * @param followupId - Follow-up ID
     * @param scheduledAt - Scheduled date and time
     */
    scheduleFollowUp(followupId: number, scheduledAt: string): Promise<AxiosResponse<ApiResponse<FollowUpData>>>;
    /**
     * Cancel follow-up
     * @param followupId - Follow-up ID
     */
    cancelFollowUp(followupId: number): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Complete follow-up
     * @param followupId - Follow-up ID
     * @param data - Completion data
     */
    completeFollowUp(followupId: number, data?: Record<string, any>): Promise<AxiosResponse<ApiResponse<FollowUpData>>>;
    /**
     * Get follow-ups by chain
     * @param chainId - Chain ID
     */
    getFollowUpsByChain(chainId: number): Promise<AxiosResponse<ApiResponse<FollowUpData[]>>>;
    /**
     * Get pending follow-ups
     */
    getPendingFollowUps(): Promise<AxiosResponse<ApiResponse<FollowUpData[]>>>;
    /**
     * Create recommendation
     * @param data - Recommendation creation data
     */
    createRecommendation(data: Omit<RecommendationData, 'id' | 'createdAt'>): Promise<AxiosResponse<ApiResponse<RecommendationData>>>;
    /**
     * Update recommendation
     * @param recommendationId - Recommendation ID
     * @param data - Recommendation update data
     */
    updateRecommendation(recommendationId: number, data: Partial<RecommendationData>): Promise<AxiosResponse<ApiResponse<RecommendationData>>>;
    /**
     * Delete recommendation
     * @param recommendationId - Recommendation ID
     */
    deleteRecommendation(recommendationId: number): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Get voice recordings
     * @param followupId - Follow-up ID
     */
    getVoiceRecordings(followupId: number): Promise<AxiosResponse<ApiResponse<VoiceResponse[]>>>;
    /**
     * Delete voice recording
     * @param recordingId - Recording ID
     */
    deleteVoiceRecording(recordingId: string): Promise<AxiosResponse<ApiResponse<null>>>;
}
/**
 * Activity API Client
 */
export declare class ActivityApiClient extends BaseApiClient {
    /**
     * Get running activities
     * @param data - Activity query parameters
     */
    getRunningActivities(data: ActivityQuery): Promise<AxiosResponse<ApiResponse<ActivityData[]>>>;
    /**
     * Get activity providers
     * @param activityId - Activity ID
     */
    getActivityProviders(activityId: number): Promise<AxiosResponse<ApiResponse<ProviderData[]>>>;
    /**
     * Set reservation
     * @param data - Reservation data
     */
    setReservation(data: ReservationData): Promise<AxiosResponse<ApiResponse<ReservationData>>>;
    /**
     * Confirm booking
     * @param data - Booking data
     */
    confirmBooking(data: BookingData): Promise<AxiosResponse<ApiResponse<BookingData>>>;
    /**
     * Get booked events for a month
     * @param date - Date in YYYY-MM format
     */
    getBookedEventsForMonth(date: string): Promise<AxiosResponse<ApiResponse<EventData[]>>>;
    /**
     * Search service locations
     * @param query - Search query
     */
    searchServiceLocations(query: string): Promise<AxiosResponse<ApiResponse<LocationData[]>>>;
    /**
     * Get all activities
     */
    getActivities(): Promise<AxiosResponse<ApiResponse<ActivityData[]>>>;
    /**
     * Get activity by ID
     * @param activityId - Activity ID
     */
    getActivity(activityId: number): Promise<AxiosResponse<ApiResponse<ActivityData>>>;
    /**
     * Create activity
     * @param data - Activity creation data
     */
    createActivity(data: Omit<ActivityData, 'id' | 'createdAt' | 'updatedAt'>): Promise<AxiosResponse<ApiResponse<ActivityData>>>;
    /**
     * Update activity
     * @param activityId - Activity ID
     * @param data - Activity update data
     */
    updateActivity(activityId: number, data: Partial<ActivityData>): Promise<AxiosResponse<ApiResponse<ActivityData>>>;
    /**
     * Delete activity
     * @param activityId - Activity ID
     */
    deleteActivity(activityId: number): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Get locations
     */
    getLocations(): Promise<AxiosResponse<ApiResponse<LocationData[]>>>;
    /**
     * Get location by ID
     * @param locationId - Location ID
     */
    getLocation(locationId: number): Promise<AxiosResponse<ApiResponse<LocationData>>>;
    /**
     * Create location
     * @param data - Location creation data
     */
    createLocation(data: Omit<LocationData, 'id'>): Promise<AxiosResponse<ApiResponse<LocationData>>>;
    /**
     * Update location
     * @param locationId - Location ID
     * @param data - Location update data
     */
    updateLocation(locationId: number, data: Partial<LocationData>): Promise<AxiosResponse<ApiResponse<LocationData>>>;
    /**
     * Delete location
     * @param locationId - Location ID
     */
    deleteLocation(locationId: number): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Get providers
     */
    getProviders(): Promise<AxiosResponse<ApiResponse<ProviderData[]>>>;
    /**
     * Get provider by ID
     * @param providerId - Provider ID
     */
    getProvider(providerId: number): Promise<AxiosResponse<ApiResponse<ProviderData>>>;
    /**
     * Create provider
     * @param data - Provider creation data
     */
    createProvider(data: Omit<ProviderData, 'id'>): Promise<AxiosResponse<ApiResponse<ProviderData>>>;
    /**
     * Update provider
     * @param providerId - Provider ID
     * @param data - Provider update data
     */
    updateProvider(providerId: number, data: Partial<ProviderData>): Promise<AxiosResponse<ApiResponse<ProviderData>>>;
    /**
     * Delete provider
     * @param providerId - Provider ID
     */
    deleteProvider(providerId: number): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Cancel reservation
     * @param reservationId - Reservation ID
     */
    cancelReservation(reservationId: number): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Get user reservations
     */
    getUserReservations(): Promise<AxiosResponse<ApiResponse<ReservationData[]>>>;
    /**
     * Get available time slots
     * @param activityId - Activity ID
     * @param date - Date in YYYY-MM-DD format
     */
    getAvailableTimeSlots(activityId: number, date: string): Promise<AxiosResponse<ApiResponse<string[]>>>;
}
/**
 * Assessments API Client
 */
export declare class AssessmentsApiClient extends BaseApiClient {
    /**
     * Run assessment
     * @param assessmentId - Assessment ID
     * @param chainId - Chain ID
     */
    runAssessment(assessmentId: number, chainId: number): Promise<AxiosResponse<ApiResponse<any>>>;
    /**
     * Get questions by assessment
     * @param assessmentId - Assessment ID
     */
    getQuestionsByAssessment(assessmentId: number): Promise<AxiosResponse<ApiResponse<QuestionData[]>>>;
    /**
     * Store response
     * @param data - Response data
     */
    storeResponse(data: ResponseData): Promise<AxiosResponse<ApiResponse<ResponseData>>>;
    /**
     * Delete choice
     * @param choiceId - Choice ID
     */
    deleteChoice(choiceId: number): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Get all assessments
     */
    getAssessments(): Promise<AxiosResponse<ApiResponse<AssessmentData[]>>>;
    /**
     * Get assessment by ID
     * @param assessmentId - Assessment ID
     */
    getAssessment(assessmentId: number): Promise<AxiosResponse<ApiResponse<AssessmentData>>>;
    /**
     * Create assessment
     * @param data - Assessment creation data
     */
    createAssessment(data: CreateAssessmentData): Promise<AxiosResponse<ApiResponse<AssessmentData>>>;
    /**
     * Update assessment
     * @param assessmentId - Assessment ID
     * @param data - Assessment update data
     */
    updateAssessment(assessmentId: number, data: Partial<AssessmentData>): Promise<AxiosResponse<ApiResponse<AssessmentData>>>;
    /**
     * Delete assessment
     * @param assessmentId - Assessment ID
     */
    deleteAssessment(assessmentId: number): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Get question by ID
     * @param questionId - Question ID
     */
    getQuestion(questionId: number): Promise<AxiosResponse<ApiResponse<QuestionData>>>;
    /**
     * Create question
     * @param data - Question creation data
     */
    createQuestion(data: Omit<QuestionData, 'id' | 'choices'>): Promise<AxiosResponse<ApiResponse<QuestionData>>>;
    /**
     * Update question
     * @param questionId - Question ID
     * @param data - Question update data
     */
    updateQuestion(questionId: number, data: Partial<QuestionData>): Promise<AxiosResponse<ApiResponse<QuestionData>>>;
    /**
     * Delete question
     * @param questionId - Question ID
     */
    deleteQuestion(questionId: number): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Get choice by ID
     * @param choiceId - Choice ID
     */
    getChoice(choiceId: number): Promise<AxiosResponse<ApiResponse<ChoiceData>>>;
    /**
     * Create choice
     * @param data - Choice creation data
     */
    createChoice(data: Omit<ChoiceData, 'id'>): Promise<AxiosResponse<ApiResponse<ChoiceData>>>;
    /**
     * Update choice
     * @param choiceId - Choice ID
     * @param data - Choice update data
     */
    updateChoice(choiceId: number, data: Partial<ChoiceData>): Promise<AxiosResponse<ApiResponse<ChoiceData>>>;
    /**
     * Get user responses for assessment
     * @param assessmentId - Assessment ID
     * @param userId - User ID (optional, defaults to current user)
     */
    getUserResponses(assessmentId: number, userId?: number): Promise<AxiosResponse<ApiResponse<ResponseData[]>>>;
    /**
     * Get assessment results
     * @param assessmentId - Assessment ID
     * @param userId - User ID (optional, defaults to current user)
     */
    getAssessmentResults(assessmentId: number, userId?: number): Promise<AxiosResponse<ApiResponse<any>>>;
    /**
     * Submit assessment
     * @param assessmentId - Assessment ID
     * @param responses - Array of responses
     */
    submitAssessment(assessmentId: number, responses: ResponseData[]): Promise<AxiosResponse<ApiResponse<any>>>;
}
/**
 * Challenge API Client
 */
export declare class ChallengeApiClient extends BaseApiClient {
    /**
     * Run challenge
     * @param data - Challenge run data
     */
    runChallenge(data: ChallengeRunData): Promise<AxiosResponse<ApiResponse<any>>>;
    /**
     * Get challenge by ID and chain
     * @param challengeId - Challenge ID
     * @param chainId - Chain ID
     */
    getChallenge(challengeId: number, chainId: number): Promise<AxiosResponse<ApiResponse<ChallengeData>>>;
    /**
     * Start challenge task
     * @param data - Task start data
     */
    startTask(data: TaskStartData): Promise<AxiosResponse<ApiResponse<TaskData>>>;
    /**
     * Set challenge result
     * @param resultId - Result ID
     * @param data - Result data
     */
    setResult(resultId: number, data: ResultData): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Record video for challenge
     * @param videoFile - Video file
     * @param challengeId - Challenge ID
     * @param metadata - Additional metadata
     */
    recordVideo(videoFile: File, challengeId: number, metadata?: Record<string, any>): Promise<AxiosResponse<ApiResponse<VideoResponse>>>;
    /**
     * Get all protocol challenges
     */
    getAllProtocolChallenges(): Promise<AxiosResponse<ApiResponse<ChallengeData[]>>>;
    /**
     * Get all challenges
     */
    getChallenges(): Promise<AxiosResponse<ApiResponse<ChallengeData[]>>>;
    /**
     * Create challenge
     * @param data - Challenge creation data
     */
    createChallenge(data: Omit<ChallengeData, 'id' | 'createdAt' | 'updatedAt'>): Promise<AxiosResponse<ApiResponse<ChallengeData>>>;
    /**
     * Update challenge
     * @param challengeId - Challenge ID
     * @param data - Challenge update data
     */
    updateChallenge(challengeId: number, data: Partial<ChallengeData>): Promise<AxiosResponse<ApiResponse<ChallengeData>>>;
    /**
     * Delete challenge
     * @param challengeId - Challenge ID
     */
    deleteChallenge(challengeId: number): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Get challenge tasks
     * @param challengeId - Challenge ID
     */
    getChallengeTasks(challengeId: number): Promise<AxiosResponse<ApiResponse<TaskData[]>>>;
    /**
     * Get task by ID
     * @param taskId - Task ID
     */
    getTask(taskId: number): Promise<AxiosResponse<ApiResponse<TaskData>>>;
    /**
     * Complete task
     * @param taskId - Task ID
     * @param data - Completion data
     */
    completeTask(taskId: number, data?: Record<string, any>): Promise<AxiosResponse<ApiResponse<TaskData>>>;
}
/**
 * Order API Client
 */
export declare class OrderApiClient extends BaseApiClient {
    /**
     * Run order execution
     * @param orderId - Order ID
     * @param chainId - Chain ID
     */
    runOrder(orderId: number, chainId: number): Promise<AxiosResponse<ApiResponse<any>>>;
    /**
     * Get all protocol orders
     */
    getAllProtocolOrders(): Promise<AxiosResponse<ApiResponse<OrderData[]>>>;
    /**
     * Start checkout process
     * @param data - Checkout data
     */
    startCheckout(data: CheckoutData): Promise<AxiosResponse<ApiResponse<CheckoutSession>>>;
    /**
     * Confirm order
     * @param data - Order confirmation data
     */
    confirmOrder(data: OrderConfirmation): Promise<AxiosResponse<ApiResponse<OrderData>>>;
    /**
     * Get orders by status (Admin only - SuperAdmin role required)
     * @param status - Order status
     */
    getOrdersByStatus(status: string): Promise<AxiosResponse<ApiResponse<OrderData[]>>>;
    /**
     * Confirm order price (Admin only - SuperAdmin role required)
     * @param data - Price confirmation data
     */
    confirmOrderPrice(data: {
        order_id: number;
        price: number;
    }): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Get order by ID
     * @param orderId - Order ID
     */
    getOrder(orderId: number): Promise<AxiosResponse<ApiResponse<OrderData>>>;
    /**
     * Get user's orders
     * @param params - Query parameters
     */
    getUserOrders(params?: {
        status?: OrderStatus;
        page?: number;
        limit?: number;
    }): Promise<AxiosResponse<ApiResponse<PaginatedResponse<OrderData>>>>;
    /**
     * Cancel order
     * @param orderId - Order ID
     */
    cancelOrder(orderId: number): Promise<AxiosResponse<ApiResponse<null>>>;
}
/**
 * Payment API Client
 */
export declare class PaymentApiClient extends BaseApiClient {
    /**
     * Get payment history for subscriptions
     */
    getSubscriptionPayments(): Promise<AxiosResponse<ApiResponse<any[]>>>;
    /**
     * Get payment history for program purchases
     */
    getProgramPurchases(): Promise<AxiosResponse<ApiResponse<any[]>>>;
    /**
     * Get purchased items
     */
    getPurchasedItems(): Promise<AxiosResponse<ApiResponse<any[]>>>;
    /**
     * Setup payment method
     */
    setupPaymentMethod(): Promise<AxiosResponse<ApiResponse<{
        clientSecret: string;
    }>>>;
    /**
     * Save payment method
     * @param paymentMethodId - Payment method ID
     */
    savePaymentMethod(paymentMethodId: string): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Get payment methods
     */
    getPaymentMethods(): Promise<AxiosResponse<ApiResponse<any[]>>>;
    /**
     * Delete payment method
     * @param paymentMethodId - Payment method ID
     */
    deletePaymentMethod(paymentMethodId: string): Promise<AxiosResponse<ApiResponse<null>>>;
}
/**
 * Domain configuration data
 */
export interface DomainData {
    id: string;
    name: string;
    hostname: string;
    alternateHostnames?: string[];
    tenant?: {
        id: string;
        name: string;
        environment: string;
    };
    environment: 'gov' | 'mkt' | 'mfe';
    config: {
        routing: {
            defaultRoute: string;
            authRequired: boolean;
            redirects?: Record<string, string>;
        };
        api: {
            baseURL: string;
            version: string;
        };
        features: string[];
        customization?: Record<string, any>;
    };
    status: 'active' | 'inactive' | 'maintenance';
    createdAt: string;
    updatedAt: string;
}
/**
 * Domain API Client
 */
export declare class DomainApiClient extends BaseApiClient {
    /**
     * Get domain configuration by hostname
     * @param hostname - Domain hostname
     */
    getByHostname(hostname: string): Promise<AxiosResponse<ApiResponse<DomainData>>>;
    /**
     * Get all domains
     */
    getAllDomains(): Promise<AxiosResponse<ApiResponse<DomainData[]>>>;
    /**
     * Get domain by ID
     * @param domainId - Domain ID
     */
    getDomain(domainId: string): Promise<AxiosResponse<ApiResponse<DomainData>>>;
    /**
     * Create domain
     * @param data - Domain creation data
     */
    createDomain(data: Omit<DomainData, 'id' | 'createdAt' | 'updatedAt'>): Promise<AxiosResponse<ApiResponse<DomainData>>>;
    /**
     * Update domain
     * @param domainId - Domain ID
     * @param data - Domain update data
     */
    updateDomain(domainId: string, data: Partial<DomainData>): Promise<AxiosResponse<ApiResponse<DomainData>>>;
    /**
     * Delete domain
     * @param domainId - Domain ID
     */
    deleteDomain(domainId: string): Promise<AxiosResponse<ApiResponse<null>>>;
    /**
     * Get domain configuration
     * @param hostname - Domain hostname
     */
    getConfiguration(hostname: string): Promise<AxiosResponse<ApiResponse<DomainData['config']>>>;
    /**
     * Update domain status
     * @param domainId - Domain ID
     * @param status - New status
     */
    updateStatus(domainId: string, status: DomainData['status']): Promise<AxiosResponse<ApiResponse<DomainData>>>;
}
/**
 * Factory function to create a complete HMS API client
 * @param config - API client configuration
 */
export declare function createHmsApiClient(config: ApiClientConfig): {
    auth: AuthApiClient;
    user: UserApiClient;
    team: TeamApiClient;
    items: ItemsApiClient;
    programs: ProgramsApiClient;
    protocols: ProtocolApiClient;
    domains: DomainApiClient;
    order: OrderApiClient;
    nudge: NudgeApiClient;
    challenge: ChallengeApiClient;
    assessments: AssessmentsApiClient;
    activity: ActivityApiClient;
    followUps: FollowUpsApiClient;
    kpi: KPIApiClient;
    chat: ChatApiClient;
    notifications: NotificationApiClient;
    stripe: StripeApiClient;
    payment: PaymentApiClient;
};
/**
 * Create GOV-specific API client
 * @param config - Additional configuration overrides
 */
export declare function createGovApiClient(config?: Partial<ApiClientConfig>): {
    auth: AuthApiClient;
    user: UserApiClient;
    team: TeamApiClient;
    items: ItemsApiClient;
    programs: ProgramsApiClient;
    protocols: ProtocolApiClient;
    domains: DomainApiClient;
    order: OrderApiClient;
    nudge: NudgeApiClient;
    challenge: ChallengeApiClient;
    assessments: AssessmentsApiClient;
    activity: ActivityApiClient;
    followUps: FollowUpsApiClient;
    kpi: KPIApiClient;
    chat: ChatApiClient;
    notifications: NotificationApiClient;
    stripe: StripeApiClient;
    payment: PaymentApiClient;
};
/**
 * Create MKT-specific API client
 * @param config - Additional configuration overrides
 */
export declare function createMktApiClient(config?: Partial<ApiClientConfig>): {
    auth: AuthApiClient;
    user: UserApiClient;
    team: TeamApiClient;
    items: ItemsApiClient;
    programs: ProgramsApiClient;
    protocols: ProtocolApiClient;
    domains: DomainApiClient;
    order: OrderApiClient;
    nudge: NudgeApiClient;
    challenge: ChallengeApiClient;
    assessments: AssessmentsApiClient;
    activity: ActivityApiClient;
    followUps: FollowUpsApiClient;
    kpi: KPIApiClient;
    chat: ChatApiClient;
    notifications: NotificationApiClient;
    stripe: StripeApiClient;
    payment: PaymentApiClient;
};
/**
 * Create MFE-specific API client
 * @param config - Additional configuration overrides
 */
export declare function createMfeApiClient(config?: Partial<ApiClientConfig>): {
    auth: AuthApiClient;
    user: UserApiClient;
    team: TeamApiClient;
    items: ItemsApiClient;
    programs: ProgramsApiClient;
    protocols: ProtocolApiClient;
    domains: DomainApiClient;
    order: OrderApiClient;
    nudge: NudgeApiClient;
    challenge: ChallengeApiClient;
    assessments: AssessmentsApiClient;
    activity: ActivityApiClient;
    followUps: FollowUpsApiClient;
    kpi: KPIApiClient;
    chat: ChatApiClient;
    notifications: NotificationApiClient;
    stripe: StripeApiClient;
    payment: PaymentApiClient;
};
export declare const hmsApiClient: {
    auth: AuthApiClient;
    user: UserApiClient;
    team: TeamApiClient;
    items: ItemsApiClient;
    programs: ProgramsApiClient;
    protocols: ProtocolApiClient;
    domains: DomainApiClient;
    order: OrderApiClient;
    nudge: NudgeApiClient;
    challenge: ChallengeApiClient;
    assessments: AssessmentsApiClient;
    activity: ActivityApiClient;
    followUps: FollowUpsApiClient;
    kpi: KPIApiClient;
    chat: ChatApiClient;
    notifications: NotificationApiClient;
    stripe: StripeApiClient;
    payment: PaymentApiClient;
};
export declare const govApiClient: {
    auth: AuthApiClient;
    user: UserApiClient;
    team: TeamApiClient;
    items: ItemsApiClient;
    programs: ProgramsApiClient;
    protocols: ProtocolApiClient;
    domains: DomainApiClient;
    order: OrderApiClient;
    nudge: NudgeApiClient;
    challenge: ChallengeApiClient;
    assessments: AssessmentsApiClient;
    activity: ActivityApiClient;
    followUps: FollowUpsApiClient;
    kpi: KPIApiClient;
    chat: ChatApiClient;
    notifications: NotificationApiClient;
    stripe: StripeApiClient;
    payment: PaymentApiClient;
};
export declare const mktApiClient: {
    auth: AuthApiClient;
    user: UserApiClient;
    team: TeamApiClient;
    items: ItemsApiClient;
    programs: ProgramsApiClient;
    protocols: ProtocolApiClient;
    domains: DomainApiClient;
    order: OrderApiClient;
    nudge: NudgeApiClient;
    challenge: ChallengeApiClient;
    assessments: AssessmentsApiClient;
    activity: ActivityApiClient;
    followUps: FollowUpsApiClient;
    kpi: KPIApiClient;
    chat: ChatApiClient;
    notifications: NotificationApiClient;
    stripe: StripeApiClient;
    payment: PaymentApiClient;
};
export declare const mfeApiClient: {
    auth: AuthApiClient;
    user: UserApiClient;
    team: TeamApiClient;
    items: ItemsApiClient;
    programs: ProgramsApiClient;
    protocols: ProtocolApiClient;
    domains: DomainApiClient;
    order: OrderApiClient;
    nudge: NudgeApiClient;
    challenge: ChallengeApiClient;
    assessments: AssessmentsApiClient;
    activity: ActivityApiClient;
    followUps: FollowUpsApiClient;
    kpi: KPIApiClient;
    chat: ChatApiClient;
    notifications: NotificationApiClient;
    stripe: StripeApiClient;
    payment: PaymentApiClient;
};
export type HmsApiClient = ReturnType<typeof createHmsApiClient>;
export type ApiModule = keyof HmsApiClient;
//# sourceMappingURL=hms-api-client.d.ts.map