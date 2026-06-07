/**
 * Render a CodifyDealTemplate as a Mermaid `sequenceDiagram` string.
 *
 * Why sequence (not flowchart): a deal template models multi-actor
 * coordination — pipeline_steps are owned by different actors (LLM
 * agents, human-in-the-loop reviewers, substrate systems) feeding
 * outputs into later steps. A sequence diagram with actor lanes
 * reads the coordination clearly; a flowchart turns into spaghetti
 * arrows once N steps fan into step N+1.
 *
 * Consumer flow:
 *   const sdk = new CodifyDomainApiClient(config);
 *   const { data: template } = await sdk.getDealTemplate(tld, slug);
 *   const definition = dealTemplateToMermaid(template);
 *   // pass `definition` to a <MermaidDiagram :definition="…" />
 *
 * The output is intentionally compact: actor lanes are dedup'd, action
 * labels are trimmed to ~80 chars, and substrate systems show as
 * `<<system>>`-prefixed participants so the page can style them
 * differently from human/agent actors. Success criteria render as a
 * note at the end.
 *
 * Safe against malformed input — missing optional fields fall through
 * to sensible defaults instead of throwing. Returns a syntactically
 * valid Mermaid string in all cases; an empty pipeline produces a
 * minimal diagram with just the problem-statement note.
 */
import type { CodifyDealTemplate } from '../types/codify-domain';
export declare function dealTemplateToMermaid(template: CodifyDealTemplate): string;
//# sourceMappingURL=deal-template-to-mermaid.d.ts.map