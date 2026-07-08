/**
 * Typed contract helpers — the SRE enforcement layer over the generated
 * `operations` map (`src/generated/api-types.ts`).
 *
 * openapi-typescript emits one entry per `operationId` shaped as:
 *
 * ```ts
 * operations["some.op"] = {
 *   parameters?: { path?: {...}; query?: {...}; header?: {...} };
 *   requestBody?: { content: { "application/json": Body } };
 *   responses: { 200: { content: { "application/json": Payload } }; 401: ...; };
 * };
 * ```
 *
 * These generics project that raw shape into two ergonomic, strict types the
 * typed client (and every consumer) is keyed on:
 *
 *   - `Request<E>`  — the caller-supplied inputs: `body` (when the op has a
 *     request body), `path` (when the URL has `{params}`), and `query` (when
 *     the op declares query params). The `X-Domain` header is injected by the
 *     client from its `getDomain` config, so it is intentionally NOT part of
 *     `Request`.
 *   - `Response<E>` — the JSON payload of the operation's 2xx success
 *     response.
 *
 * Everything here is compile-time only (no runtime cost) and `strict`-clean:
 * there is no `any` in the public surface.
 */
import type { operations } from './generated/api-types';
/** Union of every operationId in the generated spec. */
export type OperationId = keyof operations;
/** The raw generated shape for one operation. */
type Op<E extends OperationId> = operations[E];
/**
 * `[T] extends [never]` is the standard trick to detect `never` without the
 * union-distribution that a bare `T extends never` would trigger.
 */
type IsNever<T> = [T] extends [never] ? true : false;
/** Flatten an intersection into a single object literal for nicer hovers. */
type Simplify<T> = {
    [K in keyof T]: T[K];
} & {};
/**
 * The `application/json` request body for `E`, or `never` when the operation
 * declares no request body.
 */
export type RequestBody<E extends OperationId> = Op<E> extends {
    requestBody: {
        content: {
            'application/json': infer B;
        };
    };
} ? B : Op<E> extends {
    requestBody?: {
        content: {
            'application/json': infer B;
        };
    };
} ? B : never;
/** The `path` parameters object for `E`, or `never` when there are none. */
export type PathParams<E extends OperationId> = Op<E> extends {
    parameters: {
        path: infer P;
    };
} ? P : Op<E> extends {
    parameters?: {
        path?: infer P;
    };
} ? (IsNever<Exclude<P, undefined>> extends true ? never : Exclude<P, undefined>) : never;
/** The `query` parameters object for `E`, or `never` when there are none. */
export type QueryParams<E extends OperationId> = Op<E> extends {
    parameters: {
        query: infer Q;
    };
} ? Q : Op<E> extends {
    parameters?: {
        query?: infer Q;
    };
} ? (IsNever<Exclude<Q, undefined>> extends true ? never : Exclude<Q, undefined>) : never;
type BodyPart<E extends OperationId> = IsNever<RequestBody<E>> extends true ? {} : {
    body: RequestBody<E>;
};
type PathPart<E extends OperationId> = IsNever<PathParams<E>> extends true ? {} : {
    path: PathParams<E>;
};
type QueryPart<E extends OperationId> = IsNever<QueryParams<E>> extends true ? {} : {
    query?: QueryParams<E>;
};
/**
 * The strongly-typed inputs for operation `E`:
 *   - `body`  present & required iff the op has a request body,
 *   - `path`  present & required iff the URL has path params,
 *   - `query` present & optional iff the op declares query params.
 *
 * An operation with none of the three resolves to `Record<string, never>`
 * (i.e. `{}`) — callers pass no argument.
 */
export type Request<E extends OperationId> = Simplify<BodyPart<E> & PathPart<E> & QueryPart<E>>;
/**
 * True when `Request<E>` has no required members — used by the client to make
 * the request argument optional for parameter-less GETs.
 */
export type HasNoRequiredInput<E extends OperationId> = {} extends Request<E> ? true : false;
/** HTTP status codes treated as success. */
type SuccessStatus = 200 | 201 | 202 | 203 | 204;
/**
 * The `application/json` payload of `E`'s first declared 2xx response, or
 * `unknown` when the success response carries no JSON body (e.g. 204).
 */
export type Response<E extends OperationId> = Op<E> extends {
    responses: infer R;
} ? {
    [S in Extract<keyof R, SuccessStatus>]: R[S] extends {
        content: {
            'application/json': infer C;
        };
    } ? C : never;
}[Extract<keyof R, SuccessStatus>] extends infer Payload ? IsNever<Payload> extends true ? unknown : Payload : unknown : unknown;
export {};
//# sourceMappingURL=typed-contract.d.ts.map