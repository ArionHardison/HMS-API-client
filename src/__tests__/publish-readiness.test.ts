/**
 * Publish-readiness contract tests for @arionhardison/wizard-api-client.
 *
 * These assert that package.json is shaped for GitHub Packages publishing
 * and — critically — that every bare-module import in the built `dist/`
 * is satisfied by `dependencies` ∪ `peerDependencies` ∪ Node builtins.
 *
 * Phase: SDK_PUBLISH_PLAN.md → S1.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { builtinModules } from 'node:module';

const sdkRoot = resolve(__dirname, '../..');
const pkg = JSON.parse(
  readFileSync(resolve(sdkRoot, 'package.json'), 'utf8'),
) as Record<string, any>;

describe('package.json — publish readiness', () => {
  it('has the scoped name @arionhardison/wizard-api-client', () => {
    expect(pkg.name).toBe('@arionhardison/wizard-api-client');
  });

  it('declares a published semver version in the 1.x line', () => {
    // Used to pin 1.1.5 — the first GH Packages publish. The pin
    // turned into a regression trip-wire every time the version
    // bumped, so it's loosened to "a valid 1.x semver" instead. The
    // git tag that drives the publish workflow is the source of truth
    // for what gets released; this assertion just guards against the
    // version field being deleted or set to a non-semver string.
    expect(pkg.version).toMatch(/^1\.\d+\.\d+(-[\w.]+)?$/);
  });

  it('declares axios as a runtime dependency in the ^1.x range', () => {
    expect(pkg.dependencies).toBeDefined();
    expect(typeof pkg.dependencies.axios).toBe('string');
    expect(pkg.dependencies.axios).toMatch(/^\^1\./);
  });

  it('declares vue as a peer dep allowing ^3.4', () => {
    expect(pkg.peerDependencies).toBeDefined();
    const range: string = pkg.peerDependencies.vue;
    expect(typeof range).toBe('string');
    // Must permit ^3.4 (loose check — must reference a 3.x major)
    expect(range).toMatch(/3\.\d/);
  });

  it('declares pinia as a peer dep allowing both ^2 and ^3', () => {
    const range: string = pkg.peerDependencies.pinia;
    expect(typeof range).toBe('string');
    expect(range).toMatch(/2\./);
    expect(range).toMatch(/3\./);
  });

  it('declares vue-router as a peer dep allowing ^4.2', () => {
    const range: string = pkg.peerDependencies['vue-router'];
    expect(typeof range).toBe('string');
    expect(range).toMatch(/4\.\d/);
  });

  it('points repository.url at ArionHardison/HMS-API-client', () => {
    expect(pkg.repository?.url).toBe(
      'https://github.com/ArionHardison/HMS-API-client.git',
    );
  });

  it('publishConfig.registry targets npmjs.org (public anonymous install)', () => {
    // History: this used to assert GitHub Packages
    // (`https://npm.pkg.github.com`). It was migrated to npmjs.org in
    // commit 03e9791 ("ops: publish to npmjs.org (public) instead of
    // GH Packages — v1.2.2") so consumers (Vercel projects, fresh
    // clones) wouldn't need a `_authToken` env var to install. The
    // CLAUDE.md "no NPM_TOKEN env var" rule depends on staying on
    // npmjs.org. The trailing slash matches Vercel's npmrc renderer
    // and `npm config get registry` default formatting.
    expect(pkg.publishConfig?.registry).toBe('https://registry.npmjs.org/');
  });

  it('publishConfig.access is public', () => {
    expect(pkg.publishConfig?.access).toBe('public');
  });

  it('files array contains dist/**/* and README.md', () => {
    expect(Array.isArray(pkg.files)).toBe(true);
    expect(pkg.files).toContain('dist/**/*');
    expect(pkg.files).toContain('README.md');
  });
});

describe('dist/ — no-missing-deps gate', () => {
  /** Recursively walk a directory and return file paths matching the predicate. */
  function walk(dir: string, predicate: (f: string) => boolean): string[] {
    const out: string[] = [];
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const full = join(dir, entry);
      let st;
      try {
        st = statSync(full);
      }
      catch {
        continue;
      }
      if (st.isDirectory()) {
        out.push(...walk(full, predicate));
      }
      else if (st.isFile() && predicate(full)) {
        out.push(full);
      }
    }
    return out;
  }

  it('every bare-module import in dist/ is declared in deps or peerDeps', () => {
    const distDir = resolve(sdkRoot, 'dist');
    const files = walk(distDir, f => /\.(?:js|cjs|mjs)$/.test(f));
    expect(files.length).toBeGreaterThan(0);

    // Captures `from "x"`, `from 'x'`, `require("x")`, `require('x')`.
    // Plan-mandated regex form: bare module = NOT starting with `.` or `/`.
    // We collect candidates and filter further (drop relative + Vite `@/` alias).
    const importRe = /(?:from|require\s*\()\s*['"]([^'"]+)['"]/g;

    const found = new Set<string>();
    for (const file of files) {
      // Strip block comments before scanning: tsc preserves JSDoc in the
      // emitted .js, and those docstrings can contain example
      // `import … from '@scope/pkg'` snippets that are NOT real imports.
      // Scanning them produced false offenders (e.g. the package importing
      // itself from a usage example in a deprecation-shim docstring).
      const src = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
      let m: RegExpExecArray | null;
      // eslint-disable-next-line no-cond-assign
      while ((m = importRe.exec(src)) !== null) {
        const id = m[1];
        // Skip relative imports.
        if (id.startsWith('./') || id.startsWith('../') || id.startsWith('/')) continue;
        // Skip Vite/webpack `@/...` source-alias (not a real npm scope — leftover
        // from build of example files that never get reached at runtime).
        if (id.startsWith('@/')) continue;
        found.add(id);
      }
    }

    // Normalize to package roots: e.g. `@vueuse/core/something` → `@vueuse/core`,
    // `axios/lib/x` → `axios`. Anything else stays as-is.
    const toPkgRoot = (id: string): string => {
      if (id.startsWith('@')) {
        const parts = id.split('/');
        return parts.slice(0, 2).join('/'); // @scope/name
      }
      return id.split('/')[0];
    };

    const builtins = new Set([
      ...builtinModules,
      ...builtinModules.map(b => `node:${b}`),
    ]);

    const declared = new Set<string>([
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
      ...Object.keys(pkg.optionalDependencies ?? {}),
    ]);

    const offenders: string[] = [];
    for (const raw of found) {
      const root = toPkgRoot(raw);
      if (builtins.has(root)) continue;
      if (declared.has(root)) continue;
      offenders.push(raw);
    }

    expect(
      offenders,
      `Bare-module imports in dist/ that are not declared in package.json deps or peerDeps:\n  ${offenders
        .map(o => `- ${o}`)
        .join('\n  ')}\nFiles scanned: ${files
        .map(f => relative(sdkRoot, f))
        .join(', ')}`,
    ).toEqual([]);
  });
});
