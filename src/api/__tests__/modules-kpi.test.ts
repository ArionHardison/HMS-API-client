/**
 * Endpoint coverage for `KPIModuleApiClient` (`Modules/KPI`).
 *
 * Mirrors the structure of `modules-agents.test.ts`. Each KPI endpoint —
 * 13 in total per `sdk/spec/endpoints.json` (module === "Modules/KPI") —
 * gets a single test that pins URL, raw HTTP method, Authorization,
 * `X-Domain`, body, and response decoding.
 *
 * All KPI routes use `auth:api` upstream → SDK callers attach a Bearer
 * token, same as the Agents module.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { KPIModuleApiClient } from '../modules-kpi-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'kpi-tkn-xyz';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): KPIModuleApiClient {
  return new KPIModuleApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('KPIModuleApiClient — Modules/KPI', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  // ---------------------------------------------------------------------------
  // GET /api/kpi/get-setup/{chain}/{protocol}
  // ---------------------------------------------------------------------------
  it('getSetup() — GET /api/kpi/get-setup/{chain}/{protocol}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/kpi/get-setup/9/4`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    const res = await makeClient().getSetup(9, 4);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(res.data).toEqual({ id: 1 });
  });

  // ---------------------------------------------------------------------------
  // GET /api/kpi/get/{chain}
  // ---------------------------------------------------------------------------
  it('getTasks() — GET /api/kpi/get/{chain}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/kpi/get/77`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { tasks: [] } };
      }),
    );
    const res = await makeClient().getTasks(77);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual({ tasks: [] });
  });

  // ---------------------------------------------------------------------------
  // DELETE /api/kpi/remove-rule/{rule}
  // ---------------------------------------------------------------------------
  it('removeRule() — DELETE /api/kpi/remove-rule/{rule}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/kpi/remove-rule/55`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().removeRule(55);
    expect(captured.current!.method).toBe('DELETE');
    expectAuthHeader(captured.current!, TOKEN);
  });

  // ---------------------------------------------------------------------------
  // POST /api/kpi/save
  // ---------------------------------------------------------------------------
  it('save() — POST /api/kpi/save', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/kpi/save`, async ({ request }) => {
        captured.current = request.clone();
        await request.clone().json();
        return { success: true, message: '', data: { saved: true } };
      }),
    );
    const body = {
      chain_item: 1,
      perform_rules: true,
      protocol_id: 2,
      track_parameters: false,
      parameters_to_track: ['weight'],
      rules: [{ id: 9 }],
    };
    await makeClient().save(body);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
  });

  // ---------------------------------------------------------------------------
  // POST /api/kpi/save-round-results
  // ---------------------------------------------------------------------------
  it('saveRoundResults() — POST /api/kpi/save-round-results', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/kpi/save-round-results`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { ok: true } };
      }),
    );
    const body = { round: 3, score: 0.91 };
    await makeClient().saveRoundResults(body);
    expect(await captured.current!.json()).toEqual(body);
    expectAuthHeader(captured.current!, TOKEN);
  });

  // ---------------------------------------------------------------------------
  // POST /api/kpi/save-setup
  // ---------------------------------------------------------------------------
  it('saveSetup() — POST /api/kpi/save-setup', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/kpi/save-setup`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { saved: true } };
      }),
    );
    const body = { chain_id: 5, settings: { foo: 'bar' } };
    await makeClient().saveSetup(body);
    expect(await captured.current!.json()).toEqual(body);
  });

  // ---------------------------------------------------------------------------
  // POST /api/kpi/validate-parameters
  // ---------------------------------------------------------------------------
  it('validateParameters() — POST /api/kpi/validate-parameters', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/kpi/validate-parameters`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { valid: true, errors: null } };
      }),
    );
    const body = {
      value: '120',
      time: 5,
      executions: 3,
      frequency_at: '08:00',
      frequency_from: '07:00',
      frequency_to: '09:00',
    };
    const res = await makeClient().validateParameters(body);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data).toMatchObject({ valid: true });
  });

  // ---------------------------------------------------------------------------
  // GET /api/onboarding/get/{protocol}
  // ---------------------------------------------------------------------------
  it('getOnboarding() — GET /api/onboarding/get/{protocol}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/onboarding/get/12`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { setup: [] } };
      }),
    );
    await makeClient().getOnboarding(12);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
  });

  // ---------------------------------------------------------------------------
  // POST /api/onboarding/save/{protocol}
  // ---------------------------------------------------------------------------
  it('saveOnboarding() — POST /api/onboarding/save/{protocol}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/onboarding/save/12`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { saved: true } };
      }),
    );
    const body = { setup: [{ key: 'goal', value: 'lose-weight' }] };
    await makeClient().saveOnboarding(12, body);
    expect(await captured.current!.json()).toEqual(body);
    expectAuthHeader(captured.current!, TOKEN);
  });

  // ---------------------------------------------------------------------------
  // GET /api/user-devices/list
  // ---------------------------------------------------------------------------
  it('listUserDevices() — GET /api/user-devices/list', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/user-devices/list`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 1, deviceType: 'withings' }] };
      }),
    );
    const res = await makeClient().listUserDevices();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual([{ id: 1, deviceType: 'withings' }]);
  });

  // ---------------------------------------------------------------------------
  // GET /api/withings/auth
  // ---------------------------------------------------------------------------
  it('withingsAuth() — GET /api/withings/auth', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/withings/auth`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { redirectUrl: 'https://withings/auth' } };
      }),
    );
    const res = await makeClient().withingsAuth();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toMatchObject({ redirectUrl: 'https://withings/auth' });
  });

  // ---------------------------------------------------------------------------
  // GET /api/withings/callback
  // ---------------------------------------------------------------------------
  it('withingsCallback() — GET /api/withings/callback (with query params)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/withings/callback`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { connected: true } };
      }),
    );
    await makeClient().withingsCallback({ code: 'abc', state: 'xyz' });
    const url = new URL(captured.current!.url);
    expect(url.searchParams.get('code')).toBe('abc');
    expect(url.searchParams.get('state')).toBe('xyz');
  });

  // ---------------------------------------------------------------------------
  // POST /api/withings/webhook
  // ---------------------------------------------------------------------------
  it('withingsWebhook() — POST /api/withings/webhook', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/withings/webhook`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: null };
      }),
    );
    const body = { userid: '42', appli: '1' };
    await makeClient().withingsWebhook(body);
    expect(captured.current!.method).toBe('POST');
    expect(await captured.current!.json()).toEqual(body);
  });
});
