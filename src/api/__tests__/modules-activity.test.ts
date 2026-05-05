/**
 * Endpoint coverage for `ActivityModuleApiClient` (`Modules/Activity`).
 *
 * Same recipe as `modules-agents.test.ts`:
 *   1. Register an MSW handler that captures the inbound `Request`.
 *   2. Drive the SDK method.
 *   3. Assert URL, raw HTTP method (POST + `?_method=` for PUT/PATCH),
 *      `Authorization: Bearer …` (all endpoints are `auth: api`),
 *      `X-Domain` propagation, body, and response decoding.
 *
 * Spec source: `sdk/spec/endpoints.json` — module === "Modules/Activity".
 * 31 endpoints; one `it()` per endpoint plus one cross-cutting string-id
 * round-trip case.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectMethodOverride,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { ActivityModuleApiClient } from '../modules-activity-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'activity-tkn-xyz';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): ActivityModuleApiClient {
  return new ActivityModuleApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('ActivityModuleApiClient — Modules/Activity', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  // ---------------------------------------------------------------------------
  // activity-location resource (5)
  // ---------------------------------------------------------------------------
  it('listLocations() — GET /api/activity-location', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/activity-location`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 1 }] };
      }),
    );
    const res = await makeClient().listLocations();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(res.data).toEqual([{ id: 1 }]);
  });

  it('createLocation() — POST /api/activity-location with body', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/activity-location`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 9 } };
      }),
    );
    const body = { name: 'Main', address: '1 St' };
    await makeClient().createLocation(body);
    expect(captured.current!.method).toBe('POST');
    expect(await captured.current!.json()).toEqual(body);
  });

  it('showLocation() — GET /api/activity-location/{activity_location}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/activity-location/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    const res = await makeClient().showLocation(42);
    expect(captured.current!.method).toBe('GET');
    expect(res.data).toEqual({ id: 42 });
  });

  it('updateLocation() — PUT /api/activity-location/{activity_location} via POST + ?_method=PUT', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/activity-location/42`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    await makeClient().updateLocation(42, { name: 'Renamed' });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('destroyLocation() — DELETE /api/activity-location/{activity_location}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/activity-location/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().destroyLocation(42);
    expect(captured.current!.method).toBe('DELETE');
  });

  // ---------------------------------------------------------------------------
  // activity execution surface (13)
  // ---------------------------------------------------------------------------
  it('bookedEventsDay() — GET /api/activity/booked-events-day/{date}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/activity/booked-events-day/2026-05-05`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { date: '2026-05-05', events: [] } };
      }),
    );
    const res = await makeClient().bookedEventsDay('2026-05-05');
    expect(captured.current!.method).toBe('GET');
    expect(res.data).toMatchObject({ date: '2026-05-05' });
  });

  it('bookedEventsMonth() — GET /api/activity/booked-events-month/{date}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/activity/booked-events-month/2026-05`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { date: '2026-05', events: [] } };
      }),
    );
    await makeClient().bookedEventsMonth('2026-05');
    expect(captured.current!.method).toBe('GET');
  });

  it('confirmBooking() — POST /api/activity/confirm-booking with body', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/activity/confirm-booking`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    const body = { booking_id: 7 };
    await makeClient().confirmBooking(body);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('expertFinish() — GET /api/activity/expert-finish/{booking}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/activity/expert-finish/77`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { booking_id: 77 } };
      }),
    );
    await makeClient().expertFinish(77);
    expect(captured.current!.method).toBe('GET');
  });

  it('failedService() — GET /api/activity/failed-service/{booking}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/activity/failed-service/77`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { booking_id: 77 } };
      }),
    );
    await makeClient().failedService(77);
    expect(captured.current!.method).toBe('GET');
  });

  it('getBookingWindows() — GET /api/activity/get-booking-windows/{location}/{service} (no week)', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/activity/get-booking-windows/3/5`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().getBookingWindows(3, 5);
    expect(captured.current!.method).toBe('GET');
  });

  it('getBookingWindows() — GET /api/activity/get-booking-windows/{location}/{service}/{week}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/activity/get-booking-windows/3/5/24`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().getBookingWindows(3, 5, 24);
    expect(captured.current!.method).toBe('GET');
  });

  it('getPendingAmount() — GET /api/activity/get-pending-amount', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/activity/get-pending-amount`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { amount: 12.5 } };
      }),
    );
    const res = await makeClient().getPendingAmount();
    expect(res.data).toMatchObject({ amount: 12.5 });
  });

  it('getProviders() — GET /api/activity/get-providers/{activity}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/activity/get-providers/9`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 1 }] };
      }),
    );
    await makeClient().getProviders(9);
    expect(captured.current!.method).toBe('GET');
  });

  it('handleEvent() — POST /api/activity/handle-event', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/activity/handle-event`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: null };
      }),
    );
    const body = { event: 'started', payload: { id: 1 } };
    await makeClient().handleEvent(body);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('resetReservation() — POST /api/activity/reset-reservation', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/activity/reset-reservation`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: null };
      }),
    );
    const body = { reservation_id: 7 };
    await makeClient().resetReservation(body);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('runningActivity() — POST /api/activity/running', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/activity/running`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: null };
      }),
    );
    const body = { booking_id: 22 };
    await makeClient().runningActivity(body);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('setReservation() — POST /api/activity/set-reservation', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/activity/set-reservation`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: null };
      }),
    );
    const body = { service_id: 1, location_id: 2, starts_at: '2026-05-05T10:00:00Z' };
    await makeClient().setReservation(body);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('userFinish() — GET /api/activity/user-finish/{booking}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/activity/user-finish/77`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { booking_id: 77 } };
      }),
    );
    await makeClient().userFinish(77);
    expect(captured.current!.method).toBe('GET');
  });

  // ---------------------------------------------------------------------------
  // creator-activity resource (5)
  // ---------------------------------------------------------------------------
  it('listCreatorActivities() — GET /api/creator-activity', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/creator-activity`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().listCreatorActivities();
    expect(captured.current!.method).toBe('GET');
  });

  it('createCreatorActivity() — POST /api/creator-activity', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/creator-activity`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    const body = { name: 'Run', type: 'cardio' };
    await makeClient().createCreatorActivity(body);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('showCreatorActivity() — GET /api/creator-activity/{creator_activity}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/creator-activity/3`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 3 } };
      }),
    );
    await makeClient().showCreatorActivity(3);
    expect(captured.current!.method).toBe('GET');
  });

  it('updateCreatorActivity() — PUT /api/creator-activity/{creator_activity}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/creator-activity/3`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 3 } };
      }),
    );
    await makeClient().updateCreatorActivity(3, { name: 'Walk' });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('destroyCreatorActivity() — DELETE /api/creator-activity/{creator_activity}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/creator-activity/3`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().destroyCreatorActivity(3);
    expect(captured.current!.method).toBe('DELETE');
  });

  // ---------------------------------------------------------------------------
  // protocol integration (1)
  // ---------------------------------------------------------------------------
  it('listProtocolActivities() — GET /api/protocol/activity/all', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/protocol/activity/all`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().listProtocolActivities();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
  });

  // ---------------------------------------------------------------------------
  // service-location surface (7)
  // ---------------------------------------------------------------------------
  it('createServiceLocation() — POST /api/service-location/create', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/service-location/create`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    const body = { service_id: 5, location_id: 6 };
    await makeClient().createServiceLocation(body);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('findServiceLocation() — POST /api/service-location/find', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/service-location/find`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: [] };
      }),
    );
    const body = { service_id: 5 };
    await makeClient().findServiceLocation(body);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('serviceLocationByLocation() — GET /api/service-location/location/{location}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/service-location/location/4`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().serviceLocationByLocation(4);
    expect(captured.current!.method).toBe('GET');
  });

  it('serviceLocationByService() — GET /api/service-location/service/{service}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/service-location/service/4`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().serviceLocationByService(4);
    expect(captured.current!.method).toBe('GET');
  });

  it('destroyServiceLocationByService() — DELETE /api/service-location/service/{service}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/service-location/service/4`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().destroyServiceLocationByService(4);
    expect(captured.current!.method).toBe('DELETE');
  });

  it('updateServiceLocation() — PUT /api/service-location/update/{service}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/service-location/update/4`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 4 } };
      }),
    );
    await makeClient().updateServiceLocation(4, { location_id: 9 });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('showServiceLocation() — GET /api/service-location/{location}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/service-location/4`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 4 } };
      }),
    );
    await makeClient().showServiceLocation(4);
    expect(captured.current!.method).toBe('GET');
  });

  // ---------------------------------------------------------------------------
  // Cross-cutting: string IDs round-trip on path params.
  // ---------------------------------------------------------------------------
  it('showLocation() — accepts string IDs (route binding is string|number)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/activity-location/loc-slug`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    await makeClient().showLocation('loc-slug');
    expect(new URL(captured.current!.url).pathname).toBe('/api/activity-location/loc-slug');
  });
});
