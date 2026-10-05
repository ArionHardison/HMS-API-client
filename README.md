# Five-Step Wizard TypeScript Client

A comprehensive TypeScript client library for the Five-Step Wizard API, providing type-safe access to the wizard endpoints with support for asynchronous processing and real-time updates.

## Features

- ✅ Complete TypeScript definitions for all wizard models and endpoints
- ✅ Support for asynchronous processing with job progress tracking
- ✅ WebSocket-based real-time updates for long-running operations
- ✅ Full versioning and snapshot system for deal objects
- ✅ Built-in authentication and token management
- ✅ Comprehensive error handling
- ✅ Supports browser environments
- ✅ Vue integration with example components

## Installation

```bash
npm install @wizard/api-client
```

## Quick Start

```typescript
import { wizardApiClient, wizardSteps } from '@wizard/api-client';

// Start a new wizard
async function startWizard(problem: string, category: string) {
  try {
    const response = await wizardApiClient.startWizard({
      problem,
      category,
      metadata: {
        user_role: 'patient',
        session_id: 'abc123'
      }
    });
    
    if (response.data.success) {
      console.log('Wizard started successfully!');
      console.log('Deal ID:', response.data.data.deal.id);
      
      // Check if processing is asynchronous
      if (response.data.data.is_async) {
        console.log('Job ID:', response.data.data.job_id);
        
        // Poll for job completion
        const jobStatus = await wizardApiClient.pollJobStatus(response.data.data.job_id);
        console.log('Job completed:', jobStatus);
        
        // Get the updated deal
        const dealResponse = await wizardApiClient.getDeal(response.data.data.deal.id);
        console.log('Updated deal:', dealResponse.data.data);
      } else {
        console.log('Deal:', response.data.data.deal);
      }
    } else {
      console.error('Failed to start wizard:', response.data.message);
    }
  } catch (error) {
    console.error('API error:', error);
  }
}
```

## Step Processing with Type-Safe Handlers

The client provides type-safe step handlers for each wizard step:

```typescript
import { wizardSteps, WizardStep } from '@wizard/api-client';

// Process Step 1: Define Problem
async function processStep1(dealId: string, problem: string, category: string) {
  try {
    // Monitor progress
    const deal = await wizardSteps.defineProblems.process(
      dealId,
      {
        problem,
        category,
        sub_category: 'Autoimmune'
      },
      (progress) => {
        console.log(`Processing: ${progress}%`);
      }
    );
    
    console.log('Step 1 completed:', deal);
    return deal;
  } catch (error) {
    console.error('Error processing step 1:', error);
  }
}

// Process Step 2: Codify Solution
async function processStep2(dealId: string, solutions: any[]) {
  try {
    const deal = await wizardSteps.codifySolution.process(
      dealId,
      {
        solution_options: solutions,
        selected_solution: 0
      },
      (progress) => {
        console.log(`Processing: ${progress}%`);
      }
    );
    
    console.log('Step 2 completed:', deal);
    return deal;
  } catch (error) {
    console.error('Error processing step 2:', error);
  }
}
```

## Real-Time Updates with WebSockets

The client supports WebSocket-based real-time updates for job progress:

```typescript
// Add a listener for job updates
const removeListener = wizardApiClient.addJobListener(
  jobId,
  (jobStatus) => {
    console.log('Job progress:', jobStatus.progress);
    console.log('Job status:', jobStatus.status);
    console.log('Job message:', jobStatus.message);
    
    if (jobStatus.status === 'completed') {
      console.log('Job completed successfully!');
    } else if (jobStatus.status === 'failed') {
      console.error('Job failed:', jobStatus.error);
    }
  }
);

// Later, remove the listener when no longer needed
removeListener();
```

> **Hosting note.** The job socket opens only when the first listener is
> registered (never at construction) and dials the SAME-ORIGIN
> `wss://<page host>/ws/jobs` (`ws://localhost:6001/ws/jobs` on localhost),
> reconnecting every 5 s on close. Only a host that terminates that path itself
> can serve it; a Vercel-hosted consumer cannot once its `/ws` rewrite to the
> raw origin is deleted (WS8) — there the socket is inert, and today no consumer
> registers a listener. An opt-in `wsURL` with capped reconnects is a follow-up.

## Version Management

The client provides full support for the versioning system:

```typescript
// Get all snapshots for a deal
const snapshotsResponse = await wizardApiClient.getDealSnapshots(dealId);
const snapshots = snapshotsResponse.data.data;

// Get a specific snapshot
const snapshotResponse = await wizardApiClient.getDealSnapshot(dealId, version);
const snapshot = snapshotResponse.data.data;

// Compare two snapshots
const comparisonResponse = await wizardApiClient.compareDealSnapshots(
  dealId,
  baseVersion,
  compareVersion
);
const differences = comparisonResponse.data.data.differences;

// Restore a deal to a specific version
const restoredResponse = await wizardApiClient.restoreDealSnapshot(dealId, version);
const restoredDeal = restoredResponse.data.data;

// Create a new snapshot manually
const newSnapshotResponse = await wizardApiClient.createDealSnapshot(
  dealId,
  "Manual checkpoint before changes"
);
```

## Vue Integration

The client comes with a complete Vue component example:

```typescript
// Import the wizard Vue component
import WizardExample from '@wizard/api-client/examples/wizard-example.vue';

// Use it in your Vue app
<template>
  <WizardExample />
</template>
```

## Full API Reference

### Wizard API Client Methods

| Method | Description |
|--------|-------------|
| `startWizard(data)` | Start a new wizard session |
| `defineProblems(dealId, data)` | Process Step 1: Define Problem |
| `codifySolution(dealId, data)` | Process Step 2: Codify Solution |
| `setupProgram(dealId, data)` | Process Step 3: Setup Program |
| `executeProgram(dealId, data)` | Process Step 4: Execute Program |
| `verifyOutcome(dealId, data)` | Process Step 5: Verify Outcome |
| `getJobStatus(jobId)` | Get the status of a job |
| `pollJobStatus(jobId, interval, timeout)` | Poll for job completion |
| `getDeal(dealId)` | Get a deal by ID |
| `getDealSnapshots(dealId)` | Get all snapshots for a deal |
| `getDealSnapshot(dealId, version)` | Get a specific snapshot |
| `compareDealSnapshots(dealId, baseVersion, compareVersion)` | Compare two snapshots |
| `restoreDealSnapshot(dealId, version)` | Restore a deal to a specific version |
| `createDealSnapshot(dealId, comment)` | Create a new snapshot manually |
| `getWizardResponse(dealId)` | Get the complete wizard response |
| `addJobListener(jobId, listener)` | Add a listener for job updates |

### Type-Safe Step Handlers

| Handler | Description |
|---------|-------------|
| `wizardSteps.defineProblems` | Handler for Step 1: Define Problem |
| `wizardSteps.codifySolution` | Handler for Step 2: Codify Solution |
| `wizardSteps.setupProgram` | Handler for Step 3: Setup Program |
| `wizardSteps.executeProgram` | Handler for Step 4: Execute Program |
| `wizardSteps.verifyOutcome` | Handler for Step 5: Verify Outcome |

### Main Data Types

| Type | Description |
|------|-------------|
| `DealData` | Core deal data structure |
| `ProgramData` | Program data structure |
| `ProtocolData` | Protocol data structure |
| `DealSnapshotData` | Deal snapshot data |
| `JobStatusData` | Job status data |
| `StepResultData` | Step processing result |
| `VersionComparisonData` | Snapshot comparison data |

### Enums

| Enum | Description |
|------|-------------|
| `WizardStep` | Wizard step identifiers |
| `FeasibilityRating` | Solution feasibility ratings |
| `PayoutStatus` | Payout status options |
| `JobStatus` | Job processing status |

## Advanced Configuration

You can create custom client instances with specific configurations:

```typescript
import { WizardApiClient } from '@wizard/api-client';

// Create a custom client
const customClient = new WizardApiClient({
  baseURL: 'https://custom-api.example.com/api',
  timeout: 60000, // 60 seconds
  withCredentials: true,
  headers: {
    'X-Custom-Header': 'value'
  }
});
```

## Error Handling

The client provides consistent error handling:

```typescript
try {
  const response = await wizardApiClient.getDeal('non-existent-id');
  // Process successful response
} catch (error) {
  if (error.response) {
    // Server returned an error response
    console.error('API Error:', error.response.data.message);
    
    // Handle validation errors
    if (error.response.status === 422 && error.response.data.errors) {
      Object.entries(error.response.data.errors).forEach(([field, messages]) => {
        console.error(`${field}: ${messages.join(', ')}`);
      });
    }
  } else if (error.request) {
    // Request was made but no response received (network error)
    console.error('Network error: No response received');
  } else {
    // Other errors
    console.error('Error:', error.message);
  }
}
```

### Rate limits (429) and retries

The api refuses over-limit traffic with `429` + `Retry-After` and the body
`{ message, error: 'rate_limited', scope, limit, window, retry_after }` (a
Redis outage sheds with `503` + `Retry-After` and `error: 'rate_limiter_unavailable'`).
The SDK surfaces the wait as a typed field on the thrown `ApiError` and never
replays a 4xx on its own:

```typescript
import { ApiError, MiscCoreApiClient, isRetryableError } from '@arionhardison/wizard-api-client';

// A Vercel-hosted consumer passes an absolute, Cloudflare-fronted baseURL (no
// trailing /api); the hostname the page is served from is the tenant.
const misc = new MiscCoreApiClient({
  baseURL: 'https://api.project20x.com',
  getDomain: () => window.location.hostname,
});

try {
  const page = await misc.listPublicSubprojects({ page: 2 });
  console.log(page.meta.last_page, page.data.length);
} catch (error) {
  if (error instanceof ApiError && error.isRateLimitError()) {
    // `retryAfter` is in SECONDS (Retry-After header, or the body's retry_after);
    // null when the server sent neither. Schedule the retry yourself — a 429
    // replayed inside the window only extends the refusal.
    const wait = error.retryAfter ?? 30;
    console.warn(`rate limited on ${error.rateLimit?.scope}; retrying in ${wait}s`);
    setTimeout(() => retryLater(), wait * 1000);
  } else if (isRetryableError(error)) {
    // 5xx or a network failure — safe to retry (useApi's `retry` option does this).
  }
}
```

`useApi({ retry, retryDelay })` replays only 5xx and network failures, waiting
the LONGER of its linear ladder (`retryDelay * (n + 1)`) and the server's
`Retry-After` (capped at 120 s — plan C10's cooldown cap), so a `503` shed that
says `Retry-After: 30` is replayed at 30 s, not 1 s; 4xx — 429 included —
surface at once, with `state.retryAfter` set.

> **Packaging note.** `useApi` (and the other Vue 3 composables / Pinia stores
> behind `src/vue3/`) is NOT shipped by the package's root entry today:
> `exports` has only `"."`, `tsconfig.json` builds `src/index.ts` + `src/api/**`
> only, and no consumer imports it (sys / gov / www / app: zero call sites).
> Everything else in this section — `ApiError.retryAfter` / `rateLimit`,
> `isRetryableError`, `listPublicSubprojects({ page })`, the `X-Tenant-Domain`
> header — IS in the built `dist/`. Shipping a `./vue3` subpath is a separate
> packaging change.

## Development

### Building the client

```bash
npm run build
```

### Running tests

```bash
npm test
```

## HMS API Client

This package also includes the HMS API client for accessing other HMS API endpoints:

```typescript
import { hmsApiClient } from '@wizard/api-client';

// Use the HMS API client
const response = await hmsApiClient.auth.login({
  email: 'user@example.com',
  password: 'password123'
});
```

For more information on the HMS API client, see the previous documentation.

## Publishing

This package is published to **GitHub Packages** as `@arionhardison/wizard-api-client`.

### Trigger

Publishes are driven by `.github/workflows/publish.yml` and fire on either:

- A tag push matching `v*.*.*` (the canonical path)
- `workflow_dispatch` — manual ad-hoc rerun via the Actions tab

The workflow's `test` job runs `npm ci`, `npm run generate:types` (the
gitignored `src/generated/api-types.ts` that `build:lib` and the coverage
contract read — a clean runner has to generate it first), `npm run build:lib`,
`npm run test`; the `publish` job then runs `npm publish` (its `prepublishOnly`
rebuilds) against `https://npm.pkg.github.com` using the built-in
`GITHUB_TOKEN` — no extra secrets to configure on the repo. `package.json`'s
`publishConfig.registry` names npmjs.org, but `setup-node`'s `registry-url`
wins in CI, so the effective target is GitHub Packages.

### Cutting a release

```bash
# 1. Bump the version in package.json (semver: patch / minor / major).
#    Edit "version" in package.json directly, or:
npm version patch --no-git-tag-version

# 2. Commit the bump.
git add package.json package-lock.json
git commit -m "release: vX.Y.Z"

# 3. Tag and push.
git tag vX.Y.Z
git push origin main --tags
```

The tag push triggers the workflow; on success the new version appears at
`https://github.com/ArionHardison/HMS-API-client/packages`.

### Vendoring a tarball (how sys consumes the SDK)

HardisonCo/CI-MFE (`sys/`) reads no registry: it pins
`"@arionhardison/wizard-api-client": "file:vendor/arionhardison-wizard-api-client-<version>.tgz"`
with that tarball's integrity in its lockfile. To hand it a release:

```bash
# in this repo, at the release commit (version already bumped)
npm ci
npm run build          # prebuild: rm -rf dist + generate:types; then cjs + esm + vite bundles
npm pack               # → arionhardison-wizard-api-client-<version>.tgz

# in sys/
cp ../HMS-API-client/arionhardison-wizard-api-client-<version>.tgz vendor/
#   point package.json's file: entry at the new name, then refresh the lockfile:
npm install            # `npm ci` against a swapped tarball of the SAME name fails EINTEGRITY
```

Bump the version first: a rebuilt tarball under an old file name collides with
the lockfile's integrity for that name.

### Consuming the package

GitHub Packages requires authenticated reads. Consumers need:

1. An `.npmrc` (project-level or `~/.npmrc`) routing the scope to GH Packages:

   ```ini
   @arionhardison:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NPM_TOKEN}
   ```

2. An `NPM_TOKEN` env var holding a GitHub Personal Access Token (classic)
   with the `read:packages` scope. In CI/CD, inject it via the platform's
   secret store. Inside GitHub Actions in the same org, `secrets.GITHUB_TOKEN`
   is sufficient; for cross-org or Vercel deployments, set `NPM_TOKEN` as a
   project env var.

3. Then:

   ```bash
   npm install @arionhardison/wizard-api-client
   ```

## License

MIT