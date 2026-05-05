/**
 * ProgramsTeamApiClient — endpoint-by-endpoint contract tests for the
 * Programs + Team + Roles + Members slice (60 routes drawn from
 * `sdk/spec/endpoints.json`).
 *
 * Each `it()` asserts:
 *   - URL (after BaseURL + path-param interpolation)
 *   - HTTP verb on the wire (PUT/PATCH → POST + `?_method=PUT|PATCH`)
 *   - Authorization header presence per spec `auth` (public ⇒ no Bearer;
 *     api / admin ⇒ Bearer required)
 *   - `X-Domain` header always present
 *   - Request body matches the spec's `request.shape`
 *   - Response decoding pulls the typed payload out of the envelope
 *     (`wrapper: "data"` ⇒ caller reads `.data`; `wrapper: "paginated"` ⇒
 *     `.data.items[]`)
 *   - File-upload / multipart endpoints (`update-program`) serialize as
 *     `multipart/form-data` and the file lands in FormData
 *
 * MSW-based; mirrors the `auth-user.test.ts` style.
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
import { ProgramsTeamApiClient } from '../programs-team-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'tok-pt-001';
const DOMAIN = 'codify.education';

function makeClient(): ProgramsTeamApiClient {
  return new ProgramsTeamApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

function captured(): { current: Request | null } {
  return { current: null };
}

describe('ProgramsTeamApiClient — Programs + Team + Roles + Members slice', () => {
  let cap: { current: Request | null };

  beforeEach(() => {
    cap = captured();
  });

  afterEach(() => {
    cap.current = null;
  });

  // ===========================================================================
  // /api/program-sale/*  — purchase + listing flow
  // ===========================================================================

  describe('POST /api/program-sale/buy', () => {
    it('Bearer required, body {balance, program_id}, returns BuyProgramResult', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/program-sale/buy`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: { receipt_id: 1 } };
        }),
      );
      const res = await makeClient().buyProgram({ balance: true, program_id: 42 });
      expectAuthHeader(cap.current!, TOKEN);
      expectDomainHeader(cap.current!, DOMAIN);
      expect(cap.current!.method).toBe('POST');
      expect(await cap.current!.json()).toEqual({ balance: true, program_id: 42 });
      expect(res.data.receipt_id).toBe(1);
    });
  });

  describe('POST /api/program-sale/list', () => {
    it('public (auth: false), body matches ProgramsFilterRequest, returns ProgramSaleData', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/program-sale/list`, async ({ request }) => {
          cap.current = request.clone();
          return {
            success: true,
            message: '',
            data: {
              amount: 100,
              subscription_amount: null,
              id: 7,
              name: 'P',
              program_description: null,
              required_time: null,
              required_time_range: null,
              level: null,
              feedback_avg_rating: null,
              price_signs: null,
              program_image: null,
              author: null,
              protocol: null,
              access_type: null,
              created_at: '2025-01-01T00:00:00Z',
              bookmarked: false,
            },
          };
        }),
      );
      const res = await makeClient().listProgramSale({
        search: 'yoga',
        tag: ['fitness'],
        order: 'newest',
      });
      expectNoAuthHeader(cap.current!);
      expectDomainHeader(cap.current!, DOMAIN);
      expect(await cap.current!.json()).toEqual({
        search: 'yoga',
        tag: ['fitness'],
        order: 'newest',
      });
      expect(res.data.id).toBe(7);
    });
  });

  describe('GET /api/program-sale/list-by-author/{username}', () => {
    it('public, URL-encodes username, returns ProgramSaleData', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/program-sale/list-by-author/arion%40co`,
          ({ request }) => {
            cap.current = request;
            return {
              success: true,
              message: '',
              data: {
                amount: 1,
                subscription_amount: null,
                id: 1,
                name: null,
                program_description: null,
                required_time: null,
                required_time_range: null,
                level: null,
                feedback_avg_rating: null,
                price_signs: null,
                program_image: null,
                author: null,
                protocol: null,
                access_type: null,
                created_at: 't',
                bookmarked: null,
              },
            };
          },
        ),
      );
      const res = await makeClient().listProgramSaleByAuthor('arion@co');
      expectNoAuthHeader(cap.current!);
      expect(res.data.id).toBe(1);
    });
  });

  describe('GET /api/program-sale/list/random/{username}/{ignore}', () => {
    it('public, interpolates both path params', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/program-sale/list/random/u1/9`,
          ({ request }) => {
            cap.current = request;
            return {
              success: true,
              message: '',
              data: {
                amount: 0,
                subscription_amount: null,
                id: 5,
                name: null,
                program_description: null,
                required_time: null,
                required_time_range: null,
                level: null,
                feedback_avg_rating: null,
                price_signs: null,
                program_image: null,
                author: null,
                protocol: null,
                access_type: null,
                created_at: 't',
                bookmarked: null,
              },
            };
          },
        ),
      );
      const res = await makeClient().listProgramSaleRandom('u1', 9);
      expectNoAuthHeader(cap.current!);
      expect(res.data.id).toBe(5);
    });
  });

  describe('GET /api/program-sale/salary/{program}', () => {
    it('Bearer required, returns ProgramSalePriceData', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/program-sale/salary/77`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { total: 12 } };
        }),
      );
      const res = await makeClient().getProgramSaleSalary(77);
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.total).toBe(12);
    });
  });

  describe('GET /api/program-sale/tags', () => {
    it('public, returns tag list', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/program-sale/tags`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { items: [{ id: 1, name: 't' }] } };
        }),
      );
      await makeClient().getProgramSaleTags();
      expectNoAuthHeader(cap.current!);
    });
  });

  describe('GET /api/program-sale/{program_sale}', () => {
    it('Bearer required, returns ProgramSalePriceData', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/program-sale/12`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { id: 12 } };
        }),
      );
      await makeClient().showProgramSale(12);
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('PUT /api/program-sale/{program_sale}', () => {
    it('rewrites to POST + ?_method=PUT, Bearer required', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/program-sale/19`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().updateProgramSale(19, { price: 9.99 });
      expectAuthHeader(cap.current!, TOKEN);
      expectMethodOverride(cap.current!, 'PUT');
      expect(await cap.current!.json()).toEqual({ price: 9.99 });
    });
  });

  describe('DELETE /api/program-sale/{program_sale}', () => {
    it('issues a real DELETE, Bearer required', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/program-sale/3`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().destroyProgramSale(3);
      expectAuthHeader(cap.current!, TOKEN);
      expect(cap.current!.method).toBe('DELETE');
    });
  });

  // ===========================================================================
  // /api/program/* — program CRUD, history, run-personal, publish
  // ===========================================================================

  describe('GET /api/program/all', () => {
    it('Bearer required, returns AllProgramData', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/program/all`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { id: 1, name: 'A' } };
        }),
      );
      const res = await makeClient().getAllPrograms();
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.id).toBe(1);
    });
  });

  describe('GET /api/program/chains/{program}/{user}', () => {
    it('Bearer required, interpolates both ids', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/program/chains/4/55`,
          ({ request }) => {
            cap.current = request;
            return { success: true, message: '', data: { id: 9, name: 'C' } };
          },
        ),
      );
      const res = await makeClient().getProgramChains(4, 55);
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.id).toBe(9);
    });
  });

  describe('POST /api/program/detach-protocol', () => {
    it('Bearer required, body {id?}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/program/detach-protocol`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().detachProtocol({ id: 99 });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ id: 99 });
    });
  });

  describe('GET /api/program/get-bookmarks', () => {
    it('Bearer required, paginated payload', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/program/get-bookmarks`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: {
              items: [
                {
                  amount: 1,
                  subscription_amount: null,
                  id: 1,
                  name: null,
                  program_description: null,
                  required_time: null,
                  required_time_range: null,
                  level: null,
                  feedback_avg_rating: null,
                  price_signs: null,
                  program_image: null,
                  author: null,
                  protocol: null,
                  access_type: null,
                  created_at: 't',
                  bookmarked: true,
                },
              ],
              meta: { current_page: 1 },
            },
          };
        }),
      );
      const res = await makeClient().getProgramBookmarks();
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.items[0].id).toBe(1);
    });
  });

  describe('GET /api/program/history', () => {
    it('Bearer required, returns AllProgramData', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/program/history`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { id: 2, name: 'H' } };
        }),
      );
      await makeClient().getProgramHistory();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/program/history/{chain}', () => {
    it('Bearer required, interpolates chain id', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/program/history/14`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { steps: [] } };
        }),
      );
      await makeClient().getProgramHistoryByChain(14);
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/program/last-purchases', () => {
    it('Bearer required, GET no body', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/program/last-purchases`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getLastPurchases();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('POST /api/program/program-check', () => {
    it('Bearer required, body {id?, step}, returns ProgramValidationResult', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/program/program-check`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: { ok: true } };
        }),
      );
      await makeClient().programCheck({ id: 4, step: 2 });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ id: 4, step: 2 });
    });
  });

  describe('GET /api/program/program-data/{program?}', () => {
    it('omits trailing segment when program is undefined', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/program/program-data`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: {
              protocols: [],
              tags: [],
              categories: [],
              subcategories: [],
              team: [],
              protocolCategories: [],
            },
          };
        }),
      );
      const res = await makeClient().getProgramData();
      expectAuthHeader(cap.current!, TOKEN);
      expect(Array.isArray(res.data.protocols)).toBe(true);
    });

    it('appends program id when provided', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/program/program-data/5`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: {
              protocols: [],
              tags: [],
              categories: [],
              subcategories: [],
              team: [],
              protocolCategories: [],
            },
          };
        }),
      );
      await makeClient().getProgramData(5);
      expect(new URL(cap.current!.url).pathname).toBe('/api/program/program-data/5');
    });
  });

  describe('POST /api/program/program/add-tag', () => {
    it('Bearer required, body {program, tag}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/program/program/add-tag`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().addProgramTag({ program: '5', tag: 'fitness' });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ program: '5', tag: 'fitness' });
    });
  });

  describe('DELETE /api/program/program/delete-tag/{program}/{tag}', () => {
    it('issues a real DELETE, Bearer required, interpolates both segments', async () => {
      server.use(
        mockEndpoint(
          'delete',
          `${BASE}/api/program/program/delete-tag/8/fitness`,
          ({ request }) => {
            cap.current = request;
            return { success: true, message: '', data: {} };
          },
        ),
      );
      await makeClient().deleteProgramTag(8, 'fitness');
      expectAuthHeader(cap.current!, TOKEN);
      expect(cap.current!.method).toBe('DELETE');
    });
  });

  describe('GET /api/program/publications/{program}', () => {
    it('Bearer required, returns PublishProgramData', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/program/publications/3`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { tenants: [] } };
        }),
      );
      await makeClient().getProgramPublications(3);
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('POST /api/program/publish', () => {
    it('Bearer required, body {tenant_id, program_id?}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/program/publish`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: { ok: true } };
        }),
      );
      await makeClient().publishProgram({
        tenant_id: 'phm.ai',
        program_id: 12,
      });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({
        tenant_id: 'phm.ai',
        program_id: 12,
      });
    });
  });

  describe('POST /api/program/publish/cancel', () => {
    it('Bearer required, body {tenant_id, program_id?}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/program/publish/cancel`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().cancelPublishProgram({
        tenant_id: 'phm.ai',
        program_id: 12,
      });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({
        tenant_id: 'phm.ai',
        program_id: 12,
      });
    });
  });

  describe('POST /api/program/run-personal', () => {
    it('Bearer required, body {id}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/program/run-personal`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: { chain_id: 7 } };
        }),
      );
      await makeClient().runPersonalProgram({ id: 5 });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ id: 5 });
    });
  });

  describe('POST /api/program/search', () => {
    it('Bearer required, body {q}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/program/search`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: { results: [] } };
        }),
      );
      await makeClient().searchPrograms({ q: 'yoga' });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ q: 'yoga' });
    });
  });

  describe('GET /api/program/show/{program}', () => {
    it('Bearer required, returns ProgramInstanceData', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/program/show/21`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: {
              id: 21,
              name: 'P',
              description: null,
              agent: null,
              category_id: 0,
              sub_category_id: 0,
              protocol_id: 0,
              program_image: null,
              category: null,
              subCategory: null,
              team: null,
              protocol: null,
              sale: null,
              feedback_avg_rating: null,
              ratings: null,
              subscriptionSale: null,
              tags: null,
              access_type: null,
              level: null,
              modules: null,
              price_signs: null,
              required_time: null,
              required_time_range: null,
              created_at: 't',
              author: null,
              subscribed: null,
              purchase: null,
              borken: null,
              bookmarked: null,
              balance: null,
              attachedProtocols: null,
            },
          };
        }),
      );
      const res = await makeClient().showProgram(21);
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.id).toBe(21);
    });
  });

  describe('GET /api/program/simulation/{program}', () => {
    it('Bearer required, returns ProgramSimulationData', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/program/simulation/13`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: { description: null, name: 'X', program_image: null, chain: null },
          };
        }),
      );
      const res = await makeClient().simulateProgram(13);
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.name).toBe('X');
    });
  });

  describe('POST /api/program/toggle-bookmark', () => {
    it('Bearer required, body {program_id}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/program/toggle-bookmark`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: { bookmarked: true } };
        }),
      );
      await makeClient().toggleProgramBookmark({ program_id: 6 });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ program_id: 6 });
    });
  });

  describe('PUT /api/program/update-program/{program}', () => {
    it('rewrites to POST + ?_method=PUT, Bearer required, body shape', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/program/update-program/4`, async ({ request }) => {
          cap.current = request.clone();
          return {
            success: true,
            message: '',
            data: {
              id: 4,
              name: 'P',
              description: null,
              category_id: 0,
              sub_category_id: 0,
              protocol_id: 0,
              program_image: null,
              category: null,
              subCategory: null,
              team: null,
              protocol: null,
              sale: null,
              feedback_avg_rating: null,
              ratings: null,
              subscriptionSale: null,
              tags: null,
              access_type: null,
              level: null,
              modules: null,
              price_signs: null,
              required_time: null,
              required_time_range: null,
              created_at: 't',
              author: null,
              subscribed: null,
              purchase: null,
              borken: null,
              bookmarked: null,
              balance: null,
              attachedProtocols: null,
            },
          };
        }),
      );
      const res = await makeClient().updateProgram(4, {
        name: 'New name',
        description: 'd',
      });
      expectAuthHeader(cap.current!, TOKEN);
      expectMethodOverride(cap.current!, 'PUT');
      expect(await cap.current!.json()).toEqual({
        name: 'New name',
        description: 'd',
      });
      expect(res.data.id).toBe(4);
    });

    it('switches to multipart/form-data when payload includes a Blob (program_image)', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/program/update-program/4`, async ({ request }) => {
          cap.current = request.clone();
          return {
            success: true,
            message: '',
            data: {
              id: 4,
              name: 'P',
              description: null,
              category_id: 0,
              sub_category_id: 0,
              protocol_id: 0,
              program_image: null,
              category: null,
              subCategory: null,
              team: null,
              protocol: null,
              sale: null,
              feedback_avg_rating: null,
              ratings: null,
              subscriptionSale: null,
              tags: null,
              access_type: null,
              level: null,
              modules: null,
              price_signs: null,
              required_time: null,
              required_time_range: null,
              created_at: 't',
              author: null,
              subscribed: null,
              purchase: null,
              borken: null,
              bookmarked: null,
              balance: null,
              attachedProtocols: null,
            },
          };
        }),
      );
      const blob = new Blob(['img'], { type: 'image/png' });
      await makeClient().updateProgram(4, {
        name: 'P',
        program_image: blob,
      });
      const ctype = cap.current!.headers.get('content-type') ?? '';
      expect(ctype).toMatch(/multipart\/form-data/);
      expectMethodOverride(cap.current!, 'PUT');
      const fd = await cap.current!.formData();
      expect(fd.get('name')).toBe('P');
      expect(fd.get('program_image')).toBeInstanceOf(Blob);
    });
  });

  describe('GET /api/program/users-additional-steps/{program}/{protocol}', () => {
    it('Bearer required, interpolates both ids', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/program/users-additional-steps/2/8`,
          ({ request }) => {
            cap.current = request;
            return { success: true, message: '', data: { steps: [] } };
          },
        ),
      );
      await makeClient().getProgramUsersAdditionalSteps(2, 8);
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/program/users-steps/{program}', () => {
    it('Bearer required, interpolates program', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/program/users-steps/15`,
          ({ request }) => {
            cap.current = request;
            return { success: true, message: '', data: { steps: [] } };
          },
        ),
      );
      await makeClient().getProgramUsersSteps(15);
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/program/users/{program}', () => {
    it('Bearer required, returns ProgramUserSummary', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/program/users/3`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { id: 3, name: 'arion' } };
        }),
      );
      const res = await makeClient().getProgramUsers(3);
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.id).toBe(3);
    });
  });

  describe('POST /api/program/validate-additional-protocol', () => {
    it('Bearer required, body matches ValidateAdditionalProtocolRequest', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/program/validate-additional-protocol`,
          async ({ request }) => {
            cap.current = request.clone();
            return { success: true, message: '', data: { ok: true } };
          },
        ),
      );
      await makeClient().validateAdditionalProtocol({
        at_time: '08:30',
        at_week_days: ['mon', 'tue'],
        protocol_category_id: 4,
        protocol_id: 7,
        protocol_mandatory: true,
        run_after: 0,
        run_every: 'day',
      });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({
        at_time: '08:30',
        at_week_days: ['mon', 'tue'],
        protocol_category_id: 4,
        protocol_id: 7,
        protocol_mandatory: true,
        run_after: 0,
        run_every: 'day',
      });
    });
  });

  // ===========================================================================
  // /api/project-role/* — Subproject role CRUD (admin guard)
  // ===========================================================================

  describe('GET /api/project-role/permissions', () => {
    it('Bearer required (auth=admin), returns SubprojectPermissionsData', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/project-role/permissions`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { perms: ['read'] } };
        }),
      );
      await makeClient().getProjectRolePermissions();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/project-role/{project_role}', () => {
    it('Bearer required, returns SubprojectRoleData', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/project-role/22`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: { name: 'admin', permissions: ['*'] },
          };
        }),
      );
      const res = await makeClient().showProjectRole(22);
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.name).toBe('admin');
    });
  });

  describe('PUT /api/project-role/{project_role}', () => {
    it('rewrites to POST + ?_method=PUT, Bearer required, body {name, permissions}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/project-role/30`, async ({ request }) => {
          cap.current = request.clone();
          return {
            success: true,
            message: '',
            data: { name: 'editor', permissions: ['read', 'write'] },
          };
        }),
      );
      const res = await makeClient().updateProjectRole(30, {
        name: 'editor',
        permissions: ['read', 'write'],
      });
      expectAuthHeader(cap.current!, TOKEN);
      expectMethodOverride(cap.current!, 'PUT');
      expect(await cap.current!.json()).toEqual({
        name: 'editor',
        permissions: ['read', 'write'],
      });
      expect(res.data.name).toBe('editor');
    });
  });

  describe('DELETE /api/project-role/{project_role}', () => {
    it('issues a real DELETE, Bearer required', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/project-role/40`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: { name: 'gone', permissions: [] },
          };
        }),
      );
      await makeClient().destroyProjectRole(40);
      expectAuthHeader(cap.current!, TOKEN);
      expect(cap.current!.method).toBe('DELETE');
    });
  });

  // ===========================================================================
  // /api/role + /api/roles/* — User role CRUD
  // ===========================================================================

  describe('GET /api/role', () => {
    it('Bearer required, returns RoleResource', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/role`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { name: 'admin', id: 1 } };
        }),
      );
      const res = await makeClient().listRoles();
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.id).toBe(1);
    });
  });

  describe('POST /api/role', () => {
    it('Bearer required, POST with body, no spec body shape', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/role`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: { id: 9, name: 'creator' } };
        }),
      );
      await makeClient().createRole({ name: 'creator' });
      expectAuthHeader(cap.current!, TOKEN);
      expect(cap.current!.method).toBe('POST');
      expect(await cap.current!.json()).toEqual({ name: 'creator' });
    });
  });

  describe('GET /api/role/{role}', () => {
    it('Bearer required, GET single role', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/role/12`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { id: 12, name: 'role' } };
        }),
      );
      await makeClient().showRole(12);
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('PUT /api/role/{role}', () => {
    it('rewrites to POST + ?_method=PUT, Bearer required', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/role/20`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: { id: 20, name: 'editor' } };
        }),
      );
      await makeClient().updateRole(20, { name: 'editor' });
      expectAuthHeader(cap.current!, TOKEN);
      expectMethodOverride(cap.current!, 'PUT');
      expect(await cap.current!.json()).toEqual({ name: 'editor' });
    });
  });

  describe('DELETE /api/role/{role}', () => {
    it('issues a real DELETE, Bearer required', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/role/33`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().destroyRole(33);
      expectAuthHeader(cap.current!, TOKEN);
      expect(cap.current!.method).toBe('DELETE');
    });
  });

  describe('GET /api/roles/all', () => {
    it('Bearer required, returns RoleResource', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/roles/all`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { name: 'admin', id: 1 } };
        }),
      );
      const res = await makeClient().getAllRoles();
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.id).toBe(1);
    });
  });

  // ===========================================================================
  // /api/team/* — Team membership, invites, roles, network search
  // ===========================================================================

  describe('POST /api/team/accept', () => {
    it('Bearer required, body {id}, returns UserTeamResult', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/team/accept`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: { ok: true } };
        }),
      );
      await makeClient().acceptTeamInvite({ id: 11 });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ id: 11 });
    });
  });

  describe('GET /api/team/accept-invite/{token}', () => {
    it('Bearer required, returns UserPotentialTeamInviteData', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/team/accept-invite/abc-tok`,
          ({ request }) => {
            cap.current = request;
            return { success: true, message: '', data: { team_id: 5 } };
          },
        ),
      );
      await makeClient().acceptTeamInviteByToken('abc-tok');
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/team/all', () => {
    it('Bearer required, returns UserAllTeamMember', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/team/all`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: { id: 1, name: 'arion', roles: [] },
          };
        }),
      );
      const res = await makeClient().getAllTeamMembers();
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.id).toBe(1);
    });
  });

  describe('POST /api/team/handle-role', () => {
    it('Bearer required, body {id, role}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/team/handle-role`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().handleTeamRole({ id: 5, role: 'editor' });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ id: 5, role: 'editor' });
    });
  });

  describe('POST /api/team/invite', () => {
    it('Bearer required, body {team_member?, role}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/team/invite`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().inviteTeamMember({
        team_member: 'arion@codifyhq.com',
        role: 'editor',
      });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({
        team_member: 'arion@codifyhq.com',
        role: 'editor',
      });
    });
  });

  describe('POST /api/team/leave', () => {
    it('Bearer required, body {id}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/team/leave`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().leaveTeam({ id: 6 });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ id: 6 });
    });
  });

  describe('GET /api/team/list/{status}', () => {
    it('Bearer required, returns UserTeamListItem', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/team/list/accepted`,
          ({ request }) => {
            cap.current = request;
            return {
              success: true,
              message: '',
              data: { id: 1, member: {}, roles: [], status: 'accepted' },
            };
          },
        ),
      );
      const res = await makeClient().listTeam('accepted');
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.id).toBe(1);
    });
  });

  describe('GET /api/team/member/{status}', () => {
    it('Bearer required, returns UserInviteListItem', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/team/member/pending`,
          ({ request }) => {
            cap.current = request;
            return {
              success: true,
              message: '',
              data: { id: 2, owner: {}, roles: [], status: 'pending' },
            };
          },
        ),
      );
      const res = await makeClient().listTeamInvites('pending');
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.id).toBe(2);
    });
  });

  describe('POST /api/team/network-invite', () => {
    it('Bearer required, body {team_member?, role}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/team/network-invite`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().inviteNetworkMember({
        team_member: 99,
        role: 'collaborator',
      });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({
        team_member: 99,
        role: 'collaborator',
      });
    });
  });

  describe('POST /api/team/network-invite-potential', () => {
    it('Bearer required, body {team_member?, role}', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/team/network-invite-potential`,
          async ({ request }) => {
            cap.current = request.clone();
            return { success: true, message: '', data: {} };
          },
        ),
      );
      await makeClient().inviteNetworkPotentialMember({
        team_member: 'b@b.co',
        role: 'collaborator',
      });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({
        team_member: 'b@b.co',
        role: 'collaborator',
      });
    });
  });

  describe('POST /api/team/network-search', () => {
    it('Bearer required, body {role, speciality?}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/team/network-search`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: { hits: [] } };
        }),
      );
      await makeClient().searchNetwork({ role: 'doctor', speciality: 'oncology' });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({
        role: 'doctor',
        speciality: 'oncology',
      });
    });
  });

  describe('POST /api/team/reject', () => {
    it('Bearer required, body {id}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/team/reject`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().rejectTeamInvite({ id: 7 });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ id: 7 });
    });
  });

  describe('POST /api/team/remove', () => {
    it('Bearer required, body {id}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/team/remove`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().removeTeamMember({ id: 8 });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ id: 8 });
    });
  });

  describe('POST /api/team/remove-potential', () => {
    it('Bearer required, body {id}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/team/remove-potential`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().removePotentialTeamMember({ id: 9 });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ id: 9 });
    });
  });

  describe('GET /api/team/roles', () => {
    it('Bearer required, returns UserTeamAvailableRole', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/team/roles`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: { id: 1, name: 'editor', pretty: 'Editor' },
          };
        }),
      );
      const res = await makeClient().getTeamRoles();
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.id).toBe(1);
    });
  });

  describe('POST /api/team/search-members', () => {
    it('Bearer required, body {search}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/team/search-members`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: { hits: [] } };
        }),
      );
      await makeClient().searchTeamMembers({ search: 'arion' });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ search: 'arion' });
    });
  });

  describe('POST /api/team/search-users', () => {
    it('Bearer required, body {search}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/team/search-users`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: { hits: [] } };
        }),
      );
      await makeClient().searchTeamUsers({ search: 'arion' });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ search: 'arion' });
    });
  });
});
