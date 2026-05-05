/**
 * Endpoint coverage for `MiscCoreApiClient` — 89 endpoints in the long-tail
 * `Core` slice. Tests are grouped by sub-domain (admin/creator/program/auth/
 * public/gov/home/etc.). Each test:
 *   - Registers an MSW handler keyed on the *raw* outbound HTTP method
 *     (POST for PUT/PATCH overrides; DELETE/GET stay as-is).
 *   - Captures the inbound `Request` and asserts URL, method override (where
 *     applicable), Authorization (Bearer for `auth: api`/`admin`, none for
 *     `auth: public`), and `X-Domain` propagation.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectMethodOverride,
  expectNoAuthHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { MiscCoreApiClient } from '../misc-core-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'misc-core-tok';
const DOMAIN = 'project20x.com';

interface Captured {
  current: Request | null;
}

function makeClient(): MiscCoreApiClient {
  return new MiscCoreApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('MiscCoreApiClient — long-tail Core endpoints', () => {
  let captured: Captured;
  beforeEach(() => {
    captured = { current: null };
  });

  // ===========================================================================
  // admin-side single-resource updates (auth: admin)
  // ===========================================================================
  it('updateAdministrator() — PUT /api/administrator/{id}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/administrator/9`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: {} };
      }),
    );
    await makeClient().updateAdministrator(9, {
      full_name: 'A',
      email: 'a@b.c',
      subproject_id: 1,
    });
    expectMethodOverride(captured.current!, 'PUT');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
  });

  it('updateAiLog() — PUT /api/ai/log/{log}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/ai/log/3`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: {} };
      }),
    );
    await makeClient().updateAiLog(3);
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('updateAiPolicy() — PUT /api/ai/policy/{policy}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/ai/policy/3`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: {} };
      }),
    );
    await makeClient().updateAiPolicy(3, {
      title: 't',
      slug: 's',
      summary: 'sm',
      body: 'b',
    });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('updateAiPrompt() — PUT /api/ai/prompts/update/{prompt}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/ai/prompts/update/3`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().updateAiPrompt(3, { prompt_text: 'p' });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('updateDocumentation() — PUT /api/documentation/{id}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/documentation/3`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: {} };
      }),
    );
    await makeClient().updateDocumentation(3, {
      title: 't',
      description: 'd',
      steps: [],
    });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('updateFee() — PUT /api/fees/fee/{fee}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/fees/fee/3`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: {} };
      }),
    );
    await makeClient().updateFee(3, {
      user_id: 1,
      service_fee: 1,
      processor_correction: 0,
      processor_fee: 0,
    });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('updateProgramCategory() — PUT /api/program-category/{id}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/program-category/3`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().updateProgramCategory(3, {
      id: 3,
      category_name: 'c',
      category_description: 'd',
    });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('updateProgramSubCategory() — PUT /api/program-sub-category/{id}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/program-sub-category/3`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().updateProgramSubCategory(3, {
      id: 3,
      category_id: 1,
      sub_category_name: 's',
      sub_category_description: 'd',
    });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('updateProgramTag() — PUT /api/program-tag/{id}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/program-tag/3`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: {} };
      }),
    );
    await makeClient().updateProgramTag(3, { tag_name: 'fitness' });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('updateProjectRole() — PUT /api/project-role/{id}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/project-role/3`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: {} };
      }),
    );
    await makeClient().updateProjectRole(3, { name: 'Admin', permissions: [] });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('updateStatistic() — PUT /api/statistic/{id}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/statistic/3`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: {} };
      }),
    );
    await makeClient().updateStatistic(3, {
      icon: 'i',
      value: '1',
      label: 'l',
      color: '#000',
      call_method: 'm',
    });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('adminUpdateUserById() — PUT /api/user/{user}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/user/3`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: {} };
      }),
    );
    await makeClient().adminUpdateUserById(3, {
      full_name: 'A',
      email: 'a@b.c',
      username: 'a',
      phone: '+1',
      profession: 'p',
      description: 'd',
      subproject_id: 1,
      country_id: 1,
      roles: [],
    });
    expectMethodOverride(captured.current!, 'PUT');
  });

  // ===========================================================================
  // creator + program adjacent
  // ===========================================================================
  it('updateCreatorRequest() — PUT /api/creator-request/{id}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/creator-request/3`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().updateCreatorRequest(3, { status: 'approved' });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('updateCreator() — PUT /api/creator/{id}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/creator/3`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: {} };
      }),
    );
    await makeClient().updateCreator(3, { featured: true });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('updateProgram() — PUT /api/program/update-program/{id}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/program/update-program/3`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().updateProgram(3);
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('listAllProgramCategories() — GET /api/program-category/all', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/program-category/all`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().listAllProgramCategories();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
  });

  it('listAllProgramSubCategories() — GET /api/program-sub-category/all', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/program-sub-category/all`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().listAllProgramSubCategories();
    expect(captured.current!.method).toBe('GET');
  });

  it('listAllProgramTags() — GET /api/program-tag/all', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/program-tag/all`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().listAllProgramTags();
    expect(captured.current!.method).toBe('GET');
  });

  it('getProgramPublishedStatus() — GET /api/program-status/get/{program}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/program-status/get/3`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().getProgramPublishedStatus(3);
    expect(captured.current!.method).toBe('GET');
  });

  it('setProgramPublishedStatus() — POST /api/program-status/set/{program}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/program-status/set/3`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().setProgramPublishedStatus(3, { is_published: true });
    expect((await captured.current!.json()).is_published).toBe(true);
  });

  it('listProgramSales() — GET /api/program-sale', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/program-sale`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().listProgramSales();
    expect(captured.current!.method).toBe('GET');
  });

  it('createProgramSale() — POST /api/program-sale', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/program-sale`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    await makeClient().createProgramSale();
    expect(captured.current!.method).toBe('POST');
  });

  it('updateProgramSale() — PUT /api/program-sale/{id}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/program-sale/3`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: {} };
      }),
    );
    await makeClient().updateProgramSale(3);
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('updateProtocol() — PUT /api/protocol/{protocol}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/protocol/3`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: {} };
      }),
    );
    await makeClient().updateProtocol(3, { name: 'n', category_id: 1, problem: 'p' });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('updateProtocolSale() — PATCH /api/protocol/sale/update/{protocol}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/protocol/sale/update/3`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().updateProtocolSale(3, { amount: 1, salary: 2 });
    expectMethodOverride(captured.current!, 'PATCH');
  });

  it('updateSubscription() — PATCH /api/subscription/update/{id}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/subscription/update/3`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().updateSubscription(3);
    expectMethodOverride(captured.current!, 'PATCH');
  });

  it('updateRole() — PUT /api/role/{role}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/role/3`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: {} };
      }),
    );
    await makeClient().updateRole(3);
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('updateSeoPage() — PUT /api/seo-page/{id}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/seo-page/3`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: {} };
      }),
    );
    await makeClient().updateSeoPage(3, { page: 'home', items: [] });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('saveFrontend() — PUT /api/frontend/save-frontend', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/frontend/save-frontend`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().saveFrontend({
      project_name: 'p',
      project_short_description: 'd',
      reviews_title: 'r',
      reviews_description: 'rd',
      footer_text: 'f',
      how_it_works: [],
    });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('updateDomainInterface() — PATCH /api/domain-interfaces/{id}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/domain-interfaces/3`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().updateDomainInterface(3, { enabled: true });
    expectMethodOverride(captured.current!, 'PATCH');
  });

  // ===========================================================================
  // auth + user (api band)
  // ===========================================================================
  it('changeForcedPassword() — POST /api/auth/change-forced-password', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/auth/change-forced-password`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().changeForcedPassword({ password: 'pw' });
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
  });

  it('resendVerifyEmail() — GET /api/resend-verify-email', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/resend-verify-email`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: {} };
      }),
    );
    await makeClient().resendVerifyEmail();
    expect(captured.current!.method).toBe('GET');
  });

  it('verifyCode() — POST /api/verify-code', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/verify-code`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: {} };
      }),
    );
    await makeClient().verifyCode({ code: '111111' });
    expect((await captured.current!.json()).code).toBe('111111');
  });

  it('patchBillingInfo() — PATCH /api/users/update-billing-info', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/users/update-billing-info`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().patchBillingInfo({
      address: 'a',
      city: 'b',
      state: 'MA',
      zip: '0',
    });
    expectMethodOverride(captured.current!, 'PATCH');
  });

  it('patchUserPassword() — PATCH /api/users/update-password/{user}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/users/update-password/3`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().patchUserPassword(3, { password: 'pw' });
    expectMethodOverride(captured.current!, 'PATCH');
  });

  it('patchUserPhone() — PATCH /api/users/update-phone', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/users/update-phone`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().patchUserPhone({ phone: '+1', code: '111' });
    expectMethodOverride(captured.current!, 'PATCH');
  });

  it('patchUser() — PATCH /api/users/update/{user}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/users/update/3`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().patchUser(3, { username: 'u' });
    expectMethodOverride(captured.current!, 'PATCH');
  });

  // ===========================================================================
  // chat
  // ===========================================================================
  it('deleteChat() — DELETE /api/chat/delete-сhat/{chat} (Cyrillic "с")', async () => {
    // Spec path uses a Cyrillic "с" (U+0441). The SDK URL-encodes that to
    // `%D1%81` on the wire, so we register MSW at BOTH the literal path
    // (what the spec-coverage regex looks for) and the encoded path (what
    // MSW actually intercepts) — only one will fire per call.
    server.use(
      mockEndpoint(
        'delete',
        `${BASE}/api/chat/delete-сhat/3`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        },
      ),
      mockEndpoint(
        'delete',
        `${BASE}/api/chat/delete-${encodeURIComponent('с')}hat/3`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        },
      ),
    );
    await makeClient().deleteChat(3);
    expect(captured.current!.method).toBe('DELETE');
  });

  // ===========================================================================
  // public auth + login flows
  // ===========================================================================
  it('dashboardCreateLoginTransaction() — POST /api/dashboard/create-login-transaction (public)', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/dashboard/create-login-transaction`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().dashboardCreateLoginTransaction({
      driver: 'google',
      redirect_url: 'https://x',
      secret_token: 't',
    });
    expectNoAuthHeader(captured.current!);
  });

  it('publicAuthBySocialToken() — POST /api/public/auth-by-social-token (public)', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/public/auth-by-social-token`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().publicAuthBySocialToken();
    expectNoAuthHeader(captured.current!);
  });

  it('publicContact() — POST /api/public/contact (public)', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/public/contact`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: {} };
      }),
    );
    await makeClient().publicContact({
      description: 'd',
      email: 'a@b.c',
      full_name: 'A',
      subject: 's',
    });
    expectNoAuthHeader(captured.current!);
  });

  it('publicCreateLoginTransaction() — POST /api/public/create-login-transaction (public)', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/public/create-login-transaction`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().publicCreateLoginTransaction({
      driver: 'google',
      redirect_url: 'https://x',
    });
    expectNoAuthHeader(captured.current!);
  });

  it('publicVerifySocialToken() — POST /api/public/verify-social-token (public)', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/public/verify-social-token`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().publicVerifySocialToken({ driver: 'google', social: {} });
    expectNoAuthHeader(captured.current!);
  });

  // ===========================================================================
  // interface (public)
  // ===========================================================================
  it('interfaceAuthByToken() — GET /api/interface/auth-token/{token} (public)', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/interface/auth-token/abc`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().interfaceAuthByToken('abc');
    expectNoAuthHeader(captured.current!);
  });

  it('interfaceAuthBySessionKey() — GET /api/interface/auth/{sessionKey} (public)', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/interface/auth/sk`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().interfaceAuthBySessionKey('sk');
    expectNoAuthHeader(captured.current!);
  });

  it('interfaceGetSms() — POST /api/interface/get-sms (public)', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/interface/get-sms`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().interfaceGetSms({ token: 't', phone: '+1' });
    expectNoAuthHeader(captured.current!);
  });

  it('interfaceVerifyCode() — POST /api/interface/verify-code (public)', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/interface/verify-code`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().interfaceVerifyCode({ token: 't', code: '111' });
    expectNoAuthHeader(captured.current!);
  });

  // ===========================================================================
  // MCP connector
  // ===========================================================================
  it('mcpConnectorIndex() — GET /api/mcp/connector (public)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/mcp/connector`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().mcpConnectorIndex();
    expectNoAuthHeader(captured.current!);
  });

  it('mcpConnectorStore() — POST /api/mcp/connector (api)', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/mcp/connector`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: {} };
      }),
    );
    await makeClient().mcpConnectorStore({});
    expectAuthHeader(captured.current!, TOKEN);
  });

  // ===========================================================================
  // gov directory (public)
  // ===========================================================================
  it('getGovAgencyFooter() — GET /api/gov/agency-footer (public)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/gov/agency-footer`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: {} };
      }),
    );
    await makeClient().getGovAgencyFooter();
    expectNoAuthHeader(captured.current!);
  });

  it('getGovCities() — GET /api/gov/cities (public, with query params)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/gov/cities`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().getGovCities({ country: 'US', state: 'MA', q: 'B', limit: 10 });
    const url = new URL(captured.current!.url);
    expect(url.searchParams.get('country')).toBe('US');
    expect(url.searchParams.get('limit')).toBe('10');
    expectNoAuthHeader(captured.current!);
  });

  it('getGovCityAgencies() — GET /api/gov/city-agencies (public)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/gov/city-agencies`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().getGovCityAgencies({ slug: 'boston' });
    expect(new URL(captured.current!.url).searchParams.get('slug')).toBe('boston');
  });

  it('getGovFederalDirectory() — GET /api/gov/federal-directory (public)', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/gov/federal-directory`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().getGovFederalDirectory();
    expectNoAuthHeader(captured.current!);
  });

  it('getGovStates() — GET /api/gov/states (public)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/gov/states`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().getGovStates({ country: 'US', q: 'M', limit: 5 });
    expect(new URL(captured.current!.url).searchParams.get('q')).toBe('M');
  });

  it('getGovSubprojects() — GET /api/gov/subprojects (public)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/gov/subprojects`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().getGovSubprojects({ classification: 'federal', limit: 5 });
    expect(new URL(captured.current!.url).searchParams.get('classification')).toBe('federal');
  });

  it('getGovSubprojectByDomain() — GET /api/gov/subprojects/by-domain (public)', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/gov/subprojects/by-domain`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().getGovSubprojectByDomain();
    expectNoAuthHeader(captured.current!);
  });

  it('getPoliticiansByDomain() — GET /api/politicians-by-domain (public)', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/politicians-by-domain`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().getPoliticiansByDomain();
    expectNoAuthHeader(captured.current!);
  });

  // ===========================================================================
  // home (public)
  // ===========================================================================
  it('getHomeFeaturedCreators() — GET /api/home/featured-creators (public)', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/home/featured-creators`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().getHomeFeaturedCreators();
    expectNoAuthHeader(captured.current!);
  });

  it('getHomeFeaturedPrograms() — GET /api/home/featured-programs (public)', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/home/featured-programs`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().getHomeFeaturedPrograms();
    expectNoAuthHeader(captured.current!);
  });

  it('getHomeFeedback() — GET /api/home/feedback (public)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/home/feedback`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().getHomeFeedback();
    expectNoAuthHeader(captured.current!);
  });

  it('getHomeFrontend() — GET /api/home/frontend/{items} (public)', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/home/frontend/header`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().getHomeFrontend('header');
    expectNoAuthHeader(captured.current!);
  });

  it('getHomeMostRecentPrograms() — GET /api/home/most-recent-programs (public)', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/home/most-recent-programs`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().getHomeMostRecentPrograms();
    expectNoAuthHeader(captured.current!);
  });

  it('getHomeStatistic() — GET /api/home/statistic (public)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/home/statistic`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: {} };
      }),
    );
    await makeClient().getHomeStatistic();
    expectNoAuthHeader(captured.current!);
  });

  // ===========================================================================
  // public catalog / feed (public)
  // ===========================================================================
  it('listPublicCreators() — GET /api/public/creators (public)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/public/creators`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().listPublicCreators();
    expectNoAuthHeader(captured.current!);
  });

  it('filterPublicCreators() — POST /api/public/creators/filter (public)', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/public/creators/filter`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().filterPublicCreators({ search: 'q' });
    expect((await captured.current!.json()).search).toBe('q');
    expectNoAuthHeader(captured.current!);
  });

  it('getDocumentationRandomFeedback() — GET /api/public/documentation/random-feedback', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/public/documentation/random-feedback`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().getDocumentationRandomFeedback();
    expectNoAuthHeader(captured.current!);
  });

  it('searchPublicDocumentation() — GET /api/public/documentation/search/{search?}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/public/documentation/search/foo`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().searchPublicDocumentation('foo');
    expect(captured.current!.method).toBe('GET');
  });

  it('showPublicDocumentation() — GET /api/public/documentation/show/{documentation}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/public/documentation/show/3`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().showPublicDocumentation(3);
    expectNoAuthHeader(captured.current!);
  });

  it('getPublicProgramCategories() — GET /api/public/get-program-categories', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/public/get-program-categories`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().getPublicProgramCategories();
    expectNoAuthHeader(captured.current!);
  });

  it('getPublicProgramFeedback() — GET /api/public/get-program-feedback/{program}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/public/get-program-feedback/3`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().getPublicProgramFeedback(3);
    expectNoAuthHeader(captured.current!);
  });

  it('getPublicProgramShopCategories() — GET /api/public/get-program-shop-categories', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/public/get-program-shop-categories`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().getPublicProgramShopCategories();
    expectNoAuthHeader(captured.current!);
  });

  it('getPublicProgram() — GET /api/public/get-program/{program}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/public/get-program/3`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().getPublicProgram(3);
    expectNoAuthHeader(captured.current!);
  });

  it('getPublicPrograms() — GET /api/public/get-programs', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/public/get-programs`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().getPublicPrograms();
    expectNoAuthHeader(captured.current!);
  });

  it('getPublicRoles() — GET /api/public/get-roles', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/public/get-roles`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().getPublicRoles();
    expectNoAuthHeader(captured.current!);
  });

  it('getPublicUserFeatured() — GET /api/public/get-user-featured/{user}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/public/get-user-featured/3`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().getPublicUserFeatured(3);
    expectNoAuthHeader(captured.current!);
  });

  it('getPublicUserFeed() — GET /api/public/get-user-feed/{user}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/public/get-user-feed/3`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().getPublicUserFeed(3);
    expectNoAuthHeader(captured.current!);
  });

  it('getPublicProgramSaleMoneyDistributions() — GET /api/public/program-sale/money-distributions', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/public/program-sale/money-distributions`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().getPublicProgramSaleMoneyDistributions();
    expectNoAuthHeader(captured.current!);
  });

  it('resolvePublicShortLink() — GET /api/public/short-link/{shortLink}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/public/short-link/abcd`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().resolvePublicShortLink('abcd');
    expectNoAuthHeader(captured.current!);
  });

  it('listPublicSubprojects() — GET /api/public/subprojects', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/public/subprojects`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().listPublicSubprojects();
    expectNoAuthHeader(captured.current!);
  });

  it('searchPublicSubprojects() — POST /api/public/subprojects/search', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/public/subprojects/search`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().searchPublicSubprojects({ search: 'foo' });
    expect((await captured.current!.json()).search).toBe('foo');
    expectNoAuthHeader(captured.current!);
  });

  it('getPublicTeamInvite() — GET /api/public/team/get-invite/{token}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/public/team/get-invite/abc`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().getPublicTeamInvite('abc');
    expectNoAuthHeader(captured.current!);
  });

  it('getPublicTeamInvitedData() — GET /api/public/team/get-invited-data/{token}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/public/team/get-invited-data/abc`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().getPublicTeamInvitedData('abc');
    expectNoAuthHeader(captured.current!);
  });

  it('rejectPublicTeamInvite() — DELETE /api/public/team/reject-invite/{token}', async () => {
    server.use(
      mockEndpoint(
        'delete',
        `${BASE}/api/public/team/reject-invite/abc`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: null };
        },
      ),
    );
    await makeClient().rejectPublicTeamInvite('abc');
    expect(captured.current!.method).toBe('DELETE');
    expectNoAuthHeader(captured.current!);
  });

  it('getPublicTopCreators() — GET /api/public/top-creators', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/public/top-creators`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().getPublicTopCreators();
    expectNoAuthHeader(captured.current!);
  });

  it('getPublicUserCountry() — GET /api/public/user-country/{id}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/public/user-country/3`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().getPublicUserCountry(3);
    expectNoAuthHeader(captured.current!);
  });

  // ===========================================================================
  // misc public
  // ===========================================================================
  it('publicSearch() — GET /api/search (public)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/search`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().publicSearch({ q: 'hi' });
    expect(new URL(captured.current!.url).searchParams.get('q')).toBe('hi');
    expectNoAuthHeader(captured.current!);
  });

  it('getShowcaseProjects() — GET /api/showcase/projects (public)', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/showcase/projects`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().getShowcaseProjects();
    expectNoAuthHeader(captured.current!);
  });

  it('getTwitterTimeline() — GET /api/twitter/timeline (public)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/twitter/timeline`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().getTwitterTimeline();
    expectNoAuthHeader(captured.current!);
  });

  it('broadcastingAuth() — GET /broadcasting/auth (public)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/broadcasting/auth`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: {} };
      }),
    );
    await makeClient().broadcastingAuth();
    expectNoAuthHeader(captured.current!);
  });
});
