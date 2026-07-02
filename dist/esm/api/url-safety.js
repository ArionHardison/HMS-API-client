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
export function isLocalHost(hostname) {
    const h = hostname.toLowerCase().replace(/^\[|\]$/g, ''); // strip IPv6 brackets
    if (h === 'localhost' || h === '127.0.0.1' || h === '0.0.0.0' || h === '::1')
        return true;
    if (h.endsWith('.local') || h.endsWith('.localhost'))
        return true;
    // RFC-1918 private ranges (common for LAN dev servers).
    if (/^10\./.test(h))
        return true;
    if (/^192\.168\./.test(h))
        return true;
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(h))
        return true;
    return false;
}
/**
 * Throw if `baseURL` is a non-local cleartext `http://` origin. Empty/relative
 * base URLs (same-origin usage) and local hosts are allowed. Malformed URLs are
 * left alone (the HTTP layer will surface its own error).
 */
export function assertSecureBaseURL(baseURL) {
    if (!baseURL)
        return; // '' / undefined => relative / same-origin
    let url;
    try {
        url = new URL(baseURL);
    }
    catch {
        return; // not an absolute URL; nothing to enforce here
    }
    if (url.protocol === 'http:' && !isLocalHost(url.hostname)) {
        throw new Error(`[wizard-api-client] Refusing to use insecure baseURL "${baseURL}": ` +
            `a bearer token would be sent over cleartext HTTP. Use https:// ` +
            `(local hosts such as localhost/127.0.0.1/*.local are exempt).`);
    }
}
//# sourceMappingURL=url-safety.js.map