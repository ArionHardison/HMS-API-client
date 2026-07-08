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
import {
  BaseApiClient,
  type ApiClientConfig,
  type ApiRequestOptions,
} from './api-client';
import {
  operationIndex,
  type GeneratedOperationId,
  type OperationMeta,
} from './generated/operation-index';
import type {
  HasNoRequiredInput,
  OperationId,
  Request as OpRequest,
  Response as OpResponse,
} from './typed-contract';

/**
 * The method signature for one operation. When the operation needs no input
 * (no body, no path params) the `req` argument is optional.
 */
export type TypedOperationMethod<E extends OperationId> =
  HasNoRequiredInput<E> extends true
    ? (req?: OpRequest<E>, opts?: ApiRequestOptions) => Promise<OpResponse<E>>
    : (req: OpRequest<E>, opts?: ApiRequestOptions) => Promise<OpResponse<E>>;

/** The full operationId-keyed method map exposed at `client.ops`. */
export type TypedOperations = {
  [E in OperationId]: TypedOperationMethod<E>;
};

/** Shape of a `Request<E>` at runtime (all parts optional for dispatch). */
interface RuntimeRequest {
  body?: unknown;
  path?: Record<string, string | number>;
  query?: Record<string, unknown>;
}

export class TypedApiClient extends BaseApiClient {
  /** One typed method per operationId. Built once at construction. */
  readonly ops: TypedOperations;

  constructor(config: ApiClientConfig = {}) {
    super(config);
    const ops = {} as Record<string, unknown>;
    for (const id of Object.keys(operationIndex) as GeneratedOperationId[]) {
      ops[id] = (req?: RuntimeRequest, opts?: ApiRequestOptions) =>
        this.call(id as OperationId, req as never, opts);
    }
    this.ops = ops as TypedOperations;
  }

  /**
   * Generic, strongly-typed dispatch for a single operation. Prefer the
   * per-operation methods on `client.ops`; this is the escape hatch that
   * powers them.
   */
  async call<E extends OperationId>(
    id: E,
    req?: OpRequest<E>,
    opts?: ApiRequestOptions,
  ): Promise<OpResponse<E>> {
    // Widen to `OperationMeta` so `method` is `string` (the const literal
    // union would make the `default` branch unreachable / `never`).
    const meta: OperationMeta | undefined = operationIndex[id as GeneratedOperationId];
    if (!meta) {
      throw new Error(`Unknown operationId: ${String(id)}`);
    }
    const r = (req ?? {}) as RuntimeRequest;
    const endpoint = buildEndpoint(meta.path, r.path, r.query);

    let parsed: unknown;
    switch (meta.method) {
      case 'GET':
        parsed = await this.get<unknown>(endpoint, undefined, opts);
        break;
      case 'DELETE':
        parsed = await this.delete<unknown>(endpoint, opts);
        break;
      case 'POST':
        parsed = await this.post<unknown>(endpoint, r.body, opts);
        break;
      case 'PUT':
        parsed = await this.put<unknown>(endpoint, r.body, opts);
        break;
      case 'PATCH':
        parsed = await this.patch<unknown>(endpoint, r.body, opts);
        break;
      default:
        // HEAD / OPTIONS and any future verb.
        parsed = await this.request<unknown>(endpoint, { method: meta.method }, opts);
    }
    return parsed as OpResponse<E>;
  }
}

/**
 * Substitute `{name}` placeholders in a URL template from `path`, then append
 * a query string from `query`. Path values are URL-encoded; a missing path
 * value is a programmer error and throws.
 */
function buildEndpoint(
  template: string,
  path?: Record<string, string | number>,
  query?: Record<string, unknown>,
): string {
  let endpoint = template.replace(/\{([^}]+)\}/g, (_m, name: string) => {
    const value = path?.[name];
    if (value === undefined || value === null) {
      throw new Error(`Missing path parameter "${name}" for "${template}"`);
    }
    return encodeURIComponent(String(value));
  });

  if (query) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        for (const v of value) search.append(key, String(v));
      }
      else {
        search.append(key, String(value));
      }
    }
    const qs = search.toString();
    if (qs) endpoint += (endpoint.includes('?') ? '&' : '?') + qs;
  }
  return endpoint;
}

/** Convenience factory mirroring `createApiClient`. */
export function createTypedApiClient(config: ApiClientConfig = {}): TypedApiClient {
  return new TypedApiClient(config);
}
