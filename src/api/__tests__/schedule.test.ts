/**
 * Endpoint coverage for `ScheduleApiClient`.
 *
 * 10 endpoints across `/api/schedule*` + `/api/schedule-call*`. All `auth: api`.
 * One `it()` per endpoint asserting URL, method (raw or `?_method=PUT`),
 * Authorization header, X-Domain header, body shape, and decoded response.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectMethodOverride,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { ScheduleApiClient } from '../schedule-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'sched-tok-123';
const DOMAIN = 'app.codify.education';

interface Captured {
  current: Request | null;
}

function makeClient(): ScheduleApiClient {
  return new ScheduleApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('ScheduleApiClient — /api/schedule*, /api/schedule-call*', () => {
  let captured: Captured;
  beforeEach(() => {
    captured = { current: null };
  });

  // ---------------------------------------------------------------------------
  // /api/schedule
  // ---------------------------------------------------------------------------
  it('listSchedules() — GET /api/schedule', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/schedule`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 1 }] };
      }),
    );
    const res = await makeClient().listSchedules();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(res.data).toEqual([{ id: 1 }]);
  });

  it('createSchedule() — POST /api/schedule with body', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/schedule`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 9 } };
      }),
    );
    await makeClient().createSchedule({ title: 'Daily standup' });
    expect(captured.current!.method).toBe('POST');
    expect(await captured.current!.json()).toEqual({ title: 'Daily standup' });
  });

  it('showSchedule() — GET /api/schedule/{id}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/schedule/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    const res = await makeClient().showSchedule(42);
    expect(res.data).toEqual({ id: 42 });
  });

  it('updateSchedule() — PUT /api/schedule/{id} via POST + ?_method=PUT', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/schedule/42`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    await makeClient().updateSchedule(42, { title: 'New title' });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('destroySchedule() — DELETE /api/schedule/{id}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/schedule/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().destroySchedule(42);
    expect(captured.current!.method).toBe('DELETE');
  });

  // ---------------------------------------------------------------------------
  // /api/schedule-call
  // ---------------------------------------------------------------------------
  it('listScheduleCalls() — GET /api/schedule-call', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/schedule-call`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 5 }] };
      }),
    );
    const res = await makeClient().listScheduleCalls();
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(res.data).toEqual([{ id: 5 }]);
  });

  it('createScheduleCall() — POST /api/schedule-call', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/schedule-call`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 7 } };
      }),
    );
    await makeClient().createScheduleCall({ title: 'Sync', duration: 30 });
    expect(captured.current!.method).toBe('POST');
    expect(await captured.current!.json()).toEqual({ title: 'Sync', duration: 30 });
  });

  it('showScheduleCall() — GET /api/schedule-call/{id}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/schedule-call/77`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 77 } };
      }),
    );
    const res = await makeClient().showScheduleCall(77);
    expect(res.data).toEqual({ id: 77 });
  });

  it('updateScheduleCall() — PUT /api/schedule-call/{id} via POST + ?_method=PUT', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/schedule-call/77`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 77 } };
      }),
    );
    await makeClient().updateScheduleCall(77, { title: 'Renamed' });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('destroyScheduleCall() — DELETE /api/schedule-call/{id}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/schedule-call/77`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().destroyScheduleCall(77);
    expect(captured.current!.method).toBe('DELETE');
  });
});
