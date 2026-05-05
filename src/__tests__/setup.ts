/**
 * Global Vitest setup file. Wires the shared MSW server lifecycle.
 *
 * - `beforeAll`: start intercepting fetch. `onUnhandledRequest: 'error'`
 *   forces every test to either declare its endpoint or be flagged.
 * - `afterEach`: drop the per-test handlers (`server.use(...)`) so tests
 *   don't pollute each other.
 * - `afterAll`: stop intercepting so the process can exit cleanly.
 */
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './msw/server';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
