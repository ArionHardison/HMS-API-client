/**
 * ScheduleApiClient — covers `/api/schedule*` and `/api/schedule-call*` (10
 * endpoints). All endpoints are `auth: api`, tenant-scoped, and follow
 * Laravel's standard `Route::resource` shape.
 *
 * Source of truth: `sdk/spec/endpoints.json`. PUT endpoints are translated
 * to POST + `?_method=PUT` automatically by `BaseApiClient`.
 */
import { BaseApiClient, type ApiResponse } from '../api-client';
import type { CreateScheduleCallRequest, CreateScheduleRequest, ScheduleCallRecord, ScheduleRecord, UpdateScheduleCallRequest, UpdateScheduleRequest } from '../types/schedule';
export type { CreateScheduleCallRequest, CreateScheduleRequest, ScheduleCallRecord, ScheduleRecord, UpdateScheduleCallRequest, UpdateScheduleRequest, };
/** `wrapper: "data"` empty-shape acknowledgement payload. */
export interface EmptyOk {
    [key: string]: unknown;
}
export declare class ScheduleApiClient extends BaseApiClient {
    /** GET /api/schedule */
    listSchedules(): Promise<ApiResponse<ScheduleRecord[]>>;
    /** POST /api/schedule */
    createSchedule(body: CreateScheduleRequest): Promise<ApiResponse<ScheduleRecord>>;
    /** GET /api/schedule/{schedule} */
    showSchedule(schedule: number | string): Promise<ApiResponse<ScheduleRecord>>;
    /** PUT /api/schedule/{schedule} — POST + `?_method=PUT`. */
    updateSchedule(schedule: number | string, body: UpdateScheduleRequest): Promise<ApiResponse<ScheduleRecord>>;
    /** DELETE /api/schedule/{schedule} */
    destroySchedule(schedule: number | string): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/schedule-call */
    listScheduleCalls(): Promise<ApiResponse<ScheduleCallRecord[]>>;
    /** POST /api/schedule-call */
    createScheduleCall(body: CreateScheduleCallRequest): Promise<ApiResponse<ScheduleCallRecord>>;
    /** GET /api/schedule-call/{schedule_call} */
    showScheduleCall(scheduleCall: number | string): Promise<ApiResponse<ScheduleCallRecord>>;
    /** PUT /api/schedule-call/{schedule_call} — POST + `?_method=PUT`. */
    updateScheduleCall(scheduleCall: number | string, body: UpdateScheduleCallRequest): Promise<ApiResponse<ScheduleCallRecord>>;
    /** DELETE /api/schedule-call/{schedule_call} */
    destroyScheduleCall(scheduleCall: number | string): Promise<ApiResponse<EmptyOk>>;
}
//# sourceMappingURL=schedule-api-client.d.ts.map