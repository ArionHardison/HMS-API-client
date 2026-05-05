/**
 * Endpoint coverage for `WizardSetupApiClient` — 27 endpoints under
 * `/api/wizard/*` (excluding the Five-Step methods owned by `WizardApiClient`).
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { WizardSetupApiClient } from '../wizard-setup-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'wzs-tok-xyz';
const DOMAIN = 'project20x.com';

interface Captured {
  current: Request | null;
}

function makeClient(): WizardSetupApiClient {
  return new WizardSetupApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

describe('WizardSetupApiClient — /api/wizard/* (setup surface)', () => {
  let captured: Captured;
  beforeEach(() => {
    captured = { current: null };
  });

  // Assessment
  it('getAssessmentAnswers() — GET /api/wizard/assessment/answers/{protocol}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/wizard/assessment/answers/77`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { answers: [] } };
        },
      ),
    );
    await makeClient().getAssessmentAnswers(77);
    expectAuthHeader(captured.current!, TOKEN);
    expectDomainHeader(captured.current!, DOMAIN);
    expect(captured.current!.method).toBe('GET');
  });

  it('getAssessmentQuestions() — GET /api/wizard/assessment/questions/{protocol}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/wizard/assessment/questions/77`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { questions: [] } };
        },
      ),
    );
    await makeClient().getAssessmentQuestions(77);
    expect(captured.current!.method).toBe('GET');
  });

  // Profile + account
  it('completeProfile() — POST /api/wizard/complete-profile/{protocol}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/wizard/complete-profile/77`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().completeProfile(77, {
      birth_date: '1990-01-01',
      address: '1 St',
      city: 'Boston',
      state: 'MA',
      zip: '02114',
    });
    const body = await captured.current!.json();
    expect(body.city).toBe('Boston');
  });

  it('confirmAccount() — POST /api/wizard/confirm-account/{protocol}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/wizard/confirm-account/77`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().confirmAccount(77, {
      full_name: 'A',
      timezone: 'UTC',
      country_id: 1,
      login: 'a',
      email: 'a@b.c',
      phone: '+1',
      password: 'pw',
      agreed: true,
    });
    expect(captured.current!.method).toBe('POST');
  });

  it('confirmCode() — POST /api/wizard/confirm-code/{protocol}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/wizard/confirm-code/77`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().confirmCode(77, { code: '111111' });
    expect((await captured.current!.json()).code).toBe('111111');
  });

  it('confirmPreview() — POST /api/wizard/confirm-preview/{protocol}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/wizard/confirm-preview/77`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().confirmPreview(77, { program_image: 'https://x.png' });
    expect(captured.current!.method).toBe('POST');
  });

  it('submitCreatorRequest() — POST /api/wizard/creator-request/{protocol}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/wizard/creator-request/77`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().submitCreatorRequest(77, {
      id_photo: 'a',
      id_photo_back: 'b',
      sign_photo: 'c',
    });
    expect(captured.current!.method).toBe('POST');
  });

  // Stripe + finances
  it('connectStripe() — GET /api/wizard/connect-stripe/{protocol}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/wizard/connect-stripe/77`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { url: 'x' } };
        },
      ),
    );
    await makeClient().connectStripe(77);
    expect(captured.current!.method).toBe('GET');
  });

  it('verifyStripe() — GET /api/wizard/verify-stripe/{protocol}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/wizard/verify-stripe/77`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: { verified: true } };
        },
      ),
    );
    await makeClient().verifyStripe(77);
    expect(captured.current!.method).toBe('GET');
  });

  it('getFinances() — GET /api/wizard/finances/{protocol}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/wizard/finances/77`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: {} };
      }),
    );
    await makeClient().getFinances(77);
    expect(captured.current!.method).toBe('GET');
  });

  it('setFinances() — POST /api/wizard/set-finances/{protocol}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/wizard/set-finances/77`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().setFinances(77, { fee: 5 });
    expect(captured.current!.method).toBe('POST');
  });

  // State + finalization
  it('getFinalizationState() — GET /api/wizard/finalization-state/{protocol}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/wizard/finalization-state/77`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().getFinalizationState(77);
    expect(captured.current!.method).toBe('GET');
  });

  it('getWizardState() — GET /api/wizard/get-state/{protocol}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/wizard/get-state/77`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: { step: 3 } };
      }),
    );
    const res = await makeClient().getWizardState(77);
    expect(res.data).toEqual({ step: 3 });
  });

  it('getProgramData() — GET /api/wizard/program-data/{protocol}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/wizard/program-data/77`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().getProgramData(77);
    expect(captured.current!.method).toBe('GET');
  });

  it('getPublicProgramCreated() — GET /api/wizard/public-program-created/{protocol}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/wizard/public-program-created/77`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().getPublicProgramCreated(77);
    expect(captured.current!.method).toBe('GET');
  });

  it('retryCreation() — GET /api/wizard/retry-creation/{protocol}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/wizard/retry-creation/77`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().retryCreation(77);
    expect(captured.current!.method).toBe('GET');
  });

  it('startProgram() — GET /api/wizard/start-program/{protocol}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/wizard/start-program/77`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().startProgram(77);
    expect(captured.current!.method).toBe('GET');
  });

  it('stepBack() — GET /api/wizard/step-back/{protocol}', async () => {
    server.use(
      mockEndpoint('get', `${BASE}/api/wizard/step-back/77`, ({ request }) => {
        captured.current = request;
        return { success: true, message: '', data: {} };
      }),
    );
    await makeClient().stepBack(77);
    expect(captured.current!.method).toBe('GET');
  });

  // Members
  it('findMembers() — POST /api/wizard/find-members', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/wizard/find-members`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { members: [] } };
        },
      ),
    );
    await makeClient().findMembers({ protocol: 77, query: 'a', role: 'expert' });
    expect((await captured.current!.json()).query).toBe('a');
  });

  it('getRequiredRoles() — GET /api/wizard/get-required-roles/{protocol}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/wizard/get-required-roles/77`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().getRequiredRoles(77);
    expect(captured.current!.method).toBe('GET');
  });

  it('inviteMembers() — POST /api/wizard/invite-members/{protocol}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/wizard/invite-members/77`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().inviteMembers(77, { members: [{ user_id: 1 }] });
    expect(captured.current!.method).toBe('POST');
  });

  it('inviteUsers() — POST /api/wizard/invite-users/{protocol}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/wizard/invite-users/77`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().inviteUsers(77, { emails: ['a@b.c'] });
    expect(captured.current!.method).toBe('POST');
  });

  it('getRolesToInvite() — GET /api/wizard/team/roles-to-invite/{protocol}', async () => {
    server.use(
      mockEndpoint(
        'get',
        `${BASE}/api/wizard/team/roles-to-invite/77`,
        ({ request }) => {
          captured.current = request;
          return { success: true, message: '', data: [] };
        },
      ),
    );
    await makeClient().getRolesToInvite(77);
    expect(captured.current!.method).toBe('GET');
  });

  // Misc setup
  it('publishProgram() — POST /api/wizard/publish-program/{protocol}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/wizard/publish-program/77`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().publishProgram(77, { publish_now: true, amount: 100 });
    const body = await captured.current!.json();
    expect(body.publish_now).toBe(true);
  });

  it('setAgent() — POST /api/wizard/set-agent/{protocol}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/wizard/set-agent/77`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().setAgent(77, { agent: 'agent-1' });
    expect((await captured.current!.json()).agent).toBe('agent-1');
  });

  it('setDistributionType() — POST /api/wizard/set-distribution-type/{protocol}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/wizard/set-distribution-type/77`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: {} };
        },
      ),
    );
    await makeClient().setDistributionType(77, { is_free: true });
    expect((await captured.current!.json()).is_free).toBe(true);
  });

  it('validateEmail() — POST /api/wizard/validate-email', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/wizard/validate-email`,
        async ({ request }) => {
          captured.current = request.clone();
          return { success: true, message: '', data: { valid: true } };
        },
      ),
    );
    await makeClient().validateEmail({ email: 'a@b.c' });
    expect((await captured.current!.json()).email).toBe('a@b.c');
  });
});
