/**
 * CodifyApiClient — endpoint-by-endpoint contract tests for the codification
 * surface of `api/Modules/Codify` NOT covered by `CodifyDomainApiClient`:
 * the public list/kind-render/lookup helpers + the admin HITL CRUD/approval
 * workflow for codify_domains / codify_intents / codify_deal_templates.
 *
 * Each `describe` wraps a single route and asserts (campaign #1000 checklist):
 *   - URL (after baseURL + path-param interpolation + query encoding)
 *   - HTTP verb on the wire (PUT → POST + `?_method=PUT`)
 *   - `Authorization: Bearer` header present (admin Bearer)
 *   - `X-Domain` header present (the lookup resolver is tenant-scoped)
 *   - request body matches the controller's validate()/schema shape
 *   - response decoding pulls the raw controller body (these endpoints do NOT
 *     use the `{success,message,data}` envelope)
 *
 * Plus a 422 (schema validation) and a 401 (unauthorized callback + ApiError).
 *
 * MSW-based; mirrors the canonical style of `deal-wizard.test.ts`.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpResponse } from 'msw';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectMethodOverride,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { ApiError } from '../error-handling';
import { CodifyApiClient } from '../codify-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'tok-codify-admin';
const DOMAIN = 'codify.healthcare';

function makeClient(overrides: Record<string, unknown> = {}): CodifyApiClient {
  return new CodifyApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
    ...overrides,
  });
}

/** A persisted admin domain row (toSchemaArray() + id), draft. */
function domainRow(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 12,
    tld: 'codify.healthcare',
    shape: 'vertical',
    parent_tld: null,
    status: 'draft',
    version: 1,
    vocabulary: { problem: 'case' },
    policy_boundary: { allow: [] },
    authority_structure: {},
    substrate_systems: ['emr'],
    stakeholder_onet_codes: [],
    about_copy: { headline: 'Healthcare' },
    created_at: '2026-06-15T00:00:00+00:00',
    updated_at: '2026-06-15T00:00:00+00:00',
    approved_at: null,
    approved_by: null,
    ...overrides,
  };
}

/** A persisted admin intent row (toSchemaArray() + id + domain_id), draft. */
function intentRow(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 99,
    domain_id: 12,
    tld: 'codify.healthcare',
    slug: 'faster-intake',
    narrative: 'A clinic wants faster patient intake.',
    intent_class: 'operations',
    parameters: [],
    frequency_hint: 'common',
    stakes_hint: 'medium',
    status: 'draft',
    version: 1,
    ...overrides,
  };
}

describe('CodifyApiClient — codification surface', () => {
  let cap: { current: Request | null };

  beforeEach(() => {
    cap = { current: null };
  });

  afterEach(() => {
    cap.current = null;
  });

  // ===========================================================================
  // Public — GET /api/codify-domain/
  // ===========================================================================

  describe('GET /api/codify-domain/ (listDomains)', () => {
    it('returns { data: [...] } with intent counts, sends Bearer + X-Domain', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/codify-domain/`, ({ request }) => {
          cap.current = request;
          return {
            data: [
              { tld: 'codify.healthcare', name: 'Healthcare', parent_tld: null, shape: 'vertical', intent_count: 7 },
            ],
          };
        }),
      );
      const res = await makeClient().listDomains();
      expectAuthHeader(cap.current!, TOKEN);
      expectDomainHeader(cap.current!, DOMAIN);
      expect(cap.current!.method).toBe('GET');
      expect(new URL(cap.current!.url).pathname).toBe('/api/codify-domain/');
      expect(res.data[0].intent_count).toBe(7);
    });
  });

  // ===========================================================================
  // Public — GET /api/codify-domain/{tld}/kind-render
  // ===========================================================================

  describe('GET /api/codify-domain/{tld}/kind-render (getKindRender)', () => {
    it('interpolates tld, forwards role+context, returns resolved map', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/codify-domain/codify.healthcare/kind-render`,
          ({ request }) => {
            cap.current = request;
            return {
              tld: 'codify.healthcare',
              role: null,
              context: 'triage',
              layers: { base: { create: 'Open a case' } },
              resolved: { create: 'Open a case' },
            };
          },
        ),
      );
      const res = await makeClient().getKindRender('codify.healthcare', {
        role: 'nurse',
        context: 'triage',
      });
      expectAuthHeader(cap.current!, TOKEN);
      const url = new URL(cap.current!.url);
      expect(url.searchParams.get('role')).toBe('nurse');
      expect(url.searchParams.get('context')).toBe('triage');
      expect(res.role).toBeNull();
      expect(res.resolved.create).toBe('Open a case');
    });

    it('surfaces a 404 (domain not found) via ApiError', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/codify-domain/nope/kind-render`, () =>
          HttpResponse.json({ message: 'Codify domain not found.' }, { status: 404 }),
        ),
      );
      await expect(makeClient().getKindRender('nope')).rejects.toBeInstanceOf(ApiError);
    });
  });

  // ===========================================================================
  // Public — GET /api/codify/lookup/{resolver}
  // ===========================================================================

  describe('GET /api/codify/lookup/{resolver} (lookup)', () => {
    it('forwards q + tld + arbitrary resolver params, returns { results, meta }', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/codify/lookup/onet`, ({ request }) => {
          cap.current = request;
          return {
            results: [{ id: '29-1141.00', label: 'Registered Nurses', meta: { soc: '29-1141' } }],
            meta: { resolver: 'onet', backend: 'canonical', count: 1 },
          };
        }),
      );
      const res = await makeClient().lookup('onet', {
        q: 'nurse',
        tld: 'codify.healthcare',
        classification: 'occupation',
      });
      expectAuthHeader(cap.current!, TOKEN);
      expectDomainHeader(cap.current!, DOMAIN);
      const url = new URL(cap.current!.url);
      expect(url.pathname).toBe('/api/codify/lookup/onet');
      expect(url.searchParams.get('q')).toBe('nurse');
      expect(url.searchParams.get('tld')).toBe('codify.healthcare');
      expect(url.searchParams.get('classification')).toBe('occupation');
      expect(res.results[0].id).toBe('29-1141.00');
      expect(res.meta.backend).toBe('canonical');
    });

    it('surfaces a 401 authentication_required (external backend) via ApiError + callback', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/codify/lookup/serp`, () =>
          HttpResponse.json({ error: 'authentication_required' }, { status: 401 }),
        ),
      );
      const onUnauthorized = vi.fn();
      const client = makeClient({ onUnauthorized });
      await expect(client.lookup('serp', { q: 'x' })).rejects.toBeInstanceOf(ApiError);
      expect(onUnauthorized).toHaveBeenCalledTimes(1);
    });
  });

  // ===========================================================================
  // Admin — GET /api/admin/codify-domain
  // ===========================================================================

  describe('GET /api/admin/codify-domain (adminListDomains)', () => {
    it('forwards status + tld filters, returns { data, total }', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/admin/codify-domain`, ({ request }) => {
          cap.current = request;
          return { data: [domainRow()], total: 1 };
        }),
      );
      const res = await makeClient().adminListDomains({ status: 'draft', tld: 'codify.healthcare' });
      expectAuthHeader(cap.current!, TOKEN);
      const url = new URL(cap.current!.url);
      expect(url.searchParams.get('status')).toBe('draft');
      expect(url.searchParams.get('tld')).toBe('codify.healthcare');
      expect(res.total).toBe(1);
      expect(res.data[0].id).toBe(12);
    });
  });

  // ===========================================================================
  // Admin — GET /api/admin/codify-domain/{id}
  // ===========================================================================

  describe('GET /api/admin/codify-domain/{id} (adminShowDomain)', () => {
    it('interpolates id, returns the row', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/admin/codify-domain/12`, ({ request }) => {
          cap.current = request;
          return domainRow();
        }),
      );
      const res = await makeClient().adminShowDomain(12);
      expectAuthHeader(cap.current!, TOKEN);
      expect(cap.current!.method).toBe('GET');
      expect(res.id).toBe(12);
      expect(res.tld).toBe('codify.healthcare');
    });
  });

  // ===========================================================================
  // Admin — POST /api/admin/codify-domain (create) + 422
  // ===========================================================================

  describe('POST /api/admin/codify-domain (adminCreateDomain)', () => {
    it('posts the create body, returns the new draft row (201)', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/admin/codify-domain`, async ({ request }) => {
          cap.current = request.clone();
          return HttpResponse.json(domainRow(), { status: 201 });
        }),
      );
      const res = await makeClient().adminCreateDomain({
        tld: 'codify.healthcare',
        shape: 'vertical',
        vocabulary: { problem: 'case' },
        policy_boundary: { allow: [] },
        authority_structure: {},
        substrate_systems: ['emr'],
        about_copy: { headline: 'Healthcare' },
      });
      expectAuthHeader(cap.current!, TOKEN);
      expect(cap.current!.method).toBe('POST');
      const body = await cap.current!.json();
      expect(body.tld).toBe('codify.healthcare');
      expect(body.shape).toBe('vertical');
      expect(body.substrate_systems).toEqual(['emr']);
      expect(res.status).toBe('draft');
    });

    it('surfaces a 422 schema validation failure via ApiError', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/admin/codify-domain`, () =>
          HttpResponse.json(
            { message: 'Schema validation failed.', errors: { vocabulary: ['required'] } },
            { status: 422 },
          ),
        ),
      );
      const onValidationError = vi.fn();
      const client = makeClient({ onValidationError });
      await expect(
        client.adminCreateDomain({
          tld: 'x',
          shape: 'vertical',
          vocabulary: {},
          policy_boundary: {},
          authority_structure: {},
          substrate_systems: [],
          about_copy: {},
        }),
      ).rejects.toBeInstanceOf(ApiError);
      expect(onValidationError).toHaveBeenCalledTimes(1);
    });
  });

  // ===========================================================================
  // Admin — PUT /api/admin/codify-domain/{id} (method override)
  // ===========================================================================

  describe('PUT /api/admin/codify-domain/{id} (adminUpdateDomain)', () => {
    it('rewrites PUT to POST + ?_method=PUT, posts the patch body', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/admin/codify-domain/12`, async ({ request }) => {
          cap.current = request.clone();
          return domainRow({ about_copy: { headline: 'Updated' } });
        }),
      );
      const res = await makeClient().adminUpdateDomain(12, {
        about_copy: { headline: 'Updated' },
      });
      expectAuthHeader(cap.current!, TOKEN);
      expectMethodOverride(cap.current!, 'PUT');
      expect(new URL(cap.current!.url).pathname).toBe('/api/admin/codify-domain/12');
      const body = await cap.current!.json();
      expect(body.about_copy).toEqual({ headline: 'Updated' });
      expect((res.about_copy as Record<string, unknown>).headline).toBe('Updated');
    });
  });

  // ===========================================================================
  // Admin — POST /api/admin/codify-domain/{id}/approve + /revert
  // ===========================================================================

  describe('POST /api/admin/codify-domain/{id}/approve (adminApproveDomain)', () => {
    it('posts no body, returns the now-live row', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/admin/codify-domain/12/approve`, async ({ request }) => {
          cap.current = request.clone();
          return domainRow({ status: 'live', approved_at: '2026-06-15T01:00:00+00:00' });
        }),
      );
      const res = await makeClient().adminApproveDomain(12);
      expectAuthHeader(cap.current!, TOKEN);
      expect(cap.current!.method).toBe('POST');
      expect(new URL(cap.current!.url).pathname).toBe('/api/admin/codify-domain/12/approve');
      expect(res.status).toBe('live');
    });

    it('surfaces a 409 (not a draft) via ApiError', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/admin/codify-domain/12/approve`, () =>
          HttpResponse.json({ message: 'Only draft rows can be approved.' }, { status: 409 }),
        ),
      );
      await expect(makeClient().adminApproveDomain(12)).rejects.toBeInstanceOf(ApiError);
    });
  });

  describe('POST /api/admin/codify-domain/{id}/revert (adminRevertDomain)', () => {
    it('posts no body, returns the restored row', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/admin/codify-domain/12/revert`, async ({ request }) => {
          cap.current = request.clone();
          return domainRow({ id: 11, version: 1, status: 'live' });
        }),
      );
      const res = await makeClient().adminRevertDomain(12);
      expectAuthHeader(cap.current!, TOKEN);
      expect(new URL(cap.current!.url).pathname).toBe('/api/admin/codify-domain/12/revert');
      expect(res.status).toBe('live');
      expect(res.id).toBe(11);
    });
  });

  // ===========================================================================
  // Admin — GET /api/admin/codify-intent (+ filters)
  // ===========================================================================

  describe('GET /api/admin/codify-intent (adminListIntents)', () => {
    it('forwards domain_id + slug filters, returns { data, total }', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/admin/codify-intent`, ({ request }) => {
          cap.current = request;
          return { data: [intentRow()], total: 1 };
        }),
      );
      const res = await makeClient().adminListIntents({ domain_id: 12, slug: 'faster-intake' });
      expectAuthHeader(cap.current!, TOKEN);
      const url = new URL(cap.current!.url);
      expect(url.searchParams.get('domain_id')).toBe('12');
      expect(url.searchParams.get('slug')).toBe('faster-intake');
      expect(res.data[0].domain_id).toBe(12);
    });
  });

  // ===========================================================================
  // Admin — GET /api/admin/codify-intent/{id}
  // ===========================================================================

  describe('GET /api/admin/codify-intent/{id} (adminShowIntent)', () => {
    it('interpolates id, returns the intent', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/admin/codify-intent/99`, ({ request }) => {
          cap.current = request;
          return intentRow();
        }),
      );
      const res = await makeClient().adminShowIntent(99);
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.id).toBe(99);
      expect(res.slug).toBe('faster-intake');
    });
  });

  // ===========================================================================
  // Admin — PUT /api/admin/codify-intent/{id} (method override) + 422
  // ===========================================================================

  describe('PUT /api/admin/codify-intent/{id} (adminUpdateIntent)', () => {
    it('rewrites PUT to POST + ?_method=PUT, posts the patch body', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/admin/codify-intent/99`, async ({ request }) => {
          cap.current = request.clone();
          return intentRow({ narrative: 'Updated narrative.' });
        }),
      );
      const res = await makeClient().adminUpdateIntent(99, { narrative: 'Updated narrative.' });
      expectAuthHeader(cap.current!, TOKEN);
      expectMethodOverride(cap.current!, 'PUT');
      expect(await cap.current!.json()).toEqual({ narrative: 'Updated narrative.' });
      expect(res.narrative).toBe('Updated narrative.');
    });

    it('surfaces a 422 schema validation failure via ApiError', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/admin/codify-intent/99`, () =>
          HttpResponse.json(
            { message: 'Schema validation failed.', errors: { intent_class: ['required'] } },
            { status: 422 },
          ),
        ),
      );
      await expect(
        makeClient().adminUpdateIntent(99, { intent_class: '' }),
      ).rejects.toBeInstanceOf(ApiError);
    });
  });

  // ===========================================================================
  // Admin — POST /api/admin/codify-intent/{id}/approve
  // ===========================================================================

  describe('POST /api/admin/codify-intent/{id}/approve (adminApproveIntent)', () => {
    it('posts no body, returns the now-live intent', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/admin/codify-intent/99/approve`, async ({ request }) => {
          cap.current = request.clone();
          return intentRow({ status: 'live' });
        }),
      );
      const res = await makeClient().adminApproveIntent(99);
      expectAuthHeader(cap.current!, TOKEN);
      expect(new URL(cap.current!.url).pathname).toBe('/api/admin/codify-intent/99/approve');
      expect(res.status).toBe('live');
    });
  });

  // ===========================================================================
  // Admin — POST /api/admin/codify-intent (bulk store) + 422
  // ===========================================================================

  describe('POST /api/admin/codify-intent (adminBulkStoreIntents)', () => {
    it('posts { intents: [...] }, returns { created }', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/admin/codify-intent`, async ({ request }) => {
          cap.current = request.clone();
          return HttpResponse.json({ created: 2 }, { status: 201 });
        }),
      );
      const res = await makeClient().adminBulkStoreIntents({
        intents: [
          { tld: 'codify.healthcare', slug: 'a', narrative: 'n', intent_class: 'operations' },
          { tld: 'codify.healthcare', slug: 'b', narrative: 'n', intent_class: 'operations' },
        ],
      });
      expectAuthHeader(cap.current!, TOKEN);
      const body = await cap.current!.json();
      expect(body.intents).toHaveLength(2);
      expect(body.intents[0].slug).toBe('a');
      expect(res.created).toBe(2);
    });

    it('surfaces a 422 (no intents supplied) via ApiError', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/admin/codify-intent`, () =>
          HttpResponse.json({ message: 'No intents supplied.' }, { status: 422 }),
        ),
      );
      await expect(
        makeClient().adminBulkStoreIntents({ intents: [] }),
      ).rejects.toBeInstanceOf(ApiError);
    });
  });

  // ===========================================================================
  // Admin — POST /api/admin/codify-deal-template (bulk store)
  // ===========================================================================

  describe('POST /api/admin/codify-deal-template (adminBulkStoreDealTemplates)', () => {
    it('posts { templates: [...] }, returns { created }', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/admin/codify-deal-template`, async ({ request }) => {
          cap.current = request.clone();
          return HttpResponse.json({ created: 1 }, { status: 201 });
        }),
      );
      const res = await makeClient().adminBulkStoreDealTemplates({
        templates: [
          {
            tld: 'codify.healthcare',
            intent_slug: 'faster-intake',
            problem_classification: { ontology_class: 'ops', summary: 'speed up intake' },
            required_stakeholders: [{ onet_code: '29-1141.00' }],
            required_systems: [{ abbr: 'EMR', operation: 'create_encounter' }],
            pipeline_steps: [{ step: 1, actor: 'nurse', action: 'triage' }],
            success_criteria: { primary_metric: 'intake_minutes', verification: 'deterministic' },
          },
        ],
      });
      expectAuthHeader(cap.current!, TOKEN);
      const body = await cap.current!.json();
      expect(body.templates[0].intent_slug).toBe('faster-intake');
      expect(res.created).toBe(1);
    });

    it('surfaces a 422 (no templates supplied) via ApiError', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/admin/codify-deal-template`, () =>
          HttpResponse.json({ message: 'No templates supplied.' }, { status: 422 }),
        ),
      );
      await expect(
        makeClient().adminBulkStoreDealTemplates({ templates: [] }),
      ).rejects.toBeInstanceOf(ApiError);
    });
  });
});
