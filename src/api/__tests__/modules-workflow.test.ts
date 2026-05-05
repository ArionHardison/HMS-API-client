/**
 * Endpoint coverage for `WorkflowModuleApiClient` (`Modules/Workflow`).
 *
 * Spec source: `sdk/spec/endpoints.json` — module === "Modules/Workflow".
 * 5 endpoints. The Codify-pipeline endpoints (`start`, `save-response`,
 * `check-pipeline/{session}`, `stop/{session}`) are `auth:public` upstream;
 * callers MUST pass `{ auth: false }` per call so the SDK omits the
 * Authorization header. The protocol-integration listing
 * (`/api/protocol/workflow/all`) is `auth:api` and authed normally.
 *
 * `check-pipeline/{session}` is the polling endpoint exposed as
 * `checkPipeline(session)` — callers can poll it for codify-pipeline
 * progress.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectNoAuthHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { WorkflowModuleApiClient } from '../modules-workflow-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'workflow-tkn-xyz';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): WorkflowModuleApiClient {
  return new WorkflowModuleApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('WorkflowModuleApiClient — Modules/Workflow', () => {
  let captured: Captured;

  beforeEach(() => {
    captured = { current: null };
  });

  // ---------------------------------------------------------------------------
  // GET /api/protocol/workflow/all — get.api.protocol.workflow.all (auth:api)
  // ---------------------------------------------------------------------------
  it('listProtocolWorkflows() — GET /api/protocol/workflow/all', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/protocol/workflow/all`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().listProtocolWorkflows();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
  });

  // ---------------------------------------------------------------------------
  // GET /api/workflow/codify-pipeline/check-pipeline/{session} — public
  // ---------------------------------------------------------------------------
  it('checkPipeline() — GET /api/workflow/codify-pipeline/check-pipeline/{session} (public)', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/workflow/codify-pipeline/check-pipeline/sess-abc`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { status: 'running' } };
        },
      ),
    );
    const res = await makeClient().checkPipeline('sess-abc', { auth: false });
    expect(captured.current!.method).toBe('GET');
    expectNoAuthHeader(captured.current!);
    expect(res.data).toMatchObject({ status: 'running' });
  });

  // ---------------------------------------------------------------------------
  // POST /api/workflow/codify-pipeline/save-response — public
  // ---------------------------------------------------------------------------
  it('saveResponse() — POST /api/workflow/codify-pipeline/save-response (public)', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/workflow/codify-pipeline/save-response`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { saved: true } };
        },
      ),
    );
    const body = { session: 'sess-abc', response: 'yes' };
    await makeClient().saveResponse(body, { auth: false });
    expect(captured.current!.method).toBe('POST');
    expectNoAuthHeader(captured.current!);
    expect(await captured.current!.json()).toEqual(body);
  });

  // ---------------------------------------------------------------------------
  // POST /api/workflow/codify-pipeline/start — public
  // ---------------------------------------------------------------------------
  it('start() — POST /api/workflow/codify-pipeline/start (public)', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/workflow/codify-pipeline/start`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { session: 'sess-abc' } };
        },
      ),
    );
    const body = {
      problem: 'how do I onboard?',
      session: 'sess-abc',
      timezone: 'America/New_York',
    };
    await makeClient().start(body, { auth: false });
    expect(captured.current!.method).toBe('POST');
    expectNoAuthHeader(captured.current!);
    expect(await captured.current!.json()).toEqual(body);
  });

  // ---------------------------------------------------------------------------
  // GET /api/workflow/codify-pipeline/stop/{session} — public
  // ---------------------------------------------------------------------------
  it('stop() — GET /api/workflow/codify-pipeline/stop/{session} (public)', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/workflow/codify-pipeline/stop/sess-abc`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { stopped: true } };
        },
      ),
    );
    await makeClient().stop('sess-abc', { auth: false });
    expect(captured.current!.method).toBe('GET');
    expectNoAuthHeader(captured.current!);
  });
});
