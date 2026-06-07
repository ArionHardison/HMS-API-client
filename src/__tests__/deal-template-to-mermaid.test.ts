/**
 * Tests for `dealTemplateToMermaid()` — pure-TS helper. No HTTP, no
 * Vue, no Mermaid runtime; we just verify the emitted string matches
 * the contract documented in the helper.
 */

import { describe, it, expect } from 'vitest';
import { dealTemplateToMermaid } from '../utils/deal-template-to-mermaid';
import { CodifyDealTemplate } from '../types/codify-domain';

const minimalTemplate = (overrides: Partial<CodifyDealTemplate> = {}): CodifyDealTemplate => ({
  tld: 'healthcare',
  intent_slug: 'medication-efficacy-uncertain',
  problem_classification: {
    ontology_class: 'TreatmentReview',
    summary: 'Decide whether to continue, escalate, or switch a medication',
  },
  required_stakeholders: [],
  required_systems: [],
  pipeline_steps: [],
  success_criteria: {
    primary_metric: 'Treatment plan confirmed by prescriber',
    verification: 'subjective',
  },
  ...overrides,
});

describe('dealTemplateToMermaid', () => {
  it('always starts with `sequenceDiagram`', () => {
    const out = dealTemplateToMermaid(minimalTemplate());
    expect(out.split('\n')[0]).toBe('sequenceDiagram');
  });

  it('emits a problem-statement note even when pipeline is empty', () => {
    const out = dealTemplateToMermaid(minimalTemplate());
    expect(out).toMatch(/Decide whether to continue/);
  });

  it('declares one participant per stakeholder, system, and step-actor', () => {
    const out = dealTemplateToMermaid(
      minimalTemplate({
        required_stakeholders: [
          { onet_code: '29-1216.00', role: 'Family Medicine Physician' },
        ],
        required_systems: [{ abbr: 'EMR', operation: 'read_chart' }],
        pipeline_steps: [
          { step: 1, actor: 'IntakeAgent', action: 'Collect symptoms' },
          { step: 2, actor: 'Family Medicine Physician', action: 'Review labs' },
          { step: 3, actor: 'EMR', action: 'Persist note' },
        ],
      }),
    );

    expect(out).toMatch(/participant Family_Medicine_Physician as Family Medicine Physician/);
    expect(out).toMatch(/participant EMR as <<sys>> EMR/);
    expect(out).toMatch(/participant IntakeAgent as IntakeAgent/);
  });

  it('renders pipeline steps as message edges', () => {
    const out = dealTemplateToMermaid(
      minimalTemplate({
        required_stakeholders: [{ onet_code: '29-1216.00', role: 'Physician' }],
        pipeline_steps: [
          { step: 1, actor: 'IntakeAgent', action: 'Collect symptoms' },
          { step: 2, actor: 'Physician', action: 'Review' },
        ],
      }),
    );

    expect(out).toMatch(/IntakeAgent->>Physician: Review/);
  });

  it('renders a self-loop when an actor performs a sequential action', () => {
    const out = dealTemplateToMermaid(
      minimalTemplate({
        required_stakeholders: [{ onet_code: '29-1216.00', role: 'Physician' }],
        pipeline_steps: [
          { step: 1, actor: 'Physician', action: 'Review labs' },
          { step: 2, actor: 'Physician', action: 'Update plan' },
        ],
      }),
    );

    expect(out).toMatch(/Physician->>Physician: Update plan/);
  });

  it('appends success_criteria as a terminal note with verification kind', () => {
    const out = dealTemplateToMermaid(
      minimalTemplate({
        required_stakeholders: [{ onet_code: '29-1216.00', role: 'Physician' }],
        success_criteria: {
          primary_metric: 'Outcome accepted',
          verification: 'deterministic',
        },
      }),
    );

    expect(out).toMatch(/✅ Outcome accepted \(deterministic\)/);
  });

  it('truncates overlong action labels with an ellipsis', () => {
    const long = 'x'.repeat(120);
    const out = dealTemplateToMermaid(
      minimalTemplate({
        required_stakeholders: [{ onet_code: '29-1216.00', role: 'A' }],
        pipeline_steps: [{ step: 1, actor: 'A', action: long }],
      }),
    );

    // Action label truncated to 80 chars (with ellipsis taking the 80th).
    expect(out).toMatch(/x{79}…/);
  });

  it('emits a syntactically valid empty diagram when pipeline + stakeholders + systems are all empty', () => {
    const out = dealTemplateToMermaid(minimalTemplate());
    // Two lines minimum: the diagram declaration + the problem note.
    const lines = out.split('\n').filter((l) => l.trim() !== '');
    expect(lines.length).toBeGreaterThanOrEqual(2);
    expect(lines[0]).toBe('sequenceDiagram');
  });

  it('quotes-and-newline-safe — strips embedded quotes from labels', () => {
    const out = dealTemplateToMermaid(
      minimalTemplate({
        problem_classification: {
          ontology_class: 'X',
          summary: 'A "quoted" problem\nwith a newline',
        },
      }),
    );

    expect(out).not.toMatch(/"quoted"/);
    expect(out).toMatch(/'quoted'/);
    // Newline collapsed to a single space — "problem\nwith" → "problem with".
    // Look for the joined form on a single line of the output.
    const problemLine = out.split('\n').find((line) => line.includes("'quoted' problem"));
    expect(problemLine).toBeDefined();
    expect(problemLine).toMatch(/'quoted' problem with a newline/);
  });
});
