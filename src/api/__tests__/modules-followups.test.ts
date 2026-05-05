/**
 * Endpoint coverage for `FollowUpsModuleApiClient` (`Modules/FollowUps`).
 *
 * Spec source: `sdk/spec/endpoints.json` — module === "Modules/FollowUps".
 * 15 endpoints; one `it()` per endpoint plus an extra multipart assertion
 * for `voice-record` and a cross-cutting string-id case.
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
import { FollowUpsModuleApiClient } from '../modules-followups-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'followups-tkn-xyz';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

function makeClient(): FollowUpsModuleApiClient {
  return new FollowUpsModuleApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('FollowUpsModuleApiClient — Modules/FollowUps', () => {
  let captured: Captured;
  beforeEach(() => {
    captured = { current: null };
  });

  // ---------------------------------------------------------------------------
  // follow-up resource (5)
  // ---------------------------------------------------------------------------
  it('listFollowUps() — GET /api/follow-up', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/follow-up`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().listFollowUps();
    expect(captured.current!.method).toBe('GET');
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
  });

  it('createFollowUp() — POST /api/follow-up', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/follow-up`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    const body = { name: 'Day 1 review', type: 'self' };
    await makeClient().createFollowUp(body);
    expect(await captured.current!.json()).toEqual(body);
  });

  it('showFollowUp() — GET /api/follow-up/{follow_up}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/follow-up/3`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 3 } };
      }),
    );
    await makeClient().showFollowUp(3);
    expect(captured.current!.method).toBe('GET');
  });

  it('updateFollowUp() — PUT /api/follow-up/{follow_up}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/follow-up/3`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { id: 3 } };
      }),
    );
    await makeClient().updateFollowUp(3, { name: 'Renamed' });
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('destroyFollowUp() — DELETE /api/follow-up/{follow_up}', async () => {
    server.use(
      mockEndpoint('delete', `${BASE}/api/follow-up/3`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: null };
      }),
    );
    await makeClient().destroyFollowUp(3);
    expect(captured.current!.method).toBe('DELETE');
  });

  // ---------------------------------------------------------------------------
  // execution surface (10)
  // ---------------------------------------------------------------------------
  it('finishFollowUp() — GET /api/follow-up/finish/{id}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/follow-up/finish/77`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 77 } };
      }),
    );
    await makeClient().finishFollowUp(77);
    expect(captured.current!.method).toBe('GET');
  });

  it('getCurrentFollowUp() — GET /api/follow-up/get-current-followup', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/follow-up/get-current-followup`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    await makeClient().getCurrentFollowUp();
    expect(captured.current!.method).toBe('GET');
  });

  it('getFollowUpData() — GET /api/follow-up/get-data/{chain}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/follow-up/get-data/9`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    await makeClient().getFollowUpData(9);
    expect(captured.current!.method).toBe('GET');
  });

  it('getFollowUpTimeline() — GET /api/follow-up/get-timeline/{chain}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/follow-up/get-timeline/9`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().getFollowUpTimeline(9);
    expect(captured.current!.method).toBe('GET');
  });

  it('handleRecommendation() — GET /api/follow-up/handle-recommendation/{recommendation}/{status}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/follow-up/handle-recommendation/3/accepted`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { id: 3 } };
        },
      ),
    );
    await makeClient().handleRecommendation(3, 'accepted');
    expect(captured.current!.method).toBe('GET');
  });

  it('followUpPayment() — GET /api/follow-up/payment/{followup}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/follow-up/payment/3`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { followup_id: 3, amount: 25 } };
      }),
    );
    await makeClient().followUpPayment(3);
    expect(captured.current!.method).toBe('GET');
  });

  it('followUpRecommendations() — GET /api/follow-up/recommendations/{followup}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/follow-up/recommendations/3`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: [] };
      }),
    );
    await makeClient().followUpRecommendations(3);
    expect(captured.current!.method).toBe('GET');
  });

  it('runFollowUp() — GET /api/follow-up/run/{chain}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/follow-up/run/9`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { state: 'ok' } };
      }),
    );
    await makeClient().runFollowUp(9);
    expect(captured.current!.method).toBe('GET');
  });

  it('voiceFinalize() — POST /api/follow-up/voice-finalize', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/follow-up/voice-finalize`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { follow_up_id: 1, speech_id: 'abc' } };
      }),
    );
    const body = { follow_up_id: 1, speech_id: 'abc' };
    await makeClient().voiceFinalize(body);
    expect(await captured.current!.json()).toEqual(body);
  });

  // -- multipart endpoint --
  it('voiceRecord() — POST /api/follow-up/voice-record uses multipart/form-data', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/follow-up/voice-record`, async ({ request }) => {
        captured.current = request.clone();
        return { success: true, message: '', data: { speech_id: 'sp-1' } };
      }),
    );
    const blob = new Blob([new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])], { type: 'audio/wav' });
    await makeClient().voiceRecord({
      voice: blob,
      chain_id: 9,
      speech_id: 'sp-1',
      follow_up_id: 1,
    });
    expect(captured.current!.method).toBe('POST');
    // Multipart assertions: scalar fields round-trip and file lands in FormData.
    // Clone the captured request before consuming the body twice.
    await expectFormDataField(captured.current!.clone(), 'speech_id', 'sp-1');
    const fd = await captured.current!.formData();
    expect(fd.get('chain_id')).toBe('9');
    const got = fd.get('voice');
    expect(got).not.toBeNull();
    expect(typeof got).toBe('object');
    expect((got as Blob).type).toBe('audio/wav');
    expect((got as Blob).size).toBe(8);
  });

  // ---------------------------------------------------------------------------
  // Cross-cutting: string IDs round-trip on path params.
  // ---------------------------------------------------------------------------
  it('showFollowUp() — accepts string IDs', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/follow-up/day-1-slug`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { id: 1 } };
      }),
    );
    await makeClient().showFollowUp('day-1-slug');
    expect(new URL(captured.current!.url).pathname).toBe('/api/follow-up/day-1-slug');
  });
});
