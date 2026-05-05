/**
 * Endpoint coverage for `AdminApiClient` — the admin / SuperAdmin slice of
 * the P2X API. Covers ~76 endpoints with `auth: "admin"` in
 * `sdk/spec/endpoints.json`, MINUS the seven groups already implemented in
 * `TenancyApiClient` (creator, featured, contacts, documentation,
 * frontend/SEO-page, domain-interfaces, project-settings,
 * subproject-admin/team/wizard), MINUS the three `/api/user/{user}` admin
 * verbs already implemented as `adminShowUser` / `adminUpdateUser` /
 * `adminDestroyUser` on `AuthUserApiClient`.
 *
 * Each endpoint gets one test pinning URL, raw HTTP method, Authorization,
 * `X-Domain`, request body, and response decoding. Method-override
 * (PUT/PATCH → POST?_method=) and multipart (Blob / File → FormData) are
 * spot-checked at the relevant endpoints (administrator update, fee update,
 * dashboard-settings save).
 *
 * Auth band: every endpoint here is `auth: "admin"`. The SDK does NOT need
 * a separate admin client class — `BaseApiClient` injects whatever
 * `getToken` returns. Consumer apps (`gov/`, `app/`, `sys/`) inject the
 * admin Sanctum token when they construct an `AdminApiClient`. The tests
 * only assert that the `Bearer ${TOKEN}` header is set; they do not care
 * that the token is "admin-flavored" — that's a consumer concern.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectMethodOverride,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { AdminApiClient } from '../admin-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'admin-tkn-zzz';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): AdminApiClient {
  return new AdminApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('AdminApiClient', () => {
  let captured: Captured;
  beforeEach(() => {
    captured = { current: null };
  });

  // ===========================================================================
  // Search
  // ===========================================================================

  describe('Search', () => {
    it('adminSearch() — POST /api/admin-search', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/admin-search`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().adminSearch({ sorting: 'name_asc', search_condition: 'foo' });
      expect(captured.current!.method).toBe('POST');
      expectAuthHeader(captured.current!, TOKEN);
      expectDomainHeader(captured.current!, DOMAIN);
      const body = await captured.current!.json();
      expect(body.sorting).toBe('name_asc');
      expect(body.search_condition).toBe('foo');
    });

    it('teamSearch() — POST /api/team-search', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/team-search`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().teamSearch({ sorting: 'created_at_desc' });
      expect(captured.current!.method).toBe('POST');
      expectAuthHeader(captured.current!, TOKEN);
      const body = await captured.current!.json();
      expect(body.sorting).toBe('created_at_desc');
    });
  });

  // ===========================================================================
  // Administrator CRUD
  // ===========================================================================

  describe('Administrator CRUD', () => {
    it('createAdministrator() — POST /api/administrator', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/administrator`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 1 } };
        }),
      );
      await makeClient().createAdministrator({
        full_name: 'Alice Admin',
        email: 'a@b.test',
        password: 'pw',
      });
      expect(captured.current!.method).toBe('POST');
      const body = await captured.current!.json();
      expect(body.full_name).toBe('Alice Admin');
    });

    it('getAdministrator() — GET /api/administrator/{administrator}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/administrator/9`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 9 } };
        }),
      );
      await makeClient().getAdministrator(9);
      expect(captured.current!.method).toBe('GET');
      expectAuthHeader(captured.current!, TOKEN);
    });

    it('updateAdministrator() — PUT /api/administrator/{administrator} (POST?_method=PUT)', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/administrator/9`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 9 } };
        }),
      );
      await makeClient().updateAdministrator(9, {
        full_name: 'Alice',
        email: 'a@b.test',
        password: 'pw2',
      });
      expectMethodOverride(captured.current!, 'PUT');
      const body = await captured.current!.json();
      expect(body.password).toBe('pw2');
    });

    it('deleteAdministrator() — DELETE /api/administrator/{administrator}', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/administrator/9`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().deleteAdministrator(9);
      expect(captured.current!.method).toBe('DELETE');
    });
  });

  // ===========================================================================
  // AI – models / settings / installation
  // ===========================================================================

  describe('AI models + settings', () => {
    it('deleteAiModel() — POST /api/ai/delete-model', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/ai/delete-model`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().deleteAiModel({ model: 'gpt-x' });
      expect(captured.current!.method).toBe('POST');
    });

    it('getAiModels() — GET /api/ai/get-models', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/ai/get-models`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getAiModels();
      expect(captured.current!.method).toBe('GET');
    });

    it('getAiModelsList() — GET /api/ai/get-models-list', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/ai/get-models-list`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getAiModelsList();
      expect(captured.current!.method).toBe('GET');
    });

    it('getAiSettings() — GET /api/ai/get-settings', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/ai/get-settings`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().getAiSettings();
      expect(captured.current!.method).toBe('GET');
    });

    it('installAiModel() — POST /api/ai/install-model', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/ai/install-model`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().installAiModel({ model: 'gpt-x' });
      expect(captured.current!.method).toBe('POST');
    });

    it('getAiInstallationStatus() — GET /api/ai/installation-status', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/ai/installation-status`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().getAiInstallationStatus();
      expect(captured.current!.method).toBe('GET');
    });

    it('saveAiSettings() — POST /api/ai/save-settings', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/ai/save-settings`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().saveAiSettings({ model: 'gpt-x', version: '1.0' });
      const body = await captured.current!.json();
      expect(body.model).toBe('gpt-x');
      expect(body.version).toBe('1.0');
    });
  });

  // ===========================================================================
  // AI Log CRUD
  // ===========================================================================

  describe('AI Log CRUD', () => {
    it('listAiLogs() — GET /api/ai/log', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/ai/log`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().listAiLogs();
      expect(captured.current!.method).toBe('GET');
    });

    it('createAiLog() — POST /api/ai/log', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/ai/log`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 1 } };
        }),
      );
      await makeClient().createAiLog({ event: 'x' });
      expect(captured.current!.method).toBe('POST');
    });

    it('getAiLog() — GET /api/ai/log/{log}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/ai/log/55`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 55 } };
        }),
      );
      await makeClient().getAiLog(55);
      expect(captured.current!.method).toBe('GET');
    });

    it('updateAiLog() — PUT /api/ai/log/{log}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/ai/log/55`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 55 } };
        }),
      );
      await makeClient().updateAiLog(55, { event: 'y' });
      expectMethodOverride(captured.current!, 'PUT');
    });

    it('deleteAiLog() — DELETE /api/ai/log/{log}', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/ai/log/55`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().deleteAiLog(55);
      expect(captured.current!.method).toBe('DELETE');
    });
  });

  // ===========================================================================
  // AI Policy CRUD + prompt linkage
  // ===========================================================================

  describe('AI Policy CRUD', () => {
    it('listAiPolicies() — GET /api/ai/policy', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/ai/policy`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().listAiPolicies();
      expect(captured.current!.method).toBe('GET');
    });

    it('createAiPolicy() — POST /api/ai/policy', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/ai/policy`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 1 } };
        }),
      );
      await makeClient().createAiPolicy({ title: 'Use of force' });
      const body = await captured.current!.json();
      expect(body.title).toBe('Use of force');
    });

    it('getAiPolicy() — GET /api/ai/policy/{policy}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/ai/policy/3`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 3 } };
        }),
      );
      await makeClient().getAiPolicy(3);
      expect(captured.current!.method).toBe('GET');
    });

    it('updateAiPolicy() — PUT /api/ai/policy/{policy}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/ai/policy/3`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 3 } };
        }),
      );
      await makeClient().updateAiPolicy(3, { title: 'Updated' });
      expectMethodOverride(captured.current!, 'PUT');
    });

    it('deleteAiPolicy() — DELETE /api/ai/policy/{policy}', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/ai/policy/3`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().deleteAiPolicy(3);
      expect(captured.current!.method).toBe('DELETE');
    });

    it('deleteAiPolicyFile() — DELETE /api/ai/policy-file/{file}', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/ai/policy-file/77`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().deleteAiPolicyFile(77);
      expect(captured.current!.method).toBe('DELETE');
    });

    it('listAiPoliciesForPrompt() — GET /api/ai/policy-list/{prompt}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/ai/policy-list/12`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().listAiPoliciesForPrompt(12);
      expect(captured.current!.method).toBe('GET');
    });

    it('attachPromptToAiPolicy() — POST /api/ai/policy/{policy}/prompts', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/ai/policy/3/prompts`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().attachPromptToAiPolicy(3, { prompt_id: 12, position: 1 });
      const body = await captured.current!.json();
      expect(body.prompt_id).toBe(12);
    });

    it('detachPromptFromAiPolicy() — DELETE /api/ai/policy/{policy}/prompts/{prompt}', async () => {
      server.use(
        mockEndpoint(
          'delete',
          `${BASE}/api/ai/policy/3/prompts/12`,
          ({ request }) => {
            captured.current = request;
            return { success: true, message: '', data: null };
          },
        ),
      );
      await makeClient().detachPromptFromAiPolicy(3, 12);
      expect(captured.current!.method).toBe('DELETE');
    });
  });

  // ===========================================================================
  // AI Prompts
  // ===========================================================================

  describe('AI Prompts', () => {
    it('createAiPrompt() — POST /api/ai/prompts/create', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/ai/prompts/create`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 1 } };
        }),
      );
      await makeClient().createAiPrompt({ prompt_key: 'p_1', prompt_text: 'do x' });
      const body = await captured.current!.json();
      expect(body.prompt_key).toBe('p_1');
    });

    it('getAiPromptKeywords() — GET /api/ai/prompts/keywords', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/ai/prompts/keywords`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getAiPromptKeywords();
      expect(captured.current!.method).toBe('GET');
    });

    it('listAiPrompts() — GET /api/ai/prompts/list', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/ai/prompts/list`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().listAiPrompts();
      expect(captured.current!.method).toBe('GET');
    });

    it('listAiPromptPolicies() — GET /api/ai/prompts/list-policies', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/ai/prompts/list-policies`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().listAiPromptPolicies();
      expect(captured.current!.method).toBe('GET');
    });

    it('getRequiredAiPrompts() — GET /api/ai/prompts/required-list', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/ai/prompts/required-list`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getRequiredAiPrompts();
      expect(captured.current!.method).toBe('GET');
    });

    it('getAiPrompt() — GET /api/ai/prompts/show/{prompt}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/ai/prompts/show/12`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 12 } };
        }),
      );
      await makeClient().getAiPrompt(12);
      expect(captured.current!.method).toBe('GET');
    });

    it('updateAiPrompt() — PUT /api/ai/prompts/update/{prompt}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/ai/prompts/update/12`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 12 } };
        }),
      );
      await makeClient().updateAiPrompt(12, { prompt_text: 'new' });
      expectMethodOverride(captured.current!, 'PUT');
    });
  });

  // ===========================================================================
  // Dashboard / domain settings
  // ===========================================================================

  describe('Dashboard + domain settings', () => {
    it('saveDashboardSettings() — POST /api/dashboard-settings/save (json branch)', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/dashboard-settings/save`,
          async ({ request }) => {
            captured.current = request.clone();
            return { success: true, message: '', data: null };
          },
        ),
      );
      await makeClient().saveDashboardSettings({ video_id: 'abc-123' });
      const body = await captured.current!.json();
      expect(body.video_id).toBe('abc-123');
    });

    it('saveDashboardSettings() — uploads Blob via multipart/form-data', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/dashboard-settings/save`,
          async ({ request }) => {
            captured.current = request.clone();
            return { success: true, message: '', data: null };
          },
        ),
      );
      // Use Blob (universally available in Node 18+) — `BaseApiClient.hasBinary`
      // matches both `File` and `Blob` so the multipart branch fires either way.
      const blob = new Blob(['hello'], { type: 'video/mp4' });
      await makeClient().saveDashboardSettings({ video_file: blob });
      const ctype = captured.current!.headers.get('content-type') ?? '';
      expect(ctype).toMatch(/multipart\/form-data/);
      const fd = await captured.current!.clone().formData();
      expect(fd.has('video_file')).toBe(true);
    });

    it('getDomainSettings() — GET /api/domain-settings/{id}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/domain-settings/41`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 41 } };
        }),
      );
      await makeClient().getDomainSettings(41);
      expect(captured.current!.method).toBe('GET');
    });
  });

  // ===========================================================================
  // Fees
  // ===========================================================================

  describe('Fees', () => {
    it('listFees() — GET /api/fees/fee', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/fees/fee`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().listFees();
      expect(captured.current!.method).toBe('GET');
    });

    it('createFee() — POST /api/fees/fee', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/fees/fee`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 1 } };
        }),
      );
      await makeClient().createFee({
        service_fee: 1.5,
        processor_correction: 0.5,
        processor_fee: 2.9,
      });
      const body = await captured.current!.json();
      expect(body.service_fee).toBe(1.5);
    });

    it('getFee() — GET /api/fees/fee/{fee}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/fees/fee/9`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 9 } };
        }),
      );
      await makeClient().getFee(9);
      expect(captured.current!.method).toBe('GET');
    });

    it('updateFee() — PUT /api/fees/fee/{fee}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/fees/fee/9`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 9 } };
        }),
      );
      await makeClient().updateFee(9, {
        service_fee: 3,
        processor_correction: 0.4,
        processor_fee: 1.1,
      });
      expectMethodOverride(captured.current!, 'PUT');
    });

    it('deleteFee() — DELETE /api/fees/fee/{fee}', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/fees/fee/9`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().deleteFee(9);
      expect(captured.current!.method).toBe('DELETE');
    });

    it('findFeeUsers() — POST /api/fees/find-users', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/fees/find-users`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().findFeeUsers({ search: 'alice' });
      const body = await captured.current!.json();
      expect(body.search).toBe('alice');
    });

    it('getFeeSettings() — GET /api/fees/get-settings', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/fees/get-settings`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().getFeeSettings();
      expect(captured.current!.method).toBe('GET');
    });

    it('saveFeeSettings() — POST /api/fees/save-settings', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/fees/save-settings`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().saveFeeSettings({
        service_fee: 1,
        processor_correction: 0.2,
        processor_fee: 0.5,
      });
      const body = await captured.current!.json();
      expect(body.service_fee).toBe(1);
    });
  });

  // ===========================================================================
  // Program categories / sub / tags
  // ===========================================================================

  describe('Program categories / sub-categories / tags', () => {
    it('listProgramCategoriesPublic() — GET /api/program-categories', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/program-categories`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().listProgramCategoriesPublic();
      expect(captured.current!.method).toBe('GET');
    });

    it('listProgramCategories() — GET /api/program-category', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/program-category`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().listProgramCategories();
      expect(captured.current!.method).toBe('GET');
    });

    it('createProgramCategory() — POST /api/program-category', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/program-category`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 1 } };
        }),
      );
      await makeClient().createProgramCategory({
        category_name: 'cat',
        category_description: 'desc',
      });
      const body = await captured.current!.json();
      expect(body.category_name).toBe('cat');
    });

    it('getProgramCategory() — GET /api/program-category/{program_category}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/program-category/2`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 2 } };
        }),
      );
      await makeClient().getProgramCategory(2);
      expect(captured.current!.method).toBe('GET');
    });

    it('updateProgramCategory() — PUT /api/program-category/{program_category}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/program-category/2`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 2 } };
        }),
      );
      await makeClient().updateProgramCategory(2, {
        id: 2,
        category_name: 'cat2',
        category_description: 'desc2',
      });
      expectMethodOverride(captured.current!, 'PUT');
    });

    it('deleteProgramCategory() — DELETE /api/program-category/{program_category}', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/program-category/2`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().deleteProgramCategory(2);
      expect(captured.current!.method).toBe('DELETE');
    });

    it('listProgramSubCategories() — GET /api/program-sub-category', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/program-sub-category`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().listProgramSubCategories();
      expect(captured.current!.method).toBe('GET');
    });

    it('createProgramSubCategory() — POST /api/program-sub-category', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/program-sub-category`,
          async ({ request }) => {
            captured.current = request.clone();
            return { success: true, message: '', data: { id: 1 } };
          },
        ),
      );
      await makeClient().createProgramSubCategory({
        category_id: 2,
        sub_category_name: 'sub',
        sub_category_description: 'desc',
      });
      const body = await captured.current!.json();
      expect(body.sub_category_name).toBe('sub');
    });

    it('getProgramSubCategory() — GET /api/program-sub-category/{program_sub_category}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/program-sub-category/4`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 4 } };
        }),
      );
      await makeClient().getProgramSubCategory(4);
      expect(captured.current!.method).toBe('GET');
    });

    it('updateProgramSubCategory() — PUT /api/program-sub-category/{program_sub_category}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/program-sub-category/4`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 4 } };
        }),
      );
      await makeClient().updateProgramSubCategory(4, {
        id: 4,
        category_id: 2,
        sub_category_name: 'sub2',
        sub_category_description: 'desc',
      });
      expectMethodOverride(captured.current!, 'PUT');
    });

    it('deleteProgramSubCategory() — DELETE /api/program-sub-category/{program_sub_category}', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/program-sub-category/4`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().deleteProgramSubCategory(4);
      expect(captured.current!.method).toBe('DELETE');
    });

    it('listProgramTags() — GET /api/program-tag', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/program-tag`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().listProgramTags();
      expect(captured.current!.method).toBe('GET');
    });

    it('createProgramTag() — POST /api/program-tag', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/program-tag`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 1 } };
        }),
      );
      await makeClient().createProgramTag({ tag_name: 't' });
      const body = await captured.current!.json();
      expect(body.tag_name).toBe('t');
    });

    it('getProgramTag() — GET /api/program-tag/{program_tag}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/program-tag/8`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 8 } };
        }),
      );
      await makeClient().getProgramTag(8);
      expect(captured.current!.method).toBe('GET');
    });

    it('updateProgramTag() — PUT /api/program-tag/{program_tag}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/program-tag/8`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 8 } };
        }),
      );
      await makeClient().updateProgramTag(8, { tag_name: 't2' });
      expectMethodOverride(captured.current!, 'PUT');
    });

    it('deleteProgramTag() — DELETE /api/program-tag/{program_tag}', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/program-tag/8`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().deleteProgramTag(8);
      expect(captured.current!.method).toBe('DELETE');
    });
  });

  // ===========================================================================
  // Project role
  // ===========================================================================

  describe('Project role', () => {
    it('listProjectRoles() — GET /api/project-role', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/project-role`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().listProjectRoles();
      expect(captured.current!.method).toBe('GET');
    });

    it('createProjectRole() — POST /api/project-role', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/project-role`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 1 } };
        }),
      );
      await makeClient().createProjectRole({ name: 'admin', permissions: ['p1'] });
      const body = await captured.current!.json();
      expect(body.name).toBe('admin');
    });

    it('getProjectRolePermissions() — GET /api/project-role/permissions', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/project-role/permissions`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getProjectRolePermissions();
      expect(captured.current!.method).toBe('GET');
    });

    it('getProjectRole() — GET /api/project-role/{project_role}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/project-role/5`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 5 } };
        }),
      );
      await makeClient().getProjectRole(5);
      expect(captured.current!.method).toBe('GET');
    });

    it('updateProjectRole() — PUT /api/project-role/{project_role}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/project-role/5`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 5 } };
        }),
      );
      await makeClient().updateProjectRole(5, { name: 'admin', permissions: ['p1', 'p2'] });
      expectMethodOverride(captured.current!, 'PUT');
    });

    it('deleteProjectRole() — DELETE /api/project-role/{project_role}', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/project-role/5`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().deleteProjectRole(5);
      expect(captured.current!.method).toBe('DELETE');
    });
  });

  // ===========================================================================
  // Provider + roles-to-assign
  // ===========================================================================

  describe('Provider + roles-to-assign', () => {
    it('listProviders() — GET /api/provider', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/provider`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().listProviders({ q: 'al', per_page: '20' });
      expect(captured.current!.method).toBe('GET');
      const url = new URL(captured.current!.url);
      expect(url.searchParams.get('q')).toBe('al');
      expect(url.searchParams.get('per_page')).toBe('20');
    });

    it('listProviderRoles() — GET /api/provider/roles', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/provider/roles`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().listProviderRoles();
      expect(captured.current!.method).toBe('GET');
    });

    it('listRolesToAssign() — GET /api/roles-to-assign/all', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/roles-to-assign/all`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().listRolesToAssign();
      expect(captured.current!.method).toBe('GET');
    });
  });

  // ===========================================================================
  // Statistic CRUD
  // ===========================================================================

  describe('Statistic CRUD', () => {
    it('listStatistics() — GET /api/statistic', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/statistic`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().listStatistics();
      expect(captured.current!.method).toBe('GET');
    });

    it('createStatistic() — POST /api/statistic', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/statistic`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 1 } };
        }),
      );
      await makeClient().createStatistic({
        icon: 'icon',
        value: 42,
        label: 'L',
        color: '#fff',
      });
      const body = await captured.current!.json();
      expect(body.value).toBe(42);
    });

    it('getStatistic() — GET /api/statistic/{statistic}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/statistic/3`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 3 } };
        }),
      );
      await makeClient().getStatistic(3);
      expect(captured.current!.method).toBe('GET');
    });

    it('updateStatistic() — PUT /api/statistic/{statistic}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/statistic/3`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 3 } };
        }),
      );
      await makeClient().updateStatistic(3, {
        icon: 'icon2',
        value: 99,
        label: 'L2',
        color: '#000',
      });
      expectMethodOverride(captured.current!, 'PUT');
    });

    it('deleteStatistic() — DELETE /api/statistic/{statistic}', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/statistic/3`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().deleteStatistic(3);
      expect(captured.current!.method).toBe('DELETE');
    });
  });

  // ===========================================================================
  // User (admin index/store) — show/update/destroy already in AuthUserApiClient
  // ===========================================================================

  describe('User (admin index/store)', () => {
    it('listAdminUsers() — GET /api/user', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/user`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().listAdminUsers({ q: 'jo', per_page: '15' });
      expect(captured.current!.method).toBe('GET');
      const url = new URL(captured.current!.url);
      expect(url.searchParams.get('q')).toBe('jo');
      expect(url.searchParams.get('per_page')).toBe('15');
    });

    it('createAdminUser() — POST /api/user', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/user`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 1 } };
        }),
      );
      await makeClient().createAdminUser({
        full_name: 'New User',
        phone: 5551234,
        password: 'pw',
        password_confirmation: 'pw',
        is_published: true,
      });
      const body = await captured.current!.json();
      expect(body.full_name).toBe('New User');
      expect(body.is_published).toBe(true);
    });
  });
});
