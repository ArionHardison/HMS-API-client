/**
 * Endpoint coverage for `ConnectorModuleApiClient` (`Modules/Connector`).
 *
 * Spec source: `sdk/spec/endpoints.json` — module === "Modules/Connector"
 * (10 endpoints). Each endpoint gets one `it()` covering URL, raw HTTP
 * method (PUT comes through as POST + `?_method=PUT` per Laravel idiom),
 * Authorization (Bearer because every Connector endpoint is `auth:api`),
 * `X-Domain`, request body, and response decoding.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectMethodOverride,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { ConnectorModuleApiClient } from '../modules-connector-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'connector-tkn-xyz';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): ConnectorModuleApiClient {
  return new ConnectorModuleApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('ConnectorModuleApiClient — Modules/Connector', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  // ---------------------------------------------------------------------------
  // GET /api/connector — connector.index
  // ---------------------------------------------------------------------------
  it('list() — GET /api/connector', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/connector`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    const res = await makeClient().list();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(res.data).toEqual([]);
  });

  // ---------------------------------------------------------------------------
  // POST /api/connector — connector.store
  // ---------------------------------------------------------------------------
  it('create() — POST /api/connector', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/connector`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 7 } };
      }),
    );
    const body = {
      title: 'Slack',
      description: 'Slack bot',
      server_command: 'node mcp-slack',
      server_args: ['--port', '9001'],
      server_env: { TOKEN: 'xoxb-...' },
      selected_tool: 'sendMessage',
      tool_parameters: { channel: '#general' },
      timeout: 30,
    };
    await makeClient().create(body);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
  });

  // ---------------------------------------------------------------------------
  // POST /api/connector/execute — post.api.connector.execute
  // ---------------------------------------------------------------------------
  it('execute() — POST /api/connector/execute', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/connector/execute`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { success: true, result: { ok: 1 } } };
      }),
    );
    const body = { id: 11, chain_id: 22 };
    const res = await makeClient().execute(body);
    expect(captured.current!.method).toBe('POST');
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data).toMatchObject({ success: true });
  });

  // ---------------------------------------------------------------------------
  // GET /api/connector/run-global/{connector}/{task} — get.api.connector.run-global.item.item
  // ---------------------------------------------------------------------------
  it('runGlobal() — GET /api/connector/run-global/{connector}/{task}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/connector/run-global/3/9`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { result: 'ok' } };
        },
      ),
    );
    const res = await makeClient().runGlobal(3, 9);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toMatchObject({ result: 'ok' });
  });

  // ---------------------------------------------------------------------------
  // GET /api/connector/run/{connector}/{chain} — get.api.connector.run.item.item
  // ---------------------------------------------------------------------------
  it('run() — GET /api/connector/run/{connector}/{chain}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/connector/run/3/9`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 3 } };
        },
      ),
    );
    await makeClient().run(3, 9);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
  });

  // ---------------------------------------------------------------------------
  // GET /api/connector/{connector} — connector.show
  // ---------------------------------------------------------------------------
  it('show() — GET /api/connector/{connector}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/connector/77`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 77 } };
      }),
    );
    const res = await makeClient().show(77);
    expect(captured.current!.method).toBe('GET');
    expect(res.data).toEqual({ id: 77 });
  });

  // ---------------------------------------------------------------------------
  // PUT /api/connector/{connector} — connector.update
  // ---------------------------------------------------------------------------
  it('update() — PUT /api/connector/{connector} (sent as POST + ?_method=PUT)', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/connector/77`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 77 } };
        },
      ),
    );
    const body = { title: 'Updated', server_command: 'node mcp-slack' };
    await makeClient().update(77, body);
    expectMethodOverride(captured.current!, 'PUT');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
  });

  // ---------------------------------------------------------------------------
  // DELETE /api/connector/{connector} — connector.destroy
  // ---------------------------------------------------------------------------
  it('destroy() — DELETE /api/connector/{connector}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/connector/77`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().destroy(77);
    expect(captured.current!.method).toBe('DELETE');
    expectAuthHeader(captured.current!, TOKEN);
  });

  // ---------------------------------------------------------------------------
  // GET /api/connector/{connector}/discover — get.api.connector.item.discover
  // ---------------------------------------------------------------------------
  it('discover() — GET /api/connector/{connector}/discover', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/connector/77/discover`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { tools: [] } };
        },
      ),
    );
    const res = await makeClient().discover(77);
    expect(captured.current!.method).toBe('GET');
    expect(res.data).toMatchObject({ tools: [] });
  });

  // ---------------------------------------------------------------------------
  // GET /api/protocol/connector/all — get.api.protocol.connector.all
  // ---------------------------------------------------------------------------
  it('listProtocolConnectors() — GET /api/protocol/connector/all', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/protocol/connector/all`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    const res = await makeClient().listProtocolConnectors();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual([]);
  });
});
