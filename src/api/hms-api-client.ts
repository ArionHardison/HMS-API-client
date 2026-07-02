/**
 * HMS API TypeScript Client Library
 * 
 * This client library provides type-safe access to all HMS API endpoints
 * organized by modules and functionality.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { assertSecureBaseURL } from './url-safety';

// =================== BASE TYPES =====================

/**
 * Decide whether a failed request may be retried. Only idempotent methods
 * (GET/HEAD/OPTIONS/DELETE/PUT) are retried automatically; non-idempotent
 * POST/PATCH are retried ONLY when the caller supplied an `Idempotency-Key`,
 * so a create/charge is never silently duplicated. A `status` of `undefined`
 * means a network error (no response).
 */
export function isRetryableRequest(
  method: string | undefined,
  status: number | undefined,
  hasIdempotencyKey: boolean,
): boolean {
  const idempotent = ['get', 'head', 'options', 'delete', 'put'].includes((method || '').toLowerCase());
  const retryableStatus = status === undefined || status >= 500;
  return retryableStatus && (idempotent || hasIdempotencyKey);
}

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

// =================== USER & AUTH TYPES =====================

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

// =================== TEAM TYPES =====================

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

// =================== ITEMS TYPES =====================

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
export enum ItemStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  DELETED = 'deleted'
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

// =================== PROGRAM TYPES =====================

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
export enum ProgramStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
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

// =================== PROTOCOL TYPES =====================

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
export enum ProtocolStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive'
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

// =================== KPI TYPES =====================

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

// =================== ORDER TYPES =====================

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
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed'
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

// =================== NUDGE TYPES =====================

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
export enum NudgeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SCHEDULED = 'scheduled'
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

// =================== CHALLENGE TYPES =====================

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
export enum ChallengeType {
  VIDEO = 'video',
  TASK = 'task',
  QUIZ = 'quiz',
  PHOTO = 'photo'
}

/**
 * Challenge status enum
 */
export enum ChallengeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMPLETED = 'completed'
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
export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed'
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

// =================== ASSESSMENTS TYPES =====================

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
export enum AssessmentStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived'
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
export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  SINGLE_CHOICE = 'single_choice',
  TEXT = 'text',
  SCALE = 'scale',
  YES_NO = 'yes_no'
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

// =================== ACTIVITY TYPES =====================

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
export enum ActivityType {
  EXERCISE = 'exercise',
  APPOINTMENT = 'appointment',
  CLASS = 'class',
  EVENT = 'event',
  WORKSHOP = 'workshop'
}

/**
 * Activity status enum
 */
export enum ActivityStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
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
export enum EventStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// =================== FOLLOWUPS TYPES =====================

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
export enum FollowUpType {
  REMINDER = 'reminder',
  CHECK_IN = 'check_in',
  ASSESSMENT = 'assessment',
  RECOMMENDATION = 'recommendation',
  VOICE_CALL = 'voice_call'
}

/**
 * Follow-up status enum
 */
export enum FollowUpStatus {
  PENDING = 'pending',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
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
export enum TimelineEventType {
  FOLLOW_UP = 'follow_up',
  ASSESSMENT = 'assessment',
  CHALLENGE = 'challenge',
  ORDER = 'order',
  ACTIVITY = 'activity',
  NOTE = 'note'
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
export enum RecommendationType {
  PROGRAM = 'program',
  ACTIVITY = 'activity',
  ITEM = 'item',
  ASSESSMENT = 'assessment',
  CUSTOM = 'custom'
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
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

// =================== SHARED CHAIN TYPES =====================

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
export enum ChainStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
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

// =================== CHAT TYPES =====================

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

// =================== BASE API CLIENT =====================

/**
 * Header names and body keys that must NEVER reach a log sink. Logging the
 * request headers would leak the live `Authorization: Bearer <token>`; logging
 * bodies would leak credentials/PII. Both are redacted before any console output.
 */
const SENSITIVE_HEADER_NAMES = ['authorization', 'cookie', 'set-cookie', 'x-tenant-id'];
const SENSITIVE_BODY_KEYS = [
  'password', 'password_confirmation', 'current_password',
  'token', 'access_token', 'refresh_token', 'secret', 'client_secret', 'api_key',
];

/** True only where NODE_ENV is explicitly `production` (bundler/Node context). */
function isProductionEnv(): boolean {
  try {
    return typeof process !== 'undefined' && !!process.env && process.env.NODE_ENV === 'production';
  } catch {
    return false;
  }
}

/** Shallow copy of headers with sensitive values masked. */
function redactHeaders(headers: unknown): unknown {
  if (!headers || typeof headers !== 'object') return headers;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(headers as Record<string, unknown>)) {
    out[k] = SENSITIVE_HEADER_NAMES.includes(k.toLowerCase()) ? '[redacted]' : v;
  }
  return out;
}

/** Recursively mask sensitive keys in a request/response body (bounded depth). */
function redactBody(data: unknown, depth = 0): unknown {
  if (depth > 4 || !data || typeof data !== 'object') return data;
  // Never traverse non-plain objects (FormData, File, Blob, streams).
  const proto = Object.getPrototypeOf(data);
  if (!Array.isArray(data) && proto !== Object.prototype && proto !== null) return '[object]';
  if (Array.isArray(data)) return data.map((v) => redactBody(v, depth + 1));
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
    out[k] = SENSITIVE_BODY_KEYS.includes(k.toLowerCase()) ? '[redacted]' : redactBody(v, depth + 1);
  }
  return out;
}

/**
 * Base API Client class
 */
export class BaseApiClient {
  protected readonly client: AxiosInstance;
  protected readonly config: ApiClientConfig;
  
  constructor(config: ApiClientConfig) {
    // Refuse a cleartext non-local baseURL — the bearer token must not travel over http.
    assertSecureBaseURL(config.baseURL);
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      withCredentials: config.withCredentials || false,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...config.headers
      }
    });
    
    this.setupInterceptors();
  }

  /** Logging is honored only when explicitly enabled AND not in production. */
  private get loggingEnabled(): boolean {
    return !!this.config.enableLogging && !isProductionEnv();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor for authentication and tenant support
    this.client.interceptors.request.use(
      (requestConfig) => {
        // Add authentication token (SSR-safe: localStorage is absent on the server)
        const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (token) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add tenant ID if provided
        if (this.config.tenantId) {
          requestConfig.headers['X-Tenant-ID'] = this.config.tenantId;
        }
        
        // Add environment context
        if (this.config.environment) {
          requestConfig.headers['X-Client-Environment'] = this.config.environment;
        }
        
        // Log request if enabled — headers/body are redacted so the bearer
        // token and credentials never reach the console.
        if (this.loggingEnabled) {
          console.log(`[HMS API] ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`, {
            headers: redactHeaders(requestConfig.headers),
            data: redactBody(requestConfig.data)
          });
        }
        
        return requestConfig;
      },
      (error) => Promise.reject(error)
    );
    
    // Response interceptor for error handling and retry logic
    this.client.interceptors.response.use(
      (response) => {
        // Log response if enabled — body redacted (login responses carry the token).
        if (this.loggingEnabled) {
          console.log(`[HMS API] Response:`, {
            status: response.status,
            data: redactBody(response.data)
          });
        }
        
        return response;
      },
      async (error) => {
        // Handle common error scenarios
        if (error.response?.status === 401) {
          // Handle unauthorized access
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
          }
        }
        
        // Retry logic for certain errors
        if (this.config.enableRetry && this.shouldRetry(error)) {
          return this.retryRequest(error);
        }
        
        // Log error if enabled — body redacted before output.
        if (this.loggingEnabled) {
          console.error(`[HMS API] Error:`, {
            status: error.response?.status,
            message: error.message,
            data: redactBody(error.response?.data)
          });
        }
        
        return Promise.reject(error);
      }
    );
  }
  
  /**
   * Determine if a request should be retried
   */
  private shouldRetry(error: any): boolean {
    if (!error.config || error.config._retryCount >= (this.config.maxRetries || 3)) {
      return false;
    }

    // Only retry idempotent methods (or non-idempotent ones carrying an
    // Idempotency-Key) so a POST/PATCH create/charge is never duplicated.
    const headers = error.config.headers || {};
    const hasIdempotencyKey = !!(headers['Idempotency-Key'] || headers['idempotency-key']);
    return isRetryableRequest(error.config.method, error.response?.status, hasIdempotencyKey);
  }
  
  /**
   * Retry a failed request with exponential backoff
   */
  private async retryRequest(error: any): Promise<any> {
    const config = error.config;
    config._retryCount = config._retryCount || 0;
    config._retryCount++;
    
    // Calculate delay with exponential backoff
    const delay = Math.pow(2, config._retryCount) * 1000;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return this.client(config);
  }
}

// =================== MODULE-SPECIFIC API CLIENTS =====================

/**
 * Authentication API Client
 */
export class AuthApiClient extends BaseApiClient {
  /**
   * Login with email and password
   * @param data - Login credentials
   */
  async login(data: LoginData): Promise<AxiosResponse<ApiResponse<AuthData>>> {
    const response = await this.client.post('/auth/sign-in', data);
    
    if (response.data.success && response.data.data.token) {
      // Store the token
      localStorage.setItem('auth_token', response.data.data.token);
    }
    
    return response;
  }
  
  /**
   * Register a new user
   * @param data - Registration data
   */
  async register(data: RegisterData): Promise<AxiosResponse<ApiResponse<AuthData>>> {
    const response = await this.client.post('/auth/sign-up', data);
    
    if (response.data.success && response.data.data.token) {
      // Store the token
      localStorage.setItem('auth_token', response.data.data.token);
    }
    
    return response;
  }
  
  /**
   * Logout the current user
   */
  async logout(): Promise<AxiosResponse<ApiResponse<null>>> {
    try {
      const response = await this.client.get('/logout');
      localStorage.removeItem('auth_token');
      return response;
    } catch (error) {
      // Always remove the token even if the API call fails
      localStorage.removeItem('auth_token');
      throw error;
    }
  }
  
  /**
   * Get the currently authenticated user
   */
  async getCurrentUser(): Promise<AxiosResponse<ApiResponse<UserData>>> {
    return this.client.get('/user/get-data');
  }
  
  /**
   * Request password reset
   * @param data - Password reset request data
   */
  async requestPasswordReset(data: PasswordResetRequest): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.post('/auth/reset', data);
  }
  
  /**
   * Set new password
   * @param data - New password data
   */
  async setNewPassword(data: NewPasswordRequest): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.post('/auth/new-password', data);
  }
  
  /**
   * Check if the user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}

/**
 * User API Client
 */
export class UserApiClient extends BaseApiClient {
  /**
   * Update user profile
   * @param userId - User ID
   * @param data - Profile update data
   */
  async updateProfile(userId: number, data: ProfileUpdateData): Promise<AxiosResponse<ApiResponse<UserData>>> {
    return this.client.patch(`/users/update/${userId}`, data);
  }
  
  /**
   * Update billing information
   * @param data - Billing information
   */
  async updateBillingInfo(data: BillingInfo): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.patch('/users/update-billing-info', data);
  }
  
  /**
   * Update phone number
   * @param phone - Phone number
   */
  async updatePhone(phone: string): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.patch('/users/update-phone', { phone });
  }
  
  /**
   * Update password
   * @param userId - User ID
   * @param currentPassword - Current password
   * @param newPassword - New password
   * @param newPasswordConfirmation - New password confirmation
   */
  async updatePassword(
    userId: number, 
    currentPassword: string, 
    newPassword: string, 
    newPasswordConfirmation: string
  ): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.patch(`/users/update-password/${userId}`, {
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: newPasswordConfirmation
    });
  }
  
  /**
   * Upload profile photo
   * @param userId - User ID
   * @param photo - Photo file
   */
  async uploadProfilePhoto(userId: number, photo: File): Promise<AxiosResponse<ApiResponse<{ photoUrl: string }>>> {
    const formData = new FormData();
    formData.append('photo', photo);
    
    return this.client.post(`/users/change-photo/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
  
  /**
   * Upload cover photo
   * @param userId - User ID
   * @param cover - Cover photo file
   */
  async uploadCoverPhoto(userId: number, cover: File): Promise<AxiosResponse<ApiResponse<{ coverUrl: string }>>> {
    const formData = new FormData();
    formData.append('cover', cover);
    
    return this.client.post(`/users/change-cover/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
  
  /**
   * Get user by username
   * @param username - Username
   */
  async getUserByUsername(username: string): Promise<AxiosResponse<ApiResponse<UserData>>> {
    return this.client.get(`/users/name/${username}`);
  }
  
  /**
   * Get user by ID
   * @param userId - User ID
   */
  async getUserById(userId: number): Promise<AxiosResponse<ApiResponse<UserData>>> {
    return this.client.get(`/users/id/${userId}`);
  }
  
  /**
   * Search for users
   * @param query - Search query
   */
  async searchUsers(query: string): Promise<AxiosResponse<ApiResponse<UserData[]>>> {
    return this.client.get(`/users/find/${query}`);
  }
  
  /**
   * Delete account
   * @param userId - User ID
   */
  async deleteAccount(userId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete(`/users/delete/${userId}`);
  }
  
  /**
   * Get user wallet balance
   */
  async getWalletBalance(): Promise<AxiosResponse<ApiResponse<{ balance: number; currency: string }>>> {
    return this.client.get('/user/get-wallet');
  }
}

/**
 * Team API Client
 */
export class TeamApiClient extends BaseApiClient {
  /**
   * Get all team members
   */
  async getAllMembers(): Promise<AxiosResponse<ApiResponse<TeamMemberData[]>>> {
    return this.client.get('/team/all');
  }
  
  /**
   * Get team members by status
   * @param status - Member status
   */
  async getMembersByStatus(status: string): Promise<AxiosResponse<ApiResponse<TeamMemberData[]>>> {
    return this.client.get(`/team/list/${status}`);
  }
  
  /**
   * Get invites
   */
  async getInvites(): Promise<AxiosResponse<ApiResponse<TeamInviteData[]>>> {
    return this.client.get('/team/member/pending');
  }
  
  /**
   * Invite team member
   * @param data - Invite data
   */
  async inviteMember(data: TeamInviteRequest): Promise<AxiosResponse<ApiResponse<TeamInviteData>>> {
    return this.client.post('/team/invite', data);
  }
  
  /**
   * Invite network member
   * @param userId - User ID
   * @param role - Role
   */
  async inviteNetworkMember(userId: number, role: string): Promise<AxiosResponse<ApiResponse<TeamInviteData>>> {
    return this.client.post('/team/network-invite', { user_id: userId, role });
  }
  
  /**
   * Search network members
   * @param query - Search query
   */
  async searchNetworkMembers(query: string): Promise<AxiosResponse<ApiResponse<UserData[]>>> {
    return this.client.post('/team/network-search', { search: query });
  }
  
  /**
   * Accept invite
   * @param inviteId - Invite ID
   */
  async acceptInvite(inviteId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.post('/team/accept', { invite_id: inviteId });
  }
  
  /**
   * Reject invite
   * @param inviteId - Invite ID
   */
  async rejectInvite(inviteId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.post('/team/reject', { invite_id: inviteId });
  }
  
  /**
   * Leave team
   * @param teamId - Team ID
   */
  async leaveTeam(teamId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.post('/team/leave', { team_id: teamId });
  }
  
  /**
   * Remove member
   * @param memberId - Member ID
   */
  async removeMember(memberId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.post('/team/remove', { member_id: memberId });
  }
  
  /**
   * Get invite by token
   * @param token - Invite token
   */
  async getInviteByToken(token: string): Promise<AxiosResponse<ApiResponse<TeamInviteData>>> {
    return this.client.get(`/public/team/get-invite/${token}`);
  }
  
  /**
   * Accept invite by token
   * @param token - Invite token
   */
  async acceptInviteByToken(token: string): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.get(`/team/accept-invite/${token}`);
  }
  
  /**
   * Reject invite by token
   * @param token - Invite token
   */
  async rejectInviteByToken(token: string): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete(`/public/team/reject-invite/${token}`);
  }
}

/**
 * Items API Client
 */
export class ItemsApiClient extends BaseApiClient {
  /**
   * Get all items
   * @param params - Query parameters
   */
  async getItems(params?: { status?: ItemStatus; page?: number; perPage?: number }): Promise<AxiosResponse<ApiResponse<PaginatedResponse<ItemData>>>> {
    return this.client.get('/items', { params });
  }
  
  /**
   * Get item by ID
   * @param id - Item ID
   */
  async getItem(id: number): Promise<AxiosResponse<ApiResponse<ItemData>>> {
    return this.client.get(`/items/${id}`);
  }
  
  /**
   * Create item
   * @param data - Item data
   */
  async createItem(data: Omit<ItemData, 'id' | 'createdAt' | 'updatedAt'>): Promise<AxiosResponse<ApiResponse<ItemData>>> {
    return this.client.post('/items', data);
  }
  
  /**
   * Update item
   * @param id - Item ID
   * @param data - Item data
   */
  async updateItem(id: number, data: Partial<Omit<ItemData, 'id' | 'createdAt' | 'updatedAt'>>): Promise<AxiosResponse<ApiResponse<ItemData>>> {
    return this.client.put(`/items/${id}`, data);
  }
  
  /**
   * Delete item
   * @param id - Item ID
   */
  async deleteItem(id: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete(`/items/${id}`);
  }
  
  /**
   * Search items
   * @param search - Search query
   * @param type - Item type
   */
  async searchItems(search: string, type: string): Promise<AxiosResponse<ApiResponse<ItemData[]>>> {
    return this.client.get(`/items/find-item/${search}/${type}`);
  }
  
  /**
   * Get food categories
   */
  async getFoodCategories(): Promise<AxiosResponse<ApiResponse<FoodCategory[]>>> {
    return this.client.get('/items/food-categories');
  }
  
  /**
   * Get all item collections
   */
  async getCollections(): Promise<AxiosResponse<ApiResponse<ItemCollectionData[]>>> {
    return this.client.get('/collection-list');
  }
  
  /**
   * Get collection by ID
   * @param id - Collection ID
   */
  async getCollection(id: number): Promise<AxiosResponse<ApiResponse<ItemCollectionData>>> {
    return this.client.get(`/collection/${id}`);
  }
  
  /**
   * Create collection
   * @param data - Collection data
   */
  async createCollection(data: { name: string; description: string }): Promise<AxiosResponse<ApiResponse<ItemCollectionData>>> {
    return this.client.post('/collection', data);
  }
  
  /**
   * Add item to collection
   * @param collectionId - Collection ID
   * @param itemId - Item ID
   */
  async addItemToCollection(collectionId: number, itemId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.post('/collection-item', { collection_id: collectionId, item_id: itemId });
  }
  
  /**
   * Remove item from collection
   * @param itemId - Collection item ID
   */
  async removeItemFromCollection(itemId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete(`/collection-item/${itemId}`);
  }
}

/**
 * Programs API Client
 */
export class ProgramsApiClient extends BaseApiClient {
  /**
   * Get featured programs
   */
  async getFeaturedPrograms(): Promise<AxiosResponse<ApiResponse<ProgramData[]>>> {
    return this.client.get('/home/featured-programs');
  }
  
  /**
   * Get recent programs
   */
  async getRecentPrograms(): Promise<AxiosResponse<ApiResponse<ProgramData[]>>> {
    return this.client.get('/home/most-recent-programs');
  }
  
  /**
   * Get program by ID
   * @param id - Program ID
   */
  async getProgram(id: number): Promise<AxiosResponse<ApiResponse<ProgramData>>> {
    return this.client.get(`/public/get-program/${id}`);
  }
  
  /**
   * Get program feedback
   * @param id - Program ID
   */
  async getProgramFeedback(id: number): Promise<AxiosResponse<ApiResponse<ProgramFeedback[]>>> {
    return this.client.get(`/public/get-program-feedback/${id}`);
  }
  
  /**
   * Search programs
   * @param query - Search query
   * @param category - Category ID
   */
  async searchPrograms(query: string, category?: number): Promise<AxiosResponse<ApiResponse<ProgramData[]>>> {
    return this.client.post('/program/search', { query, category });
  }
  
  /**
   * Get programs by user
   * @param userId - User ID
   */
  async getUserPrograms(userId: number): Promise<AxiosResponse<ApiResponse<ProgramData[]>>> {
    return this.client.get(`/public/get-user-feed/${userId}`);
  }
  
  /**
   * Get featured programs by user
   * @param userId - User ID
   */
  async getUserFeaturedPrograms(userId: number): Promise<AxiosResponse<ApiResponse<ProgramData[]>>> {
    return this.client.get(`/public/get-user-featured/${userId}`);
  }
  
  /**
   * Toggle program bookmark
   * @param programId - Program ID
   */
  async toggleBookmark(programId: number): Promise<AxiosResponse<ApiResponse<{ bookmarked: boolean }>>> {
    return this.client.post('/program/toggle-bookmark', { program_id: programId });
  }
  
  /**
   * Get bookmarked programs
   */
  async getBookmarks(): Promise<AxiosResponse<ApiResponse<ProgramData[]>>> {
    return this.client.get('/program/get-bookmarks');
  }
  
  /**
   * Get program categories
   */
  async getCategories(): Promise<AxiosResponse<ApiResponse<CategoryData[]>>> {
    return this.client.get('/public/get-program-categories');
  }
}

/**
 * Protocol API Client
 */
export class ProtocolApiClient extends BaseApiClient {
  /**
   * Get protocol by ID
   * @param id - Protocol ID
   */
  async getProtocol(id: number): Promise<AxiosResponse<ApiResponse<ProtocolData>>> {
    return this.client.get(`/protocol/${id}`);
  }
  
  /**
   * Get protocols by category
   * @param categoryId - Category ID
   */
  async getProtocolsByCategory(categoryId?: number): Promise<AxiosResponse<ApiResponse<ProtocolData[]>>> {
    const endpoint = categoryId ? `/protocol/by-category/${categoryId}` : '/protocol/by-category';
    return this.client.get(endpoint);
  }
  
  /**
   * Get available protocol modules
   * @param recurring - Get recurring modules only
   */
  async getModules(recurring?: boolean): Promise<AxiosResponse<ApiResponse<ProtocolModuleData[]>>> {
    const endpoint = recurring ? '/protocol/modules/1' : '/protocol/modules';
    return this.client.get(endpoint);
  }
  
  /**
   * Get protocol steps
   * @param protocolId - Protocol ID
   */
  async getProtocolSteps(protocolId: number): Promise<AxiosResponse<ApiResponse<any[]>>> {
    return this.client.get(`/protocol/get-steps/${protocolId}`);
  }
  
  /**
   * Get protocol categories
   */
  async getCategories(): Promise<AxiosResponse<ApiResponse<CategoryData[]>>> {
    return this.client.get('/protocol-category/all');
  }
}

/**
 * KPI API Client
 */
export class KPIApiClient extends BaseApiClient {
  /**
   * Get user devices
   */
  async getUserDevices(): Promise<AxiosResponse<ApiResponse<UserDeviceData[]>>> {
    return this.client.get('/user-devices/list');
  }
  
  /**
   * Redirect to Withings for authentication
   */
  async authorizeWithings(): Promise<AxiosResponse<ApiResponse<{ redirectUrl: string }>>> {
    return this.client.get('/withings/auth');
  }
  
  /**
   * Get KPI setup for a chain
   * @param chainId - Chain ID
   * @param protocolId - Protocol ID
   */
  async getKPISetup(chainId: number, protocolId: number): Promise<AxiosResponse<ApiResponse<KPISetupData>>> {
    return this.client.get(`/kpi/get-setup/${chainId}/${protocolId}`);
  }
  
  /**
   * Save KPI setup
   * @param data - KPI setup data
   */
  async saveKPISetup(data: Omit<KPISetupData, 'id' | 'rules'>): Promise<AxiosResponse<ApiResponse<KPISetupData>>> {
    return this.client.post('/kpi/save-setup', data);
  }
  
  /**
   * Remove KPI rule
   * @param ruleId - Rule ID
   */
  async removeKPIRule(ruleId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete(`/kpi/remove-rule/${ruleId}`);
  }
  
  /**
   * Save round results
   * @param data - Round results data
   */
  async saveRoundResults(data: any): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.post('/kpi/save-round-results', data);
  }
}

/**
 * Chat API Client
 */
export class ChatApiClient extends BaseApiClient {
  /**
   * Get chat list
   * @param search - Search query
   */
  async getChatList(search?: string): Promise<AxiosResponse<ApiResponse<ChatRoomData[]>>> {
    const endpoint = search ? `/chat/get-list/${search}` : '/chat/get-list';
    return this.client.get(endpoint);
  }

  /**
   * List conversations (alias for getChatList). Added 2026-05-21 (v1.6.0)
   * so sys/src/stores/chat.ts can drop its raw HTTP TODO and call the
   * SDK with the name the consumer expects. Same wire path as getChatList.
   *
   * @param search - Search query
   */
  async listConversations(search?: string): Promise<AxiosResponse<ApiResponse<ChatRoomData[]>>> {
    return this.getChatList(search);
  }

  /**
   * Get chat room
   * @param userId - User ID (to create or get a 1:1 chat)
   */
  async getChatRoom(userId: number): Promise<AxiosResponse<ApiResponse<ChatRoomData>>> {
    return this.client.post('/chat/get-room', { user_id: userId });
  }

  /**
   * Get chat room by ID
   * @param roomId - Room ID
   */
  async getChatRoomById(roomId: number): Promise<AxiosResponse<ApiResponse<ChatRoomData>>> {
    return this.client.get(`/chat/get-room-by-id/${roomId}`);
  }

  /**
   * Get messages for a chat
   * @param chatId - Chat ID
   * @param search - Search query
   */
  async getMessages(chatId: number, search?: string): Promise<AxiosResponse<ApiResponse<ChatMessageData[]>>> {
    const endpoint = search ? `/chat/messages/${chatId}/${search}` : `/chat/messages/${chatId}`;
    return this.client.get(endpoint);
  }

  /**
   * List messages for a conversation (alias for getMessages). Added
   * 2026-05-21 (v1.6.0) — matches the name sys/'s chat store expects.
   *
   * @param conversationId - Conversation (chat) ID
   * @param search - Search query
   */
  async listMessages(conversationId: number, search?: string): Promise<AxiosResponse<ApiResponse<ChatMessageData[]>>> {
    return this.getMessages(conversationId, search);
  }
  
  /**
   * Send message
   * @param data - Message data
   */
  async sendMessage(data: NewMessageRequest): Promise<AxiosResponse<ApiResponse<ChatMessageData>>> {
    if (data.attachments && data.attachments.length > 0) {
      const formData = new FormData();
      formData.append('room_id', data.roomId.toString());
      formData.append('message', data.message);
      
      data.attachments.forEach((attachment, index) => {
        formData.append(`attachments[${index}]`, attachment);
      });
      
      return this.client.post('/chat/send-message', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
    
    return this.client.post('/chat/send-message', {
      room_id: data.roomId,
      message: data.message
    });
  }
  
  /**
   * Find user to chat with
   * @param search - Search query
   */
  async findUserToChat(search: string): Promise<AxiosResponse<ApiResponse<UserData[]>>> {
    return this.client.get(`/chat/find-user/${search}`);
  }
  
  /**
   * Delete message
   * @param messageId - Message ID
   */
  async deleteMessage(messageId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete(`/chat/delete-message/${messageId}`);
  }
  
  /**
   * Delete chat
   * @param chatId - Chat ID
   */
  async deleteChat(chatId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete(`/chat/delete-сhat/${chatId}`);
  }
}

/**
 * Notification API Client
 */
export class NotificationApiClient extends BaseApiClient {
  /**
   * Get notifications
   */
  async getNotifications(): Promise<AxiosResponse<ApiResponse<any[]>>> {
    return this.client.get('/notification/get');
  }
  
  /**
   * Get unread notifications count
   */
  async getUnreadCount(): Promise<AxiosResponse<ApiResponse<{ count: number }>>> {
    return this.client.get('/notification/get-unread');
  }
  
  /**
   * Delete notification
   * @param notificationId - Notification ID
   */
  async deleteNotification(notificationId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete(`/notification/delete-notification/${notificationId}`);
  }
}

/**
 * Stripe API Client
 */
export class StripeApiClient extends BaseApiClient {
  /**
   * Connect to Stripe
   */
  async connectToStripe(): Promise<AxiosResponse<ApiResponse<{ redirectUrl: string }>>> {
    return this.client.get('/stripe/connect');
  }
  
  /**
   * Withdraw money
   */
  async withdrawMoney(): Promise<AxiosResponse<ApiResponse<any>>> {
    return this.client.get('/stripe/withdraw');
  }
  
  /**
   * Get transactions
   */
  async getTransactions(): Promise<AxiosResponse<ApiResponse<any[]>>> {
    return this.client.get('/stripe/transactions');
  }
  
  /**
   * Check Stripe account
   */
  async checkAccount(): Promise<AxiosResponse<ApiResponse<{ connected: boolean; accountId?: string }>>> {
    return this.client.get('/stripe/check-account');
  }
  
  /**
   * Delete Stripe account
   */
  async deleteAccount(): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete('/stripe/delete-account');
  }
}

/**
 * Nudge API Client
 */
export class NudgeApiClient extends BaseApiClient {
  /**
   * Check nudge secret (Public endpoint - no authentication required)
   * @param secret - Nudge secret
   */
  async checkNudgeSecret(secret: string): Promise<AxiosResponse<ApiResponse<boolean>>> {
    return this.client.get(`/nudge/check/${secret}`);
  }
  
  /**
   * Email check-in (Public endpoint - no authentication required)
   * @param email - Email address
   * @param data - Check-in data
   */
  async emailCheckin(email: string, data: CheckinData): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.post('/nudge-checkin/email', { email, ...data });
  }
  
  /**
   * SMS check-in (Public endpoint - no authentication required)
   * @param phone - Phone number
   * @param data - Check-in data
   */
  async smsCheckin(phone: string, data: CheckinData): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.post('/nudge-checkin/sms', { phone, ...data });
  }
  
  /**
   * Delete nudge image
   * @param nudgeId - Nudge ID
   */
  async deleteNudgeImage(nudgeId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete(`/nudge/image/${nudgeId}`);
  }
  
  /**
   * Get all protocol nudges
   */
  async getAllProtocolNudges(): Promise<AxiosResponse<ApiResponse<NudgeData[]>>> {
    return this.client.get('/protocol/nudge/all');
  }
  
  /**
   * Get all nudges
   */
  async getNudges(): Promise<AxiosResponse<ApiResponse<NudgeData[]>>> {
    return this.client.get('/nudge');
  }
  
  /**
   * Get nudge by ID
   * @param nudgeId - Nudge ID
   */
  async getNudge(nudgeId: number): Promise<AxiosResponse<ApiResponse<NudgeData>>> {
    return this.client.get(`/nudge/${nudgeId}`);
  }
  
  /**
   * Create nudge
   * @param data - Nudge creation data
   */
  async createNudge(data: CreateNudgeData): Promise<AxiosResponse<ApiResponse<NudgeData>>> {
    const formData = new FormData();
    
    // Add basic nudge data
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('protocol_id', data.protocolId.toString());
    formData.append('chain_id', data.chainId.toString());
    formData.append('settings', JSON.stringify(data.settings));
    
    // Add image if provided
    if (data.image) {
      formData.append('image', data.image);
    }
    
    return this.client.post('/nudge', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
  
  /**
   * Update nudge
   * @param nudgeId - Nudge ID
   * @param data - Nudge update data
   */
  async updateNudge(nudgeId: number, data: Partial<NudgeData>): Promise<AxiosResponse<ApiResponse<NudgeData>>> {
    return this.client.put(`/nudge/${nudgeId}`, data);
  }
  
  /**
   * Delete nudge
   * @param nudgeId - Nudge ID
   */
  async deleteNudge(nudgeId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete(`/nudge/${nudgeId}`);
  }
  
  /**
   * Upload nudge image
   * @param nudgeId - Nudge ID
   * @param imageFile - Image file
   */
  async uploadNudgeImage(nudgeId: number, imageFile: File): Promise<AxiosResponse<ApiResponse<{ imageUrl: string }>>> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return this.client.post(`/nudge/${nudgeId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
  
  /**
   * Activate nudge
   * @param nudgeId - Nudge ID
   */
  async activateNudge(nudgeId: number): Promise<AxiosResponse<ApiResponse<NudgeData>>> {
    return this.client.post(`/nudge/${nudgeId}/activate`);
  }
  
  /**
   * Deactivate nudge
   * @param nudgeId - Nudge ID
   */
  async deactivateNudge(nudgeId: number): Promise<AxiosResponse<ApiResponse<NudgeData>>> {
    return this.client.post(`/nudge/${nudgeId}/deactivate`);
  }
  
  /**
   * Schedule nudge
   * @param nudgeId - Nudge ID
   * @param scheduledAt - Scheduled date and time
   */
  async scheduleNudge(nudgeId: number, scheduledAt: string): Promise<AxiosResponse<ApiResponse<NudgeData>>> {
    return this.client.post(`/nudge/${nudgeId}/schedule`, { scheduled_at: scheduledAt });
  }
  
  /**
   * Get nudge analytics
   * @param nudgeId - Nudge ID
   */
  async getNudgeAnalytics(nudgeId: number): Promise<AxiosResponse<ApiResponse<any>>> {
    return this.client.get(`/nudge/${nudgeId}/analytics`);
  }
  
  /**
   * Get nudge check-ins
   * @param nudgeId - Nudge ID
   */
  async getNudgeCheckins(nudgeId: number): Promise<AxiosResponse<ApiResponse<CheckinData[]>>> {
    return this.client.get(`/nudge/${nudgeId}/checkins`);
  }
  
  /**
   * Send test nudge
   * @param nudgeId - Nudge ID
   * @param recipients - Test recipients (email or phone)
   */
  async sendTestNudge(nudgeId: number, recipients: string[]): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.post(`/nudge/${nudgeId}/test`, { recipients });
  }
  
  /**
   * Get nudges by protocol
   * @param protocolId - Protocol ID
   */
  async getNudgesByProtocol(protocolId: number): Promise<AxiosResponse<ApiResponse<NudgeData[]>>> {
    return this.client.get(`/nudge/protocol/${protocolId}`);
  }
  
  /**
   * Get nudges by chain
   * @param chainId - Chain ID
   */
  async getNudgesByChain(chainId: number): Promise<AxiosResponse<ApiResponse<NudgeData[]>>> {
    return this.client.get(`/nudge/chain/${chainId}`);
  }
}

/**
 * FollowUps API Client
 */
export class FollowUpsApiClient extends BaseApiClient {
  /**
   * Run follow-up
   * @param chainId - Chain ID
   */
  async runFollowUp(chainId: number): Promise<AxiosResponse<ApiResponse<any>>> {
    return this.client.get(`/follow-up/run/${chainId}`);
  }
  
  /**
   * Get timeline for chain
   * @param chainId - Chain ID
   */
  async getTimeline(chainId: number): Promise<AxiosResponse<ApiResponse<TimelineData[]>>> {
    return this.client.get(`/follow-up/get-timeline/${chainId}`);
  }
  
  /**
   * Get recommendations for follow-up
   * @param followupId - Follow-up ID
   */
  async getRecommendations(followupId: number): Promise<AxiosResponse<ApiResponse<RecommendationData[]>>> {
    return this.client.get(`/follow-up/recommendations/${followupId}`);
  }
  
  /**
   * Record voice for follow-up
   * @param audioFile - Audio file
   * @param followupId - Follow-up ID
   * @param metadata - Additional metadata
   */
  async recordVoice(
    audioFile: File,
    followupId: number,
    metadata?: Record<string, any>
  ): Promise<AxiosResponse<ApiResponse<VoiceResponse>>> {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('followup_id', followupId.toString());
    
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
    }
    
    return this.client.post('/follow-up/voice-record', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
  
  /**
   * Finalize voice recording
   * @param data - Voice finalize data
   */
  async finalizeVoice(data: VoiceFinalizeData): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.post('/follow-up/voice-finalize', data);
  }
  
  /**
   * Process payment for follow-up
   * @param data - Payment data
   */
  async processPayment(data: { followupId: number; paymentMethodId: string; amount: number }): Promise<AxiosResponse<ApiResponse<PaymentResult>>> {
    return this.client.post('/follow-up/process-payment', data);
  }
  
  /**
   * Get all follow-ups
   */
  async getFollowUps(): Promise<AxiosResponse<ApiResponse<FollowUpData[]>>> {
    return this.client.get('/follow-up');
  }
  
  /**
   * Get follow-up by ID
   * @param followupId - Follow-up ID
   */
  async getFollowUp(followupId: number): Promise<AxiosResponse<ApiResponse<FollowUpData>>> {
    return this.client.get(`/follow-up/${followupId}`);
  }
  
  /**
   * Create follow-up
   * @param data - Follow-up creation data
   */
  async createFollowUp(data: Omit<FollowUpData, 'id' | 'createdAt' | 'updatedAt'>): Promise<AxiosResponse<ApiResponse<FollowUpData>>> {
    return this.client.post('/follow-up', data);
  }
  
  /**
   * Update follow-up
   * @param followupId - Follow-up ID
   * @param data - Follow-up update data
   */
  async updateFollowUp(followupId: number, data: Partial<FollowUpData>): Promise<AxiosResponse<ApiResponse<FollowUpData>>> {
    return this.client.put(`/follow-up/${followupId}`, data);
  }
  
  /**
   * Delete follow-up
   * @param followupId - Follow-up ID
   */
  async deleteFollowUp(followupId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete(`/follow-up/${followupId}`);
  }
  
  /**
   * Schedule follow-up
   * @param followupId - Follow-up ID
   * @param scheduledAt - Scheduled date and time
   */
  async scheduleFollowUp(followupId: number, scheduledAt: string): Promise<AxiosResponse<ApiResponse<FollowUpData>>> {
    return this.client.post(`/follow-up/${followupId}/schedule`, { scheduled_at: scheduledAt });
  }
  
  /**
   * Cancel follow-up
   * @param followupId - Follow-up ID
   */
  async cancelFollowUp(followupId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.post(`/follow-up/${followupId}/cancel`);
  }
  
  /**
   * Complete follow-up
   * @param followupId - Follow-up ID
   * @param data - Completion data
   */
  async completeFollowUp(followupId: number, data?: Record<string, any>): Promise<AxiosResponse<ApiResponse<FollowUpData>>> {
    return this.client.post(`/follow-up/${followupId}/complete`, data || {});
  }
  
  /**
   * Get follow-ups by chain
   * @param chainId - Chain ID
   */
  async getFollowUpsByChain(chainId: number): Promise<AxiosResponse<ApiResponse<FollowUpData[]>>> {
    return this.client.get(`/follow-up/chain/${chainId}`);
  }
  
  /**
   * Get pending follow-ups
   */
  async getPendingFollowUps(): Promise<AxiosResponse<ApiResponse<FollowUpData[]>>> {
    return this.client.get('/follow-up/pending');
  }
  
  /**
   * Create recommendation
   * @param data - Recommendation creation data
   */
  async createRecommendation(data: Omit<RecommendationData, 'id' | 'createdAt'>): Promise<AxiosResponse<ApiResponse<RecommendationData>>> {
    return this.client.post('/follow-up/recommendation', data);
  }
  
  /**
   * Update recommendation
   * @param recommendationId - Recommendation ID
   * @param data - Recommendation update data
   */
  async updateRecommendation(recommendationId: number, data: Partial<RecommendationData>): Promise<AxiosResponse<ApiResponse<RecommendationData>>> {
    return this.client.put(`/follow-up/recommendation/${recommendationId}`, data);
  }
  
  /**
   * Delete recommendation
   * @param recommendationId - Recommendation ID
   */
  async deleteRecommendation(recommendationId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete(`/follow-up/recommendation/${recommendationId}`);
  }
  
  /**
   * Get voice recordings
   * @param followupId - Follow-up ID
   */
  async getVoiceRecordings(followupId: number): Promise<AxiosResponse<ApiResponse<VoiceResponse[]>>> {
    return this.client.get(`/follow-up/${followupId}/voice-recordings`);
  }
  
  /**
   * Delete voice recording
   * @param recordingId - Recording ID
   */
  async deleteVoiceRecording(recordingId: string): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete(`/follow-up/voice-recording/${recordingId}`);
  }
}

/**
 * Activity API Client
 */
export class ActivityApiClient extends BaseApiClient {
  /**
   * Get running activities
   * @param data - Activity query parameters
   */
  async getRunningActivities(data: ActivityQuery): Promise<AxiosResponse<ApiResponse<ActivityData[]>>> {
    return this.client.post('/activity/running', data);
  }
  
  /**
   * Get activity providers
   * @param activityId - Activity ID
   */
  async getActivityProviders(activityId: number): Promise<AxiosResponse<ApiResponse<ProviderData[]>>> {
    return this.client.get(`/activity/get-providers/${activityId}`);
  }
  
  /**
   * Set reservation
   * @param data - Reservation data
   */
  async setReservation(data: ReservationData): Promise<AxiosResponse<ApiResponse<ReservationData>>> {
    return this.client.post('/activity/set-reservation', data);
  }
  
  /**
   * Confirm booking
   * @param data - Booking data
   */
  async confirmBooking(data: BookingData): Promise<AxiosResponse<ApiResponse<BookingData>>> {
    return this.client.post('/activity/confirm-booking', data);
  }
  
  /**
   * Get booked events for a month
   * @param date - Date in YYYY-MM format
   */
  async getBookedEventsForMonth(date: string): Promise<AxiosResponse<ApiResponse<EventData[]>>> {
    return this.client.get(`/activity/booked-events-month/${date}`);
  }
  
  /**
   * Search service locations
   * @param query - Search query
   */
  async searchServiceLocations(query: string): Promise<AxiosResponse<ApiResponse<LocationData[]>>> {
    return this.client.get(`/activity/search-locations/${encodeURIComponent(query)}`);
  }
  
  /**
   * Get all activities
   */
  async getActivities(): Promise<AxiosResponse<ApiResponse<ActivityData[]>>> {
    return this.client.get('/activity');
  }
  
  /**
   * Get activity by ID
   * @param activityId - Activity ID
   */
  async getActivity(activityId: number): Promise<AxiosResponse<ApiResponse<ActivityData>>> {
    return this.client.get(`/activity/${activityId}`);
  }
  
  /**
   * Create activity
   * @param data - Activity creation data
   */
  async createActivity(data: Omit<ActivityData, 'id' | 'createdAt' | 'updatedAt'>): Promise<AxiosResponse<ApiResponse<ActivityData>>> {
    return this.client.post('/activity', data);
  }
  
  /**
   * Update activity
   * @param activityId - Activity ID
   * @param data - Activity update data
   */
  async updateActivity(activityId: number, data: Partial<ActivityData>): Promise<AxiosResponse<ApiResponse<ActivityData>>> {
    return this.client.put(`/activity/${activityId}`, data);
  }
  
  /**
   * Delete activity
   * @param activityId - Activity ID
   */
  async deleteActivity(activityId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete(`/activity/${activityId}`);
  }
  
  /**
   * Get locations
   */
  async getLocations(): Promise<AxiosResponse<ApiResponse<LocationData[]>>> {
    return this.client.get('/activity/locations');
  }
  
  /**
   * Get location by ID
   * @param locationId - Location ID
   */
  async getLocation(locationId: number): Promise<AxiosResponse<ApiResponse<LocationData>>> {
    return this.client.get(`/activity/location/${locationId}`);
  }
  
  /**
   * Create location
   * @param data - Location creation data
   */
  async createLocation(data: Omit<LocationData, 'id'>): Promise<AxiosResponse<ApiResponse<LocationData>>> {
    return this.client.post('/activity/location', data);
  }
  
  /**
   * Update location
   * @param locationId - Location ID
   * @param data - Location update data
   */
  async updateLocation(locationId: number, data: Partial<LocationData>): Promise<AxiosResponse<ApiResponse<LocationData>>> {
    return this.client.put(`/activity/location/${locationId}`, data);
  }
  
  /**
   * Delete location
   * @param locationId - Location ID
   */
  async deleteLocation(locationId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete(`/activity/location/${locationId}`);
  }
  
  /**
   * Get providers
   */
  async getProviders(): Promise<AxiosResponse<ApiResponse<ProviderData[]>>> {
    return this.client.get('/activity/providers');
  }
  
  /**
   * Get provider by ID
   * @param providerId - Provider ID
   */
  async getProvider(providerId: number): Promise<AxiosResponse<ApiResponse<ProviderData>>> {
    return this.client.get(`/activity/provider/${providerId}`);
  }
  
  /**
   * Create provider
   * @param data - Provider creation data
   */
  async createProvider(data: Omit<ProviderData, 'id'>): Promise<AxiosResponse<ApiResponse<ProviderData>>> {
    return this.client.post('/activity/provider', data);
  }
  
  /**
   * Update provider
   * @param providerId - Provider ID
   * @param data - Provider update data
   */
  async updateProvider(providerId: number, data: Partial<ProviderData>): Promise<AxiosResponse<ApiResponse<ProviderData>>> {
    return this.client.put(`/activity/provider/${providerId}`, data);
  }
  
  /**
   * Delete provider
   * @param providerId - Provider ID
   */
  async deleteProvider(providerId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete(`/activity/provider/${providerId}`);
  }
  
  /**
   * Cancel reservation
   * @param reservationId - Reservation ID
   */
  async cancelReservation(reservationId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete(`/activity/reservation/${reservationId}`);
  }
  
  /**
   * Get user reservations
   */
  async getUserReservations(): Promise<AxiosResponse<ApiResponse<ReservationData[]>>> {
    return this.client.get('/activity/user-reservations');
  }
  
  /**
   * Get available time slots
   * @param activityId - Activity ID
   * @param date - Date in YYYY-MM-DD format
   */
  async getAvailableTimeSlots(activityId: number, date: string): Promise<AxiosResponse<ApiResponse<string[]>>> {
    return this.client.get(`/activity/${activityId}/available-slots/${date}`);
  }
}

/**
 * Assessments API Client
 */
export class AssessmentsApiClient extends BaseApiClient {
  /**
   * Run assessment
   * @param assessmentId - Assessment ID
   * @param chainId - Chain ID
   */
  async runAssessment(assessmentId: number, chainId: number): Promise<AxiosResponse<ApiResponse<any>>> {
    return this.client.get(`/assessment/run/${assessmentId}/${chainId}`);
  }
  
  /**
   * Get questions by assessment
   * @param assessmentId - Assessment ID
   */
  async getQuestionsByAssessment(assessmentId: number): Promise<AxiosResponse<ApiResponse<QuestionData[]>>> {
    return this.client.get(`/question/by-assessment/${assessmentId}`);
  }
  
  /**
   * Store response
   * @param data - Response data
   */
  async storeResponse(data: ResponseData): Promise<AxiosResponse<ApiResponse<ResponseData>>> {
    return this.client.post('/response/store', data);
  }
  
  /**
   * Delete choice
   * @param choiceId - Choice ID
   */
  async deleteChoice(choiceId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete(`/choice/${choiceId}`);
  }
  
  /**
   * Get all assessments
   */
  async getAssessments(): Promise<AxiosResponse<ApiResponse<AssessmentData[]>>> {
    return this.client.get('/assessment');
  }
  
  /**
   * Get assessment by ID
   * @param assessmentId - Assessment ID
   */
  async getAssessment(assessmentId: number): Promise<AxiosResponse<ApiResponse<AssessmentData>>> {
    return this.client.get(`/assessment/${assessmentId}`);
  }
  
  /**
   * Create assessment
   * @param data - Assessment creation data
   */
  async createAssessment(data: CreateAssessmentData): Promise<AxiosResponse<ApiResponse<AssessmentData>>> {
    return this.client.post('/assessment', data);
  }
  
  /**
   * Update assessment
   * @param assessmentId - Assessment ID
   * @param data - Assessment update data
   */
  async updateAssessment(assessmentId: number, data: Partial<AssessmentData>): Promise<AxiosResponse<ApiResponse<AssessmentData>>> {
    return this.client.put(`/assessment/${assessmentId}`, data);
  }
  
  /**
   * Delete assessment
   * @param assessmentId - Assessment ID
   */
  async deleteAssessment(assessmentId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete(`/assessment/${assessmentId}`);
  }
  
  /**
   * Get question by ID
   * @param questionId - Question ID
   */
  async getQuestion(questionId: number): Promise<AxiosResponse<ApiResponse<QuestionData>>> {
    return this.client.get(`/question/${questionId}`);
  }
  
  /**
   * Create question
   * @param data - Question creation data
   */
  async createQuestion(data: Omit<QuestionData, 'id' | 'choices'>): Promise<AxiosResponse<ApiResponse<QuestionData>>> {
    return this.client.post('/question', data);
  }
  
  /**
   * Update question
   * @param questionId - Question ID
   * @param data - Question update data
   */
  async updateQuestion(questionId: number, data: Partial<QuestionData>): Promise<AxiosResponse<ApiResponse<QuestionData>>> {
    return this.client.put(`/question/${questionId}`, data);
  }
  
  /**
   * Delete question
   * @param questionId - Question ID
   */
  async deleteQuestion(questionId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete(`/question/${questionId}`);
  }
  
  /**
   * Get choice by ID
   * @param choiceId - Choice ID
   */
  async getChoice(choiceId: number): Promise<AxiosResponse<ApiResponse<ChoiceData>>> {
    return this.client.get(`/choice/${choiceId}`);
  }
  
  /**
   * Create choice
   * @param data - Choice creation data
   */
  async createChoice(data: Omit<ChoiceData, 'id'>): Promise<AxiosResponse<ApiResponse<ChoiceData>>> {
    return this.client.post('/choice', data);
  }
  
  /**
   * Update choice
   * @param choiceId - Choice ID
   * @param data - Choice update data
   */
  async updateChoice(choiceId: number, data: Partial<ChoiceData>): Promise<AxiosResponse<ApiResponse<ChoiceData>>> {
    return this.client.put(`/choice/${choiceId}`, data);
  }
  
  /**
   * Get user responses for assessment
   * @param assessmentId - Assessment ID
   * @param userId - User ID (optional, defaults to current user)
   */
  async getUserResponses(assessmentId: number, userId?: number): Promise<AxiosResponse<ApiResponse<ResponseData[]>>> {
    const endpoint = userId ? `/response/user/${userId}/assessment/${assessmentId}` : `/response/assessment/${assessmentId}`;
    return this.client.get(endpoint);
  }
  
  /**
   * Get assessment results
   * @param assessmentId - Assessment ID
   * @param userId - User ID (optional, defaults to current user)
   */
  async getAssessmentResults(assessmentId: number, userId?: number): Promise<AxiosResponse<ApiResponse<any>>> {
    const endpoint = userId ? `/assessment/${assessmentId}/results/${userId}` : `/assessment/${assessmentId}/results`;
    return this.client.get(endpoint);
  }
  
  /**
   * Submit assessment
   * @param assessmentId - Assessment ID
   * @param responses - Array of responses
   */
  async submitAssessment(assessmentId: number, responses: ResponseData[]): Promise<AxiosResponse<ApiResponse<any>>> {
    return this.client.post(`/assessment/${assessmentId}/submit`, { responses });
  }
}

/**
 * Challenge API Client
 */
export class ChallengeApiClient extends BaseApiClient {
  /**
   * Run challenge
   * @param data - Challenge run data
   */
  async runChallenge(data: ChallengeRunData): Promise<AxiosResponse<ApiResponse<any>>> {
    return this.client.post('/challenge/run', data);
  }
  
  /**
   * Get challenge by ID and chain
   * @param challengeId - Challenge ID
   * @param chainId - Chain ID
   */
  async getChallenge(challengeId: number, chainId: number): Promise<AxiosResponse<ApiResponse<ChallengeData>>> {
    return this.client.get(`/challenge/get-challenge/${challengeId}/${chainId}`);
  }
  
  /**
   * Start challenge task
   * @param data - Task start data
   */
  async startTask(data: TaskStartData): Promise<AxiosResponse<ApiResponse<TaskData>>> {
    return this.client.post('/challenge/start-task', data);
  }
  
  /**
   * Set challenge result
   * @param resultId - Result ID
   * @param data - Result data
   */
  async setResult(resultId: number, data: ResultData): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.post(`/challenge/set-result/${resultId}`, data);
  }
  
  /**
   * Record video for challenge
   * @param videoFile - Video file
   * @param challengeId - Challenge ID
   * @param metadata - Additional metadata
   */
  async recordVideo(
    videoFile: File, 
    challengeId: number, 
    metadata?: Record<string, any>
  ): Promise<AxiosResponse<ApiResponse<VideoResponse>>> {
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('challenge_id', challengeId.toString());
    
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
    }
    
    return this.client.post('/challenge/record-video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
  
  /**
   * Get all protocol challenges
   */
  async getAllProtocolChallenges(): Promise<AxiosResponse<ApiResponse<ChallengeData[]>>> {
    return this.client.get('/protocol/challenge/all');
  }
  
  /**
   * Get all challenges
   */
  async getChallenges(): Promise<AxiosResponse<ApiResponse<ChallengeData[]>>> {
    return this.client.get('/challenge');
  }
  
  /**
   * Create challenge
   * @param data - Challenge creation data
   */
  async createChallenge(data: Omit<ChallengeData, 'id' | 'createdAt' | 'updatedAt'>): Promise<AxiosResponse<ApiResponse<ChallengeData>>> {
    return this.client.post('/challenge', data);
  }
  
  /**
   * Update challenge
   * @param challengeId - Challenge ID
   * @param data - Challenge update data
   */
  async updateChallenge(challengeId: number, data: Partial<ChallengeData>): Promise<AxiosResponse<ApiResponse<ChallengeData>>> {
    return this.client.put(`/challenge/${challengeId}`, data);
  }
  
  /**
   * Delete challenge
   * @param challengeId - Challenge ID
   */
  async deleteChallenge(challengeId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete(`/challenge/${challengeId}`);
  }
  
  /**
   * Get challenge tasks
   * @param challengeId - Challenge ID
   */
  async getChallengeTasks(challengeId: number): Promise<AxiosResponse<ApiResponse<TaskData[]>>> {
    return this.client.get(`/challenge/${challengeId}/tasks`);
  }
  
  /**
   * Get task by ID
   * @param taskId - Task ID
   */
  async getTask(taskId: number): Promise<AxiosResponse<ApiResponse<TaskData>>> {
    return this.client.get(`/challenge/task/${taskId}`);
  }
  
  /**
   * Complete task
   * @param taskId - Task ID
   * @param data - Completion data
   */
  async completeTask(taskId: number, data?: Record<string, any>): Promise<AxiosResponse<ApiResponse<TaskData>>> {
    return this.client.post(`/challenge/complete-task/${taskId}`, data || {});
  }
}

/**
 * Order API Client
 */
export class OrderApiClient extends BaseApiClient {
  /**
   * Run order execution
   * @param orderId - Order ID
   * @param chainId - Chain ID
   */
  async runOrder(orderId: number, chainId: number): Promise<AxiosResponse<ApiResponse<any>>> {
    return this.client.get(`/order/run/${orderId}/${chainId}`);
  }
  
  /**
   * Get all protocol orders
   */
  async getAllProtocolOrders(): Promise<AxiosResponse<ApiResponse<OrderData[]>>> {
    return this.client.get('/protocol/order/all');
  }
  
  /**
   * Start checkout process
   * @param data - Checkout data
   */
  async startCheckout(data: CheckoutData): Promise<AxiosResponse<ApiResponse<CheckoutSession>>> {
    return this.client.post('/order/checkout', data);
  }
  
  /**
   * Confirm order
   * @param data - Order confirmation data
   */
  async confirmOrder(data: OrderConfirmation): Promise<AxiosResponse<ApiResponse<OrderData>>> {
    return this.client.post('/order/confirm-order', data);
  }
  
  /**
   * Get orders by status (Admin only - SuperAdmin role required)
   * @param status - Order status
   */
  async getOrdersByStatus(status: string): Promise<AxiosResponse<ApiResponse<OrderData[]>>> {
    return this.client.get(`/orders/${status}`);
  }
  
  /**
   * Confirm order price (Admin only - SuperAdmin role required)
   * @param data - Price confirmation data
   */
  async confirmOrderPrice(data: { order_id: number; price: number }): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.post('/orders/confirm', data);
  }
  
  /**
   * Get order by ID
   * @param orderId - Order ID
   */
  async getOrder(orderId: number): Promise<AxiosResponse<ApiResponse<OrderData>>> {
    return this.client.get(`/order/${orderId}`);
  }
  
  /**
   * Get user's orders
   * @param params - Query parameters
   */
  async getUserOrders(params?: { status?: OrderStatus; page?: number; limit?: number }): Promise<AxiosResponse<ApiResponse<PaginatedResponse<OrderData>>>> {
    return this.client.get('/orders', { params });
  }
  
  /**
   * Cancel order
   * @param orderId - Order ID
   */
  async cancelOrder(orderId: number): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete(`/order/${orderId}`);
  }
}

/**
 * Payment API Client
 */
export class PaymentApiClient extends BaseApiClient {
  /**
   * Get payment history for subscriptions
   */
  async getSubscriptionPayments(): Promise<AxiosResponse<ApiResponse<any[]>>> {
    return this.client.get('/payment/subscriptions');
  }
  
  /**
   * Get payment history for program purchases
   */
  async getProgramPurchases(): Promise<AxiosResponse<ApiResponse<any[]>>> {
    return this.client.get('/payment/program-purchases');
  }
  
  /**
   * Get purchased items
   */
  async getPurchasedItems(): Promise<AxiosResponse<ApiResponse<any[]>>> {
    return this.client.get('/payment/purchased-items');
  }
  
  /**
   * Setup payment method
   */
  async setupPaymentMethod(): Promise<AxiosResponse<ApiResponse<{ clientSecret: string }>>> {
    return this.client.get('/payment/setup-payment-method');
  }
  
  /**
   * Save payment method
   * @param paymentMethodId - Payment method ID
   */
  async savePaymentMethod(paymentMethodId: string): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.post('/payment/save-payment-method', { payment_method_id: paymentMethodId });
  }
  
  /**
   * Get payment methods
   */
  async getPaymentMethods(): Promise<AxiosResponse<ApiResponse<any[]>>> {
    return this.client.get('/payment/get-payment-method');
  }
  
  /**
   * Delete payment method
   * @param paymentMethodId - Payment method ID
   */
  async deletePaymentMethod(paymentMethodId: string): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete(`/payment/delete-payment-method/${paymentMethodId}`);
  }
}

// =================== DOMAIN TYPES =====================

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
export class DomainApiClient extends BaseApiClient {
  /**
   * Get domain configuration by hostname
   * @param hostname - Domain hostname
   */
  async getByHostname(hostname: string): Promise<AxiosResponse<ApiResponse<DomainData>>> {
    return this.client.get(`/domains/hostname/${hostname}`);
  }
  
  /**
   * Get all domains
   */
  async getAllDomains(): Promise<AxiosResponse<ApiResponse<DomainData[]>>> {
    return this.client.get('/domains');
  }
  
  /**
   * Get domain by ID
   * @param domainId - Domain ID
   */
  async getDomain(domainId: string): Promise<AxiosResponse<ApiResponse<DomainData>>> {
    return this.client.get(`/domains/${domainId}`);
  }
  
  /**
   * Create domain
   * @param data - Domain creation data
   */
  async createDomain(data: Omit<DomainData, 'id' | 'createdAt' | 'updatedAt'>): Promise<AxiosResponse<ApiResponse<DomainData>>> {
    return this.client.post('/domains', data);
  }
  
  /**
   * Update domain
   * @param domainId - Domain ID
   * @param data - Domain update data
   */
  async updateDomain(domainId: string, data: Partial<DomainData>): Promise<AxiosResponse<ApiResponse<DomainData>>> {
    return this.client.put(`/domains/${domainId}`, data);
  }
  
  /**
   * Delete domain
   * @param domainId - Domain ID
   */
  async deleteDomain(domainId: string): Promise<AxiosResponse<ApiResponse<null>>> {
    return this.client.delete(`/domains/${domainId}`);
  }
  
  /**
   * Get domain configuration
   * @param hostname - Domain hostname
   */
  async getConfiguration(hostname: string): Promise<AxiosResponse<ApiResponse<DomainData['config']>>> {
    return this.client.get(`/domains/hostname/${hostname}/config`);
  }
  
  /**
   * Update domain status
   * @param domainId - Domain ID
   * @param status - New status
   */
  async updateStatus(domainId: string, status: DomainData['status']): Promise<AxiosResponse<ApiResponse<DomainData>>> {
    return this.client.patch(`/domains/${domainId}/status`, { status });
  }
}

// =================== COMBINED API CLIENT =====================

/**
 * Factory function to create a complete HMS API client
 * @param config - API client configuration
 */
export function createHmsApiClient(config: ApiClientConfig) {
  return {
    // Authentication & User Management
    auth: new AuthApiClient(config),
    user: new UserApiClient(config),
    team: new TeamApiClient(config),
    
    // Core Business Logic
    items: new ItemsApiClient(config),
    programs: new ProgramsApiClient(config),
    protocols: new ProtocolApiClient(config),
    domains: new DomainApiClient(config),
    
    // Module-Specific Clients (New implementations)
    order: new OrderApiClient(config),
    nudge: new NudgeApiClient(config),
    challenge: new ChallengeApiClient(config),
    assessments: new AssessmentsApiClient(config),
    activity: new ActivityApiClient(config),
    followUps: new FollowUpsApiClient(config),
    
    // Analytics & Monitoring
    kpi: new KPIApiClient(config),
    
    // Communication
    chat: new ChatApiClient(config),
    notifications: new NotificationApiClient(config),
    
    // Payment & Financial
    stripe: new StripeApiClient(config),
    payment: new PaymentApiClient(config)
  };
}

// =================== ENVIRONMENT-SPECIFIC FACTORIES =====================

/**
 * Create GOV-specific API client
 * @param config - Additional configuration overrides
 */
export function createGovApiClient(config?: Partial<ApiClientConfig>) {
  const baseConfig: ApiClientConfig = {
    baseURL: typeof window !== 'undefined' ? 
      (window.location.hostname === 'localhost' ? 'http://localhost:8000/api' : '/api') : 
      'https://api.hms-platform.com/api',
    environment: 'gov',
    enableLogging: process.env.NODE_ENV === 'development',
    enableRetry: true,
    maxRetries: 3,
    ...config
  };
  
  return createHmsApiClient(baseConfig);
}

/**
 * Create MKT-specific API client
 * @param config - Additional configuration overrides
 */
export function createMktApiClient(config?: Partial<ApiClientConfig>) {
  const baseConfig: ApiClientConfig = {
    baseURL: typeof window !== 'undefined' ? 
      (window.location.hostname === 'localhost' ? 'http://localhost:8000/api' : '/api/mkt') : 
      'https://api.hms-platform.com/api/mkt',
    environment: 'mkt',
    enableLogging: process.env.NODE_ENV === 'development',
    enableRetry: true,
    maxRetries: 2, // Slightly lower retry for marketing APIs
    ...config
  };
  
  return createHmsApiClient(baseConfig);
}

/**
 * Create MFE-specific API client
 * @param config - Additional configuration overrides
 */
export function createMfeApiClient(config?: Partial<ApiClientConfig>) {
  const baseConfig: ApiClientConfig = {
    baseURL: typeof window !== 'undefined' ? 
      (window.location.hostname === 'localhost' ? 'http://localhost:8000/api' : '/api/mfe') : 
      'https://api.hms-platform.com/api/mfe',
    environment: 'mfe',
    enableLogging: false, // Disabled by default for micro-frontends
    enableRetry: true,
    maxRetries: 2,
    timeout: 15000, // Shorter timeout for micro-frontends
    ...config
  };
  
  return createHmsApiClient(baseConfig);
}

// =================== DEFAULT CLIENT INSTANCES =====================

// Create a default client instance
export const hmsApiClient = createHmsApiClient({
  baseURL: typeof window !== 'undefined' ? 
    (window.location.hostname === 'localhost' ? 'http://localhost:8000/api' : '/api') : 
    'https://api.hms-platform.com/api',
  enableLogging: process.env.NODE_ENV === 'development',
  enableRetry: true
});

// Environment-specific default instances
export const govApiClient = createGovApiClient();
export const mktApiClient = createMktApiClient();
export const mfeApiClient = createMfeApiClient();

// =================== TYPE EXPORTS FOR CONVENIENCE =====================

export type HmsApiClient = ReturnType<typeof createHmsApiClient>;
export type ApiModule = keyof HmsApiClient;