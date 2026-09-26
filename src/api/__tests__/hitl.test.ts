/**
 * Endpoint coverage for `HitlApiClient` (`Modules/Hitl`,
 * prefix /api/v1/integrations/hitl).
 *
 * 2 routes from `Modules/Hitl/Routes/api.php` (both 202):
 *   POST /api/v1/integrations/hitl/requested   (hitl:writer + idempotency)
 *   POST /api/v1/integrations/hitl/resume      (hitl:writer + idempotency)
 *
 * Bespoke 202 bodies — assertions read fields off the resolved value.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpResponse } from 'msw';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { ApiError } from '../error-handling';
import { HitlApiClient } from '../hitl-api-client';
import type { HitlRequestedResponse, HitlResumeResponse } from '../hitl-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'hitl-tkn-1';
const DOMAIN = 'crohnie.ai';
const IDEM = 'idem-hitl-0001';

interface Captured {
  current: Request | null;
}

function expectIdempotencyKey(request: Request, key: string): void {
  const got = request.headers.get('idempotency-key');
  if (got !== key) {
    throw new Error(`Expected Idempotency-Key "${key}", got "${got ?? '<missing>'}".`);
  }
}

function makeClient(overrides?: { onUnauthorized?: () => void }): HitlApiClient {
  return new HitlApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
    ...overrides,
  });
}

describe('HitlApiClient — Modules/Hitl', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  it('requestApproval() — POST /requested, body + Bearer + X-Domain + Idempotency-Key, 202', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/v1/integrations/hitl/requested`,
        async ({ request }) => {
          captured.current = request.clone();
          return HttpResponse.json(
            { approval_id: 'ap-1', status: 'pending' },
            { status: 202 },
          );
        },
      ),
    );
    const body = {
      approval_id: 'ap-1',
      tool_name: 'emr.write_note',
      args: { note: 'x' },
      agent_id: 'agent-7',
      subproject_id: 3,
    };
    const res = (await makeClient().requestApproval(
      body,
      IDEM,
    )) as unknown as HitlRequestedResponse;
    expect(captured.current!.method).toBe('POST');
    expect(new URL(captured.current!.url).pathname).toBe(
      '/api/v1/integrations/hitl/requested',
    );
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expectIdempotencyKey(captured.current!, IDEM);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.status).toBe('pending');
  });

  it('requestApproval() — omits Idempotency-Key when not supplied', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/v1/integrations/hitl/requested`, ({ request }) => {
        captured.current = request;
        return HttpResponse.json({ approval_id: 'ap-2', status: 'pending' }, { status: 202 });
      }),
    );
    await makeClient().requestApproval({ approval_id: 'ap-2', tool_name: 't', args: {} });
    expect(captured.current!.headers.get('idempotency-key')).toBeNull();
  });

  it('resume() — POST /resume, body + Idempotency-Key, 202', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/v1/integrations/hitl/resume`, async ({ request }) => {
        captured.current = request.clone();
        return HttpResponse.json(
          { approval_id: 'ap-1', decision: 'approved', decided_at: '2026-06-15T00:00:00Z' },
          { status: 202 },
        );
      }),
    );
    const body = { approval_id: 'ap-1', decision: 'approved' as const, rationale: 'looks good' };
    const res = (await makeClient().resume(body, IDEM)) as unknown as HitlResumeResponse;
    expect(new URL(captured.current!.url).pathname).toBe('/api/v1/integrations/hitl/resume');
    expectAuthHeader(captured.current!, TOKEN);
    expectIdempotencyKey(captured.current!, IDEM);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.decision).toBe('approved');
  });

  it('resume() — surfaces a 422 (bad decision enum) via ApiError', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/v1/integrations/hitl/resume`, () =>
        HttpResponse.json({ message: 'Invalid', errors: { decision: ['in'] } }, { status: 422 }),
      ),
    );
    await expect(
      // @ts-expect-error — intentionally invalid decision to exercise the 422 path.
      makeClient().resume({ approval_id: 'ap-1', decision: 'maybe' }),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it('fires onUnauthorized and throws ApiError on a 401', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/v1/integrations/hitl/requested`, () =>
        HttpResponse.json({ message: 'Unauthenticated.' }, { status: 401 }),
      ),
    );
    const onUnauthorized = vi.fn();
    const client = makeClient({ onUnauthorized });
    await expect(
      client.requestApproval({ approval_id: 'ap-1', tool_name: 't', args: {} }),
    ).rejects.toBeInstanceOf(ApiError);
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });
});
