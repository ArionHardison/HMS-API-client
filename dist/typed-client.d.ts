/**
 * Typed client — the operationId-keyed, strictly-typed façade over
 * `BaseApiClient`.
 *
 * The generated `operations` map (compile time) plus `operationIndex`
 * (runtime, `src/generated/operation-index.ts`) together let us expose ONE
 * method per `operationId`, where:
 *
 *   - the argument is `Request<E>`  (typed body + path + query), and
 *   - the return is `Promise<Response<E>>`  (the typed 2xx JSON payload).
 *
 * Methods live on `client.ops` — e.g.
 *
 * ```ts
 * const client = new TypedApiClient({ getDomain: () => 'phm.ai' });
 * const res = await client.ops['activity-location.show']({ path: { activity_location: '7' } });
 * //    ^ Response<'activity-location.show'>
 * ```
 *
 * or via the generic escape hatch `client.call(id, req, opts)`.
 *
 * The class extends `BaseApiClient` so it inherits the entire wire contract
 * (auth/X-Domain headers, PUT/PATCH override, multipart, 401/422 callbacks,
 * baseURL resolution) locked by the contract suite — the typed layer only
 * adds URL templating + static types on top.
 */
import { BaseApiClient, type ApiClientConfig, type ApiRequestOptions } from './api-client';
import type { HasNoRequiredInput, OperationId, Request as OpRequest, Response as OpResponse } from './typed-contract';
/**
 * The method signature for one operation. When the operation needs no input
 * (no body, no path params) the `req` argument is optional.
 */
export type TypedOperationMethod<E extends OperationId> = HasNoRequiredInput<E> extends true ? (req?: OpRequest<E>, opts?: ApiRequestOptions) => Promise<OpResponse<E>> : (req: OpRequest<E>, opts?: ApiRequestOptions) => Promise<OpResponse<E>>;
/** The full operationId-keyed method map exposed at `client.ops`. */
export type TypedOperations = {
    [E in OperationId]: TypedOperationMethod<E>;
};
export declare class TypedApiClient extends BaseApiClient {
    /** One typed method per operationId. Built once at construction. */
    readonly ops: TypedOperations;
    constructor(config?: ApiClientConfig);
    /**
     * Generic, strongly-typed dispatch for a single operation. Prefer the
     * per-operation methods on `client.ops`; this is the escape hatch that
     * powers them.
     */
    call<E extends OperationId>(id: E, req?: OpRequest<E>, opts?: ApiRequestOptions): Promise<OpResponse<E>>;
}
/** Convenience factory mirroring `createApiClient`. */
export declare function createTypedApiClient(config?: ApiClientConfig): TypedApiClient;
//# sourceMappingURL=typed-client.d.ts.map