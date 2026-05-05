/**
 * Endpoint coverage for `AssessmentsModuleApiClient` (`Modules/Assessments`).
 *
 * Spec source: `sdk/spec/endpoints.json` — module === "Modules/Assessments".
 * 31 endpoints; one `it()` per endpoint plus one cross-cutting case for
 * string-id route binding.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectMethodOverride,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { AssessmentsModuleApiClient } from '../modules-assessments-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'assess-tkn-xyz';
const DOMAIN = 'crohnie.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): AssessmentsModuleApiClient {
  return new AssessmentsModuleApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('AssessmentsModuleApiClient — Modules/Assessments', () => {
  let captured: Captured;
  beforeEach(() => {
    captured = { current: null };
  });

  // ---------------------------------------------------------------------------
  // assessment resource (5) + run-* execution (2) + protocol (2) = 9
  // ---------------------------------------------------------------------------
  it('listAssessments() — GET /api/assessment', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/assessment`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().listAssessments();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
  });

  it('createAssessment() — POST /api/assessment', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/assessment`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    const body = { name: 'Onboarding', type: 'survey' };
    await makeClient().createAssessment(body);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('runAssessmentGlobal() — GET /api/assessment/run-global/{assessment}/{task}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/assessment/run-global/3/9`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { assessment_id: 3, task_id: 9, state: 'ok' } };
      }),
    );
    await makeClient().runAssessmentGlobal(3, 9);
    expect(captured.current!.method).toBe('GET');
  });

  it('runAssessment() — GET /api/assessment/run/{assessment}/{chain}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/assessment/run/3/9`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { assessment_id: 3, chain_id: 9, state: 'ok' } };
      }),
    );
    await makeClient().runAssessment(3, 9);
    expect(captured.current!.method).toBe('GET');
  });

  it('showAssessment() — GET /api/assessment/{assessment}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/assessment/3`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 3 } };
      }),
    );
    await makeClient().showAssessment(3);
    expect(captured.current!.method).toBe('GET');
  });

  it('updateAssessment() — PUT /api/assessment/{assessment} (POST + ?_method=PUT)', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/assessment/3`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 3 } };
      }),
    );
    await makeClient().updateAssessment(3, { name: 'Renamed' });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('destroyAssessment() — DELETE /api/assessment/{assessment}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/assessment/3`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().destroyAssessment(3);
    expect(captured.current!.method).toBe('DELETE');
  });

  // ---------------------------------------------------------------------------
  // attend resource (6)
  // ---------------------------------------------------------------------------
  it('listAttends() — GET /api/attend', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/attend`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().listAttends();
    expect(captured.current!.method).toBe('GET');
  });

  it('createAttend() — POST /api/attend', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/attend`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    const body = { assessment_id: 7 };
    await makeClient().createAttend(body);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('listAllAttends() — GET /api/attend/all', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/attend/all`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().listAllAttends();
    expect(captured.current!.method).toBe('GET');
  });

  it('showAttend() — GET /api/attend/{attend}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/attend/4`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 4 } };
      }),
    );
    await makeClient().showAttend(4);
    expect(captured.current!.method).toBe('GET');
  });

  it('updateAttend() — PUT /api/attend/{attend}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/attend/4`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 4 } };
      }),
    );
    await makeClient().updateAttend(4, { metadata: { foo: 'bar' } });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('destroyAttend() — DELETE /api/attend/{attend}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/attend/4`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().destroyAttend(4);
    expect(captured.current!.method).toBe('DELETE');
  });

  // ---------------------------------------------------------------------------
  // choice (1) — only DELETE is exposed
  // ---------------------------------------------------------------------------
  it('destroyChoice() — DELETE /api/choice/{choice}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/choice/12`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().destroyChoice(12);
    expect(captured.current!.method).toBe('DELETE');
  });

  // ---------------------------------------------------------------------------
  // protocol integration (2)
  // ---------------------------------------------------------------------------
  it('listProtocolAssessments() — GET /api/protocol/assessment/all', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/protocol/assessment/all`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().listProtocolAssessments();
    expect(captured.current!.method).toBe('GET');
  });

  it('protocolItemInstances() — GET /api/protocol/assessment/item-instances/{assessment}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/protocol/assessment/item-instances/8`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().protocolItemInstances(8);
    expect(captured.current!.method).toBe('GET');
  });

  // ---------------------------------------------------------------------------
  // question resource (8)
  // ---------------------------------------------------------------------------
  it('listQuestions() — GET /api/question', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/question`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().listQuestions();
    expect(captured.current!.method).toBe('GET');
  });

  it('createQuestion() — POST /api/question', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/question`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    const body = { assessment_id: 1, body: 'Q?', type: 'single' };
    await makeClient().createQuestion(body);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('listAllQuestions() — GET /api/question/all', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/question/all`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().listAllQuestions();
    expect(captured.current!.method).toBe('GET');
  });

  it('questionsByAssessmentFull() — GET /api/question/by-assessment-full/{assessment}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/question/by-assessment-full/3`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().questionsByAssessmentFull(3);
    expect(captured.current!.method).toBe('GET');
  });

  it('questionsByAssessment() — GET /api/question/by-assessment/{assessment}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/question/by-assessment/3`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().questionsByAssessment(3);
    expect(captured.current!.method).toBe('GET');
  });

  it('showQuestion() — GET /api/question/{question}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/question/9`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 9 } };
      }),
    );
    await makeClient().showQuestion(9);
    expect(captured.current!.method).toBe('GET');
  });

  it('updateQuestion() — PUT /api/question/{question}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/question/9`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 9 } };
      }),
    );
    await makeClient().updateQuestion(9, { body: 'updated' });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('destroyQuestion() — DELETE /api/question/{question}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/question/9`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().destroyQuestion(9);
    expect(captured.current!.method).toBe('DELETE');
  });

  // ---------------------------------------------------------------------------
  // response resource (7)
  // ---------------------------------------------------------------------------
  it('listResponses() — GET /api/response', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/response`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().listResponses();
    expect(captured.current!.method).toBe('GET');
  });

  it('createResponse() — POST /api/response', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/response`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    const body = { attend_id: 1, question_id: 2, value: 'A' };
    await makeClient().createResponse(body);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('listAllResponses() — GET /api/response/all', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/response/all`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().listAllResponses();
    expect(captured.current!.method).toBe('GET');
  });

  it('storeResponse() — POST /api/response/store', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/response/store`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    const body = { attend_id: 1, question_id: 2, value: 'A' };
    await makeClient().storeResponse(body);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('showResponse() — GET /api/response/{response}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/response/5`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 5 } };
      }),
    );
    await makeClient().showResponse(5);
    expect(captured.current!.method).toBe('GET');
  });

  it('updateResponse() — PUT /api/response/{response}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/response/5`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 5 } };
      }),
    );
    await makeClient().updateResponse(5, { value: 'B' });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('destroyResponse() — DELETE /api/response/{response}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/response/5`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().destroyResponse(5);
    expect(captured.current!.method).toBe('DELETE');
  });

  // ---------------------------------------------------------------------------
  // Cross-cutting: string IDs round-trip on path params.
  // ---------------------------------------------------------------------------
  it('showAssessment() — accepts string IDs', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/assessment/onboarding-slug`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    await makeClient().showAssessment('onboarding-slug');
    expect(new URL(captured.current!.url).pathname).toBe('/api/assessment/onboarding-slug');
  });
});
