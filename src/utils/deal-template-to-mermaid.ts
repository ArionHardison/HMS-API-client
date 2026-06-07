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

import type {
  CodifyDealTemplate,
  DealTemplatePipelineStep,
} from '../types/codify-domain';

/**
 * Sanitize a string for inclusion in Mermaid syntax. Mermaid is
 * line-oriented and chokes on stray newlines, double quotes, and `;`
 * mid-line. Replace newlines with spaces, escape quotes, and trim.
 */
function sanitize(text: string, maxLen = 80): string {
  const trimmed = (text ?? '').toString().replace(/\s+/g, ' ').trim();
  if (trimmed.length <= maxLen) return trimmed.replace(/"/g, "'");
  return `${trimmed.slice(0, maxLen - 1).replace(/"/g, "'")}…`;
}

/**
 * Mermaid participant aliases must be valid identifiers (no spaces,
 * no special chars). Map an actor label to a stable alias so we can
 * reuse it in messages.
 */
function aliasFor(label: string): string {
  return label
    .replace(/[^A-Za-z0-9]/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 32) || 'Actor';
}

/**
 * Walk the pipeline + stakeholder + system declarations to produce
 * the participant block. Order-preserving (first-seen wins) so the
 * sequence reads left-to-right by appearance.
 */
function collectParticipants(template: CodifyDealTemplate): Array<{ alias: string; label: string; kind: 'human' | 'agent' | 'system' }> {
  const seen = new Map<string, { alias: string; label: string; kind: 'human' | 'agent' | 'system' }>();

  const add = (label: string, kind: 'human' | 'agent' | 'system'): void => {
    if (!label) return;
    const alias = aliasFor(label);
    if (!seen.has(alias)) {
      seen.set(alias, { alias, label, kind });
    }
  };

  // Stakeholders first (the canonical cast)
  for (const sh of template.required_stakeholders ?? []) {
    const label = sh.role || sh.onet_code || 'Stakeholder';
    // Heuristic: roles starting with 'Agent' or ending with 'Agent' are
    // LLM agents; everything else is human-in-the-loop unless it's a
    // bare onet_code (in which case we treat as human professional).
    const isAgent = /agent/i.test(label);
    add(label, isAgent ? 'agent' : 'human');
  }

  // Systems
  for (const sys of template.required_systems ?? []) {
    add(sys.abbr, 'system');
  }

  // Any actor named in pipeline_steps that wasn't already declared
  // (defensive — schemas should declare actors in stakeholders/systems
  // first, but the runtime sometimes adds ad-hoc step actors).
  for (const step of template.pipeline_steps ?? []) {
    if (!step.actor) continue;
    const isSystem = (template.required_systems ?? []).some((s) => s.abbr === step.actor);
    const isAgent = /agent/i.test(step.actor);
    add(step.actor, isSystem ? 'system' : isAgent ? 'agent' : 'human');
  }

  return Array.from(seen.values());
}

/**
 * Resolve the actor for a pipeline step's INPUT — used to draw the
 * preceding message edge. Returns null when the step is the first
 * step (no predecessor) or when the input doesn't reference a known
 * step output.
 */
function inputSourceAlias(
  step: DealTemplatePipelineStep,
  byStep: Map<number, DealTemplatePipelineStep>,
): string | null {
  const inputs = step.inputs ?? [];
  for (const ref of inputs) {
    // Typed ref grammar: `step:<n>.<output>` → reuse the source step's actor.
    const m = ref.match(/^step:(\d+)/);
    if (m) {
      const sourceStep = byStep.get(Number(m[1]));
      if (sourceStep?.actor) return aliasFor(sourceStep.actor);
    }
  }
  return null;
}

export function dealTemplateToMermaid(template: CodifyDealTemplate): string {
  const lines: string[] = [];
  lines.push('sequenceDiagram');

  // Problem statement as the opening note (always)
  const problem = sanitize(template.problem_classification?.summary ?? template.intent_slug ?? 'use case', 120);
  // Note over the first participant once we know it; deferred to after participants are listed.

  const participants = collectParticipants(template);
  for (const p of participants) {
    // Mermaid: `participant <alias> as <label>`. Systems get the
    // `<<system>>` prefix on their display label so the consumer can
    // style them distinctly (Mermaid renders this verbatim in the
    // participant box).
    const display = p.kind === 'system' ? `<<sys>> ${sanitize(p.label, 24)}` : sanitize(p.label, 32);
    lines.push(`  participant ${p.alias} as ${display}`);
  }

  // Problem note — over the first participant (or a synthetic
  // "Codify" lane if there are no participants).
  if (participants.length > 0) {
    lines.push(`  Note over ${participants[0].alias}: ${sanitize(problem, 120)}`);
  } else {
    lines.push(`  Note left of Codify: ${sanitize(problem, 120)}`);
  }

  // Pipeline steps — render each as a message edge from the
  // upstream actor to the step's actor, with the action as the label.
  const byStep = new Map<number, DealTemplatePipelineStep>();
  for (const s of template.pipeline_steps ?? []) {
    if (typeof s.step === 'number') byStep.set(s.step, s);
  }

  const ordered = (template.pipeline_steps ?? []).slice().sort((a, b) => (a.step ?? 0) - (b.step ?? 0));
  for (let i = 0; i < ordered.length; i++) {
    const step = ordered[i];
    if (!step.actor) continue;
    const target = aliasFor(step.actor);
    const sourceAlias = inputSourceAlias(step, byStep)
      ?? (i > 0 ? aliasFor(ordered[i - 1].actor ?? '') : null);

    // Choose arrow direction. Self-actions render as a self-loop.
    if (sourceAlias && sourceAlias !== target) {
      lines.push(`  ${sourceAlias}->>${target}: ${sanitize(step.action ?? 'action')}`);
    } else if (sourceAlias === target) {
      lines.push(`  ${target}->>${target}: ${sanitize(step.action ?? 'action')}`);
    } else {
      // No identifiable source — render a self-action on the target.
      lines.push(`  ${target}->>${target}: ${sanitize(step.action ?? 'action')}`);
    }

    // Policy checks render as inline notes above the actor.
    for (const policy of step.policy_checks ?? []) {
      lines.push(`  Note right of ${target}: policy: ${sanitize(policy, 60)}`);
    }
  }

  // Success criterion — terminal note. Verification kind shows in the
  // label so the consumer knows which grader produced the outcome.
  const success = template.success_criteria;
  if (success?.primary_metric) {
    const kind = success.verification ? ` (${success.verification})` : '';
    const finalActor = participants[participants.length - 1]?.alias ?? 'Codify';
    lines.push(`  Note over ${finalActor}: ✅ ${sanitize(success.primary_metric, 80)}${kind}`);
  }

  return lines.join('\n');
}
