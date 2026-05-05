/**
 * ScheduleApiClient — covers `/api/schedule*` and `/api/schedule-call*` (10
 * endpoints). All endpoints are `auth: api`, tenant-scoped, and follow
 * Laravel's standard `Route::resource` shape.
 *
 * Source of truth: `sdk/spec/endpoints.json`. PUT endpoints are translated
 * to POST + `?_method=PUT` automatically by `BaseApiClient`.
 */

import { BaseApiClient, type ApiResponse } from '../api-client';
import type {
  CreateScheduleCallRequest,
  CreateScheduleRequest,
  ScheduleCallRecord,
  ScheduleRecord,
  UpdateScheduleCallRequest,
  UpdateScheduleRequest,
} from '../types/schedule';

export type {
  CreateScheduleCallRequest,
  CreateScheduleRequest,
  ScheduleCallRecord,
  ScheduleRecord,
  UpdateScheduleCallRequest,
  UpdateScheduleRequest,
};

/** `wrapper: "data"` empty-shape acknowledgement payload. */
export interface EmptyOk {
  [key: string]: unknown;
}

export class ScheduleApiClient extends BaseApiClient {
  // ---------------------------------------------------------------------------
  // /api/schedule  (resource — index, store, show, update, destroy)
  // ---------------------------------------------------------------------------

  /** GET /api/schedule */
  async listSchedules(): Promise<ApiResponse<ScheduleRecord[]>> {
    return this.get<ScheduleRecord[]>('/api/schedule');
  }

  /** POST /api/schedule */
  async createSchedule(
    body: CreateScheduleRequest,
  ): Promise<ApiResponse<ScheduleRecord>> {
    return this.post<ScheduleRecord>('/api/schedule', body);
  }

  /** GET /api/schedule/{schedule} */
  async showSchedule(
    schedule: number | string,
  ): Promise<ApiResponse<ScheduleRecord>> {
    return this.get<ScheduleRecord>(
      `/api/schedule/${encodeURIComponent(String(schedule))}`,
    );
  }

  /** PUT /api/schedule/{schedule} — POST + `?_method=PUT`. */
  async updateSchedule(
    schedule: number | string,
    body: UpdateScheduleRequest,
  ): Promise<ApiResponse<ScheduleRecord>> {
    return this.put<ScheduleRecord>(
      `/api/schedule/${encodeURIComponent(String(schedule))}`,
      body,
    );
  }

  /** DELETE /api/schedule/{schedule} */
  async destroySchedule(
    schedule: number | string,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.delete<EmptyOk>(
      `/api/schedule/${encodeURIComponent(String(schedule))}`,
    );
  }

  // ---------------------------------------------------------------------------
  // /api/schedule-call  (resource — index, store, show, update, destroy)
  // ---------------------------------------------------------------------------

  /** GET /api/schedule-call */
  async listScheduleCalls(): Promise<ApiResponse<ScheduleCallRecord[]>> {
    return this.get<ScheduleCallRecord[]>('/api/schedule-call');
  }

  /** POST /api/schedule-call */
  async createScheduleCall(
    body: CreateScheduleCallRequest,
  ): Promise<ApiResponse<ScheduleCallRecord>> {
    return this.post<ScheduleCallRecord>('/api/schedule-call', body);
  }

  /** GET /api/schedule-call/{schedule_call} */
  async showScheduleCall(
    scheduleCall: number | string,
  ): Promise<ApiResponse<ScheduleCallRecord>> {
    return this.get<ScheduleCallRecord>(
      `/api/schedule-call/${encodeURIComponent(String(scheduleCall))}`,
    );
  }

  /** PUT /api/schedule-call/{schedule_call} — POST + `?_method=PUT`. */
  async updateScheduleCall(
    scheduleCall: number | string,
    body: UpdateScheduleCallRequest,
  ): Promise<ApiResponse<ScheduleCallRecord>> {
    return this.put<ScheduleCallRecord>(
      `/api/schedule-call/${encodeURIComponent(String(scheduleCall))}`,
      body,
    );
  }

  /** DELETE /api/schedule-call/{schedule_call} */
  async destroyScheduleCall(
    scheduleCall: number | string,
  ): Promise<ApiResponse<EmptyOk>> {
    return this.delete<EmptyOk>(
      `/api/schedule-call/${encodeURIComponent(String(scheduleCall))}`,
    );
  }
}
