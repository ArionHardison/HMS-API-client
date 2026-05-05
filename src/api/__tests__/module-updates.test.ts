/**
 * Strict-mode coverage for module-resource PUT updates that the broader
 * gap-detection script in `sdk/CLAUDE.md` flags as missing because their
 * existing tests only register the *outbound* POST mock (Laravel's
 * `?_method=PUT` override). The methods themselves already live on the
 * existing module clients; this file just exercises each one and asserts
 * the override path explicitly.
 *
 * 22 endpoints across:
 *   - Modules/Activity      (3): activity-location, creator-activity, service-location/update
 *   - Modules/Agents        (1): agents.module.update
 *   - Modules/Appeal        (1)
 *   - Modules/Application   (1)
 *   - Modules/Assessments   (4): assessment, attend, question, response
 *   - Modules/Challenge     (1)
 *   - Modules/Connector     (1)
 *   - Modules/Disbursement  (1)
 *   - Modules/FollowUps     (1)
 *   - Modules/Items         (3): items, user-items, collection
 *   - Modules/Nudge         (1)
 *   - Modules/Order         (1)
 *   - Modules/Referral      (1)
 *   - Modules/Report        (1)
 *   - Modules/Verification  (1)
 *
 * NOTE: This file deliberately does NOT modify the module clients — it
 * only verifies the PUT-via-POST override for the existing `update*`
 * methods.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectMethodOverride,
  mockEndpoint,
} from '../../__tests__/helpers/factories';

import { ActivityModuleApiClient } from '../modules-activity-api-client';
import { AgentsModuleApiClient } from '../modules-agents-api-client';
import { AppealModuleApiClient } from '../modules-appeal-api-client';
import { ApplicationModuleApiClient } from '../modules-application-api-client';
import { AssessmentsModuleApiClient } from '../modules-assessments-api-client';
import { ChallengeModuleApiClient } from '../modules-challenge-api-client';
import { ConnectorModuleApiClient } from '../modules-connector-api-client';
import { DisbursementModuleApiClient } from '../modules-disbursement-api-client';
import { FollowUpsModuleApiClient } from '../modules-followups-api-client';
import { ItemsModuleApiClient } from '../modules-items-api-client';
import { NudgeModuleApiClient } from '../modules-nudge-api-client';
import { OrderModuleApiClient } from '../modules-order-api-client';
import { ReferralModuleApiClient } from '../modules-referral-api-client';
import { ReportModuleApiClient } from '../modules-report-api-client';
import { VerificationModuleApiClient } from '../modules-verification-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'mod-upd-tok';
const DOMAIN = 'phm.ai';

interface Captured {
  current: Request | null;
}

const cfg = { baseURL: BASE, getToken: () => TOKEN, getDomain: () => DOMAIN };

function captureHandler(captured: Captured) {
  return async ({ request }: { request: Request }) => {
    captured.current = request.clone();
    return { success: true, message: '', data: { id: 1 } };
  };
}

describe('Module update PUT-via-POST override coverage (22 endpoints)', () => {
  let captured: Captured;
  beforeEach(() => {
    captured = { current: null };
  });

  // ---------------------------------------------------------------------------
  // Modules/Activity
  // ---------------------------------------------------------------------------
  it('Activity.updateLocation() — PUT /api/activity-location/{id}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/activity-location/7`,
        captureHandler(captured),
      ),
    );
    await new ActivityModuleApiClient(cfg).updateLocation(7, {
      name: 'x',
      state: 's',
      city: 'c',
      address: 'a',
      zip: 1,
      is_enabled: true,
      working_days: [],
    });
    expectMethodOverride(captured.current!, 'PUT');
    expectAuthHeader(captured.current!, TOKEN);
  });

  it('Activity.updateCreatorActivity() — PUT /api/creator-activity/{id}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/creator-activity/7`,
        captureHandler(captured),
      ),
    );
    await new ActivityModuleApiClient(cfg).updateCreatorActivity(7, {});
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('Activity.updateServiceLocation() — PUT /api/service-location/update/{service}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/service-location/update/7`,
        captureHandler(captured),
      ),
    );
    await new ActivityModuleApiClient(cfg).updateServiceLocation(7, {});
    expectMethodOverride(captured.current!, 'PUT');
  });

  // ---------------------------------------------------------------------------
  // Modules/Agents
  // ---------------------------------------------------------------------------
  it('Agents.update() — PUT /api/agents/{agent}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/agents/7`, captureHandler(captured)),
    );
    await new AgentsModuleApiClient(cfg).update(7, {});
    expectMethodOverride(captured.current!, 'PUT');
  });

  // ---------------------------------------------------------------------------
  // Modules/Appeal
  // ---------------------------------------------------------------------------
  it('Appeal.update() — PUT /api/appeal/{appeal}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/appeal/7`, captureHandler(captured)),
    );
    await new AppealModuleApiClient(cfg).update(7, {});
    expectMethodOverride(captured.current!, 'PUT');
  });

  // ---------------------------------------------------------------------------
  // Modules/Application
  // ---------------------------------------------------------------------------
  it('Application.update() — PUT /api/application/{application}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/application/7`,
        captureHandler(captured),
      ),
    );
    await new ApplicationModuleApiClient(cfg).update(7, {});
    expectMethodOverride(captured.current!, 'PUT');
  });

  // ---------------------------------------------------------------------------
  // Modules/Assessments
  // ---------------------------------------------------------------------------
  it('Assessments.updateAssessment() — PUT /api/assessment/{assessment}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/assessment/7`, captureHandler(captured)),
    );
    await new AssessmentsModuleApiClient(cfg).updateAssessment(7, {});
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('Assessments.updateAttend() — PUT /api/attend/{attend}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/attend/7`, captureHandler(captured)),
    );
    await new AssessmentsModuleApiClient(cfg).updateAttend(7, {});
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('Assessments.updateQuestion() — PUT /api/question/{question}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/question/7`, captureHandler(captured)),
    );
    await new AssessmentsModuleApiClient(cfg).updateQuestion(7, {});
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('Assessments.updateResponse() — PUT /api/response/{response}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/response/7`, captureHandler(captured)),
    );
    await new AssessmentsModuleApiClient(cfg).updateResponse(7, {});
    expectMethodOverride(captured.current!, 'PUT');
  });

  // ---------------------------------------------------------------------------
  // Modules/Challenge
  // ---------------------------------------------------------------------------
  it('Challenge.updateChallenge() — PUT /api/challenge/{challenge}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/challenge/7`, captureHandler(captured)),
    );
    await new ChallengeModuleApiClient(cfg).updateChallenge(7, {});
    expectMethodOverride(captured.current!, 'PUT');
  });

  // ---------------------------------------------------------------------------
  // Modules/Connector
  // ---------------------------------------------------------------------------
  it('Connector.update() — PUT /api/connector/{connector}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/connector/7`, captureHandler(captured)),
    );
    await new ConnectorModuleApiClient(cfg).update(7, {});
    expectMethodOverride(captured.current!, 'PUT');
  });

  // ---------------------------------------------------------------------------
  // Modules/Disbursement
  // ---------------------------------------------------------------------------
  it('Disbursement.update() — PUT /api/disbursement/{disbursement}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/disbursement/7`,
        captureHandler(captured),
      ),
    );
    await new DisbursementModuleApiClient(cfg).update(7, {});
    expectMethodOverride(captured.current!, 'PUT');
  });

  // ---------------------------------------------------------------------------
  // Modules/FollowUps
  // ---------------------------------------------------------------------------
  it('FollowUps.updateFollowUp() — PUT /api/follow-up/{follow_up}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/follow-up/7`, captureHandler(captured)),
    );
    await new FollowUpsModuleApiClient(cfg).updateFollowUp(7, {});
    expectMethodOverride(captured.current!, 'PUT');
  });

  // ---------------------------------------------------------------------------
  // Modules/Items
  // ---------------------------------------------------------------------------
  it('Items.updateItem() — PUT /api/items/{item}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/items/7`, captureHandler(captured)),
    );
    await new ItemsModuleApiClient(cfg).updateItem(7, {});
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('Items.updateUserItem() — PUT /api/user-items/{user_item}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/user-items/7`, captureHandler(captured)),
    );
    await new ItemsModuleApiClient(cfg).updateUserItem(7, {});
    expectMethodOverride(captured.current!, 'PUT');
  });

  it('Items.updateCollection() — PUT /api/collection/{collection}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/collection/7`, captureHandler(captured)),
    );
    await new ItemsModuleApiClient(cfg).updateCollection(7, {});
    expectMethodOverride(captured.current!, 'PUT');
  });

  // ---------------------------------------------------------------------------
  // Modules/Nudge
  // ---------------------------------------------------------------------------
  it('Nudge.update() — PUT /api/nudge/{nudge}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/nudge/7`, captureHandler(captured)),
    );
    await new NudgeModuleApiClient(cfg).update(7, {});
    expectMethodOverride(captured.current!, 'PUT');
  });

  // ---------------------------------------------------------------------------
  // Modules/Order
  // ---------------------------------------------------------------------------
  it('Order.update() — PUT /api/order/{order}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/order/7`, captureHandler(captured)),
    );
    await new OrderModuleApiClient(cfg).update(7, {});
    expectMethodOverride(captured.current!, 'PUT');
  });

  // ---------------------------------------------------------------------------
  // Modules/Referral
  // ---------------------------------------------------------------------------
  it('Referral.update() — PUT /api/referral/{referral}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/referral/7`, captureHandler(captured)),
    );
    await new ReferralModuleApiClient(cfg).update(7, {});
    expectMethodOverride(captured.current!, 'PUT');
  });

  // ---------------------------------------------------------------------------
  // Modules/Report
  // ---------------------------------------------------------------------------
  it('Report.update() — PUT /api/report/{report}', async () => {
    server.use(
      mockEndpoint('post', `${BASE}/api/report/7`, captureHandler(captured)),
    );
    await new ReportModuleApiClient(cfg).update(7, {});
    expectMethodOverride(captured.current!, 'PUT');
  });

  // ---------------------------------------------------------------------------
  // Modules/Verification
  // ---------------------------------------------------------------------------
  it('Verification.update() — PUT /api/verification/{verification}', async () => {
    server.use(
      mockEndpoint(
        'post',
        `${BASE}/api/verification/7`,
        captureHandler(captured),
      ),
    );
    await new VerificationModuleApiClient(cfg).update(7, {});
    expectMethodOverride(captured.current!, 'PUT');
  });
});
