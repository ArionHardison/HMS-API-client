"use strict";
/**
 * Individual Module Exports for Tree-Shaking Optimization
 *
 * This file allows micro-frontends to import only the specific
 * API clients they need, reducing bundle size.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMinimalClient = exports.getErrorMessage = exports.createFormErrors = exports.handleApiCall = exports.processApiError = exports.ChainStatus = exports.NudgeStatus = exports.PaymentStatus = exports.RecommendationType = exports.TimelineEventType = exports.FollowUpStatus = exports.FollowUpType = exports.EventStatus = exports.ActivityStatus = exports.ActivityType = exports.QuestionType = exports.AssessmentStatus = exports.TaskStatus = exports.ChallengeStatus = exports.ChallengeType = exports.OrderStatus = exports.PaymentApiClient = exports.StripeApiClient = exports.NotificationApiClient = exports.ChatApiClient = exports.KPIApiClient = exports.FollowUpsApiClient = exports.ActivityApiClient = exports.AssessmentsApiClient = exports.ChallengeApiClient = exports.NudgeApiClient = exports.OrderApiClient = exports.ProtocolApiClient = exports.ProgramsApiClient = exports.ItemsApiClient = exports.TeamApiClient = exports.UserApiClient = exports.AuthApiClient = void 0;
// =================== INDIVIDUAL CLIENT EXPORTS =====================
// Core clients (authentication & user management)
var hms_api_client_1 = require("../hms-api-client");
Object.defineProperty(exports, "AuthApiClient", { enumerable: true, get: function () { return hms_api_client_1.AuthApiClient; } });
var hms_api_client_2 = require("../hms-api-client");
Object.defineProperty(exports, "UserApiClient", { enumerable: true, get: function () { return hms_api_client_2.UserApiClient; } });
var hms_api_client_3 = require("../hms-api-client");
Object.defineProperty(exports, "TeamApiClient", { enumerable: true, get: function () { return hms_api_client_3.TeamApiClient; } });
// Business logic clients
var hms_api_client_4 = require("../hms-api-client");
Object.defineProperty(exports, "ItemsApiClient", { enumerable: true, get: function () { return hms_api_client_4.ItemsApiClient; } });
var hms_api_client_5 = require("../hms-api-client");
Object.defineProperty(exports, "ProgramsApiClient", { enumerable: true, get: function () { return hms_api_client_5.ProgramsApiClient; } });
var hms_api_client_6 = require("../hms-api-client");
Object.defineProperty(exports, "ProtocolApiClient", { enumerable: true, get: function () { return hms_api_client_6.ProtocolApiClient; } });
// New module clients
var hms_api_client_7 = require("../hms-api-client");
Object.defineProperty(exports, "OrderApiClient", { enumerable: true, get: function () { return hms_api_client_7.OrderApiClient; } });
var hms_api_client_8 = require("../hms-api-client");
Object.defineProperty(exports, "NudgeApiClient", { enumerable: true, get: function () { return hms_api_client_8.NudgeApiClient; } });
var hms_api_client_9 = require("../hms-api-client");
Object.defineProperty(exports, "ChallengeApiClient", { enumerable: true, get: function () { return hms_api_client_9.ChallengeApiClient; } });
var hms_api_client_10 = require("../hms-api-client");
Object.defineProperty(exports, "AssessmentsApiClient", { enumerable: true, get: function () { return hms_api_client_10.AssessmentsApiClient; } });
var hms_api_client_11 = require("../hms-api-client");
Object.defineProperty(exports, "ActivityApiClient", { enumerable: true, get: function () { return hms_api_client_11.ActivityApiClient; } });
var hms_api_client_12 = require("../hms-api-client");
Object.defineProperty(exports, "FollowUpsApiClient", { enumerable: true, get: function () { return hms_api_client_12.FollowUpsApiClient; } });
// Analytics & monitoring
var hms_api_client_13 = require("../hms-api-client");
Object.defineProperty(exports, "KPIApiClient", { enumerable: true, get: function () { return hms_api_client_13.KPIApiClient; } });
// Communication
var hms_api_client_14 = require("../hms-api-client");
Object.defineProperty(exports, "ChatApiClient", { enumerable: true, get: function () { return hms_api_client_14.ChatApiClient; } });
var hms_api_client_15 = require("../hms-api-client");
Object.defineProperty(exports, "NotificationApiClient", { enumerable: true, get: function () { return hms_api_client_15.NotificationApiClient; } });
// Payment & financial
var hms_api_client_16 = require("../hms-api-client");
Object.defineProperty(exports, "StripeApiClient", { enumerable: true, get: function () { return hms_api_client_16.StripeApiClient; } });
var hms_api_client_17 = require("../hms-api-client");
Object.defineProperty(exports, "PaymentApiClient", { enumerable: true, get: function () { return hms_api_client_17.PaymentApiClient; } });
var hms_api_client_18 = require("../hms-api-client");
Object.defineProperty(exports, "OrderStatus", { enumerable: true, get: function () { return hms_api_client_18.OrderStatus; } });
var hms_api_client_19 = require("../hms-api-client");
Object.defineProperty(exports, "ChallengeType", { enumerable: true, get: function () { return hms_api_client_19.ChallengeType; } });
Object.defineProperty(exports, "ChallengeStatus", { enumerable: true, get: function () { return hms_api_client_19.ChallengeStatus; } });
Object.defineProperty(exports, "TaskStatus", { enumerable: true, get: function () { return hms_api_client_19.TaskStatus; } });
var hms_api_client_20 = require("../hms-api-client");
Object.defineProperty(exports, "AssessmentStatus", { enumerable: true, get: function () { return hms_api_client_20.AssessmentStatus; } });
Object.defineProperty(exports, "QuestionType", { enumerable: true, get: function () { return hms_api_client_20.QuestionType; } });
var hms_api_client_21 = require("../hms-api-client");
Object.defineProperty(exports, "ActivityType", { enumerable: true, get: function () { return hms_api_client_21.ActivityType; } });
Object.defineProperty(exports, "ActivityStatus", { enumerable: true, get: function () { return hms_api_client_21.ActivityStatus; } });
Object.defineProperty(exports, "EventStatus", { enumerable: true, get: function () { return hms_api_client_21.EventStatus; } });
var hms_api_client_22 = require("../hms-api-client");
Object.defineProperty(exports, "FollowUpType", { enumerable: true, get: function () { return hms_api_client_22.FollowUpType; } });
Object.defineProperty(exports, "FollowUpStatus", { enumerable: true, get: function () { return hms_api_client_22.FollowUpStatus; } });
Object.defineProperty(exports, "TimelineEventType", { enumerable: true, get: function () { return hms_api_client_22.TimelineEventType; } });
Object.defineProperty(exports, "RecommendationType", { enumerable: true, get: function () { return hms_api_client_22.RecommendationType; } });
Object.defineProperty(exports, "PaymentStatus", { enumerable: true, get: function () { return hms_api_client_22.PaymentStatus; } });
var hms_api_client_23 = require("../hms-api-client");
Object.defineProperty(exports, "NudgeStatus", { enumerable: true, get: function () { return hms_api_client_23.NudgeStatus; } });
var hms_api_client_24 = require("../hms-api-client");
Object.defineProperty(exports, "ChainStatus", { enumerable: true, get: function () { return hms_api_client_24.ChainStatus; } });
// =================== UTILITY EXPORTS =====================
var error_handling_1 = require("../error-handling");
Object.defineProperty(exports, "processApiError", { enumerable: true, get: function () { return error_handling_1.processApiError; } });
Object.defineProperty(exports, "handleApiCall", { enumerable: true, get: function () { return error_handling_1.handleApiCall; } });
Object.defineProperty(exports, "createFormErrors", { enumerable: true, get: function () { return error_handling_1.createFormErrors; } });
Object.defineProperty(exports, "getErrorMessage", { enumerable: true, get: function () { return error_handling_1.getErrorMessage; } });
// Import client classes for the factory function
const hms_api_client_25 = require("../hms-api-client");
// =================== CONVENIENCE FACTORIES =====================
/**
 * Create a minimal client with only specified modules
 * Perfect for micro-frontends that only need specific functionality
 */
function createMinimalClient(config, modules) {
    const clients = {};
    if (modules.includes('auth')) {
        clients.auth = new hms_api_client_25.AuthApiClient(config);
    }
    if (modules.includes('user')) {
        clients.user = new hms_api_client_25.UserApiClient(config);
    }
    if (modules.includes('order')) {
        clients.order = new hms_api_client_25.OrderApiClient(config);
    }
    if (modules.includes('challenge')) {
        clients.challenge = new hms_api_client_25.ChallengeApiClient(config);
    }
    if (modules.includes('assessment')) {
        clients.assessments = new hms_api_client_25.AssessmentsApiClient(config);
    }
    if (modules.includes('activity')) {
        clients.activity = new hms_api_client_25.ActivityApiClient(config);
    }
    if (modules.includes('followup')) {
        clients.followUps = new hms_api_client_25.FollowUpsApiClient(config);
    }
    if (modules.includes('nudge')) {
        clients.nudge = new hms_api_client_25.NudgeApiClient(config);
    }
    if (modules.includes('items')) {
        clients.items = new hms_api_client_25.ItemsApiClient(config);
    }
    if (modules.includes('programs')) {
        clients.programs = new hms_api_client_25.ProgramsApiClient(config);
    }
    if (modules.includes('chat')) {
        clients.chat = new hms_api_client_25.ChatApiClient(config);
    }
    if (modules.includes('payment')) {
        clients.payment = new hms_api_client_25.PaymentApiClient(config);
    }
    return clients;
}
exports.createMinimalClient = createMinimalClient;
//# sourceMappingURL=index.js.map