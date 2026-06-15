/**
 * Endpoint coverage for `HrmApiClient` (`Modules/Hrm`,
 * prefix /api/v1/integrations/hrm).
 *
 * 1 route from `Modules/Hrm/Routes/api.php` (202):
 *   POST /api/v1/integrations/hrm/relay   (hrm:relay + idempotency)
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
import { HrmApiClient } from '../hrm-api-client';
import type { HrmRelayResponse } from '../hrm-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'hrm-tkn-1';
const DOMAIN = 'codify.careers';
const IDEM = 'idem-hrm-0001';

interface Captured {
  current: Request | null;
}

function expectIdempotencyKey(request: Request, key: string): void {
  const got = request.headers.get('idempotency-key');
  if (got !== key) {
    throw new Error(`Expected Idempotency-Key "${key}", got "${got ?? '<missing>'}".`);
  }
}

function makeClient(overrides?: { onUnauthorized?: () => void }): HrmApiClient {
  return new HrmApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
    ...overrides,
  });
}

describe('HrmApiClient — Modules/Hrm', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  it('relay() — POST /relay, body + Bearer + X-Domain + Idempotency-Key, 202', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/v1/integrations/hrm/relay`, async ({ request }) => {
        captured.current = request.clone();
        return HttpResponse.json(
          {
            accepted: true,
            event: 'workforce.actor.credential.issued.OnetCertification',
            exchange: 'workforce.events',
          },
          { status: 202 },
        );
      }),
    );
    const body = {
      event: 'workforce.actor.credential.issued.OnetCertification',
      payload: { actor_id: 5, credential: 'onet-123' },
    };
    const res = (await makeClient().relay(body, IDEM)) as unknown as HrmRelayResponse;
    expect(captured.current!.method).toBe('POST');
    expect(new URL(captured.current!.url).pathname).toBe('/api/v1/integrations/hrm/relay');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expectIdempotencyKey(captured.current!, IDEM);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.accepted).toBe(true);
    expect(res.exchange).toBe('workforce.events');
  });

  it('relay() — omits Idempotency-Key when not supplied', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/v1/integrations/hrm/relay`, ({ request }) => {
        captured.current = request;
        return HttpResponse.json(
          { accepted: true, event: 'training.x', exchange: 'training.events' },
          { status: 202 },
        );
      }),
    );
    await makeClient().relay({ event: 'training.x', payload: {} });
    expect(captured.current!.headers.get('idempotency-key')).toBeNull();
  });

  it('surfaces a 422 (bad event prefix) via ApiError', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/v1/integrations/hrm/relay`, () =>
        HttpResponse.json({ message: 'Invalid', errors: { event: ['regex'] } }, { status: 422 }),
      ),
    );
    await expect(
      makeClient().relay({ event: 'bogus.x', payload: {} }),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it('fires onUnauthorized and throws ApiError on a 401', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/v1/integrations/hrm/relay`, () =>
        HttpResponse.json({ message: 'Unauthenticated.' }, { status: 401 }),
      ),
    );
    const onUnauthorized = vi.fn();
    const client = makeClient({ onUnauthorized });
    await expect(
      client.relay({ event: 'workforce.x', payload: {} }),
    ).rejects.toBeInstanceOf(ApiError);
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });
});
