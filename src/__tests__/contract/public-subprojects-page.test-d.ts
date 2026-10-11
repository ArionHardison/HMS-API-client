/**
 * Type-level pins for the WS8 'sdk' item (anti-bulk-exfiltration plan C10;
 * WS4 #5959 Review #3 / Consumers):
 *
 *   - `MiscCoreApiClient.listPublicSubprojects()` returns the PAGINATED
 *     envelope `{ data, meta: { total, page, current_page, per_page,
 *     last_page, truncated } }` — never the `{ success, message, data }`
 *     wrapper the wire does not carry — and takes an OPTIONAL `{ page,
 *     per_page }` query so the zero-argument call keeps compiling.
 *   - `ApiError.retryAfter` is a typed `number | null` (seconds) so a caller
 *     can back off a 429 without re-reading headers.
 *
 * Runs under `tsc --noEmit` via `tsconfig.typecheck.json` / `npm run
 * types:test-d` (the SRE lock). Every assertion is a COMPILE-TIME assertion.
 */
import { expectTypeOf } from 'vitest';
import type { MiscCoreApiClient } from '../../api/misc-core-api-client';
import type { ApiError, RateLimitInfo } from '../../api/error-handling';
import type {
  PublicSubprojectListItem,
  PublicSubprojectsPage,
  PublicSubprojectsPageMeta,
  PublicSubprojectsQuery,
} from '../../types/misc-core';

// The call shape: optional query, so `listPublicSubprojects()` still compiles.
expectTypeOf<Parameters<MiscCoreApiClient['listPublicSubprojects']>>().toEqualTypeOf<[query?: PublicSubprojectsQuery]>();
expectTypeOf<PublicSubprojectsQuery>().toEqualTypeOf<{ page?: number; per_page?: number }>();

// The return: the paginator, typed; no generic wrapper fields.
expectTypeOf<ReturnType<MiscCoreApiClient['listPublicSubprojects']>>().toEqualTypeOf<Promise<PublicSubprojectsPage>>();
expectTypeOf<PublicSubprojectsPage>().toHaveProperty('data');
expectTypeOf<PublicSubprojectsPage>().toHaveProperty('meta');
expectTypeOf<PublicSubprojectsPage>().not.toHaveProperty('success');
expectTypeOf<PublicSubprojectsPage>().not.toHaveProperty('message');
expectTypeOf<PublicSubprojectsPage['data']>().toEqualTypeOf<PublicSubprojectListItem[]>();

// meta — the six fields the api documents, with their wire types.
expectTypeOf<PublicSubprojectsPageMeta>().toEqualTypeOf<{
  total: number;
  page: number;
  current_page: number;
  per_page: number;
  last_page: number;
  truncated: boolean;
}>();

// A row — SubprojectsResource's nullable columns stay nullable.
expectTypeOf<PublicSubprojectListItem['id']>().toEqualTypeOf<number>();
expectTypeOf<PublicSubprojectListItem['slug']>().toEqualTypeOf<string | null>();
expectTypeOf<PublicSubprojectListItem['latest_team_members']>().toEqualTypeOf<string[] | null>();

// The 429 contract on the thrown error.
expectTypeOf<ApiError['retryAfter']>().toEqualTypeOf<number | null>();
expectTypeOf<ApiError['rateLimit']>().toEqualTypeOf<RateLimitInfo | undefined>();
expectTypeOf<ApiError['isRateLimitError']>().returns.toEqualTypeOf<boolean>();
expectTypeOf<RateLimitInfo['retryAfter']>().toEqualTypeOf<number | null>();
