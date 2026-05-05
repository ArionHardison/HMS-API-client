/**
 * Endpoint coverage for `ChallengeModuleApiClient` (`Modules/Challenge`).
 *
 * Spec source: `sdk/spec/endpoints.json` — module === "Modules/Challenge".
 * 18 endpoints; one `it()` per endpoint plus one extra multipart assertion
 * for `record-video` and a cross-cutting string-id case.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectFormDataField,
  expectMethodOverride,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { ChallengeModuleApiClient } from '../modules-challenge-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'challenge-tkn-xyz';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): ChallengeModuleApiClient {
  return new ChallengeModuleApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('ChallengeModuleApiClient — Modules/Challenge', () => {
  let captured: Captured;
  beforeEach(() => {
    captured = { current: null };
  });

  // ---------------------------------------------------------------------------
  // challenge resource (5)
  // ---------------------------------------------------------------------------
  it('listChallenges() — GET /api/challenge', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/challenge`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().listChallenges();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
  });

  it('createChallenge() — POST /api/challenge', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/challenge`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    const body = { name: 'Squats', type: 'reps' };
    await makeClient().createChallenge(body);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('showChallenge() — GET /api/challenge/{challenge}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/challenge/5`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 5 } };
      }),
    );
    await makeClient().showChallenge(5);
    expect(captured.current!.method).toBe('GET');
  });

  it('updateChallenge() — PUT /api/challenge/{challenge}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/challenge/5`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 5 } };
      }),
    );
    await makeClient().updateChallenge(5, { name: 'Renamed' });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('destroyChallenge() — DELETE /api/challenge/{challenge}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/challenge/5`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().destroyChallenge(5);
    expect(captured.current!.method).toBe('DELETE');
  });

  // ---------------------------------------------------------------------------
  // execution surface (12)
  // ---------------------------------------------------------------------------
  it('finishAttachedChallenge() — GET /api/challenge/finish/{attached}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/challenge/finish/77`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { attached_id: 77 } };
      }),
    );
    await makeClient().finishAttachedChallenge(77);
    expect(captured.current!.method).toBe('GET');
  });

  it('getChallengeGlobalTasks() — GET /api/challenge/get-challenge-global-tasks/{challenge}/{task}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/challenge/get-challenge-global-tasks/5/9`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().getChallengeGlobalTasks(5, 9);
    expect(captured.current!.method).toBe('GET');
  });

  it('getChallengeTasks() — GET /api/challenge/get-challenge-tasks/{challenge}/{chain}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/challenge/get-challenge-tasks/5/9`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().getChallengeTasks(5, 9);
    expect(captured.current!.method).toBe('GET');
  });

  it('getChallenge() — GET /api/challenge/get-challenge/{challenge}/{chain}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/challenge/get-challenge/5/9`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 5 } };
        },
      ),
    );
    await makeClient().getChallenge(5, 9);
    expect(captured.current!.method).toBe('GET');
  });

  it('getGlobalChallenge() — GET /api/challenge/get-global-challenge/{challenge}/{task}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/challenge/get-global-challenge/5/9`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 5 } };
        },
      ),
    );
    await makeClient().getGlobalChallenge(5, 9);
    expect(captured.current!.method).toBe('GET');
  });

  it('getChallengeTypes() — GET /api/challenge/get-types', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/challenge/get-types`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: ['reps', 'time'] };
      }),
    );
    await makeClient().getChallengeTypes();
    expect(captured.current!.method).toBe('GET');
  });

  // -- multipart endpoint --
  it('recordVideo() — POST /api/challenge/record-video uses multipart/form-data', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/challenge/record-video`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    const blob = new Blob([new Uint8Array([1, 2, 3, 4])], { type: 'video/webm' });
    await makeClient().recordVideo({ video: blob, attached_challenge_id: 7, task_id: 3 });
    expect(captured.current!.method).toBe('POST');
    // Multipart assertions: scalar field round-trips and file lands in FormData.
    // `expectFormDataField` reads via `request.formData()`, so we clone
    // the captured request once and reuse the parsed body for both checks.
    await expectFormDataField(captured.current!.clone(), 'attached_challenge_id', '7');
    const fd = await captured.current!.formData();
    const got = fd.get('video');
    expect(got).not.toBeNull();
    expect(typeof got).toBe('object');
    // FormData wraps a Blob in a File-like entry; check the MIME type round-trips.
    expect((got as Blob).type).toBe('video/webm');
    expect((got as Blob).size).toBe(4);
  });

  it('runChallenge() — POST /api/challenge/run', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/challenge/run`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { state: 'running' } };
      }),
    );
    const body = { challenge_id: 5, chain_id: 9 };
    await makeClient().runChallenge(body);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('runGlobalChallenge() — POST /api/challenge/run-global', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/challenge/run-global`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { state: 'running' } };
      }),
    );
    const body = { challenge_id: 5, task_id: 9 };
    await makeClient().runGlobalChallenge(body);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('setChallengeResult() — POST /api/challenge/set-result/{result}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/challenge/set-result/12`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 12 } };
      }),
    );
    const body = { value: 42 };
    await makeClient().setChallengeResult(12, body);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('startChallengeTask() — POST /api/challenge/start-task', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/challenge/start-task`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { state: 'started' } };
      }),
    );
    const body = { challenge_id: 5, task_id: 7 };
    await makeClient().startChallengeTask(body);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('destroyChallengeTask() — DELETE /api/challenge/task/destroy/{task}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/challenge/task/destroy/7`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().destroyChallengeTask(7);
    expect(captured.current!.method).toBe('DELETE');
  });

  // ---------------------------------------------------------------------------
  // protocol integration (1)
  // ---------------------------------------------------------------------------
  it('listProtocolChallenges() — GET /api/protocol/challenge/all', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/protocol/challenge/all`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().listProtocolChallenges();
    expect(captured.current!.method).toBe('GET');
  });

  // ---------------------------------------------------------------------------
  // Cross-cutting: string IDs round-trip on path params.
  // ---------------------------------------------------------------------------
  it('showChallenge() — accepts string IDs', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/challenge/squats-slug`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    await makeClient().showChallenge('squats-slug');
    expect(new URL(captured.current!.url).pathname).toBe('/api/challenge/squats-slug');
  });
});
