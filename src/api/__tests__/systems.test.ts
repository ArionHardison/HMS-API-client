/**
 * Endpoint coverage for `SystemsApiClient` — `/api/v1/systems*`.
 *
 * Routes under test:
 *   GET /api/v1/systems/catalog               (tenant-agnostic, auth:false)
 *   GET /api/v1/systems                       (tenant-scoped via X-Domain)
 *   GET /api/v1/systems/{vertical}            (tenant-scoped)
 *   GET /api/v1/systems/{vertical}/components (tenant-scoped)
 *
 * The catalog endpoint is the one sys/'s sidebar Systems submenu hits;
 * it must NOT send an Authorization header (the registry is public) and
 * the response shape MUST be `{data: SystemCatalogEntry[]}` with each
 * entry carrying `vertical/label/description/icon/components`.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { SystemsApiClient } from '../systems-api-client';
import type { SystemCatalogEntry } from '../../types/systems';

const BASE = 'https://api.test.local';
const TOKEN = 'sys-tok-abc';
const DOMAIN = 'ycaas.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): SystemsApiClient {
  return new SystemsApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

function fakeCatalog(): SystemCatalogEntry[] {
  return [
    {
      vertical: 'healthcare',
      label: 'Healthcare',
      description: 'Patient records, EMR/EHR, provider coordination.',
      icon: 'heart',
      components: [
        {
          key: 'emr',
          name: 'Electronic Medical Records',
          abbr: 'EMR',
          deployed: true,
          purpose: 'Clinical management.',
          capabilities: ['patient.get'],
        },
      ],
    },
    {
      vertical: 'careers',
      label: 'Careers',
      description: 'HR, gig marketplace.',
      icon: 'briefcase',
      components: [
        {
          key: 'hrm',
          name: 'HR Management',
          abbr: 'HRM',
          deployed: true,
          purpose: 'Workforce.',
          capabilities: [],
        },
      ],
    },
  ];
}

describe('SystemsApiClient — /api/v1/systems*', () => {
  let captured: Captured;
  beforeEach(() => {
    captured = { current: null };
  });

  describe('listCatalog() — GET /api/v1/systems/catalog', () => {
    it('hits the catalog endpoint and returns the typed payload', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/v1/systems/catalog`,
          ({ request }) => {
            captured.current = request;
            return { success: true, message: '', data: fakeCatalog() };
          },
        ),
      );

      const res = await makeClient().listCatalog();

      expect(captured.current!.method).toBe('GET');
      expect(res.data).toHaveLength(2);
      expect(res.data[0].vertical).toBe('healthcare');
      expect(res.data[0].components[0].abbr).toBe('EMR');
    });

    it('does NOT send an Authorization header (the registry is public)', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/v1/systems/catalog`,
          ({ request }) => {
            captured.current = request;
            return { success: true, message: '', data: [] };
          },
        ),
      );

      await makeClient().listCatalog();

      // The catalog endpoint passes { auth: false }; BaseApiClient honors
      // that by skipping the Bearer header even when getToken() returns
      // a non-empty string.
      expect(captured.current!.headers.get('Authorization')).toBeNull();
    });

    it('still sends the X-Domain header (cheap, harmless, useful for logs)', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/v1/systems/catalog`,
          ({ request }) => {
            captured.current = request;
            return { success: true, message: '', data: [] };
          },
        ),
      );

      await makeClient().listCatalog();

      expectDomainHeader(captured.current!, DOMAIN);
    });
  });

  describe('listForCurrentSubproject() — GET /api/v1/systems', () => {
    it('hits the tenant-scoped index endpoint with auth + domain headers', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/v1/systems`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );

      await makeClient().listForCurrentSubproject();

      expect(captured.current!.method).toBe('GET');
      expectAuthHeader(captured.current!, TOKEN);
      expectDomainHeader(captured.current!, DOMAIN);
    });
  });

  describe('showVertical(vertical) — GET /api/v1/systems/{vertical}', () => {
    it('URL-encodes the vertical and returns the detail payload', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/v1/systems/healthcare`,
          ({ request }) => {
            captured.current = request;
            return {
              success: true,
              message: '',
              data: {
                vertical: 'healthcare',
                name: 'Healthcare',
                local_name: 'Medicare',
                description: 'd',
                icon: 'heart',
                components: [],
                agencies: [],
                agents: [],
              },
            };
          },
        ),
      );

      const res = await makeClient().showVertical('healthcare');
      expect(res.data.vertical).toBe('healthcare');
      expect(res.data.local_name).toBe('Medicare');
    });
  });

  describe('listComponents(vertical) — GET /api/v1/systems/{vertical}/components', () => {
    it('returns the flat component list', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/v1/systems/healthcare/components`,
          ({ request }) => {
            captured.current = request;
            return {
              success: true,
              message: '',
              data: [
                {
                  key: 'emr',
                  name: 'EMR',
                  abbr: 'EMR',
                  deployed: true,
                  purpose: null,
                  capabilities: [],
                },
              ],
            };
          },
        ),
      );

      const res = await makeClient().listComponents('healthcare');
      expect(res.data).toHaveLength(1);
      expect(res.data[0].key).toBe('emr');
    });
  });
});
