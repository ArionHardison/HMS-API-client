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
import { BaseApiClient, } from './api-client';
import { operationIndex, } from './generated/operation-index';
export class TypedApiClient extends BaseApiClient {
    constructor(config = {}) {
        super(config);
        const ops = {};
        for (const id of Object.keys(operationIndex)) {
            ops[id] = (req, opts) => this.call(id, req, opts);
        }
        this.ops = ops;
    }
    /**
     * Generic, strongly-typed dispatch for a single operation. Prefer the
     * per-operation methods on `client.ops`; this is the escape hatch that
     * powers them.
     */
    async call(id, req, opts) {
        // Widen to `OperationMeta` so `method` is `string` (the const literal
        // union would make the `default` branch unreachable / `never`).
        const meta = operationIndex[id];
        if (!meta) {
            throw new Error(`Unknown operationId: ${String(id)}`);
        }
        const r = (req ?? {});
        const endpoint = buildEndpoint(meta.path, r.path, r.query);
        let parsed;
        switch (meta.method) {
            case 'GET':
                parsed = await this.get(endpoint, undefined, opts);
                break;
            case 'DELETE':
                parsed = await this.delete(endpoint, opts);
                break;
            case 'POST':
                parsed = await this.post(endpoint, r.body, opts);
                break;
            case 'PUT':
                parsed = await this.put(endpoint, r.body, opts);
                break;
            case 'PATCH':
                parsed = await this.patch(endpoint, r.body, opts);
                break;
            default:
                // HEAD / OPTIONS and any future verb.
                parsed = await this.request(endpoint, { method: meta.method }, opts);
        }
        return parsed;
    }
}
/**
 * Substitute `{name}` placeholders in a URL template from `path`, then append
 * a query string from `query`. Path values are URL-encoded; a missing path
 * value is a programmer error and throws.
 */
function buildEndpoint(template, path, query) {
    let endpoint = template.replace(/\{([^}]+)\}/g, (_m, name) => {
        const value = path?.[name];
        if (value === undefined || value === null) {
            throw new Error(`Missing path parameter "${name}" for "${template}"`);
        }
        return encodeURIComponent(String(value));
    });
    if (query) {
        const search = new URLSearchParams();
        for (const [key, value] of Object.entries(query)) {
            if (value === undefined || value === null)
                continue;
            if (Array.isArray(value)) {
                for (const v of value)
                    search.append(key, String(v));
            }
            else {
                search.append(key, String(value));
            }
        }
        const qs = search.toString();
        if (qs)
            endpoint += (endpoint.includes('?') ? '&' : '?') + qs;
    }
    return endpoint;
}
/** Convenience factory mirroring `createApiClient`. */
export function createTypedApiClient(config = {}) {
    return new TypedApiClient(config);
}
//# sourceMappingURL=typed-client.js.map