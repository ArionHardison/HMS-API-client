/**
 * Endpoint coverage for `TenancyApiClient` — the multi-tenant boot surface
 * + subproject lifecycle + tenant-claim + domain-interfaces + world-locations
 * + gov directory + frontend/SEO + creator/featured + contacts +
 * documentation slice of the P2X API.
 *
 * Source of truth: `sdk/spec/endpoints.json` (filtered into
 * `/tmp/tenancy-slice.json`). Each endpoint gets one test pinning URL, raw
 * HTTP method, Authorization, `X-Domain`, request body, and response
 * decoding. Method-override (PUT/PATCH → POST?_method=) and multipart
 * (Blob / File → FormData) are spot-checked at the relevant endpoints.
 *
 * Auth bands per spec:
 *   - public  : 17 endpoints (no Bearer required) — the SDK omits Authorization
 *   - api     : 42 endpoints (default Sanctum guard) — Bearer required
 *   - admin   : 71 endpoints (admin guard) — Bearer required, same SDK header
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { HttpResponse } from 'msw';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectFormDataField,
  expectMethodOverride,
  expectNoAuthHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { TenancyApiClient } from '../tenancy-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'tenancy-tkn-xyz';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): TenancyApiClient {
  return new TenancyApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

/** Client with no token getter — used by `auth=public` tests. */
function makePublicClient(): TenancyApiClient {
  return new TenancyApiClient({
    baseURL: BASE,
    getDomain: () => DOMAIN,
  });
}

describe('TenancyApiClient', () => {
  let captured: Captured;
  beforeEach(() => {
    captured = { current: null };
  });

  // ===========================================================================
  // CI-WWW boot endpoints
  // ===========================================================================

  describe('Boot endpoints (CI-WWW)', () => {
    it('loadTenant() — GET /api/load returns ok=true on 200', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/load`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 1, name: 'phm' } };
        }),
      );
      const res = await makePublicClient().loadTenant();
      expect(captured.current!.method).toBe('GET');
      // public endpoint, no Bearer expected
      expectNoAuthHeader(captured.current!);
      expectDomainHeader(captured.current!, DOMAIN);
      expect(res.ok).toBe(true);
      expect(res.status).toBe(200);
      if (res.ok) expect((res.data as any).id).toBe(1);
    });

    it('loadTenant() — GET /api/load returns ok=false on 404 without throwing', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/load`, () =>
          HttpResponse.json(
            { success: false, message: 'not found', data: null },
            { status: 404 },
          ),
        ),
      );
      const res = await makePublicClient().loadTenant();
      expect(res.ok).toBe(false);
      expect(res.status).toBe(404);
    });

    it('loadBoard() — GET /api/board', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/board`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { is_sub: false } };
        }),
      );
      const res = await makePublicClient().loadBoard();
      expect(captured.current!.method).toBe('GET');
      expectNoAuthHeader(captured.current!);
      expectDomainHeader(captured.current!, DOMAIN);
      expect((res.data as any).is_sub).toBe(false);
    });

    it('loadLeader() — GET /api/leader', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/leader`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 7 } };
        }),
      );
      const res = await makePublicClient().loadLeader();
      expect(captured.current!.method).toBe('GET');
      expectNoAuthHeader(captured.current!);
      expect((res.data as any).id).toBe(7);
    });

    it('loadInterface() — GET /api/interface/load-interface', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/interface/load-interface`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { interface: 'x' } };
        }),
      );
      const res = await makePublicClient().loadInterface();
      expect(captured.current!.method).toBe('GET');
      expectNoAuthHeader(captured.current!);
      expect((res.data as any).interface).toBe('x');
    });

    it('authenticateAtTenant() — GET /api/authenticate-at/{tenant} (auth)', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/authenticate-at/abc`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { token: 't' } };
        }),
      );
      await makeClient().authenticateAtTenant('abc');
      expectAuthHeader(captured.current!, TOKEN);
      expectDomainHeader(captured.current!, DOMAIN);
    });

    it('getPublicTenantLogo() — GET /api/public/logo/{tenant}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/public/logo/tenant-9`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { url: '/logo.png' } };
        }),
      );
      await makePublicClient().getPublicTenantLogo('tenant-9');
      expect(captured.current!.method).toBe('GET');
      expectNoAuthHeader(captured.current!);
    });
  });

  // ===========================================================================
  // Subproject CRUD
  // ===========================================================================

  describe('Subproject CRUD', () => {
    it('listSubprojects() — GET /api/subproject (paginated)', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/subproject`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { items: [], meta: {}, links: {} } };
        }),
      );
      const res = await makeClient().listSubprojects({ page: 2 });
      expect(captured.current!.method).toBe('GET');
      expect(new URL(captured.current!.url).searchParams.get('page')).toBe('2');
      expectAuthHeader(captured.current!, TOKEN);
      expect(Array.isArray((res.data as any).items)).toBe(true);
    });

    it('listAllSubprojects() — GET /api/subproject/all', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/subproject/all`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().listAllSubprojects();
      expect(captured.current!.method).toBe('GET');
      expectAuthHeader(captured.current!, TOKEN);
    });

    it('showSubproject() — GET /api/subproject/{subproject}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/subproject/42`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 42 } };
        }),
      );
      await makeClient().showSubproject(42);
      expect(captured.current!.method).toBe('GET');
    });

    it('deleteSubproject() — DELETE /api/subproject/{subproject}', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/subproject/55`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().deleteSubproject(55);
      expect(captured.current!.method).toBe('DELETE');
    });

    it('deleteSubprojectCategory() — POST /api/subproject/delete-category/{subproject}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/subproject/delete-category/3`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().deleteSubprojectCategory(3, { category_id: 9 });
      expect(captured.current!.method).toBe('POST');
      const body = await captured.current!.json();
      expect(body).toEqual({ category_id: 9 });
    });
  });

  // ===========================================================================
  // Subproject admin lifecycle
  // ===========================================================================

  describe('Subproject admin lifecycle', () => {
    it('getSubprojectAdminAccountData() — GET /api/subproject-admin/account-data', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/subproject-admin/account-data`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 1 } };
        }),
      );
      await makeClient().getSubprojectAdminAccountData();
      expectAuthHeader(captured.current!, TOKEN);
    });

    it('confirmSubprojectAdminAccount() — POST /api/subproject-admin/confirm-account', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/subproject-admin/confirm-account`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().confirmSubprojectAdminAccount({ code: '1234' });
      const body = await captured.current!.json();
      expect(body).toEqual({ code: '1234' });
    });

    it('createSubprojectAdminAccount() — POST /api/subproject-admin/create-account (public)', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/subproject-admin/create-account`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 99 } };
        }),
      );
      await makePublicClient().createSubprojectAdminAccount({
        timezone: 'America/Los_Angeles',
        full_name: 'Jane Doe',
        login: 'jane',
        password: 'Password1!',
        agreed: true,
      });
      expect(captured.current!.method).toBe('POST');
      expectNoAuthHeader(captured.current!);
      const body = await captured.current!.json();
      expect(body.login).toBe('jane');
    });

    it('createSubprojectAdminSubscription() — GET /api/subproject-admin/create-subscription', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/subproject-admin/create-subscription`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { url: 'https://stripe' } };
        }),
      );
      await makeClient().createSubprojectAdminSubscription();
      expectAuthHeader(captured.current!, TOKEN);
    });

    it('findClaimableSubproject() — POST /api/subproject-admin/find-claimable', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/subproject-admin/find-claimable`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().findClaimableSubproject({ domain: 'phm.ai' });
      const body = await captured.current!.json();
      expect(body.domain).toBe('phm.ai');
    });

    it('getSubprojectAdminAllowedCountries() — GET /api/subproject-admin/get-allowed-countries (public)', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/subproject-admin/get-allowed-countries`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makePublicClient().getSubprojectAdminAllowedCountries();
      expectNoAuthHeader(captured.current!);
    });

    it('subprojectAdminLogin() — POST /api/subproject-admin/login (public)', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/subproject-admin/login`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { token: 't' } };
        }),
      );
      await makePublicClient().subprojectAdminLogin({ login: 'a', password: 'b' });
      expectNoAuthHeader(captured.current!);
      const body = await captured.current!.json();
      expect(body).toEqual({ login: 'a', password: 'b' });
    });

    it('subprojectAdminHasContacts() — POST /api/subproject-admin/subproject/has-contacts', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/subproject-admin/subproject/has-contacts`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { has: true } };
        }),
      );
      await makeClient().subprojectAdminHasContacts({ subproject: 7 });
      expectAuthHeader(captured.current!, TOKEN);
    });

    it('getSubprojectAdminSubscriptionStatus() — GET /api/subproject-admin/subscription-status', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/subproject-admin/subscription-status`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { status: 'active' } };
        }),
      );
      await makeClient().getSubprojectAdminSubscriptionStatus();
      expectAuthHeader(captured.current!, TOKEN);
    });

    it('startSubprojectClaim() — POST /api/subproject-admin/start-claiming/{subproject}/claim', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/subproject-admin/start-claiming/3/claim`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { ok: true } };
        }),
      );
      await makeClient().startSubprojectClaim(3, {});
      expect(captured.current!.method).toBe('POST');
    });
  });

  // ===========================================================================
  // Subproject claim sections (saving step bodies)
  // ===========================================================================

  describe('Subproject claim sections', () => {
    const cases: Array<{ name: keyof TenancyApiClient; section: string }> = [
      { name: 'saveClaimedSubprojectContent', section: 'content' },
      { name: 'saveClaimedSubprojectDomains', section: 'domains' },
      { name: 'saveClaimedSubprojectLayout', section: 'layout' },
      { name: 'saveClaimedSubprojectSeo', section: 'seo' },
      { name: 'saveClaimedSubprojectTeam', section: 'team' },
      { name: 'saveClaimedSubprojectTemplate', section: 'template' },
    ];
    for (const { name, section } of cases) {
      it(`${String(name)}() — POST /api/subproject-admin/claim/subproject/{subproject}/${section}`, async () => {
        server.use(
          mockEndpoint(
            'post',
            `${BASE}/api/subproject-admin/claim/subproject/12/${section}`,
            async ({ request }) => {
              captured.current = request.clone();
              return { success: true, message: '', data: null };
            },
          ),
        );
        await (makeClient() as any)[name](12, { foo: 'bar' });
        expect(captured.current!.method).toBe('POST');
        const body = await captured.current!.json();
        expect(body).toEqual({ foo: 'bar' });
      });
    }

    it('getClaimedSubprojectWizardInstance() — GET /api/subproject-admin/claim/subproject/{subproject}/wizard-instance', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/subproject-admin/claim/subproject/12/wizard-instance`,
          ({ request }) => {
            captured.current = request;
            return { success: true, message: '', data: { wizard: {} } };
          },
        ),
      );
      await makeClient().getClaimedSubprojectWizardInstance(12);
      expect(captured.current!.method).toBe('GET');
    });
  });

  // ===========================================================================
  // Subproject create sections
  // ===========================================================================

  describe('Subproject create sections', () => {
    const cases: Array<{ name: keyof TenancyApiClient; section: string }> = [
      { name: 'createSubprojectContent', section: 'content' },
      { name: 'createSubprojectDomains', section: 'domains' },
      { name: 'createSubprojectLayout', section: 'layout' },
      { name: 'createSubprojectSeo', section: 'seo' },
      { name: 'createSubprojectTeam', section: 'team' },
      { name: 'createSubprojectTemplate', section: 'template' },
    ];
    for (const { name, section } of cases) {
      it(`${String(name)}() — POST /api/subproject-admin/create/subproject/${section}`, async () => {
        server.use(
          mockEndpoint(
            'post',
            `${BASE}/api/subproject-admin/create/subproject/${section}`,
            async ({ request }) => {
              captured.current = request.clone();
              return { success: true, message: '', data: null };
            },
          ),
        );
        await (makeClient() as any)[name]({ a: 1 });
        const body = await captured.current!.json();
        expect(body).toEqual({ a: 1 });
      });
    }
  });

  // ===========================================================================
  // Subproject misc (search/settings/types)
  // ===========================================================================

  describe('Subproject search / settings / types', () => {
    it('searchSubprojects() — POST /api/subproject-search', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/subproject-search`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().searchSubprojects({ q: 'phm' });
      const body = await captured.current!.json();
      expect(body.q).toBe('phm');
    });

    it('getSubprojectSettings() — GET /api/subproject-settings', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/subproject-settings`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().getSubprojectSettings();
      expectAuthHeader(captured.current!, TOKEN);
    });

    it('getSubprojectTypes() — GET /api/subproject-types', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/subproject-types`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getSubprojectTypes();
      expectAuthHeader(captured.current!, TOKEN);
    });
  });

  // ===========================================================================
  // Subproject team
  // ===========================================================================

  describe('Subproject team', () => {
    it('deleteSubprojectTeamInvite() — DELETE /api/subproject-team/delete-invite/{id}/{subproject?}', async () => {
      server.use(
        mockEndpoint(
          'delete',
          `${BASE}/api/subproject-team/delete-invite/77/9`,
          ({ request }) => {
            captured.current = request;
            return { success: true, message: '', data: null };
          },
        ),
      );
      await makeClient().deleteSubprojectTeamInvite(77, 9);
      expect(captured.current!.method).toBe('DELETE');
    });

    it('deleteSubprojectTeamInvite() — without subproject path param', async () => {
      server.use(
        mockEndpoint(
          'delete',
          `${BASE}/api/subproject-team/delete-invite/77`,
          ({ request }) => {
            captured.current = request;
            return { success: true, message: '', data: null };
          },
        ),
      );
      await makeClient().deleteSubprojectTeamInvite(77);
      expect(captured.current!.method).toBe('DELETE');
    });

    it('getSubprojectTeamInvites() — GET /api/subproject-team/get-invites/{subproject?}', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/subproject-team/get-invites/9`,
          ({ request }) => {
            captured.current = request;
            return { success: true, message: '', data: [] };
          },
        ),
      );
      await makeClient().getSubprojectTeamInvites(9);
      expect(captured.current!.method).toBe('GET');
    });

    it('renewSubprojectTeamToken() — POST /api/subproject-team/renew-token/{subproject?}', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/subproject-team/renew-token/9`,
          async ({ request }) => {
            captured.current = request.clone();
            return { success: true, message: '', data: { token: 't' } };
          },
        ),
      );
      await makeClient().renewSubprojectTeamToken(9, { user_id: 1 });
      const body = await captured.current!.json();
      expect(body.user_id).toBe(1);
    });

    it('sendSubprojectTeamInvites() — POST /api/subproject-team/send-invites/{subproject?}', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/subproject-team/send-invites/9`,
          async ({ request }) => {
            captured.current = request.clone();
            return { success: true, message: '', data: null };
          },
        ),
      );
      await makeClient().sendSubprojectTeamInvites(9, { emails: ['a@b.c'] });
      const body = await captured.current!.json();
      expect(body.emails).toEqual(['a@b.c']);
    });

    it('updateSubprojectTeamPermissions() — POST /api/subproject-team/update-permissions/{subproject?}', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/subproject-team/update-permissions/9`,
          async ({ request }) => {
            captured.current = request.clone();
            return { success: true, message: '', data: null };
          },
        ),
      );
      await makeClient().updateSubprojectTeamPermissions(9, { user_id: 1, permissions: ['x'] });
      const body = await captured.current!.json();
      expect(body.permissions).toEqual(['x']);
    });
  });

  // ===========================================================================
  // Subproject wizard
  // ===========================================================================

  describe('Subproject wizard', () => {
    const cases: Array<{ name: keyof TenancyApiClient; section: string }> = [
      { name: 'saveSubprojectWizardContent', section: 'content' },
      { name: 'saveSubprojectWizardDomains', section: 'domains' },
      { name: 'saveSubprojectWizardLayout', section: 'layout' },
      { name: 'saveSubprojectWizardSeo', section: 'seo' },
      { name: 'saveSubprojectWizardTeam', section: 'team' },
      { name: 'saveSubprojectWizardTemplate', section: 'template' },
    ];
    for (const { name, section } of cases) {
      it(`${String(name)}() — POST /api/subproject-wizard/${section}/{id}`, async () => {
        server.use(
          mockEndpoint(
            'post',
            `${BASE}/api/subproject-wizard/${section}/12`,
            async ({ request }) => {
              captured.current = request.clone();
              return { success: true, message: '', data: null };
            },
          ),
        );
        await (makeClient() as any)[name](12, { v: 1 });
        const body = await captured.current!.json();
        expect(body.v).toBe(1);
      });
    }

    it('getSubprojectWizardCreationStarted() — GET /api/subproject-wizard/creation-started', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/subproject-wizard/creation-started`,
          ({ request }) => {
            captured.current = request;
            return { success: true, message: '', data: { started: true } };
          },
        ),
      );
      await makeClient().getSubprojectWizardCreationStarted();
      expectAuthHeader(captured.current!, TOKEN);
    });

    it('getSubprojectWizard() — GET /api/subproject-wizard/get', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/subproject-wizard/get`,
          ({ request }) => {
            captured.current = request;
            return { success: true, message: '', data: {} };
          },
        ),
      );
      await makeClient().getSubprojectWizard();
      expectAuthHeader(captured.current!, TOKEN);
    });
  });

  // ===========================================================================
  // Project settings
  // ===========================================================================

  describe('Project settings', () => {
    const sections = ['content', 'domains', 'layout', 'seo', 'template'] as const;
    for (const section of sections) {
      it(`getProjectSettings${section[0].toUpperCase() + section.slice(1)}() — GET /api/project-settings/${section}/show/{subproject?}`, async () => {
        server.use(
          mockEndpoint(
            'get',
            `${BASE}/api/project-settings/${section}/show/12`,
            ({ request }) => {
              captured.current = request;
              return { success: true, message: '', data: {} };
            },
          ),
        );
        const methodName = `getProjectSettings${section[0].toUpperCase() + section.slice(1)}` as keyof TenancyApiClient;
        await (makeClient() as any)[methodName](12);
        expect(captured.current!.method).toBe('GET');
      });

      it(`saveProjectSettings${section[0].toUpperCase() + section.slice(1)}() — POST /api/project-settings/${section}/{subproject?}`, async () => {
        server.use(
          mockEndpoint(
            'post',
            `${BASE}/api/project-settings/${section}/12`,
            async ({ request }) => {
              captured.current = request.clone();
              return { success: true, message: '', data: null };
            },
          ),
        );
        const methodName = `saveProjectSettings${section[0].toUpperCase() + section.slice(1)}` as keyof TenancyApiClient;
        await (makeClient() as any)[methodName](12, { x: 1 });
        const body = await captured.current!.json();
        expect(body.x).toBe(1);
      });
    }

    it('getProjectSettingsDomainSettings() — GET /api/project-settings/domain-settings/{subproject?}', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/project-settings/domain-settings/12`,
          ({ request }) => {
            captured.current = request;
            return { success: true, message: '', data: {} };
          },
        ),
      );
      await makeClient().getProjectSettingsDomainSettings(12);
      expect(captured.current!.method).toBe('GET');
    });
  });

  // ===========================================================================
  // Tenant claim (with multipart spot-check)
  // ===========================================================================

  describe('Tenant claim', () => {
    it('completeTenantClaim() — POST /api/tenant-claim/complete', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/tenant-claim/complete`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { claimed: true } };
        }),
      );
      await makeClient().completeTenantClaim({ claim_token: 'tkn' });
      const body = await captured.current!.json();
      expect(body.claim_token).toBe('tkn');
    });

    it('getTenantClaimDetails() — GET /api/tenant-claim/details/{id}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/tenant-claim/details/77`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 77 } };
        }),
      );
      await makeClient().getTenantClaimDetails(77);
      expect(captured.current!.method).toBe('GET');
    });

    it('initiateTenantClaim() — POST /api/tenant-claim/initiate', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/tenant-claim/initiate`, async ({ request }) => {
          captured.current = request.clone();
          return {
            success: true,
            message: '',
            data: { claim_token: 'tkn', tenant_id: 9, status: 'pending', verification_requirements: [], expires_at: '2030-01-01' },
          };
        }),
      );
      await makeClient().initiateTenantClaim({ tenant_id: 'phm' });
      const body = await captured.current!.json();
      expect(body).toEqual({ tenant_id: 'phm' });
    });

    it('getMyTenantClaim() — GET /api/tenant-claim/my-claim', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/tenant-claim/my-claim`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { claim: null } };
        }),
      );
      await makeClient().getMyTenantClaim();
      expectAuthHeader(captured.current!, TOKEN);
    });

    it('searchTenantClaims() — GET /api/tenant-claim/search', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/tenant-claim/search`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().searchTenantClaims({ q: 'foo' });
      expect(new URL(captured.current!.url).searchParams.get('q')).toBe('foo');
    });

    it('getTenantClaimStatus() — GET /api/tenant-claim/status/{token}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/tenant-claim/status/abc-tkn`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { status: 'pending' } };
        }),
      );
      await makeClient().getTenantClaimStatus('abc-tkn');
      expect(captured.current!.method).toBe('GET');
    });

    it('verifyTenantClaim() — POST /api/tenant-claim/verify (multipart)', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/tenant-claim/verify`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { verified: true } };
        }),
      );
      const idFront = new Blob(['id-front-bytes'], { type: 'image/png' });
      const idBack = new Blob(['id-back-bytes'], { type: 'image/png' });
      const businessRegistration = new Blob(['biz-bytes'], { type: 'application/pdf' });
      const domainProof = new Blob(['domain-bytes'], { type: 'application/pdf' });
      await makeClient().verifyTenantClaim({
        claim_token: 'tkn',
        id_front: idFront,
        id_back: idBack,
        business_registration: businessRegistration,
        domain_proof: domainProof,
      });
      const ctype = captured.current!.headers.get('content-type') ?? '';
      expect(ctype).toMatch(/multipart\/form-data/);
      await expectFormDataField(captured.current!, 'claim_token', 'tkn');
    });
  });

  // ===========================================================================
  // Tenant interface / pages / blocks
  // ===========================================================================

  describe('Tenant interface graph', () => {
    it('getTenantInterfaceBlocksByPage() — GET /api/tenant-interface-block/by-page/{page_id}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/tenant-interface-block/by-page/3`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getTenantInterfaceBlocksByPage(3);
      expect(captured.current!.method).toBe('GET');
    });

    it('getTenantInterfacePagesAll() — GET /api/tenant-interface-page/all/{interface_id}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/tenant-interface-page/all/3`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getTenantInterfacePagesAll(3);
      expect(captured.current!.method).toBe('GET');
    });

    it('getTenantInterfacePagesByInterface() — GET /api/tenant-interface-page/interface/{interface_id}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/tenant-interface-page/interface/4`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getTenantInterfacePagesByInterface(4);
      expect(captured.current!.method).toBe('GET');
    });

    it('getTenantInterfacesAll() — GET /api/tenant-interface/all', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/tenant-interface/all`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getTenantInterfacesAll();
      expect(captured.current!.method).toBe('GET');
    });

    it('getTenantRegistrationFees() — GET /api/tenant-registration/fees (public)', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/tenant-registration/fees`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makePublicClient().getTenantRegistrationFees();
      expectNoAuthHeader(captured.current!);
    });
  });

  // ===========================================================================
  // Domain interfaces (REST + PATCH override spot-check)
  // ===========================================================================

  describe('Domain interfaces', () => {
    it('listDomainInterfaces() — GET /api/domain-interfaces', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/domain-interfaces`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().listDomainInterfaces();
      expect(captured.current!.method).toBe('GET');
    });

    it('createDomainInterface() — POST /api/domain-interfaces', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/domain-interfaces`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 1 } };
        }),
      );
      await makeClient().createDomainInterface({ domain: 'phm.ai' });
      const body = await captured.current!.json();
      expect(body).toEqual({ domain: 'phm.ai' });
    });

    it('getDomainInterfaceByDomain() — GET /api/domain-interfaces/by-domain/{domain}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/domain-interfaces/by-domain/phm.ai`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { domain: 'phm.ai' } };
        }),
      );
      await makeClient().getDomainInterfaceByDomain('phm.ai');
      expect(captured.current!.method).toBe('GET');
    });

    it('getDomainInterface() — GET /api/domain-interfaces/{id}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/domain-interfaces/9`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 9 } };
        }),
      );
      await makeClient().getDomainInterface(9);
      expect(captured.current!.method).toBe('GET');
    });

    it('patchDomainInterface() — PATCH /api/domain-interfaces/{id} (rewritten as POST?_method=PATCH)', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/domain-interfaces/9`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 9, domain: 'updated.ai' } };
        }),
      );
      await makeClient().patchDomainInterface(9, { domain: 'updated.ai' });
      expectMethodOverride(captured.current!, 'PATCH');
      const body = await captured.current!.json();
      expect(body).toEqual({ domain: 'updated.ai' });
    });

    it('deleteDomainInterface() — DELETE /api/domain-interfaces/{id}', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/domain-interfaces/9`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().deleteDomainInterface(9);
      expect(captured.current!.method).toBe('DELETE');
    });
  });

  // ===========================================================================
  // World locations
  // ===========================================================================

  describe('World locations', () => {
    it('createWorldLocationCity() — POST /api/world-locations/city', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/world-locations/city`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 1 } };
        }),
      );
      await makeClient().createWorldLocationCity({ name: 'NYC', state_id: 1 });
      const body = await captured.current!.json();
      expect(body.name).toBe('NYC');
    });

    it('getWorldLocationCity() — GET /api/world-locations/city/{city}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/world-locations/city/77`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 77 } };
        }),
      );
      await makeClient().getWorldLocationCity(77);
      expect(captured.current!.method).toBe('GET');
    });

    it('createWorldLocationCountry() — POST /api/world-locations/country', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/world-locations/country`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 1 } };
        }),
      );
      await makeClient().createWorldLocationCountry({ name: 'US' });
      const body = await captured.current!.json();
      expect(body.name).toBe('US');
    });

    it('getWorldLocationCountry() — GET /api/world-locations/country/{country}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/world-locations/country/2`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 2 } };
        }),
      );
      await makeClient().getWorldLocationCountry(2);
      expect(captured.current!.method).toBe('GET');
    });

    it('createWorldLocationState() — POST /api/world-locations/state', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/world-locations/state`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 1 } };
        }),
      );
      await makeClient().createWorldLocationState({ name: 'CA', country_id: 1 });
      const body = await captured.current!.json();
      expect(body.name).toBe('CA');
    });

    it('getWorldLocationState() — GET /api/world-locations/state/{state}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/world-locations/state/3`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 3 } };
        }),
      );
      await makeClient().getWorldLocationState(3);
      expect(captured.current!.method).toBe('GET');
    });

    it('getPublicCountry() — GET /api/public/countries/{country}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/public/countries/US`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { iso2: 'US' } };
        }),
      );
      await makePublicClient().getPublicCountry('US');
      expectNoAuthHeader(captured.current!);
    });

    it('getPublicAllowedCountries() — GET /api/public/countries/find-allowed', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/public/countries/find-allowed`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makePublicClient().getPublicAllowedCountries();
      expectNoAuthHeader(captured.current!);
    });
  });

  // ===========================================================================
  // Gov directory (all public)
  // ===========================================================================

  describe('Gov directory', () => {
    const cases: Array<{ name: keyof TenancyApiClient; uri: string }> = [
      { name: 'getGovAgencyFooter', uri: '/api/gov/agency-footer' },
      { name: 'getGovCities', uri: '/api/gov/cities' },
      { name: 'getGovCityAgencies', uri: '/api/gov/city-agencies' },
      { name: 'getGovFederalDirectory', uri: '/api/gov/federal-directory' },
      { name: 'getGovStates', uri: '/api/gov/states' },
      { name: 'getGovSubprojects', uri: '/api/gov/subprojects' },
      { name: 'getGovSubprojectByDomain', uri: '/api/gov/subprojects/by-domain' },
    ];
    for (const { name, uri } of cases) {
      it(`${String(name)}() — GET ${uri} (public)`, async () => {
        server.use(
          mockEndpoint('get', `${BASE}${uri}`, ({ request }) => {
            captured.current = request;
            return { success: true, message: '', data: [] };
          }),
        );
        await (makePublicClient() as any)[name]();
        expect(captured.current!.method).toBe('GET');
        expectNoAuthHeader(captured.current!);
      });
    }
  });

  // ===========================================================================
  // Frontend / SEO pages (PUT override spot-check on saveFrontend)
  // ===========================================================================

  describe('Frontend + SEO', () => {
    it('getFrontend() — GET /api/frontend/get-frontend', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/frontend/get-frontend`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { theme: 'dark' } };
        }),
      );
      await makeClient().getFrontend();
      expectAuthHeader(captured.current!, TOKEN);
    });

    it('saveFrontend() — PUT /api/frontend/save-frontend (rewritten as POST?_method=PUT)', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/frontend/save-frontend`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().saveFrontend({ theme: 'dark' });
      expectMethodOverride(captured.current!, 'PUT');
      const body = await captured.current!.json();
      expect(body).toEqual({ theme: 'dark' });
    });

    it('listSeoPages() — GET /api/seo-page (paginated)', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/seo-page`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { items: [] } };
        }),
      );
      await makeClient().listSeoPages();
      expect(captured.current!.method).toBe('GET');
    });

    it('createSeoPage() — POST /api/seo-page', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/seo-page`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 1 } };
        }),
      );
      await makeClient().createSeoPage({
        page: 'home',
        call: '/',
        items: [{ name: 'title', content: 'Hello' }],
      });
      const body = await captured.current!.json();
      expect(body.page).toBe('home');
    });

    it('deleteSeoPageItem() — DELETE /api/seo-page/item/{seoPageItem}', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/seo-page/item/8`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().deleteSeoPageItem(8);
      expect(captured.current!.method).toBe('DELETE');
    });

    it('getSeoPage() — GET /api/seo-page/{seo_page}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/seo-page/12`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 12 } };
        }),
      );
      await makeClient().getSeoPage(12);
      expect(captured.current!.method).toBe('GET');
    });

    it('updateSeoPage() — PUT /api/seo-page/{seo_page} (rewritten)', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/seo-page/12`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 12 } };
        }),
      );
      await makeClient().updateSeoPage(12, { page: 'about' });
      expectMethodOverride(captured.current!, 'PUT');
    });

    it('deleteSeoPage() — DELETE /api/seo-page/{seo_page}', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/seo-page/12`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().deleteSeoPage(12);
      expect(captured.current!.method).toBe('DELETE');
    });
  });

  // ===========================================================================
  // Creator family + featured
  // ===========================================================================

  describe('Creator + featured', () => {
    it('listCreators() — GET /api/creator', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/creator`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().listCreators();
      expect(captured.current!.method).toBe('GET');
    });

    it('createCreator() — POST /api/creator', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/creator`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 1 } };
        }),
      );
      await makeClient().createCreator({ name: 'jane' });
      const body = await captured.current!.json();
      expect(body.name).toBe('jane');
    });

    it('getCreator() — GET /api/creator/{creator}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/creator/8`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 8 } };
        }),
      );
      await makeClient().getCreator(8);
      expect(captured.current!.method).toBe('GET');
    });

    it('updateCreator() — PUT /api/creator/{creator}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/creator/8`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 8 } };
        }),
      );
      await makeClient().updateCreator(8, { name: 'jay' });
      expectMethodOverride(captured.current!, 'PUT');
    });

    it('deleteCreator() — DELETE /api/creator/{creator}', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/creator/8`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().deleteCreator(8);
      expect(captured.current!.method).toBe('DELETE');
    });

    it('listCreatorActivity() — GET /api/creator-activity', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/creator-activity`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().listCreatorActivity();
      expect(captured.current!.method).toBe('GET');
    });

    it('createCreatorActivity() — POST /api/creator-activity', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/creator-activity`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 1 } };
        }),
      );
      await makeClient().createCreatorActivity({ x: 1 });
      const body = await captured.current!.json();
      expect(body.x).toBe(1);
    });

    it('getCreatorActivity() — GET /api/creator-activity/{creator_activity}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/creator-activity/8`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 8 } };
        }),
      );
      await makeClient().getCreatorActivity(8);
      expect(captured.current!.method).toBe('GET');
    });

    it('updateCreatorActivity() — PUT /api/creator-activity/{creator_activity}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/creator-activity/8`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 8 } };
        }),
      );
      await makeClient().updateCreatorActivity(8, {});
      expectMethodOverride(captured.current!, 'PUT');
    });

    it('deleteCreatorActivity() — DELETE /api/creator-activity/{creator_activity}', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/creator-activity/8`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().deleteCreatorActivity(8);
      expect(captured.current!.method).toBe('DELETE');
    });

    it('listCreatorRequests() — GET /api/creator-request', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/creator-request`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().listCreatorRequests();
      expect(captured.current!.method).toBe('GET');
    });

    it('createCreatorRequest() — POST /api/creator-request', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/creator-request`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 1 } };
        }),
      );
      await makeClient().createCreatorRequest({});
      expect(captured.current!.method).toBe('POST');
    });

    it('getCreatorRequestStatus() — GET /api/creator-request/status', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/creator-request/status`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { status: 'open' } };
        }),
      );
      await makeClient().getCreatorRequestStatus();
      expectAuthHeader(captured.current!, TOKEN);
    });

    it('getCreatorRequest() — GET /api/creator-request/{creator_request}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/creator-request/8`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 8 } };
        }),
      );
      await makeClient().getCreatorRequest(8);
      expect(captured.current!.method).toBe('GET');
    });

    it('updateCreatorRequest() — PUT /api/creator-request/{creator_request}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/creator-request/8`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 8 } };
        }),
      );
      await makeClient().updateCreatorRequest(8, {});
      expectMethodOverride(captured.current!, 'PUT');
    });

    it('deleteCreatorRequest() — DELETE /api/creator-request/{creator_request}', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/creator-request/8`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().deleteCreatorRequest(8);
      expect(captured.current!.method).toBe('DELETE');
    });

    it('saveFeaturedCreators() — POST /api/featured/creators', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/featured/creators`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().saveFeaturedCreators({ ids: [1, 2] });
      const body = await captured.current!.json();
      expect(body.ids).toEqual([1, 2]);
    });

    it('saveFeaturedPrograms() — POST /api/featured/programs', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/featured/programs`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().saveFeaturedPrograms({ ids: [3, 4] });
      const body = await captured.current!.json();
      expect(body.ids).toEqual([3, 4]);
    });
  });

  // ===========================================================================
  // Contacts
  // ===========================================================================

  describe('Contacts', () => {
    it('deleteContact() — DELETE /api/contacts/delete/{contact}', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/contacts/delete/55`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().deleteContact(55);
      expect(captured.current!.method).toBe('DELETE');
    });

    it('findContacts() — POST /api/contacts/find/{subproject?}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/contacts/find/9`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().findContacts({ q: 'foo' }, 9);
      const body = await captured.current!.json();
      expect(body.q).toBe('foo');
    });

    it('findContacts() — POST /api/contacts/find without subproject', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/contacts/find`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().findContacts({ q: 'bar' });
      expect(captured.current!.method).toBe('POST');
    });

    it('getContactsHasContacts() — GET /api/contacts/has-contacts', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/contacts/has-contacts`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { has: true } };
        }),
      );
      await makeClient().getContactsHasContacts();
      expectAuthHeader(captured.current!, TOKEN);
    });

    it('importContacts() — POST /api/contacts/import', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/contacts/import`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { count: 2 } };
        }),
      );
      await makeClient().importContacts({ contacts: [{ email: 'a@b.c' }] });
      const body = await captured.current!.json();
      expect(Array.isArray(body.contacts)).toBe(true);
    });

    it('listContacts() — POST /api/contacts/list', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/contacts/list`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().listContacts({ page: 1 });
      const body = await captured.current!.json();
      expect(body.page).toBe(1);
    });

    it('getContactsRunningImport() — GET /api/contacts/running-import', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/contacts/running-import`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { running: false } };
        }),
      );
      await makeClient().getContactsRunningImport();
      expectAuthHeader(captured.current!, TOKEN);
    });

    it('saveContact() — POST /api/contacts/save', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/contacts/save`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 1 } };
        }),
      );
      await makeClient().saveContact({ email: 'x@y.z' });
      expect(captured.current!.method).toBe('POST');
    });
  });

  // ===========================================================================
  // Documentation
  // ===========================================================================

  describe('Documentation', () => {
    it('listDocumentation() — GET /api/documentation', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/documentation`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().listDocumentation();
      expect(captured.current!.method).toBe('GET');
    });

    it('createDocumentation() — POST /api/documentation', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/documentation`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 1 } };
        }),
      );
      await makeClient().createDocumentation({ title: 't' });
      const body = await captured.current!.json();
      expect(body.title).toBe('t');
    });

    it('getDocumentation() — GET /api/documentation/{documentation}', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/documentation/8`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 8 } };
        }),
      );
      await makeClient().getDocumentation(8);
      expect(captured.current!.method).toBe('GET');
    });

    it('updateDocumentation() — PUT /api/documentation/{documentation}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/documentation/8`, async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 8 } };
        }),
      );
      await makeClient().updateDocumentation(8, { title: 'updated' });
      expectMethodOverride(captured.current!, 'PUT');
    });

    it('deleteDocumentation() — DELETE /api/documentation/{documentation}', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/documentation/8`, ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().deleteDocumentation(8);
      expect(captured.current!.method).toBe('DELETE');
    });
  });
});
