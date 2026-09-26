/**
 * Types for `HitlApiClient` — the HITL (human-in-the-loop) staffing /
 * escalation module.
 *
 * Source of truth: `Modules/Hitl/Routes/api.php`, `HitlRequestedController`,
 * `HitlResumeController`, and the two FormRequests. Both endpoints are
 * `auth:api` + `abilities:hitl:writer` + `idempotency` (callers send an
 * `Idempotency-Key` header). Both return HTTP 202.
 */

/** Body for `POST /api/v1/integrations/hitl/requested` (HitlRequestedRequest). */
export interface HitlRequestedRequest {
  approval_id: string;
  tool_name: string;
  /** `present` + `array` server-side — send `{}` / `[]` when there are no args. */
  args: Record<string, unknown> | unknown[];
  agent_id?: string | null;
  subproject_id?: number | null;
}

/** 202 body for `POST /api/v1/integrations/hitl/requested`. */
export interface HitlRequestedResponse {
  approval_id: string;
  status: string;
}

/** Reviewer decision (HitlResumeRequest `decision` rule). */
export type HitlDecision = 'approved' | 'rejected' | 'escalated';

/** Body for `POST /api/v1/integrations/hitl/resume` (HitlResumeRequest). */
export interface HitlResumeRequest {
  approval_id: string;
  decision: HitlDecision;
  rationale?: string | null;
}

/** 202 body for `POST /api/v1/integrations/hitl/resume`. */
export interface HitlResumeResponse {
  approval_id: string;
  decision: HitlDecision | null;
  decided_at: string | null;
}
