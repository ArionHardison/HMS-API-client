/**
 * Endpoint coverage for `IntakeModuleApiClient` (`Modules/Intake`).
 *
 * Backend routes live in `api/Modules/Intake/Routes/api.php`. 8
 * endpoints — 2 public (`start`, `exchange`) and 6 authenticated
 * (`voice-record`, `voice-finalize`, `answers`, `audience`, `handoff`,
 * `status`).
 *
 * Tests assert the same contract used by every per-module suite:
 * URL + method on the wire, Bearer header presence per auth model,
 * `X-Domain` always present, body shape pass-through, response
 * decoding from the `{ data }` envelope.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectNoAuthHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { IntakeModuleApiClient } from '../modules-intake-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'intake-tkn-abc';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): IntakeModuleApiClient {
  return new IntakeModuleApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('IntakeModuleApiClient — Modules/Intake', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  // ---------------------------------------------------------------------------
  // POST /api/v1/intake/start — public, returns guest bearer
  // ---------------------------------------------------------------------------
  it('start() — POST /api/v1/intake/start (public, no Bearer)', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/v1/intake/start`,
        async ({ request }) => {
          captured.current = request.clone();
          return {
            success: true,
            message: '',
            data: { token: 'guest-tkn', intake_id: 42 },
          };
        },
      ),
    );
    const res = await makeClient().start({ source: 'web' });
    expect(captured.current!.method).toBe('POST');
    expectNoAuthHeader(captured.current!);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(await captured.current!.json()).toEqual({ source: 'web' });
    expect(res.data.token).toBe('guest-tkn');
    expect(res.data.intake_id).toBe(42);
  });

  // ---------------------------------------------------------------------------
  // POST /api/v1/intake/handoff/{token}/exchange — public
  // ---------------------------------------------------------------------------
  it('exchange() — POST /api/v1/intake/handoff/{token}/exchange (public)', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/v1/intake/handoff/hand-xyz/exchange`,
        async ({ request }) => {
          captured.current = request.clone();
          return {
            success: true,
            message: '',
            data: { token: 'user-bearer', complete: true },
          };
        },
      ),
    );
    const res = await makeClient().exchange('hand-xyz');
    expect(captured.current!.method).toBe('POST');
    expectNoAuthHeader(captured.current!);
    expect(res.data.token).toBe('user-bearer');
    expect(res.data.complete).toBe(true);
  });

  // ---------------------------------------------------------------------------
  // POST /api/v1/intake/{intake}/voice-record — auth required
  // ---------------------------------------------------------------------------
  it('voiceRecord() — POST /api/v1/intake/{intake}/voice-record (Bearer required)', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/v1/intake/42/voice-record`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { chunk_id: 'c-1' } };
        },
      ),
    );
    const res = await makeClient().voiceRecord(42, { chunk: 'data', index: 0 });
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(res.data.chunk_id).toBe('c-1');
  });

  // ---------------------------------------------------------------------------
  // POST /api/v1/intake/{intake}/voice-finalize — auth required
  // ---------------------------------------------------------------------------
  it('voiceFinalize() — POST /api/v1/intake/{intake}/voice-finalize (Bearer)', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/v1/intake/42/voice-finalize`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { transcript: 'hello' } };
        },
      ),
    );
    const res = await makeClient().voiceFinalize(42);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data.transcript).toBe('hello');
  });

  // ---------------------------------------------------------------------------
  // POST /api/v1/intake/{intake}/answers — auth required
  // ---------------------------------------------------------------------------
  it('submitAnswers() — POST /api/v1/intake/{intake}/answers (Bearer)', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/v1/intake/42/answers`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { saved: true } };
        },
      ),
    );
    const body = { q1: 'a', q2: 'b' };
    const res = await makeClient().submitAnswers(42, body);
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data.saved).toBe(true);
  });

  // ---------------------------------------------------------------------------
  // POST /api/v1/intake/{intake}/audience — auth required
  // ---------------------------------------------------------------------------
  it('setAudience() — POST /api/v1/intake/{intake}/audience (Bearer)', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/v1/intake/42/audience`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { audience: 'admin' } };
        },
      ),
    );
    const res = await makeClient().setAudience(42, { audience: 'admin' });
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data.audience).toBe('admin');
  });

  // ---------------------------------------------------------------------------
  // POST /api/v1/intake/{intake}/handoff — auth required
  // ---------------------------------------------------------------------------
  it('initiateHandoff() — POST /api/v1/intake/{intake}/handoff (Bearer)', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/v1/intake/42/handoff`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { handoff_token: 'hand-xyz' } };
        },
      ),
    );
    const res = await makeClient().initiateHandoff(42);
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data.handoff_token).toBe('hand-xyz');
  });

  // ---------------------------------------------------------------------------
  // GET /api/v1/intake/{intake}/status — auth required
  // ---------------------------------------------------------------------------
  it('getStatus() — GET /api/v1/intake/{intake}/status (Bearer)', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/v1/intake/42/status`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { state: 'in_progress' } };
        },
      ),
    );
    const res = await makeClient().getStatus(42);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data.state).toBe('in_progress');
  });
});
