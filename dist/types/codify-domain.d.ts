/**
 * Codify-domain types — request/response shapes for the
 * `/api/codify-domain/{tld}/*` endpoints exposed by api/.
 *
 * These mirror the Laravel schemas in
 * `api/Modules/Codify/Schemas/{codify-intent,codify-deal-template,codify-domain}.schema.json`
 * (the canonical JSON schemas in `/Users/arionhardison/Desktop/P2X/schemas/`).
 *
 * Hand-written rather than generated from a TS spec — small surface, low
 * change rate, and the spec uses JSON-Schema dialect that doesn't cleanly
 * round-trip to TypeScript without manual cleanup. Bumped along with the
 * schemas under `/schemas/` whenever the canonical shape changes; the
 * SDK's contract tests will surface drift.
 */
/**
 * One typed parameter slot on a CodifyIntent. Mirrors the
 * `parameters[]` entries in `codify-intent.schema.json`. Drives the
 * agent's question-generation + the CI-MYC agent page's intent
 * detail render.
 */
export interface CodifyIntentParameter {
    key: string;
    label: string;
    type: 'string' | 'enum' | 'number' | 'date' | 'duration' | 'money' | 'bool' | 'onet_code' | 'system_abbr' | 'file';
    required: boolean;
    priority?: 'must' | 'should' | 'could';
    depends_on?: string[];
    extraction_hints?: string[];
    enum_values?: string[];
}
export interface CodifyIntent {
    tld: string;
    slug: string;
    narrative: string;
    intent_class: string;
    parameters?: CodifyIntentParameter[];
    frequency_hint?: 'rare' | 'occasional' | 'common' | 'very_common';
    stakes_hint?: 'low' | 'medium' | 'high' | 'life-critical';
    realtime_sources?: string[];
    status: 'draft' | 'review' | 'live' | 'deprecated';
    version: number;
}
/**
 * O*NET-coded role declaration on a deal template. The CI-MYC agent
 * page renders these as stakeholder cards alongside `median_hourly_wage`.
 */
export interface DealTemplateStakeholder {
    onet_code: string;
    role?: string;
    hours_estimated?: number;
    median_hourly_wage?: number;
}
/**
 * Substrate-system declaration on a deal template — pairs an abbreviation
 * (EMR, LIMS, PLACEHIRE…) with the operation verb invoked against it
 * during a pipeline step.
 */
export interface DealTemplateSystem {
    abbr: string;
    operation: string;
    endpoint_hint?: string;
}
/**
 * One ordered step in a deal template's pipeline. Inputs/outputs use the
 * typed-ref grammar `param:<key>` / `step:<n>.<output>` /
 * `system:<abbr>.<event>`.
 */
export interface DealTemplatePipelineStep {
    step: number;
    actor: string;
    action: string;
    inputs?: string[];
    outputs?: string[];
    policy_checks?: string[];
}
export interface DealTemplateSuccessCriterion {
    primary_metric: string;
    verification: 'deterministic' | 'subjective' | 'operational';
    grader_method?: 'simple_comparison' | 'json_schema' | 'regex' | 'human_grader';
    threshold?: number;
}
export interface DealTemplateFinancialModel {
    estimated_cost?: number;
    breakdown?: Array<{
        onet_code: string;
        hours: number;
        cost: number;
    }>;
}
export interface CodifyDealTemplate {
    tld: string;
    intent_slug: string;
    problem_classification: {
        ontology_class: string;
        summary: string;
    };
    required_stakeholders: DealTemplateStakeholder[];
    required_systems: DealTemplateSystem[];
    pipeline_steps: DealTemplatePipelineStep[];
    success_criteria: DealTemplateSuccessCriterion;
    financial_model?: DealTemplateFinancialModel;
    status?: 'draft' | 'review' | 'live' | 'deprecated';
    version?: number;
}
/**
 * Agent-to-agent / user-to-agent commentary on a domain's use cases.
 * Backed by `domain_agent_comments` in api/. NOT bound to a deal
 * instance — these are design-time notes on the intent / template.
 */
export interface AgentComment {
    id: number;
    tld: string;
    intent_slug: string | null;
    author_agent_id: string | null;
    author_user_id: number | null;
    author_kind: 'agent' | 'user';
    body: string;
    kind: 'note' | 'suggestion' | 'review_request' | 'risk' | 'handoff' | 'ack';
    created_at: string;
}
/**
 * Domain-level stakeholder declaration (from
 * `codify_domains.stakeholder_onet_codes`). Distinct from
 * `DealTemplateStakeholder` — domain stakeholders are the canonical
 * cast for the TLD; template stakeholders are role assignments per
 * use-case.
 */
export interface DomainStakeholder {
    code: string;
    name: string | null;
    role: 'primary' | 'secondary' | 'supporting' | null;
}
/**
 * Per-intent rollup of completed deal_instances for this TLD. Drives
 * the evals histogram on the CI-MYC agent page. `by_class` is a
 * sparse map keyed by `outcome_report.class`.
 */
export interface IntentOutcomeRollup {
    total: number;
    avg_score: number;
    by_class: Record<string, number>;
}
/**
 * Response shape of `GET /api/codify-domain/{tld}/agent-profile` — the
 * one-shot bulk payload the CI-MYC `/agent/:tld` page consumes.
 * `domain` carries the merged CodifyDomain payload (vocabulary,
 * policy_boundary, substrate_systems, about_copy, kind_render).
 * `deal_templates` is keyed by intent_slug for O(1) lookup; only slugs
 * that have a live template are present.
 */
export interface DomainAgentProfile {
    tld: string;
    domain: Record<string, unknown>;
    intents: CodifyIntent[];
    deal_templates: Record<string, CodifyDealTemplate>;
    outcome_rollup: Record<string, IntentOutcomeRollup>;
    stakeholders: DomainStakeholder[];
    comments: AgentComment[];
}
export interface ListIntentsResponse {
    intents: CodifyIntent[];
}
export interface ListCommentsResponse {
    tld: string;
    intent_slug: string | null;
    comments: AgentComment[];
}
export interface CreateCommentRequest {
    body: string;
    intent_slug?: string | null;
    kind?: AgentComment['kind'];
}
export interface CreateCommentResponse {
    comment: AgentComment;
}
//# sourceMappingURL=codify-domain.d.ts.map