/**
 * Types for `RlhfApiClient` — the CI-RLHF peer-service proxy.
 *
 * Source of truth: `Modules/RLHF/Routes/api.php` + the three proxy
 * controllers in `app/Http/Controllers/RLHF/`. Every controller forwards
 * the request body verbatim to the upstream Gradescope fork and surfaces the
 * upstream JSON body + status code unchanged. There is no inner-envelope
 * validation in api/ (it happens upstream), so request/response bodies are
 * typed loosely.
 */

/** Free-form submission envelope forwarded to upstream `/api/mobile/v1/submissions`. */
export type RlhfSubmissionRequest = Record<string, unknown>;

/** Free-form grade envelope forwarded to upstream `.../grades`. */
export type RlhfGradeRequest = Record<string, unknown>;

/** Upstream-shaped body returned by every proxy endpoint (passed through verbatim). */
export type RlhfProxyResponse = Record<string, unknown>;
