/**
 * Endpoint coverage for `AgentsModuleApiClient` (`Modules/Agents`).
 *
 * Each test follows the same recipe:
 *   1. Register an MSW handler that captures the inbound `Request`.
 *   2. Drive the SDK method.
 *   3. Assert URL, raw HTTP method (post/put/patch are POST + `?_method=`),
 *      Authorization (Bearer for `auth:sanctum`, absent for `auth:public`),
 *      `X-Domain`, body, and response decoding.
 *
 * Spec source: `sdk/spec/endpoints.json` — module === "Modules/Agents". 20
 * endpoints total; one `it()` per endpoint plus auth/domain header coverage.
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
import { AgentsModuleApiClient } from '../modules-agents-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'agent-tkn-xyz';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): AgentsModuleApiClient {
  return new AgentsModuleApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

function makeAnonClient(): AgentsModuleApiClient {
  return new AgentsModuleApiClient({
    baseURL: BASE,
    getDomain: () => DOMAIN,
  });
}

describe('AgentsModuleApiClient — Modules/Agents', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  // ---------------------------------------------------------------------------
  // GET /api/agents — agents.module.index
  // ---------------------------------------------------------------------------
  it('list() — GET /api/agents (sanctum, X-Domain)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/agents`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 1 }] };
      }),
    );
    const res = await makeClient().list();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(res.data).toEqual([{ id: 1 }]);
  });

  // ---------------------------------------------------------------------------
  // POST /api/agents — agents.module.store
  // ---------------------------------------------------------------------------
  it('create() — POST /api/agents with body', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/agents`, async ({ request }) => {
        captured.current = request.clone();
        await request.clone().json();
        return { success: true, message: '', data: { id: 7 } };
      }),
    );
    const body = { name: 'a1', type: 'orchestrator', description: 'x' };
    const res = await makeClient().create(body);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data).toEqual({ id: 7 });
  });

  // ---------------------------------------------------------------------------
  // POST /api/agents/execute-protocol — agents.module.execute.protocol
  // ---------------------------------------------------------------------------
  it('executeProtocol() — POST /api/agents/execute-protocol', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/agents/execute-protocol`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { execution_id: 'e1', status: 'running' } };
      }),
    );
    const body = { protocol_id: 11, agent_id: 3, input: [{ q: 'hi' }] };
    const res = await makeClient().executeProtocol(body);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data).toMatchObject({ execution_id: 'e1' });
  });

  // ---------------------------------------------------------------------------
  // POST /api/agents/intelligent/entity/identify — public
  // ---------------------------------------------------------------------------
  it('identifyEntity() — POST /api/agents/intelligent/entity/identify (public, no auth)', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/agents/intelligent/entity/identify`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { status: 'ok', message: '', errors: null } };
      }),
    );
    const body = { entity: { tag: 'alpha' } };
    const res = await makeAnonClient().identifyEntity(body, { auth: false });
    expect(captured.current!.method).toBe('POST');
    expectNoAuthHeader(captured.current!);
    expect(await captured.current!.json()).toEqual(body);
    expect(res.data).toMatchObject({ status: 'ok' });
  });

  // ---------------------------------------------------------------------------
  // POST /api/agents/intelligent/intent/batch — public
  // ---------------------------------------------------------------------------
  it('processIntentBatch() — POST /api/agents/intelligent/intent/batch', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/agents/intelligent/intent/batch`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { status: 'ok' } };
      }),
    );
    const body = { intents: ['a', 'b'], context: { foo: 'bar' } };
    await makeAnonClient().processIntentBatch(body, { auth: false });
    expect(await captured.current!.json()).toEqual(body);
    expectNoAuthHeader(captured.current!);
  });

  // ---------------------------------------------------------------------------
  // POST /api/agents/intelligent/intent/process — public
  // ---------------------------------------------------------------------------
  it('processIntent() — POST /api/agents/intelligent/intent/process', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/agents/intelligent/intent/process`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { status: 'ok' } };
      }),
    );
    const body = { intent: { kind: 'greet' }, context: { lang: 'en' } };
    await makeAnonClient().processIntent(body, { auth: false });
    expect(await captured.current!.json()).toEqual(body);
  });

  // ---------------------------------------------------------------------------
  // POST /api/agents/intelligent/search — public
  // ---------------------------------------------------------------------------
  it('intelligentSearch() — POST /api/agents/intelligent/search', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/agents/intelligent/search`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { status: 'ok' } };
      }),
    );
    const body = { limit: 10, capability: 'rag', agency: 'doed', state: 'CA', type: 'gov' };
    await makeAnonClient().intelligentSearch(body, { auth: false });
    expect(await captured.current!.json()).toEqual(body);
  });

  // ---------------------------------------------------------------------------
  // GET /api/agents/intelligent/statistics — public
  // ---------------------------------------------------------------------------
  it('intelligentStatistics() — GET /api/agents/intelligent/statistics', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/agents/intelligent/statistics`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { status: 'ok', data: {} } };
      }),
    );
    await makeAnonClient().intelligentStatistics({ auth: false });
    expect(captured.current!.method).toBe('GET');
    expectNoAuthHeader(captured.current!);
  });

  // ---------------------------------------------------------------------------
  // POST /api/agents/resume-execution — agents.module.execute.resume
  // ---------------------------------------------------------------------------
  it('resumeExecution() — POST /api/agents/resume-execution', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/agents/resume-execution`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { execution_id: 'e1', status: 'running' } };
      }),
    );
    const body = { execution_id: 'e1', input: ['continue'] };
    const res = await makeClient().resumeExecution(body);
    expect(await captured.current!.json()).toEqual(body);
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toMatchObject({ execution_id: 'e1' });
  });

  // ---------------------------------------------------------------------------
  // GET /api/agents/{agent} — agents.module.show
  // ---------------------------------------------------------------------------
  it('show() — GET /api/agents/{agent}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/agents/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    const res = await makeClient().show(42);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual({ id: 42 });
  });

  // ---------------------------------------------------------------------------
  // PUT /api/agents/{agent} — agents.module.update (Laravel POST + _method=PUT)
  // ---------------------------------------------------------------------------
  it('update() — PUT /api/agents/{agent} sent as POST + ?_method=PUT', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/agents/42`, async ({ request }) => {
        captured.current = request.clone();
        await request.clone().json();
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    const body = { name: 'renamed' };
    await makeClient().update(42, body);
    expectMethodOverride(captured.current!, 'PUT');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
  });

  // ---------------------------------------------------------------------------
  // DELETE /api/agents/{agent} — agents.module.destroy
  // ---------------------------------------------------------------------------
  it('destroy() — DELETE /api/agents/{agent}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/agents/42`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().destroy(42);
    expect(captured.current!.method).toBe('DELETE');
    expectAuthHeader(captured.current!, TOKEN);
  });

  // ---------------------------------------------------------------------------
  // POST /api/agents/{agent}/activate — agents.module.activate
  // ---------------------------------------------------------------------------
  it('activate() — POST /api/agents/{agent}/activate', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/agents/42/activate`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42, status: 'active' } };
      }),
    );
    const res = await makeClient().activate(42);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toMatchObject({ status: 'active' });
  });

  // ---------------------------------------------------------------------------
  // POST /api/agents/{agent}/clone — agents.module.clone
  // ---------------------------------------------------------------------------
  it('clone() — POST /api/agents/{agent}/clone with body', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/agents/42/clone`, async ({ request }) => {
        captured.current = request.clone();
        await request.clone().json();
        return { success: true, message: '', data: { id: 99 } };
      }),
    );
    const body = { name: 'clone-of-42', type: 'orchestrator' };
    await makeClient().clone(42, body);
    expect(await captured.current!.json()).toEqual(body);
  });

  // ---------------------------------------------------------------------------
  // POST /api/agents/{agent}/deactivate — agents.module.deactivate
  // ---------------------------------------------------------------------------
  it('deactivate() — POST /api/agents/{agent}/deactivate', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/agents/42/deactivate`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42, status: 'inactive' } };
      }),
    );
    const res = await makeClient().deactivate(42);
    expect(captured.current!.method).toBe('POST');
    expect(res.data).toMatchObject({ status: 'inactive' });
  });

  // ---------------------------------------------------------------------------
  // GET /api/agents/{agent}/executions — agents.module.executions
  // ---------------------------------------------------------------------------
  it('executions() — GET /api/agents/{agent}/executions (poll)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/agents/42/executions`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 1, agent_id: 42 }] };
      }),
    );
    const res = await makeClient().executions(42);
    expect(captured.current!.method).toBe('GET');
    expect(res.data).toEqual([{ id: 1, agent_id: 42 }]);
  });

  // ---------------------------------------------------------------------------
  // GET /api/agents/{agent}/statistics — agents.module.statistics
  // ---------------------------------------------------------------------------
  it('statistics() — GET /api/agents/{agent}/statistics', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/agents/42/statistics`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { agent_id: 42, total_executions: 5 } };
      }),
    );
    const res = await makeClient().statistics(42);
    expect(res.data).toMatchObject({ agent_id: 42, total_executions: 5 });
  });

  // ---------------------------------------------------------------------------
  // POST /api/agents/{agent}/tools/{tool} — agents.module.tools.add
  // ---------------------------------------------------------------------------
  it('addTool() — POST /api/agents/{agent}/tools/{tool}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/agents/42/tools/7`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    await makeClient().addTool(42, 7);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
  });

  // ---------------------------------------------------------------------------
  // DELETE /api/agents/{agent}/tools/{tool} — agents.module.tools.remove
  // ---------------------------------------------------------------------------
  it('removeTool() — DELETE /api/agents/{agent}/tools/{tool}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/agents/42/tools/7`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 42 } };
      }),
    );
    await makeClient().removeTool(42, 7);
    expect(captured.current!.method).toBe('DELETE');
    expectAuthHeader(captured.current!, TOKEN);
  });

  // ---------------------------------------------------------------------------
  // GET /api/protocol/agents/all — get.api.protocol.agents.all
  // ---------------------------------------------------------------------------
  it('listProtocolAgents() — GET /api/protocol/agents/all', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/protocol/agents/all`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 1, name: 'p' }] };
      }),
    );
    const res = await makeClient().listProtocolAgents();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toEqual([{ id: 1, name: 'p' }]);
  });

  // ---------------------------------------------------------------------------
  // Cross-cutting: string IDs must round-trip in the path (route binding accepts both).
  // ---------------------------------------------------------------------------
  it('show() — accepts string IDs (route binding is string|number)', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/agents/agent-slug`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    await makeClient().show('agent-slug');
    expect(new URL(captured.current!.url).pathname).toBe('/api/agents/agent-slug');
  });
});
