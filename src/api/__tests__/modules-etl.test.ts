/**
 * Endpoint coverage for `ETLModuleApiClient` (`Modules/ETL`).
 *
 * Spec source: `sdk/spec/endpoints.json` — module === "Modules/ETL". 7
 * endpoints. Note that 6 of them sit under the `/api/v1/etl/*` versioned
 * prefix (the only versioned path family in the SDK alongside Services);
 * the 7th — `/api/protocol/etl/all` — is the protocol-integration listing
 * and stays unversioned. All endpoints are `auth:sanctum`.
 *
 * `etl.status` is the polling endpoint exposed as `getStatus(pipelineId)`.
 * Callers can poll it; the SDK does NOT subscribe to broadcasts here.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { ETLModuleApiClient } from '../modules-etl-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'etl-tkn-xyz';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): ETLModuleApiClient {
  return new ETLModuleApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('ETLModuleApiClient — Modules/ETL', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  // ---------------------------------------------------------------------------
  // GET /api/protocol/etl/all — etl.protocol.all
  // ---------------------------------------------------------------------------
  it('listProtocolEtl() — GET /api/protocol/etl/all', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/protocol/etl/all`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    const res = await makeClient().listProtocolEtl();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(res.data).toEqual([]);
  });

  // ---------------------------------------------------------------------------
  // POST /api/v1/etl/agent/process — etl.agent.process
  // ---------------------------------------------------------------------------
  it('agentProcess() — POST /api/v1/etl/agent/process (versioned prefix preserved)', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/v1/etl/agent/process`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { pipelineId: 'p-1' } };
        },
      ),
    );
    const body = { agent_id: 'a-1', query: 'find users', context: 'admin', format: 'json' };
    await makeClient().agentProcess(body);
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expect(await captured.current!.json()).toEqual(body);
  });

  // ---------------------------------------------------------------------------
  // POST /api/v1/etl/cancel/{pipelineId} — etl.cancel
  // ---------------------------------------------------------------------------
  it('cancel() — POST /api/v1/etl/cancel/{pipelineId}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/v1/etl/cancel/p-99`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { canceled: true } };
        },
      ),
    );
    const res = await makeClient().cancel('p-99');
    expect(captured.current!.method).toBe('POST');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toMatchObject({ canceled: true });
  });

  // ---------------------------------------------------------------------------
  // GET /api/v1/etl/components — etl.components
  // ---------------------------------------------------------------------------
  it('components() — GET /api/v1/etl/components', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/v1/etl/components`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { components: [] } };
        },
      ),
    );
    await makeClient().components();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
  });

  // ---------------------------------------------------------------------------
  // POST /api/v1/etl/process — etl.process
  // ---------------------------------------------------------------------------
  it('process() — POST /api/v1/etl/process', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/v1/etl/process`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { pipelineId: 'p-2' } };
        },
      ),
    );
    const body = {
      parameters: { q: 'rows', limit: 100 },
      transform_options: { strip: true },
      destination: { kind: 'webhook', url: 'https://example/test' },
    };
    await makeClient().process(body);
    expect(await captured.current!.json()).toEqual(body);
  });

  // ---------------------------------------------------------------------------
  // POST /api/v1/etl/search-analyze — etl.search-analyze
  // ---------------------------------------------------------------------------
  it('searchAnalyze() — POST /api/v1/etl/search-analyze', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/v1/etl/search-analyze`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { matches: [] } };
        },
      ),
    );
    const body = {
      query: 'cardiac history',
      context: 'patient',
      threshold: 0.75,
      destination: { kind: 'inline' },
    };
    await makeClient().searchAnalyze(body);
    expect(await captured.current!.json()).toEqual(body);
  });

  // ---------------------------------------------------------------------------
  // GET /api/v1/etl/status/{pipelineId} — etl.status (polling endpoint)
  // ---------------------------------------------------------------------------
  it('getStatus() — GET /api/v1/etl/status/{pipelineId} (polling)', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/v1/etl/status/p-1`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { status: 'running', progress: 50 } };
        },
      ),
    );
    const res = await makeClient().getStatus('p-1');
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expect(res.data).toMatchObject({ status: 'running', progress: 50 });
  });
});
