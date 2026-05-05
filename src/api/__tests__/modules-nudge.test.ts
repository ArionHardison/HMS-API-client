/**
 * Endpoint coverage for `NudgeModuleApiClient` (`Modules/Nudge`).
 *
 * Spec source: `sdk/spec/endpoints.json` — module === "Modules/Nudge". 10
 * endpoints split across two auth tiers:
 *
 *   - `auth:api` (Bearer): index, store, show, update, destroy, image-delete,
 *     protocol/all listing.
 *   - `auth:public` (no Authorization): nudge-checkin/email + /sms (inbound
 *     webhook receivers from Mailgun / Twilio), `nudge/check/{secret}`
 *     (one-time secret-link confirmation flow). Callers must pass
 *     `{ auth: false }` per call to skip the Authorization header.
 *
 * Note: there is a deliberate naming collision with `NudgeApiClient` in
 * `hms-api-client.ts` (legacy axios-based class). The new client is named
 * `NudgeModuleApiClient` to coexist with the legacy one.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectMethodOverride,
  expectNoAuthHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { NudgeModuleApiClient } from '../modules-nudge-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'nudge-tkn-xyz';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): NudgeModuleApiClient {
  return new NudgeModuleApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('NudgeModuleApiClient — Modules/Nudge', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  // ---------------------------------------------------------------------------
  // GET /api/nudge — nudge.index
  // ---------------------------------------------------------------------------
  it('list() — GET /api/nudge', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/nudge`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().list();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
  });

  // ---------------------------------------------------------------------------
  // POST /api/nudge — nudge.store
  // ---------------------------------------------------------------------------
  it('create() — POST /api/nudge', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/nudge`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 7 } };
      }),
    );
    const body = {
      is_sms: false,
      title: 'Welcome',
      email_template: 'Hello there!',
    };
    await makeClient().create(body);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
  });

  // ---------------------------------------------------------------------------
  // POST /api/nudge-checkin/email — public Mailgun receiver
  // ---------------------------------------------------------------------------
  it('checkinEmail() — POST /api/nudge-checkin/email (public)', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/nudge-checkin/email`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { processed: true } };
        },
      ),
    );
    const body = {
      References: '<m1@mg>',
      sender: 'user@example.com',
      timestamp: 1730000000,
      token: 'tok',
      signature: 'sig',
      'stripped-text': 'yes',
    };
    await makeClient().checkinEmail(body, { auth: false });
    expect(captured.current!.method).toBe('POST');
    expectNoAuthHeader(captured.current!);
    expect(await captured.current!.json()).toEqual(body);
  });

  // ---------------------------------------------------------------------------
  // POST /api/nudge-checkin/sms — public Twilio receiver
  // ---------------------------------------------------------------------------
  it('checkinSms() — POST /api/nudge-checkin/sms (public)', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/nudge-checkin/sms`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { processed: true } };
        },
      ),
    );
    const body = { From: '+15555550100', Body: 'YES' };
    await makeClient().checkinSms(body, { auth: false });
    expect(captured.current!.method).toBe('POST');
    expectNoAuthHeader(captured.current!);
    expect(await captured.current!.json()).toEqual(body);
  });

  // ---------------------------------------------------------------------------
  // GET /api/nudge/check/{secret} — public one-time link confirmation
  // ---------------------------------------------------------------------------
  it('checkSecret() — GET /api/nudge/check/{secret} (public)', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/nudge/check/abcd1234`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { ok: true } };
        },
      ),
    );
    await makeClient().checkSecret('abcd1234', { auth: false });
    expect(captured.current!.method).toBe('GET');
    expectNoAuthHeader(captured.current!);
  });

  // ---------------------------------------------------------------------------
  // DELETE /api/nudge/image/{nudge} — delete.api.nudge.image.item
  // ---------------------------------------------------------------------------
  it('deleteImage() — DELETE /api/nudge/image/{nudge}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/nudge/image/77`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().deleteImage(77);
    expect(captured.current!.method).toBe('DELETE');
    expectAuthHeader(captured.current!, TOKEN);
  });

  // ---------------------------------------------------------------------------
  // GET /api/nudge/{nudge} — nudge.show
  // ---------------------------------------------------------------------------
  it('show() — GET /api/nudge/{nudge}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/nudge/77`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 77 } };
      }),
    );
    const res = await makeClient().show(77);
    expect(captured.current!.method).toBe('GET');
    expect(res.data).toEqual({ id: 77 });
  });

  // ---------------------------------------------------------------------------
  // PUT /api/nudge/{nudge} — nudge.update (POST + ?_method=PUT)
  // ---------------------------------------------------------------------------
  it('update() — PUT /api/nudge/{nudge}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/nudge/77`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 77 } };
      }),
    );
    const body = { title: 'Renamed', email_template: 'longer body content here' };
    await makeClient().update(77, body);
    expectMethodOverride(captured.current!, 'PUT');
    expect(await captured.current!.json()).toEqual(body);
  });

  // ---------------------------------------------------------------------------
  // DELETE /api/nudge/{nudge} — nudge.destroy
  // ---------------------------------------------------------------------------
  it('destroy() — DELETE /api/nudge/{nudge}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/nudge/77`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().destroy(77);
    expect(captured.current!.method).toBe('DELETE');
    expectAuthHeader(captured.current!, TOKEN);
  });

  // ---------------------------------------------------------------------------
  // GET /api/protocol/nudge/all — get.api.protocol.nudge.all
  // ---------------------------------------------------------------------------
  it('listProtocolNudges() — GET /api/protocol/nudge/all', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/protocol/nudge/all`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().listProtocolNudges();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
  });
});
