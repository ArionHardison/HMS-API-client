/**
 * Shared MSW server instance for SDK contract / module tests.
 *
 * The server is process-wide. Lifecycle hooks (`listen`, `resetHandlers`,
 * `close`) are wired in `src/__tests__/setup.ts` so individual test files
 * never have to repeat that boilerplate.
 *
 * Tests should register handlers via `server.use(...)` (preferred) or a
 * helper from `src/__tests__/helpers/factories.ts`. Handlers added via
 * `server.use` are reset between tests by the global `afterEach` hook.
 */
import { setupServer } from 'msw/node';

/**
 * The shared mock server. No default handlers — every test (or factory)
 * declares the endpoint it cares about. An unhandled request fails the
 * test thanks to the `onUnhandledRequest: 'error'` setting in `setup.ts`.
 */
export const server = setupServer();
