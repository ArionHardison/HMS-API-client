/**
 * `Modules/Application` API client.
 *
 * Covers the 9 endpoints documented in `sdk/spec/endpoints.json` with
 * `module === "Modules/Application"`:
 *
 *   - 5 CRUD endpoints (`application.{index,store,show,update,destroy}`)
 *   - 1 lifecycle endpoint (`POST /api/application/submit`)
 *   - 2 protocol-run reads (`run-global/{application}/{task}`,
 *     `run/{application}/{chain}`) — raw `{ data, chain }` shape, no
 *     Resource wrapper
 *   - 1 protocol-integration listing (`/api/protocol/application/all`)
 *
 * Class: `ApplicationModuleApiClient`. Auth: every route is `auth:api`.
 */
import { BaseApiClient } from '../api-client';
import type { ApiRequestOptions, ApiResponse } from '../api-client';
import type { ApplicationChainId, ApplicationId, ApplicationResource, ApplicationRunResource, ApplicationStoreInput, ApplicationSubmitInput, ApplicationSubmitResource, ApplicationTaskId, ApplicationUpdateInput } from '../types/modules-application';
/**
 * Public client over the `/api/application/*` and `/api/protocol/application/*`
 * surfaces. Subclasses `BaseApiClient` for auth / `X-Domain` / `_method` /
 * `ApiError` handling.
 */
export declare class ApplicationModuleApiClient extends BaseApiClient {
    /** GET `/api/application`. (`application.index`) */
    list(opts?: ApiRequestOptions): Promise<ApiResponse<ApplicationResource[]>>;
    /** POST `/api/application`. (`application.store`) */
    create(body: ApplicationStoreInput, opts?: ApiRequestOptions): Promise<ApiResponse<ApplicationResource>>;
    /** GET `/api/application/{application}`. (`application.show`) */
    show(application: ApplicationId, opts?: ApiRequestOptions): Promise<ApiResponse<ApplicationResource>>;
    /** PUT `/api/application/{application}` — sent as POST + `?_method=PUT`. (`application.update`) */
    update(application: ApplicationId, body: ApplicationUpdateInput, opts?: ApiRequestOptions): Promise<ApiResponse<ApplicationResource>>;
    /** DELETE `/api/application/{application}`. (`application.destroy`) */
    destroy(application: ApplicationId, opts?: ApiRequestOptions): Promise<ApiResponse<ApplicationResource>>;
    /** POST `/api/application/submit`. (`post.api.application.submit`) */
    submit(body: ApplicationSubmitInput, opts?: ApiRequestOptions): Promise<ApiResponse<ApplicationSubmitResource>>;
    /** GET `/api/application/run-global/{application}/{task}`. (`get.api.application.run-global.item.item`) */
    runGlobal(application: ApplicationId, task: ApplicationTaskId, opts?: ApiRequestOptions): Promise<ApiResponse<ApplicationRunResource>>;
    /** GET `/api/application/run/{application}/{chain}`. (`get.api.application.run.item.item`) */
    run(application: ApplicationId, chain: ApplicationChainId, opts?: ApiRequestOptions): Promise<ApiResponse<ApplicationRunResource>>;
    /** GET `/api/protocol/application/all`. (`get.api.protocol.application.all`) */
    listProtocolApplications(opts?: ApiRequestOptions): Promise<ApiResponse<ApplicationResource[]>>;
}
//# sourceMappingURL=modules-application-api-client.d.ts.map