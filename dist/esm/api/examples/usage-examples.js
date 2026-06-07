/**
 * HMS API Client Usage Examples
 *
 * This file demonstrates how to use the comprehensive HMS API client
 * with all 8 modules across different environments (GOV, MKT, MFE).
 */
import { createHmsApiClient, createGovApiClient, createMktApiClient, createMfeApiClient, hmsApiClient, govApiClient, mktApiClient, mfeApiClient, OrderStatus, ActivityType } from '../hms-api-client';
import { handleApiCall, getErrorMessage } from '../error-handling';
// =================== BASIC SETUP =====================
/**
 * Example 1: Basic API Client Setup
 */
export function basicSetupExample() {
    // Use default client
    const api = hmsApiClient;
    // Or create custom client
    const customApi = createHmsApiClient({
        baseURL: 'https://my-api.example.com',
        timeout: 30000,
        enableLogging: true,
        enableRetry: true,
        maxRetries: 3
    });
    // Environment-specific clients
    const govApi = createGovApiClient({ enableLogging: true });
    const mktApi = createMktApiClient({ timeout: 20000 });
    const mfeApi = createMfeApiClient({ enableRetry: false });
    return { api, customApi, govApi, mktApi, mfeApi };
}
/**
 * Example 2: Multi-tenant Setup
 */
export function multiTenantExample() {
    const tenantApi = createHmsApiClient({
        baseURL: 'https://api.example.com',
        tenantId: 'tenant-123',
        environment: 'gov'
    });
    return tenantApi;
}
// =================== ORDER MODULE EXAMPLES =====================
/**
 * Example 3: Order Management
 */
export async function orderManagementExample() {
    const api = govApiClient; // Use GOV client for order management
    try {
        // Start checkout process
        const checkoutSession = await api.order.startCheckout({
            chainId: 123,
            items: [
                { itemId: 1, quantity: 2 },
                { itemId: 5, quantity: 1 }
            ],
            paymentMethodId: 'pm_1234567890'
        });
        console.log('Checkout session created:', checkoutSession.data.data);
        // Confirm order
        const order = await api.order.confirmOrder({
            sessionId: checkoutSession.data.data.sessionId,
            paymentMethodId: 'pm_1234567890',
            billingAddress: {
                name: 'John Doe',
                address: '123 Main St',
                city: 'Anytown',
                state: 'CA',
                zip: '12345',
                country: 'US'
            }
        });
        console.log('Order confirmed:', order.data.data);
        // Execute order in chain
        const execution = await api.order.runOrder(order.data.data.id, 123);
        console.log('Order execution started:', execution.data.data);
        // Get user's orders
        const userOrders = await api.order.getUserOrders({
            status: OrderStatus.COMPLETED,
            page: 1,
            limit: 10
        });
        console.log('User orders:', userOrders.data.data);
    }
    catch (error) {
        console.error('Order management error:', getErrorMessage(error));
    }
}
/**
 * Example 4: Admin Order Management
 */
export async function adminOrderExample() {
    const api = govApiClient;
    try {
        // Get orders by status (admin only)
        const pendingOrders = await api.order.getOrdersByStatus('pending');
        console.log('Pending orders:', pendingOrders.data.data);
        // Confirm order price (admin only)
        await api.order.confirmOrderPrice({
            order_id: 123,
            price: 2500
        });
    }
    catch (error) {
        console.error('Admin order error:', getErrorMessage(error));
    }
}
// =================== CHALLENGE MODULE EXAMPLES =====================
/**
 * Example 5: Challenge Management
 */
export async function challengeExample() {
    const api = mktApiClient; // Use MKT client for challenges
    try {
        // Get challenge details
        const challenge = await api.challenge.getChallenge(1, 123);
        console.log('Challenge details:', challenge.data.data);
        // Start a challenge task
        const task = await api.challenge.startTask({
            taskId: 456,
            parameters: { difficulty: 'medium' }
        });
        console.log('Task started:', task.data.data);
        // Record video for challenge
        const videoFile = new File(['video content'], 'challenge.mp4', { type: 'video/mp4' });
        const videoResponse = await api.challenge.recordVideo(videoFile, 1, { quality: 'high', duration: 120 });
        console.log('Video recorded:', videoResponse.data.data);
        // Set challenge result
        await api.challenge.setResult(789, {
            score: 85,
            data: { completion_time: 120 },
            notes: 'Great performance!'
        });
        // Complete task
        const completedTask = await api.challenge.completeTask(456, {
            final_score: 85,
            feedback: 'Well done!'
        });
        console.log('Task completed:', completedTask.data.data);
    }
    catch (error) {
        console.error('Challenge error:', getErrorMessage(error));
    }
}
// =================== ASSESSMENT MODULE EXAMPLES =====================
/**
 * Example 6: Assessment Flow
 */
export async function assessmentExample() {
    const api = mfeApiClient; // Use MFE client for assessments
    try {
        // Run assessment
        const assessmentStart = await api.assessments.runAssessment(1, 123);
        console.log('Assessment started:', assessmentStart.data.data);
        // Get questions for assessment
        const questions = await api.assessments.getQuestionsByAssessment(1);
        console.log('Assessment questions:', questions.data.data);
        // Store individual responses
        const responses = [];
        for (const question of questions.data.data) {
            const response = await api.assessments.storeResponse({
                assessmentId: 1,
                questionId: question.id,
                textValue: question.type === 'text' ? 'Sample answer' : undefined,
                choiceId: question.type !== 'text' ? question.choices[0]?.id : undefined
            });
            responses.push(response.data.data);
        }
        // Submit complete assessment
        const submission = await api.assessments.submitAssessment(1, responses);
        console.log('Assessment submitted:', submission.data.data);
        // Get assessment results
        const results = await api.assessments.getAssessmentResults(1);
        console.log('Assessment results:', results.data.data);
    }
    catch (error) {
        console.error('Assessment error:', getErrorMessage(error));
    }
}
// =================== ACTIVITY MODULE EXAMPLES =====================
/**
 * Example 7: Activity Booking System
 */
export async function activityBookingExample() {
    const api = hmsApiClient;
    try {
        // Search for activities
        const activities = await api.activity.getRunningActivities({
            type: ActivityType.EXERCISE,
            available: true,
            startDate: '2024-01-15',
            endDate: '2024-01-22'
        });
        console.log('Available activities:', activities.data.data);
        // Get activity providers
        const providers = await api.activity.getActivityProviders(1);
        console.log('Activity providers:', providers.data.data);
        // Check available time slots
        const timeSlots = await api.activity.getAvailableTimeSlots(1, '2024-01-15');
        console.log('Available slots:', timeSlots.data.data);
        // Make reservation
        const reservation = await api.activity.setReservation({
            activityId: 1,
            startTime: '2024-01-15T10:00:00Z',
            endTime: '2024-01-15T11:00:00Z',
            participants: 1,
            notes: 'First time visitor'
        });
        console.log('Reservation made:', reservation.data.data);
        // Confirm booking (assuming reservation returns an object with id)
        const booking = await api.activity.confirmBooking({
            reservationId: reservation.data.data.id || 1,
            paymentMethodId: 'pm_1234567890',
            confirmationRequired: true
        });
        console.log('Booking confirmed:', booking.data.data);
        // Get monthly bookings
        const monthlyEvents = await api.activity.getBookedEventsForMonth('2024-01');
        console.log('Monthly events:', monthlyEvents.data.data);
    }
    catch (error) {
        console.error('Activity booking error:', getErrorMessage(error));
    }
}
// =================== FOLLOW-UPS MODULE EXAMPLES =====================
/**
 * Example 8: Follow-up Management
 */
export async function followUpExample() {
    const api = govApiClient;
    try {
        // Run follow-up
        const followUpResult = await api.followUps.runFollowUp(123);
        console.log('Follow-up executed:', followUpResult.data.data);
        // Get timeline for chain
        const timeline = await api.followUps.getTimeline(123);
        console.log('Chain timeline:', timeline.data.data);
        // Record voice for follow-up
        const audioFile = new File(['audio content'], 'followup.mp3', { type: 'audio/mp3' });
        const voiceResponse = await api.followUps.recordVoice(audioFile, 1, { quality: 'high', transcript_required: true });
        console.log('Voice recorded:', voiceResponse.data.data);
        // Finalize voice recording
        await api.followUps.finalizeVoice({
            recordingId: voiceResponse.data.data.recordingId,
            transcript: 'User mentioned feeling better today',
            summary: 'Positive progress update'
        });
        // Get recommendations
        const recommendations = await api.followUps.getRecommendations(1);
        console.log('Follow-up recommendations:', recommendations.data.data);
        // Schedule next follow-up
        const scheduled = await api.followUps.scheduleFollowUp(2, '2024-01-20T14:00:00Z');
        console.log('Follow-up scheduled:', scheduled.data.data);
    }
    catch (error) {
        console.error('Follow-up error:', getErrorMessage(error));
    }
}
// =================== NUDGE MODULE EXAMPLES =====================
/**
 * Example 9: Nudge Management
 */
export async function nudgeExample() {
    const api = mktApiClient; // Use MKT client for nudges
    try {
        // Create nudge with image
        const imageFile = new File(['image content'], 'nudge.jpg', { type: 'image/jpeg' });
        const nudge = await api.nudge.createNudge({
            name: 'Daily Health Check',
            description: 'Reminder to log daily health metrics',
            protocolId: 123,
            chainId: 456,
            settings: {
                frequency: 'daily',
                channels: ['email', 'sms'],
                targetAudience: 'active_users',
                customMessage: 'Don\'t forget your daily check-in!'
            },
            image: imageFile
        });
        console.log('Nudge created:', nudge.data.data);
        // Activate nudge
        const activated = await api.nudge.activateNudge(nudge.data.data.id);
        console.log('Nudge activated:', activated.data.data);
        // Send test nudge
        await api.nudge.sendTestNudge(nudge.data.data.id, [
            'test@example.com',
            '+1234567890'
        ]);
        // Get nudge analytics
        const analytics = await api.nudge.getNudgeAnalytics(nudge.data.data.id);
        console.log('Nudge analytics:', analytics.data.data);
    }
    catch (error) {
        console.error('Nudge error:', getErrorMessage(error));
    }
}
/**
 * Example 10: Public Nudge Check-ins (No Authentication)
 */
export async function publicNudgeExample() {
    const api = hmsApiClient;
    try {
        // Check nudge secret (public endpoint)
        const isValid = await api.nudge.checkNudgeSecret('secret123');
        console.log('Secret valid:', isValid.data.data);
        if (isValid.data.data) {
            // Email check-in (public endpoint)
            await api.nudge.emailCheckin('user@example.com', {
                nudgeId: 1,
                response: 'Feeling great today!',
                metadata: { mood: 'positive', energy: 8 }
            });
            // SMS check-in (public endpoint)
            await api.nudge.smsCheckin('+1234567890', {
                nudgeId: 1,
                response: 'Completed workout',
                metadata: { exercise_type: 'cardio', duration: 30 }
            });
        }
    }
    catch (error) {
        console.error('Public nudge error:', getErrorMessage(error));
    }
}
// =================== ERROR HANDLING EXAMPLES =====================
/**
 * Example 11: Advanced Error Handling
 */
export async function errorHandlingExample() {
    const api = hmsApiClient;
    try {
        // Using the handleApiCall utility for consistent error handling
        const result = await handleApiCall(() => api.order.getOrder(999), // Non-existent order
        (error) => {
            console.log('Custom error handler triggered');
            if (error.isNotFoundError()) {
                console.log('Order not found - redirect to orders list');
            }
            else if (error.isValidationError()) {
                console.log('Validation errors:', error.getSimplifiedValidationErrors());
            }
            else if (error.isAuthError()) {
                console.log('Authentication failed - redirect to login');
            }
        });
        console.log('Order found:', result.data.data);
    }
    catch (error) {
        // The error is already processed by handleApiCall
        console.error('Final error:', getErrorMessage(error));
    }
}
// =================== PERFORMANCE OPTIMIZATION EXAMPLES =====================
/**
 * Example 12: Optimized Usage for MFE
 */
export async function mfeOptimizedExample() {
    // Use MFE client with optimized settings
    const api = createMfeApiClient({
        timeout: 10000, // Shorter timeout for MFE
        enableRetry: false, // Disable retry for faster failure
        enableLogging: false // Disable logging in production
    });
    try {
        // Parallel requests for better performance
        const [orders, activities, assessments] = await Promise.all([
            api.order.getUserOrders({ limit: 5 }),
            api.activity.getUserReservations(),
            api.assessments.getAssessments()
        ]);
        console.log('Dashboard data loaded:', {
            orders: orders.data.data,
            activities: activities.data.data,
            assessments: assessments.data.data
        });
    }
    catch (error) {
        console.error('MFE loading error:', getErrorMessage(error));
    }
}
// =================== REAL-TIME FEATURES EXAMPLES =====================
/**
 * Example 13: Real-time Updates with Chains
 */
export async function realTimeChainExample() {
    const api = govApiClient;
    try {
        // Get current chain timeline
        const timeline = await api.followUps.getTimeline(123);
        console.log('Initial timeline:', timeline.data.data);
        // Execute multiple chain operations
        await api.order.runOrder(1, 123);
        await api.challenge.runChallenge({ challengeId: 1, chainId: 123 });
        await api.assessments.runAssessment(1, 123);
        // Get updated timeline
        const updatedTimeline = await api.followUps.getTimeline(123);
        console.log('Updated timeline:', updatedTimeline.data.data);
    }
    catch (error) {
        console.error('Real-time chain error:', getErrorMessage(error));
    }
}
// =================== USAGE SUMMARY =====================
/**
 * Complete workflow example combining multiple modules
 */
export async function completeWorkflowExample() {
    const api = govApiClient;
    try {
        console.log('Starting complete workflow...');
        // 1. Start with an assessment
        await api.assessments.runAssessment(1, 123);
        // 2. Complete a challenge based on assessment
        await api.challenge.runChallenge({ challengeId: 1, chainId: 123 });
        // 3. Book an activity
        const reservation = await api.activity.setReservation({
            activityId: 1,
            startTime: '2024-01-15T10:00:00Z',
            endTime: '2024-01-15T11:00:00Z',
            participants: 1
        });
        // 4. Place an order for related items
        const order = await api.order.startCheckout({
            chainId: 123,
            items: [{ itemId: 1, quantity: 1 }]
        });
        // 5. Schedule follow-up
        await api.followUps.scheduleFollowUp(1, '2024-01-22T14:00:00Z');
        // 6. Create reminder nudge
        await api.nudge.createNudge({
            name: 'Activity Reminder',
            description: 'Reminder for upcoming activity',
            protocolId: 123,
            chainId: 123,
            settings: {
                frequency: 'once',
                channels: ['email']
            }
        });
        console.log('Complete workflow finished successfully!');
    }
    catch (error) {
        console.error('Workflow error:', getErrorMessage(error));
    }
}
// Export all examples for easy testing
export const examples = {
    basicSetupExample,
    multiTenantExample,
    orderManagementExample,
    adminOrderExample,
    challengeExample,
    assessmentExample,
    activityBookingExample,
    followUpExample,
    nudgeExample,
    publicNudgeExample,
    errorHandlingExample,
    mfeOptimizedExample,
    realTimeChainExample,
    completeWorkflowExample
};
//# sourceMappingURL=usage-examples.js.map