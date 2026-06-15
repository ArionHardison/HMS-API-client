/**
 * Endpoint coverage for `FacilitiesApiClient` (`Modules/Facilities`,
 * prefix /api/facilities).
 *
 * 2 routes from `Modules/Facilities/Routes/api.php` (both read-only GET):
 *   GET /api/facilities/portfolio/rollup
 *   GET /api/facilities/themes/{theme}/signals
 *
 * `portfolio/rollup` returns a bespoke `{columns, rows}` body; theme signals
 * return a `{data: {...}}` body. An unknown / unseeded theme 404s.
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
import { FacilitiesApiClient } from '../facilities-api-client';
import type {
  FacilitiesPortfolioRollupResponse,
  FacilitiesThemeSignalsResponse,
} from '../facilities-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'fac-tkn-1';
const DOMAIN = 'www.codify.nyc';

interface Captured {
  current: Request | null;
}

function makeClient(overrides?: { onUnauthorized?: () => void }): FacilitiesApiClient {
  return new FacilitiesApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
    ...overrides,
  });
}

describe('FacilitiesApiClient — Modules/Facilities', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  it('getPortfolioRollup() — GET /api/facilities/portfolio/rollup', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/facilities/portfolio/rollup`, ({ request }) => {
        captured.current = request;
        return {
          columns: ['water_plumbing', 'hvac_thermal'],
          rows: [
            {
              building: 'amsterdam-ave-100',
              cells: { water_plumbing: { signal_count: 3, worst_confidence: 'Missing' } },
            },
            { building: null, cells: {} },
          ],
        };
      }),
    );
    const res = (await makeClient().getPortfolioRollup()) as unknown as
      FacilitiesPortfolioRollupResponse;
    expect(captured.current!.method).toBe('GET');
    expect(new URL(captured.current!.url).pathname).toBe(
      '/api/facilities/portfolio/rollup',
    );
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(res.columns).toContain('water_plumbing');
    expect(res.rows[0].building).toBe('amsterdam-ave-100');
  });

  it('getThemeSignals() — GET /api/facilities/themes/{theme}/signals', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/facilities/themes/restroom/signals`, ({ request }) => {
        captured.current = request;
        return {
          data: {
            theme: { slug: 'restroom', name: 'Restroom', title: 'Restroom' },
            signals: [{ pipeline_id: 1, system_group: 'water_plumbing' }],
            time_series: [{ bucket: '2026-06-05', signal_count: 1, avg_confidence: 0.9 }],
          },
        };
      }),
    );
    const res = await makeClient().getThemeSignals('restroom');
    expect(new URL(captured.current!.url).pathname).toBe(
      '/api/facilities/themes/restroom/signals',
    );
    expectAuthHeader(captured.current!, TOKEN);
    const body: FacilitiesThemeSignalsResponse = res.data;
    expect(body.theme.slug).toBe('restroom');
    expect(body.signals).toHaveLength(1);
  });

  it('getThemeSignals() — encodes the theme slug', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/facilities/themes/safe-path/signals`, ({ request }) => {
        captured.current = request;
        return { data: { theme: { slug: 'safe-path', name: null, title: null }, signals: [], time_series: [] } };
      }),
    );
    await makeClient().getThemeSignals('safe-path');
    expect(new URL(captured.current!.url).pathname).toBe(
      '/api/facilities/themes/safe-path/signals',
    );
  });

  it('getThemeSignals() — surfaces a 404 unknown theme via ApiError', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/facilities/themes/bogus/signals`, () =>
        HttpResponse.json({ message: 'Unknown theme: bogus' }, { status: 404 }),
      ),
    );
    await expect(makeClient().getThemeSignals('bogus')).rejects.toBeInstanceOf(ApiError);
  });

  it('fires onUnauthorized and throws ApiError on a 401', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/facilities/portfolio/rollup`, () =>
        HttpResponse.json({ message: 'Unauthenticated.' }, { status: 401 }),
      ),
    );
    const onUnauthorized = vi.fn();
    const client = makeClient({ onUnauthorized });
    await expect(client.getPortfolioRollup()).rejects.toBeInstanceOf(ApiError);
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });
});
