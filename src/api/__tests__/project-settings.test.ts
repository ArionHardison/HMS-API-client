/**
 * Endpoint coverage for `ProjectSettingsApiClient` — 10 endpoints (5 sections
 * × {show GET, save POST}).
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { ProjectSettingsApiClient } from '../project-settings-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'admin-tok-ps';
const DOMAIN = 'project20x.com';

interface Captured {
  current: Request | null;
}

function makeClient(): ProjectSettingsApiClient {
  return new ProjectSettingsApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

const SAMPLE_CONTENT = {
  id: 1,
  name: 'x',
  parent_project: 1,
  categories: [],
  placeholders: {},
} as const;

const SAMPLE_DOMAINS = {
  id: 1,
  state_id: null,
  city_id: null,
  country_id: 1,
  domain: 'a.b',
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
  meta: {},
} as const;

const SAMPLE_TEMPLATE = {
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
} as const;

describe('ProjectSettingsApiClient — /api/project-settings/{section}/{...}', () => {
  let captured: Captured;
  beforeEach(() => {
    captured = { current: null };
  });

  // content
  it('showContent() — GET /api/project-settings/content/show/{subproject}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/project-settings/content/show/42`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().showContent(42);
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(captured.current!.method).toBe('GET');
  });

  it('saveContent() — POST /api/project-settings/content/{subproject}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/project-settings/content/42`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().saveContent(SAMPLE_CONTENT, 42);
    expect(captured.current!.method).toBe('POST');
    expect((await captured.current!.json()).id).toBe(1);
  });

  // domains
  it('showDomains() — GET /api/project-settings/domains/show/{subproject}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/project-settings/domains/show/42`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().showDomains(42);
    expect(captured.current!.method).toBe('GET');
  });

  it('saveDomains() — POST /api/project-settings/domains/{subproject}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/project-settings/domains/42`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().saveDomains(SAMPLE_DOMAINS, 42);
    expect(captured.current!.method).toBe('POST');
  });

  // layout — exercise both the omitted-subproject and explicit-id paths so
  // the spec-coverage detector matches the `{subproject?}` template.
  it('showLayout() — GET /api/project-settings/layout/show (no subproject)', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/project-settings/layout/show`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().showLayout();
    expect(captured.current!.method).toBe('GET');
  });

  it('showLayout() — GET /api/project-settings/layout/show/{subproject}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/project-settings/layout/show/42`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().showLayout(42);
    expect(captured.current!.method).toBe('GET');
  });

  it('saveLayout() — POST /api/project-settings/layout/{subproject}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/project-settings/layout/42`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().saveLayout(SAMPLE_LAYOUT, 42);
    expect(captured.current!.method).toBe('POST');
  });

  // seo
  it('showSeo() — GET /api/project-settings/seo/show/{subproject}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/project-settings/seo/show/42`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().showSeo(42);
    expect(captured.current!.method).toBe('GET');
  });

  it('saveSeo() — POST /api/project-settings/seo/{subproject}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/project-settings/seo/42`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().saveSeo(SAMPLE_SEO, 42);
    expect(captured.current!.method).toBe('POST');
  });

  // template
  it('showTemplate() — GET /api/project-settings/template/show/{subproject}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/project-settings/template/show/42`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().showTemplate(42);
    expect(captured.current!.method).toBe('GET');
  });

  it('saveTemplate() — POST /api/project-settings/template/{subproject}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/project-settings/template/42`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().saveTemplate(SAMPLE_TEMPLATE, 42);
    expect(captured.current!.method).toBe('POST');
  });
});
