/**
 * Base-URL safety helpers.
 *
 * The SDK holds a bearer token and attaches it as `Authorization: Bearer` to
 * every request. Pointing a client at a cleartext `http://` origin would send
 * that token in the clear, so non-local base URLs are required to be `https://`.
 * Local development hosts (localhost, loopback, RFC-1918 LAN, `*.local`) are
 * exempt so dev setups keep working.
 */
/** True for hosts where cleartext http is acceptable (dev/loopback/LAN). */
export declare function isLocalHost(hostname: string): boolean;
/**
 * Throw if `baseURL` is a non-local cleartext `http://` origin. Empty/relative
 * base URLs (same-origin usage) and local hosts are allowed. Malformed URLs are
 * left alone (the HTTP layer will surface its own error).
 */
export declare function assertSecureBaseURL(baseURL: string | undefined | null): void;
//# sourceMappingURL=url-safety.d.ts.map