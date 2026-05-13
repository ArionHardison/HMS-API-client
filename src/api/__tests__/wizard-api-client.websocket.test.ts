/**
 * WizardApiClient — WebSocket auto-init contract.
 *
 * The SDK is consumed in multi-tenant frontends where most tenant
 * subdomains (codify.<tld>, codify.<city>, agency apex hosts) do NOT
 * have a Cloudflare/Nginx route that terminates a WebSocket to
 * `/ws/jobs`. Auto-opening that socket from the WizardApiClient
 * constructor caused two production regressions:
 *
 *   1. Every page load (and every 5 s reconnect from `onclose`)
 *      printed
 *        WebSocket connection to 'wss://<tenant>/ws/jobs' failed
 *      in the user's console — noisy and signal-poisoning.
 *   2. The eager open burned a TCP+TLS handshake per page on hosts
 *      that have no consumer of the resulting events anyway. Zero
 *      callers in the consuming frontends register
 *      `subscribeToJobUpdates()` listeners, so the socket carries no
 *      payload that anyone reads.
 *
 * Contract:
 *   - Constructing a WizardApiClient must NEVER open a WebSocket
 *     by itself, even in a browser-shaped environment with a global
 *     `WebSocket` constructor present.
 *   - `initWebSocket()` (called by consumers explicitly when they
 *     register a listener) is the only place the socket is opened.
 *     Verified by the existence of `subscribeToJobUpdates()` /
 *     `subscribeToDealUpdates()` — neither of those is being changed
 *     here; the only thing that changes is the auto-open in the
 *     constructor.
 *
 * Test technique: stub `globalThis.WebSocket` with a vitest spy and
 * assert it is called 0 times during construction.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WizardApiClient } from '../wizard-api-client';

interface StubWebSocketInstance {
  readyState: number;
  onmessage: ((event: { data: string }) => void) | null;
  onclose: (() => void) | null;
  onerror: ((error: unknown) => void) | null;
  close(): void;
}

function makeWebSocketSpy(): {
  ctorSpy: ReturnType<typeof vi.fn>;
  instances: StubWebSocketInstance[];
} {
  const instances: StubWebSocketInstance[] = [];
  const ctorSpy = vi.fn((_url: string): StubWebSocketInstance => {
    const inst: StubWebSocketInstance = {
      readyState: 0,
      onmessage: null,
      onclose: null,
      onerror: null,
      close: () => {
        inst.readyState = 3;
      },
    };
    instances.push(inst);
    return inst;
  });
  return { ctorSpy, instances };
}

describe('WizardApiClient — WebSocket auto-init contract', () => {
  beforeEach(() => {
    // Vitest runs in Node by default, so `window` is undefined and the
    // constructor's `if (typeof window !== 'undefined')` guard would
    // short-circuit the WS init regardless of whether the bug is
    // present. To actually exercise the code path that fires in real
    // browsers, we stub a minimal `window`. The constructor reads
    // `window.location.protocol` + `.hostname` + `.host` inside
    // initWebSocket — those are stubbed too so the buggy path executes.
    vi.stubGlobal('window', {
      location: {
        protocol: 'https:',
        hostname: 'codify.nyc',
        host: 'codify.nyc',
      },
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('does NOT open a WebSocket during construction (regression: tenant hosts without /ws/jobs route)', () => {
    const { ctorSpy } = makeWebSocketSpy();
    vi.stubGlobal('WebSocket', ctorSpy);

    new WizardApiClient({
      baseURL: 'https://api.test.local',
      getToken: () => null,
      getDomain: () => null,
    });

    expect(ctorSpy).toHaveBeenCalledTimes(0);
  });

  it('does NOT trigger the 5 s reconnect timer chain by way of construction', () => {
    const { ctorSpy } = makeWebSocketSpy();
    vi.stubGlobal('WebSocket', ctorSpy);

    new WizardApiClient({
      baseURL: 'https://api.test.local',
      getToken: () => null,
      getDomain: () => null,
    });

    // The legacy bug: constructor opened the socket; the socket's
    // `onerror` fired (no route at tenant /ws/jobs); the resulting
    // `onclose` queued a 5 s `setTimeout(initWebSocket, 5000)` which
    // re-opened the socket forever. Advancing the clock should NOT
    // produce a new WebSocket call when auto-init is correctly off.
    vi.advanceTimersByTime(30_000);

    expect(ctorSpy).toHaveBeenCalledTimes(0);
  });

  it('still constructs successfully and exposes its listener surface (smoke)', () => {
    const { ctorSpy } = makeWebSocketSpy();
    vi.stubGlobal('WebSocket', ctorSpy);

    const client = new WizardApiClient({
      baseURL: 'https://api.test.local',
      getToken: () => null,
      getDomain: () => null,
    });

    expect(client).toBeInstanceOf(WizardApiClient);
    // addJobListener / addDealListener are the explicit opt-in path —
    // their presence proves consumers can still wire up real-time
    // updates when they actually need them (they internally call
    // the now-private initWebSocket lazily).
    expect(typeof (client as unknown as { addJobListener?: unknown }).addJobListener).toBe('function');
    expect(typeof (client as unknown as { addDealListener?: unknown }).addDealListener).toBe('function');
  });
});
