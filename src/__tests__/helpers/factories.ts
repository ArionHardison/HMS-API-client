/**
 * Test factory helpers used by the cross-cutting contract suite and by every
 * per-module endpoint test. Two flavors:
 *
 *   1. `mockEndpoint(method, path, handler)` — a thin wrapper over MSW v2's
 *      `http[method]` that returns a handler ready to feed into `server.use`.
 *      The handler can either return a plain object (auto-wrapped in
 *      `HttpResponse.json`) or a full `HttpResponse`.
 *
 *   2. `expect*` assertion helpers — synchronous predicates over the captured
 *      MSW request used inside the handler body. They throw `Error` on a
 *      mismatch so they double as Vitest assertions.
 *
 * Keeping these tiny on purpose: the module agents will lean on them, and
 * the cheaper they are to read, the better.
 */
import { HttpResponse, http, type DefaultBodyType, type HttpHandler } from 'msw';

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options' | 'head';

/**
 * The handler signature MSW exposes — narrowed to the bits we use.
 */
export type EndpointHandler = (info: {
  request: Request;
  params: Record<string, string | readonly string[]>;
}) => Response | Promise<Response> | DefaultBodyType | Promise<DefaultBodyType>;

/**
 * Register an MSW handler for a single endpoint. Returns a handler ready to
 * be passed to `server.use(...)`. The handler may return either a `Response`
 * (in which case it's used as-is) or a JSON-serializable value (wrapped in
 * `HttpResponse.json` with status 200).
 */
export function mockEndpoint(
  method: HttpMethod,
  path: string,
  handler: EndpointHandler,
): HttpHandler {
  // MSW typings for `http[method]` accept (path, resolver, options). We
  // adapt the resolver to allow plain-object returns for ergonomic test
  // bodies.
  const adapted = async (info: any) => {
    const out = await handler(info);
    if (out instanceof Response) return out;
    return HttpResponse.json(out as any);
  };
  // `http` is keyed by method name in MSW v2.
  const fn = (http as unknown as Record<HttpMethod, (...args: any[]) => HttpHandler>)[method];
  if (!fn) throw new Error(`Unsupported HTTP method: ${method}`);
  return fn(path, adapted);
}

/**
 * Assert the captured MSW request carries `Authorization: Bearer <token>`.
 * Throws on mismatch.
 */
export function expectAuthHeader(request: Request, token: string): void {
  const got = request.headers.get('authorization');
  const want = `Bearer ${token}`;
  if (got !== want) {
    throw new Error(`Expected Authorization "${want}", got "${got ?? '<missing>'}".`);
  }
}

/**
 * Assert no `Authorization` header is present.
 */
export function expectNoAuthHeader(request: Request): void {
  const got = request.headers.get('authorization');
  if (got !== null) {
    throw new Error(`Expected no Authorization header, got "${got}".`);
  }
}

/**
 * Assert the captured MSW request carries the given `X-Domain` header.
 */
export function expectDomainHeader(request: Request, domain: string): void {
  const got = request.headers.get('x-domain');
  if (got !== domain) {
    throw new Error(`Expected X-Domain "${domain}", got "${got ?? '<missing>'}".`);
  }
}

/**
 * Assert the captured MSW request carries no `X-Domain` header.
 */
export function expectNoDomainHeader(request: Request): void {
  const got = request.headers.get('x-domain');
  if (got !== null) {
    throw new Error(`Expected no X-Domain header, got "${got}".`);
  }
}

/**
 * Assert the captured MSW request was sent as POST with `?_method=<method>`
 * (Laravel's HTTP verb override convention). Used to check that PUT/PATCH
 * are translated correctly by the SDK.
 */
export function expectMethodOverride(request: Request, method: 'PUT' | 'PATCH'): void {
  if (request.method !== 'POST') {
    throw new Error(`Expected outbound POST for ${method} override, got ${request.method}.`);
  }
  const url = new URL(request.url);
  const got = url.searchParams.get('_method');
  if (got !== method) {
    throw new Error(`Expected ?_method=${method}, got "${got ?? '<missing>'}".`);
  }
}

/**
 * Assert that the captured (multipart) request body contains the given
 * field with the given string value. Reads the request as `formData`.
 */
export async function expectFormDataField(
  request: Request,
  name: string,
  value: string,
): Promise<void> {
  const ctype = request.headers.get('content-type') ?? '';
  if (!/multipart\/form-data/i.test(ctype)) {
    throw new Error(`Expected multipart/form-data Content-Type, got "${ctype}".`);
  }
  const fd = await request.formData();
  const got = fd.get(name);
  if (typeof got !== 'string' || got !== value) {
    throw new Error(`Expected FormData field "${name}"="${value}", got "${String(got)}".`);
  }
}
