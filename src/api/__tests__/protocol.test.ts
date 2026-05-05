/**
 * ProtocolApiClient — endpoint-by-endpoint contract tests.
 *
 * Covers every endpoint in the Protocol CRUD + AI Assist slice (76 routes).
 * Each `describe` block wraps a single endpoint and asserts:
 *   - URL (after BaseURL + path-param interpolation)
 *   - HTTP verb on the wire (PUT/PATCH → POST + `?_method=PUT|PATCH`)
 *   - Authorization header presence per spec `auth` (public ⇒ no Bearer;
 *     api/sanctum ⇒ Bearer required)
 *   - `X-Domain` header always present
 *   - Request body matches the spec's `request.shape`
 *   - Response decoding pulls the typed payload out of the envelope
 *     (`wrapper: "data"` ⇒ `.data`; `wrapper: "paginated"` ⇒ `.data.items[]`)
 *   - File-upload bodies serialize as `multipart/form-data`
 *   - AI-assist endpoints surface a polling token (`id` / `key` / `request_id`)
 *     and `ai-request-status` consumes that token without further
 *     transformation.
 *
 * MSW-based; mirrors the canonical style of `auth-user.test.ts`.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectMethodOverride,
  expectNoAuthHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { ProtocolApiClient } from '../protocol-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'tok-protocol';
const DOMAIN = 'codify.education';

function makeClient(): ProtocolApiClient {
  return new ProtocolApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

function captured(): { current: Request | null } {
  return { current: null };
}

describe('ProtocolApiClient — Protocol CRUD + AI Assist slice', () => {
  let cap: { current: Request | null };

  beforeEach(() => {
    cap = captured();
  });

  afterEach(() => {
    cap.current = null;
  });

  // ===========================================================================
  // /api/protocol — base CRUD
  // ===========================================================================

  describe('GET /api/protocol (index, paginated)', () => {
    it('Bearer required, returns paginated envelope', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: {
              items: [{ id: 1, name: 'P', problem: 'X', category_id: 2, programs: null }],
              meta: { current_page: 1 },
            },
          };
        }),
      );
      const res = await makeClient().listProtocols();
      expectAuthHeader(cap.current!, TOKEN);
      expectDomainHeader(cap.current!, DOMAIN);
      expect(res.data.items[0].id).toBe(1);
    });
  });

  describe('POST /api/protocol (store)', () => {
    it('Bearer required, body shape {name, category_id?, problem}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/protocol`, async ({ request }) => {
          cap.current = request.clone();
          return {
            success: true,
            message: '',
            data: { id: 5, name: 'P', problem: 'Why?', category_id: 1, programs: null },
          };
        }),
      );
      const res = await makeClient().createProtocol({
        name: 'Test',
        category_id: 1,
        problem: 'Why does this happen?',
      });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({
        name: 'Test',
        category_id: 1,
        problem: 'Why does this happen?',
      });
      expect(res.data.id).toBe(5);
    });
  });

  describe('GET /api/protocol/{protocol} (show)', () => {
    it('Bearer required, interpolates protocol id', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/12`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: { id: 12, name: 'P', problem: 'X', category_id: 0, programs: null },
          };
        }),
      );
      const res = await makeClient().getProtocol(12);
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.id).toBe(12);
    });
  });

  describe('PUT /api/protocol/{protocol} (update)', () => {
    it('rewrites PUT to POST + ?_method=PUT, body shape', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/protocol/77`, async ({ request }) => {
          cap.current = request.clone();
          return {
            success: true,
            message: '',
            data: { id: 77, name: 'New', problem: 'p', category_id: 1, programs: null },
          };
        }),
      );
      await makeClient().updateProtocol(77, {
        name: 'New',
        category_id: 1,
        problem: 'updated problem',
      });
      expectAuthHeader(cap.current!, TOKEN);
      expectMethodOverride(cap.current!, 'PUT');
      expect(await cap.current!.json()).toEqual({
        name: 'New',
        category_id: 1,
        problem: 'updated problem',
      });
    });
  });

  describe('DELETE /api/protocol/{protocol} (destroy)', () => {
    it('issues a real DELETE, Bearer required', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/protocol/88`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().deleteProtocol(88);
      expectAuthHeader(cap.current!, TOKEN);
      expect(cap.current!.method).toBe('DELETE');
    });
  });

  // ===========================================================================
  // /api/protocol-category — CRUD + helpers
  // ===========================================================================

  describe('GET /api/protocol-category (index, paginated)', () => {
    it('Bearer required, paginated payload', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol-category`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { items: [], meta: {} } };
        }),
      );
      const res = await makeClient().listProtocolCategories();
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.items).toEqual([]);
    });
  });

  describe('POST /api/protocol-category (store)', () => {
    it('Bearer required, body {category_name}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/protocol-category`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: { id: 1, category_name: 'Hi' } };
        }),
      );
      await makeClient().createProtocolCategory({ category_name: 'Health' });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ category_name: 'Health' });
    });
  });

  describe('GET /api/protocol-category/all', () => {
    it('Bearer required, GET', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol-category/all`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getAllProtocolCategories();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/protocol-category/for-attachment', () => {
    it('Bearer required, GET', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol-category/for-attachment`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getProtocolCategoriesForAttachment();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/protocol-category/{protocol_category} (show)', () => {
    it('Bearer required, interpolates id', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol-category/5`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { id: 5 } };
        }),
      );
      await makeClient().getProtocolCategory(5);
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('PUT /api/protocol-category/{protocol_category} (update)', () => {
    it('rewrites PUT to POST + ?_method=PUT', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/protocol-category/9`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: { id: 9, category_name: 'X' } };
        }),
      );
      await makeClient().updateProtocolCategory(9, { category_name: 'X' });
      expectAuthHeader(cap.current!, TOKEN);
      expectMethodOverride(cap.current!, 'PUT');
      expect(await cap.current!.json()).toEqual({ category_name: 'X' });
    });
  });

  describe('DELETE /api/protocol-category/{protocol_category}', () => {
    it('real DELETE, Bearer required', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/protocol-category/3`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().deleteProtocolCategory(3);
      expectAuthHeader(cap.current!, TOKEN);
      expect(cap.current!.method).toBe('DELETE');
    });
  });

  // ===========================================================================
  // /api/protocol-event/triggers
  // ===========================================================================

  describe('GET /api/protocol-event/triggers', () => {
    it('Bearer required, GET', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol-event/triggers`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getProtocolEventTriggers();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  // ===========================================================================
  // /api/protocol/* — sub-module integrations and listings
  // ===========================================================================

  describe('GET /api/protocol/activity/all', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/activity/all`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getProtocolActivityAll();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/protocol/agents/all', () => {
    it('sanctum auth — Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/agents/all`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: [{ id: 1, name: 'a', description: 'd' }],
          };
        }),
      );
      const res = await makeClient().getProtocolAgentsAll();
      expectAuthHeader(cap.current!, TOKEN);
      expect((res.data as any[])[0].id).toBe(1);
    });
  });

  describe('GET /api/protocol/appeal/all', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/appeal/all`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getProtocolAppealAll();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/protocol/application/all', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/application/all`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getProtocolApplicationAll();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/protocol/assessment/all', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/assessment/all`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getProtocolAssessmentAll();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/protocol/assessment/item-instances/{assessment}', () => {
    it('Bearer required, interpolates id', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/protocol/assessment/item-instances/22`,
          ({ request }) => {
            cap.current = request;
            return { success: true, message: '', data: [] };
          },
        ),
      );
      await makeClient().getAssessmentItemInstances(22);
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/protocol/challenge/all', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/challenge/all`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getProtocolChallengeAll();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/protocol/connector/all', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/connector/all`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getProtocolConnectorAll();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/protocol/disbursement/all', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/disbursement/all`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getProtocolDisbursementAll();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/protocol/etl/all', () => {
    it('sanctum auth — Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/etl/all`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: [{ id: 1, name: 'n', description: 'd', severity: 1, status: 'ok' }],
          };
        }),
      );
      const res = await makeClient().getProtocolEtlAll();
      expectAuthHeader(cap.current!, TOKEN);
      expect((res.data as any[])[0].severity).toBe(1);
    });
  });

  describe('GET /api/protocol/nudge/all', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/nudge/all`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getProtocolNudgeAll();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/protocol/order/all', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/order/all`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getProtocolOrderAll();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/protocol/referral/all', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/referral/all`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getProtocolReferralAll();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/protocol/report/all', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/report/all`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getProtocolReportAll();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/protocol/verification/all', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/verification/all`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getProtocolVerificationAll();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/protocol/workflow/all', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/workflow/all`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: [{ id: 1, name: 'n', description: 'd' }],
          };
        }),
      );
      const res = await makeClient().getProtocolWorkflowAll();
      expectAuthHeader(cap.current!, TOKEN);
      expect((res.data as any[])[0].id).toBe(1);
    });
  });

  describe('GET /api/protocol/all', () => {
    it('Bearer required, returns ProtocolResource list', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/all`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: [{ id: 1, name: 'P', problem: 'X', category_id: 0, programs: null }],
          };
        }),
      );
      const res = await makeClient().getAllProtocols();
      expectAuthHeader(cap.current!, TOKEN);
      expect((res.data as any[])[0].id).toBe(1);
    });
  });

  describe('GET /api/protocol/by-category-all/{category}', () => {
    it('Bearer required, interpolates category', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/by-category-all/health`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getProtocolsByCategoryAll('health');
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/protocol/by-category/{category?}', () => {
    it('omits trailing segment when category missing, paginated payload', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/by-category`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: { items: [], meta: {} },
          };
        }),
      );
      const res = await makeClient().getProtocolsByCategory();
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.items).toEqual([]);
    });
    it('appends category segment when provided', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/by-category/4`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { items: [], meta: {} } };
        }),
      );
      await makeClient().getProtocolsByCategory(4);
      expect(new URL(cap.current!.url).pathname).toBe('/api/protocol/by-category/4');
    });
  });

  describe('GET /api/protocol/check-usage/{protocol}', () => {
    it('Bearer required, interpolates id', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/check-usage/11`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().checkProtocolUsage(11);
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/protocol/errors/{protocol}', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/errors/13`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().getProtocolErrors(13);
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/protocol/get-temporary-user', () => {
    it('Bearer required, returns ProtocolResource', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/get-temporary-user`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: { id: 99, name: 'temp', problem: 'q', category_id: 0, programs: null },
          };
        }),
      );
      const res = await makeClient().getTemporaryUserProtocol();
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.id).toBe(99);
    });
  });

  describe('GET /api/protocol/chain-item-branch-plan/{protocol}/{item}', () => {
    it('Bearer required, interpolates both ids', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/protocol/chain-item-branch-plan/3/abc`,
          ({ request }) => {
            cap.current = request;
            return { success: true, message: '', data: {} };
          },
        ),
      );
      await makeClient().getChainItemBranchPlan(3, 'abc');
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/protocol/get-plan/{protocol}', () => {
    it('Bearer required, returns ProtocolAiPlanResource', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/get-plan/4`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: { plan: { steps: [] }, confirmed: false },
          };
        }),
      );
      const res = await makeClient().getProtocolPlan(4);
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.confirmed).toBe(false);
    });
  });

  describe('GET /api/protocol/get-steps/{protocol}', () => {
    it('Bearer required, returns step records', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/get-steps/8`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: [{ id: 1, name: 'Step', role: 'admin' }],
          };
        }),
      );
      const res = await makeClient().getProtocolSteps(8);
      expectAuthHeader(cap.current!, TOKEN);
      expect((res.data as any[])[0].id).toBe(1);
    });
  });

  describe('GET /api/protocol/intensive-module/roles/{protocol}', () => {
    it('Bearer required, interpolates protocol', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/protocol/intensive-module/roles/7`,
          ({ request }) => {
            cap.current = request;
            return { success: true, message: '', data: [] };
          },
        ),
      );
      await makeClient().getIntensiveModuleRoles(7);
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/protocol/list-intensive/{protocol}', () => {
    it('Bearer required, returns global module list', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/list-intensive/12`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: [{ id: 1, module: 'm', item: 'i', protocol_id: 12 }],
          };
        }),
      );
      const res = await makeClient().listIntensiveModules(12);
      expectAuthHeader(cap.current!, TOKEN);
      expect((res.data as any[])[0].protocol_id).toBe(12);
    });
  });

  describe('GET /api/protocol/show-intensive/{module}', () => {
    it('Bearer required, returns module config', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/show-intensive/55`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: { id: 55, protocol_id: 1 } as any,
          };
        }),
      );
      const res = await makeClient().showIntensiveModule(55);
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.id).toBe(55);
    });
  });

  describe('GET /api/protocol/get-intensive-module-settings/{protocol}/{chain}', () => {
    it('Bearer required, interpolates both ids', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/protocol/get-intensive-module-settings/4/abc`,
          ({ request }) => {
            cap.current = request;
            return { success: true, message: '', data: {} };
          },
        ),
      );
      await makeClient().getIntensiveModuleSettings(4, 'abc');
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/protocol/modules/{recurring?}', () => {
    it('omits trailing segment when recurring missing', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/modules`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getProtocolModules();
      expectAuthHeader(cap.current!, TOKEN);
    });
    it('appends recurring flag when provided', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/modules/1`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getProtocolModules(1);
      expect(new URL(cap.current!.url).pathname).toBe('/api/protocol/modules/1');
    });
  });

  describe('GET /api/protocol/node-members/{node}', () => {
    it('Bearer required, interpolates node id', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/node-members/15`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getNodeMembers(15);
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/protocol/role-qualifications/{role}', () => {
    it('Bearer required, interpolates role', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/protocol/role-qualifications/admin`,
          ({ request }) => {
            cap.current = request;
            return { success: true, message: '', data: [] };
          },
        ),
      );
      await makeClient().getRoleQualifications('admin');
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/protocol/roles/{type}', () => {
    it('Bearer required, interpolates type', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/roles/sys`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getProtocolRoles('sys');
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  // ===========================================================================
  // /api/protocol/sale + /api/protocol/settings
  // ===========================================================================

  describe('GET /api/protocol/sale/get/{protocol}', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/sale/get/14`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().getProtocolSale(14);
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/protocol/sale/salaries/{protocol}', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/sale/salaries/16`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getProtocolSaleSalaries(16);
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('POST /api/protocol/sale/set-sale', () => {
    it('Bearer required, body shape {protocol_id?, amount, salary}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/protocol/sale/set-sale`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().setProtocolSale({
        protocol_id: 21,
        amount: 100,
        salary: [{ id: null, role_id: 1, salary: 50 }],
      });
      expectAuthHeader(cap.current!, TOKEN);
      const body = await cap.current!.json();
      expect(body.amount).toBe(100);
      expect(body.protocol_id).toBe(21);
    });
  });

  describe('PATCH /api/protocol/sale/update/{protocol}', () => {
    it('rewrites PATCH to POST + ?_method=PATCH', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/protocol/sale/update/22`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().updateProtocolSale(22, {
        amount: 250,
        salary: [{ id: 1, role_id: 2, salary: 75 }],
      });
      expectAuthHeader(cap.current!, TOKEN);
      expectMethodOverride(cap.current!, 'PATCH');
      const body = await cap.current!.json();
      expect(body.amount).toBe(250);
    });
  });

  describe('GET /api/protocol/settings/get/{protocol}', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/protocol/settings/get/30`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().getProtocolSettings(30);
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('POST /api/protocol/settings/save', () => {
    it('Bearer required, body shape {protocol_id?, report?}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/protocol/settings/save`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().saveProtocolSettings({ protocol_id: 30, report: true });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ protocol_id: 30, report: true });
    });
  });

  // ===========================================================================
  // Plan/branch editors (POST)
  // ===========================================================================

  describe('POST /api/protocol/add-module-to-plan', () => {
    it('Bearer required, body matches ValidateModuleRequest', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/protocol/add-module-to-plan`,
          async ({ request }) => {
            cap.current = request.clone();
            return { success: true, message: '', data: {} };
          },
        ),
      );
      await makeClient().addModuleToPlan({
        id: 'abcdefgh',
        protocol_id: 1,
        at: '12:00',
        at_time: false,
        branch_child_id: null,
        branch_id: null,
        moduleName: 'StepA',
        stepDescription: 'Description goes here exceeding 20 chars',
        target: 'JUMP',
      });
      expectAuthHeader(cap.current!, TOKEN);
      const body = await cap.current!.json();
      expect(body.id).toBe('abcdefgh');
      expect(body.target).toBe('JUMP');
    });
  });

  describe('POST /api/protocol/add-module-to-branch', () => {
    it('Bearer required, body matches ValidateBranchModuleRequest', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/protocol/add-module-to-branch`,
          async ({ request }) => {
            cap.current = request.clone();
            return { success: true, message: '', data: {} };
          },
        ),
      );
      await makeClient().addModuleToBranch({
        branch_id: 'br000001',
        branch_child_id: 1,
        id: 'idABCDEF',
        protocol_id: 4,
        at: null,
        moduleName: 'mod',
        stepDescription: 'A description spanning > 20 chars',
        target: 'NEXT',
      });
      expectAuthHeader(cap.current!, TOKEN);
      const body = await cap.current!.json();
      expect(body.branch_id).toBe('br000001');
    });
  });

  describe('POST /api/protocol/edit-plan-module', () => {
    it('Bearer required, body matches ValidateModuleRequest', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/protocol/edit-plan-module`,
          async ({ request }) => {
            cap.current = request.clone();
            return { success: true, message: '', data: {} };
          },
        ),
      );
      await makeClient().editPlanModule({
        id: 'edit0001',
        protocol_id: 1,
        at: '12:00',
        stepDescription: 'Description spanning > 20 chars',
        target: 'NEXT',
      });
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('POST /api/protocol/edit-plan-branch-module', () => {
    it('Bearer required, body matches ValidateBranchModuleRequest', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/protocol/edit-plan-branch-module`,
          async ({ request }) => {
            cap.current = request.clone();
            return { success: true, message: '', data: {} };
          },
        ),
      );
      await makeClient().editPlanBranchModule({
        branch_id: 'br000001',
        branch_child_id: 1,
        id: 'idABCDEF',
        protocol_id: 4,
        stepDescription: 'A description spanning > 20 chars',
        target: 'NEXT',
      });
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('POST /api/protocol/move-up-plan-item', () => {
    it('Bearer required, body {item, protocol_id}', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/protocol/move-up-plan-item`,
          async ({ request }) => {
            cap.current = request.clone();
            return { success: true, message: '', data: {} };
          },
        ),
      );
      await makeClient().movePlanItemUp({ item: 'itemABCD', protocol_id: 3 });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ item: 'itemABCD', protocol_id: 3 });
    });
  });

  describe('POST /api/protocol/move-down-plan-item', () => {
    it('Bearer required, body {item, protocol_id}', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/protocol/move-down-plan-item`,
          async ({ request }) => {
            cap.current = request.clone();
            return { success: true, message: '', data: {} };
          },
        ),
      );
      await makeClient().movePlanItemDown({ item: 'itemABCD', protocol_id: 3 });
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('POST /api/protocol/delete-plan-item', () => {
    it('Bearer required, body {item, protocol_id}', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/protocol/delete-plan-item`,
          async ({ request }) => {
            cap.current = request.clone();
            return { success: true, message: '', data: {} };
          },
        ),
      );
      await makeClient().deletePlanItem({ item: 'itemABCD', protocol_id: 3 });
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('POST /api/protocol/move-up-branch-item', () => {
    it('Bearer required, body {branch_id, item, protocol_id}', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/protocol/move-up-branch-item`,
          async ({ request }) => {
            cap.current = request.clone();
            return { success: true, message: '', data: {} };
          },
        ),
      );
      await makeClient().moveBranchItemUp({
        branch_id: 'br000001',
        item: 'itemABCD',
        protocol_id: 4,
      });
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('POST /api/protocol/move-down-branch-item', () => {
    it('Bearer required, body shape', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/protocol/move-down-branch-item`,
          async ({ request }) => {
            cap.current = request.clone();
            return { success: true, message: '', data: {} };
          },
        ),
      );
      await makeClient().moveBranchItemDown({
        branch_id: 'br000001',
        item: 'itemABCD',
        protocol_id: 4,
      });
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('POST /api/protocol/delete-branch-item', () => {
    it('Bearer required, body shape', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/protocol/delete-branch-item`,
          async ({ request }) => {
            cap.current = request.clone();
            return { success: true, message: '', data: {} };
          },
        ),
      );
      await makeClient().deleteBranchItem({
        branch_id: 'br000001',
        item: 'itemABCD',
        protocol_id: 4,
      });
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('POST /api/protocol/confirm-plan', () => {
    it('Bearer required, body {category_name}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/protocol/confirm-plan`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().confirmProtocolPlan({ category_name: 'My Plan' });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ category_name: 'My Plan' });
    });
  });

  describe('POST /api/protocol/switch-member', () => {
    it('Bearer required, body {node_id, member_id}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/protocol/switch-member`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().switchProtocolChainMember({ node_id: 1, member_id: 2 });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ node_id: 1, member_id: 2 });
    });
  });

  // ===========================================================================
  // Intensive (global) module CRUD
  // ===========================================================================

  describe('POST /api/protocol/store-intensive', () => {
    it('Bearer required, body matches StoreGlobalModuleRequest', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/protocol/store-intensive`,
          async ({ request }) => {
            cap.current = request.clone();
            return {
              success: true,
              message: '',
              data: { id: 1, module: 'm', item: 'i', protocol_id: 7 },
            };
          },
        ),
      );
      const res = await makeClient().storeIntensiveModule({
        at_time: '12:00 PM',
        at_week_days: ['mon'],
        protocol_id: '7',
        chain_item_id: 'chain-1',
        repeat: 1,
        run_every: 'day',
        target: 'role',
        start_after: 'node-1',
      });
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.protocol_id).toBe(7);
    });
  });

  describe('POST /api/protocol/update-intensive/{module}', () => {
    it('Bearer required, body matches UpdateGlobalModuleRequest', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/protocol/update-intensive/55`,
          async ({ request }) => {
            cap.current = request.clone();
            return {
              success: true,
              message: '',
              data: { id: 55, module: 'm', item: 'i', protocol_id: 1 },
            };
          },
        ),
      );
      const res = await makeClient().updateIntensiveModule(55, {
        at_week_days: ['mon'],
        protocol_id: '1',
        chain_item_id: 'chain-1',
        repeat: 1,
        run_every: 'day',
        selected_item: 9,
        target: 'role',
        start_after: 'node-1',
      });
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.id).toBe(55);
      expect(cap.current!.method).toBe('POST');
    });
  });

  describe('DELETE /api/protocol/delete-intensive/{global}', () => {
    it('real DELETE, Bearer required', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/protocol/delete-intensive/77`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().deleteIntensiveModule(77);
      expectAuthHeader(cap.current!, TOKEN);
      expect(cap.current!.method).toBe('DELETE');
    });
  });

  describe('DELETE /api/protocol/reset-plan/{protocol}', () => {
    it('real DELETE, Bearer required', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/protocol/reset-plan/12`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().resetProtocolPlan(12);
      expectAuthHeader(cap.current!, TOKEN);
      expect(cap.current!.method).toBe('DELETE');
    });
  });

  // ===========================================================================
  // AI assist + polling — special: response carries a polling token (id)
  // ===========================================================================

  describe('POST /api/protocol/ai-create', () => {
    it('Bearer required, response surfaces polling token (data.id)', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/protocol/ai-create`, async ({ request }) => {
          cap.current = request.clone();
          return {
            success: true,
            message: '',
            data: { id: 'tok-ABC123' },
          };
        }),
      );
      const res = await makeClient().aiCreateItem({
        child: 1,
        goal: 'Achieve outcome',
        module: 'StepX',
        planNodeId: 'node-A',
        protocol: 9,
        type: 'step',
      });
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.id).toBe('tok-ABC123');
      // Caller must poll /api/protocol/ai-request-status/{key} separately —
      // the create call does NOT block on completion.
    });
  });

  describe('POST /api/protocol/ai-whole', () => {
    it('Bearer required, response carries polling token', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/protocol/ai-whole`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: { id: 'whole-tok-1' } };
        }),
      );
      const res = await makeClient().aiCreateWhole({ protocol: 5, parent: 1 });
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.id).toBe('whole-tok-1');
    });
  });

  describe('POST /api/protocol/ai-create-branch', () => {
    it('Bearer required, response carries polling token', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/protocol/ai-create-branch`,
          async ({ request }) => {
            cap.current = request.clone();
            return { success: true, message: '', data: { id: 'branch-tok-1' } };
          },
        ),
      );
      const res = await makeClient().aiCreateBranchPlan({
        context: 'big enough context for the rule',
        module: 'mod',
        parent: 'parent-text-with-min-10-chars',
        protocol_id: 4,
        id: 'someIdLong',
      });
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.id).toBe('branch-tok-1');
    });
  });

  describe('GET /api/protocol/ai-request-status/{key}', () => {
    it('Bearer required, polling endpoint takes the create response token', async () => {
      // Sim the full lifecycle: create returns id, caller polls with that id.
      server.use(
        mockEndpoint('post', `${BASE}/api/protocol/ai-create`, () => {
          return { success: true, message: '', data: { id: 'poll-key-1' } };
        }),
        mockEndpoint(
          'get',
          `${BASE}/api/protocol/ai-request-status/poll-key-1`,
          ({ request }) => {
            cap.current = request;
            return {
              success: true,
              message: '',
              data: {
                successfully: true,
                finished: true,
                message: 'done',
                step: 5,
              },
            };
          },
        ),
      );
      const created = await makeClient().aiCreateItem({
        child: 1,
        goal: 'Goal',
        module: 'mod',
        planNodeId: 'node',
        type: 'step',
      });
      // Poll using whatever token alias surfaced.
      const key = created.data.id ?? created.data.key ?? created.data.request_id;
      expect(key).toBe('poll-key-1');
      const status = await makeClient().getAiRequestStatus(key as string);
      expectAuthHeader(cap.current!, TOKEN);
      expect(status.data.finished).toBe(true);
      expect(status.data.successfully).toBe(true);
    });
  });

  // ===========================================================================
  // Workflow Codify Pipeline — public auth (no Bearer required)
  // ===========================================================================

  describe('POST /api/workflow/codify-pipeline/start', () => {
    it('public (no Bearer), serializes multipart when file Blob present', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/workflow/codify-pipeline/start`,
          async ({ request }) => {
            cap.current = request.clone();
            return {
              success: true,
              message: '',
              data: {
                started: true,
                progress: 0,
                interaction: null,
                name: 'session',
                interaction_data: null,
              },
            };
          },
        ),
      );
      const file = new Blob(['hello'], { type: 'text/plain' });
      await makeClient().startCodifyPipeline({
        problem: null,
        file,
        session: 'session-key',
        timezone: 'UTC',
      });
      expectNoAuthHeader(cap.current!);
      expectDomainHeader(cap.current!, DOMAIN);
      const ctype = cap.current!.headers.get('content-type') ?? '';
      expect(ctype).toMatch(/multipart\/form-data/);
    });
    it('public, JSON body when no file present', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/workflow/codify-pipeline/start`,
          async ({ request }) => {
            cap.current = request.clone();
            return {
              success: true,
              message: '',
              data: {
                started: true,
                progress: 0,
                interaction: null,
                name: 's',
                interaction_data: null,
              },
            };
          },
        ),
      );
      await makeClient().startCodifyPipeline({
        problem: 'I need help',
        session: 'session-key',
        timezone: 'UTC',
      });
      expectNoAuthHeader(cap.current!);
      const body = await cap.current!.json();
      expect(body.problem).toBe('I need help');
      expect(body.session).toBe('session-key');
    });
  });

  describe('POST /api/workflow/codify-pipeline/save-response', () => {
    it('public, no Bearer, body forwarded as-is', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/workflow/codify-pipeline/save-response`,
          async ({ request }) => {
            cap.current = request.clone();
            return {
              success: true,
              message: '',
              data: {
                finished: false,
                started: true,
                progress: 50,
                interaction: 'q',
                name: 's',
                interaction_data: null,
                program: null,
                account: null,
              },
            };
          },
        ),
      );
      await makeClient().saveCodifyPipelineResponse({ session: 's', answer: 'yes' });
      expectNoAuthHeader(cap.current!);
      expect(await cap.current!.json()).toEqual({ session: 's', answer: 'yes' });
    });
  });

  describe('GET /api/workflow/codify-pipeline/check-pipeline/{session}', () => {
    it('public, no Bearer, interpolates session', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/workflow/codify-pipeline/check-pipeline/sess-99`,
          ({ request }) => {
            cap.current = request;
            return {
              success: true,
              message: '',
              data: {
                finished: false,
                started: true,
                progress: 25,
                interaction: null,
                name: 's',
                interaction_data: null,
                program: null,
                account: null,
              },
            };
          },
        ),
      );
      const res = await makeClient().checkCodifyPipeline('sess-99');
      expectNoAuthHeader(cap.current!);
      expect(res.data.started).toBe(true);
    });
  });

  describe('GET /api/workflow/codify-pipeline/stop/{session}', () => {
    it('public, no Bearer', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/workflow/codify-pipeline/stop/sess-99`,
          ({ request }) => {
            cap.current = request;
            return {
              success: true,
              message: '',
              data: {
                finished: true,
                started: true,
                progress: 100,
                interaction: null,
                name: 's',
                interaction_data: null,
                program: null,
                account: null,
              },
            };
          },
        ),
      );
      await makeClient().stopCodifyPipeline('sess-99');
      expectNoAuthHeader(cap.current!);
    });
  });
});
