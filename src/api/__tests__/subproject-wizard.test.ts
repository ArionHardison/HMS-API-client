/**
 * Endpoint coverage for `SubprojectWizardApiClient` — 6 endpoints across
 * `/api/subproject-wizard/{section}/{id}`. All `auth: admin`.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { SubprojectWizardApiClient } from '../subproject-wizard-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'admin-tok-spw';
const DOMAIN = 'usich.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): SubprojectWizardApiClient {
  return new SubprojectWizardApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('SubprojectWizardApiClient — /api/subproject-wizard/*/{id}', () => {
  let captured: Request | null = null;
  beforeEach(() => {
    captured = null;
  });

  it('wizardContent() — POST /api/subproject-wizard/content/{id}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/subproject-wizard/content/9`,
        async ({ request }) => {
          captured = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().wizardContent(9, {
      name: 'x',
      parent_project: 1,
      categories: [],
      placeholders: {},
    });
    expect(captured!.method).toBe('POST');
    expectAuthHeader(captured!, TOKEN);
    expectDomainHeader(captured!, DOMAIN);
    expect((await captured!.json()).name).toBe('x');
  });

  it('wizardDomains() — POST /api/subproject-wizard/domains/{id}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/subproject-wizard/domains/9`,
        async ({ request }) => {
          captured = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().wizardDomains(9, {
      state_id: null,
      city_id: null,
      country_id: null,
      domain: 'a.b',
      aliases: [],
    });
    expect(captured!.method).toBe('POST');
  });

  it('wizardLayout() — POST /api/subproject-wizard/layout/{id}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/subproject-wizard/layout/9`,
        async ({ request }) => {
          captured = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().wizardLayout(9, {
      logo: null,
      style: 's',
      show_top_logo: true,
      show_top_title: true,
      show_top_description: true,
      show_submit_button: true,
      allow_file_upload: false,
      allow_audio_input: false,
      show_header: true,
      show_footer: true,
      show_loading_overlay: false,
      show_autocomplete: false,
    });
    expect(captured!.method).toBe('POST');
  });

  it('wizardSeo() — POST /api/subproject-wizard/seo/{id}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/subproject-wizard/seo/9`,
        async ({ request }) => {
          captured = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().wizardSeo(9, {
      title: 't',
      description: 'd',
      keywords: 'k',
      meta: {},
    });
    expect(captured!.method).toBe('POST');
  });

  it('wizardTeam() — POST /api/subproject-wizard/team/{id}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/subproject-wizard/team/9`,
        async ({ request }) => {
          captured = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().wizardTeam(9, { id: 9, members: [] });
    expect(captured!.method).toBe('POST');
  });

  it('wizardTemplate() — POST /api/subproject-wizard/template/{id}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/subproject-wizard/template/9`,
        async ({ request }) => {
          captured = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().wizardTemplate(9, {
      font_color: '#000',
      buttons_font_color: '#000',
      danger_color: '#000',
      warning_color: '#000',
      success_color: '#000',
      info_color: '#000',
      primary_color: '#000',
      background_color: '#fff',
      disabled_color: '#888',
      link_color: '#00f',
    });
    expect(captured!.method).toBe('POST');
  });
});
