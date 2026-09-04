/**
 * Type-level pin for `FacilitiesThemeSignal` (GET /api/facilities/themes/{theme}/signals).
 *
 * Runs under `tsc --noEmit` via `tsconfig.typecheck.json` / `npm run types:test-d`
 * (the first step of the SRE lock, `.github/workflows/sre-contract.yml`). Every
 * assertion is a COMPILE-TIME assertion.
 *
 * Why this file exists: CI-API #5284 (4ca315b60) removed `session_identifier`
 * from every signal row because `pipeline_states.session_identifier` is the
 * pipeline lane's guest BEARER (check-pipeline → deal_guid; POST
 * deal/{guid}/cancel body `{session}`), never drill-down metadata
 * (`Modules/Facilities/Http/Controllers/ThemeSignalsController.php:71`). A type
 * that promises a field the wire no longer carries is exactly the drift the
 * SRE contract exists to catch — so the absence is pinned here, and the
 * integer row id `pipeline_id` (not a bearer anywhere on the api) is pinned as
 * still present so the pin cannot pass by the type collapsing to `{}`.
 */
import { expectTypeOf } from 'vitest';
import type { FacilitiesThemeSignal } from '../../types/facilities';

// The bearer is gone from the wire (CI-API #5284) — it must be gone from the type.
expectTypeOf<FacilitiesThemeSignal>().not.toHaveProperty('session_identifier');

// The integer row id stays (ThemeSignalsController.php:79).
expectTypeOf<FacilitiesThemeSignal>().toHaveProperty('pipeline_id');
expectTypeOf<FacilitiesThemeSignal['pipeline_id']>().toEqualTypeOf<number>();
