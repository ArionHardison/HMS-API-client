/**
 * Endpoint coverage for `AgentCommunicationApiClient` — 13 endpoints.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { AgentCommunicationApiClient } from '../agent-communication-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'agent-tok-xyz';
const DOMAIN = 'project20x.com';

interface Captured {
  current: Request | null;
}

function makeClient(): AgentCommunicationApiClient {
  return new AgentCommunicationApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('AgentCommunicationApiClient — /api/agent/*', () => {
  let captured: Captured;
  beforeEach(() => {
    captured = { current: null };
  });

  // ---------------------------------------------------------------------------
  // /api/agent/account
  // ---------------------------------------------------------------------------
  it('finishAgentRegistration() — POST /api/agent/account/finish-registration', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/agent/account/finish-registration`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().finishAgentRegistration({
      full_name: 'Ada',
      timezone: 'UTC',
      country_id: 1,
      login: 'ada',
      email: 'a@b.c',
      phone: '+10000000000',
      password: 'pw',
      agreed: true,
    });
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    const body = await captured.current!.json();
    expect(body.email).toBe('a@b.c');
    expect(body.agreed).toBe(true);
  });

  it('getAgentAccountStatus() — GET /api/agent/account/get-status', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/agent/account/get-status`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { status: 'ok' } };
        },
      ),
    );
    const res = await makeClient().getAgentAccountStatus();
    expect(captured.current!.method).toBe('GET');
    expect(res.data).toEqual({ status: 'ok' });
  });

  it('confirmAgentAccountCode() — POST /api/agent/account/{chain}/confirm-code', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/agent/account/77/confirm-code`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().confirmAgentAccountCode(77, { code: '123456' });
    expect(await captured.current!.json()).toEqual({ code: '123456' });
  });

  // ---------------------------------------------------------------------------
  // /api/agent/communicate
  // ---------------------------------------------------------------------------
  it('getAssignedExperts() — GET /api/agent/communicate/{chain}/assigned-experts', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/agent/communicate/12/assigned-experts`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { experts: [] } };
        },
      ),
    );
    await makeClient().getAssignedExperts(12);
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
  });

  it('getCommunicateStatus() — GET /api/agent/communicate/{chain}/get-status', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/agent/communicate/12/get-status`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { status: 'ready' } };
        },
      ),
    );
    const res = await makeClient().getCommunicateStatus(12);
    expect(res.data).toEqual({ status: 'ready' });
  });

  it('initializeAgent() — GET /api/agent/communicate/{chain}/initialize-agent', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/agent/communicate/12/initialize-agent`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().initializeAgent(12);
    expect(captured.current!.method).toBe('GET');
  });

  it('getCommunicateInvites() — GET /api/agent/communicate/{chain}/invites', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/agent/communicate/12/invites`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { invites: [] } };
        },
      ),
    );
    await makeClient().getCommunicateInvites(12);
    expect(captured.current!.method).toBe('GET');
  });

  it('listCommunicateMessages() — POST /api/agent/communicate/{chain}/messages', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/agent/communicate/12/messages`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { items: [] } };
        },
      ),
    );
    await makeClient().listCommunicateMessages(12, { search: 'hello' });
    expect(captured.current!.method).toBe('POST');
    expect(await captured.current!.json()).toEqual({ search: 'hello' });
  });

  it('sendCommunicateMessage() — POST /api/agent/communicate/{chain}/send-message', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/agent/communicate/12/send-message`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { id: 1 } };
        },
      ),
    );
    await makeClient().sendCommunicateMessage(12, {
      agent: 'agent-1',
      message: 'hi',
      attachments: [],
    });
    expect(captured.current!.method).toBe('POST');
    const body = await captured.current!.json();
    expect(body.agent).toBe('agent-1');
    expect(body.message).toBe('hi');
  });

  // ---------------------------------------------------------------------------
  // /api/agent/{list,program-state,program-status,retry-creation}
  // ---------------------------------------------------------------------------
  it('listAgents() — GET /api/agent/list', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/agent/list`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [{ id: 'a' }] };
      }),
    );
    const res = await makeClient().listAgents();
    expect(res.data).toEqual([{ id: 'a' }]);
  });

  it('getProgramState() — GET /api/agent/program-state/{chain}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/agent/program-state/12`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { state: 'idle' } };
        },
      ),
    );
    await makeClient().getProgramState(12);
    expect(captured.current!.method).toBe('GET');
  });

  it('getProgramStatus() — GET /api/agent/program-status/{chain}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/agent/program-status/12`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { status: 'pending' } };
        },
      ),
    );
    await makeClient().getProgramStatus(12);
    expect(captured.current!.method).toBe('GET');
  });

  it('retryAgentCreation() — GET /api/agent/retry-creation/{chain}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/agent/retry-creation/12`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { ok: true } };
        },
      ),
    );
    await makeClient().retryAgentCreation(12);
    expect(captured.current!.method).toBe('GET');
  });
});
