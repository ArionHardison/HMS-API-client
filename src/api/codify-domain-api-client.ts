/**
 * CodifyDomainApiClient — wraps the public `/api/codify-domain/*` surface
 * exposed by api/Modules/Codify. Used by CI-MYC's `/agent/:tld` page and
 * any other consumer (gov/, sys/, future dashboards) that needs the
 * domain → intent → deal-template → comments contract.
 *
 * Auth band:
 *   - GET endpoints (showByTld, intents, dealTemplate, agentProfile,
 *     listComments, kindRender) are throttled-anon. The base client's
 *     `getToken` is called but the api/ side ignores the absence of a
 *     token (soft-auth pattern; see PublicCodifyDomainController
 *     middleware comment).
 *   - POST createComment requires sanctum. The api/ route is in a
 *     separate group with `auth:sanctum` middleware; pass a token via
 *     `getToken` or the call returns 401.
 *
 * Mermaid helper: pair this client with `dealTemplateToMermaid()` from
 * `../utils/deal-template-to-mermaid` to render a deal template as a
 * sequence diagram in the consumer's UI. The SDK ships the helper
 * separately so non-Mermaid consumers don't pull the conversion logic.
 */

import { BaseApiClient, type ApiResponse } from '../api-client';
import type {
  AgentComment,
  CodifyDealTemplate,
  CodifyIntent,
  CreateCommentRequest,
  CreateCommentResponse,
  DomainAgentProfile,
  ListCommentsResponse,
  ListIntentsResponse,
} from '../types/codify-domain';

export class CodifyDomainApiClient extends BaseApiClient {
  /**
   * `GET /api/codify-domain/by-tld/{tld}` — merged CodifyDomain payload
   * (vocabulary + policy_boundary + substrate_systems + about_copy +
   * kind_render). Returns 404 when the TLD has no live domain row.
   */
  public async getDomain(tld: string): Promise<ApiResponse<Record<string, unknown>>> {
    return this.get<Record<string, unknown>>(
      `/api/codify-domain/by-tld/${encodeURIComponent(tld)}`,
    );
  }

  /**
   * `GET /api/codify-domain/{tld}/intents` — live intents for the TLD
   * (with parent-TLD inheritance: city overlays merge their parent
   * vertical's catalogue). The api/ envelope wraps the list as
   * `{ intents: [...] }`; this method returns the raw envelope so the
   * caller can choose to unwrap or treat the whole thing as the result.
   */
  public async getIntents(tld: string): Promise<ApiResponse<ListIntentsResponse>> {
    return this.get<ListIntentsResponse>(
      `/api/codify-domain/${encodeURIComponent(tld)}/intents`,
    );
  }

  /**
   * `GET /api/codify-domain/{tld}/deal-template/{intent_slug}` — full
   * deal template for one intent. 404 when no live template matches
   * (the API falls back to the parent vertical's template first).
   */
  public async getDealTemplate(
    tld: string,
    intentSlug: string,
  ): Promise<ApiResponse<CodifyDealTemplate>> {
    return this.get<CodifyDealTemplate>(
      `/api/codify-domain/${encodeURIComponent(tld)}/deal-template/${encodeURIComponent(intentSlug)}`,
    );
  }

  /**
   * `GET /api/codify-domain/{tld}/agent-profile` — bulk one-shot
   * payload powering CI-MYC's agent page. Domain + intents + deal
   * templates + outcome rollup + stakeholders + 20 most recent
   * comments in one round-trip.
   */
  public async getAgentProfile(tld: string): Promise<ApiResponse<DomainAgentProfile>> {
    return this.get<DomainAgentProfile>(
      `/api/codify-domain/${encodeURIComponent(tld)}/agent-profile`,
    );
  }

  /**
   * `GET /api/codify-domain/{tld}/comments` — list comments for the
   * TLD, optionally narrowed to a single intent (returns intent-scoped
   * comments PLUS domain-level comments, since domain-level notes are
   * relevant to every intent view).
   */
  public async listComments(
    tld: string,
    intentSlug?: string,
  ): Promise<ApiResponse<ListCommentsResponse>> {
    const path = `/api/codify-domain/${encodeURIComponent(tld)}/comments`;
    const url = intentSlug ? `${path}?intent_slug=${encodeURIComponent(intentSlug)}` : path;
    return this.get<ListCommentsResponse>(url);
  }

  /**
   * `POST /api/codify-domain/{tld}/comments` — author a comment.
   * Requires sanctum auth on the api/ side; CI-MYC's caller injects
   * the user's Bearer token via `getToken`. Returns the persisted row
   * (wrapped as `{ comment: AgentComment }`).
   *
   * v1 attributes the comment to the authenticated user; agent-
   * authored comments (machine token + `author_agent_id`) land in
   * Phase 4 once api/ wires the agent token guard.
   */
  public async createComment(
    tld: string,
    body: CreateCommentRequest,
  ): Promise<ApiResponse<CreateCommentResponse>> {
    return this.post<CreateCommentResponse>(
      `/api/codify-domain/${encodeURIComponent(tld)}/comments`,
      body as unknown as Record<string, unknown>,
    );
  }
}
