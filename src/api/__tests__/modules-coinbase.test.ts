/**
 * Endpoint coverage for `CoinbaseModuleApiClient` (`Vendor/Coinbase`).
 *
 * Spec source: `sdk/spec/endpoints.json` — module === "Vendor/Coinbase".
 * Single endpoint: `POST /api/coinbase/webhook` (`auth:public`,
 * unauthenticated). The receiver is a third-party-vendor webhook ingestion
 * point — the SDK exposes it primarily so consumers can wire it through
 * their own router as a thin proxy (`/api/webhook/coinbase/*`) without
 * sending tenant or auth context.
 *
 * Both Authorization and X-Domain headers must be ABSENT on this call:
 * `auth: false` per call AND `getDomain` returning null at the consumer
 * (Coinbase publishes to a tenant-context-free public endpoint).
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectNoAuthHeader,
  expectNoDomainHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { CoinbaseModuleApiClient } from '../modules-coinbase-api-client';

const BASE = 'https://api.test.local';

interface Captured {
  current: Request | null;
}

/**
 * Public-webhook client config: no token, no domain. Mirrors how a
 * consumer mounts the webhook receiver behind their own route — the SDK
 * never injects tenant context here.
 */
function makePublicClient(): CoinbaseModuleApiClient {
  return new CoinbaseModuleApiClient({
    baseURL: BASE,
    getToken: () => null,
    getDomain: () => null,
  });
}

describe('CoinbaseModuleApiClient — Vendor/Coinbase', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  // ---------------------------------------------------------------------------
  // POST /api/coinbase/webhook — coinbase-webhook (public, tenant-context-free)
  // ---------------------------------------------------------------------------
  it('webhook() — POST /api/coinbase/webhook (public, no auth, no X-Domain)', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/coinbase/webhook`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { received: true } };
        },
      ),
    );
    const body = {
      id: 'evt_1',
      type: 'charge:confirmed',
      data: { code: 'AB12CD', pricing: { local: { amount: '10.00' } } },
    };
    const res = await makePublicClient().webhook(body, { auth: false });
    expect(captured.current!.method).toBe('POST');
    expectNoAuthHeader(captured.current!);
    expectNoDomainHeader(captured.current!);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data).toMatchObject({ received: true });
  });
});
