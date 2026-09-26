/**
 * Type-level proof for the SRE typed contract.
 *
 * These assertions run under `tsc --noEmit` (see `tsconfig.typecheck.json` /
 * `npm run types:test-d`). Every `expectTypeOf(...).toEqualTypeOf<...>()`
 * below is a COMPILE-TIME assertion — if `Request<E>` / `Response<E>` ever
 * degrade to `any` / `unknown` / `never`, or drift from the generated
 * `operations` shape, this file fails to type-check.
 *
 * We deliberately cover the three structural cases:
 *   1. path-param GET (no body)      → `activity-location.show`
 *   2. body POST (no path)           → `activity-location.store`
 *   3. param-less GET (list)         → `activity-location.index`
 */
import { assertType, expectTypeOf } from 'vitest';
import type { components } from '../../generated/api-types';
import type { Request, Response } from '../../typed-contract';
import { TypedApiClient } from '../../typed-client';

// --- 1. path-param GET -------------------------------------------------------
// Request carries a required `path`, no `body`.
expectTypeOf<Request<'activity-location.show'>>().toEqualTypeOf<{
  path: { activityLocation: number };
}>();
// Response is the concrete 2xx JSON payload (not `any`/`unknown`).
expectTypeOf<Response<'activity-location.show'>>().toEqualTypeOf<{
  data: components['schemas']['ActivityLocationResource'];
}>();

// --- 2. body POST ------------------------------------------------------------
expectTypeOf<Request<'activity-location.store'>>().toEqualTypeOf<{
  body: components['schemas']['CreateLocationRequest'];
}>();
expectTypeOf<Response<'activity-location.store'>>().toEqualTypeOf<{
  data: components['schemas']['ActivityLocationResource'];
}>();

// --- 3. param-less list GET --------------------------------------------------
// No required inputs → empty object.
expectTypeOf<Request<'activity-location.index'>>().toEqualTypeOf<{}>();
expectTypeOf<Response<'activity-location.index'>>().toEqualTypeOf<{
  data: components['schemas']['ActivityLocationResource'][];
}>();

// --- Client method signatures are concrete ----------------------------------
declare const client: TypedApiClient;

// Return type is the typed Response, not `any`.
expectTypeOf(client.ops['activity-location.show']).returns.resolves.toEqualTypeOf<
  Response<'activity-location.show'>
>();

// A path-param op REQUIRES `path` — omitting it is a compile error.
// @ts-expect-error — `path` is required for this operation.
void client.ops['activity-location.show']();

// A body op REQUIRES `body` of the right type — wrong shape is a compile error.
// @ts-expect-error — `body` must be a CreateLocationRequest, not a number.
void client.ops['activity-location.store']({ body: 123 });

// A param-less op may be called with no argument.
void client.ops['activity-location.index']();

// The generic `call` escape hatch returns the typed Response too.
assertType<Promise<Response<'activity-location.index'>>>(
  client.call('activity-location.index'),
);
