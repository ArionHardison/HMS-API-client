/**
 * Endpoint coverage for `SubprojectAdminApiClient` — 12 endpoints (6 create
 * + 6 claim sections). All `auth: admin`.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { SubprojectAdminApiClient } from '../subproject-admin-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'admin-tok-456';
const DOMAIN = 'doed.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): SubprojectAdminApiClient {
  return new SubprojectAdminApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

const SAMPLE_CONTENT = {
  name: 'My subproject',
  parent_project: 1,
  categories: [],
  placeholders: {},
} as const;
const SAMPLE_DOMAINS = {
  state_id: null,
  city_id: null,
  country_id: 1,
  domain: 'sub.example.org',
  aliases: [],
} as const;
const SAMPLE_LAYOUT = {
  logo: null,
  style: 'default',
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
} as const;
const SAMPLE_SEO = {
  title: 't',
  description: 'd',
  keywords: 'k',
  meta: { 'og:title': 't' },
} as const;
const SAMPLE_TEAM = { id: 1, members: [{ id: 5 }] } as const;
const SAMPLE_TEMPLATE = {
  font_color: '#000',
  buttons_font_color: '#000',
  danger_color: '#f00',
  warning_color: '#fa0',
  success_color: '#0a0',
  info_color: '#00f',
  primary_color: '#0a0',
  background_color: '#fff',
  disabled_color: '#888',
  link_color: '#00f',
} as const;

describe('SubprojectAdminApiClient — /api/subproject-admin/{create,claim}/*', () => {
  let captured: Captured;
  beforeEach(() => {
    captured = { current: null };
  });

  // ---------------------------------------------------------------------------
  // create-section
  // ---------------------------------------------------------------------------
  it('createSubprojectContent() — POST /api/subproject-admin/create/subproject/content', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/subproject-admin/create/subproject/content`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().createSubprojectContent(SAMPLE_CONTENT);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expect((await captured.current!.json()).name).toBe('My subproject');
  });

  it('createSubprojectDomains() — POST /api/subproject-admin/create/subproject/domains', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/subproject-admin/create/subproject/domains`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().createSubprojectDomains(SAMPLE_DOMAINS);
    expect((await captured.current!.json()).domain).toBe('sub.example.org');
  });

  it('createSubprojectLayout() — POST /api/subproject-admin/create/subproject/layout', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/subproject-admin/create/subproject/layout`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().createSubprojectLayout(SAMPLE_LAYOUT);
    expect((await captured.current!.json()).style).toBe('default');
  });

  it('createSubprojectSeo() — POST /api/subproject-admin/create/subproject/seo', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/subproject-admin/create/subproject/seo`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().createSubprojectSeo(SAMPLE_SEO);
    expect((await captured.current!.json()).title).toBe('t');
  });

  it('createSubprojectTeam() — POST /api/subproject-admin/create/subproject/team', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/subproject-admin/create/subproject/team`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().createSubprojectTeam(SAMPLE_TEAM);
    const body = await captured.current!.json();
    expect(body.members).toEqual([{ id: 5 }]);
  });

  it('createSubprojectTemplate() — POST /api/subproject-admin/create/subproject/template', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/subproject-admin/create/subproject/template`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().createSubprojectTemplate(SAMPLE_TEMPLATE);
    expect((await captured.current!.json()).primary_color).toBe('#0a0');
  });

  // ---------------------------------------------------------------------------
  // claim-section
  // ---------------------------------------------------------------------------
  it('claimSubprojectContent() — POST /api/subproject-admin/claim/subproject/{id}/content', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/subproject-admin/claim/subproject/42/content`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().claimSubprojectContent(42, SAMPLE_CONTENT);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
  });

  it('claimSubprojectDomains() — POST /api/subproject-admin/claim/subproject/{id}/domains', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/subproject-admin/claim/subproject/42/domains`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().claimSubprojectDomains(42, SAMPLE_DOMAINS);
    expect(captured.current!.method).toBe('POST');
  });

  it('claimSubprojectLayout() — POST /api/subproject-admin/claim/subproject/{id}/layout', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/subproject-admin/claim/subproject/42/layout`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().claimSubprojectLayout(42, SAMPLE_LAYOUT);
    expect(captured.current!.method).toBe('POST');
  });

  it('claimSubprojectSeo() — POST /api/subproject-admin/claim/subproject/{id}/seo', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/subproject-admin/claim/subproject/42/seo`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().claimSubprojectSeo(42, SAMPLE_SEO);
    expect(captured.current!.method).toBe('POST');
  });

  it('claimSubprojectTeam() — POST /api/subproject-admin/claim/subproject/{id}/team', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/subproject-admin/claim/subproject/42/team`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().claimSubprojectTeam(42, SAMPLE_TEAM);
    expect(captured.current!.method).toBe('POST');
  });

  it('claimSubprojectTemplate() — POST /api/subproject-admin/claim/subproject/{id}/template', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/subproject-admin/claim/subproject/42/template`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().claimSubprojectTemplate(42, SAMPLE_TEMPLATE);
    expect(captured.current!.method).toBe('POST');
  });
});
