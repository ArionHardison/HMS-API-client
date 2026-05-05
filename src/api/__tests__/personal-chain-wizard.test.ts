/**
 * PersonalChainWizardApiClient — endpoint-by-endpoint contract tests.
 *
 * Each route in the slice (Personal Chain + Public Codify + Wizard codify
 * entry) gets one or more `it()` blocks asserting:
 *   - URL (after BaseURL + path-param interpolation, including optional
 *     trailing path segments like `{status?}` / `{source?}`)
 *   - HTTP verb on the wire (DELETE stays DELETE; PUT/PATCH would override
 *     to POST + `?_method=...` but no PUT/PATCH exist in this slice)
 *   - Authorization header presence per spec `auth` (`public` ⇒ no Bearer;
 *     `api` ⇒ Bearer required)
 *   - `X-Domain` header always present
 *   - Request body matches the spec's `request.shape`
 *   - Response decoding pulls the typed payload out of the envelope
 *     (`wrapper: "data"`)
 *   - File-upload bodies serialize as `multipart/form-data` (codify run +
 *     wizard codify both flag `fileUpload: true`)
 *   - The polling helper for `/api/public/codify/state/{key}` returns the
 *     `CodifyJobState` discriminated union, not raw fields.
 *
 * MSW-based; `src/__tests__/setup.ts` wires the shared server lifecycle.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectNoAuthHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { PersonalChainWizardApiClient } from '../personal-chain-wizard-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'tok-pcw';
const DOMAIN = 'crohnie.ai';

function makeClient(): PersonalChainWizardApiClient {
  return new PersonalChainWizardApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

function captured(): { current: Request | null } {
  return { current: null };
}

describe('PersonalChainWizardApiClient — Personal Chain + Codify slice', () => {
  let cap: { current: Request | null };

  beforeEach(() => {
    cap = captured();
  });

  afterEach(() => {
    cap.current = null;
  });

  // ===========================================================================
  // GET /api/personal-chain/by-status/{status?}
  // ===========================================================================
  describe('GET /api/personal-chain/by-status/{status?}', () => {
    it('Bearer required, omits status when undefined, returns ProtocolPersonalChainSummary list', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/personal-chain/by-status`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: [
              {
                id: 1,
                name: 'C',
                program_image: null,
                status: 'active',
                program: null,
                updated_at: '2025-01-01',
              },
            ],
          };
        }),
      );
      const res = await makeClient().getByStatus();
      expectAuthHeader(cap.current!, TOKEN);
      expectDomainHeader(cap.current!, DOMAIN);
      expect(cap.current!.method).toBe('GET');
      expect((res.data as any[])[0].id).toBe(1);
    });

    it('interpolates status when provided', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/personal-chain/by-status/active`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getByStatus('active');
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  // ===========================================================================
  // POST /api/personal-chain/cancel-invitation
  // ===========================================================================
  describe('POST /api/personal-chain/cancel-invitation', () => {
    it('Bearer required, body matches CancelInvitationRequestBody', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/personal-chain/cancel-invitation`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().cancelInvitation({ personal_chain_id: 7 });
      expectAuthHeader(cap.current!, TOKEN);
      expect(cap.current!.method).toBe('POST');
      expect(await cap.current!.json()).toEqual({ personal_chain_id: 7 });
    });
  });

  // ===========================================================================
  // GET /api/personal-chain/decline/{invite}/{source?}
  // ===========================================================================
  describe('GET /api/personal-chain/decline/{invite}/{source?}', () => {
    it('public — no Bearer, omits trailing source when undefined', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/personal-chain/decline/abc`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().decline('abc');
      expectNoAuthHeader(cap.current!);
      expectDomainHeader(cap.current!, DOMAIN);
    });

    it('appends source when provided', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/personal-chain/decline/abc/email`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().decline('abc', 'email');
      expectNoAuthHeader(cap.current!);
    });
  });

  // ===========================================================================
  // GET / POST /api/personal-chain/feedback/{chain}
  // ===========================================================================
  describe('POST /api/personal-chain/feedback/{chain}', () => {
    it('Bearer required, body matches StoreFeedbackRequestBody', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/personal-chain/feedback/42`, async ({ request }) => {
          cap.current = request.clone();
          return {
            success: true,
            message: '',
            data: { rating: 5, feedback: 'ok', user: null, full_name: null, profile_picture: null, username: null, program: null, name: null },
          };
        }),
      );
      const res = await makeClient().postFeedback(42, {
        feedback: 'It was great',
        rating: 5,
        chain: 42,
      });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({
        feedback: 'It was great',
        rating: 5,
        chain: 42,
      });
      expect((res.data as any).rating).toBe(5);
    });
  });

  describe('GET /api/personal-chain/feedback/{chain}', () => {
    it('Bearer required, returns ProgramFeedbackData', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/personal-chain/feedback/42`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: { rating: 4, feedback: 'meh', user: null, full_name: null, profile_picture: null, username: null, program: null, name: null },
          };
        }),
      );
      const res = await makeClient().getFeedback(42);
      expectAuthHeader(cap.current!, TOKEN);
      expect((res.data as any).feedback).toBe('meh');
    });
  });

  // ===========================================================================
  // POST /api/personal-chain/find-users-to-invite
  // ===========================================================================
  describe('POST /api/personal-chain/find-users-to-invite', () => {
    it('body shape (chain required, search optional)', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/personal-chain/find-users-to-invite`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().findUsersToInvite({ chain: 9, search: 'arion' });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ chain: 9, search: 'arion' });
    });

    it('omits search when not provided', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/personal-chain/find-users-to-invite`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().findUsersToInvite({ chain: 9 });
      expect(await cap.current!.json()).toEqual({ chain: 9 });
    });
  });

  // ===========================================================================
  // GET /api/personal-chain/finished-not-rated
  // ===========================================================================
  describe('GET /api/personal-chain/finished-not-rated', () => {
    it('Bearer required, returns FinishedNotRatedProgramSummary', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/personal-chain/finished-not-rated`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [{ id: 1, name: 'P', image: null, author: null }] };
        }),
      );
      const res = await makeClient().getFinishedNotRated();
      expectAuthHeader(cap.current!, TOKEN);
      expect((res.data as any[])[0].id).toBe(1);
    });
  });

  // ===========================================================================
  // GET /api/personal-chain/force-defrost/{chain}
  // ===========================================================================
  describe('GET /api/personal-chain/force-defrost/{chain}', () => {
    it('Bearer required, interpolates chain', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/personal-chain/force-defrost/77`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().forceDefrost(77);
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  // ===========================================================================
  // GET /api/personal-chain/get-recommended
  // ===========================================================================
  describe('GET /api/personal-chain/get-recommended', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/personal-chain/get-recommended`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: [] };
        }),
      );
      await makeClient().getRecommended();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  // ===========================================================================
  // POST /api/personal-chain/invite
  // ===========================================================================
  describe('POST /api/personal-chain/invite', () => {
    it('body matches InviteUserToPersonalChainRequestBody', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/personal-chain/invite`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().invite({
        user_id: 5,
        source: 'email',
        personal_chain_id: 11,
      });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({
        user_id: 5,
        source: 'email',
        personal_chain_id: 11,
      });
    });
  });

  // ===========================================================================
  // GET /api/personal-chain/join/{token}/{source?}
  // ===========================================================================
  describe('GET /api/personal-chain/join/{token}/{source?}', () => {
    it('public — no Bearer, omits source when undefined', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/personal-chain/join/JOIN_TOKEN`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().join('JOIN_TOKEN');
      expectNoAuthHeader(cap.current!);
    });

    it('appends source segment', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/personal-chain/join/JOIN_TOKEN/sms`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().join('JOIN_TOKEN', 'sms');
    });
  });

  // ===========================================================================
  // GET /api/personal-chain/last-chain
  // ===========================================================================
  describe('GET /api/personal-chain/last-chain', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/personal-chain/last-chain`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: { id: 99, name: 'X', author: null, program_image: null, required_time: null, required_time_range: null, level: null },
          };
        }),
      );
      const res = await makeClient().getLastChain();
      expectAuthHeader(cap.current!, TOKEN);
      expect((res.data as any).id).toBe(99);
    });
  });

  // ===========================================================================
  // POST /api/personal-chain/start-program/{chain}
  // ===========================================================================
  describe('POST /api/personal-chain/start-program/{chain}', () => {
    it('Bearer required, body matches StartProgramRequestBody', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/personal-chain/start-program/12`, async ({ request }) => {
          cap.current = request.clone();
          return {
            success: true,
            message: '',
            data: { id: 12, program_id: 1, module_item_id: 0, started_at: 't' },
          };
        }),
      );
      await makeClient().startProgram(12, { id: 12 });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ id: 12 });
    });
  });

  // ===========================================================================
  // GET /api/personal-chain/task/{taskId}
  // ===========================================================================
  describe('GET /api/personal-chain/task/{taskId}', () => {
    it('Bearer required, interpolates taskId', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/personal-chain/task/abc-123`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().getTask('abc-123');
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  // ===========================================================================
  // GET /api/personal-chain/tasks
  // ===========================================================================
  describe('GET /api/personal-chain/tasks', () => {
    it('Bearer required, returns user/global task buckets', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/personal-chain/tasks`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { user: [], global: [] } };
        }),
      );
      const res = await makeClient().getTasks();
      expectAuthHeader(cap.current!, TOKEN);
      expect((res.data as any).user).toEqual([]);
    });
  });

  // ===========================================================================
  // GET /api/personal-chain/user-join/{invite}
  // ===========================================================================
  describe('GET /api/personal-chain/user-join/{invite}', () => {
    it('Bearer required, interpolates invite id', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/personal-chain/user-join/55`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().userJoin(55);
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  // ===========================================================================
  // GET /api/personal-chain/user-reject/{invite}
  // ===========================================================================
  describe('GET /api/personal-chain/user-reject/{invite}', () => {
    it('Bearer required, interpolates invite id', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/personal-chain/user-reject/56`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().userReject(56);
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  // ===========================================================================
  // GET /api/personal-chain/{personalChain}
  // ===========================================================================
  describe('GET /api/personal-chain/{personalChain}', () => {
    it('Bearer required, returns ProtocolStepData', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/personal-chain/100`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: { id: 100, program_id: 1, module_item_id: 0, started_at: 't' },
          };
        }),
      );
      const res = await makeClient().getPersonalChain(100);
      expectAuthHeader(cap.current!, TOKEN);
      expect((res.data as any).id).toBe(100);
    });
  });

  // ===========================================================================
  // DELETE /api/personal-chain/{personalChain}
  // ===========================================================================
  describe('DELETE /api/personal-chain/{personalChain}', () => {
    it('Bearer required, real DELETE verb (no method override)', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/personal-chain/200`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().deletePersonalChain(200);
      expectAuthHeader(cap.current!, TOKEN);
      expect(cap.current!.method).toBe('DELETE');
    });
  });

  // ===========================================================================
  // GET /api/public/codify/answers/{key}
  // ===========================================================================
  describe('GET /api/public/codify/answers/{key}', () => {
    it('public — no Bearer, interpolates key', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/public/codify/answers/sess-123`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().getCodifyAnswers('sess-123');
      expectNoAuthHeader(cap.current!);
      expectDomainHeader(cap.current!, DOMAIN);
    });
  });

  // ===========================================================================
  // DELETE /api/public/codify/cancel/{key}
  // ===========================================================================
  describe('DELETE /api/public/codify/cancel/{key}', () => {
    it('public — no Bearer, real DELETE verb', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/public/codify/cancel/sess-456`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().cancelCodify('sess-456');
      expectNoAuthHeader(cap.current!);
      expect(cap.current!.method).toBe('DELETE');
    });
  });

  // ===========================================================================
  // POST /api/public/codify/run
  // ===========================================================================
  describe('POST /api/public/codify/run', () => {
    it('JSON body when no file provided (no Bearer; public)', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/public/codify/run`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().runCodify({
        codify: 'help me',
        session: 'sessionXYZ',
        timezone: 'America/New_York',
      });
      expectNoAuthHeader(cap.current!);
      expect(cap.current!.headers.get('content-type')).toMatch(/application\/json/i);
      expect(await cap.current!.json()).toEqual({
        codify: 'help me',
        session: 'sessionXYZ',
        timezone: 'America/New_York',
      });
    });

    it('switches to multipart/form-data when codifyFile is a Blob', async () => {
      let capturedFormData: FormData | null = null;
      let capturedContentType = '';
      let capturedAuth: string | null = '';
      server.use(
        mockEndpoint('post', `${BASE}/api/public/codify/run`, async ({ request }) => {
          cap.current = request.clone();
          capturedAuth = request.headers.get('authorization');
          capturedContentType = request.headers.get('content-type') ?? '';
          // Drain the body once; the request is consumable only one time.
          capturedFormData = await request.formData();
          return { success: true, message: '', data: {} };
        }),
      );
      const file = new Blob(['hi'], { type: 'text/plain' });
      await makeClient().runCodify({
        codifyFile: file,
        session: 'sessionXYZ',
        timezone: 'UTC',
      });
      expect(capturedAuth).toBeNull();
      expect(capturedContentType).toMatch(/multipart\/form-data/i);
      expect(capturedFormData!.get('session')).toBe('sessionXYZ');
      expect(capturedFormData!.get('timezone')).toBe('UTC');
      expect(capturedFormData!.get('codifyFile')).toBeInstanceOf(Blob);
    });
  });

  // ===========================================================================
  // POST /api/public/codify/save-answer
  // ===========================================================================
  describe('POST /api/public/codify/save-answer', () => {
    it('public — body matches CodifySaveAnswerRequestBody (only required fields)', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/public/codify/save-answer`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().saveCodifyAnswer({
        question: 'what is your name?',
        answer: 'arion',
        session: 'sess1',
      });
      expectNoAuthHeader(cap.current!);
      expect(await cap.current!.json()).toEqual({
        question: 'what is your name?',
        answer: 'arion',
        session: 'sess1',
      });
    });
  });

  // ===========================================================================
  // POST /api/public/codify/start-session
  // ===========================================================================
  describe('POST /api/public/codify/start-session', () => {
    it('public — body matches CodifyStartSessionRequestBody', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/public/codify/start-session`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().startCodifySession({ session: 'sess-aaa', is_personal: true });
      expectNoAuthHeader(cap.current!);
      expect(await cap.current!.json()).toEqual({ session: 'sess-aaa', is_personal: true });
    });
  });

  // ===========================================================================
  // GET /api/public/codify/state/{key}  — polling endpoint
  // ===========================================================================
  describe('GET /api/public/codify/state/{key}', () => {
    it('public — returns raw envelope via getCodifyState()', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/public/codify/state/sess-1`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: {
              running: true,
              codify: null,
              successfully: false,
              finished: false,
              preparation_finished: true,
              step: 2,
              questions: [],
              preferred_subproject: null,
            },
          };
        }),
      );
      const res = await makeClient().getCodifyState('sess-1');
      expectNoAuthHeader(cap.current!);
      expect((res.data as any).running).toBe(true);
    });

    it('readCodifyJobState() decodes "running"', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/public/codify/state/sess-r`, () => ({
          success: true,
          message: '',
          data: {
            running: true,
            codify: null,
            successfully: false,
            finished: false,
            preparation_finished: false,
            step: 1,
            questions: [{ q: 'a' }],
            preferred_subproject: null,
          },
        })),
      );
      const state = await makeClient().readCodifyJobState('sess-r');
      expect(state.status).toBe('running');
      if (state.status === 'running') {
        expect(state.step).toBe(1);
        expect(state.questions).toEqual([{ q: 'a' }]);
      }
    });

    it('readCodifyJobState() decodes "completed" (finished + successfully)', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/public/codify/state/sess-c`, () => ({
          success: true,
          message: '',
          data: {
            running: false,
            codify: { id: 1 },
            successfully: true,
            finished: true,
            preparation_finished: true,
            step: 99,
            questions: [],
            preferred_subproject: 'sub-x',
          },
        })),
      );
      const state = await makeClient().readCodifyJobState('sess-c');
      expect(state.status).toBe('completed');
      if (state.status === 'completed') {
        expect(state.codify).toEqual({ id: 1 });
        expect(state.preferredSubproject).toBe('sub-x');
      }
    });

    it('readCodifyJobState() decodes "failed" (finished + !successfully)', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/public/codify/state/sess-f`, () => ({
          success: true,
          message: '',
          data: {
            running: false,
            codify: null,
            successfully: false,
            finished: true,
            preparation_finished: true,
            step: 0,
            questions: [],
            preferred_subproject: null,
          },
        })),
      );
      const state = await makeClient().readCodifyJobState('sess-f');
      expect(state.status).toBe('failed');
    });

    it('readCodifyJobState() decodes "pending" (neither running nor finished)', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/public/codify/state/sess-p`, () => ({
          success: true,
          message: '',
          data: {
            running: false,
            codify: null,
            successfully: false,
            finished: false,
            preparation_finished: false,
            step: 0,
            questions: [],
            preferred_subproject: null,
          },
        })),
      );
      const state = await makeClient().readCodifyJobState('sess-p');
      expect(state.status).toBe('pending');
    });
  });

  // ===========================================================================
  // POST /api/wizard/codify/{protocol}
  // ===========================================================================
  describe('POST /api/wizard/codify/{protocol}', () => {
    it('Bearer required, JSON body when no file', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/wizard/codify/77`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().wizardCodify(77, { codify: 'do x' });
      expectAuthHeader(cap.current!, TOKEN);
      expect(cap.current!.headers.get('content-type')).toMatch(/application\/json/i);
      expect(await cap.current!.json()).toEqual({ codify: 'do x' });
    });

    it('multipart when codifyFile is provided', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/wizard/codify/77`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      const file = new Blob(['x'], { type: 'text/plain' });
      await makeClient().wizardCodify(77, { codifyFile: file });
      expectAuthHeader(cap.current!, TOKEN);
      const ctype = cap.current!.headers.get('content-type') ?? '';
      expect(ctype).toMatch(/multipart\/form-data/i);
    });

    it('handles undefined body as JSON null body (no fields)', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/wizard/codify/77`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().wizardCodify(77);
      expectAuthHeader(cap.current!, TOKEN);
      expect(cap.current!.method).toBe('POST');
    });
  });
});
