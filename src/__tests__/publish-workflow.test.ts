/**
 * GitHub Actions publish-workflow contract tests.
 *
 * Asserts the structure of `.github/workflows/publish.yml` so we don't ship
 * a workflow that fails silently or mis-authenticates against GH Packages.
 *
 * Phase: SDK_PUBLISH_PLAN.md → S2.
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import yaml from 'js-yaml';

const sdkRoot = resolve(__dirname, '../..');
const workflowPath = resolve(sdkRoot, '.github/workflows/publish.yml');

interface Step {
  name?: string;
  uses?: string;
  run?: string;
  with?: Record<string, unknown>;
  env?: Record<string, string>;
}
interface Job {
  needs?: string | string[];
  'runs-on'?: string;
  steps?: Step[];
}
interface Workflow {
  name?: string;
  on?: any;
  permissions?: Record<string, string>;
  jobs?: Record<string, Job>;
}

describe('.github/workflows/publish.yml', () => {
  it('exists at .github/workflows/publish.yml', () => {
    expect(existsSync(workflowPath)).toBe(true);
  });

  it('parses as valid YAML', () => {
    const src = readFileSync(workflowPath, 'utf8');
    const doc = yaml.load(src);
    expect(doc).toBeTruthy();
    expect(typeof doc).toBe('object');
  });

  // Helper: load the workflow once per test below.
  const loadWf = (): Workflow =>
    yaml.load(readFileSync(workflowPath, 'utf8')) as Workflow;

  it('triggers on push of v*.*.* tags', () => {
    const wf = loadWf();
    // YAML key `on` may be parsed as boolean true under js-yaml's default schema
    // (the infamous YAML 1.1 "yes/no/on/off" booleans). Read whichever the
    // parser produced.
    const on = (wf as any).on ?? (wf as any)[true];
    expect(on?.push?.tags).toEqual(['v*.*.*']);
  });

  it('also triggers on workflow_dispatch', () => {
    const wf = loadWf();
    const on = (wf as any).on ?? (wf as any)[true];
    expect(on).toBeDefined();
    expect('workflow_dispatch' in on).toBe(true);
  });

  it('grants packages: write permission for GH Packages publish', () => {
    const wf = loadWf();
    expect(wf.permissions?.packages).toBe('write');
  });

  it('has a `test` job that runs npm ci, npm run test, and npm run build', () => {
    const wf = loadWf();
    const testJob = wf.jobs?.test;
    expect(testJob).toBeDefined();
    const runs = (testJob!.steps ?? [])
      .map(s => s.run)
      .filter(Boolean) as string[];
    expect(runs.some(r => r.trim().startsWith('npm ci'))).toBe(true);
    expect(runs.some(r => /\bnpm run test\b/.test(r))).toBe(true);
    expect(runs.some(r => /\bnpm run build\b/.test(r))).toBe(true);
  });

  it('has a `publish` job that depends on `test`', () => {
    const wf = loadWf();
    const publishJob = wf.jobs?.publish;
    expect(publishJob).toBeDefined();
    const needs = publishJob!.needs;
    if (Array.isArray(needs)) {
      expect(needs).toContain('test');
    }
    else {
      expect(needs).toBe('test');
    }
  });

  it('publish job sets up Node against the GH Packages registry under @arionhardison', () => {
    const wf = loadWf();
    const publishJob = wf.jobs?.publish;
    const setupNode = (publishJob!.steps ?? []).find(
      s => typeof s.uses === 'string' && s.uses.startsWith('actions/setup-node@v4'),
    );
    expect(setupNode, 'expected actions/setup-node@v4 step in publish job').toBeDefined();
    expect(setupNode!.with?.['registry-url']).toBe('https://npm.pkg.github.com');
    expect(setupNode!.with?.scope).toBe('@arionhardison');
  });

  it('publish job runs `npm publish` with NODE_AUTH_TOKEN from GITHUB_TOKEN', () => {
    const wf = loadWf();
    const publishJob = wf.jobs?.publish;
    const publishStep = (publishJob!.steps ?? []).find(
      s => typeof s.run === 'string' && /\bnpm publish\b/.test(s.run),
    );
    expect(publishStep, 'expected `npm publish` run step in publish job').toBeDefined();
    expect(publishStep!.env?.NODE_AUTH_TOKEN).toBe('${{ secrets.GITHUB_TOKEN }}');
  });
});
