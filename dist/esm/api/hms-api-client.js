/**
 * HMS API TypeScript Client Library
 *
 * This client library provides type-safe access to all HMS API endpoints
 * organized by modules and functionality.
 */
import axios from 'axios';
/**
 * Item status enum
 */
export var ItemStatus;
(function (ItemStatus) {
    ItemStatus["ACTIVE"] = "active";
    ItemStatus["INACTIVE"] = "inactive";
    ItemStatus["PENDING"] = "pending";
    ItemStatus["DELETED"] = "deleted";
})(ItemStatus || (ItemStatus = {}));
/**
 * Program status enum
 */
export var ProgramStatus;
(function (ProgramStatus) {
    ProgramStatus["DRAFT"] = "draft";
    ProgramStatus["PUBLISHED"] = "published";
    ProgramStatus["ARCHIVED"] = "archived";
})(ProgramStatus || (ProgramStatus = {}));
/**
 * Protocol status enum
 */
export var ProtocolStatus;
(function (ProtocolStatus) {
    ProtocolStatus["DRAFT"] = "draft";
    ProtocolStatus["ACTIVE"] = "active";
    ProtocolStatus["INACTIVE"] = "inactive";
})(ProtocolStatus || (ProtocolStatus = {}));
/**
 * Order status enum
 */
export var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["CONFIRMED"] = "confirmed";
    OrderStatus["PROCESSING"] = "processing";
    OrderStatus["COMPLETED"] = "completed";
    OrderStatus["CANCELLED"] = "cancelled";
    OrderStatus["FAILED"] = "failed";
})(OrderStatus || (OrderStatus = {}));
/**
 * Nudge status enum
 */
export var NudgeStatus;
(function (NudgeStatus) {
    NudgeStatus["ACTIVE"] = "active";
    NudgeStatus["INACTIVE"] = "inactive";
    NudgeStatus["SCHEDULED"] = "scheduled";
})(NudgeStatus || (NudgeStatus = {}));
/**
 * Challenge type enum
 */
export var ChallengeType;
(function (ChallengeType) {
    ChallengeType["VIDEO"] = "video";
    ChallengeType["TASK"] = "task";
    ChallengeType["QUIZ"] = "quiz";
    ChallengeType["PHOTO"] = "photo";
})(ChallengeType || (ChallengeType = {}));
/**
 * Challenge status enum
 */
export var ChallengeStatus;
(function (ChallengeStatus) {
    ChallengeStatus["ACTIVE"] = "active";
    ChallengeStatus["INACTIVE"] = "inactive";
    ChallengeStatus["COMPLETED"] = "completed";
})(ChallengeStatus || (ChallengeStatus = {}));
/**
 * Task status enum
 */
export var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PENDING"] = "pending";
    TaskStatus["IN_PROGRESS"] = "in_progress";
    TaskStatus["COMPLETED"] = "completed";
    TaskStatus["FAILED"] = "failed";
})(TaskStatus || (TaskStatus = {}));
/**
 * Assessment status enum
 */
export var AssessmentStatus;
(function (AssessmentStatus) {
    AssessmentStatus["DRAFT"] = "draft";
    AssessmentStatus["ACTIVE"] = "active";
    AssessmentStatus["INACTIVE"] = "inactive";
    AssessmentStatus["ARCHIVED"] = "archived";
})(AssessmentStatus || (AssessmentStatus = {}));
/**
 * Question type enum
 */
export var QuestionType;
(function (QuestionType) {
    QuestionType["MULTIPLE_CHOICE"] = "multiple_choice";
    QuestionType["SINGLE_CHOICE"] = "single_choice";
    QuestionType["TEXT"] = "text";
    QuestionType["SCALE"] = "scale";
    QuestionType["YES_NO"] = "yes_no";
})(QuestionType || (QuestionType = {}));
/**
 * Activity type enum
 */
export var ActivityType;
(function (ActivityType) {
    ActivityType["EXERCISE"] = "exercise";
    ActivityType["APPOINTMENT"] = "appointment";
    ActivityType["CLASS"] = "class";
    ActivityType["EVENT"] = "event";
    ActivityType["WORKSHOP"] = "workshop";
})(ActivityType || (ActivityType = {}));
/**
 * Activity status enum
 */
export var ActivityStatus;
(function (ActivityStatus) {
    ActivityStatus["AVAILABLE"] = "available";
    ActivityStatus["BOOKED"] = "booked";
    ActivityStatus["COMPLETED"] = "completed";
    ActivityStatus["CANCELLED"] = "cancelled";
})(ActivityStatus || (ActivityStatus = {}));
/**
 * Event status enum
 */
export var EventStatus;
(function (EventStatus) {
    EventStatus["SCHEDULED"] = "scheduled";
    EventStatus["IN_PROGRESS"] = "in_progress";
    EventStatus["COMPLETED"] = "completed";
    EventStatus["CANCELLED"] = "cancelled";
})(EventStatus || (EventStatus = {}));
/**
 * Follow-up type enum
 */
export var FollowUpType;
(function (FollowUpType) {
    FollowUpType["REMINDER"] = "reminder";
    FollowUpType["CHECK_IN"] = "check_in";
    FollowUpType["ASSESSMENT"] = "assessment";
    FollowUpType["RECOMMENDATION"] = "recommendation";
    FollowUpType["VOICE_CALL"] = "voice_call";
})(FollowUpType || (FollowUpType = {}));
/**
 * Follow-up status enum
 */
export var FollowUpStatus;
(function (FollowUpStatus) {
    FollowUpStatus["PENDING"] = "pending";
    FollowUpStatus["SCHEDULED"] = "scheduled";
    FollowUpStatus["IN_PROGRESS"] = "in_progress";
    FollowUpStatus["COMPLETED"] = "completed";
    FollowUpStatus["CANCELLED"] = "cancelled";
})(FollowUpStatus || (FollowUpStatus = {}));
/**
 * Timeline event type enum
 */
export var TimelineEventType;
(function (TimelineEventType) {
    TimelineEventType["FOLLOW_UP"] = "follow_up";
    TimelineEventType["ASSESSMENT"] = "assessment";
    TimelineEventType["CHALLENGE"] = "challenge";
    TimelineEventType["ORDER"] = "order";
    TimelineEventType["ACTIVITY"] = "activity";
    TimelineEventType["NOTE"] = "note";
})(TimelineEventType || (TimelineEventType = {}));
/**
 * Recommendation type enum
 */
export var RecommendationType;
(function (RecommendationType) {
    RecommendationType["PROGRAM"] = "program";
    RecommendationType["ACTIVITY"] = "activity";
    RecommendationType["ITEM"] = "item";
    RecommendationType["ASSESSMENT"] = "assessment";
    RecommendationType["CUSTOM"] = "custom";
})(RecommendationType || (RecommendationType = {}));
/**
 * Payment status enum
 */
export var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PROCESSING"] = "processing";
    PaymentStatus["COMPLETED"] = "completed";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["REFUNDED"] = "refunded";
})(PaymentStatus || (PaymentStatus = {}));
/**
 * Chain status enum
 */
export var ChainStatus;
(function (ChainStatus) {
    ChainStatus["ACTIVE"] = "active";
    ChainStatus["PAUSED"] = "paused";
    ChainStatus["COMPLETED"] = "completed";
    ChainStatus["CANCELLED"] = "cancelled";
})(ChainStatus || (ChainStatus = {}));
// =================== BASE API CLIENT =====================
/**
 * Base API Client class
 */
export class BaseApiClient {
    constructor(config) {
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
    /**
     * Setup request and response interceptors
     */
    setupInterceptors() {
        // Request interceptor for authentication and tenant support
        this.client.interceptors.request.use((requestConfig) => {
            // Add authentication token
            const token = localStorage.getItem('auth_token');
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
            // Log request if enabled
            if (this.config.enableLogging) {
                console.log(`[HMS API] ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`, {
                    headers: requestConfig.headers,
                    data: requestConfig.data
                });
            }
            return requestConfig;
        }, (error) => Promise.reject(error));
        // Response interceptor for error handling and retry logic
        this.client.interceptors.response.use((response) => {
            // Log response if enabled
            if (this.config.enableLogging) {
                console.log(`[HMS API] Response:`, {
                    status: response.status,
                    data: response.data
                });
            }
            return response;
        }, async (error) => {
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
            // Log error if enabled
            if (this.config.enableLogging) {
                console.error(`[HMS API] Error:`, {
                    status: error.response?.status,
                    message: error.message,
                    data: error.response?.data
                });
            }
            return Promise.reject(error);
        });
    }
    /**
     * Determine if a request should be retried
     */
    shouldRetry(error) {
        if (!error.config || error.config._retryCount >= (this.config.maxRetries || 3)) {
            return false;
        }
        // Retry on network errors or 5xx server errors
        return !error.response || error.response.status >= 500;
    }
    /**
     * Retry a failed request with exponential backoff
     */
    async retryRequest(error) {
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
    async login(data) {
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
    async register(data) {
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
    async logout() {
        try {
            const response = await this.client.get('/logout');
            localStorage.removeItem('auth_token');
            return response;
        }
        catch (error) {
            // Always remove the token even if the API call fails
            localStorage.removeItem('auth_token');
            throw error;
        }
    }
    /**
     * Get the currently authenticated user
     */
    async getCurrentUser() {
        return this.client.get('/user/get-data');
    }
    /**
     * Request password reset
     * @param data - Password reset request data
     */
    async requestPasswordReset(data) {
        return this.client.post('/auth/reset', data);
    }
    /**
     * Set new password
     * @param data - New password data
     */
    async setNewPassword(data) {
        return this.client.post('/auth/new-password', data);
    }
    /**
     * Check if the user is authenticated
     */
    isAuthenticated() {
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
    async updateProfile(userId, data) {
        return this.client.patch(`/users/update/${userId}`, data);
    }
    /**
     * Update billing information
     * @param data - Billing information
     */
    async updateBillingInfo(data) {
        return this.client.patch('/users/update-billing-info', data);
    }
    /**
     * Update phone number
     * @param phone - Phone number
     */
    async updatePhone(phone) {
        return this.client.patch('/users/update-phone', { phone });
    }
    /**
     * Update password
     * @param userId - User ID
     * @param currentPassword - Current password
     * @param newPassword - New password
     * @param newPasswordConfirmation - New password confirmation
     */
    async updatePassword(userId, currentPassword, newPassword, newPasswordConfirmation) {
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
    async uploadProfilePhoto(userId, photo) {
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
    async uploadCoverPhoto(userId, cover) {
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
    async getUserByUsername(username) {
        return this.client.get(`/users/name/${username}`);
    }
    /**
     * Get user by ID
     * @param userId - User ID
     */
    async getUserById(userId) {
        return this.client.get(`/users/id/${userId}`);
    }
    /**
     * Search for users
     * @param query - Search query
     */
    async searchUsers(query) {
        return this.client.get(`/users/find/${query}`);
    }
    /**
     * Delete account
     * @param userId - User ID
     */
    async deleteAccount(userId) {
        return this.client.delete(`/users/delete/${userId}`);
    }
    /**
     * Get user wallet balance
     */
    async getWalletBalance() {
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
    async getAllMembers() {
        return this.client.get('/team/all');
    }
    /**
     * Get team members by status
     * @param status - Member status
     */
    async getMembersByStatus(status) {
        return this.client.get(`/team/list/${status}`);
    }
    /**
     * Get invites
     */
    async getInvites() {
        return this.client.get('/team/member/pending');
    }
    /**
     * Invite team member
     * @param data - Invite data
     */
    async inviteMember(data) {
        return this.client.post('/team/invite', data);
    }
    /**
     * Invite network member
     * @param userId - User ID
     * @param role - Role
     */
    async inviteNetworkMember(userId, role) {
        return this.client.post('/team/network-invite', { user_id: userId, role });
    }
    /**
     * Search network members
     * @param query - Search query
     */
    async searchNetworkMembers(query) {
        return this.client.post('/team/network-search', { search: query });
    }
    /**
     * Accept invite
     * @param inviteId - Invite ID
     */
    async acceptInvite(inviteId) {
        return this.client.post('/team/accept', { invite_id: inviteId });
    }
    /**
     * Reject invite
     * @param inviteId - Invite ID
     */
    async rejectInvite(inviteId) {
        return this.client.post('/team/reject', { invite_id: inviteId });
    }
    /**
     * Leave team
     * @param teamId - Team ID
     */
    async leaveTeam(teamId) {
        return this.client.post('/team/leave', { team_id: teamId });
    }
    /**
     * Remove member
     * @param memberId - Member ID
     */
    async removeMember(memberId) {
        return this.client.post('/team/remove', { member_id: memberId });
    }
    /**
     * Get invite by token
     * @param token - Invite token
     */
    async getInviteByToken(token) {
        return this.client.get(`/public/team/get-invite/${token}`);
    }
    /**
     * Accept invite by token
     * @param token - Invite token
     */
    async acceptInviteByToken(token) {
        return this.client.get(`/team/accept-invite/${token}`);
    }
    /**
     * Reject invite by token
     * @param token - Invite token
     */
    async rejectInviteByToken(token) {
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
    async getItems(params) {
        return this.client.get('/items', { params });
    }
    /**
     * Get item by ID
     * @param id - Item ID
     */
    async getItem(id) {
        return this.client.get(`/items/${id}`);
    }
    /**
     * Create item
     * @param data - Item data
     */
    async createItem(data) {
        return this.client.post('/items', data);
    }
    /**
     * Update item
     * @param id - Item ID
     * @param data - Item data
     */
    async updateItem(id, data) {
        return this.client.put(`/items/${id}`, data);
    }
    /**
     * Delete item
     * @param id - Item ID
     */
    async deleteItem(id) {
        return this.client.delete(`/items/${id}`);
    }
    /**
     * Search items
     * @param search - Search query
     * @param type - Item type
     */
    async searchItems(search, type) {
        return this.client.get(`/items/find-item/${search}/${type}`);
    }
    /**
     * Get food categories
     */
    async getFoodCategories() {
        return this.client.get('/items/food-categories');
    }
    /**
     * Get all item collections
     */
    async getCollections() {
        return this.client.get('/collection-list');
    }
    /**
     * Get collection by ID
     * @param id - Collection ID
     */
    async getCollection(id) {
        return this.client.get(`/collection/${id}`);
    }
    /**
     * Create collection
     * @param data - Collection data
     */
    async createCollection(data) {
        return this.client.post('/collection', data);
    }
    /**
     * Add item to collection
     * @param collectionId - Collection ID
     * @param itemId - Item ID
     */
    async addItemToCollection(collectionId, itemId) {
        return this.client.post('/collection-item', { collection_id: collectionId, item_id: itemId });
    }
    /**
     * Remove item from collection
     * @param itemId - Collection item ID
     */
    async removeItemFromCollection(itemId) {
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
    async getFeaturedPrograms() {
        return this.client.get('/home/featured-programs');
    }
    /**
     * Get recent programs
     */
    async getRecentPrograms() {
        return this.client.get('/home/most-recent-programs');
    }
    /**
     * Get program by ID
     * @param id - Program ID
     */
    async getProgram(id) {
        return this.client.get(`/public/get-program/${id}`);
    }
    /**
     * Get program feedback
     * @param id - Program ID
     */
    async getProgramFeedback(id) {
        return this.client.get(`/public/get-program-feedback/${id}`);
    }
    /**
     * Search programs
     * @param query - Search query
     * @param category - Category ID
     */
    async searchPrograms(query, category) {
        return this.client.post('/program/search', { query, category });
    }
    /**
     * Get programs by user
     * @param userId - User ID
     */
    async getUserPrograms(userId) {
        return this.client.get(`/public/get-user-feed/${userId}`);
    }
    /**
     * Get featured programs by user
     * @param userId - User ID
     */
    async getUserFeaturedPrograms(userId) {
        return this.client.get(`/public/get-user-featured/${userId}`);
    }
    /**
     * Toggle program bookmark
     * @param programId - Program ID
     */
    async toggleBookmark(programId) {
        return this.client.post('/program/toggle-bookmark', { program_id: programId });
    }
    /**
     * Get bookmarked programs
     */
    async getBookmarks() {
        return this.client.get('/program/get-bookmarks');
    }
    /**
     * Get program categories
     */
    async getCategories() {
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
    async getProtocol(id) {
        return this.client.get(`/protocol/${id}`);
    }
    /**
     * Get protocols by category
     * @param categoryId - Category ID
     */
    async getProtocolsByCategory(categoryId) {
        const endpoint = categoryId ? `/protocol/by-category/${categoryId}` : '/protocol/by-category';
        return this.client.get(endpoint);
    }
    /**
     * Get available protocol modules
     * @param recurring - Get recurring modules only
     */
    async getModules(recurring) {
        const endpoint = recurring ? '/protocol/modules/1' : '/protocol/modules';
        return this.client.get(endpoint);
    }
    /**
     * Get protocol steps
     * @param protocolId - Protocol ID
     */
    async getProtocolSteps(protocolId) {
        return this.client.get(`/protocol/get-steps/${protocolId}`);
    }
    /**
     * Get protocol categories
     */
    async getCategories() {
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
    async getUserDevices() {
        return this.client.get('/user-devices/list');
    }
    /**
     * Redirect to Withings for authentication
     */
    async authorizeWithings() {
        return this.client.get('/withings/auth');
    }
    /**
     * Get KPI setup for a chain
     * @param chainId - Chain ID
     * @param protocolId - Protocol ID
     */
    async getKPISetup(chainId, protocolId) {
        return this.client.get(`/kpi/get-setup/${chainId}/${protocolId}`);
    }
    /**
     * Save KPI setup
     * @param data - KPI setup data
     */
    async saveKPISetup(data) {
        return this.client.post('/kpi/save-setup', data);
    }
    /**
     * Remove KPI rule
     * @param ruleId - Rule ID
     */
    async removeKPIRule(ruleId) {
        return this.client.delete(`/kpi/remove-rule/${ruleId}`);
    }
    /**
     * Save round results
     * @param data - Round results data
     */
    async saveRoundResults(data) {
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
    async getChatList(search) {
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
    async listConversations(search) {
        return this.getChatList(search);
    }
    /**
     * Get chat room
     * @param userId - User ID (to create or get a 1:1 chat)
     */
    async getChatRoom(userId) {
        return this.client.post('/chat/get-room', { user_id: userId });
    }
    /**
     * Get chat room by ID
     * @param roomId - Room ID
     */
    async getChatRoomById(roomId) {
        return this.client.get(`/chat/get-room-by-id/${roomId}`);
    }
    /**
     * Get messages for a chat
     * @param chatId - Chat ID
     * @param search - Search query
     */
    async getMessages(chatId, search) {
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
    async listMessages(conversationId, search) {
        return this.getMessages(conversationId, search);
    }
    /**
     * Send message
     * @param data - Message data
     */
    async sendMessage(data) {
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
    async findUserToChat(search) {
        return this.client.get(`/chat/find-user/${search}`);
    }
    /**
     * Delete message
     * @param messageId - Message ID
     */
    async deleteMessage(messageId) {
        return this.client.delete(`/chat/delete-message/${messageId}`);
    }
    /**
     * Delete chat
     * @param chatId - Chat ID
     */
    async deleteChat(chatId) {
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
    async getNotifications() {
        return this.client.get('/notification/get');
    }
    /**
     * Get unread notifications count
     */
    async getUnreadCount() {
        return this.client.get('/notification/get-unread');
    }
    /**
     * Delete notification
     * @param notificationId - Notification ID
     */
    async deleteNotification(notificationId) {
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
    async connectToStripe() {
        return this.client.get('/stripe/connect');
    }
    /**
     * Withdraw money
     */
    async withdrawMoney() {
        return this.client.get('/stripe/withdraw');
    }
    /**
     * Get transactions
     */
    async getTransactions() {
        return this.client.get('/stripe/transactions');
    }
    /**
     * Check Stripe account
     */
    async checkAccount() {
        return this.client.get('/stripe/check-account');
    }
    /**
     * Delete Stripe account
     */
    async deleteAccount() {
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
    async checkNudgeSecret(secret) {
        return this.client.get(`/nudge/check/${secret}`);
    }
    /**
     * Email check-in (Public endpoint - no authentication required)
     * @param email - Email address
     * @param data - Check-in data
     */
    async emailCheckin(email, data) {
        return this.client.post('/nudge-checkin/email', { email, ...data });
    }
    /**
     * SMS check-in (Public endpoint - no authentication required)
     * @param phone - Phone number
     * @param data - Check-in data
     */
    async smsCheckin(phone, data) {
        return this.client.post('/nudge-checkin/sms', { phone, ...data });
    }
    /**
     * Delete nudge image
     * @param nudgeId - Nudge ID
     */
    async deleteNudgeImage(nudgeId) {
        return this.client.delete(`/nudge/image/${nudgeId}`);
    }
    /**
     * Get all protocol nudges
     */
    async getAllProtocolNudges() {
        return this.client.get('/protocol/nudge/all');
    }
    /**
     * Get all nudges
     */
    async getNudges() {
        return this.client.get('/nudge');
    }
    /**
     * Get nudge by ID
     * @param nudgeId - Nudge ID
     */
    async getNudge(nudgeId) {
        return this.client.get(`/nudge/${nudgeId}`);
    }
    /**
     * Create nudge
     * @param data - Nudge creation data
     */
    async createNudge(data) {
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
    async updateNudge(nudgeId, data) {
        return this.client.put(`/nudge/${nudgeId}`, data);
    }
    /**
     * Delete nudge
     * @param nudgeId - Nudge ID
     */
    async deleteNudge(nudgeId) {
        return this.client.delete(`/nudge/${nudgeId}`);
    }
    /**
     * Upload nudge image
     * @param nudgeId - Nudge ID
     * @param imageFile - Image file
     */
    async uploadNudgeImage(nudgeId, imageFile) {
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
    async activateNudge(nudgeId) {
        return this.client.post(`/nudge/${nudgeId}/activate`);
    }
    /**
     * Deactivate nudge
     * @param nudgeId - Nudge ID
     */
    async deactivateNudge(nudgeId) {
        return this.client.post(`/nudge/${nudgeId}/deactivate`);
    }
    /**
     * Schedule nudge
     * @param nudgeId - Nudge ID
     * @param scheduledAt - Scheduled date and time
     */
    async scheduleNudge(nudgeId, scheduledAt) {
        return this.client.post(`/nudge/${nudgeId}/schedule`, { scheduled_at: scheduledAt });
    }
    /**
     * Get nudge analytics
     * @param nudgeId - Nudge ID
     */
    async getNudgeAnalytics(nudgeId) {
        return this.client.get(`/nudge/${nudgeId}/analytics`);
    }
    /**
     * Get nudge check-ins
     * @param nudgeId - Nudge ID
     */
    async getNudgeCheckins(nudgeId) {
        return this.client.get(`/nudge/${nudgeId}/checkins`);
    }
    /**
     * Send test nudge
     * @param nudgeId - Nudge ID
     * @param recipients - Test recipients (email or phone)
     */
    async sendTestNudge(nudgeId, recipients) {
        return this.client.post(`/nudge/${nudgeId}/test`, { recipients });
    }
    /**
     * Get nudges by protocol
     * @param protocolId - Protocol ID
     */
    async getNudgesByProtocol(protocolId) {
        return this.client.get(`/nudge/protocol/${protocolId}`);
    }
    /**
     * Get nudges by chain
     * @param chainId - Chain ID
     */
    async getNudgesByChain(chainId) {
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
    async runFollowUp(chainId) {
        return this.client.get(`/follow-up/run/${chainId}`);
    }
    /**
     * Get timeline for chain
     * @param chainId - Chain ID
     */
    async getTimeline(chainId) {
        return this.client.get(`/follow-up/get-timeline/${chainId}`);
    }
    /**
     * Get recommendations for follow-up
     * @param followupId - Follow-up ID
     */
    async getRecommendations(followupId) {
        return this.client.get(`/follow-up/recommendations/${followupId}`);
    }
    /**
     * Record voice for follow-up
     * @param audioFile - Audio file
     * @param followupId - Follow-up ID
     * @param metadata - Additional metadata
     */
    async recordVoice(audioFile, followupId, metadata) {
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
    async finalizeVoice(data) {
        return this.client.post('/follow-up/voice-finalize', data);
    }
    /**
     * Process payment for follow-up
     * @param data - Payment data
     */
    async processPayment(data) {
        return this.client.post('/follow-up/process-payment', data);
    }
    /**
     * Get all follow-ups
     */
    async getFollowUps() {
        return this.client.get('/follow-up');
    }
    /**
     * Get follow-up by ID
     * @param followupId - Follow-up ID
     */
    async getFollowUp(followupId) {
        return this.client.get(`/follow-up/${followupId}`);
    }
    /**
     * Create follow-up
     * @param data - Follow-up creation data
     */
    async createFollowUp(data) {
        return this.client.post('/follow-up', data);
    }
    /**
     * Update follow-up
     * @param followupId - Follow-up ID
     * @param data - Follow-up update data
     */
    async updateFollowUp(followupId, data) {
        return this.client.put(`/follow-up/${followupId}`, data);
    }
    /**
     * Delete follow-up
     * @param followupId - Follow-up ID
     */
    async deleteFollowUp(followupId) {
        return this.client.delete(`/follow-up/${followupId}`);
    }
    /**
     * Schedule follow-up
     * @param followupId - Follow-up ID
     * @param scheduledAt - Scheduled date and time
     */
    async scheduleFollowUp(followupId, scheduledAt) {
        return this.client.post(`/follow-up/${followupId}/schedule`, { scheduled_at: scheduledAt });
    }
    /**
     * Cancel follow-up
     * @param followupId - Follow-up ID
     */
    async cancelFollowUp(followupId) {
        return this.client.post(`/follow-up/${followupId}/cancel`);
    }
    /**
     * Complete follow-up
     * @param followupId - Follow-up ID
     * @param data - Completion data
     */
    async completeFollowUp(followupId, data) {
        return this.client.post(`/follow-up/${followupId}/complete`, data || {});
    }
    /**
     * Get follow-ups by chain
     * @param chainId - Chain ID
     */
    async getFollowUpsByChain(chainId) {
        return this.client.get(`/follow-up/chain/${chainId}`);
    }
    /**
     * Get pending follow-ups
     */
    async getPendingFollowUps() {
        return this.client.get('/follow-up/pending');
    }
    /**
     * Create recommendation
     * @param data - Recommendation creation data
     */
    async createRecommendation(data) {
        return this.client.post('/follow-up/recommendation', data);
    }
    /**
     * Update recommendation
     * @param recommendationId - Recommendation ID
     * @param data - Recommendation update data
     */
    async updateRecommendation(recommendationId, data) {
        return this.client.put(`/follow-up/recommendation/${recommendationId}`, data);
    }
    /**
     * Delete recommendation
     * @param recommendationId - Recommendation ID
     */
    async deleteRecommendation(recommendationId) {
        return this.client.delete(`/follow-up/recommendation/${recommendationId}`);
    }
    /**
     * Get voice recordings
     * @param followupId - Follow-up ID
     */
    async getVoiceRecordings(followupId) {
        return this.client.get(`/follow-up/${followupId}/voice-recordings`);
    }
    /**
     * Delete voice recording
     * @param recordingId - Recording ID
     */
    async deleteVoiceRecording(recordingId) {
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
    async getRunningActivities(data) {
        return this.client.post('/activity/running', data);
    }
    /**
     * Get activity providers
     * @param activityId - Activity ID
     */
    async getActivityProviders(activityId) {
        return this.client.get(`/activity/get-providers/${activityId}`);
    }
    /**
     * Set reservation
     * @param data - Reservation data
     */
    async setReservation(data) {
        return this.client.post('/activity/set-reservation', data);
    }
    /**
     * Confirm booking
     * @param data - Booking data
     */
    async confirmBooking(data) {
        return this.client.post('/activity/confirm-booking', data);
    }
    /**
     * Get booked events for a month
     * @param date - Date in YYYY-MM format
     */
    async getBookedEventsForMonth(date) {
        return this.client.get(`/activity/booked-events-month/${date}`);
    }
    /**
     * Search service locations
     * @param query - Search query
     */
    async searchServiceLocations(query) {
        return this.client.get(`/activity/search-locations/${encodeURIComponent(query)}`);
    }
    /**
     * Get all activities
     */
    async getActivities() {
        return this.client.get('/activity');
    }
    /**
     * Get activity by ID
     * @param activityId - Activity ID
     */
    async getActivity(activityId) {
        return this.client.get(`/activity/${activityId}`);
    }
    /**
     * Create activity
     * @param data - Activity creation data
     */
    async createActivity(data) {
        return this.client.post('/activity', data);
    }
    /**
     * Update activity
     * @param activityId - Activity ID
     * @param data - Activity update data
     */
    async updateActivity(activityId, data) {
        return this.client.put(`/activity/${activityId}`, data);
    }
    /**
     * Delete activity
     * @param activityId - Activity ID
     */
    async deleteActivity(activityId) {
        return this.client.delete(`/activity/${activityId}`);
    }
    /**
     * Get locations
     */
    async getLocations() {
        return this.client.get('/activity/locations');
    }
    /**
     * Get location by ID
     * @param locationId - Location ID
     */
    async getLocation(locationId) {
        return this.client.get(`/activity/location/${locationId}`);
    }
    /**
     * Create location
     * @param data - Location creation data
     */
    async createLocation(data) {
        return this.client.post('/activity/location', data);
    }
    /**
     * Update location
     * @param locationId - Location ID
     * @param data - Location update data
     */
    async updateLocation(locationId, data) {
        return this.client.put(`/activity/location/${locationId}`, data);
    }
    /**
     * Delete location
     * @param locationId - Location ID
     */
    async deleteLocation(locationId) {
        return this.client.delete(`/activity/location/${locationId}`);
    }
    /**
     * Get providers
     */
    async getProviders() {
        return this.client.get('/activity/providers');
    }
    /**
     * Get provider by ID
     * @param providerId - Provider ID
     */
    async getProvider(providerId) {
        return this.client.get(`/activity/provider/${providerId}`);
    }
    /**
     * Create provider
     * @param data - Provider creation data
     */
    async createProvider(data) {
        return this.client.post('/activity/provider', data);
    }
    /**
     * Update provider
     * @param providerId - Provider ID
     * @param data - Provider update data
     */
    async updateProvider(providerId, data) {
        return this.client.put(`/activity/provider/${providerId}`, data);
    }
    /**
     * Delete provider
     * @param providerId - Provider ID
     */
    async deleteProvider(providerId) {
        return this.client.delete(`/activity/provider/${providerId}`);
    }
    /**
     * Cancel reservation
     * @param reservationId - Reservation ID
     */
    async cancelReservation(reservationId) {
        return this.client.delete(`/activity/reservation/${reservationId}`);
    }
    /**
     * Get user reservations
     */
    async getUserReservations() {
        return this.client.get('/activity/user-reservations');
    }
    /**
     * Get available time slots
     * @param activityId - Activity ID
     * @param date - Date in YYYY-MM-DD format
     */
    async getAvailableTimeSlots(activityId, date) {
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
    async runAssessment(assessmentId, chainId) {
        return this.client.get(`/assessment/run/${assessmentId}/${chainId}`);
    }
    /**
     * Get questions by assessment
     * @param assessmentId - Assessment ID
     */
    async getQuestionsByAssessment(assessmentId) {
        return this.client.get(`/question/by-assessment/${assessmentId}`);
    }
    /**
     * Store response
     * @param data - Response data
     */
    async storeResponse(data) {
        return this.client.post('/response/store', data);
    }
    /**
     * Delete choice
     * @param choiceId - Choice ID
     */
    async deleteChoice(choiceId) {
        return this.client.delete(`/choice/${choiceId}`);
    }
    /**
     * Get all assessments
     */
    async getAssessments() {
        return this.client.get('/assessment');
    }
    /**
     * Get assessment by ID
     * @param assessmentId - Assessment ID
     */
    async getAssessment(assessmentId) {
        return this.client.get(`/assessment/${assessmentId}`);
    }
    /**
     * Create assessment
     * @param data - Assessment creation data
     */
    async createAssessment(data) {
        return this.client.post('/assessment', data);
    }
    /**
     * Update assessment
     * @param assessmentId - Assessment ID
     * @param data - Assessment update data
     */
    async updateAssessment(assessmentId, data) {
        return this.client.put(`/assessment/${assessmentId}`, data);
    }
    /**
     * Delete assessment
     * @param assessmentId - Assessment ID
     */
    async deleteAssessment(assessmentId) {
        return this.client.delete(`/assessment/${assessmentId}`);
    }
    /**
     * Get question by ID
     * @param questionId - Question ID
     */
    async getQuestion(questionId) {
        return this.client.get(`/question/${questionId}`);
    }
    /**
     * Create question
     * @param data - Question creation data
     */
    async createQuestion(data) {
        return this.client.post('/question', data);
    }
    /**
     * Update question
     * @param questionId - Question ID
     * @param data - Question update data
     */
    async updateQuestion(questionId, data) {
        return this.client.put(`/question/${questionId}`, data);
    }
    /**
     * Delete question
     * @param questionId - Question ID
     */
    async deleteQuestion(questionId) {
        return this.client.delete(`/question/${questionId}`);
    }
    /**
     * Get choice by ID
     * @param choiceId - Choice ID
     */
    async getChoice(choiceId) {
        return this.client.get(`/choice/${choiceId}`);
    }
    /**
     * Create choice
     * @param data - Choice creation data
     */
    async createChoice(data) {
        return this.client.post('/choice', data);
    }
    /**
     * Update choice
     * @param choiceId - Choice ID
     * @param data - Choice update data
     */
    async updateChoice(choiceId, data) {
        return this.client.put(`/choice/${choiceId}`, data);
    }
    /**
     * Get user responses for assessment
     * @param assessmentId - Assessment ID
     * @param userId - User ID (optional, defaults to current user)
     */
    async getUserResponses(assessmentId, userId) {
        const endpoint = userId ? `/response/user/${userId}/assessment/${assessmentId}` : `/response/assessment/${assessmentId}`;
        return this.client.get(endpoint);
    }
    /**
     * Get assessment results
     * @param assessmentId - Assessment ID
     * @param userId - User ID (optional, defaults to current user)
     */
    async getAssessmentResults(assessmentId, userId) {
        const endpoint = userId ? `/assessment/${assessmentId}/results/${userId}` : `/assessment/${assessmentId}/results`;
        return this.client.get(endpoint);
    }
    /**
     * Submit assessment
     * @param assessmentId - Assessment ID
     * @param responses - Array of responses
     */
    async submitAssessment(assessmentId, responses) {
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
    async runChallenge(data) {
        return this.client.post('/challenge/run', data);
    }
    /**
     * Get challenge by ID and chain
     * @param challengeId - Challenge ID
     * @param chainId - Chain ID
     */
    async getChallenge(challengeId, chainId) {
        return this.client.get(`/challenge/get-challenge/${challengeId}/${chainId}`);
    }
    /**
     * Start challenge task
     * @param data - Task start data
     */
    async startTask(data) {
        return this.client.post('/challenge/start-task', data);
    }
    /**
     * Set challenge result
     * @param resultId - Result ID
     * @param data - Result data
     */
    async setResult(resultId, data) {
        return this.client.post(`/challenge/set-result/${resultId}`, data);
    }
    /**
     * Record video for challenge
     * @param videoFile - Video file
     * @param challengeId - Challenge ID
     * @param metadata - Additional metadata
     */
    async recordVideo(videoFile, challengeId, metadata) {
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
    async getAllProtocolChallenges() {
        return this.client.get('/protocol/challenge/all');
    }
    /**
     * Get all challenges
     */
    async getChallenges() {
        return this.client.get('/challenge');
    }
    /**
     * Create challenge
     * @param data - Challenge creation data
     */
    async createChallenge(data) {
        return this.client.post('/challenge', data);
    }
    /**
     * Update challenge
     * @param challengeId - Challenge ID
     * @param data - Challenge update data
     */
    async updateChallenge(challengeId, data) {
        return this.client.put(`/challenge/${challengeId}`, data);
    }
    /**
     * Delete challenge
     * @param challengeId - Challenge ID
     */
    async deleteChallenge(challengeId) {
        return this.client.delete(`/challenge/${challengeId}`);
    }
    /**
     * Get challenge tasks
     * @param challengeId - Challenge ID
     */
    async getChallengeTasks(challengeId) {
        return this.client.get(`/challenge/${challengeId}/tasks`);
    }
    /**
     * Get task by ID
     * @param taskId - Task ID
     */
    async getTask(taskId) {
        return this.client.get(`/challenge/task/${taskId}`);
    }
    /**
     * Complete task
     * @param taskId - Task ID
     * @param data - Completion data
     */
    async completeTask(taskId, data) {
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
    async runOrder(orderId, chainId) {
        return this.client.get(`/order/run/${orderId}/${chainId}`);
    }
    /**
     * Get all protocol orders
     */
    async getAllProtocolOrders() {
        return this.client.get('/protocol/order/all');
    }
    /**
     * Start checkout process
     * @param data - Checkout data
     */
    async startCheckout(data) {
        return this.client.post('/order/checkout', data);
    }
    /**
     * Confirm order
     * @param data - Order confirmation data
     */
    async confirmOrder(data) {
        return this.client.post('/order/confirm-order', data);
    }
    /**
     * Get orders by status (Admin only - SuperAdmin role required)
     * @param status - Order status
     */
    async getOrdersByStatus(status) {
        return this.client.get(`/orders/${status}`);
    }
    /**
     * Confirm order price (Admin only - SuperAdmin role required)
     * @param data - Price confirmation data
     */
    async confirmOrderPrice(data) {
        return this.client.post('/orders/confirm', data);
    }
    /**
     * Get order by ID
     * @param orderId - Order ID
     */
    async getOrder(orderId) {
        return this.client.get(`/order/${orderId}`);
    }
    /**
     * Get user's orders
     * @param params - Query parameters
     */
    async getUserOrders(params) {
        return this.client.get('/orders', { params });
    }
    /**
     * Cancel order
     * @param orderId - Order ID
     */
    async cancelOrder(orderId) {
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
    async getSubscriptionPayments() {
        return this.client.get('/payment/subscriptions');
    }
    /**
     * Get payment history for program purchases
     */
    async getProgramPurchases() {
        return this.client.get('/payment/program-purchases');
    }
    /**
     * Get purchased items
     */
    async getPurchasedItems() {
        return this.client.get('/payment/purchased-items');
    }
    /**
     * Setup payment method
     */
    async setupPaymentMethod() {
        return this.client.get('/payment/setup-payment-method');
    }
    /**
     * Save payment method
     * @param paymentMethodId - Payment method ID
     */
    async savePaymentMethod(paymentMethodId) {
        return this.client.post('/payment/save-payment-method', { payment_method_id: paymentMethodId });
    }
    /**
     * Get payment methods
     */
    async getPaymentMethods() {
        return this.client.get('/payment/get-payment-method');
    }
    /**
     * Delete payment method
     * @param paymentMethodId - Payment method ID
     */
    async deletePaymentMethod(paymentMethodId) {
        return this.client.delete(`/payment/delete-payment-method/${paymentMethodId}`);
    }
}
/**
 * Domain API Client
 */
export class DomainApiClient extends BaseApiClient {
    /**
     * Get domain configuration by hostname
     * @param hostname - Domain hostname
     */
    async getByHostname(hostname) {
        return this.client.get(`/domains/hostname/${hostname}`);
    }
    /**
     * Get all domains
     */
    async getAllDomains() {
        return this.client.get('/domains');
    }
    /**
     * Get domain by ID
     * @param domainId - Domain ID
     */
    async getDomain(domainId) {
        return this.client.get(`/domains/${domainId}`);
    }
    /**
     * Create domain
     * @param data - Domain creation data
     */
    async createDomain(data) {
        return this.client.post('/domains', data);
    }
    /**
     * Update domain
     * @param domainId - Domain ID
     * @param data - Domain update data
     */
    async updateDomain(domainId, data) {
        return this.client.put(`/domains/${domainId}`, data);
    }
    /**
     * Delete domain
     * @param domainId - Domain ID
     */
    async deleteDomain(domainId) {
        return this.client.delete(`/domains/${domainId}`);
    }
    /**
     * Get domain configuration
     * @param hostname - Domain hostname
     */
    async getConfiguration(hostname) {
        return this.client.get(`/domains/hostname/${hostname}/config`);
    }
    /**
     * Update domain status
     * @param domainId - Domain ID
     * @param status - New status
     */
    async updateStatus(domainId, status) {
        return this.client.patch(`/domains/${domainId}/status`, { status });
    }
}
// =================== COMBINED API CLIENT =====================
/**
 * Factory function to create a complete HMS API client
 * @param config - API client configuration
 */
export function createHmsApiClient(config) {
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
export function createGovApiClient(config) {
    const baseConfig = {
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
export function createMktApiClient(config) {
    const baseConfig = {
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
export function createMfeApiClient(config) {
    const baseConfig = {
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
//# sourceMappingURL=hms-api-client.js.map