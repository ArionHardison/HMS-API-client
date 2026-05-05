/**
 * Type definitions for `Modules/Workflow`.
 *
 * Structural interfaces only. Mirrors the request shapes captured in
 * `sdk/spec/endpoints.json` (module === "Modules/Workflow").
 *
 * The Codify-pipeline endpoints are PUBLIC (`auth: public` upstream) so
 * callers must pass `{ auth: false }` per call. The protocol-integration
 * listing is the only authed Workflow endpoint.
 */

/** Codify-pipeline session token — opaque, supplied by the client. */
export type CodifyPipelineSessionId = string;

/**
 * `GET /api/workflow/codify-pipeline/check-pipeline/{session}` response.
 * Used as a polling endpoint while the pipeline runs.
 */
export interface CodifyPipelineStateResource {
  status?: unknown;
  step?: unknown;
  result?: unknown;
  [key: string]: unknown;
}

/** `GET /api/workflow/codify-pipeline/stop/{session}` response. */
export interface CodifyPipelineStopResource {
  stopped?: unknown;
  [key: string]: unknown;
}

/** `POST /api/workflow/codify-pipeline/save-response` response. */
export interface CodifyPipelineSaveResponseResource {
  saved?: unknown;
  [key: string]: unknown;
}

/** `GET /api/protocol/workflow/all` — protocol-integration listing. */
export interface WorkflowProtocolIntegrationResource {
  [key: string]: unknown;
}

/**
 * `POST /api/workflow/codify-pipeline/start` body. Mirrors
 * `StartCodifyPipelineRequest` rules:
 *   - problem   sometimes|nullable|required_without:file|string|min:3|max:5000
 *   - file      sometimes (open — File / Blob upload)
 *   - session   required|string|min:5|max:40
 *   - timezone  required|string
 *
 * `file` is a `File`/`Blob` so the BaseApiClient switches to multipart
 * automatically when present.
 */
export interface StartCodifyPipelineInput {
  problem?: string | null;
  file?: Blob | File | null;
  session: CodifyPipelineSessionId;
  timezone: string;
}

/**
 * `POST /api/workflow/codify-pipeline/save-response` body. The server
 * Form Request is null in the spec so the shape is open; in practice the
 * pipeline driver expects at least the session and the user response.
 */
export interface SaveCodifyPipelineResponseInput {
  session: CodifyPipelineSessionId;
  response?: unknown;
  [key: string]: unknown;
}
