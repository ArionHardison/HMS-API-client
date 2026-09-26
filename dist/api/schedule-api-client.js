"use strict";
/**
 * ScheduleApiClient — covers `/api/schedule*` and `/api/schedule-call*` (10
 * endpoints). All endpoints are `auth: api`, tenant-scoped, and follow
 * Laravel's standard `Route::resource` shape.
 *
 * Source of truth: `sdk/spec/endpoints.json`. PUT endpoints are translated
 * to POST + `?_method=PUT` automatically by `BaseApiClient`.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleApiClient = void 0;
const api_client_1 = require("../api-client");
class ScheduleApiClient extends api_client_1.BaseApiClient {
    // ---------------------------------------------------------------------------
    // /api/schedule  (resource — index, store, show, update, destroy)
    // ---------------------------------------------------------------------------
    /** GET /api/schedule */
    async listSchedules() {
        return this.get('/api/schedule');
    }
    /** POST /api/schedule */
    async createSchedule(body) {
        return this.post('/api/schedule', body);
    }
    /** GET /api/schedule/{schedule} */
    async showSchedule(schedule) {
        return this.get(`/api/schedule/${encodeURIComponent(String(schedule))}`);
    }
    /** PUT /api/schedule/{schedule} — POST + `?_method=PUT`. */
    async updateSchedule(schedule, body) {
        return this.put(`/api/schedule/${encodeURIComponent(String(schedule))}`, body);
    }
    /** DELETE /api/schedule/{schedule} */
    async destroySchedule(schedule) {
        return this.delete(`/api/schedule/${encodeURIComponent(String(schedule))}`);
    }
    // ---------------------------------------------------------------------------
    // /api/schedule-call  (resource — index, store, show, update, destroy)
    // ---------------------------------------------------------------------------
    /** GET /api/schedule-call */
    async listScheduleCalls() {
        return this.get('/api/schedule-call');
    }
    /** POST /api/schedule-call */
    async createScheduleCall(body) {
        return this.post('/api/schedule-call', body);
    }
    /** GET /api/schedule-call/{schedule_call} */
    async showScheduleCall(scheduleCall) {
        return this.get(`/api/schedule-call/${encodeURIComponent(String(scheduleCall))}`);
    }
    /** PUT /api/schedule-call/{schedule_call} — POST + `?_method=PUT`. */
    async updateScheduleCall(scheduleCall, body) {
        return this.put(`/api/schedule-call/${encodeURIComponent(String(scheduleCall))}`, body);
    }
    /** DELETE /api/schedule-call/{schedule_call} */
    async destroyScheduleCall(scheduleCall) {
        return this.delete(`/api/schedule-call/${encodeURIComponent(String(scheduleCall))}`);
    }
}
exports.ScheduleApiClient = ScheduleApiClient;
//# sourceMappingURL=schedule-api-client.js.map