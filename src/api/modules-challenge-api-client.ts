/**
 * `Modules/Challenge` API client.
 *
 * Covers the 18 endpoints documented in `sdk/spec/endpoints.json` with
 * `module === "Modules/Challenge"`:
 *
 *   - 5 challenge resource endpoints (`challenge.{index,store,show,update,destroy}`)
 *   - 12 challenge-execution endpoints under `/api/challenge/*`:
 *     `finish/{attached}`, `get-challenge/{challenge}/{chain}`,
 *     `get-challenge-tasks/{challenge}/{chain}`,
 *     `get-global-challenge/{challenge}/{task}`,
 *     `get-challenge-global-tasks/{challenge}/{task}`, `get-types`,
 *     `record-video` (multipart!), `run`, `run-global`,
 *     `set-result/{result}`, `start-task`, `task/destroy/{task}`
 *   - 1 protocol-integration listing (`/api/protocol/challenge/all`)
 *
 * Naming policy: SDK methods are camelCase versions of the spec id minus the
 * redundant `challenge.` prefix; bare `*.show/destroy/update` for the resource
 * keep the `Challenge` suffix to avoid collisions with the execution surface.
 *
 * Multipart: `recordVideo` accepts `RecordVideoInput.video` as a `Blob`/`File`,
 * which `BaseApiClient.serializeBody` detects and converts to FormData.
 *
 * Manifest oddity: the route file maps `POST /api/challenge/record-video` to
 * `AttachedChallengeController@recordVideo`, but the controller method is not
 * present in the audited slice (the action body is missing upstream). The SDK
 * still surfaces the endpoint so callers can integrate ahead of the upstream
 * implementation; the multipart contract follows the documented intent
 * (binary upload via `video`).
 *
 * Class is named `ChallengeModuleApiClient` to coexist with the legacy
 * `ChallengeApiClient` in `hms-api-client.ts`.
 */
import { BaseApiClient } from '../api-client';
import type { ApiRequestOptions, ApiResponse } from '../api-client';
import type {
  AttachedChallengeId,
  AttachedChallengeResource,
  ChallengeId,
  ChallengeProtocolIntegrationResource,
  ChallengeResource,
  ChallengeResultId,
  ChallengeResultResource,
  ChallengeTaskOrChainId,
  ChallengeTaskResource,
  CreateChallengeInput,
  RecordVideoInput,
  RunChallengeInput,
  RunChallengeResponse,
  RunGlobalChallengeInput,
  SetChallengeResultInput,
  StartChallengeTaskInput,
} from '../types/modules-challenge';

/**
 * Public client over `/api/challenge*` and `/api/protocol/challenge/all`.
 * Subclasses `BaseApiClient` so it inherits auth / `X-Domain` / Laravel
 * `_method` override / multipart serialization / `ApiError` normalization.
 */
export class ChallengeModuleApiClient extends BaseApiClient {
  // ---------------------------------------------------------------------------
  // challenge resource
  // ---------------------------------------------------------------------------

  /** GET `/api/challenge`. (`challenge.index`) */
  listChallenges(opts?: ApiRequestOptions): Promise<ApiResponse<ChallengeResource[]>> {
    return this.get<ChallengeResource[]>('/api/challenge', undefined, opts);
  }

  /** POST `/api/challenge`. (`challenge.store`) */
  createChallenge(
    body: CreateChallengeInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ChallengeResource>> {
    return this.post<ChallengeResource>('/api/challenge', body, opts);
  }

  /** GET `/api/challenge/{challenge}`. (`challenge.show`) */
  showChallenge(challenge: ChallengeId, opts?: ApiRequestOptions): Promise<ApiResponse<ChallengeResource>> {
    return this.get<ChallengeResource>(`/api/challenge/${encodeURIComponent(String(challenge))}`, undefined, opts);
  }

  /** PUT `/api/challenge/{challenge}`. (`challenge.update`) */
  updateChallenge(
    challenge: ChallengeId,
    body: Partial<CreateChallengeInput>,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ChallengeResource>> {
    return this.put<ChallengeResource>(
      `/api/challenge/${encodeURIComponent(String(challenge))}`,
      body,
      opts,
    );
  }

  /** DELETE `/api/challenge/{challenge}`. (`challenge.destroy`) */
  destroyChallenge(challenge: ChallengeId, opts?: ApiRequestOptions): Promise<ApiResponse<null>> {
    return this.delete<null>(`/api/challenge/${encodeURIComponent(String(challenge))}`, opts);
  }

  // ---------------------------------------------------------------------------
  // execution surface
  // ---------------------------------------------------------------------------

  /** GET `/api/challenge/finish/{attached}`. (`get.api.challenge.finish.item`) */
  finishAttachedChallenge(
    attached: AttachedChallengeId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<AttachedChallengeResource>> {
    return this.get<AttachedChallengeResource>(
      `/api/challenge/finish/${encodeURIComponent(String(attached))}`,
      undefined,
      opts,
    );
  }

  /** GET `/api/challenge/get-challenge-global-tasks/{challenge}/{task}`. */
  getChallengeGlobalTasks(
    challenge: ChallengeId,
    task: ChallengeTaskOrChainId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ChallengeTaskResource[]>> {
    return this.get<ChallengeTaskResource[]>(
      `/api/challenge/get-challenge-global-tasks/${encodeURIComponent(String(challenge))}/${encodeURIComponent(String(task))}`,
      undefined,
      opts,
    );
  }

  /** GET `/api/challenge/get-challenge-tasks/{challenge}/{chain}`. */
  getChallengeTasks(
    challenge: ChallengeId,
    chain: ChallengeTaskOrChainId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ChallengeTaskResource[]>> {
    return this.get<ChallengeTaskResource[]>(
      `/api/challenge/get-challenge-tasks/${encodeURIComponent(String(challenge))}/${encodeURIComponent(String(chain))}`,
      undefined,
      opts,
    );
  }

  /** GET `/api/challenge/get-challenge/{challenge}/{chain}`. */
  getChallenge(
    challenge: ChallengeId,
    chain: ChallengeTaskOrChainId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ChallengeResource>> {
    return this.get<ChallengeResource>(
      `/api/challenge/get-challenge/${encodeURIComponent(String(challenge))}/${encodeURIComponent(String(chain))}`,
      undefined,
      opts,
    );
  }

  /** GET `/api/challenge/get-global-challenge/{challenge}/{task}`. */
  getGlobalChallenge(
    challenge: ChallengeId,
    task: ChallengeTaskOrChainId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ChallengeResource>> {
    return this.get<ChallengeResource>(
      `/api/challenge/get-global-challenge/${encodeURIComponent(String(challenge))}/${encodeURIComponent(String(task))}`,
      undefined,
      opts,
    );
  }

  /** GET `/api/challenge/get-types`. (`get.api.challenge.get-types`) */
  getChallengeTypes(opts?: ApiRequestOptions): Promise<ApiResponse<string[]>> {
    return this.get<string[]>('/api/challenge/get-types', undefined, opts);
  }

  /**
   * POST `/api/challenge/record-video` — multipart upload.
   *
   * The `BaseApiClient.serializeBody` helper detects the `Blob`/`File`
   * payload and switches the request to `multipart/form-data` with bracket-
   * notation for nested fields (Laravel convention).
   */
  recordVideo(body: RecordVideoInput, opts?: ApiRequestOptions): Promise<ApiResponse<unknown>> {
    return this.post<unknown>('/api/challenge/record-video', body, opts);
  }

  /** POST `/api/challenge/run`. (`post.api.challenge.run`) */
  runChallenge(
    body: RunChallengeInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<RunChallengeResponse>> {
    return this.post<RunChallengeResponse>('/api/challenge/run', body, opts);
  }

  /** POST `/api/challenge/run-global`. (`post.api.challenge.run-global`) */
  runGlobalChallenge(
    body: RunGlobalChallengeInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<RunChallengeResponse>> {
    return this.post<RunChallengeResponse>('/api/challenge/run-global', body, opts);
  }

  /** POST `/api/challenge/set-result/{result}`. (`post.api.challenge.set-result.item`) */
  setChallengeResult(
    result: ChallengeResultId,
    body: SetChallengeResultInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ChallengeResultResource>> {
    return this.post<ChallengeResultResource>(
      `/api/challenge/set-result/${encodeURIComponent(String(result))}`,
      body,
      opts,
    );
  }

  /** POST `/api/challenge/start-task`. (`post.api.challenge.start-task`) */
  startChallengeTask(
    body: StartChallengeTaskInput,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<RunChallengeResponse>> {
    return this.post<RunChallengeResponse>('/api/challenge/start-task', body, opts);
  }

  /** DELETE `/api/challenge/task/destroy/{task}`. (`delete.api.challenge.task.destroy.item`) */
  destroyChallengeTask(
    task: ChallengeTaskOrChainId,
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<null>> {
    return this.delete<null>(
      `/api/challenge/task/destroy/${encodeURIComponent(String(task))}`,
      opts,
    );
  }

  // ---------------------------------------------------------------------------
  // protocol integration
  // ---------------------------------------------------------------------------

  /** GET `/api/protocol/challenge/all`. (`get.api.protocol.challenge.all`) */
  listProtocolChallenges(
    opts?: ApiRequestOptions,
  ): Promise<ApiResponse<ChallengeProtocolIntegrationResource[]>> {
    return this.get<ChallengeProtocolIntegrationResource[]>('/api/protocol/challenge/all', undefined, opts);
  }
}
