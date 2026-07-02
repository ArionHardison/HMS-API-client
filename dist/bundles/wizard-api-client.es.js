import O from "axios";
function J(r) {
  if (!r || typeof r != "object") return !1;
  const e = r;
  return e.isAxiosError === !0 ? !0 : (typeof e.status == "number" && !e.response, !1);
}
class z extends Error {
  /**
   * Create a new ApiError. Accepts either an AxiosError (legacy) or a
   * normalized init object (modern fetch path).
   */
  constructor(e) {
    var s, o, i, p, l, u, g, $, U, w, b, E, y, f, T, N;
    const t = J(e), n = t ? ((o = (s = e.response) == null ? void 0 : s.data) == null ? void 0 : o.message) || e.message || "Unknown API error" : e.message || "Unknown API error";
    if (super(n), this.isApiError = !0, this.name = "ApiError", t) {
      const m = e;
      this.originalError = {
        status: (i = m.response) == null ? void 0 : i.status,
        statusText: (p = m.response) == null ? void 0 : p.statusText,
        url: (l = m.config) == null ? void 0 : l.url,
        method: (u = m.config) == null ? void 0 : u.method,
        data: (g = m.response) == null ? void 0 : g.data
      }, this.status = (($ = m.response) == null ? void 0 : $.status) || 0, this.data = (w = (U = m.response) == null ? void 0 : U.data) == null ? void 0 : w.data;
      const q = (y = (E = (b = m.response) == null ? void 0 : b.data) == null ? void 0 : E.data) == null ? void 0 : y.errors, H = (T = (f = m.response) == null ? void 0 : f.data) == null ? void 0 : T.errors, F = q ?? H;
      ((N = m.response) == null ? void 0 : N.status) === 422 && F && (this.errors = F, this.validationErrors = F);
    } else {
      const m = e;
      this.originalError = m.originalError ?? m, this.status = m.status ?? 0, this.data = m.data, m.validationErrors && (this.errors = m.validationErrors, this.validationErrors = m.validationErrors);
    }
  }
  /**
   * Check if this is a validation error (HTTP 422)
   */
  isValidationError() {
    return this.status === 422 && !!this.errors;
  }
  /**
   * Check if this is an authentication error (HTTP 401)
   */
  isAuthError() {
    return this.status === 401;
  }
  /**
   * Check if this is a forbidden error (HTTP 403)
   */
  isForbiddenError() {
    return this.status === 403;
  }
  /**
   * Check if this is a not found error (HTTP 404)
   */
  isNotFoundError() {
    return this.status === 404;
  }
  /**
   * Check if this is a server error (HTTP 500+)
   */
  isServerError() {
    return this.status >= 500;
  }
  /**
   * Check if this is a locked-resource error (HTTP 423). `app/` uses this
   * to surface "this deal is currently being modified by another user".
   */
  isLockedError() {
    return this.status === 423;
  }
  /**
   * Get all validation errors
   */
  getValidationErrors() {
    return this.errors || {};
  }
  /**
   * Get the first validation error for a specific field
   * @param field - The field name
   */
  getFieldError(e) {
    if (!(!this.errors || !this.errors[e] || !this.errors[e].length))
      return this.errors[e][0];
  }
  /**
   * Get simplified validation errors as a Record of field to first error message
   */
  getSimplifiedValidationErrors() {
    return this.errors ? Object.entries(this.errors).reduce((e, [t, n]) => (n && n.length > 0 && (e[t] = n[0]), e), {}) : {};
  }
  /**
   * Serialization guard: `JSON.stringify(apiError)` and most error reporters
   * will only ever see these safe fields — never `originalError` or any request
   * headers — so an accidental serialize cannot leak the bearer token.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      validationErrors: this.validationErrors
    };
  }
}
function M(r) {
  return r && r.isApiError ? r : r && r.isAxiosError ? new z(r) : new z({
    status: 0,
    message: (r == null ? void 0 : r.message) ?? "Unknown error",
    originalError: r
  });
}
async function Fe(r, e) {
  try {
    return await r();
  } catch (t) {
    const n = M(t);
    throw e && e(n), n;
  }
}
function Le(r) {
  const e = M(r);
  return e.isValidationError() ? e.getSimplifiedValidationErrors() : {};
}
function ze(r) {
  const e = M(r);
  if (e.isAuthError())
    return "Your session has expired. Please log in again.";
  if (e.isForbiddenError())
    return "You do not have permission to perform this action.";
  if (e.isNotFoundError())
    return "The requested resource was not found.";
  if (e.isServerError())
    return "A server error occurred. Please try again later.";
  if (e.isValidationError()) {
    const t = e.getValidationErrors();
    return `Validation errors:
${Object.entries(t).map(([s, o]) => `${s}: ${o.join(", ")}`).join(`
`)}`;
  }
  return e.message;
}
function Q(r) {
  const e = r.toLowerCase().replace(/^\[|\]$/g, "");
  return !!(e === "localhost" || e === "127.0.0.1" || e === "0.0.0.0" || e === "::1" || e.endsWith(".local") || e.endsWith(".localhost") || /^10\./.test(e) || /^192\.168\./.test(e) || /^172\.(1[6-9]|2\d|3[01])\./.test(e));
}
function G(r) {
  if (!r) return;
  let e;
  try {
    e = new URL(r);
  } catch {
    return;
  }
  if (e.protocol === "http:" && !Q(e.hostname))
    throw new Error(
      `[wizard-api-client] Refusing to use insecure baseURL "${r}": a bearer token would be sent over cleartext HTTP. Use https:// (local hosts such as localhost/127.0.0.1/*.local are exempt).`
    );
}
function K() {
  var t;
  const r = globalThis.window, e = (t = r == null ? void 0 : r.location) == null ? void 0 : t.origin;
  return typeof e == "string" && e.length > 0 ? e : "https://api.project20x.com";
}
let c = class {
  constructor(e) {
    G(e.baseURL), this.config = e, this.baseURL = e.baseURL ?? "", this.timeout = e.timeout || 3e4, this.withCredentials = e.withCredentials || !1, this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...e.headers
    };
  }
  // ---------------------------------------------------------------------------
  // Internal helpers — all the "interesting" logic lives here so the per-verb
  // wrappers below stay one-liners.
  // ---------------------------------------------------------------------------
  /** Resolve the auth token using injected `getToken`, falling back to localStorage iff window exists. */
  resolveToken() {
    if (this.config.getToken) {
      const e = this.config.getToken();
      return e ?? null;
    }
    if (typeof window < "u" && typeof localStorage < "u")
      try {
        return localStorage.getItem("auth_token");
      } catch {
        return null;
      }
    return null;
  }
  /** Resolve the `X-Domain` value. Null/undefined = omit. Never defaults. */
  resolveDomain() {
    if (!this.config.getDomain) return null;
    const e = this.config.getDomain();
    return e ?? null;
  }
  /** True if the payload contains any `File` / `Blob` (recursively). */
  hasBinary(e) {
    return e == null ? !1 : typeof Blob < "u" && e instanceof Blob || typeof File < "u" && e instanceof File ? !0 : Array.isArray(e) ? e.some((t) => this.hasBinary(t)) : typeof e == "object" ? Object.values(e).some((t) => this.hasBinary(t)) : !1;
  }
  /**
   * Recursively serialize an object into FormData using Laravel's
   * `field[0][nested]=value` bracket notation. Booleans become `'1'`/`'0'`.
   */
  toFormData(e) {
    const t = new FormData(), n = (s, o) => {
      if (o != null) {
        if (o instanceof Blob) {
          t.append(s, o);
          return;
        }
        if (Array.isArray(o)) {
          o.forEach((i, p) => n(`${s}[${p}]`, i));
          return;
        }
        if (typeof o == "object") {
          for (const [i, p] of Object.entries(o))
            n(`${s}[${i}]`, p);
          return;
        }
        if (typeof o == "boolean") {
          t.append(s, o ? "1" : "0");
          return;
        }
        t.append(s, String(o));
      }
    };
    for (const [s, o] of Object.entries(e)) n(s, o);
    return t;
  }
  /**
   * Core dispatch. Handles header injection, method override, body
   * serialization, status validation, and ApiError normalization.
   *
   * `RequestInit` is honored as-is so subclasses can pass cookies / mode /
   * etc. through if they need to.
   */
  async request(e, t = {}, n = {}) {
    let o = `${this.baseURL || K()}${e}`, i = (t.method || "GET").toUpperCase(), p = t.body;
    if (i === "PUT" || i === "PATCH") {
      const f = o.includes("?") ? "&" : "?";
      o = `${o}${f}_method=${i}`, i = "POST";
    }
    const l = {
      ...this.defaultHeaders,
      ...t.headers || {},
      ...n.headers || {}
    };
    if (n.auth !== !1) {
      const f = this.resolveToken();
      f && (l.Authorization = `Bearer ${f}`);
    }
    const u = this.resolveDomain();
    u && (l["X-Domain"] = u), p instanceof FormData && delete l["Content-Type"];
    const g = new AbortController(), $ = setTimeout(() => g.abort(), this.timeout);
    n.signal && (n.signal.aborted ? g.abort() : n.signal.addEventListener("abort", () => g.abort(), { once: !0 }));
    const U = this.config.fetch ?? fetch, w = n.validateStatus ?? ((f) => f >= 200 && f < 300);
    let b;
    try {
      b = await U(o, {
        ...t,
        method: i,
        headers: l,
        body: p,
        credentials: this.withCredentials ? "include" : "omit",
        signal: g.signal
      });
    } catch (f) {
      if (clearTimeout($), n.safe)
        return null;
      throw f;
    }
    clearTimeout($);
    const E = b.headers.get("content-type") ?? "";
    let y = null;
    if (E.includes("application/json"))
      try {
        y = await b.json();
      } catch {
        y = null;
      }
    else
      try {
        y = await b.text();
      } catch {
        y = null;
      }
    if (b.status === 401) {
      if (this.config.onUnauthorized)
        this.config.onUnauthorized();
      else if (typeof window < "u" && typeof window.dispatchEvent == "function")
        try {
          window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        } catch {
        }
    }
    if (b.status === 422) {
      const f = this.extractValidationErrors(y);
      f && this.config.onValidationError && this.config.onValidationError(f);
    }
    if (!w(b.status)) {
      const f = y && typeof y == "object" && y.message || `HTTP error ${b.status}`, T = this.extractValidationErrors(y);
      throw new z({
        status: b.status,
        message: f,
        data: y && typeof y == "object" ? y.data : y,
        validationErrors: T,
        originalError: b
      });
    }
    return y;
  }
  /** Pull `{ field: string[] }` out of either Laravel-default or legacy nested envelope. */
  extractValidationErrors(e) {
    var o;
    if (!e || typeof e != "object") return;
    const t = (o = e == null ? void 0 : e.data) == null ? void 0 : o.errors, n = e == null ? void 0 : e.errors, s = t ?? n;
    if (s && typeof s == "object") return s;
  }
  /**
   * Build the request body + headers based on the supplied data. Used by
   * post/put/patch verb wrappers. Returns `{ body, isMultipart }`.
   */
  serializeBody(e) {
    return e == null ? { body: void 0, isMultipart: !1 } : typeof FormData < "u" && e instanceof FormData ? { body: e, isMultipart: !0 } : typeof e == "object" && this.hasBinary(e) ? { body: this.toFormData(e), isMultipart: !0 } : { body: JSON.stringify(e), isMultipart: !1 };
  }
  // ---------------------------------------------------------------------------
  // Verb wrappers — public-ish (subclasses use these). Signatures kept
  // backward-compatible with the original fetch client.
  // ---------------------------------------------------------------------------
  async get(e, t, n) {
    let s = e;
    if (t) {
      const o = new URLSearchParams();
      for (const [p, l] of Object.entries(t))
        l != null && o.append(p, String(l));
      const i = o.toString();
      i && (s += (s.includes("?") ? "&" : "?") + i);
    }
    return this.request(s, { method: "GET" }, n);
  }
  async post(e, t, n) {
    const { body: s } = this.serializeBody(t);
    return this.request(e, { method: "POST", body: s }, n);
  }
  async put(e, t, n) {
    const { body: s } = this.serializeBody(t);
    return this.request(e, { method: "PUT", body: s }, n);
  }
  async patch(e, t, n) {
    const { body: s } = this.serializeBody(t);
    return this.request(e, { method: "PATCH", body: s }, n);
  }
  async delete(e, t) {
    return this.request(e, { method: "DELETE" }, t);
  }
}, Y = class extends c {
  async getItems(e) {
    return this.get("/items", e);
  }
  async getItem(e) {
    return this.get(`/items/${e}`);
  }
  async createItem(e) {
    return this.post("/items", e);
  }
  async updateItem(e, t) {
    return this.put(`/items/${e}`, t);
  }
  async deleteItem(e) {
    return this.delete(`/items/${e}`);
  }
}, X = class extends c {
  async login(e) {
    const t = await this.post("/auth/login", e);
    if (t.success && t.data.token && typeof window < "u" && typeof localStorage < "u")
      try {
        localStorage.setItem("auth_token", t.data.token);
      } catch {
      }
    return t;
  }
  async logout() {
    try {
      const e = await this.post("/auth/logout");
      if (typeof window < "u" && typeof localStorage < "u")
        try {
          localStorage.removeItem("auth_token");
        } catch {
        }
      return e;
    } catch (e) {
      if (typeof window < "u" && typeof localStorage < "u")
        try {
          localStorage.removeItem("auth_token");
        } catch {
        }
      throw e;
    }
  }
  async getCurrentUser() {
    return this.get("/auth/user");
  }
  isAuthenticated() {
    if (typeof window > "u" || typeof localStorage > "u") return !1;
    try {
      return !!localStorage.getItem("auth_token");
    } catch {
      return !1;
    }
  }
};
function Be(r) {
  return {
    items: new Y(r),
    auth: new X(r)
  };
}
function Z(r, e, t) {
  const n = ["get", "head", "options", "delete", "put"].includes((r || "").toLowerCase());
  return (e === void 0 || e >= 500) && (n || t);
}
var _ = /* @__PURE__ */ ((r) => (r.ACTIVE = "active", r.INACTIVE = "inactive", r.PENDING = "pending", r.DELETED = "deleted", r))(_ || {});
const ee = ["authorization", "cookie", "set-cookie", "x-tenant-id"], te = [
  "password",
  "password_confirmation",
  "current_password",
  "token",
  "access_token",
  "refresh_token",
  "secret",
  "client_secret",
  "api_key"
];
function ne() {
  try {
    return typeof process < "u" && !!process.env && process.env.NODE_ENV === "production";
  } catch {
    return !1;
  }
}
function re(r) {
  if (!r || typeof r != "object") return r;
  const e = {};
  for (const [t, n] of Object.entries(r))
    e[t] = ee.includes(t.toLowerCase()) ? "[redacted]" : n;
  return e;
}
function k(r, e = 0) {
  if (e > 4 || !r || typeof r != "object") return r;
  const t = Object.getPrototypeOf(r);
  if (!Array.isArray(r) && t !== Object.prototype && t !== null) return "[object]";
  if (Array.isArray(r)) return r.map((s) => k(s, e + 1));
  const n = {};
  for (const [s, o] of Object.entries(r))
    n[s] = te.includes(s.toLowerCase()) ? "[redacted]" : k(o, e + 1);
  return n;
}
class h {
  constructor(e) {
    G(e.baseURL), this.config = e, this.client = O.create({
      baseURL: e.baseURL,
      timeout: e.timeout || 3e4,
      withCredentials: e.withCredentials || !1,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...e.headers
      }
    }), this.setupInterceptors();
  }
  /** Logging is honored only when explicitly enabled AND not in production. */
  get loggingEnabled() {
    return !!this.config.enableLogging && !ne();
  }
  /**
   * Setup request and response interceptors
   */
  setupInterceptors() {
    this.client.interceptors.request.use(
      (e) => {
        var n;
        const t = typeof localStorage < "u" ? localStorage.getItem("auth_token") : null;
        return t && (e.headers.Authorization = `Bearer ${t}`), this.config.tenantId && (e.headers["X-Tenant-ID"] = this.config.tenantId), this.config.environment && (e.headers["X-Client-Environment"] = this.config.environment), this.loggingEnabled && console.log(`[HMS API] ${(n = e.method) == null ? void 0 : n.toUpperCase()} ${e.url}`, {
          headers: re(e.headers),
          data: k(e.data)
        }), e;
      },
      (e) => Promise.reject(e)
    ), this.client.interceptors.response.use(
      (e) => (this.loggingEnabled && console.log("[HMS API] Response:", {
        status: e.status,
        data: k(e.data)
      }), e),
      async (e) => {
        var t, n, s;
        return ((t = e.response) == null ? void 0 : t.status) === 401 && typeof window < "u" && window.dispatchEvent(new CustomEvent("auth:unauthorized")), this.config.enableRetry && this.shouldRetry(e) ? this.retryRequest(e) : (this.loggingEnabled && console.error("[HMS API] Error:", {
          status: (n = e.response) == null ? void 0 : n.status,
          message: e.message,
          data: k((s = e.response) == null ? void 0 : s.data)
        }), Promise.reject(e));
      }
    );
  }
  /**
   * Determine if a request should be retried
   */
  shouldRetry(e) {
    var s;
    if (!e.config || e.config._retryCount >= (this.config.maxRetries || 3))
      return !1;
    const t = e.config.headers || {}, n = !!(t["Idempotency-Key"] || t["idempotency-key"]);
    return Z(e.config.method, (s = e.response) == null ? void 0 : s.status, n);
  }
  /**
   * Retry a failed request with exponential backoff
   */
  async retryRequest(e) {
    const t = e.config;
    t._retryCount = t._retryCount || 0, t._retryCount++;
    const n = Math.pow(2, t._retryCount) * 1e3;
    return await new Promise((s) => setTimeout(s, n)), this.client(t);
  }
}
class se extends h {
  /**
   * Login with email and password
   * @param data - Login credentials
   */
  async login(e) {
    const t = await this.client.post("/auth/sign-in", e);
    return t.data.success && t.data.data.token && localStorage.setItem("auth_token", t.data.data.token), t;
  }
  /**
   * Register a new user
   * @param data - Registration data
   */
  async register(e) {
    const t = await this.client.post("/auth/sign-up", e);
    return t.data.success && t.data.data.token && localStorage.setItem("auth_token", t.data.data.token), t;
  }
  /**
   * Logout the current user
   */
  async logout() {
    try {
      const e = await this.client.get("/logout");
      return localStorage.removeItem("auth_token"), e;
    } catch (e) {
      throw localStorage.removeItem("auth_token"), e;
    }
  }
  /**
   * Get the currently authenticated user
   */
  async getCurrentUser() {
    return this.client.get("/user/get-data");
  }
  /**
   * Request password reset
   * @param data - Password reset request data
   */
  async requestPasswordReset(e) {
    return this.client.post("/auth/reset", e);
  }
  /**
   * Set new password
   * @param data - New password data
   */
  async setNewPassword(e) {
    return this.client.post("/auth/new-password", e);
  }
  /**
   * Check if the user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem("auth_token");
  }
}
class oe extends h {
  /**
   * Update user profile
   * @param userId - User ID
   * @param data - Profile update data
   */
  async updateProfile(e, t) {
    return this.client.patch(`/users/update/${e}`, t);
  }
  /**
   * Update billing information
   * @param data - Billing information
   */
  async updateBillingInfo(e) {
    return this.client.patch("/users/update-billing-info", e);
  }
  /**
   * Update phone number
   * @param phone - Phone number
   */
  async updatePhone(e) {
    return this.client.patch("/users/update-phone", { phone: e });
  }
  /**
   * Update password
   * @param userId - User ID
   * @param currentPassword - Current password
   * @param newPassword - New password
   * @param newPasswordConfirmation - New password confirmation
   */
  async updatePassword(e, t, n, s) {
    return this.client.patch(`/users/update-password/${e}`, {
      current_password: t,
      password: n,
      password_confirmation: s
    });
  }
  /**
   * Upload profile photo
   * @param userId - User ID
   * @param photo - Photo file
   */
  async uploadProfilePhoto(e, t) {
    const n = new FormData();
    return n.append("photo", t), this.client.post(`/users/change-photo/${e}`, n, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
  /**
   * Upload cover photo
   * @param userId - User ID
   * @param cover - Cover photo file
   */
  async uploadCoverPhoto(e, t) {
    const n = new FormData();
    return n.append("cover", t), this.client.post(`/users/change-cover/${e}`, n, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
  /**
   * Get user by username
   * @param username - Username
   */
  async getUserByUsername(e) {
    return this.client.get(`/users/name/${e}`);
  }
  /**
   * Get user by ID
   * @param userId - User ID
   */
  async getUserById(e) {
    return this.client.get(`/users/id/${e}`);
  }
  /**
   * Search for users
   * @param query - Search query
   */
  async searchUsers(e) {
    return this.client.get(`/users/find/${e}`);
  }
  /**
   * Delete account
   * @param userId - User ID
   */
  async deleteAccount(e) {
    return this.client.delete(`/users/delete/${e}`);
  }
  /**
   * Get user wallet balance
   */
  async getWalletBalance() {
    return this.client.get("/user/get-wallet");
  }
}
class ie extends h {
  /**
   * Get all team members
   */
  async getAllMembers() {
    return this.client.get("/team/all");
  }
  /**
   * Get team members by status
   * @param status - Member status
   */
  async getMembersByStatus(e) {
    return this.client.get(`/team/list/${e}`);
  }
  /**
   * Get invites
   */
  async getInvites() {
    return this.client.get("/team/member/pending");
  }
  /**
   * Invite team member
   * @param data - Invite data
   */
  async inviteMember(e) {
    return this.client.post("/team/invite", e);
  }
  /**
   * Invite network member
   * @param userId - User ID
   * @param role - Role
   */
  async inviteNetworkMember(e, t) {
    return this.client.post("/team/network-invite", { user_id: e, role: t });
  }
  /**
   * Search network members
   * @param query - Search query
   */
  async searchNetworkMembers(e) {
    return this.client.post("/team/network-search", { search: e });
  }
  /**
   * Accept invite
   * @param inviteId - Invite ID
   */
  async acceptInvite(e) {
    return this.client.post("/team/accept", { invite_id: e });
  }
  /**
   * Reject invite
   * @param inviteId - Invite ID
   */
  async rejectInvite(e) {
    return this.client.post("/team/reject", { invite_id: e });
  }
  /**
   * Leave team
   * @param teamId - Team ID
   */
  async leaveTeam(e) {
    return this.client.post("/team/leave", { team_id: e });
  }
  /**
   * Remove member
   * @param memberId - Member ID
   */
  async removeMember(e) {
    return this.client.post("/team/remove", { member_id: e });
  }
  /**
   * Get invite by token
   * @param token - Invite token
   */
  async getInviteByToken(e) {
    return this.client.get(`/public/team/get-invite/${e}`);
  }
  /**
   * Accept invite by token
   * @param token - Invite token
   */
  async acceptInviteByToken(e) {
    return this.client.get(`/team/accept-invite/${e}`);
  }
  /**
   * Reject invite by token
   * @param token - Invite token
   */
  async rejectInviteByToken(e) {
    return this.client.delete(`/public/team/reject-invite/${e}`);
  }
}
class ae extends h {
  /**
   * Get all items
   * @param params - Query parameters
   */
  async getItems(e) {
    return this.client.get("/items", { params: e });
  }
  /**
   * Get item by ID
   * @param id - Item ID
   */
  async getItem(e) {
    return this.client.get(`/items/${e}`);
  }
  /**
   * Create item
   * @param data - Item data
   */
  async createItem(e) {
    return this.client.post("/items", e);
  }
  /**
   * Update item
   * @param id - Item ID
   * @param data - Item data
   */
  async updateItem(e, t) {
    return this.client.put(`/items/${e}`, t);
  }
  /**
   * Delete item
   * @param id - Item ID
   */
  async deleteItem(e) {
    return this.client.delete(`/items/${e}`);
  }
  /**
   * Search items
   * @param search - Search query
   * @param type - Item type
   */
  async searchItems(e, t) {
    return this.client.get(`/items/find-item/${e}/${t}`);
  }
  /**
   * Get food categories
   */
  async getFoodCategories() {
    return this.client.get("/items/food-categories");
  }
  /**
   * Get all item collections
   */
  async getCollections() {
    return this.client.get("/collection-list");
  }
  /**
   * Get collection by ID
   * @param id - Collection ID
   */
  async getCollection(e) {
    return this.client.get(`/collection/${e}`);
  }
  /**
   * Create collection
   * @param data - Collection data
   */
  async createCollection(e) {
    return this.client.post("/collection", e);
  }
  /**
   * Add item to collection
   * @param collectionId - Collection ID
   * @param itemId - Item ID
   */
  async addItemToCollection(e, t) {
    return this.client.post("/collection-item", { collection_id: e, item_id: t });
  }
  /**
   * Remove item from collection
   * @param itemId - Collection item ID
   */
  async removeItemFromCollection(e) {
    return this.client.delete(`/collection-item/${e}`);
  }
}
class ce extends h {
  /**
   * Get featured programs
   */
  async getFeaturedPrograms() {
    return this.client.get("/home/featured-programs");
  }
  /**
   * Get recent programs
   */
  async getRecentPrograms() {
    return this.client.get("/home/most-recent-programs");
  }
  /**
   * Get program by ID
   * @param id - Program ID
   */
  async getProgram(e) {
    return this.client.get(`/public/get-program/${e}`);
  }
  /**
   * Get program feedback
   * @param id - Program ID
   */
  async getProgramFeedback(e) {
    return this.client.get(`/public/get-program-feedback/${e}`);
  }
  /**
   * Search programs
   * @param query - Search query
   * @param category - Category ID
   */
  async searchPrograms(e, t) {
    return this.client.post("/program/search", { query: e, category: t });
  }
  /**
   * Get programs by user
   * @param userId - User ID
   */
  async getUserPrograms(e) {
    return this.client.get(`/public/get-user-feed/${e}`);
  }
  /**
   * Get featured programs by user
   * @param userId - User ID
   */
  async getUserFeaturedPrograms(e) {
    return this.client.get(`/public/get-user-featured/${e}`);
  }
  /**
   * Toggle program bookmark
   * @param programId - Program ID
   */
  async toggleBookmark(e) {
    return this.client.post("/program/toggle-bookmark", { program_id: e });
  }
  /**
   * Get bookmarked programs
   */
  async getBookmarks() {
    return this.client.get("/program/get-bookmarks");
  }
  /**
   * Get program categories
   */
  async getCategories() {
    return this.client.get("/public/get-program-categories");
  }
}
let pe = class extends h {
  /**
   * Get protocol by ID
   * @param id - Protocol ID
   */
  async getProtocol(e) {
    return this.client.get(`/protocol/${e}`);
  }
  /**
   * Get protocols by category
   * @param categoryId - Category ID
   */
  async getProtocolsByCategory(e) {
    const t = e ? `/protocol/by-category/${e}` : "/protocol/by-category";
    return this.client.get(t);
  }
  /**
   * Get available protocol modules
   * @param recurring - Get recurring modules only
   */
  async getModules(e) {
    const t = e ? "/protocol/modules/1" : "/protocol/modules";
    return this.client.get(t);
  }
  /**
   * Get protocol steps
   * @param protocolId - Protocol ID
   */
  async getProtocolSteps(e) {
    return this.client.get(`/protocol/get-steps/${e}`);
  }
  /**
   * Get protocol categories
   */
  async getCategories() {
    return this.client.get("/protocol-category/all");
  }
};
class le extends h {
  /**
   * Get user devices
   */
  async getUserDevices() {
    return this.client.get("/user-devices/list");
  }
  /**
   * Redirect to Withings for authentication
   */
  async authorizeWithings() {
    return this.client.get("/withings/auth");
  }
  /**
   * Get KPI setup for a chain
   * @param chainId - Chain ID
   * @param protocolId - Protocol ID
   */
  async getKPISetup(e, t) {
    return this.client.get(`/kpi/get-setup/${e}/${t}`);
  }
  /**
   * Save KPI setup
   * @param data - KPI setup data
   */
  async saveKPISetup(e) {
    return this.client.post("/kpi/save-setup", e);
  }
  /**
   * Remove KPI rule
   * @param ruleId - Rule ID
   */
  async removeKPIRule(e) {
    return this.client.delete(`/kpi/remove-rule/${e}`);
  }
  /**
   * Save round results
   * @param data - Round results data
   */
  async saveRoundResults(e) {
    return this.client.post("/kpi/save-round-results", e);
  }
}
class ue extends h {
  /**
   * Get chat list
   * @param search - Search query
   */
  async getChatList(e) {
    const t = e ? `/chat/get-list/${e}` : "/chat/get-list";
    return this.client.get(t);
  }
  /**
   * List conversations (alias for getChatList). Added 2026-05-21 (v1.6.0)
   * so sys/src/stores/chat.ts can drop its raw HTTP TODO and call the
   * SDK with the name the consumer expects. Same wire path as getChatList.
   *
   * @param search - Search query
   */
  async listConversations(e) {
    return this.getChatList(e);
  }
  /**
   * Get chat room
   * @param userId - User ID (to create or get a 1:1 chat)
   */
  async getChatRoom(e) {
    return this.client.post("/chat/get-room", { user_id: e });
  }
  /**
   * Get chat room by ID
   * @param roomId - Room ID
   */
  async getChatRoomById(e) {
    return this.client.get(`/chat/get-room-by-id/${e}`);
  }
  /**
   * Get messages for a chat
   * @param chatId - Chat ID
   * @param search - Search query
   */
  async getMessages(e, t) {
    const n = t ? `/chat/messages/${e}/${t}` : `/chat/messages/${e}`;
    return this.client.get(n);
  }
  /**
   * List messages for a conversation (alias for getMessages). Added
   * 2026-05-21 (v1.6.0) — matches the name sys/'s chat store expects.
   *
   * @param conversationId - Conversation (chat) ID
   * @param search - Search query
   */
  async listMessages(e, t) {
    return this.getMessages(e, t);
  }
  /**
   * Send message
   * @param data - Message data
   */
  async sendMessage(e) {
    if (e.attachments && e.attachments.length > 0) {
      const t = new FormData();
      return t.append("room_id", e.roomId.toString()), t.append("message", e.message), e.attachments.forEach((n, s) => {
        t.append(`attachments[${s}]`, n);
      }), this.client.post("/chat/send-message", t, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
    }
    return this.client.post("/chat/send-message", {
      room_id: e.roomId,
      message: e.message
    });
  }
  /**
   * Find user to chat with
   * @param search - Search query
   */
  async findUserToChat(e) {
    return this.client.get(`/chat/find-user/${e}`);
  }
  /**
   * Delete message
   * @param messageId - Message ID
   */
  async deleteMessage(e) {
    return this.client.delete(`/chat/delete-message/${e}`);
  }
  /**
   * Delete chat
   * @param chatId - Chat ID
   */
  async deleteChat(e) {
    return this.client.delete(`/chat/delete-сhat/${e}`);
  }
}
class de extends h {
  /**
   * Get notifications
   */
  async getNotifications() {
    return this.client.get("/notification/get");
  }
  /**
   * Get unread notifications count
   */
  async getUnreadCount() {
    return this.client.get("/notification/get-unread");
  }
  /**
   * Delete notification
   * @param notificationId - Notification ID
   */
  async deleteNotification(e) {
    return this.client.delete(`/notification/delete-notification/${e}`);
  }
}
class ge extends h {
  /**
   * Connect to Stripe
   */
  async connectToStripe() {
    return this.client.get("/stripe/connect");
  }
  /**
   * Withdraw money
   */
  async withdrawMoney() {
    return this.client.get("/stripe/withdraw");
  }
  /**
   * Get transactions
   */
  async getTransactions() {
    return this.client.get("/stripe/transactions");
  }
  /**
   * Check Stripe account
   */
  async checkAccount() {
    return this.client.get("/stripe/check-account");
  }
  /**
   * Delete Stripe account
   */
  async deleteAccount() {
    return this.client.delete("/stripe/delete-account");
  }
}
class he extends h {
  /**
   * Check nudge secret (Public endpoint - no authentication required)
   * @param secret - Nudge secret
   */
  async checkNudgeSecret(e) {
    return this.client.get(`/nudge/check/${e}`);
  }
  /**
   * Email check-in (Public endpoint - no authentication required)
   * @param email - Email address
   * @param data - Check-in data
   */
  async emailCheckin(e, t) {
    return this.client.post("/nudge-checkin/email", { email: e, ...t });
  }
  /**
   * SMS check-in (Public endpoint - no authentication required)
   * @param phone - Phone number
   * @param data - Check-in data
   */
  async smsCheckin(e, t) {
    return this.client.post("/nudge-checkin/sms", { phone: e, ...t });
  }
  /**
   * Delete nudge image
   * @param nudgeId - Nudge ID
   */
  async deleteNudgeImage(e) {
    return this.client.delete(`/nudge/image/${e}`);
  }
  /**
   * Get all protocol nudges
   */
  async getAllProtocolNudges() {
    return this.client.get("/protocol/nudge/all");
  }
  /**
   * Get all nudges
   */
  async getNudges() {
    return this.client.get("/nudge");
  }
  /**
   * Get nudge by ID
   * @param nudgeId - Nudge ID
   */
  async getNudge(e) {
    return this.client.get(`/nudge/${e}`);
  }
  /**
   * Create nudge
   * @param data - Nudge creation data
   */
  async createNudge(e) {
    const t = new FormData();
    return t.append("name", e.name), t.append("description", e.description), t.append("protocol_id", e.protocolId.toString()), t.append("chain_id", e.chainId.toString()), t.append("settings", JSON.stringify(e.settings)), e.image && t.append("image", e.image), this.client.post("/nudge", t, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
  /**
   * Update nudge
   * @param nudgeId - Nudge ID
   * @param data - Nudge update data
   */
  async updateNudge(e, t) {
    return this.client.put(`/nudge/${e}`, t);
  }
  /**
   * Delete nudge
   * @param nudgeId - Nudge ID
   */
  async deleteNudge(e) {
    return this.client.delete(`/nudge/${e}`);
  }
  /**
   * Upload nudge image
   * @param nudgeId - Nudge ID
   * @param imageFile - Image file
   */
  async uploadNudgeImage(e, t) {
    const n = new FormData();
    return n.append("image", t), this.client.post(`/nudge/${e}/image`, n, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
  /**
   * Activate nudge
   * @param nudgeId - Nudge ID
   */
  async activateNudge(e) {
    return this.client.post(`/nudge/${e}/activate`);
  }
  /**
   * Deactivate nudge
   * @param nudgeId - Nudge ID
   */
  async deactivateNudge(e) {
    return this.client.post(`/nudge/${e}/deactivate`);
  }
  /**
   * Schedule nudge
   * @param nudgeId - Nudge ID
   * @param scheduledAt - Scheduled date and time
   */
  async scheduleNudge(e, t) {
    return this.client.post(`/nudge/${e}/schedule`, { scheduled_at: t });
  }
  /**
   * Get nudge analytics
   * @param nudgeId - Nudge ID
   */
  async getNudgeAnalytics(e) {
    return this.client.get(`/nudge/${e}/analytics`);
  }
  /**
   * Get nudge check-ins
   * @param nudgeId - Nudge ID
   */
  async getNudgeCheckins(e) {
    return this.client.get(`/nudge/${e}/checkins`);
  }
  /**
   * Send test nudge
   * @param nudgeId - Nudge ID
   * @param recipients - Test recipients (email or phone)
   */
  async sendTestNudge(e, t) {
    return this.client.post(`/nudge/${e}/test`, { recipients: t });
  }
  /**
   * Get nudges by protocol
   * @param protocolId - Protocol ID
   */
  async getNudgesByProtocol(e) {
    return this.client.get(`/nudge/protocol/${e}`);
  }
  /**
   * Get nudges by chain
   * @param chainId - Chain ID
   */
  async getNudgesByChain(e) {
    return this.client.get(`/nudge/chain/${e}`);
  }
}
class me extends h {
  /**
   * Run follow-up
   * @param chainId - Chain ID
   */
  async runFollowUp(e) {
    return this.client.get(`/follow-up/run/${e}`);
  }
  /**
   * Get timeline for chain
   * @param chainId - Chain ID
   */
  async getTimeline(e) {
    return this.client.get(`/follow-up/get-timeline/${e}`);
  }
  /**
   * Get recommendations for follow-up
   * @param followupId - Follow-up ID
   */
  async getRecommendations(e) {
    return this.client.get(`/follow-up/recommendations/${e}`);
  }
  /**
   * Record voice for follow-up
   * @param audioFile - Audio file
   * @param followupId - Follow-up ID
   * @param metadata - Additional metadata
   */
  async recordVoice(e, t, n) {
    const s = new FormData();
    return s.append("audio", e), s.append("followup_id", t.toString()), n && Object.entries(n).forEach(([o, i]) => {
      s.append(o, i.toString());
    }), this.client.post("/follow-up/voice-record", s, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
  /**
   * Finalize voice recording
   * @param data - Voice finalize data
   */
  async finalizeVoice(e) {
    return this.client.post("/follow-up/voice-finalize", e);
  }
  /**
   * Process payment for follow-up
   * @param data - Payment data
   */
  async processPayment(e) {
    return this.client.post("/follow-up/process-payment", e);
  }
  /**
   * Get all follow-ups
   */
  async getFollowUps() {
    return this.client.get("/follow-up");
  }
  /**
   * Get follow-up by ID
   * @param followupId - Follow-up ID
   */
  async getFollowUp(e) {
    return this.client.get(`/follow-up/${e}`);
  }
  /**
   * Create follow-up
   * @param data - Follow-up creation data
   */
  async createFollowUp(e) {
    return this.client.post("/follow-up", e);
  }
  /**
   * Update follow-up
   * @param followupId - Follow-up ID
   * @param data - Follow-up update data
   */
  async updateFollowUp(e, t) {
    return this.client.put(`/follow-up/${e}`, t);
  }
  /**
   * Delete follow-up
   * @param followupId - Follow-up ID
   */
  async deleteFollowUp(e) {
    return this.client.delete(`/follow-up/${e}`);
  }
  /**
   * Schedule follow-up
   * @param followupId - Follow-up ID
   * @param scheduledAt - Scheduled date and time
   */
  async scheduleFollowUp(e, t) {
    return this.client.post(`/follow-up/${e}/schedule`, { scheduled_at: t });
  }
  /**
   * Cancel follow-up
   * @param followupId - Follow-up ID
   */
  async cancelFollowUp(e) {
    return this.client.post(`/follow-up/${e}/cancel`);
  }
  /**
   * Complete follow-up
   * @param followupId - Follow-up ID
   * @param data - Completion data
   */
  async completeFollowUp(e, t) {
    return this.client.post(`/follow-up/${e}/complete`, t || {});
  }
  /**
   * Get follow-ups by chain
   * @param chainId - Chain ID
   */
  async getFollowUpsByChain(e) {
    return this.client.get(`/follow-up/chain/${e}`);
  }
  /**
   * Get pending follow-ups
   */
  async getPendingFollowUps() {
    return this.client.get("/follow-up/pending");
  }
  /**
   * Create recommendation
   * @param data - Recommendation creation data
   */
  async createRecommendation(e) {
    return this.client.post("/follow-up/recommendation", e);
  }
  /**
   * Update recommendation
   * @param recommendationId - Recommendation ID
   * @param data - Recommendation update data
   */
  async updateRecommendation(e, t) {
    return this.client.put(`/follow-up/recommendation/${e}`, t);
  }
  /**
   * Delete recommendation
   * @param recommendationId - Recommendation ID
   */
  async deleteRecommendation(e) {
    return this.client.delete(`/follow-up/recommendation/${e}`);
  }
  /**
   * Get voice recordings
   * @param followupId - Follow-up ID
   */
  async getVoiceRecordings(e) {
    return this.client.get(`/follow-up/${e}/voice-recordings`);
  }
  /**
   * Delete voice recording
   * @param recordingId - Recording ID
   */
  async deleteVoiceRecording(e) {
    return this.client.delete(`/follow-up/voice-recording/${e}`);
  }
}
class ye extends h {
  /**
   * Get running activities
   * @param data - Activity query parameters
   */
  async getRunningActivities(e) {
    return this.client.post("/activity/running", e);
  }
  /**
   * Get activity providers
   * @param activityId - Activity ID
   */
  async getActivityProviders(e) {
    return this.client.get(`/activity/get-providers/${e}`);
  }
  /**
   * Set reservation
   * @param data - Reservation data
   */
  async setReservation(e) {
    return this.client.post("/activity/set-reservation", e);
  }
  /**
   * Confirm booking
   * @param data - Booking data
   */
  async confirmBooking(e) {
    return this.client.post("/activity/confirm-booking", e);
  }
  /**
   * Get booked events for a month
   * @param date - Date in YYYY-MM format
   */
  async getBookedEventsForMonth(e) {
    return this.client.get(`/activity/booked-events-month/${e}`);
  }
  /**
   * Search service locations
   * @param query - Search query
   */
  async searchServiceLocations(e) {
    return this.client.get(`/activity/search-locations/${encodeURIComponent(e)}`);
  }
  /**
   * Get all activities
   */
  async getActivities() {
    return this.client.get("/activity");
  }
  /**
   * Get activity by ID
   * @param activityId - Activity ID
   */
  async getActivity(e) {
    return this.client.get(`/activity/${e}`);
  }
  /**
   * Create activity
   * @param data - Activity creation data
   */
  async createActivity(e) {
    return this.client.post("/activity", e);
  }
  /**
   * Update activity
   * @param activityId - Activity ID
   * @param data - Activity update data
   */
  async updateActivity(e, t) {
    return this.client.put(`/activity/${e}`, t);
  }
  /**
   * Delete activity
   * @param activityId - Activity ID
   */
  async deleteActivity(e) {
    return this.client.delete(`/activity/${e}`);
  }
  /**
   * Get locations
   */
  async getLocations() {
    return this.client.get("/activity/locations");
  }
  /**
   * Get location by ID
   * @param locationId - Location ID
   */
  async getLocation(e) {
    return this.client.get(`/activity/location/${e}`);
  }
  /**
   * Create location
   * @param data - Location creation data
   */
  async createLocation(e) {
    return this.client.post("/activity/location", e);
  }
  /**
   * Update location
   * @param locationId - Location ID
   * @param data - Location update data
   */
  async updateLocation(e, t) {
    return this.client.put(`/activity/location/${e}`, t);
  }
  /**
   * Delete location
   * @param locationId - Location ID
   */
  async deleteLocation(e) {
    return this.client.delete(`/activity/location/${e}`);
  }
  /**
   * Get providers
   */
  async getProviders() {
    return this.client.get("/activity/providers");
  }
  /**
   * Get provider by ID
   * @param providerId - Provider ID
   */
  async getProvider(e) {
    return this.client.get(`/activity/provider/${e}`);
  }
  /**
   * Create provider
   * @param data - Provider creation data
   */
  async createProvider(e) {
    return this.client.post("/activity/provider", e);
  }
  /**
   * Update provider
   * @param providerId - Provider ID
   * @param data - Provider update data
   */
  async updateProvider(e, t) {
    return this.client.put(`/activity/provider/${e}`, t);
  }
  /**
   * Delete provider
   * @param providerId - Provider ID
   */
  async deleteProvider(e) {
    return this.client.delete(`/activity/provider/${e}`);
  }
  /**
   * Cancel reservation
   * @param reservationId - Reservation ID
   */
  async cancelReservation(e) {
    return this.client.delete(`/activity/reservation/${e}`);
  }
  /**
   * Get user reservations
   */
  async getUserReservations() {
    return this.client.get("/activity/user-reservations");
  }
  /**
   * Get available time slots
   * @param activityId - Activity ID
   * @param date - Date in YYYY-MM-DD format
   */
  async getAvailableTimeSlots(e, t) {
    return this.client.get(`/activity/${e}/available-slots/${t}`);
  }
}
class fe extends h {
  /**
   * Run assessment
   * @param assessmentId - Assessment ID
   * @param chainId - Chain ID
   */
  async runAssessment(e, t) {
    return this.client.get(`/assessment/run/${e}/${t}`);
  }
  /**
   * Get questions by assessment
   * @param assessmentId - Assessment ID
   */
  async getQuestionsByAssessment(e) {
    return this.client.get(`/question/by-assessment/${e}`);
  }
  /**
   * Store response
   * @param data - Response data
   */
  async storeResponse(e) {
    return this.client.post("/response/store", e);
  }
  /**
   * Delete choice
   * @param choiceId - Choice ID
   */
  async deleteChoice(e) {
    return this.client.delete(`/choice/${e}`);
  }
  /**
   * Get all assessments
   */
  async getAssessments() {
    return this.client.get("/assessment");
  }
  /**
   * Get assessment by ID
   * @param assessmentId - Assessment ID
   */
  async getAssessment(e) {
    return this.client.get(`/assessment/${e}`);
  }
  /**
   * Create assessment
   * @param data - Assessment creation data
   */
  async createAssessment(e) {
    return this.client.post("/assessment", e);
  }
  /**
   * Update assessment
   * @param assessmentId - Assessment ID
   * @param data - Assessment update data
   */
  async updateAssessment(e, t) {
    return this.client.put(`/assessment/${e}`, t);
  }
  /**
   * Delete assessment
   * @param assessmentId - Assessment ID
   */
  async deleteAssessment(e) {
    return this.client.delete(`/assessment/${e}`);
  }
  /**
   * Get question by ID
   * @param questionId - Question ID
   */
  async getQuestion(e) {
    return this.client.get(`/question/${e}`);
  }
  /**
   * Create question
   * @param data - Question creation data
   */
  async createQuestion(e) {
    return this.client.post("/question", e);
  }
  /**
   * Update question
   * @param questionId - Question ID
   * @param data - Question update data
   */
  async updateQuestion(e, t) {
    return this.client.put(`/question/${e}`, t);
  }
  /**
   * Delete question
   * @param questionId - Question ID
   */
  async deleteQuestion(e) {
    return this.client.delete(`/question/${e}`);
  }
  /**
   * Get choice by ID
   * @param choiceId - Choice ID
   */
  async getChoice(e) {
    return this.client.get(`/choice/${e}`);
  }
  /**
   * Create choice
   * @param data - Choice creation data
   */
  async createChoice(e) {
    return this.client.post("/choice", e);
  }
  /**
   * Update choice
   * @param choiceId - Choice ID
   * @param data - Choice update data
   */
  async updateChoice(e, t) {
    return this.client.put(`/choice/${e}`, t);
  }
  /**
   * Get user responses for assessment
   * @param assessmentId - Assessment ID
   * @param userId - User ID (optional, defaults to current user)
   */
  async getUserResponses(e, t) {
    const n = t ? `/response/user/${t}/assessment/${e}` : `/response/assessment/${e}`;
    return this.client.get(n);
  }
  /**
   * Get assessment results
   * @param assessmentId - Assessment ID
   * @param userId - User ID (optional, defaults to current user)
   */
  async getAssessmentResults(e, t) {
    const n = t ? `/assessment/${e}/results/${t}` : `/assessment/${e}/results`;
    return this.client.get(n);
  }
  /**
   * Submit assessment
   * @param assessmentId - Assessment ID
   * @param responses - Array of responses
   */
  async submitAssessment(e, t) {
    return this.client.post(`/assessment/${e}/submit`, { responses: t });
  }
}
class Ce extends h {
  /**
   * Run challenge
   * @param data - Challenge run data
   */
  async runChallenge(e) {
    return this.client.post("/challenge/run", e);
  }
  /**
   * Get challenge by ID and chain
   * @param challengeId - Challenge ID
   * @param chainId - Chain ID
   */
  async getChallenge(e, t) {
    return this.client.get(`/challenge/get-challenge/${e}/${t}`);
  }
  /**
   * Start challenge task
   * @param data - Task start data
   */
  async startTask(e) {
    return this.client.post("/challenge/start-task", e);
  }
  /**
   * Set challenge result
   * @param resultId - Result ID
   * @param data - Result data
   */
  async setResult(e, t) {
    return this.client.post(`/challenge/set-result/${e}`, t);
  }
  /**
   * Record video for challenge
   * @param videoFile - Video file
   * @param challengeId - Challenge ID
   * @param metadata - Additional metadata
   */
  async recordVideo(e, t, n) {
    const s = new FormData();
    return s.append("video", e), s.append("challenge_id", t.toString()), n && Object.entries(n).forEach(([o, i]) => {
      s.append(o, i.toString());
    }), this.client.post("/challenge/record-video", s, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
  /**
   * Get all protocol challenges
   */
  async getAllProtocolChallenges() {
    return this.client.get("/protocol/challenge/all");
  }
  /**
   * Get all challenges
   */
  async getChallenges() {
    return this.client.get("/challenge");
  }
  /**
   * Create challenge
   * @param data - Challenge creation data
   */
  async createChallenge(e) {
    return this.client.post("/challenge", e);
  }
  /**
   * Update challenge
   * @param challengeId - Challenge ID
   * @param data - Challenge update data
   */
  async updateChallenge(e, t) {
    return this.client.put(`/challenge/${e}`, t);
  }
  /**
   * Delete challenge
   * @param challengeId - Challenge ID
   */
  async deleteChallenge(e) {
    return this.client.delete(`/challenge/${e}`);
  }
  /**
   * Get challenge tasks
   * @param challengeId - Challenge ID
   */
  async getChallengeTasks(e) {
    return this.client.get(`/challenge/${e}/tasks`);
  }
  /**
   * Get task by ID
   * @param taskId - Task ID
   */
  async getTask(e) {
    return this.client.get(`/challenge/task/${e}`);
  }
  /**
   * Complete task
   * @param taskId - Task ID
   * @param data - Completion data
   */
  async completeTask(e, t) {
    return this.client.post(`/challenge/complete-task/${e}`, t || {});
  }
}
class $e extends h {
  /**
   * Run order execution
   * @param orderId - Order ID
   * @param chainId - Chain ID
   */
  async runOrder(e, t) {
    return this.client.get(`/order/run/${e}/${t}`);
  }
  /**
   * Get all protocol orders
   */
  async getAllProtocolOrders() {
    return this.client.get("/protocol/order/all");
  }
  /**
   * Start checkout process
   * @param data - Checkout data
   */
  async startCheckout(e) {
    return this.client.post("/order/checkout", e);
  }
  /**
   * Confirm order
   * @param data - Order confirmation data
   */
  async confirmOrder(e) {
    return this.client.post("/order/confirm-order", e);
  }
  /**
   * Get orders by status (Admin only - SuperAdmin role required)
   * @param status - Order status
   */
  async getOrdersByStatus(e) {
    return this.client.get(`/orders/${e}`);
  }
  /**
   * Confirm order price (Admin only - SuperAdmin role required)
   * @param data - Price confirmation data
   */
  async confirmOrderPrice(e) {
    return this.client.post("/orders/confirm", e);
  }
  /**
   * Get order by ID
   * @param orderId - Order ID
   */
  async getOrder(e) {
    return this.client.get(`/order/${e}`);
  }
  /**
   * Get user's orders
   * @param params - Query parameters
   */
  async getUserOrders(e) {
    return this.client.get("/orders", { params: e });
  }
  /**
   * Cancel order
   * @param orderId - Order ID
   */
  async cancelOrder(e) {
    return this.client.delete(`/order/${e}`);
  }
}
class ve extends h {
  /**
   * Get payment history for subscriptions
   */
  async getSubscriptionPayments() {
    return this.client.get("/payment/subscriptions");
  }
  /**
   * Get payment history for program purchases
   */
  async getProgramPurchases() {
    return this.client.get("/payment/program-purchases");
  }
  /**
   * Get purchased items
   */
  async getPurchasedItems() {
    return this.client.get("/payment/purchased-items");
  }
  /**
   * Setup payment method
   */
  async setupPaymentMethod() {
    return this.client.get("/payment/setup-payment-method");
  }
  /**
   * Save payment method
   * @param paymentMethodId - Payment method ID
   */
  async savePaymentMethod(e) {
    return this.client.post("/payment/save-payment-method", { payment_method_id: e });
  }
  /**
   * Get payment methods
   */
  async getPaymentMethods() {
    return this.client.get("/payment/get-payment-method");
  }
  /**
   * Delete payment method
   * @param paymentMethodId - Payment method ID
   */
  async deletePaymentMethod(e) {
    return this.client.delete(`/payment/delete-payment-method/${e}`);
  }
}
class Se extends h {
  /**
   * Get domain configuration by hostname
   * @param hostname - Domain hostname
   */
  async getByHostname(e) {
    return this.client.get(`/domains/hostname/${e}`);
  }
  /**
   * Get all domains
   */
  async getAllDomains() {
    return this.client.get("/domains");
  }
  /**
   * Get domain by ID
   * @param domainId - Domain ID
   */
  async getDomain(e) {
    return this.client.get(`/domains/${e}`);
  }
  /**
   * Create domain
   * @param data - Domain creation data
   */
  async createDomain(e) {
    return this.client.post("/domains", e);
  }
  /**
   * Update domain
   * @param domainId - Domain ID
   * @param data - Domain update data
   */
  async updateDomain(e, t) {
    return this.client.put(`/domains/${e}`, t);
  }
  /**
   * Delete domain
   * @param domainId - Domain ID
   */
  async deleteDomain(e) {
    return this.client.delete(`/domains/${e}`);
  }
  /**
   * Get domain configuration
   * @param hostname - Domain hostname
   */
  async getConfiguration(e) {
    return this.client.get(`/domains/hostname/${e}/config`);
  }
  /**
   * Update domain status
   * @param domainId - Domain ID
   * @param status - New status
   */
  async updateStatus(e, t) {
    return this.client.patch(`/domains/${e}/status`, { status: t });
  }
}
function x(r) {
  return {
    // Authentication & User Management
    auth: new se(r),
    user: new oe(r),
    team: new ie(r),
    // Core Business Logic
    items: new ae(r),
    programs: new ce(r),
    protocols: new pe(r),
    domains: new Se(r),
    // Module-Specific Clients (New implementations)
    order: new $e(r),
    nudge: new he(r),
    challenge: new Ce(r),
    assessments: new fe(r),
    activity: new ye(r),
    followUps: new me(r),
    // Analytics & Monitoring
    kpi: new le(r),
    // Communication
    chat: new ue(r),
    notifications: new de(r),
    // Payment & Financial
    stripe: new ge(r),
    payment: new ve(r)
  };
}
function be(r) {
  const e = {
    baseURL: typeof window < "u" ? window.location.hostname === "localhost" ? "http://localhost:8000/api" : "/api" : "https://api.hms-platform.com/api",
    environment: "gov",
    enableLogging: process.env.NODE_ENV === "development",
    enableRetry: !0,
    maxRetries: 3,
    ...r
  };
  return x(e);
}
function Re(r) {
  const e = {
    baseURL: typeof window < "u" ? window.location.hostname === "localhost" ? "http://localhost:8000/api" : "/api/mkt" : "https://api.hms-platform.com/api/mkt",
    environment: "mkt",
    enableLogging: process.env.NODE_ENV === "development",
    enableRetry: !0,
    maxRetries: 2,
    // Slightly lower retry for marketing APIs
    ...r
  };
  return x(e);
}
function Ie(r) {
  const e = {
    baseURL: typeof window < "u" ? window.location.hostname === "localhost" ? "http://localhost:8000/api" : "/api/mfe" : "https://api.hms-platform.com/api/mfe",
    environment: "mfe",
    enableLogging: !1,
    // Disabled by default for micro-frontends
    enableRetry: !0,
    maxRetries: 2,
    timeout: 15e3,
    // Shorter timeout for micro-frontends
    ...r
  };
  return x(e);
}
const d = x({
  baseURL: typeof window < "u" ? window.location.hostname === "localhost" ? "http://localhost:8000/api" : "/api" : "https://api.hms-platform.com/api",
  enableLogging: process.env.NODE_ENV === "development",
  enableRetry: !0
}), Ge = be(), Ve = Re(), qe = Ie();
class Ue extends h {
  /**
   * Create a new wizard API client
   * @param config API client configuration
   *
   * Note: WebSocket connection is NOT auto-opened. Consumer code that
   * cares about real-time job/deal events must register a listener via
   * `addJobListener()` / `addDealListener()`, which internally calls
   * `initWebSocket()` lazily.
   *
   * Background: the original constructor opened a WebSocket to
   * `${window.location.host}/ws/jobs` unconditionally on any browser
   * environment. The SDK is consumed by multi-tenant frontends where
   * most tenant subdomains (codify.<tld>, codify.<city>, agency
   * apexes) do NOT have a Cloudflare/Nginx route for /ws/jobs, so
   * every page load printed "WebSocket connection to
   * wss://<tenant>/ws/jobs failed" and triggered a 5 s reconnect loop
   * forever. Pinned by tests/api/__tests__/wizard-api-client.websocket.test.ts.
   */
  constructor(e) {
    super(e), this.socket = null, this.jobListeners = {}, this.dealListeners = {};
  }
  /**
   * Initialize WebSocket connection for real-time job updates
   */
  initWebSocket() {
    const e = window.location.protocol === "https:" ? "wss:" : "ws:", t = window.location.hostname === "localhost" ? "localhost:6001" : window.location.host;
    try {
      this.socket = new WebSocket(`${e}//${t}/ws/jobs`), this.socket.onmessage = (n) => {
        try {
          const s = JSON.parse(n.data);
          s.event === "job.status.updated" ? this.notifyJobListeners(s.data) : s.event === "deal.status.updated" && this.notifyDealListeners(s.data);
        } catch (s) {
          console.error("WebSocket message parsing error:", s);
        }
      }, this.socket.onclose = () => {
        setTimeout(() => this.initWebSocket(), 5e3);
      }, this.socket.onerror = (n) => {
        var s;
        console.error("WebSocket error:", n), (s = this.socket) == null || s.close();
      };
    } catch (n) {
      console.error("WebSocket initialization error:", n);
    }
  }
  /**
   * Notify job listeners about job status updates
   * @param data Job status data
   */
  notifyJobListeners(e) {
    (this.jobListeners[e.id] || []).forEach((n) => {
      try {
        n(e);
      } catch (s) {
        console.error("Error in job listener:", s);
      }
    });
  }
  /**
   * Notify deal listeners about deal status updates
   * @param data Deal data
   */
  notifyDealListeners(e) {
    (this.dealListeners[e.id] || []).forEach((n) => {
      try {
        n(e);
      } catch (s) {
        console.error("Error in deal listener:", s);
      }
    });
  }
  /**
   * Add a listener for job status updates
   * @param jobId The job ID to listen for
   * @param listener The listener function
   * @returns A function to remove the listener
   */
  addJobListener(e, t) {
    return this.jobListeners[e] || (this.jobListeners[e] = []), this.jobListeners[e].push(t), () => {
      this.jobListeners[e] = this.jobListeners[e].filter((n) => n !== t), this.jobListeners[e].length === 0 && delete this.jobListeners[e];
    };
  }
  /**
   * Add a listener for deal status updates
   * @param dealId The deal ID to listen for
   * @param listener The listener function
   * @returns A function to remove the listener
   */
  addDealListener(e, t) {
    return this.dealListeners[e] || (this.dealListeners[e] = []), this.dealListeners[e].push(t), () => {
      this.dealListeners[e] = this.dealListeners[e].filter((n) => n !== t), this.dealListeners[e].length === 0 && delete this.dealListeners[e];
    };
  }
  /**
   * Start a new wizard session with the initial problem
   * @param data Define problem input data
   */
  async startWizard(e) {
    return this.client.post("/wizard/start", e);
  }
  /**
   * Create a new Deal from a problem statement — the canonical entry point
   * for the YCaaS apex chat surface (and any other caller that wants to
   * kick off the deal lifecycle from free text). Wraps
   * `POST /api/wizard/deal/define` (Modules\Deals\Http\Controllers\DealWizardController::define).
   *
   * api/ resolves the subproject from the explicit `subproject_id` body OR
   * the `X-Domain` header on the request (already injected by BaseApiClient).
   * api/ also classifies the problem against an LLM and computes the deal's
   * `required_info` before persisting — those fields come back on the
   * response.
   *
   * Returns the new Deal in state=analyzing, wizard_step=1. Subsequent
   * lifecycle calls go through the other `/wizard/deal/{id}/*` methods
   * on this client (defineProblems, codifySolution, etc.).
   *
   * See `api/docs/CHAT_DEAL_WIRE.md` for the multi-session chat→deal plan.
   */
  async defineDeal(e) {
    return this.client.post("/wizard/deal/define", e);
  }
  /**
   * Process step 1: Define Problem
   * @param dealId Deal ID
   * @param data Define problem input data
   */
  async defineProblems(e, t) {
    return this.client.post(`/wizard/deal/${e}/step/define_problem`, t);
  }
  /**
   * Process step 2: Codify Solution
   * @param dealId Deal ID
   * @param data Codify solution input data
   */
  async codifySolution(e, t) {
    return this.client.post(`/wizard/deal/${e}/step/codify_solution`, t);
  }
  /**
   * Process step 3: Setup Program
   * @param dealId Deal ID
   * @param data Setup program input data
   */
  async setupProgram(e, t) {
    return this.client.post(`/wizard/deal/${e}/step/setup_program`, t);
  }
  /**
   * Process step 4: Execute Program
   * @param dealId Deal ID
   * @param data Execute program input data
   */
  async executeProgram(e, t) {
    return this.client.post(`/wizard/deal/${e}/step/execute_program`, t);
  }
  /**
   * Process step 5: Verify Outcome
   * @param dealId Deal ID
   * @param data Verify outcome input data
   */
  async verifyOutcome(e, t) {
    return this.client.post(`/wizard/deal/${e}/step/verify_outcome`, t);
  }
  /**
   * Get the current status of a job
   * @param jobId Job ID
   */
  async getJobStatus(e) {
    return this.client.get(`/wizard/job/${e}`);
  }
  /**
   * Poll the status of a job until it completes or fails
   * @param jobId Job ID
   * @param interval Polling interval in milliseconds
   * @param timeout Timeout in milliseconds
   */
  async pollJobStatus(e, t = 1e3, n = 3e5) {
    const s = Date.now();
    return new Promise((o, i) => {
      const p = async () => {
        try {
          const u = (await this.getJobStatus(e)).data.data;
          if (u.status === "completed") {
            o(u);
            return;
          }
          if (u.status === "failed") {
            i(new Error(u.error || "Job failed"));
            return;
          }
          if (Date.now() - s >= n) {
            i(new Error("Job polling timed out"));
            return;
          }
          setTimeout(p, t);
        } catch (l) {
          i(l);
        }
      };
      p();
    });
  }
  /**
   * Get a deal by ID
   * @param dealId Deal ID
   */
  async getDeal(e) {
    return this.client.get(`/wizard/deal/${e}`);
  }
  /**
   * Get all deal snapshots
   * @param dealId Deal ID
   */
  async getDealSnapshots(e) {
    return this.client.get(`/wizard/deal/${e}/snapshots`);
  }
  /**
   * Get a specific deal snapshot
   * @param dealId Deal ID
   * @param version Snapshot version
   */
  async getDealSnapshot(e, t) {
    return this.client.get(`/wizard/deal/${e}/snapshot/${t}`);
  }
  /**
   * Compare two deal snapshots
   * @param dealId Deal ID
   * @param baseVersion Base version
   * @param compareVersion Compare version
   */
  async compareDealSnapshots(e, t, n) {
    return this.client.get(
      `/wizard/deal/${e}/compare?base_version=${t}&compare_version=${n}`
    );
  }
  /**
   * Restore a deal to a specific snapshot version
   * @param dealId Deal ID
   * @param version Snapshot version
   */
  async restoreDealSnapshot(e, t) {
    return this.client.post(`/wizard/deal/${e}/restore/${t}`);
  }
  /**
   * Get the complete wizard response (deal, program, protocol)
   * @param dealId Deal ID
   */
  async getWizardResponse(e) {
    return this.client.get(`/wizard/deal/${e}/response`);
  }
  /**
   * Create a deal snapshot manually
   * @param dealId Deal ID
   * @param comment Snapshot comment
   */
  async createDealSnapshot(e, t) {
    return this.client.post(`/wizard/deal/${e}/snapshot`, { comment: t });
  }
}
const R = new Ue({
  baseURL: typeof window < "u" ? window.location.hostname === "localhost" ? "http://localhost:8000/api" : "/api" : "https://api.example.com/api"
});
class P {
  constructor(e, t) {
    this.client = e, this.stepFunction = t;
  }
  /**
   * Process the step, handling asynchronous job processing automatically
   * @param dealId Deal ID
   * @param data Step input data
   * @param onProgress Progress callback
   * @param onDealUpdate Deal update callback
   */
  async process(e, t, n, s) {
    const i = (await this.stepFunction(e, t)).data.data;
    if (!i.is_async)
      return i.deal;
    if (!i.job_id)
      throw new Error("Asynchronous job ID not provided");
    let p, l;
    n && (p = this.client.addJobListener(i.job_id, (u) => {
      n(u.progress);
    })), s && (l = this.client.addDealListener(e, (u) => {
      s(u);
    }));
    try {
      const u = await this.client.pollJobStatus(i.job_id);
      return (await this.client.getDeal(e)).data.data;
    } finally {
      p && p(), l && l();
    }
  }
}
const He = {
  defineProblems: new P(
    R,
    (r, e) => R.defineProblems(r, e)
  ),
  codifySolution: new P(
    R,
    (r, e) => R.codifySolution(r, e)
  ),
  setupProgram: new P(
    R,
    (r, e) => R.setupProgram(r, e)
  ),
  executeProgram: new P(
    R,
    (r, e) => R.executeProgram(r, e)
  ),
  verifyOutcome: new P(
    R,
    (r, e) => R.verifyOutcome(r, e)
  )
};
function S(r, e) {
  return r ? {
    ...e ?? {},
    headers: { ...(e == null ? void 0 : e.headers) ?? {}, "Idempotency-Key": r }
  } : e;
}
class Oe extends c {
  // ---------------------------------------------------------------------------
  // Step 1 — define + read snapshots
  // ---------------------------------------------------------------------------
  /**
   * POST /api/wizard/deal/define — create a Deal from a free-text statement.
   *
   * api validates `statement` (1–8000 chars) + optional `tld`; resolves the
   * tenant from the explicit `tld` / `X-Domain` header, classifies the problem
   * (LLM) and computes `required_info` before persisting. Returns the new Deal
   * in `state=analyzing`, `wizard_step=1` with a top-level `id` alias.
   */
  async defineDeal(e, t, n) {
    return this.post(
      "/api/wizard/deal/define",
      e,
      S(t, n)
    );
  }
  /** GET /api/wizard/deal/{deal_id}/status — full DealResource snapshot. */
  async getStatus(e) {
    return this.get(
      `/api/wizard/deal/${encodeURIComponent(e)}/status`
    );
  }
  /**
   * GET /api/wizard/deal/{deal_id}/events — paginated append-only audit log.
   * `per_page` is clamped server-side to 1–200 (default 50).
   */
  async getEvents(e, t) {
    const n = (t == null ? void 0 : t.per_page) === void 0 ? void 0 : { per_page: t.per_page };
    return this.get(
      `/api/wizard/deal/${encodeURIComponent(e)}/events`,
      n
    );
  }
  // ---------------------------------------------------------------------------
  // Step 1 continuation → Step 2 (codify) → Step 3 (setup) → Step 4 (start)
  // ---------------------------------------------------------------------------
  /**
   * POST /api/wizard/deal/{deal_id}/required-info — submit answers to the
   * Step-1 follow-up questions. Advances `analyzing` → `codified`. Returns a
   * 422 `{error:'missing_required_info', missing:[...]}` when a declared key
   * is unanswered.
   */
  async submitRequiredInfo(e, t, n, s) {
    return this.post(
      `/api/wizard/deal/${encodeURIComponent(e)}/required-info`,
      t,
      S(n, s)
    );
  }
  /**
   * POST /api/wizard/deal/{deal_id}/codify — Step 2 solution generation.
   * No request body (LLM-driven). Requires `state=codified`. When the
   * `deals.step2_strict_schema` flag is on, a generation failure returns
   * 502 `{error:'solution_generation_failed', message}`.
   */
  async codify(e, t, n) {
    return this.post(
      `/api/wizard/deal/${encodeURIComponent(e)}/codify`,
      void 0,
      S(t, n)
    );
  }
  /**
   * POST /api/wizard/deal/{deal_id}/select-solution — pick one of the
   * generated solutions by zero-based index. Does not advance state.
   */
  async selectSolution(e, t, n, s) {
    return this.post(
      `/api/wizard/deal/${encodeURIComponent(e)}/select-solution`,
      t,
      S(n, s)
    );
  }
  /**
   * POST /api/wizard/deal/{deal_id}/setup — Step 3. Materializes pipeline
   * steps and advances `codified` → `setup`. No request body.
   */
  async setup(e, t, n) {
    return this.post(
      `/api/wizard/deal/${encodeURIComponent(e)}/setup`,
      void 0,
      S(t, n)
    );
  }
  /**
   * POST /api/wizard/deal/{deal_id}/start — Step 3→4 transition. Advances
   * `setup` → `executing`. No request body.
   */
  async start(e, t, n) {
    return this.post(
      `/api/wizard/deal/${encodeURIComponent(e)}/start`,
      void 0,
      S(t, n)
    );
  }
  // ---------------------------------------------------------------------------
  // Intake (F1/F2) steps — metadata / details / files / path / submit
  // ---------------------------------------------------------------------------
  /**
   * PATCH /api/wizard/deal/{deal_id}/metadata — intake step 1: title,
   * description (≥50 chars), applicant_type, optional related_industries.
   * Caller must be the deal creator/owner (403 otherwise). PATCH is sent as
   * POST + `?_method=PATCH`.
   */
  async patchMetadata(e, t, n, s) {
    return this.patch(
      `/api/wizard/deal/${encodeURIComponent(e)}/metadata`,
      t,
      S(n, s)
    );
  }
  /**
   * PATCH /api/wizard/deal/{deal_id}/details — intake step 2: customer,
   * program window, budget_tier. Creator/owner only.
   */
  async patchDetails(e, t, n, s) {
    return this.patch(
      `/api/wizard/deal/${encodeURIComponent(e)}/details`,
      t,
      S(n, s)
    );
  }
  /**
   * POST /api/wizard/deal/{deal_id}/files — intake step 3: multipart upload.
   * `file` (≤10 MB) + `file_type` in {document,image,logo}. The `File`/`Blob`
   * in the body auto-promotes the request to `multipart/form-data` via
   * `BaseApiClient`. Returns 201 with the new `deal_files` row. Creator/owner
   * only.
   */
  async uploadFile(e, t, n, s) {
    return this.post(
      `/api/wizard/deal/${encodeURIComponent(e)}/files`,
      t,
      S(n, s)
    );
  }
  /**
   * DELETE /api/wizard/deal/{deal_id}/files/{file_id} — mid-wizard file
   * removal. Idempotent: 204 on delete/no-op, 404 if the file is unknown.
   * Creator/owner only. A real DELETE on the wire.
   */
  async deleteFile(e, t, n, s) {
    return this.delete(
      `/api/wizard/deal/${encodeURIComponent(e)}/files/${encodeURIComponent(String(t))}`,
      S(n, s)
    );
  }
  /**
   * PATCH /api/wizard/deal/{deal_id}/path — intake step 4: path_tier in
   * {pink,green,blue,red,black}. Creator/owner only.
   */
  async patchPath(e, t, n, s) {
    return this.patch(
      `/api/wizard/deal/${encodeURIComponent(e)}/path`,
      t,
      S(n, s)
    );
  }
  /**
   * POST /api/wizard/deal/{deal_id}/submit — intake step 5: finalize and
   * transition to `awaiting_compute`. Gates on applicant_type/title/
   * description/budget_tier/path_tier being present (422
   * `{error:'missing_wizard_data', missing:[...]}` otherwise). No request
   * body. Creator/owner only.
   */
  async submit(e, t, n) {
    return this.post(
      `/api/wizard/deal/${encodeURIComponent(e)}/submit`,
      void 0,
      S(t, n)
    );
  }
  // ---------------------------------------------------------------------------
  // Compute deposit (F3) + Step 5 outcome verification
  // ---------------------------------------------------------------------------
  /**
   * POST /api/wizard/deal/{deal_id}/compute-deposit — mint a Stripe
   * PaymentIntent for the 5-tier deposit ladder. `amount_cents` must be one of
   * 100 / 1000 / 10000 / 100000 / 1000000. Returns `{ client_secret }`.
   */
  async computeDeposit(e, t, n, s) {
    return this.post(
      `/api/wizard/deal/${encodeURIComponent(e)}/compute-deposit`,
      t,
      S(n, s)
    );
  }
  /**
   * POST /api/wizard/deal/{deal_id}/verify/{execution_id} — Step 5 synchronous
   * outcome verification. Empty body. `execution_id` is numeric (api route
   * constraint `[0-9]+`). Returns `{ deal_id, state, outcome_score,
   * outcome_class, outcome_report }`. Illegal state transitions return 409.
   */
  async verifyOutcome(e, t, n, s) {
    return this.post(
      `/api/wizard/deal/${encodeURIComponent(e)}/verify/${encodeURIComponent(String(t))}`,
      void 0,
      S(n, s)
    );
  }
}
class Je extends c {
  // ---------------------------------------------------------------------------
  // Public auth (no Bearer token required — uses { auth: false })
  // ---------------------------------------------------------------------------
  /** POST /api/dashboard/auth-by-social-token */
  async dashboardAuthBySocialToken(e) {
    return this.post(
      "/api/dashboard/auth-by-social-token",
      e,
      { auth: !1 }
    );
  }
  /** GET /api/dashboard/auth/{token} */
  async dashboardAuthByToken(e) {
    return this.get(
      `/api/dashboard/auth/${encodeURIComponent(e)}`,
      void 0,
      { auth: !1 }
    );
  }
  /** POST /api/dashboard/join */
  async dashboardJoin(e) {
    return this.post("/api/dashboard/join", e, { auth: !1 });
  }
  /** GET /api/dashboard/join/{token} */
  async dashboardJoinByToken(e) {
    return this.get(
      `/api/dashboard/join/${encodeURIComponent(e)}`,
      void 0,
      { auth: !1 }
    );
  }
  /** POST /api/dashboard/login */
  async dashboardLogin(e) {
    return this.post("/api/dashboard/login", e, {
      auth: !1
    });
  }
  /** GET /api/logout (auth=api — Bearer required) */
  async logout() {
    return this.get("/api/logout");
  }
  /**
   * POST /api/public/auth/finish-social-registration
   * NOTE: spec auth is `api` despite the `/public/` prefix. Bearer required.
   */
  async finishSocialRegistration(e) {
    return this.post(
      "/api/public/auth/finish-social-registration",
      e
    );
  }
  /** POST /api/public/auth/new-password */
  async newPassword(e) {
    return this.post("/api/public/auth/new-password", e, {
      auth: !1
    });
  }
  /**
   * GET /api/public/auth/protocol-chain/get-user-by-invite/{token}/{source?}
   * `source` is optional in the path.
   */
  async getUserByInvite(e, t) {
    const n = t ? `/${encodeURIComponent(t)}` : "";
    return this.get(
      `/api/public/auth/protocol-chain/get-user-by-invite/${encodeURIComponent(e)}${n}`,
      void 0,
      { auth: !1 }
    );
  }
  /** POST /api/public/auth/reset */
  async resetPassword(e) {
    return this.post("/api/public/auth/reset", e, { auth: !1 });
  }
  /** POST /api/public/auth/sign-in */
  async signIn(e) {
    return this.post("/api/public/auth/sign-in", e, {
      auth: !1
    });
  }
  /**
   * POST /api/public/auth/sign-up
   * NOTE: spec auth is `api` (Bearer required) — register-while-authenticated
   * flow. Apparently load-bearing for `team` / `tenant` invites.
   */
  async signUp(e) {
    return this.post("/api/public/auth/sign-up", e);
  }
  // ---------------------------------------------------------------------------
  // /api/user/* (singular namespace)
  // ---------------------------------------------------------------------------
  /** POST /api/user/change-cover/{user} */
  async userChangeCover(e, t) {
    return this.post(`/api/user/change-cover/${e}`, t);
  }
  /** POST /api/user/change-photo/{user} */
  async userChangePhoto(e, t) {
    return this.post(`/api/user/change-photo/${e}`, t);
  }
  /** GET /api/user/creator-dashboard */
  async getCreatorDashboard() {
    return this.get("/api/user/creator-dashboard");
  }
  /** GET /api/user/creator-stats */
  async getCreatorStats() {
    return this.get("/api/user/creator-stats");
  }
  /** POST /api/user/finish-codify-registration */
  async finishCodifyRegistration(e) {
    return this.post(
      "/api/user/finish-codify-registration",
      e
    );
  }
  /** GET /api/user/get-data */
  async getUserData() {
    return this.get("/api/user/get-data");
  }
  /** GET /api/user/get-wallet */
  async getWallet() {
    return this.get("/api/user/get-wallet");
  }
  /** POST /api/user/set-timezone */
  async setTimezone(e) {
    return this.post("/api/user/set-timezone", e);
  }
  /** GET /api/user/{user} (admin) */
  async adminShowUser(e) {
    return this.get(`/api/user/${e}`);
  }
  /** PUT /api/user/{user} (admin) */
  async adminUpdateUser(e, t) {
    return this.put(`/api/user/${e}`, t);
  }
  /** DELETE /api/user/{user} (admin) */
  async adminDestroyUser(e) {
    return this.delete(`/api/user/${e}`);
  }
  // ---------------------------------------------------------------------------
  // /api/users/* (plural namespace)
  // ---------------------------------------------------------------------------
  /** GET /api/users/assigned-tags/{category} */
  async getAssignedTags(e) {
    return this.get(`/api/users/assigned-tags/${e}`);
  }
  /** POST /api/users/become-creator/{user} */
  async becomeCreator(e) {
    return this.post(`/api/users/become-creator/${e}`);
  }
  /** GET /api/users/can-creator/{user} */
  async canCreator(e) {
    return this.get(`/api/users/can-creator/${e}`);
  }
  /** POST /api/users/change-cover/{user} */
  async usersChangeCover(e, t) {
    return this.post(`/api/users/change-cover/${e}`, t);
  }
  /** POST /api/users/change-photo/{user} */
  async usersChangePhoto(e, t) {
    return this.post(`/api/users/change-photo/${e}`, t);
  }
  /** POST /api/users/delete-role */
  async deleteRole(e) {
    return this.post("/api/users/delete-role", e);
  }
  /** DELETE /api/users/delete/{user} — body carries the password confirmation. */
  async deleteUser(e, t) {
    return this.request(
      `/api/users/delete/${e}`,
      { method: "DELETE", body: JSON.stringify(t) }
    );
  }
  /** GET /api/users/find/{searchQuery} */
  async findUsers(e) {
    return this.get(
      `/api/users/find/${encodeURIComponent(e)}`,
      void 0,
      { auth: !1 }
    );
  }
  /** GET /api/users/get-available-roles */
  async getAvailableRoles() {
    return this.get("/api/users/get-available-roles");
  }
  /** POST /api/users/get-code */
  async getCode(e) {
    return this.post("/api/users/get-code", e);
  }
  /** GET /api/users/get-pricing */
  async getPricing() {
    return this.get("/api/users/get-pricing");
  }
  /** GET /api/users/get-restricted-users (paginated) */
  async getRestrictedUsers() {
    return this.get(
      "/api/users/get-restricted-users"
    );
  }
  /** GET /api/users/get-role-category/{category} */
  async getRoleCategory(e) {
    return this.get(`/api/users/get-role-category/${e}`);
  }
  /** GET /api/users/get-roles */
  async getRoles() {
    return this.get("/api/users/get-roles");
  }
  /** GET /api/users/get-sessions */
  async getSessions() {
    return this.get("/api/users/get-sessions");
  }
  /** POST /api/users/handle-user-tag */
  async handleUserTag(e) {
    return this.post("/api/users/handle-user-tag", e);
  }
  /** GET /api/users/id/{user} */
  async getUserById(e) {
    return this.get(
      `/api/users/id/${e}`,
      void 0,
      { auth: !1 }
    );
  }
  /** GET /api/users/name/{username} */
  async getUserByName(e) {
    return this.get(
      `/api/users/name/${encodeURIComponent(e)}`,
      void 0,
      { auth: !1 }
    );
  }
  /** GET /api/users/referral */
  async getReferral() {
    return this.get("/api/users/referral");
  }
  /** GET /api/users/referral/transactions (paginated) */
  async getReferralTransactions() {
    return this.get("/api/users/referral/transactions");
  }
  /** GET /api/users/remove-restriction/{restriction} (paginated) */
  async removeRestriction(e) {
    return this.get(
      `/api/users/remove-restriction/${e}`
    );
  }
  /** POST /api/users/restrict/{user} */
  async restrictUser(e, t = {}) {
    return this.post(`/api/users/restrict/${e}`, t);
  }
  /** POST /api/users/set-role */
  async setRole(e) {
    return this.post("/api/users/set-role", e);
  }
  /** PATCH /api/users/update-billing-info */
  async updateBillingInfo(e) {
    return this.patch("/api/users/update-billing-info", e);
  }
  /** PATCH /api/users/update-password/{user} */
  async updatePassword(e, t) {
    return this.patch(`/api/users/update-password/${e}`, t);
  }
  /** PATCH /api/users/update-phone */
  async updatePhone(e) {
    return this.patch("/api/users/update-phone", e);
  }
  /** POST /api/users/update-pricing */
  async updatePricing(e) {
    return this.post("/api/users/update-pricing", e);
  }
  /** PATCH /api/users/update/{user} */
  async updateUser(e, t) {
    return this.patch(`/api/users/update/${e}`, t);
  }
  /**
   * GET /api/me/accessible-subprojects — tenant switcher: subprojects the
   * authenticated user can pivot into. Computed from the auth context
   * server-side; not subproject-scoped (works across X-Domain).
   *
   * Bearer required (auth:api). Returns a flat list of subproject
   * summaries — the calling UI typically renders these as a switcher
   * menu. Shape is left open (`EmptyOk[]`) since the spec is not yet
   * frozen; consumers should cast through `unknown` if they need a
   * stricter type.
   */
  async getAccessibleSubprojects() {
    return this.get("/api/me/accessible-subprojects");
  }
}
function C(r) {
  return r == null || r === "" ? "" : `/${encodeURIComponent(String(r))}`;
}
class we extends c {
  // ===========================================================================
  // CI-WWW boot endpoints (hierarchy-aware loadSubproject lives here)
  // ===========================================================================
  /**
   * GET /api/load — load the active subproject's boot data, normalized
   * to the hierarchy-aware `Subproject` shape.
   *
   * Public endpoint (no Bearer required). Special-cased: 404 must NOT
   * throw — CI-WWW renders a "subproject not found" page from the
   * false branch. Returns a discriminated union so callers can switch
   * on `.ok`.
   *
   * Normalization (additive over the legacy `TenancyApiClient`
   * version):
   *
   *   - `parent_subproject_id` defaults to `null` when missing on the
   *     api/ payload.
   *   - `chain` defaults to `[]` when missing. The api/ side is
   *     expected to project this as a pre-flattened ancestor list,
   *     leaf -> root, EXCLUDING the leaf — see the Subproject type
   *     docs. Until the sibling api/ ticket lands, every leaf will
   *     just see `chain: []` and behave like a root, which is
   *     intentional: existing flat-subproject installs keep working
   *     without any api/ change.
   *
   * Discriminator is *presence of `data`*, not a `success` flag. The
   * Laravel side emits `{"data": {…}}` on hit (via JsonResource or
   * manual wrap for the apex root) and `{"error": "Subproject not
   * found"}` with no `data` field on miss.
   */
  async loadSubproject() {
    const t = await this.request(
      "/api/load",
      { method: "GET" },
      { auth: !1, validateStatus: () => !0 }
    );
    if (t && t.data && typeof t.data == "object") {
      const n = t.data;
      return { status: 200, ok: !0, data: {
        ...n,
        id: typeof n.id == "number" ? n.id : Number(n.id),
        name: n.name,
        parent_subproject_id: typeof n.parent_subproject_id == "number" ? n.parent_subproject_id : n.parent_subproject_id == null ? null : Number(n.parent_subproject_id),
        chain: Array.isArray(n.chain) ? n.chain : []
      } };
    }
    return { status: 404, ok: !1, data: null };
  }
  /**
   * @deprecated Use `loadSubproject()` — we don't have "tenants", we
   * have subprojects. Kept as an alias so existing callers in `app/`,
   * `gov/`, and `sys/` keep working until they migrate. Will be
   * removed in 2.0.0.
   */
  async loadTenant() {
    return this.loadSubproject();
  }
  /** GET /api/board — public dashboard defaults. */
  async loadBoard() {
    return this.get(
      "/api/board",
      void 0,
      { auth: !1 }
    );
  }
  /** GET /api/leader — public leader info. */
  async loadLeader() {
    return this.get("/api/leader", void 0, { auth: !1 });
  }
  /** GET /api/interface/load-interface — public interface payload. */
  async loadInterface() {
    return this.get(
      "/api/interface/load-interface",
      void 0,
      { auth: !1 }
    );
  }
  /** GET /api/authenticate-at/{tenant} — auth=api. */
  async authenticateAtTenant(e) {
    return this.get(
      `/api/authenticate-at/${encodeURIComponent(e)}`
    );
  }
  /** GET /api/public/logo/{tenant} — public tenant logo. */
  async getPublicTenantLogo(e) {
    return this.get(
      `/api/public/logo/${encodeURIComponent(e)}`,
      void 0,
      { auth: !1 }
    );
  }
  // ===========================================================================
  // Hierarchy-aware DPG instance bindings
  // ===========================================================================
  /**
   * GET /api/subprojects/{id}/dpg-instances — return the DPG bindings
   * for a specific subproject, including which ancestor (if any)
   * contributed each binding via inheritance.
   *
   * Auth: api guard (Bearer required). The endpoint is per-subproject
   * by id rather than X-Domain-resolved because the hierarchy view
   * intentionally allows reading across the inheritance chain (an
   * ancestor's bindings show up on the leaf with
   * `inherited_from_subproject_id` set to the ancestor's id).
   *
   * IMPORTANT: as of SDK 1.3.0 the matching api/ route does not yet
   * exist — `subproject_dpg_instances` is modeled in
   * `api/Modules/Systems/` (`SubprojectDpgInstance` entity +
   * migration), but only the X-Domain-scoped `GET
   * /api/v1/subprojects/current/system` reads it today. Sibling api/
   * work is required to:
   *
   *   1. Add `Route::get('subprojects/{id}/dpg-instances', ...)` under
   *      the `auth:api` middleware (api/Modules/Systems/Routes/api.php).
   *   2. Resolve `inherited_from_subproject_id` server-side by walking
   *      the `parent_project` chain and overlaying the leaf's own
   *      bindings on top of each ancestor's (leaf wins per system_key).
   *
   * Consumers can mock this route via MSW in the meantime — see
   * `src/api/__tests__/subproject.test.ts` for the contract.
   */
  async getDpgInstances(e) {
    return this.get(
      `/api/subprojects/${encodeURIComponent(String(e))}/dpg-instances`
    );
  }
  /**
   * GET /api/v1/subprojects/current/system — read-only DPG / system
   * config for the X-Domain-resolved subproject. Public endpoint (no
   * Bearer required); the data exposed is non-sensitive (DNS-derived).
   * The Systems module owns this route on the backend — see
   * `api/Modules/Systems/Routes/api.php` and `SubprojectSystemsController`.
   *
   * Shape is left open (`SubprojectSystemData`) because the upstream
   * controller is still maturing; consumers should cast to a stricter
   * type at the call site if they need one.
   */
  async getCurrentSubprojectSystem() {
    return this.get(
      "/api/v1/subprojects/current/system",
      void 0,
      { auth: !1 }
    );
  }
  // ===========================================================================
  // Subproject CRUD
  // ===========================================================================
  /** GET /api/subproject (paginated). */
  async listSubprojects(e) {
    return this.get("/api/subproject", e);
  }
  /** GET /api/subproject/all */
  async listAllSubprojects() {
    return this.get("/api/subproject/all");
  }
  /** GET /api/subproject/{subproject} */
  async showSubproject(e) {
    return this.get(`/api/subproject/${encodeURIComponent(String(e))}`);
  }
  /** DELETE /api/subproject/{subproject} */
  async deleteSubproject(e) {
    return this.delete(`/api/subproject/${encodeURIComponent(String(e))}`);
  }
  /** POST /api/subproject/delete-category/{subproject} */
  async deleteSubprojectCategory(e, t) {
    return this.post(
      `/api/subproject/delete-category/${encodeURIComponent(String(e))}`,
      t
    );
  }
  // ===========================================================================
  // Subproject admin lifecycle
  // ===========================================================================
  /** GET /api/subproject-admin/account-data */
  async getSubprojectAdminAccountData() {
    return this.get("/api/subproject-admin/account-data");
  }
  /** POST /api/subproject-admin/confirm-account */
  async confirmSubprojectAdminAccount(e) {
    return this.post("/api/subproject-admin/confirm-account", e);
  }
  /** POST /api/subproject-admin/create-account (public). */
  async createSubprojectAdminAccount(e) {
    return this.post(
      "/api/subproject-admin/create-account",
      e,
      { auth: !1 }
    );
  }
  /** GET /api/subproject-admin/create-subscription */
  async createSubprojectAdminSubscription() {
    return this.get("/api/subproject-admin/create-subscription");
  }
  /** POST /api/subproject-admin/find-claimable */
  async findClaimableSubproject(e) {
    return this.post("/api/subproject-admin/find-claimable", e);
  }
  /** GET /api/subproject-admin/get-allowed-countries (public). */
  async getSubprojectAdminAllowedCountries() {
    return this.get(
      "/api/subproject-admin/get-allowed-countries",
      void 0,
      { auth: !1 }
    );
  }
  /** POST /api/subproject-admin/login (public). */
  async subprojectAdminLogin(e) {
    return this.post("/api/subproject-admin/login", e, { auth: !1 });
  }
  /** POST /api/subproject-admin/subproject/has-contacts */
  async subprojectAdminHasContacts(e) {
    return this.post("/api/subproject-admin/subproject/has-contacts", e);
  }
  /** GET /api/subproject-admin/subscription-status */
  async getSubprojectAdminSubscriptionStatus() {
    return this.get("/api/subproject-admin/subscription-status");
  }
  /** POST /api/subproject-admin/start-claiming/{subproject}/claim */
  async startSubprojectClaim(e, t) {
    return this.post(
      `/api/subproject-admin/start-claiming/${encodeURIComponent(String(e))}/claim`,
      t
    );
  }
  // -- claim sections (saving step bodies for an in-flight claim) -------------
  /** POST /api/subproject-admin/claim/subproject/{subproject}/content */
  async saveClaimedSubprojectContent(e, t) {
    return this.post(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(e))}/content`,
      t
    );
  }
  /** POST /api/subproject-admin/claim/subproject/{subproject}/domains */
  async saveClaimedSubprojectDomains(e, t) {
    return this.post(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(e))}/domains`,
      t
    );
  }
  /** POST /api/subproject-admin/claim/subproject/{subproject}/layout */
  async saveClaimedSubprojectLayout(e, t) {
    return this.post(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(e))}/layout`,
      t
    );
  }
  /** POST /api/subproject-admin/claim/subproject/{subproject}/seo */
  async saveClaimedSubprojectSeo(e, t) {
    return this.post(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(e))}/seo`,
      t
    );
  }
  /** POST /api/subproject-admin/claim/subproject/{subproject}/team */
  async saveClaimedSubprojectTeam(e, t) {
    return this.post(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(e))}/team`,
      t
    );
  }
  /** POST /api/subproject-admin/claim/subproject/{subproject}/template */
  async saveClaimedSubprojectTemplate(e, t) {
    return this.post(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(e))}/template`,
      t
    );
  }
  /** GET /api/subproject-admin/claim/subproject/{subproject}/wizard-instance */
  async getClaimedSubprojectWizardInstance(e) {
    return this.get(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(e))}/wizard-instance`
    );
  }
  // -- create sections (greenfield subproject creation flow) ------------------
  /** POST /api/subproject-admin/create/subproject/content */
  async createSubprojectContent(e) {
    return this.post("/api/subproject-admin/create/subproject/content", e);
  }
  /** POST /api/subproject-admin/create/subproject/domains */
  async createSubprojectDomains(e) {
    return this.post("/api/subproject-admin/create/subproject/domains", e);
  }
  /** POST /api/subproject-admin/create/subproject/layout */
  async createSubprojectLayout(e) {
    return this.post("/api/subproject-admin/create/subproject/layout", e);
  }
  /** POST /api/subproject-admin/create/subproject/seo */
  async createSubprojectSeo(e) {
    return this.post("/api/subproject-admin/create/subproject/seo", e);
  }
  /** POST /api/subproject-admin/create/subproject/team */
  async createSubprojectTeam(e) {
    return this.post("/api/subproject-admin/create/subproject/team", e);
  }
  /** POST /api/subproject-admin/create/subproject/template */
  async createSubprojectTemplate(e) {
    return this.post("/api/subproject-admin/create/subproject/template", e);
  }
  // ===========================================================================
  // Subproject misc
  // ===========================================================================
  /** POST /api/subproject-search */
  async searchSubprojects(e) {
    return this.post("/api/subproject-search", e);
  }
  /** GET /api/subproject-settings */
  async getSubprojectSettings() {
    return this.get("/api/subproject-settings");
  }
  /** GET /api/subproject-types */
  async getSubprojectTypes() {
    return this.get("/api/subproject-types");
  }
  // ===========================================================================
  // Subproject team
  // ===========================================================================
  /** DELETE /api/subproject-team/delete-invite/{id}/{subproject?} */
  async deleteSubprojectTeamInvite(e, t) {
    return this.delete(
      `/api/subproject-team/delete-invite/${encodeURIComponent(String(e))}${C(t)}`
    );
  }
  /** GET /api/subproject-team/get-invites/{subproject?} */
  async getSubprojectTeamInvites(e) {
    return this.get(`/api/subproject-team/get-invites${C(e)}`);
  }
  /** POST /api/subproject-team/renew-token/{subproject?} */
  async renewSubprojectTeamToken(e, t) {
    const n = typeof e == "number" || typeof e == "string", s = n ? e : void 0, o = n ? t ?? {} : e;
    return this.post(
      `/api/subproject-team/renew-token${C(s)}`,
      o
    );
  }
  /** POST /api/subproject-team/send-invites/{subproject?} */
  async sendSubprojectTeamInvites(e, t) {
    const n = typeof e == "number" || typeof e == "string", s = n ? e : void 0, o = n ? t ?? {} : e;
    return this.post(
      `/api/subproject-team/send-invites${C(s)}`,
      o
    );
  }
  /** POST /api/subproject-team/update-permissions/{subproject?} */
  async updateSubprojectTeamPermissions(e, t) {
    const n = typeof e == "number" || typeof e == "string", s = n ? e : void 0, o = n ? t ?? {} : e;
    return this.post(
      `/api/subproject-team/update-permissions${C(s)}`,
      o
    );
  }
  // ===========================================================================
  // Subproject wizard
  // ===========================================================================
  /** POST /api/subproject-wizard/content/{id} */
  async saveSubprojectWizardContent(e, t) {
    return this.post(
      `/api/subproject-wizard/content/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** GET /api/subproject-wizard/creation-started */
  async getSubprojectWizardCreationStarted() {
    return this.get("/api/subproject-wizard/creation-started");
  }
  /** POST /api/subproject-wizard/domains/{id} */
  async saveSubprojectWizardDomains(e, t) {
    return this.post(
      `/api/subproject-wizard/domains/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** GET /api/subproject-wizard/get */
  async getSubprojectWizard() {
    return this.get("/api/subproject-wizard/get");
  }
  /** POST /api/subproject-wizard/layout/{id} */
  async saveSubprojectWizardLayout(e, t) {
    return this.post(
      `/api/subproject-wizard/layout/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** POST /api/subproject-wizard/seo/{id} */
  async saveSubprojectWizardSeo(e, t) {
    return this.post(
      `/api/subproject-wizard/seo/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** POST /api/subproject-wizard/team/{id} */
  async saveSubprojectWizardTeam(e, t) {
    return this.post(
      `/api/subproject-wizard/team/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** POST /api/subproject-wizard/template/{id} */
  async saveSubprojectWizardTemplate(e, t) {
    return this.post(
      `/api/subproject-wizard/template/${encodeURIComponent(String(e))}`,
      t
    );
  }
  // ===========================================================================
  // Project settings (the live, post-creation domain settings UI)
  // ===========================================================================
  /** GET /api/project-settings/content/show/{subproject?} */
  async getProjectSettingsContent(e) {
    return this.get(`/api/project-settings/content/show${C(e)}`);
  }
  /** POST /api/project-settings/content/{subproject?} */
  async saveProjectSettingsContent(e, t) {
    const n = typeof e == "number" || typeof e == "string", s = n ? e : void 0, o = n ? t ?? {} : e;
    return this.post(
      `/api/project-settings/content${C(s)}`,
      o
    );
  }
  /** GET /api/project-settings/domain-settings/{subproject?} */
  async getProjectSettingsDomainSettings(e) {
    return this.get(`/api/project-settings/domain-settings${C(e)}`);
  }
  /** GET /api/project-settings/domains/show/{subproject?} */
  async getProjectSettingsDomains(e) {
    return this.get(`/api/project-settings/domains/show${C(e)}`);
  }
  /** POST /api/project-settings/domains/{subproject?} */
  async saveProjectSettingsDomains(e, t) {
    const n = typeof e == "number" || typeof e == "string", s = n ? e : void 0, o = n ? t ?? {} : e;
    return this.post(
      `/api/project-settings/domains${C(s)}`,
      o
    );
  }
  /** GET /api/project-settings/layout/show/{subproject?} */
  async getProjectSettingsLayout(e) {
    return this.get(`/api/project-settings/layout/show${C(e)}`);
  }
  /** POST /api/project-settings/layout/{subproject?} */
  async saveProjectSettingsLayout(e, t) {
    const n = typeof e == "number" || typeof e == "string", s = n ? e : void 0, o = n ? t ?? {} : e;
    return this.post(
      `/api/project-settings/layout${C(s)}`,
      o
    );
  }
  /** GET /api/project-settings/seo/show/{subproject?} */
  async getProjectSettingsSeo(e) {
    return this.get(`/api/project-settings/seo/show${C(e)}`);
  }
  /** POST /api/project-settings/seo/{subproject?} */
  async saveProjectSettingsSeo(e, t) {
    const n = typeof e == "number" || typeof e == "string", s = n ? e : void 0, o = n ? t ?? {} : e;
    return this.post(`/api/project-settings/seo${C(s)}`, o);
  }
  /** GET /api/project-settings/template/show/{subproject?} */
  async getProjectSettingsTemplate(e) {
    return this.get(`/api/project-settings/template/show${C(e)}`);
  }
  /** POST /api/project-settings/template/{subproject?} */
  async saveProjectSettingsTemplate(e, t) {
    const n = typeof e == "number" || typeof e == "string", s = n ? e : void 0, o = n ? t ?? {} : e;
    return this.post(
      `/api/project-settings/template${C(s)}`,
      o
    );
  }
  // ===========================================================================
  // Tenant claim — the on-the-wire path stays `tenant-claim` because the
  // Laravel route names are stable; SDK methods keep the same names too
  // since "tenant claim" is a domain-specific concept (KYC + ownership
  // transfer) that maps to a Laravel tenant in this product line.
  // ===========================================================================
  /** POST /api/tenant-claim/complete */
  async completeTenantClaim(e) {
    return this.post("/api/tenant-claim/complete", e);
  }
  /** GET /api/tenant-claim/details/{id} */
  async getTenantClaimDetails(e) {
    return this.get(
      `/api/tenant-claim/details/${encodeURIComponent(String(e))}`
    );
  }
  /** POST /api/tenant-claim/initiate */
  async initiateTenantClaim(e) {
    return this.post("/api/tenant-claim/initiate", e);
  }
  /** GET /api/tenant-claim/my-claim */
  async getMyTenantClaim() {
    return this.get("/api/tenant-claim/my-claim");
  }
  /** GET /api/tenant-claim/search */
  async searchTenantClaims(e) {
    return this.get("/api/tenant-claim/search", e);
  }
  /** GET /api/tenant-claim/status/{token} */
  async getTenantClaimStatus(e) {
    return this.get(
      `/api/tenant-claim/status/${encodeURIComponent(e)}`
    );
  }
  /**
   * POST /api/tenant-claim/verify (multipart/form-data; KYC docs).
   * `BaseApiClient.post` automatically switches to FormData when the body
   * carries a `Blob` / `File`.
   */
  async verifyTenantClaim(e) {
    return this.post("/api/tenant-claim/verify", e);
  }
  // ===========================================================================
  // Tenant interface graph
  // ===========================================================================
  /** GET /api/tenant-interface-block/by-page/{page_id} */
  async getTenantInterfaceBlocksByPage(e) {
    return this.get(
      `/api/tenant-interface-block/by-page/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/tenant-interface-page/all/{interface_id} */
  async getTenantInterfacePagesAll(e) {
    return this.get(
      `/api/tenant-interface-page/all/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/tenant-interface-page/interface/{interface_id} */
  async getTenantInterfacePagesByInterface(e) {
    return this.get(
      `/api/tenant-interface-page/interface/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/tenant-interface/all */
  async getTenantInterfacesAll() {
    return this.get("/api/tenant-interface/all");
  }
  /** GET /api/tenant-registration/fees (public). */
  async getTenantRegistrationFees() {
    return this.get(
      "/api/tenant-registration/fees",
      void 0,
      { auth: !1 }
    );
  }
  // ===========================================================================
  // Domain interfaces
  // ===========================================================================
  /** GET /api/domain-interfaces */
  async listDomainInterfaces() {
    return this.get("/api/domain-interfaces");
  }
  /** POST /api/domain-interfaces */
  async createDomainInterface(e) {
    return this.post("/api/domain-interfaces", e);
  }
  /**
   * GET /api/domain-interfaces/by-domain/{domain}.
   *
   * Returns the `{base, others}` envelope as api/ writes it (no
   * wrapping `data` field — the controller emits the two keys at the
   * top level). 404 from api/ (no rows mapped for the host) is
   * normalized to `{base: null, others: []}` so callers don't have to
   * try/catch around the lookup; the legitimate "no mapping" answer
   * and the "endpoint unreachable" answer are kept distinct: the
   * latter still throws via `ApiError`.
   */
  async getDomainInterfaceByDomain(e) {
    const n = await this.request(
      `/api/domain-interfaces/by-domain/${encodeURIComponent(e)}`,
      { method: "GET" },
      { validateStatus: (s) => s >= 200 && s < 300 || s === 404 }
    );
    return !n || n.base === void 0 && n.others === void 0 ? { base: null, others: [] } : {
      base: n.base ?? null,
      others: Array.isArray(n.others) ? n.others : []
    };
  }
  /** GET /api/domain-interfaces/{id} */
  async getDomainInterface(e) {
    return this.get(
      `/api/domain-interfaces/${encodeURIComponent(String(e))}`
    );
  }
  /** PATCH /api/domain-interfaces/{id} (rewritten as POST?_method=PATCH). */
  async patchDomainInterface(e, t) {
    return this.patch(
      `/api/domain-interfaces/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** DELETE /api/domain-interfaces/{id} */
  async deleteDomainInterface(e) {
    return this.delete(
      `/api/domain-interfaces/${encodeURIComponent(String(e))}`
    );
  }
  // ===========================================================================
  // World locations / public country directory
  // ===========================================================================
  /** POST /api/world-locations/city */
  async createWorldLocationCity(e) {
    return this.post("/api/world-locations/city", e);
  }
  /** GET /api/world-locations/city/{city} */
  async getWorldLocationCity(e) {
    return this.get(
      `/api/world-locations/city/${encodeURIComponent(String(e))}`
    );
  }
  /** POST /api/world-locations/country */
  async createWorldLocationCountry(e) {
    return this.post("/api/world-locations/country", e);
  }
  /** GET /api/world-locations/country/{country} */
  async getWorldLocationCountry(e) {
    return this.get(
      `/api/world-locations/country/${encodeURIComponent(String(e))}`
    );
  }
  /** POST /api/world-locations/state */
  async createWorldLocationState(e) {
    return this.post("/api/world-locations/state", e);
  }
  /** GET /api/world-locations/state/{state} */
  async getWorldLocationState(e) {
    return this.get(
      `/api/world-locations/state/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/public/countries/{country} (public). */
  async getPublicCountry(e) {
    return this.get(
      `/api/public/countries/${encodeURIComponent(e)}`,
      void 0,
      { auth: !1 }
    );
  }
  /** GET /api/public/countries/find-allowed (public). */
  async getPublicAllowedCountries() {
    return this.get(
      "/api/public/countries/find-allowed",
      void 0,
      { auth: !1 }
    );
  }
  // ===========================================================================
  // Gov directory (all public)
  // ===========================================================================
  /** GET /api/gov/agency-footer */
  async getGovAgencyFooter() {
    return this.get("/api/gov/agency-footer", void 0, { auth: !1 });
  }
  /** GET /api/gov/cities */
  async getGovCities() {
    return this.get("/api/gov/cities", void 0, { auth: !1 });
  }
  /** GET /api/gov/city-agencies */
  async getGovCityAgencies() {
    return this.get("/api/gov/city-agencies", void 0, { auth: !1 });
  }
  /** GET /api/gov/federal-directory */
  async getGovFederalDirectory() {
    return this.get(
      "/api/gov/federal-directory",
      void 0,
      { auth: !1 }
    );
  }
  /** GET /api/gov/states */
  async getGovStates() {
    return this.get("/api/gov/states", void 0, { auth: !1 });
  }
  /** GET /api/gov/subprojects */
  async getGovSubprojects() {
    return this.get("/api/gov/subprojects", void 0, { auth: !1 });
  }
  /** GET /api/gov/subprojects/by-domain */
  async getGovSubprojectByDomain() {
    return this.get(
      "/api/gov/subprojects/by-domain",
      void 0,
      { auth: !1 }
    );
  }
  // ===========================================================================
  // Frontend + SEO pages
  // ===========================================================================
  /** GET /api/frontend/get-frontend */
  async getFrontend() {
    return this.get("/api/frontend/get-frontend");
  }
  /** PUT /api/frontend/save-frontend (rewritten as POST?_method=PUT). */
  async saveFrontend(e) {
    return this.put("/api/frontend/save-frontend", e);
  }
  /** GET /api/seo-page (paginated) */
  async listSeoPages() {
    return this.get("/api/seo-page");
  }
  /** POST /api/seo-page */
  async createSeoPage(e) {
    return this.post("/api/seo-page", e);
  }
  /** DELETE /api/seo-page/item/{seoPageItem} */
  async deleteSeoPageItem(e) {
    return this.delete(
      `/api/seo-page/item/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/seo-page/{seo_page} */
  async getSeoPage(e) {
    return this.get(`/api/seo-page/${encodeURIComponent(String(e))}`);
  }
  /** PUT /api/seo-page/{seo_page} */
  async updateSeoPage(e, t) {
    return this.put(
      `/api/seo-page/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** DELETE /api/seo-page/{seo_page} */
  async deleteSeoPage(e) {
    return this.delete(`/api/seo-page/${encodeURIComponent(String(e))}`);
  }
  // ===========================================================================
  // Creator + featured (gov-side admin)
  // ===========================================================================
  /** GET /api/creator */
  async listCreators() {
    return this.get("/api/creator");
  }
  /** POST /api/creator */
  async createCreator(e) {
    return this.post("/api/creator", e);
  }
  /** GET /api/creator/{creator} */
  async getCreator(e) {
    return this.get(`/api/creator/${encodeURIComponent(String(e))}`);
  }
  /** PUT /api/creator/{creator} */
  async updateCreator(e, t) {
    return this.put(
      `/api/creator/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** DELETE /api/creator/{creator} */
  async deleteCreator(e) {
    return this.delete(`/api/creator/${encodeURIComponent(String(e))}`);
  }
  /** GET /api/creator-activity */
  async listCreatorActivity() {
    return this.get("/api/creator-activity");
  }
  /** POST /api/creator-activity */
  async createCreatorActivity(e) {
    return this.post("/api/creator-activity", e);
  }
  /** GET /api/creator-activity/{creator_activity} */
  async getCreatorActivity(e) {
    return this.get(
      `/api/creator-activity/${encodeURIComponent(String(e))}`
    );
  }
  /** PUT /api/creator-activity/{creator_activity} */
  async updateCreatorActivity(e, t) {
    return this.put(
      `/api/creator-activity/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** DELETE /api/creator-activity/{creator_activity} */
  async deleteCreatorActivity(e) {
    return this.delete(
      `/api/creator-activity/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/creator-request */
  async listCreatorRequests() {
    return this.get("/api/creator-request");
  }
  /** POST /api/creator-request */
  async createCreatorRequest(e) {
    return this.post("/api/creator-request", e);
  }
  /** GET /api/creator-request/status */
  async getCreatorRequestStatus() {
    return this.get("/api/creator-request/status");
  }
  /** GET /api/creator-request/{creator_request} */
  async getCreatorRequest(e) {
    return this.get(
      `/api/creator-request/${encodeURIComponent(String(e))}`
    );
  }
  /** PUT /api/creator-request/{creator_request} */
  async updateCreatorRequest(e, t) {
    return this.put(
      `/api/creator-request/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** DELETE /api/creator-request/{creator_request} */
  async deleteCreatorRequest(e) {
    return this.delete(
      `/api/creator-request/${encodeURIComponent(String(e))}`
    );
  }
  /** POST /api/featured/creators */
  async saveFeaturedCreators(e) {
    return this.post("/api/featured/creators", e);
  }
  /** POST /api/featured/programs */
  async saveFeaturedPrograms(e) {
    return this.post("/api/featured/programs", e);
  }
  // ===========================================================================
  // Contacts
  // ===========================================================================
  /** DELETE /api/contacts/delete/{contact} */
  async deleteContact(e) {
    return this.delete(`/api/contacts/delete/${encodeURIComponent(String(e))}`);
  }
  /** POST /api/contacts/find/{subproject?} */
  async findContacts(e, t) {
    return this.post(`/api/contacts/find${C(t)}`, e);
  }
  /** GET /api/contacts/has-contacts */
  async getContactsHasContacts() {
    return this.get("/api/contacts/has-contacts");
  }
  /** POST /api/contacts/import */
  async importContacts(e) {
    return this.post("/api/contacts/import", e);
  }
  /** POST /api/contacts/list */
  async listContacts(e) {
    return this.post("/api/contacts/list", e);
  }
  /** GET /api/contacts/running-import */
  async getContactsRunningImport() {
    return this.get("/api/contacts/running-import");
  }
  /** POST /api/contacts/save */
  async saveContact(e) {
    return this.post("/api/contacts/save", e);
  }
  // ===========================================================================
  // Documentation
  // ===========================================================================
  /** GET /api/documentation */
  async listDocumentation() {
    return this.get("/api/documentation");
  }
  /** POST /api/documentation */
  async createDocumentation(e) {
    return this.post("/api/documentation", e);
  }
  /** GET /api/documentation/{documentation} */
  async getDocumentation(e) {
    return this.get(
      `/api/documentation/${encodeURIComponent(String(e))}`
    );
  }
  /** PUT /api/documentation/{documentation} */
  async updateDocumentation(e, t) {
    return this.put(
      `/api/documentation/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** DELETE /api/documentation/{documentation} */
  async deleteDocumentation(e) {
    return this.delete(
      `/api/documentation/${encodeURIComponent(String(e))}`
    );
  }
}
function Qe(r, e) {
  const t = r[e];
  if (t != null)
    return t;
  const n = r.chain;
  if (Array.isArray(n)) {
    for (const s of n)
      if (s && typeof s == "object" && e in s) {
        const o = s[e];
        if (o != null)
          return o;
      }
  }
  return null;
}
const V = Symbol.for("@arionhardison/wizard-api-client/tenancy-deprecation-warned");
function Pe(r) {
  return r[V] === !0;
}
function Ae(r) {
  r[V] = !0;
}
class Ke extends we {
  constructor(e) {
    super(e);
    const t = console.warn;
    Pe(t) || (Ae(t), t(
      "[@arionhardison/wizard-api-client] `TenancyApiClient` is deprecated and will be removed in 2.0.0. Use `SubprojectApiClient` instead — the surface is identical plus the new hierarchy-aware methods (`getDpgInstances`, hierarchy fields on `loadSubproject()`)."
    ));
  }
}
class Ye extends c {
  // ===========================================================================
  // /api/program-sale/* — purchase + listing flow
  // ===========================================================================
  /** POST /api/program-sale/buy */
  async buyProgram(e) {
    return this.post("/api/program-sale/buy", e);
  }
  /** POST /api/program-sale/list (auth=public) */
  async listProgramSale(e) {
    return this.post("/api/program-sale/list", e, {
      auth: !1
    });
  }
  /** GET /api/program-sale/list-by-author/{username} (auth=public) */
  async listProgramSaleByAuthor(e) {
    return this.get(
      `/api/program-sale/list-by-author/${encodeURIComponent(e)}`,
      void 0,
      { auth: !1 }
    );
  }
  /** GET /api/program-sale/list/random/{username}/{ignore} (auth=public) */
  async listProgramSaleRandom(e, t) {
    return this.get(
      `/api/program-sale/list/random/${encodeURIComponent(e)}/${encodeURIComponent(String(t))}`,
      void 0,
      { auth: !1 }
    );
  }
  /** GET /api/program-sale/salary/{program} */
  async getProgramSaleSalary(e) {
    return this.get(`/api/program-sale/salary/${e}`);
  }
  /** GET /api/program-sale/tags (auth=public) */
  async getProgramSaleTags() {
    return this.get("/api/program-sale/tags", void 0, {
      auth: !1
    });
  }
  /** GET /api/program-sale/{program_sale} */
  async showProgramSale(e) {
    return this.get(`/api/program-sale/${e}`);
  }
  /** PUT /api/program-sale/{program_sale} */
  async updateProgramSale(e, t) {
    return this.put(`/api/program-sale/${e}`, t);
  }
  /** DELETE /api/program-sale/{program_sale} */
  async destroyProgramSale(e) {
    return this.delete(`/api/program-sale/${e}`);
  }
  // ===========================================================================
  // /api/program/* — program CRUD, history, run-personal, publish
  // ===========================================================================
  /** GET /api/program/all */
  async getAllPrograms() {
    return this.get("/api/program/all");
  }
  /** GET /api/program/chains/{program}/{user} */
  async getProgramChains(e, t) {
    return this.get(
      `/api/program/chains/${e}/${t}`
    );
  }
  /** POST /api/program/detach-protocol */
  async detachProtocol(e) {
    return this.post(
      "/api/program/detach-protocol",
      e
    );
  }
  /** GET /api/program/get-bookmarks (paginated) */
  async getProgramBookmarks() {
    return this.get(
      "/api/program/get-bookmarks"
    );
  }
  /** GET /api/program/history */
  async getProgramHistory() {
    return this.get("/api/program/history");
  }
  /** GET /api/program/history/{chain} */
  async getProgramHistoryByChain(e) {
    return this.get(`/api/program/history/${e}`);
  }
  /** GET /api/program/last-purchases */
  async getLastPurchases() {
    return this.get("/api/program/last-purchases");
  }
  /** POST /api/program/program-check */
  async programCheck(e) {
    return this.post("/api/program/program-check", e);
  }
  /**
   * GET /api/program/program-data/{program?}
   * `program` is optional — when omitted the trailing path segment is dropped.
   */
  async getProgramData(e) {
    const t = e == null ? "" : `/${e}`;
    return this.get(`/api/program/program-data${t}`);
  }
  /** POST /api/program/program/add-tag */
  async addProgramTag(e) {
    return this.post("/api/program/program/add-tag", e);
  }
  /** DELETE /api/program/program/delete-tag/{program}/{tag} */
  async deleteProgramTag(e, t) {
    return this.delete(
      `/api/program/program/delete-tag/${e}/${encodeURIComponent(String(t))}`
    );
  }
  /** GET /api/program/publications/{program} */
  async getProgramPublications(e) {
    return this.get(`/api/program/publications/${e}`);
  }
  /** POST /api/program/publish */
  async publishProgram(e) {
    return this.post("/api/program/publish", e);
  }
  /** POST /api/program/publish/cancel */
  async cancelPublishProgram(e) {
    return this.post("/api/program/publish/cancel", e);
  }
  /** POST /api/program/run-personal */
  async runPersonalProgram(e) {
    return this.post("/api/program/run-personal", e);
  }
  /** POST /api/program/search */
  async searchPrograms(e) {
    return this.post("/api/program/search", e);
  }
  /** GET /api/program/show/{program} */
  async showProgram(e) {
    return this.get(`/api/program/show/${e}`);
  }
  /** GET /api/program/simulation/{program} */
  async simulateProgram(e) {
    return this.get(`/api/program/simulation/${e}`);
  }
  /** POST /api/program/toggle-bookmark */
  async toggleProgramBookmark(e) {
    return this.post("/api/program/toggle-bookmark", e);
  }
  /**
   * PUT /api/program/update-program/{program}
   *
   * Spec leaves `request.shape` empty (the FormRequest applies conditional
   * step-based rules), so the body type is open. Multipart kicks in
   * automatically when any value is a `File`/`Blob` (e.g. `program_image`).
   */
  async updateProgram(e, t) {
    return this.put(`/api/program/update-program/${e}`, t);
  }
  /** GET /api/program/users-additional-steps/{program}/{protocol} */
  async getProgramUsersAdditionalSteps(e, t) {
    return this.get(
      `/api/program/users-additional-steps/${e}/${t}`
    );
  }
  /** GET /api/program/users-steps/{program} */
  async getProgramUsersSteps(e) {
    return this.get(
      `/api/program/users-steps/${e}`
    );
  }
  /** GET /api/program/users/{program} */
  async getProgramUsers(e) {
    return this.get(`/api/program/users/${e}`);
  }
  /** POST /api/program/validate-additional-protocol */
  async validateAdditionalProtocol(e) {
    return this.post(
      "/api/program/validate-additional-protocol",
      e
    );
  }
  // ===========================================================================
  // /api/project-role/* — Subproject role CRUD (admin guard)
  // ===========================================================================
  /** GET /api/project-role/permissions */
  async getProjectRolePermissions() {
    return this.get("/api/project-role/permissions");
  }
  /** GET /api/project-role/{project_role} */
  async showProjectRole(e) {
    return this.get(`/api/project-role/${e}`);
  }
  /** PUT /api/project-role/{project_role} */
  async updateProjectRole(e, t) {
    return this.put(`/api/project-role/${e}`, t);
  }
  /** DELETE /api/project-role/{project_role} */
  async destroyProjectRole(e) {
    return this.delete(`/api/project-role/${e}`);
  }
  // ===========================================================================
  // /api/role + /api/roles/* — User role CRUD
  // ===========================================================================
  /** GET /api/role */
  async listRoles() {
    return this.get("/api/role");
  }
  /**
   * POST /api/role — spec leaves request/response shape empty.
   * Body kept open so callers can pass a name + permission map.
   */
  async createRole(e) {
    return this.post("/api/role", e);
  }
  /** GET /api/role/{role} */
  async showRole(e) {
    return this.get(`/api/role/${e}`);
  }
  /** PUT /api/role/{role} */
  async updateRole(e, t) {
    return this.put(`/api/role/${e}`, t);
  }
  /** DELETE /api/role/{role} */
  async destroyRole(e) {
    return this.delete(`/api/role/${e}`);
  }
  /** GET /api/roles/all */
  async getAllRoles() {
    return this.get("/api/roles/all");
  }
  // ===========================================================================
  // /api/team/* — Team membership, invites, role mgmt, network search
  // ===========================================================================
  /** POST /api/team/accept */
  async acceptTeamInvite(e) {
    return this.post("/api/team/accept", e);
  }
  /** GET /api/team/accept-invite/{token} */
  async acceptTeamInviteByToken(e) {
    return this.get(
      `/api/team/accept-invite/${encodeURIComponent(e)}`
    );
  }
  /** GET /api/team/all */
  async getAllTeamMembers() {
    return this.get("/api/team/all");
  }
  /** POST /api/team/handle-role */
  async handleTeamRole(e) {
    return this.post("/api/team/handle-role", e);
  }
  /** POST /api/team/invite */
  async inviteTeamMember(e) {
    return this.post("/api/team/invite", e);
  }
  /** POST /api/team/leave */
  async leaveTeam(e) {
    return this.post("/api/team/leave", e);
  }
  /** GET /api/team/list/{status} */
  async listTeam(e) {
    return this.get(
      `/api/team/list/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/team/member/{status} */
  async listTeamInvites(e) {
    return this.get(
      `/api/team/member/${encodeURIComponent(String(e))}`
    );
  }
  /** POST /api/team/network-invite */
  async inviteNetworkMember(e) {
    return this.post("/api/team/network-invite", e);
  }
  /** POST /api/team/network-invite-potential */
  async inviteNetworkPotentialMember(e) {
    return this.post("/api/team/network-invite-potential", e);
  }
  /** POST /api/team/network-search */
  async searchNetwork(e) {
    return this.post("/api/team/network-search", e);
  }
  /** POST /api/team/reject */
  async rejectTeamInvite(e) {
    return this.post("/api/team/reject", e);
  }
  /** POST /api/team/remove */
  async removeTeamMember(e) {
    return this.post("/api/team/remove", e);
  }
  /** POST /api/team/remove-potential */
  async removePotentialTeamMember(e) {
    return this.post("/api/team/remove-potential", e);
  }
  /** GET /api/team/roles */
  async getTeamRoles() {
    return this.get("/api/team/roles");
  }
  /** POST /api/team/search-members */
  async searchTeamMembers(e) {
    return this.post("/api/team/search-members", e);
  }
  /** POST /api/team/search-users */
  async searchTeamUsers(e) {
    return this.post("/api/team/search-users", e);
  }
}
class Xe extends c {
  // ---------------------------------------------------------------------------
  // /api/protocol — base CRUD
  // ---------------------------------------------------------------------------
  /** GET /api/protocol — paginated. */
  async listProtocols() {
    return this.get("/api/protocol");
  }
  /** POST /api/protocol */
  async createProtocol(e) {
    return this.post("/api/protocol", e);
  }
  /** GET /api/protocol/{protocol} */
  async getProtocol(e) {
    return this.get(`/api/protocol/${e}`);
  }
  /** PUT /api/protocol/{protocol} */
  async updateProtocol(e, t) {
    return this.put(`/api/protocol/${e}`, t);
  }
  /** DELETE /api/protocol/{protocol} */
  async deleteProtocol(e) {
    return this.delete(`/api/protocol/${e}`);
  }
  // ---------------------------------------------------------------------------
  // /api/protocol-category — CRUD + helpers
  // ---------------------------------------------------------------------------
  /** GET /api/protocol-category — paginated. */
  async listProtocolCategories() {
    return this.get("/api/protocol-category");
  }
  /** POST /api/protocol-category */
  async createProtocolCategory(e) {
    return this.post("/api/protocol-category", e);
  }
  /** GET /api/protocol-category/all */
  async getAllProtocolCategories() {
    return this.get("/api/protocol-category/all");
  }
  /** GET /api/protocol-category/for-attachment */
  async getProtocolCategoriesForAttachment() {
    return this.get("/api/protocol-category/for-attachment");
  }
  /** GET /api/protocol-category/{protocol_category} */
  async getProtocolCategory(e) {
    return this.get(
      `/api/protocol-category/${e}`
    );
  }
  /** PUT /api/protocol-category/{protocol_category} */
  async updateProtocolCategory(e, t) {
    return this.put(
      `/api/protocol-category/${e}`,
      t
    );
  }
  /** DELETE /api/protocol-category/{protocol_category} */
  async deleteProtocolCategory(e) {
    return this.delete(`/api/protocol-category/${e}`);
  }
  // ---------------------------------------------------------------------------
  // /api/protocol-event/triggers
  // ---------------------------------------------------------------------------
  /** GET /api/protocol-event/triggers */
  async getProtocolEventTriggers() {
    return this.get("/api/protocol-event/triggers");
  }
  // ---------------------------------------------------------------------------
  // /api/protocol/* — sub-module integrations + listings
  // ---------------------------------------------------------------------------
  /** GET /api/protocol/all */
  async getAllProtocols() {
    return this.get("/api/protocol/all");
  }
  /** GET /api/protocol/activity/all */
  async getProtocolActivityAll() {
    return this.get("/api/protocol/activity/all");
  }
  /** GET /api/protocol/agents/all (auth=sanctum) */
  async getProtocolAgentsAll() {
    return this.get("/api/protocol/agents/all");
  }
  /** GET /api/protocol/appeal/all */
  async getProtocolAppealAll() {
    return this.get("/api/protocol/appeal/all");
  }
  /** GET /api/protocol/application/all */
  async getProtocolApplicationAll() {
    return this.get("/api/protocol/application/all");
  }
  /** GET /api/protocol/assessment/all */
  async getProtocolAssessmentAll() {
    return this.get("/api/protocol/assessment/all");
  }
  /** GET /api/protocol/assessment/item-instances/{assessment} */
  async getAssessmentItemInstances(e) {
    return this.get(`/api/protocol/assessment/item-instances/${e}`);
  }
  /** GET /api/protocol/challenge/all */
  async getProtocolChallengeAll() {
    return this.get("/api/protocol/challenge/all");
  }
  /** GET /api/protocol/connector/all */
  async getProtocolConnectorAll() {
    return this.get("/api/protocol/connector/all");
  }
  /** GET /api/protocol/disbursement/all */
  async getProtocolDisbursementAll() {
    return this.get("/api/protocol/disbursement/all");
  }
  /** GET /api/protocol/etl/all (auth=sanctum) */
  async getProtocolEtlAll() {
    return this.get("/api/protocol/etl/all");
  }
  /** GET /api/protocol/nudge/all */
  async getProtocolNudgeAll() {
    return this.get("/api/protocol/nudge/all");
  }
  /** GET /api/protocol/order/all */
  async getProtocolOrderAll() {
    return this.get("/api/protocol/order/all");
  }
  /** GET /api/protocol/referral/all */
  async getProtocolReferralAll() {
    return this.get("/api/protocol/referral/all");
  }
  /** GET /api/protocol/report/all */
  async getProtocolReportAll() {
    return this.get("/api/protocol/report/all");
  }
  /** GET /api/protocol/verification/all */
  async getProtocolVerificationAll() {
    return this.get("/api/protocol/verification/all");
  }
  /** GET /api/protocol/workflow/all */
  async getProtocolWorkflowAll() {
    return this.get("/api/protocol/workflow/all");
  }
  // ---------------------------------------------------------------------------
  // /api/protocol/by-category(-all)?, check-usage, errors, get-temporary-user, ...
  // ---------------------------------------------------------------------------
  /** GET /api/protocol/by-category-all/{category} */
  async getProtocolsByCategoryAll(e) {
    return this.get(
      `/api/protocol/by-category-all/${encodeURIComponent(String(e))}`
    );
  }
  /**
   * GET /api/protocol/by-category/{category?} — paginated.
   * Optional category segment is omitted when not supplied.
   */
  async getProtocolsByCategory(e) {
    const t = e == null ? "" : `/${encodeURIComponent(String(e))}`;
    return this.get(
      `/api/protocol/by-category${t}`
    );
  }
  /** GET /api/protocol/check-usage/{protocol} */
  async checkProtocolUsage(e) {
    return this.get(`/api/protocol/check-usage/${e}`);
  }
  /** GET /api/protocol/errors/{protocol} */
  async getProtocolErrors(e) {
    return this.get(`/api/protocol/errors/${e}`);
  }
  /** GET /api/protocol/get-temporary-user */
  async getTemporaryUserProtocol() {
    return this.get("/api/protocol/get-temporary-user");
  }
  /** GET /api/protocol/chain-item-branch-plan/{protocol}/{item} */
  async getChainItemBranchPlan(e, t) {
    return this.get(
      `/api/protocol/chain-item-branch-plan/${e}/${encodeURIComponent(String(t))}`
    );
  }
  /** GET /api/protocol/get-plan/{protocol} */
  async getProtocolPlan(e) {
    return this.get(`/api/protocol/get-plan/${e}`);
  }
  /** GET /api/protocol/get-steps/{protocol} */
  async getProtocolSteps(e) {
    return this.get(`/api/protocol/get-steps/${e}`);
  }
  /** GET /api/protocol/intensive-module/roles/{protocol} */
  async getIntensiveModuleRoles(e) {
    return this.get(`/api/protocol/intensive-module/roles/${e}`);
  }
  /** GET /api/protocol/list-intensive/{protocol} */
  async listIntensiveModules(e) {
    return this.get(
      `/api/protocol/list-intensive/${e}`
    );
  }
  /** GET /api/protocol/show-intensive/{module} */
  async showIntensiveModule(e) {
    return this.get(
      `/api/protocol/show-intensive/${e}`
    );
  }
  /** GET /api/protocol/get-intensive-module-settings/{protocol}/{chain} */
  async getIntensiveModuleSettings(e, t) {
    return this.get(
      `/api/protocol/get-intensive-module-settings/${e}/${encodeURIComponent(String(t))}`
    );
  }
  /**
   * GET /api/protocol/modules/{recurring?}
   * Optional `recurring` flag (0/1) is omitted when not supplied.
   */
  async getProtocolModules(e) {
    const t = e == null ? "" : `/${encodeURIComponent(String(e))}`;
    return this.get(`/api/protocol/modules${t}`);
  }
  /** GET /api/protocol/node-members/{node} */
  async getNodeMembers(e) {
    return this.get(`/api/protocol/node-members/${e}`);
  }
  /** GET /api/protocol/role-qualifications/{role} */
  async getRoleQualifications(e) {
    return this.get(
      `/api/protocol/role-qualifications/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/protocol/roles/{type} */
  async getProtocolRoles(e) {
    return this.get(`/api/protocol/roles/${encodeURIComponent(String(e))}`);
  }
  // ---------------------------------------------------------------------------
  // /api/protocol/sale/* + /api/protocol/settings/*
  // ---------------------------------------------------------------------------
  /** GET /api/protocol/sale/get/{protocol} */
  async getProtocolSale(e) {
    return this.get(`/api/protocol/sale/get/${e}`);
  }
  /** GET /api/protocol/sale/salaries/{protocol} */
  async getProtocolSaleSalaries(e) {
    return this.get(
      `/api/protocol/sale/salaries/${e}`
    );
  }
  /** POST /api/protocol/sale/set-sale */
  async setProtocolSale(e) {
    return this.post("/api/protocol/sale/set-sale", e);
  }
  /** PATCH /api/protocol/sale/update/{protocol} */
  async updateProtocolSale(e, t) {
    return this.patch(
      `/api/protocol/sale/update/${e}`,
      t
    );
  }
  /** GET /api/protocol/settings/get/{protocol} */
  async getProtocolSettings(e) {
    return this.get(
      `/api/protocol/settings/get/${e}`
    );
  }
  /** POST /api/protocol/settings/save */
  async saveProtocolSettings(e) {
    return this.post("/api/protocol/settings/save", e);
  }
  // ---------------------------------------------------------------------------
  // Plan/branch editors (POST)
  // ---------------------------------------------------------------------------
  /** POST /api/protocol/add-module-to-plan */
  async addModuleToPlan(e) {
    return this.post("/api/protocol/add-module-to-plan", e);
  }
  /** POST /api/protocol/add-module-to-branch */
  async addModuleToBranch(e) {
    return this.post(
      "/api/protocol/add-module-to-branch",
      e
    );
  }
  /** POST /api/protocol/edit-plan-module */
  async editPlanModule(e) {
    return this.post("/api/protocol/edit-plan-module", e);
  }
  /** POST /api/protocol/edit-plan-branch-module */
  async editPlanBranchModule(e) {
    return this.post(
      "/api/protocol/edit-plan-branch-module",
      e
    );
  }
  /** POST /api/protocol/move-up-plan-item */
  async movePlanItemUp(e) {
    return this.post(
      "/api/protocol/move-up-plan-item",
      e
    );
  }
  /** POST /api/protocol/move-down-plan-item */
  async movePlanItemDown(e) {
    return this.post(
      "/api/protocol/move-down-plan-item",
      e
    );
  }
  /** POST /api/protocol/delete-plan-item */
  async deletePlanItem(e) {
    return this.post(
      "/api/protocol/delete-plan-item",
      e
    );
  }
  /** POST /api/protocol/move-up-branch-item */
  async moveBranchItemUp(e) {
    return this.post(
      "/api/protocol/move-up-branch-item",
      e
    );
  }
  /** POST /api/protocol/move-down-branch-item */
  async moveBranchItemDown(e) {
    return this.post(
      "/api/protocol/move-down-branch-item",
      e
    );
  }
  /** POST /api/protocol/delete-branch-item */
  async deleteBranchItem(e) {
    return this.post(
      "/api/protocol/delete-branch-item",
      e
    );
  }
  /** POST /api/protocol/confirm-plan */
  async confirmProtocolPlan(e) {
    return this.post("/api/protocol/confirm-plan", e);
  }
  /** POST /api/protocol/switch-member */
  async switchProtocolChainMember(e) {
    return this.post("/api/protocol/switch-member", e);
  }
  // ---------------------------------------------------------------------------
  // Intensive (global) module CRUD
  // ---------------------------------------------------------------------------
  /** POST /api/protocol/store-intensive */
  async storeIntensiveModule(e) {
    return this.post("/api/protocol/store-intensive", e);
  }
  /**
   * POST /api/protocol/update-intensive/{module}
   * Spec lists method as POST (NOT PUT/PATCH) — it is a POST update endpoint.
   */
  async updateIntensiveModule(e, t) {
    return this.post(
      `/api/protocol/update-intensive/${e}`,
      t
    );
  }
  /** DELETE /api/protocol/delete-intensive/{global} */
  async deleteIntensiveModule(e) {
    return this.delete(
      `/api/protocol/delete-intensive/${e}`
    );
  }
  /** DELETE /api/protocol/reset-plan/{protocol} */
  async resetProtocolPlan(e) {
    return this.delete(
      `/api/protocol/reset-plan/${e}`
    );
  }
  // ---------------------------------------------------------------------------
  // AI assist (fire-and-poll) + status polling
  // ---------------------------------------------------------------------------
  /**
   * POST /api/protocol/ai-create
   *
   * Enqueues `ProtocolAiModuleCreation` onto the `ai` queue and returns a
   * polling token in `data.id`. Caller polls `getAiRequestStatus(key)`
   * until `data.finished === true`.
   */
  async aiCreateItem(e) {
    return this.post("/api/protocol/ai-create", e);
  }
  /**
   * POST /api/protocol/ai-whole
   *
   * Same fire-and-poll contract as `aiCreateItem` — result token in `data.id`.
   */
  async aiCreateWhole(e) {
    return this.post("/api/protocol/ai-whole", e);
  }
  /**
   * POST /api/protocol/ai-create-branch
   *
   * Same fire-and-poll contract — result token in `data.id`.
   */
  async aiCreateBranchPlan(e) {
    return this.post("/api/protocol/ai-create-branch", e);
  }
  /**
   * GET /api/protocol/ai-request-status/{key}
   *
   * Polling endpoint paired with the three `ai-*` POSTs above. Pass the
   * `id` returned in the create response body.
   */
  async getAiRequestStatus(e) {
    return this.get(
      `/api/protocol/ai-request-status/${encodeURIComponent(e)}`
    );
  }
  // ---------------------------------------------------------------------------
  // /api/workflow/codify-pipeline/* — auth: public (no Bearer)
  // ---------------------------------------------------------------------------
  /**
   * POST /api/workflow/codify-pipeline/start
   *
   * Public endpoint (no Bearer). When `file` is a Blob/File, the request
   * is auto-promoted to multipart/form-data by `BaseApiClient.serializeBody`.
   */
  async startCodifyPipeline(e) {
    return this.post(
      "/api/workflow/codify-pipeline/start",
      e,
      { auth: !1 }
    );
  }
  /**
   * POST /api/workflow/codify-pipeline/save-response
   *
   * Public endpoint. Body shape isn't pinned by the spec — caller sends the
   * follow-up question id + the user's answer payload.
   */
  async saveCodifyPipelineResponse(e) {
    return this.post(
      "/api/workflow/codify-pipeline/save-response",
      e,
      { auth: !1 }
    );
  }
  /** GET /api/workflow/codify-pipeline/check-pipeline/{session} (public) */
  async checkCodifyPipeline(e) {
    return this.get(
      `/api/workflow/codify-pipeline/check-pipeline/${encodeURIComponent(e)}`,
      void 0,
      { auth: !1 }
    );
  }
  /** GET /api/workflow/codify-pipeline/stop/{session} (public) */
  async stopCodifyPipeline(e) {
    return this.get(
      `/api/workflow/codify-pipeline/stop/${encodeURIComponent(e)}`,
      void 0,
      { auth: !1 }
    );
  }
}
function je(r) {
  const e = r.finished === !0, t = r.running === !0, n = r.successfully === !0;
  return e && n ? {
    status: "completed",
    codify: r.codify,
    preferredSubproject: r.preferred_subproject,
    raw: r
  } : e ? { status: "failed", raw: r } : t ? {
    status: "running",
    step: r.step,
    questions: r.questions,
    preparationFinished: r.preparation_finished,
    raw: r
  } : { status: "pending", raw: r };
}
class Ze extends c {
  // ---------------------------------------------------------------------------
  // /api/personal-chain/* — authenticated unless flagged otherwise
  // ---------------------------------------------------------------------------
  /**
   * GET /api/personal-chain/by-status/{status?}
   *
   * Spec lists `status` as optional; we omit the trailing segment entirely
   * when undefined so Laravel routes to the catch-all variant.
   */
  async getByStatus(e) {
    const t = e == null ? "" : `/${encodeURIComponent(String(e))}`;
    return this.get(`/api/personal-chain/by-status${t}`);
  }
  /** POST /api/personal-chain/cancel-invitation */
  async cancelInvitation(e) {
    return this.post("/api/personal-chain/cancel-invitation", e);
  }
  /**
   * GET /api/personal-chain/decline/{invite}/{source?}
   *
   * Spec auth is `public` — no Bearer required. Used from invite emails
   * where the recipient may not be signed in yet.
   */
  async decline(e, t) {
    const n = t == null ? "" : `/${encodeURIComponent(String(t))}`;
    return this.get(
      `/api/personal-chain/decline/${encodeURIComponent(String(e))}${n}`,
      void 0,
      { auth: !1 }
    );
  }
  /** POST /api/personal-chain/feedback/{chain} */
  async postFeedback(e, t) {
    return this.post(
      `/api/personal-chain/feedback/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** GET /api/personal-chain/feedback/{chain} */
  async getFeedback(e) {
    return this.get(
      `/api/personal-chain/feedback/${encodeURIComponent(String(e))}`
    );
  }
  /** POST /api/personal-chain/find-users-to-invite */
  async findUsersToInvite(e) {
    return this.post("/api/personal-chain/find-users-to-invite", e);
  }
  /** GET /api/personal-chain/finished-not-rated */
  async getFinishedNotRated() {
    return this.get(
      "/api/personal-chain/finished-not-rated"
    );
  }
  /** GET /api/personal-chain/force-defrost/{chain} */
  async forceDefrost(e) {
    return this.get(
      `/api/personal-chain/force-defrost/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/personal-chain/get-recommended */
  async getRecommended() {
    return this.get("/api/personal-chain/get-recommended");
  }
  /** POST /api/personal-chain/invite */
  async invite(e) {
    return this.post("/api/personal-chain/invite", e);
  }
  /**
   * GET /api/personal-chain/join/{token}/{source?}
   *
   * Spec auth is `public`. Same pattern as decline — invite landing page.
   */
  async join(e, t) {
    const n = t == null ? "" : `/${encodeURIComponent(String(t))}`;
    return this.get(
      `/api/personal-chain/join/${encodeURIComponent(e)}${n}`,
      void 0,
      { auth: !1 }
    );
  }
  /** GET /api/personal-chain/last-chain */
  async getLastChain() {
    return this.get("/api/personal-chain/last-chain");
  }
  /** POST /api/personal-chain/start-program/{chain} */
  async startProgram(e, t) {
    return this.post(
      `/api/personal-chain/start-program/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** GET /api/personal-chain/task/{taskId} */
  async getTask(e) {
    return this.get(
      `/api/personal-chain/task/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/personal-chain/tasks */
  async getTasks() {
    return this.get("/api/personal-chain/tasks");
  }
  /** GET /api/personal-chain/user-join/{invite} */
  async userJoin(e) {
    return this.get(
      `/api/personal-chain/user-join/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/personal-chain/user-reject/{invite} */
  async userReject(e) {
    return this.get(
      `/api/personal-chain/user-reject/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/personal-chain/{personalChain} */
  async getPersonalChain(e) {
    return this.get(
      `/api/personal-chain/${encodeURIComponent(String(e))}`
    );
  }
  /** DELETE /api/personal-chain/{personalChain} */
  async deletePersonalChain(e) {
    return this.delete(
      `/api/personal-chain/${encodeURIComponent(String(e))}`
    );
  }
  // ---------------------------------------------------------------------------
  // /api/public/codify/* — public (auth: false on every call)
  // ---------------------------------------------------------------------------
  /** GET /api/public/codify/answers/{key} */
  async getCodifyAnswers(e) {
    return this.get(
      `/api/public/codify/answers/${encodeURIComponent(e)}`,
      void 0,
      { auth: !1 }
    );
  }
  /** DELETE /api/public/codify/cancel/{key} */
  async cancelCodify(e) {
    return this.delete(
      `/api/public/codify/cancel/${encodeURIComponent(e)}`,
      { auth: !1 }
    );
  }
  /**
   * POST /api/public/codify/run
   *
   * `codifyFile` triggers a multipart/form-data switch automatically inside
   * `BaseApiClient.serializeBody` (it walks the payload for any Blob / File).
   */
  async runCodify(e) {
    return this.post("/api/public/codify/run", e, { auth: !1 });
  }
  /** POST /api/public/codify/save-answer */
  async saveCodifyAnswer(e) {
    return this.post("/api/public/codify/save-answer", e, { auth: !1 });
  }
  /** POST /api/public/codify/start-session */
  async startCodifySession(e) {
    return this.post("/api/public/codify/start-session", e, { auth: !1 });
  }
  /**
   * GET /api/public/codify/state/{key} — raw envelope.
   *
   * For UI state machines, prefer {@link readCodifyJobState} which returns
   * the `CodifyJobState` discriminated union.
   */
  async getCodifyState(e) {
    return this.get(
      `/api/public/codify/state/${encodeURIComponent(e)}`,
      void 0,
      { auth: !1 }
    );
  }
  /**
   * Convenience wrapper: GET the codify state and decode it into the
   * `CodifyJobState` discriminated union.
   *
   * Pair with a polling loop (e.g. `pollUntil`) to drive the wizard UI.
   */
  async readCodifyJobState(e) {
    const t = await this.getCodifyState(e);
    return je(t.data);
  }
  // ---------------------------------------------------------------------------
  // /api/wizard/codify/{protocol} — Bearer required (auth=api)
  // ---------------------------------------------------------------------------
  /**
   * POST /api/wizard/codify/{protocol}
   *
   * Distinct from the existing `WizardApiClient.startWizard` /
   * `WizardApiClient.defineProblems` etc. — those drive the **Five-Step**
   * wizard (`/wizard/start`, `/wizard/deal/{id}/step/...`). This route is
   * the codify entry point on a specific protocol and `{protocol}` is the
   * Laravel `Protocol` route binding.
   *
   * `codifyFile` triggers `multipart/form-data` automatically.
   */
  async wizardCodify(e, t = {}) {
    return this.post(
      `/api/wizard/codify/${encodeURIComponent(String(e))}`,
      t
    );
  }
}
function L(r) {
  return r == null || r === "" ? "" : `/${encodeURIComponent(String(r))}`;
}
class et extends c {
  // ===========================================================================
  // Broadcasting (Pusher channel auth)
  //
  // The Echo browser client posts to this endpoint as form fields, not
  // JSON. We construct a `URLSearchParams` body so `BaseApiClient.request`
  // does not JSON-stringify it. `auth: false` because Pusher private
  // channel auth is keyed by Laravel's session — Sanctum does not gate it
  // by default in our manifest (`auth: public`).
  // ===========================================================================
  /** POST /api/broadcasting/auth */
  async broadcastingAuth(e) {
    const t = new URLSearchParams();
    return t.set("channel_name", e.channel_name), t.set("socket_id", e.socket_id), e.session_key !== void 0 && t.set("session_key", e.session_key), this.request(
      "/api/broadcasting/auth",
      {
        method: "POST",
        body: t,
        // Override Content-Type explicitly — defaultHeaders sets it to
        // application/json; Pusher needs urlencoded.
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      },
      { auth: !1 }
    );
  }
  // ===========================================================================
  // Chat
  // ===========================================================================
  /** POST /api/chat/broadcast-message */
  async chatBroadcastMessage(e) {
    return this.post("/api/chat/broadcast-message", e);
  }
  /** GET /api/chat/broadcast-messages/{type}/{program?} */
  async chatBroadcastMessages(e, t) {
    return this.get(
      `/api/chat/broadcast-messages/${encodeURIComponent(e)}${L(t)}`
    );
  }
  /** DELETE /api/chat/delete-message/{message} */
  async chatDeleteMessage(e) {
    return this.delete(
      `/api/chat/delete-message/${encodeURIComponent(String(e))}`
    );
  }
  /**
   * DELETE /api/chat/delete-сhat/{chat}
   *
   * NOTE: the manifest URI literally contains a Cyrillic "с" (U+0441) in
   * "delete-сhat". This is preserved verbatim because the Laravel route
   * registration uses the same string — changing it to ASCII "c" would
   * 404. Test pin: `chat-notif-stripe.test.ts` references the same
   * Cyrillic character.
   */
  async chatDeleteChat(e) {
    return this.delete(
      `/api/chat/delete-сhat/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/chat/find-user/{search} */
  async chatFindUser(e) {
    return this.get(`/api/chat/find-user/${encodeURIComponent(e)}`);
  }
  /** GET /api/chat/get-list/{search?} */
  async chatGetList(e) {
    return this.get(`/api/chat/get-list${L(e)}`);
  }
  /** GET /api/chat/get-new-chat/{room} */
  async chatGetNewChat(e) {
    return this.get(
      `/api/chat/get-new-chat/${encodeURIComponent(String(e))}`
    );
  }
  /** POST /api/chat/get-room */
  async chatGetRoom(e) {
    return this.post("/api/chat/get-room", e);
  }
  /** GET /api/chat/get-room-by-id/{room} */
  async chatGetRoomById(e) {
    return this.get(
      `/api/chat/get-room-by-id/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/chat/messages/{chat}/{search?} */
  async chatMessages(e, t) {
    return this.get(
      `/api/chat/messages/${encodeURIComponent(String(e))}${L(t)}`
    );
  }
  /** GET /api/chat/programs */
  async chatPrograms() {
    return this.get("/api/chat/programs");
  }
  /** POST /api/chat/send-message */
  async chatSendMessage(e) {
    return this.post("/api/chat/send-message", e);
  }
  /** POST /api/chat/start */
  async chatStart(e) {
    return this.post("/api/chat/start", e);
  }
  // ===========================================================================
  // Notifications
  // ===========================================================================
  /** DELETE /api/notification/delete-notification/{notification} */
  async notificationDeleteNotification(e) {
    return this.delete(
      `/api/notification/delete-notification/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/notification/get */
  async notificationGet() {
    return this.get("/api/notification/get");
  }
  /** GET /api/notification/get-unread */
  async notificationGetUnread() {
    return this.get("/api/notification/get-unread");
  }
  /** POST /api/notification/start-task */
  async notificationStartTask(e) {
    return this.post("/api/notification/start-task", e);
  }
  // ===========================================================================
  // Payment
  // ===========================================================================
  /** DELETE /api/payment/delete-payment-method/{id} */
  async paymentDeletePaymentMethod(e) {
    return this.delete(
      `/api/payment/delete-payment-method/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/payment/get-payment-method */
  async paymentGetPaymentMethod() {
    return this.get("/api/payment/get-payment-method");
  }
  /** GET /api/payment/program-purchases (paginated) */
  async paymentProgramPurchases() {
    return this.get("/api/payment/program-purchases");
  }
  /** GET /api/payment/purchased-items */
  async paymentPurchasedItems() {
    return this.get("/api/payment/purchased-items");
  }
  /** POST /api/payment/save-payment-method */
  async paymentSavePaymentMethod(e) {
    return this.post("/api/payment/save-payment-method", e);
  }
  /** GET /api/payment/setup-payment-method */
  async paymentSetupPaymentMethod() {
    return this.get("/api/payment/setup-payment-method");
  }
  /** GET /api/payment/subscriptions (paginated) */
  async paymentSubscriptions() {
    return this.get("/api/payment/subscriptions");
  }
  // ===========================================================================
  // Stripe Connect
  // ===========================================================================
  /** GET /api/stripe/check-account */
  async stripeCheckAccount() {
    return this.get("/api/stripe/check-account");
  }
  /** GET /api/stripe/connect — returns the onboarding link payload. */
  async stripeConnect() {
    return this.get("/api/stripe/connect");
  }
  /** DELETE /api/stripe/delete-account */
  async stripeDeleteAccount() {
    return this.delete("/api/stripe/delete-account");
  }
  /** GET /api/stripe/transactions */
  async stripeTransactions() {
    return this.get("/api/stripe/transactions");
  }
  /** GET /api/stripe/withdraw */
  async stripeWithdraw() {
    return this.get("/api/stripe/withdraw");
  }
  // ===========================================================================
  // Subscriptions
  // ===========================================================================
  /** GET /api/subscription/cancel/{subscription} */
  async subscriptionCancel(e) {
    return this.get(
      `/api/subscription/cancel/${encodeURIComponent(String(e))}`
    );
  }
  /** POST /api/subscription/create */
  async subscriptionCreate(e) {
    return this.post("/api/subscription/create", e ?? {});
  }
  /**
   * GET /api/subscription/get/my-subscribers
   *
   * NOTE: this MUST come before the parameterized
   * `subscription.get/{user}` method on the wire too — the manifest lists
   * both routes against `/api/subscription/get/...`. Laravel resolves the
   * literal `my-subscribers` first; we expose them as two distinct
   * methods so callers don't have to worry about the routing precedence.
   */
  async subscriptionGetMySubscribers() {
    return this.get("/api/subscription/get/my-subscribers");
  }
  /** GET /api/subscription/get/{user} */
  async subscriptionGet(e) {
    return this.get(
      `/api/subscription/get/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/subscription/my-subscription */
  async subscriptionMy() {
    return this.get("/api/subscription/my-subscription");
  }
  /** DELETE /api/subscription/remove/{subscription} */
  async subscriptionRemove(e) {
    return this.delete(
      `/api/subscription/remove/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/subscription/subscribe/{subscription} */
  async subscriptionSubscribe(e) {
    return this.get(
      `/api/subscription/subscribe/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/subscription/subscribers */
  async subscriptionSubscribers() {
    return this.get("/api/subscription/subscribers");
  }
  /** GET /api/subscription/subscribes */
  async subscriptionSubscribes() {
    return this.get("/api/subscription/subscribes");
  }
  /** PATCH /api/subscription/update/{subscription} */
  async subscriptionUpdate(e, t) {
    return this.patch(
      `/api/subscription/update/${encodeURIComponent(String(e))}`,
      t
    );
  }
  // ===========================================================================
  // Stripe webhook (PUBLIC — `auth: false` is load-bearing)
  // ===========================================================================
  /**
   * POST /api/webhook/stripe-payment/handle
   *
   * Public endpoint. Stripe POSTs the raw event payload here. The SDK
   * MUST NOT inject the `Authorization` header, so we pass
   * `{ auth: false }` per the manifest. The endpoint is still tenant-
   * scoped (Stripe Connect events carry the tenant via the connected
   * account id), so `X-Domain` is still sent.
   */
  async stripePaymentWebhook(e) {
    return this.post(
      "/api/webhook/stripe-payment/handle",
      e,
      { auth: !1 }
    );
  }
}
class tt extends c {
  // ===========================================================================
  // Search (admin / team search)
  // ===========================================================================
  /** POST /api/admin-search */
  async adminSearch(e) {
    return this.post("/api/admin-search", e);
  }
  /** POST /api/team-search */
  async teamSearch(e) {
    return this.post("/api/team-search", e);
  }
  // ===========================================================================
  // Administrator CRUD (`administrator.*`)
  // ===========================================================================
  /** POST /api/administrator */
  async createAdministrator(e) {
    return this.post("/api/administrator", e);
  }
  /** GET /api/administrator/{administrator} */
  async getAdministrator(e) {
    return this.get(
      `/api/administrator/${encodeURIComponent(String(e))}`
    );
  }
  /** PUT /api/administrator/{administrator} (POST + ?_method=PUT). */
  async updateAdministrator(e, t) {
    return this.put(
      `/api/administrator/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** DELETE /api/administrator/{administrator} */
  async deleteAdministrator(e) {
    return this.delete(
      `/api/administrator/${encodeURIComponent(String(e))}`
    );
  }
  // ===========================================================================
  // AI – models / settings / installation
  // ===========================================================================
  /** POST /api/ai/delete-model */
  async deleteAiModel(e) {
    return this.post("/api/ai/delete-model", e ?? {});
  }
  /** GET /api/ai/get-models */
  async getAiModels() {
    return this.get("/api/ai/get-models");
  }
  /** GET /api/ai/get-models-list */
  async getAiModelsList() {
    return this.get("/api/ai/get-models-list");
  }
  /** GET /api/ai/get-settings */
  async getAiSettings() {
    return this.get("/api/ai/get-settings");
  }
  /** POST /api/ai/install-model */
  async installAiModel(e) {
    return this.post("/api/ai/install-model", e ?? {});
  }
  /** GET /api/ai/installation-status */
  async getAiInstallationStatus() {
    return this.get("/api/ai/installation-status");
  }
  /** POST /api/ai/save-settings */
  async saveAiSettings(e) {
    return this.post("/api/ai/save-settings", e);
  }
  // ===========================================================================
  // AI Log CRUD (`admin.ai.log.*`)
  // ===========================================================================
  /** GET /api/ai/log */
  async listAiLogs() {
    return this.get("/api/ai/log");
  }
  /** POST /api/ai/log */
  async createAiLog(e) {
    return this.post("/api/ai/log", e);
  }
  /** GET /api/ai/log/{log} */
  async getAiLog(e) {
    return this.get(`/api/ai/log/${encodeURIComponent(String(e))}`);
  }
  /** PUT /api/ai/log/{log} */
  async updateAiLog(e, t) {
    return this.put(`/api/ai/log/${encodeURIComponent(String(e))}`, t);
  }
  /** DELETE /api/ai/log/{log} */
  async deleteAiLog(e) {
    return this.delete(
      `/api/ai/log/${encodeURIComponent(String(e))}`
    );
  }
  // ===========================================================================
  // AI Policy CRUD + prompt linkage
  // ===========================================================================
  /** GET /api/ai/policy */
  async listAiPolicies() {
    return this.get("/api/ai/policy");
  }
  /** POST /api/ai/policy */
  async createAiPolicy(e) {
    return this.post("/api/ai/policy", e);
  }
  /** GET /api/ai/policy/{policy} */
  async getAiPolicy(e) {
    return this.get(
      `/api/ai/policy/${encodeURIComponent(String(e))}`
    );
  }
  /** PUT /api/ai/policy/{policy} */
  async updateAiPolicy(e, t) {
    return this.put(
      `/api/ai/policy/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** DELETE /api/ai/policy/{policy} */
  async deleteAiPolicy(e) {
    return this.delete(
      `/api/ai/policy/${encodeURIComponent(String(e))}`
    );
  }
  /** DELETE /api/ai/policy-file/{file} */
  async deleteAiPolicyFile(e) {
    return this.delete(
      `/api/ai/policy-file/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/ai/policy-list/{prompt} */
  async listAiPoliciesForPrompt(e) {
    return this.get(
      `/api/ai/policy-list/${encodeURIComponent(String(e))}`
    );
  }
  /** POST /api/ai/policy/{policy}/prompts */
  async attachPromptToAiPolicy(e, t) {
    return this.post(
      `/api/ai/policy/${encodeURIComponent(String(e))}/prompts`,
      t
    );
  }
  /** DELETE /api/ai/policy/{policy}/prompts/{prompt} */
  async detachPromptFromAiPolicy(e, t) {
    return this.delete(
      `/api/ai/policy/${encodeURIComponent(String(e))}/prompts/${encodeURIComponent(String(t))}`
    );
  }
  // ===========================================================================
  // AI Prompts
  // ===========================================================================
  /** POST /api/ai/prompts/create */
  async createAiPrompt(e) {
    return this.post("/api/ai/prompts/create", e);
  }
  /** GET /api/ai/prompts/keywords */
  async getAiPromptKeywords() {
    return this.get("/api/ai/prompts/keywords");
  }
  /** GET /api/ai/prompts/list */
  async listAiPrompts() {
    return this.get("/api/ai/prompts/list");
  }
  /** GET /api/ai/prompts/list-policies */
  async listAiPromptPolicies() {
    return this.get("/api/ai/prompts/list-policies");
  }
  /** GET /api/ai/prompts/required-list */
  async getRequiredAiPrompts() {
    return this.get("/api/ai/prompts/required-list");
  }
  /** GET /api/ai/prompts/show/{prompt} */
  async getAiPrompt(e) {
    return this.get(
      `/api/ai/prompts/show/${encodeURIComponent(String(e))}`
    );
  }
  /** PUT /api/ai/prompts/update/{prompt} */
  async updateAiPrompt(e, t) {
    return this.put(
      `/api/ai/prompts/update/${encodeURIComponent(String(e))}`,
      t
    );
  }
  // ===========================================================================
  // Dashboard / domain settings
  // ===========================================================================
  /**
   * POST /api/dashboard-settings/save — accepts either a stored video id
   * (`video_id`) OR a `File` upload (`video_file`). When the payload carries
   * a `File`/`Blob`, `BaseApiClient.serializeBody` switches the request to
   * multipart/form-data automatically.
   */
  async saveDashboardSettings(e) {
    return this.post("/api/dashboard-settings/save", e);
  }
  /** GET /api/domain-settings/{id} */
  async getDomainSettings(e) {
    return this.get(
      `/api/domain-settings/${encodeURIComponent(String(e))}`
    );
  }
  // ===========================================================================
  // Fees
  // ===========================================================================
  /** GET /api/fees/fee */
  async listFees() {
    return this.get("/api/fees/fee");
  }
  /** POST /api/fees/fee */
  async createFee(e) {
    return this.post("/api/fees/fee", e);
  }
  /** GET /api/fees/fee/{fee} */
  async getFee(e) {
    return this.get(
      `/api/fees/fee/${encodeURIComponent(String(e))}`
    );
  }
  /** PUT /api/fees/fee/{fee} */
  async updateFee(e, t) {
    return this.put(
      `/api/fees/fee/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** DELETE /api/fees/fee/{fee} */
  async deleteFee(e) {
    return this.delete(
      `/api/fees/fee/${encodeURIComponent(String(e))}`
    );
  }
  /** POST /api/fees/find-users */
  async findFeeUsers(e) {
    return this.post("/api/fees/find-users", e);
  }
  /** GET /api/fees/get-settings */
  async getFeeSettings() {
    return this.get("/api/fees/get-settings");
  }
  /** POST /api/fees/save-settings */
  async saveFeeSettings(e) {
    return this.post("/api/fees/save-settings", e);
  }
  // ===========================================================================
  // Program categories / sub-categories / tags
  // ===========================================================================
  /** GET /api/program-categories */
  async listProgramCategoriesPublic() {
    return this.get("/api/program-categories");
  }
  /** GET /api/program-category */
  async listProgramCategories() {
    return this.get("/api/program-category");
  }
  /** POST /api/program-category */
  async createProgramCategory(e) {
    return this.post("/api/program-category", e);
  }
  /** GET /api/program-category/{program_category} */
  async getProgramCategory(e) {
    return this.get(
      `/api/program-category/${encodeURIComponent(String(e))}`
    );
  }
  /** PUT /api/program-category/{program_category} */
  async updateProgramCategory(e, t) {
    return this.put(
      `/api/program-category/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** DELETE /api/program-category/{program_category} */
  async deleteProgramCategory(e) {
    return this.delete(
      `/api/program-category/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/program-sub-category */
  async listProgramSubCategories() {
    return this.get("/api/program-sub-category");
  }
  /** POST /api/program-sub-category */
  async createProgramSubCategory(e) {
    return this.post("/api/program-sub-category", e);
  }
  /** GET /api/program-sub-category/{program_sub_category} */
  async getProgramSubCategory(e) {
    return this.get(
      `/api/program-sub-category/${encodeURIComponent(String(e))}`
    );
  }
  /** PUT /api/program-sub-category/{program_sub_category} */
  async updateProgramSubCategory(e, t) {
    return this.put(
      `/api/program-sub-category/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** DELETE /api/program-sub-category/{program_sub_category} */
  async deleteProgramSubCategory(e) {
    return this.delete(
      `/api/program-sub-category/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/program-tag */
  async listProgramTags() {
    return this.get("/api/program-tag");
  }
  /** POST /api/program-tag */
  async createProgramTag(e) {
    return this.post("/api/program-tag", e);
  }
  /** GET /api/program-tag/{program_tag} */
  async getProgramTag(e) {
    return this.get(
      `/api/program-tag/${encodeURIComponent(String(e))}`
    );
  }
  /** PUT /api/program-tag/{program_tag} */
  async updateProgramTag(e, t) {
    return this.put(
      `/api/program-tag/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** DELETE /api/program-tag/{program_tag} */
  async deleteProgramTag(e) {
    return this.delete(
      `/api/program-tag/${encodeURIComponent(String(e))}`
    );
  }
  // ===========================================================================
  // Project role
  // ===========================================================================
  /** GET /api/project-role */
  async listProjectRoles() {
    return this.get("/api/project-role");
  }
  /** POST /api/project-role */
  async createProjectRole(e) {
    return this.post("/api/project-role", e);
  }
  /** GET /api/project-role/permissions */
  async getProjectRolePermissions() {
    return this.get("/api/project-role/permissions");
  }
  /** GET /api/project-role/{project_role} */
  async getProjectRole(e) {
    return this.get(
      `/api/project-role/${encodeURIComponent(String(e))}`
    );
  }
  /** PUT /api/project-role/{project_role} */
  async updateProjectRole(e, t) {
    return this.put(
      `/api/project-role/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** DELETE /api/project-role/{project_role} */
  async deleteProjectRole(e) {
    return this.delete(
      `/api/project-role/${encodeURIComponent(String(e))}`
    );
  }
  // ===========================================================================
  // Provider + roles-to-assign
  // ===========================================================================
  /** GET /api/provider */
  async listProviders(e) {
    return this.get("/api/provider", e);
  }
  /** GET /api/provider/roles */
  async listProviderRoles() {
    return this.get("/api/provider/roles");
  }
  /** GET /api/roles-to-assign/all */
  async listRolesToAssign() {
    return this.get("/api/roles-to-assign/all");
  }
  // ===========================================================================
  // Statistic CRUD
  // ===========================================================================
  /** GET /api/statistic */
  async listStatistics() {
    return this.get("/api/statistic");
  }
  /** POST /api/statistic */
  async createStatistic(e) {
    return this.post("/api/statistic", e);
  }
  /** GET /api/statistic/{statistic} */
  async getStatistic(e) {
    return this.get(
      `/api/statistic/${encodeURIComponent(String(e))}`
    );
  }
  /** PUT /api/statistic/{statistic} */
  async updateStatistic(e, t) {
    return this.put(
      `/api/statistic/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** DELETE /api/statistic/{statistic} */
  async deleteStatistic(e) {
    return this.delete(
      `/api/statistic/${encodeURIComponent(String(e))}`
    );
  }
  // ===========================================================================
  // User (admin index/store) — show/update/destroy live in AuthUserApiClient
  // ===========================================================================
  /**
   * GET /api/user — admin user listing. The matching show/update/destroy
   * verbs at `/api/user/{user}` are owned by `AuthUserApiClient`
   * (`adminShowUser` / `adminUpdateUser` / `adminDestroyUser`).
   */
  async listAdminUsers(e) {
    return this.get("/api/user", e);
  }
  /** POST /api/user — admin user creation. */
  async createAdminUser(e) {
    return this.post("/api/user", e);
  }
}
class nt extends c {
  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------
  /** GET `/api/agents` — list (paginated) all agents. (`agents.module.index`) */
  list(e) {
    return this.get("/api/agents", void 0, e);
  }
  /** POST `/api/agents` — create a new agent. (`agents.module.store`) */
  create(e, t) {
    return this.post("/api/agents", e, t);
  }
  /** GET `/api/agents/{agent}` — show one agent. (`agents.module.show`) */
  show(e, t) {
    return this.get(`/api/agents/${encodeURIComponent(String(e))}`, void 0, t);
  }
  /** PUT `/api/agents/{agent}` — update. Sent as POST + `?_method=PUT`. (`agents.module.update`) */
  update(e, t, n) {
    return this.put(`/api/agents/${encodeURIComponent(String(e))}`, t, n);
  }
  /** DELETE `/api/agents/{agent}`. (`agents.module.destroy`) */
  destroy(e, t) {
    return this.delete(`/api/agents/${encodeURIComponent(String(e))}`, t);
  }
  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------
  /** POST `/api/agents/{agent}/activate`. (`agents.module.activate`) */
  activate(e, t) {
    return this.post(`/api/agents/${encodeURIComponent(String(e))}/activate`, void 0, t);
  }
  /** POST `/api/agents/{agent}/deactivate`. (`agents.module.deactivate`) */
  deactivate(e, t) {
    return this.post(`/api/agents/${encodeURIComponent(String(e))}/deactivate`, void 0, t);
  }
  /** POST `/api/agents/{agent}/clone`. (`agents.module.clone`) */
  clone(e, t, n) {
    return this.post(`/api/agents/${encodeURIComponent(String(e))}/clone`, t, n);
  }
  /** POST `/api/agents/execute-protocol` — kick off a protocol run. (`agents.module.execute.protocol`) */
  executeProtocol(e, t) {
    return this.post("/api/agents/execute-protocol", e, t);
  }
  /** POST `/api/agents/resume-execution` — feed input back into a paused run. (`agents.module.execute.resume`) */
  resumeExecution(e, t) {
    return this.post("/api/agents/resume-execution", e, t);
  }
  // ---------------------------------------------------------------------------
  // Insights / polling
  // ---------------------------------------------------------------------------
  /**
   * GET `/api/agents/{agent}/executions` — execution history for an agent.
   * Doubles as a simple poll for current run status; the SDK does NOT
   * subscribe to broadcasts here — callers wire that up separately.
   * (`agents.module.executions`)
   */
  executions(e, t) {
    return this.get(
      `/api/agents/${encodeURIComponent(String(e))}/executions`,
      void 0,
      t
    );
  }
  /** GET `/api/agents/{agent}/statistics`. (`agents.module.statistics`) */
  statistics(e, t) {
    return this.get(
      `/api/agents/${encodeURIComponent(String(e))}/statistics`,
      void 0,
      t
    );
  }
  // ---------------------------------------------------------------------------
  // Tool binding
  // ---------------------------------------------------------------------------
  /** POST `/api/agents/{agent}/tools/{tool}` — attach a tool to an agent. (`agents.module.tools.add`) */
  addTool(e, t, n) {
    return this.post(
      `/api/agents/${encodeURIComponent(String(e))}/tools/${encodeURIComponent(String(t))}`,
      void 0,
      n
    );
  }
  /** DELETE `/api/agents/{agent}/tools/{tool}`. (`agents.module.tools.remove`) */
  removeTool(e, t, n) {
    return this.delete(
      `/api/agents/${encodeURIComponent(String(e))}/tools/${encodeURIComponent(String(t))}`,
      n
    );
  }
  // ---------------------------------------------------------------------------
  // Intelligent routing (auth: public — pass `{ auth: false }` per-call)
  // ---------------------------------------------------------------------------
  /** POST `/api/agents/intelligent/entity/identify`. (`agents.module.intelligent.entity.identify`) */
  identifyEntity(e, t) {
    return this.post("/api/agents/intelligent/entity/identify", e, t);
  }
  /** POST `/api/agents/intelligent/intent/process`. (`agents.module.intelligent.process`) */
  processIntent(e, t) {
    return this.post("/api/agents/intelligent/intent/process", e, t);
  }
  /** POST `/api/agents/intelligent/intent/batch`. (`agents.module.intelligent.batch`) */
  processIntentBatch(e, t) {
    return this.post("/api/agents/intelligent/intent/batch", e, t);
  }
  /** POST `/api/agents/intelligent/search`. (`agents.module.intelligent.search`) */
  intelligentSearch(e, t) {
    return this.post("/api/agents/intelligent/search", e, t);
  }
  /** GET `/api/agents/intelligent/statistics`. (`agents.module.intelligent.statistics`) */
  intelligentStatistics(e) {
    return this.get("/api/agents/intelligent/statistics", void 0, e);
  }
  // ---------------------------------------------------------------------------
  // Protocol integration
  // ---------------------------------------------------------------------------
  /** GET `/api/protocol/agents/all`. (`get.api.protocol.agents.all`) */
  listProtocolAgents(e) {
    return this.get("/api/protocol/agents/all", void 0, e);
  }
}
class rt extends c {
  // ---------------------------------------------------------------------------
  // KPI core
  // ---------------------------------------------------------------------------
  /** GET `/api/kpi/get-setup/{chain}/{protocol}`. (`get.api.kpi.get-setup.item.item`) */
  getSetup(e, t, n) {
    const s = encodeURIComponent(String(e)), o = encodeURIComponent(String(t));
    return this.get(`/api/kpi/get-setup/${s}/${o}`, void 0, n);
  }
  /**
   * GET `/api/kpi/get/{chain}`. (`get.api.kpi.get.item`)
   *
   * Named `getTasks` rather than `get` because the latter would shadow the
   * inherited `BaseApiClient.get()` verb wrapper and break every other
   * method on this class.
   */
  getTasks(e, t) {
    const n = encodeURIComponent(String(e));
    return this.get(`/api/kpi/get/${n}`, void 0, t);
  }
  /** DELETE `/api/kpi/remove-rule/{rule}`. (`delete.api.kpi.remove-rule.item`) */
  removeRule(e, t) {
    const n = encodeURIComponent(String(e));
    return this.delete(`/api/kpi/remove-rule/${n}`, t);
  }
  /** POST `/api/kpi/save`. (`post.api.kpi.save`) */
  save(e, t) {
    return this.post("/api/kpi/save", e, t);
  }
  /** POST `/api/kpi/save-round-results`. (`post.api.kpi.save-round-results`) */
  saveRoundResults(e, t) {
    return this.post("/api/kpi/save-round-results", e, t);
  }
  /** POST `/api/kpi/save-setup`. (`post.api.kpi.save-setup`) */
  saveSetup(e, t) {
    return this.post("/api/kpi/save-setup", e, t);
  }
  /** POST `/api/kpi/validate-parameters`. (`post.api.kpi.validate-parameters`) */
  validateParameters(e, t) {
    return this.post("/api/kpi/validate-parameters", e, t);
  }
  // ---------------------------------------------------------------------------
  // Onboarding (controllers live in Modules/KPI even though the path differs)
  // ---------------------------------------------------------------------------
  /** GET `/api/onboarding/get/{protocol}`. (`get.api.onboarding.get.item`) */
  getOnboarding(e, t) {
    const n = encodeURIComponent(String(e));
    return this.get(`/api/onboarding/get/${n}`, void 0, t);
  }
  /** POST `/api/onboarding/save/{protocol}`. (`post.api.onboarding.save.item`) */
  saveOnboarding(e, t, n) {
    const s = encodeURIComponent(String(e));
    return this.post(`/api/onboarding/save/${s}`, t, n);
  }
  // ---------------------------------------------------------------------------
  // Device listing
  // ---------------------------------------------------------------------------
  /** GET `/api/user-devices/list`. (`get.api.user-devices.list`) */
  listUserDevices(e) {
    return this.get("/api/user-devices/list", void 0, e);
  }
  // ---------------------------------------------------------------------------
  // Withings
  // ---------------------------------------------------------------------------
  /** GET `/api/withings/auth`. (`get.api.withings.auth`) */
  withingsAuth(e) {
    return this.get("/api/withings/auth", void 0, e);
  }
  /**
   * GET `/api/withings/callback`. (`get.api.withings.callback`)
   *
   * Withings' OAuth dance lands here with `code` + `state` query params; we
   * forward them via the `params` argument so they end up on the URL rather
   * than the body.
   */
  withingsCallback(e, t) {
    return this.get("/api/withings/callback", e, t);
  }
  /** POST `/api/withings/webhook`. (`post.api.withings.webhook`) */
  withingsWebhook(e, t) {
    return this.post("/api/withings/webhook", e, t);
  }
}
class st extends c {
  // ---------------------------------------------------------------------------
  // activity-location resource — `activity-location.{index,store,show,update,destroy}`
  // ---------------------------------------------------------------------------
  /** GET `/api/activity-location` — paginated activity locations. (`activity-location.index`) */
  listLocations(e) {
    return this.get("/api/activity-location", void 0, e);
  }
  /** POST `/api/activity-location` — create an activity location. (`activity-location.store`) */
  createLocation(e, t) {
    return this.post("/api/activity-location", e, t);
  }
  /** GET `/api/activity-location/{activity_location}`. (`activity-location.show`) */
  showLocation(e, t) {
    return this.get(
      `/api/activity-location/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** PUT `/api/activity-location/{activity_location}` — POST + `?_method=PUT`. (`activity-location.update`) */
  updateLocation(e, t, n) {
    return this.put(
      `/api/activity-location/${encodeURIComponent(String(e))}`,
      t,
      n
    );
  }
  /** DELETE `/api/activity-location/{activity_location}`. (`activity-location.destroy`) */
  destroyLocation(e, t) {
    return this.delete(
      `/api/activity-location/${encodeURIComponent(String(e))}`,
      t
    );
  }
  // ---------------------------------------------------------------------------
  // activity execution surface — /api/activity/*
  // ---------------------------------------------------------------------------
  /** GET `/api/activity/booked-events-day/{date}`. (`get.api.activity.booked-events-day.item`) */
  bookedEventsDay(e, t) {
    return this.get(
      `/api/activity/booked-events-day/${encodeURIComponent(e)}`,
      void 0,
      t
    );
  }
  /** GET `/api/activity/booked-events-month/{date}`. (`get.api.activity.booked-events-month.item`) */
  bookedEventsMonth(e, t) {
    return this.get(
      `/api/activity/booked-events-month/${encodeURIComponent(e)}`,
      void 0,
      t
    );
  }
  /** POST `/api/activity/confirm-booking`. (`post.api.activity.confirm-booking`) */
  confirmBooking(e, t) {
    return this.post("/api/activity/confirm-booking", e, t);
  }
  /** GET `/api/activity/expert-finish/{booking}`. (`get.api.activity.expert-finish.item`) */
  expertFinish(e, t) {
    return this.get(
      `/api/activity/expert-finish/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** GET `/api/activity/failed-service/{booking}`. (`get.api.activity.failed-service.item`) */
  failedService(e, t) {
    return this.get(
      `/api/activity/failed-service/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /**
   * GET `/api/activity/get-booking-windows/{location}/{service}/{week?}`.
   * The `week` segment is optional — the SDK omits it when undefined so the
   * 2-segment Laravel route also matches.
   * (`get.api.activity.get-booking-windows.item.item.item`)
   */
  getBookingWindows(e, t, n, s) {
    const o = `/api/activity/get-booking-windows/${encodeURIComponent(String(e))}/${encodeURIComponent(String(t))}`, i = n === void 0 ? o : `${o}/${encodeURIComponent(String(n))}`;
    return this.get(i, void 0, s);
  }
  /** GET `/api/activity/get-pending-amount`. (`get.api.activity.get-pending-amount`) */
  getPendingAmount(e) {
    return this.get("/api/activity/get-pending-amount", void 0, e);
  }
  /** GET `/api/activity/get-providers/{activity}`. (`get.api.activity.get-providers.item`) */
  getProviders(e, t) {
    return this.get(
      `/api/activity/get-providers/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** POST `/api/activity/handle-event`. (`post.api.activity.handle-event`) */
  handleEvent(e, t) {
    return this.post("/api/activity/handle-event", e, t);
  }
  /** POST `/api/activity/reset-reservation`. (`post.api.activity.reset-reservation`) */
  resetReservation(e, t) {
    return this.post("/api/activity/reset-reservation", e, t);
  }
  /** POST `/api/activity/running`. (`post.api.activity.running`) */
  runningActivity(e, t) {
    return this.post("/api/activity/running", e, t);
  }
  /** POST `/api/activity/set-reservation`. (`post.api.activity.set-reservation`) */
  setReservation(e, t) {
    return this.post("/api/activity/set-reservation", e, t);
  }
  /** GET `/api/activity/user-finish/{booking}`. (`get.api.activity.user-finish.item`) */
  userFinish(e, t) {
    return this.get(
      `/api/activity/user-finish/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  // ---------------------------------------------------------------------------
  // creator-activity resource — `creator-activity.{index,store,show,update,destroy}`
  // ---------------------------------------------------------------------------
  /** GET `/api/creator-activity`. (`creator-activity.index`) */
  listCreatorActivities(e) {
    return this.get("/api/creator-activity", void 0, e);
  }
  /** POST `/api/creator-activity`. (`creator-activity.store`) */
  createCreatorActivity(e, t) {
    return this.post("/api/creator-activity", e, t);
  }
  /** GET `/api/creator-activity/{creator_activity}`. (`creator-activity.show`) */
  showCreatorActivity(e, t) {
    return this.get(
      `/api/creator-activity/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** PUT `/api/creator-activity/{creator_activity}`. (`creator-activity.update`) */
  updateCreatorActivity(e, t, n) {
    return this.put(
      `/api/creator-activity/${encodeURIComponent(String(e))}`,
      t,
      n
    );
  }
  /** DELETE `/api/creator-activity/{creator_activity}`. (`creator-activity.destroy`) */
  destroyCreatorActivity(e, t) {
    return this.delete(
      `/api/creator-activity/${encodeURIComponent(String(e))}`,
      t
    );
  }
  // ---------------------------------------------------------------------------
  // protocol integration
  // ---------------------------------------------------------------------------
  /** GET `/api/protocol/activity/all`. (`get.api.protocol.activity.all`) */
  listProtocolActivities(e) {
    return this.get("/api/protocol/activity/all", void 0, e);
  }
  // ---------------------------------------------------------------------------
  // service-location surface — /api/service-location/*
  // ---------------------------------------------------------------------------
  /** POST `/api/service-location/create`. (`post.api.service-location.create`) */
  createServiceLocation(e, t) {
    return this.post("/api/service-location/create", e, t);
  }
  /** POST `/api/service-location/find`. (`post.api.service-location.find`) */
  findServiceLocation(e, t) {
    return this.post("/api/service-location/find", e, t);
  }
  /** GET `/api/service-location/location/{location}`. (`get.api.service-location.location.item`) */
  serviceLocationByLocation(e, t) {
    return this.get(
      `/api/service-location/location/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** GET `/api/service-location/service/{service}`. (`get.api.service-location.service.item`) */
  serviceLocationByService(e, t) {
    return this.get(
      `/api/service-location/service/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** DELETE `/api/service-location/service/{service}`. (`delete.api.service-location.service.item`) */
  destroyServiceLocationByService(e, t) {
    return this.delete(
      `/api/service-location/service/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** PUT `/api/service-location/update/{service}`. (`put.api.service-location.update.item`) */
  updateServiceLocation(e, t, n) {
    return this.put(
      `/api/service-location/update/${encodeURIComponent(String(e))}`,
      t,
      n
    );
  }
  /** GET `/api/service-location/{location}`. (`get.api.service-location.item`) */
  showServiceLocation(e, t) {
    return this.get(
      `/api/service-location/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
}
class ot extends c {
  // ---------------------------------------------------------------------------
  // assessment resource
  // ---------------------------------------------------------------------------
  /** GET `/api/assessment`. (`assessment.index`) */
  listAssessments(e) {
    return this.get("/api/assessment", void 0, e);
  }
  /** POST `/api/assessment`. (`assessment.store`) */
  createAssessment(e, t) {
    return this.post("/api/assessment", e, t);
  }
  /** GET `/api/assessment/run-global/{assessment}/{task}`. (`get.api.assessment.run-global.item.item`) */
  runAssessmentGlobal(e, t, n) {
    return this.get(
      `/api/assessment/run-global/${encodeURIComponent(String(e))}/${encodeURIComponent(String(t))}`,
      void 0,
      n
    );
  }
  /** GET `/api/assessment/run/{assessment}/{chain}`. (`get.api.assessment.run.item.item`) */
  runAssessment(e, t, n) {
    return this.get(
      `/api/assessment/run/${encodeURIComponent(String(e))}/${encodeURIComponent(String(t))}`,
      void 0,
      n
    );
  }
  /** GET `/api/assessment/{assessment}`. (`assessment.show`) */
  showAssessment(e, t) {
    return this.get(
      `/api/assessment/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** PUT `/api/assessment/{assessment}` — POST + `?_method=PUT`. (`assessment.update`) */
  updateAssessment(e, t, n) {
    return this.put(
      `/api/assessment/${encodeURIComponent(String(e))}`,
      t,
      n
    );
  }
  /** DELETE `/api/assessment/{assessment}`. (`assessment.destroy`) */
  destroyAssessment(e, t) {
    return this.delete(
      `/api/assessment/${encodeURIComponent(String(e))}`,
      t
    );
  }
  // ---------------------------------------------------------------------------
  // attend resource
  // ---------------------------------------------------------------------------
  /** GET `/api/attend`. (`attend.index`) */
  listAttends(e) {
    return this.get("/api/attend", void 0, e);
  }
  /** POST `/api/attend`. (`attend.store`) */
  createAttend(e, t) {
    return this.post("/api/attend", e, t);
  }
  /** GET `/api/attend/all`. (`get.api.attend.all`) */
  listAllAttends(e) {
    return this.get("/api/attend/all", void 0, e);
  }
  /** GET `/api/attend/{attend}`. (`attend.show`) */
  showAttend(e, t) {
    return this.get(`/api/attend/${encodeURIComponent(String(e))}`, void 0, t);
  }
  /** PUT `/api/attend/{attend}`. (`attend.update`) */
  updateAttend(e, t, n) {
    return this.put(`/api/attend/${encodeURIComponent(String(e))}`, t, n);
  }
  /** DELETE `/api/attend/{attend}`. (`attend.destroy`) */
  destroyAttend(e, t) {
    return this.delete(`/api/attend/${encodeURIComponent(String(e))}`, t);
  }
  // ---------------------------------------------------------------------------
  // choice
  // ---------------------------------------------------------------------------
  /** DELETE `/api/choice/{choice}`. (`delete.api.choice.item`) */
  destroyChoice(e, t) {
    return this.delete(`/api/choice/${encodeURIComponent(String(e))}`, t);
  }
  // ---------------------------------------------------------------------------
  // protocol integration
  // ---------------------------------------------------------------------------
  /** GET `/api/protocol/assessment/all`. (`get.api.protocol.assessment.all`) */
  listProtocolAssessments(e) {
    return this.get("/api/protocol/assessment/all", void 0, e);
  }
  /** GET `/api/protocol/assessment/item-instances/{assessment}`. (`get.api.protocol.assessment.item-instances.item`) */
  protocolItemInstances(e, t) {
    return this.get(
      `/api/protocol/assessment/item-instances/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  // ---------------------------------------------------------------------------
  // question resource
  // ---------------------------------------------------------------------------
  /** GET `/api/question`. (`question.index`) */
  listQuestions(e) {
    return this.get("/api/question", void 0, e);
  }
  /** POST `/api/question`. (`question.store`) */
  createQuestion(e, t) {
    return this.post("/api/question", e, t);
  }
  /** GET `/api/question/all`. (`get.api.question.all`) */
  listAllQuestions(e) {
    return this.get("/api/question/all", void 0, e);
  }
  /** GET `/api/question/by-assessment-full/{assessment}`. (`get.api.question.by-assessment-full.item`) */
  questionsByAssessmentFull(e, t) {
    return this.get(
      `/api/question/by-assessment-full/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** GET `/api/question/by-assessment/{assessment}`. (`get.api.question.by-assessment.item`) */
  questionsByAssessment(e, t) {
    return this.get(
      `/api/question/by-assessment/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** GET `/api/question/{question}`. (`question.show`) */
  showQuestion(e, t) {
    return this.get(`/api/question/${encodeURIComponent(String(e))}`, void 0, t);
  }
  /** PUT `/api/question/{question}`. (`question.update`) */
  updateQuestion(e, t, n) {
    return this.put(`/api/question/${encodeURIComponent(String(e))}`, t, n);
  }
  /** DELETE `/api/question/{question}`. (`question.destroy`) */
  destroyQuestion(e, t) {
    return this.delete(`/api/question/${encodeURIComponent(String(e))}`, t);
  }
  // ---------------------------------------------------------------------------
  // response resource (note `/api/response` POST and `/api/response/store` POST coexist)
  // ---------------------------------------------------------------------------
  /** GET `/api/response`. (`response.index`) */
  listResponses(e) {
    return this.get("/api/response", void 0, e);
  }
  /** POST `/api/response`. (`response.store`) */
  createResponse(e, t) {
    return this.post("/api/response", e, t);
  }
  /** GET `/api/response/all`. (`get.api.response.all`) */
  listAllResponses(e) {
    return this.get("/api/response/all", void 0, e);
  }
  /** POST `/api/response/store` — alternate creation route. (`post.api.response.store`) */
  storeResponse(e, t) {
    return this.post("/api/response/store", e, t);
  }
  /** GET `/api/response/{response}`. (`response.show`) */
  showResponse(e, t) {
    return this.get(`/api/response/${encodeURIComponent(String(e))}`, void 0, t);
  }
  /** PUT `/api/response/{response}`. (`response.update`) */
  updateResponse(e, t, n) {
    return this.put(`/api/response/${encodeURIComponent(String(e))}`, t, n);
  }
  /** DELETE `/api/response/{response}`. (`response.destroy`) */
  destroyResponse(e, t) {
    return this.delete(`/api/response/${encodeURIComponent(String(e))}`, t);
  }
}
class it extends c {
  // ---------------------------------------------------------------------------
  // challenge resource
  // ---------------------------------------------------------------------------
  /** GET `/api/challenge`. (`challenge.index`) */
  listChallenges(e) {
    return this.get("/api/challenge", void 0, e);
  }
  /** POST `/api/challenge`. (`challenge.store`) */
  createChallenge(e, t) {
    return this.post("/api/challenge", e, t);
  }
  /** GET `/api/challenge/{challenge}`. (`challenge.show`) */
  showChallenge(e, t) {
    return this.get(`/api/challenge/${encodeURIComponent(String(e))}`, void 0, t);
  }
  /** PUT `/api/challenge/{challenge}`. (`challenge.update`) */
  updateChallenge(e, t, n) {
    return this.put(
      `/api/challenge/${encodeURIComponent(String(e))}`,
      t,
      n
    );
  }
  /** DELETE `/api/challenge/{challenge}`. (`challenge.destroy`) */
  destroyChallenge(e, t) {
    return this.delete(`/api/challenge/${encodeURIComponent(String(e))}`, t);
  }
  // ---------------------------------------------------------------------------
  // execution surface
  // ---------------------------------------------------------------------------
  /** GET `/api/challenge/finish/{attached}`. (`get.api.challenge.finish.item`) */
  finishAttachedChallenge(e, t) {
    return this.get(
      `/api/challenge/finish/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** GET `/api/challenge/get-challenge-global-tasks/{challenge}/{task}`. */
  getChallengeGlobalTasks(e, t, n) {
    return this.get(
      `/api/challenge/get-challenge-global-tasks/${encodeURIComponent(String(e))}/${encodeURIComponent(String(t))}`,
      void 0,
      n
    );
  }
  /** GET `/api/challenge/get-challenge-tasks/{challenge}/{chain}`. */
  getChallengeTasks(e, t, n) {
    return this.get(
      `/api/challenge/get-challenge-tasks/${encodeURIComponent(String(e))}/${encodeURIComponent(String(t))}`,
      void 0,
      n
    );
  }
  /** GET `/api/challenge/get-challenge/{challenge}/{chain}`. */
  getChallenge(e, t, n) {
    return this.get(
      `/api/challenge/get-challenge/${encodeURIComponent(String(e))}/${encodeURIComponent(String(t))}`,
      void 0,
      n
    );
  }
  /** GET `/api/challenge/get-global-challenge/{challenge}/{task}`. */
  getGlobalChallenge(e, t, n) {
    return this.get(
      `/api/challenge/get-global-challenge/${encodeURIComponent(String(e))}/${encodeURIComponent(String(t))}`,
      void 0,
      n
    );
  }
  /** GET `/api/challenge/get-types`. (`get.api.challenge.get-types`) */
  getChallengeTypes(e) {
    return this.get("/api/challenge/get-types", void 0, e);
  }
  /**
   * POST `/api/challenge/record-video` — multipart upload.
   *
   * The `BaseApiClient.serializeBody` helper detects the `Blob`/`File`
   * payload and switches the request to `multipart/form-data` with bracket-
   * notation for nested fields (Laravel convention).
   */
  recordVideo(e, t) {
    return this.post("/api/challenge/record-video", e, t);
  }
  /** POST `/api/challenge/run`. (`post.api.challenge.run`) */
  runChallenge(e, t) {
    return this.post("/api/challenge/run", e, t);
  }
  /** POST `/api/challenge/run-global`. (`post.api.challenge.run-global`) */
  runGlobalChallenge(e, t) {
    return this.post("/api/challenge/run-global", e, t);
  }
  /** POST `/api/challenge/set-result/{result}`. (`post.api.challenge.set-result.item`) */
  setChallengeResult(e, t, n) {
    return this.post(
      `/api/challenge/set-result/${encodeURIComponent(String(e))}`,
      t,
      n
    );
  }
  /** POST `/api/challenge/start-task`. (`post.api.challenge.start-task`) */
  startChallengeTask(e, t) {
    return this.post("/api/challenge/start-task", e, t);
  }
  /** DELETE `/api/challenge/task/destroy/{task}`. (`delete.api.challenge.task.destroy.item`) */
  destroyChallengeTask(e, t) {
    return this.delete(
      `/api/challenge/task/destroy/${encodeURIComponent(String(e))}`,
      t
    );
  }
  // ---------------------------------------------------------------------------
  // protocol integration
  // ---------------------------------------------------------------------------
  /** GET `/api/protocol/challenge/all`. (`get.api.protocol.challenge.all`) */
  listProtocolChallenges(e) {
    return this.get("/api/protocol/challenge/all", void 0, e);
  }
}
class at extends c {
  // ---------------------------------------------------------------------------
  // follow-up resource
  // ---------------------------------------------------------------------------
  /** GET `/api/follow-up`. (`follow-up.index`) */
  listFollowUps(e) {
    return this.get("/api/follow-up", void 0, e);
  }
  /** POST `/api/follow-up`. (`follow-up.store`) */
  createFollowUp(e, t) {
    return this.post("/api/follow-up", e, t);
  }
  /** GET `/api/follow-up/{follow_up}`. (`follow-up.show`) */
  showFollowUp(e, t) {
    return this.get(`/api/follow-up/${encodeURIComponent(String(e))}`, void 0, t);
  }
  /** PUT `/api/follow-up/{follow_up}`. (`follow-up.update`) */
  updateFollowUp(e, t, n) {
    return this.put(`/api/follow-up/${encodeURIComponent(String(e))}`, t, n);
  }
  /** DELETE `/api/follow-up/{follow_up}`. (`follow-up.destroy`) */
  destroyFollowUp(e, t) {
    return this.delete(`/api/follow-up/${encodeURIComponent(String(e))}`, t);
  }
  // ---------------------------------------------------------------------------
  // execution surface (GET-driven, mostly read-side)
  // ---------------------------------------------------------------------------
  /** GET `/api/follow-up/finish/{id}`. (`get.api.follow-up.finish.item`) */
  finishFollowUp(e, t) {
    return this.get(`/api/follow-up/finish/${encodeURIComponent(String(e))}`, void 0, t);
  }
  /** GET `/api/follow-up/get-current-followup`. (`get.api.follow-up.get-current-followup`) */
  getCurrentFollowUp(e) {
    return this.get("/api/follow-up/get-current-followup", void 0, e);
  }
  /** GET `/api/follow-up/get-data/{chain}`. (`get.api.follow-up.get-data.item`) */
  getFollowUpData(e, t) {
    return this.get(
      `/api/follow-up/get-data/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** GET `/api/follow-up/get-timeline/{chain}`. (`get.api.follow-up.get-timeline.item`) */
  getFollowUpTimeline(e, t) {
    return this.get(
      `/api/follow-up/get-timeline/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** GET `/api/follow-up/handle-recommendation/{recommendation}/{status}`. */
  handleRecommendation(e, t, n) {
    return this.get(
      `/api/follow-up/handle-recommendation/${encodeURIComponent(String(e))}/${encodeURIComponent(t)}`,
      void 0,
      n
    );
  }
  /** GET `/api/follow-up/payment/{followup}`. (`get.api.follow-up.payment.item`) */
  followUpPayment(e, t) {
    return this.get(
      `/api/follow-up/payment/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** GET `/api/follow-up/recommendations/{followup}`. (`get.api.follow-up.recommendations.item`) */
  followUpRecommendations(e, t) {
    return this.get(
      `/api/follow-up/recommendations/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** GET `/api/follow-up/run/{chain}`. (`get.api.follow-up.run.item`) */
  runFollowUp(e, t) {
    return this.get(
      `/api/follow-up/run/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  // ---------------------------------------------------------------------------
  // voice recording
  // ---------------------------------------------------------------------------
  /** POST `/api/follow-up/voice-finalize`. (`post.api.follow-up.voice-finalize`) */
  voiceFinalize(e, t) {
    return this.post("/api/follow-up/voice-finalize", e, t);
  }
  /**
   * POST `/api/follow-up/voice-record` — multipart upload.
   *
   * `BaseApiClient.serializeBody` detects the `Blob`/`File` and switches the
   * request to `multipart/form-data`. Upstream rules: `voice` is required
   * (wav, max 1000kb), `chain_id` and `speech_id` are required strings,
   * `follow_up_id` is optional.
   */
  voiceRecord(e, t) {
    return this.post("/api/follow-up/voice-record", e, t);
  }
}
class ct extends c {
  // ---------------------------------------------------------------------------
  // Order CRUD
  // ---------------------------------------------------------------------------
  /** GET `/api/order` — list (paginated) the user's orders. (`order.index`) */
  list(e) {
    return this.get("/api/order", void 0, e);
  }
  /** POST `/api/order` — create a new order. (`order.store`) */
  create(e, t) {
    return this.post("/api/order", e, t);
  }
  /** GET `/api/order/{order}` — show one order with items & collections. (`order.show`) */
  show(e, t) {
    return this.get(
      `/api/order/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** PUT `/api/order/{order}` — update title + items. Sent as POST + `?_method=PUT`. (`order.update`) */
  update(e, t, n) {
    return this.put(`/api/order/${encodeURIComponent(String(e))}`, t, n);
  }
  /** DELETE `/api/order/{order}` — destroy. (`order.destroy`) */
  destroy(e, t) {
    return this.delete(`/api/order/${encodeURIComponent(String(e))}`, t);
  }
  /** DELETE `/api/order-item/{item}` — remove a single item from an order. */
  deleteItem(e, t) {
    return this.delete(`/api/order-item/${encodeURIComponent(String(e))}`, t);
  }
  // ---------------------------------------------------------------------------
  // Checkout / payment lifecycle
  // ---------------------------------------------------------------------------
  /** POST `/api/order/cancel-order` — cancel a placed order. */
  cancel(e, t) {
    return this.post("/api/order/cancel-order", e, t);
  }
  /** POST `/api/order/checkout` — start checkout for an attached order. */
  checkout(e, t) {
    return this.post("/api/order/checkout", e, t);
  }
  /** POST `/api/order/confirm-order` — submit shipping address + confirm. */
  confirmOrder(e, t) {
    return this.post("/api/order/confirm-order", e, t);
  }
  /** POST `/api/order/confirm-payment` — confirm a placed payment. */
  confirmPayment(e, t) {
    return this.post("/api/order/confirm-payment", e, t);
  }
  /** GET `/api/order/get-checkout-items/{order}` — items currently in checkout. */
  getCheckoutItems(e, t) {
    return this.get(
      `/api/order/get-checkout-items/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** POST `/api/order/get-item` — scrape an Amazon/eBay product page. */
  getItem(e, t) {
    return this.post("/api/order/get-item", e, t);
  }
  /** GET `/api/order/get-order-items/{order}` — items currently attached to an order. */
  getOrderItems(e, t) {
    return this.get(
      `/api/order/get-order-items/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** GET `/api/order/pay/{order}` — fetch the payment page / amount for an attached order. */
  pay(e, t) {
    return this.get(
      `/api/order/pay/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** POST `/api/order/validate-item` — validate a scraped item before adding it. */
  validateItem(e, t) {
    return this.post("/api/order/validate-item", e, t);
  }
  // ---------------------------------------------------------------------------
  // Protocol runners
  // ---------------------------------------------------------------------------
  /** GET `/api/order/run-global/{order}/{task}` — execute a global task on an order. */
  runGlobal(e, t, n) {
    return this.get(
      `/api/order/run-global/${encodeURIComponent(String(e))}/${encodeURIComponent(String(t))}`,
      void 0,
      n
    );
  }
  /** GET `/api/order/run/{order}/{chain}` — execute a chain step on an order. */
  run(e, t, n) {
    return this.get(
      `/api/order/run/${encodeURIComponent(String(e))}/${encodeURIComponent(String(t))}`,
      void 0,
      n
    );
  }
  // ---------------------------------------------------------------------------
  // Admin dashboard (upstream `role:SuperAdmin` — caller supplies admin Bearer)
  // ---------------------------------------------------------------------------
  /** POST `/api/orders/confirm` — admin sets the final price + confirms an order. */
  adminConfirm(e, t) {
    return this.post("/api/orders/confirm", e, t);
  }
  /** POST `/api/orders/delivery-started` — admin marks the order as out-for-delivery. */
  adminDeliveryStarted(e, t) {
    return this.post("/api/orders/delivery-started", e, t);
  }
  /** GET `/api/orders/show/{order}` — admin order detail. */
  adminShow(e, t) {
    return this.get(
      `/api/orders/show/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** GET `/api/orders/{status}` — admin paginated list filtered by attached-order status. */
  adminListByStatus(e, t) {
    return this.get(
      `/api/orders/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  // ---------------------------------------------------------------------------
  // Protocol integration
  // ---------------------------------------------------------------------------
  /** GET `/api/protocol/order/all`. (`get.api.protocol.order.all`) */
  listProtocolOrders(e) {
    return this.get("/api/protocol/order/all", void 0, e);
  }
}
class pt extends c {
  // ---------------------------------------------------------------------------
  // Catalog items (`/api/items/*`)
  // ---------------------------------------------------------------------------
  /** GET `/api/items` — list catalog items. (`items.index`) */
  listItems(e) {
    return this.get("/api/items", void 0, e);
  }
  /** POST `/api/items` — create a catalog item. (`items.store`) */
  createItem(e, t) {
    return this.post("/api/items", e, t);
  }
  /** GET `/api/items/{item}` — show a catalog item. (`items.show`) */
  showItem(e, t) {
    return this.get(`/api/items/${encodeURIComponent(String(e))}`, void 0, t);
  }
  /** PUT `/api/items/{item}` — update. Sent as POST + `?_method=PUT`. (`items.update`) */
  updateItem(e, t, n) {
    return this.put(`/api/items/${encodeURIComponent(String(e))}`, t, n);
  }
  /** DELETE `/api/items/{item}`. (`items.destroy`) */
  destroyItem(e, t) {
    return this.delete(`/api/items/${encodeURIComponent(String(e))}`, t);
  }
  /** GET `/api/items/find-item/{search}/{type}` — fuzzy lookup of catalog or user items. */
  findItem(e, t, n) {
    return this.get(
      `/api/items/find-item/${encodeURIComponent(e)}/${encodeURIComponent(t)}`,
      void 0,
      n
    );
  }
  /** GET `/api/items/food-categories` — list food categories used by user-items. */
  foodCategories(e) {
    return this.get("/api/items/food-categories", void 0, e);
  }
  // ---------------------------------------------------------------------------
  // User items (`/api/user-items/*`)
  // ---------------------------------------------------------------------------
  /** GET `/api/user-items` — list (paginated) the user's custom items. (`user-items.index`) */
  listUserItems(e) {
    return this.get("/api/user-items", void 0, e);
  }
  /** POST `/api/user-items` — create a user-item. (`user-items.store`) */
  createUserItem(e, t) {
    return this.post("/api/user-items", e, t);
  }
  /** GET `/api/user-items/{user_item}` — show. (`user-items.show`) */
  showUserItem(e, t) {
    return this.get(
      `/api/user-items/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /**
   * PUT `/api/user-items/{user_item}` — update.
   *
   * Sent as POST + `?_method=PUT`. If `body.item_image` is a `File`/`Blob`
   * the base client automatically switches to `multipart/form-data`.
   * (`user-items.update`)
   */
  updateUserItem(e, t, n) {
    return this.put(
      `/api/user-items/${encodeURIComponent(String(e))}`,
      t,
      n
    );
  }
  /** DELETE `/api/user-items/{user_item}`. (`user-items.destroy`) */
  destroyUserItem(e, t) {
    return this.delete(
      `/api/user-items/${encodeURIComponent(String(e))}`,
      t
    );
  }
  // ---------------------------------------------------------------------------
  // Collections (`/api/collection*`)
  // ---------------------------------------------------------------------------
  /** GET `/api/collection` — list (paginated) the user's collections. (`collection.index`) */
  listCollections(e) {
    return this.get("/api/collection", void 0, e);
  }
  /** POST `/api/collection` — create a collection with embedded items. (`collection.store`) */
  createCollection(e, t) {
    return this.post("/api/collection", e, t);
  }
  /** GET `/api/collection/{collection}` — show with embedded items. (`collection.show`) */
  showCollection(e, t) {
    return this.get(
      `/api/collection/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** PUT `/api/collection/{collection}` — update. Sent as POST + `?_method=PUT`. (`collection.update`) */
  updateCollection(e, t, n) {
    return this.put(
      `/api/collection/${encodeURIComponent(String(e))}`,
      t,
      n
    );
  }
  /** DELETE `/api/collection/{collection}`. (`collection.destroy`) */
  destroyCollection(e, t) {
    return this.delete(
      `/api/collection/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** GET `/api/collection-list` — sidebar-style listing of collection summaries. */
  collectionList(e) {
    return this.get("/api/collection-list", void 0, e);
  }
  // ---------------------------------------------------------------------------
  // Collection-items (`/api/collection-item*`)
  // ---------------------------------------------------------------------------
  /** POST `/api/collection-item` — append an item to a collection. */
  addItemToCollection(e, t) {
    return this.post("/api/collection-item", e, t);
  }
  /** DELETE `/api/collection-item/{item}` — remove a single join row. */
  removeItemFromCollection(e, t) {
    return this.delete(`/api/collection-item/${encodeURIComponent(String(e))}`, t);
  }
}
class lt extends c {
  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------
  /** GET `/api/appeal` — list (paginated) appeals. (`appeal.index`) */
  list(e) {
    return this.get("/api/appeal", void 0, e);
  }
  /** POST `/api/appeal` — create a new appeal. (`appeal.store`) */
  create(e, t) {
    return this.post("/api/appeal", e, t);
  }
  /** GET `/api/appeal/{appeal}` — show one appeal. (`appeal.show`) */
  show(e, t) {
    return this.get(`/api/appeal/${encodeURIComponent(String(e))}`, void 0, t);
  }
  /** PUT `/api/appeal/{appeal}` — sent as POST + `?_method=PUT`. (`appeal.update`) */
  update(e, t, n) {
    return this.put(`/api/appeal/${encodeURIComponent(String(e))}`, t, n);
  }
  /** DELETE `/api/appeal/{appeal}`. (`appeal.destroy`) */
  destroy(e, t) {
    return this.delete(`/api/appeal/${encodeURIComponent(String(e))}`, t);
  }
  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------
  /** POST `/api/appeal/submit`. (`post.api.appeal.submit`) */
  submit(e, t) {
    return this.post("/api/appeal/submit", e, t);
  }
  // ---------------------------------------------------------------------------
  // Protocol run reads
  // ---------------------------------------------------------------------------
  /** GET `/api/appeal/run-global/{appeal}/{task}`. (`get.api.appeal.run-global.item.item`) */
  runGlobal(e, t, n) {
    const s = encodeURIComponent(String(e)), o = encodeURIComponent(String(t));
    return this.get(`/api/appeal/run-global/${s}/${o}`, void 0, n);
  }
  /** GET `/api/appeal/run/{appeal}/{chain}`. (`get.api.appeal.run.item.item`) */
  run(e, t, n) {
    const s = encodeURIComponent(String(e)), o = encodeURIComponent(String(t));
    return this.get(`/api/appeal/run/${s}/${o}`, void 0, n);
  }
  // ---------------------------------------------------------------------------
  // Protocol integration
  // ---------------------------------------------------------------------------
  /** GET `/api/protocol/appeal/all`. (`get.api.protocol.appeal.all`) */
  listProtocolAppeals(e) {
    return this.get("/api/protocol/appeal/all", void 0, e);
  }
}
class ut extends c {
  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------
  /** GET `/api/application`. (`application.index`) */
  list(e) {
    return this.get("/api/application", void 0, e);
  }
  /** POST `/api/application`. (`application.store`) */
  create(e, t) {
    return this.post("/api/application", e, t);
  }
  /** GET `/api/application/{application}`. (`application.show`) */
  show(e, t) {
    return this.get(
      `/api/application/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** PUT `/api/application/{application}` — sent as POST + `?_method=PUT`. (`application.update`) */
  update(e, t, n) {
    return this.put(
      `/api/application/${encodeURIComponent(String(e))}`,
      t,
      n
    );
  }
  /** DELETE `/api/application/{application}`. (`application.destroy`) */
  destroy(e, t) {
    return this.delete(
      `/api/application/${encodeURIComponent(String(e))}`,
      t
    );
  }
  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------
  /** POST `/api/application/submit`. (`post.api.application.submit`) */
  submit(e, t) {
    return this.post("/api/application/submit", e, t);
  }
  // ---------------------------------------------------------------------------
  // Protocol run reads
  // ---------------------------------------------------------------------------
  /** GET `/api/application/run-global/{application}/{task}`. (`get.api.application.run-global.item.item`) */
  runGlobal(e, t, n) {
    const s = encodeURIComponent(String(e)), o = encodeURIComponent(String(t));
    return this.get(`/api/application/run-global/${s}/${o}`, void 0, n);
  }
  /** GET `/api/application/run/{application}/{chain}`. (`get.api.application.run.item.item`) */
  run(e, t, n) {
    const s = encodeURIComponent(String(e)), o = encodeURIComponent(String(t));
    return this.get(`/api/application/run/${s}/${o}`, void 0, n);
  }
  // ---------------------------------------------------------------------------
  // Protocol integration
  // ---------------------------------------------------------------------------
  /** GET `/api/protocol/application/all`. (`get.api.protocol.application.all`) */
  listProtocolApplications(e) {
    return this.get("/api/protocol/application/all", void 0, e);
  }
}
class dt extends c {
  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------
  /** GET `/api/disbursement`. (`disbursement.index`) */
  list(e) {
    return this.get("/api/disbursement", void 0, e);
  }
  /** POST `/api/disbursement`. (`disbursement.store`) */
  create(e, t) {
    return this.post("/api/disbursement", e, t);
  }
  /** GET `/api/disbursement/{disbursement}`. (`disbursement.show`) */
  show(e, t) {
    return this.get(
      `/api/disbursement/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** PUT `/api/disbursement/{disbursement}` — sent as POST + `?_method=PUT`. (`disbursement.update`) */
  update(e, t, n) {
    return this.put(
      `/api/disbursement/${encodeURIComponent(String(e))}`,
      t,
      n
    );
  }
  /** DELETE `/api/disbursement/{disbursement}`. (`disbursement.destroy`) */
  destroy(e, t) {
    return this.delete(
      `/api/disbursement/${encodeURIComponent(String(e))}`,
      t
    );
  }
  // ---------------------------------------------------------------------------
  // Lifecycle (note: this module uses `confirm`, not `submit`)
  // ---------------------------------------------------------------------------
  /** POST `/api/disbursement/confirm`. (`post.api.disbursement.confirm`) */
  confirm(e, t) {
    return this.post("/api/disbursement/confirm", e, t);
  }
  // ---------------------------------------------------------------------------
  // Protocol run reads
  // ---------------------------------------------------------------------------
  /** GET `/api/disbursement/run-global/{disbursement}/{task}`. (`get.api.disbursement.run-global.item.item`) */
  runGlobal(e, t, n) {
    const s = encodeURIComponent(String(e)), o = encodeURIComponent(String(t));
    return this.get(`/api/disbursement/run-global/${s}/${o}`, void 0, n);
  }
  /** GET `/api/disbursement/run/{disbursement}/{chain}`. (`get.api.disbursement.run.item.item`) */
  run(e, t, n) {
    const s = encodeURIComponent(String(e)), o = encodeURIComponent(String(t));
    return this.get(`/api/disbursement/run/${s}/${o}`, void 0, n);
  }
  // ---------------------------------------------------------------------------
  // Protocol integration
  // ---------------------------------------------------------------------------
  /** GET `/api/protocol/disbursement/all`. (`get.api.protocol.disbursement.all`) */
  listProtocolDisbursements(e) {
    return this.get("/api/protocol/disbursement/all", void 0, e);
  }
}
class gt extends c {
  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------
  /** GET `/api/referral`. (`referral.index`) */
  list(e) {
    return this.get("/api/referral", void 0, e);
  }
  /** POST `/api/referral`. (`referral.store`) */
  create(e, t) {
    return this.post("/api/referral", e, t);
  }
  /** GET `/api/referral/{referral}`. (`referral.show`) */
  show(e, t) {
    return this.get(
      `/api/referral/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** PUT `/api/referral/{referral}` — sent as POST + `?_method=PUT`. (`referral.update`) */
  update(e, t, n) {
    return this.put(
      `/api/referral/${encodeURIComponent(String(e))}`,
      t,
      n
    );
  }
  /** DELETE `/api/referral/{referral}`. (`referral.destroy`) */
  destroy(e, t) {
    return this.delete(
      `/api/referral/${encodeURIComponent(String(e))}`,
      t
    );
  }
  // ---------------------------------------------------------------------------
  // Lifecycle (note: this module uses `confirm`, not `submit`)
  // ---------------------------------------------------------------------------
  /** POST `/api/referral/confirm`. (`post.api.referral.confirm`) */
  confirm(e, t) {
    return this.post("/api/referral/confirm", e, t);
  }
  // ---------------------------------------------------------------------------
  // Protocol run reads
  // ---------------------------------------------------------------------------
  /** GET `/api/referral/run-global/{referral}/{task}`. (`get.api.referral.run-global.item.item`) */
  runGlobal(e, t, n) {
    const s = encodeURIComponent(String(e)), o = encodeURIComponent(String(t));
    return this.get(`/api/referral/run-global/${s}/${o}`, void 0, n);
  }
  /** GET `/api/referral/run/{referral}/{chain}`. (`get.api.referral.run.item.item`) */
  run(e, t, n) {
    const s = encodeURIComponent(String(e)), o = encodeURIComponent(String(t));
    return this.get(`/api/referral/run/${s}/${o}`, void 0, n);
  }
  // ---------------------------------------------------------------------------
  // Protocol integration
  // ---------------------------------------------------------------------------
  /** GET `/api/protocol/referral/all`. (`get.api.protocol.referral.all`) */
  listProtocolReferrals(e) {
    return this.get("/api/protocol/referral/all", void 0, e);
  }
}
class ht extends c {
  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------
  /** GET `/api/report`. (`report.index`) */
  list(e) {
    return this.get("/api/report", void 0, e);
  }
  /** POST `/api/report`. (`report.store`) */
  create(e, t) {
    return this.post("/api/report", e, t);
  }
  /** GET `/api/report/{report}`. (`report.show`) */
  show(e, t) {
    return this.get(
      `/api/report/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** PUT `/api/report/{report}` — sent as POST + `?_method=PUT`. (`report.update`) */
  update(e, t, n) {
    return this.put(
      `/api/report/${encodeURIComponent(String(e))}`,
      t,
      n
    );
  }
  /** DELETE `/api/report/{report}`. (`report.destroy`) */
  destroy(e, t) {
    return this.delete(
      `/api/report/${encodeURIComponent(String(e))}`,
      t
    );
  }
  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------
  /** POST `/api/report/submit`. (`post.api.report.submit`) */
  submit(e, t) {
    return this.post("/api/report/submit", e, t);
  }
  // ---------------------------------------------------------------------------
  // Protocol run reads
  // ---------------------------------------------------------------------------
  /** GET `/api/report/run-global/{report}/{task}`. (`get.api.report.run-global.item.item`) */
  runGlobal(e, t, n) {
    const s = encodeURIComponent(String(e)), o = encodeURIComponent(String(t));
    return this.get(`/api/report/run-global/${s}/${o}`, void 0, n);
  }
  /** GET `/api/report/run/{report}/{chain}`. (`get.api.report.run.item.item`) */
  run(e, t, n) {
    const s = encodeURIComponent(String(e)), o = encodeURIComponent(String(t));
    return this.get(`/api/report/run/${s}/${o}`, void 0, n);
  }
  // ---------------------------------------------------------------------------
  // Protocol integration
  // ---------------------------------------------------------------------------
  /** GET `/api/protocol/report/all`. (`get.api.protocol.report.all`) */
  listProtocolReports(e) {
    return this.get("/api/protocol/report/all", void 0, e);
  }
}
class mt extends c {
  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------
  /** GET `/api/verification`. (`verification.index`) */
  list(e) {
    return this.get("/api/verification", void 0, e);
  }
  /** POST `/api/verification`. (`verification.store`) */
  create(e, t) {
    return this.post("/api/verification", e, t);
  }
  /** GET `/api/verification/{verification}`. (`verification.show`) */
  show(e, t) {
    return this.get(
      `/api/verification/${encodeURIComponent(String(e))}`,
      void 0,
      t
    );
  }
  /** PUT `/api/verification/{verification}` — sent as POST + `?_method=PUT`. (`verification.update`) */
  update(e, t, n) {
    return this.put(
      `/api/verification/${encodeURIComponent(String(e))}`,
      t,
      n
    );
  }
  /** DELETE `/api/verification/{verification}`. (`verification.destroy`) */
  destroy(e, t) {
    return this.delete(
      `/api/verification/${encodeURIComponent(String(e))}`,
      t
    );
  }
  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------
  /** POST `/api/verification/submit`. (`post.api.verification.submit`) */
  submit(e, t) {
    return this.post("/api/verification/submit", e, t);
  }
  // ---------------------------------------------------------------------------
  // Protocol run reads
  // ---------------------------------------------------------------------------
  /** GET `/api/verification/run-global/{verification}/{task}`. (`get.api.verification.run-global.item.item`) */
  runGlobal(e, t, n) {
    const s = encodeURIComponent(String(e)), o = encodeURIComponent(String(t));
    return this.get(
      `/api/verification/run-global/${s}/${o}`,
      void 0,
      n
    );
  }
  /** GET `/api/verification/run/{verification}/{chain}`. (`get.api.verification.run.item.item`) */
  run(e, t, n) {
    const s = encodeURIComponent(String(e)), o = encodeURIComponent(String(t));
    return this.get(`/api/verification/run/${s}/${o}`, void 0, n);
  }
  // ---------------------------------------------------------------------------
  // Protocol integration
  // ---------------------------------------------------------------------------
  /** GET `/api/protocol/verification/all`. (`get.api.protocol.verification.all`) */
  listProtocolVerifications(e) {
    return this.get("/api/protocol/verification/all", void 0, e);
  }
}
class yt extends c {
  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------
  /** GET `/api/connector` — list (paginated) all connectors. (`connector.index`) */
  list(e) {
    return this.get("/api/connector", void 0, e);
  }
  /** POST `/api/connector` — create a new connector. (`connector.store`) */
  create(e, t) {
    return this.post("/api/connector", e, t);
  }
  /** GET `/api/connector/{connector}`. (`connector.show`) */
  show(e, t) {
    const n = encodeURIComponent(String(e));
    return this.get(`/api/connector/${n}`, void 0, t);
  }
  /** PUT `/api/connector/{connector}` — sent as POST + `?_method=PUT`. (`connector.update`) */
  update(e, t, n) {
    const s = encodeURIComponent(String(e));
    return this.put(`/api/connector/${s}`, t, n);
  }
  /** DELETE `/api/connector/{connector}`. (`connector.destroy`) */
  destroy(e, t) {
    const n = encodeURIComponent(String(e));
    return this.delete(`/api/connector/${n}`, t);
  }
  // ---------------------------------------------------------------------------
  // Execution / run helpers
  // ---------------------------------------------------------------------------
  /** POST `/api/connector/execute`. (`post.api.connector.execute`) */
  execute(e, t) {
    return this.post("/api/connector/execute", e, t);
  }
  /** GET `/api/connector/run-global/{connector}/{task}`. (`get.api.connector.run-global.item.item`) */
  runGlobal(e, t, n) {
    const s = encodeURIComponent(String(e)), o = encodeURIComponent(String(t));
    return this.get(`/api/connector/run-global/${s}/${o}`, void 0, n);
  }
  /** GET `/api/connector/run/{connector}/{chain}`. (`get.api.connector.run.item.item`) */
  run(e, t, n) {
    const s = encodeURIComponent(String(e)), o = encodeURIComponent(String(t));
    return this.get(`/api/connector/run/${s}/${o}`, void 0, n);
  }
  /** GET `/api/connector/{connector}/discover` — list tools available on the connector. (`get.api.connector.item.discover`) */
  discover(e, t) {
    const n = encodeURIComponent(String(e));
    return this.get(`/api/connector/${n}/discover`, void 0, t);
  }
  // ---------------------------------------------------------------------------
  // Protocol integration
  // ---------------------------------------------------------------------------
  /** GET `/api/protocol/connector/all`. (`get.api.protocol.connector.all`) */
  listProtocolConnectors(e) {
    return this.get("/api/protocol/connector/all", void 0, e);
  }
}
class ft extends c {
  // ---------------------------------------------------------------------------
  // Protocol integration (unversioned)
  // ---------------------------------------------------------------------------
  /** GET `/api/protocol/etl/all`. (`etl.protocol.all`) */
  listProtocolEtl(e) {
    return this.get(
      "/api/protocol/etl/all",
      void 0,
      e
    );
  }
  // ---------------------------------------------------------------------------
  // Pipeline kickoff (versioned)
  // ---------------------------------------------------------------------------
  /** POST `/api/v1/etl/process` — start a generic ETL pipeline. (`etl.process`) */
  process(e, t) {
    return this.post("/api/v1/etl/process", e, t);
  }
  /** POST `/api/v1/etl/agent/process` — agent-driven ETL pipeline. (`etl.agent.process`) */
  agentProcess(e, t) {
    return this.post("/api/v1/etl/agent/process", e, t);
  }
  /** POST `/api/v1/etl/search-analyze` — search + analyze shorthand. (`etl.search-analyze`) */
  searchAnalyze(e, t) {
    return this.post("/api/v1/etl/search-analyze", e, t);
  }
  // ---------------------------------------------------------------------------
  // Pipeline lifecycle (versioned)
  // ---------------------------------------------------------------------------
  /** POST `/api/v1/etl/cancel/{pipelineId}` — abort a running pipeline. (`etl.cancel`) */
  cancel(e, t) {
    const n = encodeURIComponent(String(e));
    return this.post(`/api/v1/etl/cancel/${n}`, void 0, t);
  }
  /**
   * GET `/api/v1/etl/status/{pipelineId}` — current pipeline status.
   * Polling endpoint: callers can poll this method for completion. The
   * server returns `{ status, progress, ... }`; downstream callers
   * decide their own polling cadence and termination predicate.
   * (`etl.status`)
   */
  getStatus(e, t) {
    const n = encodeURIComponent(String(e));
    return this.get(`/api/v1/etl/status/${n}`, void 0, t);
  }
  // ---------------------------------------------------------------------------
  // Discovery (versioned)
  // ---------------------------------------------------------------------------
  /** GET `/api/v1/etl/components` — list registered ETL components. (`etl.components`) */
  components(e) {
    return this.get("/api/v1/etl/components", void 0, e);
  }
}
class Ct extends c {
  // ---------------------------------------------------------------------------
  // Protocol integration (auth:api)
  // ---------------------------------------------------------------------------
  /** GET `/api/protocol/workflow/all`. (`get.api.protocol.workflow.all`) */
  listProtocolWorkflows(e) {
    return this.get(
      "/api/protocol/workflow/all",
      void 0,
      e
    );
  }
  // ---------------------------------------------------------------------------
  // Codify pipeline (auth:public — pass `{ auth: false }` per call)
  // ---------------------------------------------------------------------------
  /**
   * POST `/api/workflow/codify-pipeline/start` — kick off a codify run.
   * `auth:public`. (`post.api.workflow.codify-pipeline.start`)
   *
   * Pass `{ auth: false }` to omit the Authorization header. If the
   * input contains a `file` (`Blob`/`File`) the BaseApiClient switches
   * to multipart automatically.
   */
  start(e, t) {
    return this.post(
      "/api/workflow/codify-pipeline/start",
      e,
      t
    );
  }
  /**
   * POST `/api/workflow/codify-pipeline/save-response` — feed a
   * user-provided answer back into a running pipeline. `auth:public`.
   * (`post.api.workflow.codify-pipeline.save-response`)
   */
  saveResponse(e, t) {
    return this.post(
      "/api/workflow/codify-pipeline/save-response",
      e,
      t
    );
  }
  /**
   * GET `/api/workflow/codify-pipeline/check-pipeline/{session}` —
   * polling endpoint. `auth:public`.
   * (`get.api.workflow.codify-pipeline.check-pipeline.item`)
   *
   * Callers can poll this method for codify-pipeline progress; the SDK
   * does NOT subscribe to broadcasts here — wire that up separately.
   */
  checkPipeline(e, t) {
    const n = encodeURIComponent(String(e));
    return this.get(
      `/api/workflow/codify-pipeline/check-pipeline/${n}`,
      void 0,
      t
    );
  }
  /**
   * GET `/api/workflow/codify-pipeline/stop/{session}` — abort a run.
   * `auth:public`. (`get.api.workflow.codify-pipeline.stop.item`)
   *
   * NB: this is a GET in the upstream router — POST would be more
   * RESTful but we mirror the actual route definition.
   */
  stop(e, t) {
    const n = encodeURIComponent(String(e));
    return this.get(
      `/api/workflow/codify-pipeline/stop/${n}`,
      void 0,
      t
    );
  }
}
class $t extends c {
  // ---------------------------------------------------------------------------
  // Resolver
  // ---------------------------------------------------------------------------
  /**
   * POST `/api/v1/services/resolve` — discover candidates for a service
   * name, optionally filtered by `near` (e.g., locality string). The
   * returned list is open-shaped because resolvers vary by source.
   * (`post.api.v1.services.resolve`)
   */
  resolve(e, t) {
    return this.post("/api/v1/services/resolve", e, t);
  }
  /**
   * POST `/api/v1/services/reserve` — claim a slot for the chain. The
   * `source` enum determines which of `slot_id` / `course_id` /
   * `external_candidate_id` is required upstream.
   * (`post.api.v1.services.reserve`)
   */
  reserve(e, t) {
    return this.post("/api/v1/services/reserve", e, t);
  }
  /**
   * POST `/api/v1/services/release` — release a previously-claimed
   * slot or candidate. Same body shape as `reserve` per the upstream
   * controller. (`post.api.v1.services.release`)
   */
  release(e, t) {
    return this.post("/api/v1/services/release", e, t);
  }
}
class vt extends c {
  // ---------------------------------------------------------------------------
  // CRUD (auth:api)
  // ---------------------------------------------------------------------------
  /** GET `/api/nudge` — list nudges. (`nudge.index`) */
  list(e) {
    return this.get("/api/nudge", void 0, e);
  }
  /** POST `/api/nudge` — create a nudge. (`nudge.store`) */
  create(e, t) {
    return this.post("/api/nudge", e, t);
  }
  /** GET `/api/nudge/{nudge}`. (`nudge.show`) */
  show(e, t) {
    const n = encodeURIComponent(String(e));
    return this.get(`/api/nudge/${n}`, void 0, t);
  }
  /** PUT `/api/nudge/{nudge}` — sent as POST + `?_method=PUT`. (`nudge.update`) */
  update(e, t, n) {
    const s = encodeURIComponent(String(e));
    return this.put(`/api/nudge/${s}`, t, n);
  }
  /** DELETE `/api/nudge/{nudge}`. (`nudge.destroy`) */
  destroy(e, t) {
    const n = encodeURIComponent(String(e));
    return this.delete(`/api/nudge/${n}`, t);
  }
  /** DELETE `/api/nudge/image/{nudge}` — drop the attached image. (`delete.api.nudge.image.item`) */
  deleteImage(e, t) {
    const n = encodeURIComponent(String(e));
    return this.delete(`/api/nudge/image/${n}`, t);
  }
  // ---------------------------------------------------------------------------
  // Public webhook receivers (auth:public — pass `{ auth: false }` per call)
  // ---------------------------------------------------------------------------
  /**
   * POST `/api/nudge-checkin/email` — inbound Mailgun webhook receiver.
   * `auth:public`. (`post.api.nudge-checkin.email`)
   */
  checkinEmail(e, t) {
    return this.post("/api/nudge-checkin/email", e, t);
  }
  /**
   * POST `/api/nudge-checkin/sms` — inbound Twilio webhook receiver.
   * `auth:public`. (`post.api.nudge-checkin.sms`)
   */
  checkinSms(e, t) {
    return this.post("/api/nudge-checkin/sms", e, t);
  }
  /**
   * GET `/api/nudge/check/{secret}` — one-time secret-link
   * confirmation flow. `auth:public`. (`get.api.nudge.check.item`)
   */
  checkSecret(e, t) {
    const n = encodeURIComponent(String(e));
    return this.get(`/api/nudge/check/${n}`, void 0, t);
  }
  // ---------------------------------------------------------------------------
  // Protocol integration
  // ---------------------------------------------------------------------------
  /** GET `/api/protocol/nudge/all`. (`get.api.protocol.nudge.all`) */
  listProtocolNudges(e) {
    return this.get(
      "/api/protocol/nudge/all",
      void 0,
      e
    );
  }
}
class St extends c {
  /**
   * POST `/api/coinbase/webhook` — Coinbase Commerce webhook receiver.
   * `auth:public`, tenant-context-free. (`coinbase-webhook`)
   *
   * Callers MUST pass `{ auth: false }` so the Authorization header is
   * omitted; configure the client itself with `getDomain: () => null`
   * so the X-Domain header is also omitted (Coinbase publishes to a
   * tenant-context-free public endpoint).
   */
  webhook(e, t) {
    return this.post("/api/coinbase/webhook", e, t);
  }
}
class bt extends c {
  /**
   * POST /api/h5i/msg — send a new i5h message.
   *
   * The broker dedupes on the optional client `id`: 201 on first-write,
   * 200 on a replay (both surface `newly_created`). The `meta.kind_*`
   * render hints are `prohibited` server-side — the broker stamps them.
   */
  async sendMessage(e, t) {
    return this.post("/api/h5i/msg", e, t);
  }
  /**
   * GET /api/h5i/msg/inbox — pull unread messages for an agent on a channel.
   * `agent` + `channel` are required query params; `limit` (1..500) optional.
   */
  async getInbox(e) {
    const t = {
      agent: e.agent,
      channel: e.channel
    };
    return e.limit !== void 0 && (t.limit = e.limit), this.get("/api/h5i/msg/inbox", t);
  }
  /**
   * GET /api/h5i/msg/channel/{channel} — full channel history.
   * `limit` (1..500) is clamped server-side (default 100).
   */
  async getChannel(e, t) {
    const n = t === void 0 ? void 0 : { limit: t };
    return this.get(
      `/api/h5i/msg/channel/${encodeURIComponent(e)}`,
      n
    );
  }
  /** GET /api/h5i/msg/{id} — fetch one message by its 16-hex id. */
  async getMessage(e) {
    return this.get(
      `/api/h5i/msg/${encodeURIComponent(e)}`
    );
  }
  /**
   * POST /api/h5i/dev/seed-demo/{guid} — DEV/QA helper (SuperAdmin only,
   * throttled 6/min). Publishes the deal channel + emits 4 demo messages.
   * `guid` is a strict UUID v4.
   */
  async seedDemo(e, t) {
    return this.post(
      `/api/h5i/dev/seed-demo/${encodeURIComponent(e)}`,
      void 0,
      t
    );
  }
  /**
   * GET /api/h5i/deals/{guid}/public-messages — anonymous redacted history
   * for a published deal. The gate is an active PublicDealChannel row keyed
   * by the request HOSTNAME, NOT a Bearer token — sent with `{ auth: false }`.
   * `guid` is a strict UUID v4.
   */
  async getPublicMessages(e, t) {
    const n = t === void 0 ? void 0 : { limit: t };
    return this.get(
      `/api/h5i/deals/${encodeURIComponent(e)}/public-messages`,
      n,
      { auth: !1 }
    );
  }
  /**
   * POST /api/broadcasting/public-auth — anonymous Pusher auth for the
   * `public-deal-{hash}` channel family. All denial paths collapse to a
   * uniform 403 `{error:'forbidden'}`. Sent with `{ auth: false }`.
   */
  async publicBroadcastAuth(e) {
    return this.post(
      "/api/broadcasting/public-auth",
      e,
      { auth: !1 }
    );
  }
}
function B(r, e) {
  return r ? {
    ...e ?? {},
    headers: { ...(e == null ? void 0 : e.headers) ?? {}, "Idempotency-Key": r }
  } : e;
}
class Rt extends c {
  /**
   * POST /api/v1/rlhf/submissions → upstream POST /api/mobile/v1/submissions.
   * Body forwarded verbatim. Pass an `idempotencyKey` so the upstream cache
   * key matches api/'s IdempotencyMiddleware. Requires `rlhf:writer`.
   */
  async submit(e, t, n) {
    return this.post(
      "/api/v1/rlhf/submissions",
      e,
      B(t, n)
    );
  }
  /**
   * POST /api/v1/rlhf/grades/{course_id}/{assignment_id} → upstream
   * POST /api/courses/:c/assignments/:a/grades. Requires `rlhf:writer`.
   */
  async grade(e, t, n, s, o) {
    return this.post(
      `/api/v1/rlhf/grades/${encodeURIComponent(String(e))}/${encodeURIComponent(String(t))}`,
      n,
      B(s, o)
    );
  }
  /**
   * GET /api/v1/rlhf/rubrics/{question_id} → upstream GET
   * /api/questions/:id/rubric. Read-only; requires `rlhf:reader`.
   */
  async getRubric(e) {
    return this.get(
      `/api/v1/rlhf/rubrics/${encodeURIComponent(String(e))}`
    );
  }
}
class It extends c {
  /**
   * GET /api/fail/events — paginated, newest first. Optional filters:
   * `per_page` (1..100, default 25), `root_cause_code`, `protocol_id`.
   * The resource array lands on `ApiResponse.data`; pagination `links`/`meta`
   * ride on the envelope.
   */
  async listEvents(e) {
    const t = {};
    return (e == null ? void 0 : e.per_page) !== void 0 && (t.per_page = e.per_page), (e == null ? void 0 : e.root_cause_code) !== void 0 && (t.root_cause_code = e.root_cause_code), (e == null ? void 0 : e.protocol_id) !== void 0 && (t.protocol_id = e.protocol_id), this.get(
      "/api/fail/events",
      Object.keys(t).length > 0 ? t : void 0
    );
  }
  /** GET /api/fail/events/summary — total + per-root-cause counts. */
  async getSummary() {
    return this.get("/api/fail/events/summary");
  }
  /** GET /api/fail/events/{id} — single event with eager-loaded recovery actions. */
  async getEvent(e) {
    return this.get(`/api/fail/events/${e}`);
  }
}
function W(r, e) {
  return r ? {
    ...e ?? {},
    headers: { ...(e == null ? void 0 : e.headers) ?? {}, "Idempotency-Key": r }
  } : e;
}
class Ut extends c {
  /**
   * POST /api/v1/integrations/hitl/requested — register a pending HITL
   * approval (emr-mcp and other agent runtimes). `args` is `present`+`array`
   * server-side, so send `{}` / `[]` when there are none. Returns 202.
   */
  async requestApproval(e, t, n) {
    return this.post(
      "/api/v1/integrations/hitl/requested",
      e,
      W(t, n)
    );
  }
  /**
   * POST /api/v1/integrations/hitl/resume — record a reviewer's
   * approve/reject/escalate decision against a pending approval. A 404 means
   * the approval_id is unknown for the resolved tenant; an already-resolved
   * approval returns the cached decision (202). Returns 202.
   */
  async resume(e, t, n) {
    return this.post(
      "/api/v1/integrations/hitl/resume",
      e,
      W(t, n)
    );
  }
}
function ke(r, e) {
  return r ? {
    ...e ?? {},
    headers: { ...(e == null ? void 0 : e.headers) ?? {}, "Idempotency-Key": r }
  } : e;
}
class wt extends c {
  /**
   * POST /api/v1/integrations/hrm/relay — relay a codify-careers/HRM domain
   * event onto the workforce/training topic exchange. `event` must match
   * `/^(workforce|training|hrm)\./`. Returns 202 with the resolved `exchange`.
   */
  async relay(e, t, n) {
    return this.post(
      "/api/v1/integrations/hrm/relay",
      e,
      ke(t, n)
    );
  }
}
function Ee(r, e) {
  return r ? {
    ...e ?? {},
    headers: { ...(e == null ? void 0 : e.headers) ?? {}, "Idempotency-Key": r }
  } : e;
}
class Pt extends c {
  /**
   * POST /api/v1/integrations/lms/grading — record a Teachify
   * course-completion event. `score` is `between:0,1`. Returns 202;
   * `status` is `accepted` on first write, `replayed` on a duplicate
   * `external_enrollment_id`.
   */
  async submitGrading(e, t, n) {
    return this.post(
      "/api/v1/integrations/lms/grading",
      e,
      Ee(t, n)
    );
  }
}
class At extends c {
  /**
   * GET /api/facilities/portfolio/rollup — the 25-row × 5-column heatmap.
   * Always returns exactly 25 rows (padded with `{building: null}` rows when
   * fewer buildings have signals).
   */
  async getPortfolioRollup() {
    return this.get(
      "/api/facilities/portfolio/rollup"
    );
  }
  /**
   * GET /api/facilities/themes/{theme}/signals — signals + day-bucketed
   * time-series for one facility Path theme (`restroom`, `comfort`,
   * `safe-path`, `rain-drainage`). Unknown / unseeded themes 404.
   */
  async getThemeSignals(e) {
    return this.get(
      `/api/facilities/themes/${encodeURIComponent(e)}/signals`
    );
  }
}
class jt extends c {
  /** GET /api/chain — list. */
  async listChains() {
    return this.get("/api/chain");
  }
  /** POST /api/chain — store. */
  async createChain(e) {
    return this.post("/api/chain", e);
  }
  /** GET /api/chain/{chain} — show. */
  async showChain(e) {
    return this.get(
      `/api/chain/${encodeURIComponent(String(e))}`
    );
  }
  /** PUT /api/chain/{chain} — POST + `?_method=PUT`. */
  async updateChain(e, t) {
    return this.put(
      `/api/chain/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** DELETE /api/chain/{chain} — destroy. */
  async destroyChain(e) {
    return this.delete(
      `/api/chain/${encodeURIComponent(String(e))}`
    );
  }
  /** POST /api/chain/switch-parent/{protocol} — re-parent a chain protocol. */
  async switchChainParent(e, t = {}) {
    return this.post(
      `/api/chain/switch-parent/${encodeURIComponent(String(e))}`,
      t
    );
  }
}
class kt extends c {
  /**
   * GET /api/v1/systems/catalog — every non-generic system grouped by
   * vertical. Tenant-agnostic; `X-Domain` not required but harmless.
   */
  async listCatalog() {
    return this.get("/api/v1/systems/catalog", void 0, {
      auth: !1
    });
  }
  /**
   * GET /api/v1/systems — first-wave home-grid cards for the current
   * subproject. Requires `X-Domain` to resolve a tenant; 404s otherwise.
   */
  async listForCurrentSubproject() {
    return this.get("/api/v1/systems");
  }
  /**
   * GET /api/v1/systems/{vertical} — detail block for one vertical
   * within the current subproject. 404s for unknown verticals or when
   * no tenant resolves.
   */
  async showVertical(e) {
    return this.get(
      `/api/v1/systems/${encodeURIComponent(e)}`
    );
  }
  /**
   * GET /api/v1/systems/{vertical}/components — flat component list for
   * one vertical. Unknown verticals return `{data: []}` (200, not 404)
   * so modal/list surfaces render empty gracefully.
   */
  async listComponents(e) {
    return this.get(
      `/api/v1/systems/${encodeURIComponent(e)}/components`
    );
  }
}
class Et extends c {
  // ---------------------------------------------------------------------------
  // /api/schedule  (resource — index, store, show, update, destroy)
  // ---------------------------------------------------------------------------
  /** GET /api/schedule */
  async listSchedules() {
    return this.get("/api/schedule");
  }
  /** POST /api/schedule */
  async createSchedule(e) {
    return this.post("/api/schedule", e);
  }
  /** GET /api/schedule/{schedule} */
  async showSchedule(e) {
    return this.get(
      `/api/schedule/${encodeURIComponent(String(e))}`
    );
  }
  /** PUT /api/schedule/{schedule} — POST + `?_method=PUT`. */
  async updateSchedule(e, t) {
    return this.put(
      `/api/schedule/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** DELETE /api/schedule/{schedule} */
  async destroySchedule(e) {
    return this.delete(
      `/api/schedule/${encodeURIComponent(String(e))}`
    );
  }
  // ---------------------------------------------------------------------------
  // /api/schedule-call  (resource — index, store, show, update, destroy)
  // ---------------------------------------------------------------------------
  /** GET /api/schedule-call */
  async listScheduleCalls() {
    return this.get("/api/schedule-call");
  }
  /** POST /api/schedule-call */
  async createScheduleCall(e) {
    return this.post("/api/schedule-call", e);
  }
  /** GET /api/schedule-call/{schedule_call} */
  async showScheduleCall(e) {
    return this.get(
      `/api/schedule-call/${encodeURIComponent(String(e))}`
    );
  }
  /** PUT /api/schedule-call/{schedule_call} — POST + `?_method=PUT`. */
  async updateScheduleCall(e, t) {
    return this.put(
      `/api/schedule-call/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** DELETE /api/schedule-call/{schedule_call} */
  async destroyScheduleCall(e) {
    return this.delete(
      `/api/schedule-call/${encodeURIComponent(String(e))}`
    );
  }
}
class Tt extends c {
  // ---------------------------------------------------------------------------
  // /api/agent/account/*
  // ---------------------------------------------------------------------------
  /** POST /api/agent/account/finish-registration */
  async finishAgentRegistration(e) {
    return this.post("/api/agent/account/finish-registration", e);
  }
  /** GET /api/agent/account/get-status */
  async getAgentAccountStatus() {
    return this.get("/api/agent/account/get-status");
  }
  /** POST /api/agent/account/{chain}/confirm-code */
  async confirmAgentAccountCode(e, t) {
    return this.post(
      `/api/agent/account/${encodeURIComponent(String(e))}/confirm-code`,
      t
    );
  }
  // ---------------------------------------------------------------------------
  // /api/agent/communicate/{chain}/*
  // ---------------------------------------------------------------------------
  /** GET /api/agent/communicate/{chain}/assigned-experts */
  async getAssignedExperts(e) {
    return this.get(
      `/api/agent/communicate/${encodeURIComponent(String(e))}/assigned-experts`
    );
  }
  /** GET /api/agent/communicate/{chain}/get-status */
  async getCommunicateStatus(e) {
    return this.get(
      `/api/agent/communicate/${encodeURIComponent(String(e))}/get-status`
    );
  }
  /** GET /api/agent/communicate/{chain}/initialize-agent */
  async initializeAgent(e) {
    return this.get(
      `/api/agent/communicate/${encodeURIComponent(String(e))}/initialize-agent`
    );
  }
  /** GET /api/agent/communicate/{chain}/invites */
  async getCommunicateInvites(e) {
    return this.get(
      `/api/agent/communicate/${encodeURIComponent(String(e))}/invites`
    );
  }
  /** POST /api/agent/communicate/{chain}/messages — paginated chat history search. */
  async listCommunicateMessages(e, t = {}) {
    return this.post(
      `/api/agent/communicate/${encodeURIComponent(String(e))}/messages`,
      t
    );
  }
  /** POST /api/agent/communicate/{chain}/send-message */
  async sendCommunicateMessage(e, t) {
    return this.post(
      `/api/agent/communicate/${encodeURIComponent(String(e))}/send-message`,
      t
    );
  }
  // ---------------------------------------------------------------------------
  // /api/agent/{list,program-state,program-status,retry-creation}
  // ---------------------------------------------------------------------------
  /** GET /api/agent/list */
  async listAgents() {
    return this.get("/api/agent/list");
  }
  /** GET /api/agent/program-state/{chain} */
  async getProgramState(e) {
    return this.get(
      `/api/agent/program-state/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/agent/program-status/{chain} */
  async getProgramStatus(e) {
    return this.get(
      `/api/agent/program-status/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/agent/retry-creation/{chain} */
  async retryAgentCreation(e) {
    return this.get(
      `/api/agent/retry-creation/${encodeURIComponent(String(e))}`
    );
  }
}
class Dt extends c {
  // ---------------------------------------------------------------------------
  // /api/subproject-admin/create/subproject/{section} — fresh subproject flow.
  // ---------------------------------------------------------------------------
  /** POST /api/subproject-admin/create/subproject/content */
  async createSubprojectContent(e) {
    return this.post(
      "/api/subproject-admin/create/subproject/content",
      e
    );
  }
  /** POST /api/subproject-admin/create/subproject/domains */
  async createSubprojectDomains(e) {
    return this.post(
      "/api/subproject-admin/create/subproject/domains",
      e
    );
  }
  /** POST /api/subproject-admin/create/subproject/layout */
  async createSubprojectLayout(e) {
    return this.post(
      "/api/subproject-admin/create/subproject/layout",
      e
    );
  }
  /** POST /api/subproject-admin/create/subproject/seo */
  async createSubprojectSeo(e) {
    return this.post(
      "/api/subproject-admin/create/subproject/seo",
      e
    );
  }
  /** POST /api/subproject-admin/create/subproject/team */
  async createSubprojectTeam(e) {
    return this.post(
      "/api/subproject-admin/create/subproject/team",
      e
    );
  }
  /** POST /api/subproject-admin/create/subproject/template */
  async createSubprojectTemplate(e) {
    return this.post(
      "/api/subproject-admin/create/subproject/template",
      e
    );
  }
  // ---------------------------------------------------------------------------
  // /api/subproject-admin/claim/subproject/{subproject}/{section} — claim/edit
  // an existing subproject.
  // ---------------------------------------------------------------------------
  /** POST /api/subproject-admin/claim/subproject/{subproject}/content */
  async claimSubprojectContent(e, t) {
    return this.post(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(e))}/content`,
      t
    );
  }
  /** POST /api/subproject-admin/claim/subproject/{subproject}/domains */
  async claimSubprojectDomains(e, t) {
    return this.post(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(e))}/domains`,
      t
    );
  }
  /** POST /api/subproject-admin/claim/subproject/{subproject}/layout */
  async claimSubprojectLayout(e, t) {
    return this.post(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(e))}/layout`,
      t
    );
  }
  /** POST /api/subproject-admin/claim/subproject/{subproject}/seo */
  async claimSubprojectSeo(e, t) {
    return this.post(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(e))}/seo`,
      t
    );
  }
  /** POST /api/subproject-admin/claim/subproject/{subproject}/team */
  async claimSubprojectTeam(e, t) {
    return this.post(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(e))}/team`,
      t
    );
  }
  /** POST /api/subproject-admin/claim/subproject/{subproject}/template */
  async claimSubprojectTemplate(e, t) {
    return this.post(
      `/api/subproject-admin/claim/subproject/${encodeURIComponent(String(e))}/template`,
      t
    );
  }
}
const a = { auth: !1 };
class xt extends c {
  // ===========================================================================
  // admin-side single-resource updates
  // ===========================================================================
  /** PUT /api/administrator/{administrator} */
  async updateAdministrator(e, t) {
    return this.put(
      `/api/administrator/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** PUT /api/ai/log/{log} */
  async updateAiLog(e, t = {}) {
    return this.put(
      `/api/ai/log/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** PUT /api/ai/policy/{policy} */
  async updateAiPolicy(e, t) {
    return this.put(
      `/api/ai/policy/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** PUT /api/ai/prompts/update/{prompt} */
  async updateAiPrompt(e, t) {
    return this.put(
      `/api/ai/prompts/update/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** PUT /api/documentation/{documentation} */
  async updateDocumentation(e, t) {
    return this.put(
      `/api/documentation/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** PUT /api/fees/fee/{fee} */
  async updateFee(e, t) {
    return this.put(
      `/api/fees/fee/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** PUT /api/program-category/{program_category} */
  async updateProgramCategory(e, t) {
    return this.put(
      `/api/program-category/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** PUT /api/program-sub-category/{program_sub_category} */
  async updateProgramSubCategory(e, t) {
    return this.put(
      `/api/program-sub-category/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** PUT /api/program-tag/{program_tag} */
  async updateProgramTag(e, t) {
    return this.put(
      `/api/program-tag/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** PUT /api/project-role/{project_role} */
  async updateProjectRole(e, t) {
    return this.put(
      `/api/project-role/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** PUT /api/statistic/{statistic} */
  async updateStatistic(e, t) {
    return this.put(
      `/api/statistic/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** PUT /api/user/{user} (admin) */
  async adminUpdateUserById(e, t) {
    return this.put(
      `/api/user/${encodeURIComponent(String(e))}`,
      t
    );
  }
  // ===========================================================================
  // creator + program adjacent
  // ===========================================================================
  /** PUT /api/creator-request/{creator_request} */
  async updateCreatorRequest(e, t) {
    return this.put(
      `/api/creator-request/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** PUT /api/creator/{creator} */
  async updateCreator(e, t) {
    return this.put(
      `/api/creator/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** PUT /api/program/update-program/{program} */
  async updateProgram(e, t = {}) {
    return this.put(
      `/api/program/update-program/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** GET /api/program-category/all */
  async listAllProgramCategories() {
    return this.get("/api/program-category/all");
  }
  /** GET /api/program-sub-category/all */
  async listAllProgramSubCategories() {
    return this.get("/api/program-sub-category/all");
  }
  /** GET /api/program-tag/all */
  async listAllProgramTags() {
    return this.get("/api/program-tag/all");
  }
  /** GET /api/program-status/get/{program} */
  async getProgramPublishedStatus(e) {
    return this.get(
      `/api/program-status/get/${encodeURIComponent(String(e))}`
    );
  }
  /** POST /api/program-status/set/{program} */
  async setProgramPublishedStatus(e, t) {
    return this.post(
      `/api/program-status/set/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** GET /api/program-sale */
  async listProgramSales() {
    return this.get("/api/program-sale");
  }
  /** POST /api/program-sale */
  async createProgramSale(e = {}) {
    return this.post("/api/program-sale", e);
  }
  /** PUT /api/program-sale/{program_sale} */
  async updateProgramSale(e, t = {}) {
    return this.put(
      `/api/program-sale/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** PUT /api/protocol/{protocol} */
  async updateProtocol(e, t) {
    return this.put(
      `/api/protocol/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** PATCH /api/protocol/sale/update/{protocol} */
  async updateProtocolSale(e, t) {
    return this.patch(
      `/api/protocol/sale/update/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** PATCH /api/subscription/update/{subscription} */
  async updateSubscription(e, t = {}) {
    return this.patch(
      `/api/subscription/update/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** PUT /api/role/{role} */
  async updateRole(e, t = {}) {
    return this.put(
      `/api/role/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** PUT /api/seo-page/{seo_page} */
  async updateSeoPage(e, t) {
    return this.put(
      `/api/seo-page/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** PUT /api/frontend/save-frontend */
  async saveFrontend(e) {
    return this.put("/api/frontend/save-frontend", e);
  }
  /** PATCH /api/domain-interfaces/{id} */
  async updateDomainInterface(e, t) {
    return this.patch(
      `/api/domain-interfaces/${encodeURIComponent(String(e))}`,
      t
    );
  }
  // ===========================================================================
  // auth + user (api band)
  // ===========================================================================
  /** POST /api/auth/change-forced-password */
  async changeForcedPassword(e) {
    return this.post("/api/auth/change-forced-password", e);
  }
  /** GET /api/resend-verify-email */
  async resendVerifyEmail() {
    return this.get("/api/resend-verify-email");
  }
  /** POST /api/verify-code */
  async verifyCode(e) {
    return this.post("/api/verify-code", e);
  }
  /** PATCH /api/users/update-billing-info */
  async patchBillingInfo(e) {
    return this.patch("/api/users/update-billing-info", e);
  }
  /** PATCH /api/users/update-password/{user} */
  async patchUserPassword(e, t) {
    return this.patch(
      `/api/users/update-password/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** PATCH /api/users/update-phone */
  async patchUserPhone(e) {
    return this.patch("/api/users/update-phone", e);
  }
  /** PATCH /api/users/update/{user} */
  async patchUser(e, t) {
    return this.patch(
      `/api/users/update/${encodeURIComponent(String(e))}`,
      t
    );
  }
  // ===========================================================================
  // chat
  // ===========================================================================
  /** DELETE /api/chat/delete-сhat/{chat} (note: Cyrillic "с" in path — preserved verbatim from spec). */
  async deleteChat(e) {
    return this.delete(
      `/api/chat/delete-сhat/${encodeURIComponent(String(e))}`
    );
  }
  // ===========================================================================
  // public auth + login flows
  // ===========================================================================
  /** POST /api/dashboard/create-login-transaction (`auth: public`). */
  async dashboardCreateLoginTransaction(e) {
    return this.post(
      "/api/dashboard/create-login-transaction",
      e,
      a
    );
  }
  /** POST /api/public/auth-by-social-token (`auth: public`). */
  async publicAuthBySocialToken(e = {}) {
    return this.post(
      "/api/public/auth-by-social-token",
      e,
      a
    );
  }
  /** POST /api/public/contact (`auth: public`). */
  async publicContact(e) {
    return this.post("/api/public/contact", e, a);
  }
  /** POST /api/public/create-login-transaction (`auth: public`). */
  async publicCreateLoginTransaction(e) {
    return this.post(
      "/api/public/create-login-transaction",
      e,
      a
    );
  }
  /** POST /api/public/verify-social-token (`auth: public`). */
  async publicVerifySocialToken(e) {
    return this.post(
      "/api/public/verify-social-token",
      e,
      a
    );
  }
  // ===========================================================================
  // interface (public)
  // ===========================================================================
  /** GET /api/interface/auth-token/{token} (public). */
  async interfaceAuthByToken(e) {
    return this.get(
      `/api/interface/auth-token/${encodeURIComponent(e)}`,
      void 0,
      a
    );
  }
  /** GET /api/interface/auth/{sessionKey} (public). */
  async interfaceAuthBySessionKey(e) {
    return this.get(
      `/api/interface/auth/${encodeURIComponent(e)}`,
      void 0,
      a
    );
  }
  /** POST /api/interface/get-sms (public). */
  async interfaceGetSms(e) {
    return this.post(
      "/api/interface/get-sms",
      e,
      a
    );
  }
  /** POST /api/interface/verify-code (public). */
  async interfaceVerifyCode(e) {
    return this.post(
      "/api/interface/verify-code",
      e,
      a
    );
  }
  // ===========================================================================
  // MCP connector
  // ===========================================================================
  /** GET /api/mcp/connector (public). */
  async mcpConnectorIndex() {
    return this.get(
      "/api/mcp/connector",
      void 0,
      a
    );
  }
  /** POST /api/mcp/connector (`auth: api`). */
  async mcpConnectorStore(e = {}) {
    return this.post("/api/mcp/connector", e);
  }
  // ===========================================================================
  // gov directory (public)
  // ===========================================================================
  /** GET /api/gov/agency-footer (public). */
  async getGovAgencyFooter() {
    return this.get(
      "/api/gov/agency-footer",
      void 0,
      a
    );
  }
  /** GET /api/gov/cities (public). */
  async getGovCities(e = {}) {
    return this.get(
      "/api/gov/cities",
      e,
      a
    );
  }
  /** GET /api/gov/city-agencies (public). */
  async getGovCityAgencies(e = {}) {
    return this.get(
      "/api/gov/city-agencies",
      e,
      a
    );
  }
  /** GET /api/gov/federal-directory (public). */
  async getGovFederalDirectory() {
    return this.get(
      "/api/gov/federal-directory",
      void 0,
      a
    );
  }
  /** GET /api/gov/states (public). */
  async getGovStates(e = {}) {
    return this.get(
      "/api/gov/states",
      e,
      a
    );
  }
  /** GET /api/gov/subprojects (public). */
  async getGovSubprojects(e = {}) {
    return this.get(
      "/api/gov/subprojects",
      e,
      a
    );
  }
  /** GET /api/gov/subprojects/by-domain (public). */
  async getGovSubprojectByDomain() {
    return this.get(
      "/api/gov/subprojects/by-domain",
      void 0,
      a
    );
  }
  /** GET /api/politicians-by-domain (public). */
  async getPoliticiansByDomain() {
    return this.get(
      "/api/politicians-by-domain",
      void 0,
      a
    );
  }
  // ===========================================================================
  // home (public)
  // ===========================================================================
  /** GET /api/home/featured-creators (public). */
  async getHomeFeaturedCreators() {
    return this.get(
      "/api/home/featured-creators",
      void 0,
      a
    );
  }
  /** GET /api/home/featured-programs (public). */
  async getHomeFeaturedPrograms() {
    return this.get(
      "/api/home/featured-programs",
      void 0,
      a
    );
  }
  /** GET /api/home/feedback (public). */
  async getHomeFeedback() {
    return this.get(
      "/api/home/feedback",
      void 0,
      a
    );
  }
  /** GET /api/home/frontend/{items} (public). */
  async getHomeFrontend(e) {
    return this.get(
      `/api/home/frontend/${encodeURIComponent(e)}`,
      void 0,
      a
    );
  }
  /** GET /api/home/most-recent-programs (public). */
  async getHomeMostRecentPrograms() {
    return this.get(
      "/api/home/most-recent-programs",
      void 0,
      a
    );
  }
  /** GET /api/home/statistic (public). */
  async getHomeStatistic() {
    return this.get(
      "/api/home/statistic",
      void 0,
      a
    );
  }
  // ===========================================================================
  // public catalog / feed
  // ===========================================================================
  /** GET /api/public/creators (public). */
  async listPublicCreators() {
    return this.get(
      "/api/public/creators",
      void 0,
      a
    );
  }
  /** POST /api/public/creators/filter (public). */
  async filterPublicCreators(e = {}) {
    return this.post(
      "/api/public/creators/filter",
      e,
      a
    );
  }
  /** GET /api/public/documentation/random-feedback (public). */
  async getDocumentationRandomFeedback() {
    return this.get(
      "/api/public/documentation/random-feedback",
      void 0,
      a
    );
  }
  /** GET /api/public/documentation/search/{search?} (public). */
  async searchPublicDocumentation(e) {
    const t = e == null ? "/api/public/documentation/search" : `/api/public/documentation/search/${encodeURIComponent(e)}`;
    return this.get(t, void 0, a);
  }
  /** GET /api/public/documentation/show/{documentation} (public). */
  async showPublicDocumentation(e) {
    return this.get(
      `/api/public/documentation/show/${encodeURIComponent(String(e))}`,
      void 0,
      a
    );
  }
  /** GET /api/public/get-program-categories (public). */
  async getPublicProgramCategories() {
    return this.get(
      "/api/public/get-program-categories",
      void 0,
      a
    );
  }
  /** GET /api/public/get-program-feedback/{program} (public). */
  async getPublicProgramFeedback(e) {
    return this.get(
      `/api/public/get-program-feedback/${encodeURIComponent(String(e))}`,
      void 0,
      a
    );
  }
  /** GET /api/public/get-program-shop-categories (public). */
  async getPublicProgramShopCategories() {
    return this.get(
      "/api/public/get-program-shop-categories",
      void 0,
      a
    );
  }
  /** GET /api/public/get-program/{program} (public). */
  async getPublicProgram(e) {
    return this.get(
      `/api/public/get-program/${encodeURIComponent(String(e))}`,
      void 0,
      a
    );
  }
  /** GET /api/public/get-programs (public). */
  async getPublicPrograms() {
    return this.get(
      "/api/public/get-programs",
      void 0,
      a
    );
  }
  /** GET /api/public/get-roles (public). */
  async getPublicRoles() {
    return this.get(
      "/api/public/get-roles",
      void 0,
      a
    );
  }
  /** GET /api/public/get-user-featured/{user} (public). */
  async getPublicUserFeatured(e) {
    return this.get(
      `/api/public/get-user-featured/${encodeURIComponent(String(e))}`,
      void 0,
      a
    );
  }
  /** GET /api/public/get-user-feed/{user} (public). */
  async getPublicUserFeed(e) {
    return this.get(
      `/api/public/get-user-feed/${encodeURIComponent(String(e))}`,
      void 0,
      a
    );
  }
  /** GET /api/public/program-sale/money-distributions (public). */
  async getPublicProgramSaleMoneyDistributions() {
    return this.get(
      "/api/public/program-sale/money-distributions",
      void 0,
      a
    );
  }
  /** GET /api/public/short-link/{shortLink} (public). */
  async resolvePublicShortLink(e) {
    return this.get(
      `/api/public/short-link/${encodeURIComponent(e)}`,
      void 0,
      a
    );
  }
  /** GET /api/public/subprojects (public). */
  async listPublicSubprojects() {
    return this.get(
      "/api/public/subprojects",
      void 0,
      a
    );
  }
  /** POST /api/public/subprojects/search (public). */
  async searchPublicSubprojects(e = {}) {
    return this.post(
      "/api/public/subprojects/search",
      e,
      a
    );
  }
  /** GET /api/public/team/get-invite/{token} (public). */
  async getPublicTeamInvite(e) {
    return this.get(
      `/api/public/team/get-invite/${encodeURIComponent(e)}`,
      void 0,
      a
    );
  }
  /** GET /api/public/team/get-invited-data/{token} (public). */
  async getPublicTeamInvitedData(e) {
    return this.get(
      `/api/public/team/get-invited-data/${encodeURIComponent(e)}`,
      void 0,
      a
    );
  }
  /** DELETE /api/public/team/reject-invite/{token} (public). */
  async rejectPublicTeamInvite(e) {
    return this.delete(
      `/api/public/team/reject-invite/${encodeURIComponent(e)}`,
      a
    );
  }
  /** GET /api/public/top-creators (public). */
  async getPublicTopCreators() {
    return this.get(
      "/api/public/top-creators",
      void 0,
      a
    );
  }
  /** GET /api/public/user-country/{id} (public). */
  async getPublicUserCountry(e) {
    return this.get(
      `/api/public/user-country/${encodeURIComponent(String(e))}`,
      void 0,
      a
    );
  }
  // ===========================================================================
  // misc public
  // ===========================================================================
  /** GET /api/search (public). */
  async publicSearch(e = {}) {
    return this.get("/api/search", e, a);
  }
  /** GET /api/showcase/projects (public). */
  async getShowcaseProjects() {
    return this.get(
      "/api/showcase/projects",
      void 0,
      a
    );
  }
  /** GET /api/twitter/timeline (public). */
  async getTwitterTimeline() {
    return this.get(
      "/api/twitter/timeline",
      void 0,
      a
    );
  }
  /** GET /broadcasting/auth (public). */
  async broadcastingAuth() {
    return this.get(
      "/broadcasting/auth",
      void 0,
      a
    );
  }
  /**
   * POST /api/support/error-report — anonymous error reporting from the
   * tenant-error pages. No Bearer required. Body shape is open-ended:
   * the controller stores the entire payload as the report context, so
   * callers can include arbitrary diagnostic fields (URL, user agent,
   * stack trace, app version, etc.).
   */
  async submitErrorReport(e) {
    return this.post("/api/support/error-report", e, a);
  }
}
class Ft extends c {
  // ---------------------------------------------------------------------------
  // Assessment lookups
  // ---------------------------------------------------------------------------
  /** GET /api/wizard/assessment/answers/{protocol} */
  async getAssessmentAnswers(e) {
    return this.get(
      `/api/wizard/assessment/answers/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/wizard/assessment/questions/{protocol} */
  async getAssessmentQuestions(e) {
    return this.get(
      `/api/wizard/assessment/questions/${encodeURIComponent(String(e))}`
    );
  }
  // ---------------------------------------------------------------------------
  // Profile + account
  // ---------------------------------------------------------------------------
  /** POST /api/wizard/complete-profile/{protocol} */
  async completeProfile(e, t) {
    return this.post(
      `/api/wizard/complete-profile/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** POST /api/wizard/confirm-account/{protocol} */
  async confirmAccount(e, t) {
    return this.post(
      `/api/wizard/confirm-account/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** POST /api/wizard/confirm-code/{protocol} */
  async confirmCode(e, t) {
    return this.post(
      `/api/wizard/confirm-code/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** POST /api/wizard/confirm-preview/{protocol} — accepts a program image (File OK). */
  async confirmPreview(e, t) {
    return this.post(
      `/api/wizard/confirm-preview/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** POST /api/wizard/creator-request/{protocol} — KYC photos (File OK). */
  async submitCreatorRequest(e, t) {
    return this.post(
      `/api/wizard/creator-request/${encodeURIComponent(String(e))}`,
      t
    );
  }
  // ---------------------------------------------------------------------------
  // Stripe + finances
  // ---------------------------------------------------------------------------
  /** GET /api/wizard/connect-stripe/{protocol} */
  async connectStripe(e) {
    return this.get(
      `/api/wizard/connect-stripe/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/wizard/verify-stripe/{protocol} */
  async verifyStripe(e) {
    return this.get(
      `/api/wizard/verify-stripe/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/wizard/finances/{protocol} */
  async getFinances(e) {
    return this.get(
      `/api/wizard/finances/${encodeURIComponent(String(e))}`
    );
  }
  /** POST /api/wizard/set-finances/{protocol} */
  async setFinances(e, t = {}) {
    return this.post(
      `/api/wizard/set-finances/${encodeURIComponent(String(e))}`,
      t
    );
  }
  // ---------------------------------------------------------------------------
  // State + finalization
  // ---------------------------------------------------------------------------
  /** GET /api/wizard/finalization-state/{protocol} */
  async getFinalizationState(e) {
    return this.get(
      `/api/wizard/finalization-state/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/wizard/get-state/{protocol} */
  async getWizardState(e) {
    return this.get(
      `/api/wizard/get-state/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/wizard/program-data/{protocol} */
  async getProgramData(e) {
    return this.get(
      `/api/wizard/program-data/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/wizard/public-program-created/{protocol} */
  async getPublicProgramCreated(e) {
    return this.get(
      `/api/wizard/public-program-created/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/wizard/retry-creation/{protocol} */
  async retryCreation(e) {
    return this.get(
      `/api/wizard/retry-creation/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/wizard/start-program/{protocol} */
  async startProgram(e) {
    return this.get(
      `/api/wizard/start-program/${encodeURIComponent(String(e))}`
    );
  }
  /** GET /api/wizard/step-back/{protocol} */
  async stepBack(e) {
    return this.get(
      `/api/wizard/step-back/${encodeURIComponent(String(e))}`
    );
  }
  // ---------------------------------------------------------------------------
  // Members / team
  // ---------------------------------------------------------------------------
  /** POST /api/wizard/find-members */
  async findMembers(e) {
    return this.post("/api/wizard/find-members", e);
  }
  /** GET /api/wizard/get-required-roles/{protocol} */
  async getRequiredRoles(e) {
    return this.get(
      `/api/wizard/get-required-roles/${encodeURIComponent(String(e))}`
    );
  }
  /** POST /api/wizard/invite-members/{protocol} */
  async inviteMembers(e, t) {
    return this.post(
      `/api/wizard/invite-members/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** POST /api/wizard/invite-users/{protocol} */
  async inviteUsers(e, t) {
    return this.post(
      `/api/wizard/invite-users/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** GET /api/wizard/team/roles-to-invite/{protocol} */
  async getRolesToInvite(e) {
    return this.get(
      `/api/wizard/team/roles-to-invite/${encodeURIComponent(String(e))}`
    );
  }
  // ---------------------------------------------------------------------------
  // Misc setup
  // ---------------------------------------------------------------------------
  /** POST /api/wizard/publish-program/{protocol} */
  async publishProgram(e, t) {
    return this.post(
      `/api/wizard/publish-program/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** POST /api/wizard/set-agent/{protocol} */
  async setAgent(e, t) {
    return this.post(
      `/api/wizard/set-agent/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** POST /api/wizard/set-distribution-type/{protocol} */
  async setDistributionType(e, t) {
    return this.post(
      `/api/wizard/set-distribution-type/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** POST /api/wizard/validate-email */
  async validateEmail(e) {
    return this.post("/api/wizard/validate-email", e);
  }
  /**
   * POST /api/wizard/start — single-payload subproject create / gov-shape
   * 5-step flow kickoff. Routed to `WizardStartController` (a single
   * invokable controller) on the backend, NOT the per-step
   * `WizardController` that owns the other `/api/wizard/*` endpoints.
   *
   * Bearer required (auth:api). The payload shape is intentionally
   * open: the gov front-end submits the entire 5-step questionnaire
   * (organization name, mission, contacts, etc.) in one POST and the
   * controller decides what to persist where. Callers should treat
   * the response payload as the boot context for the newly-created
   * subproject — typically including its `id`, `domain`, and seed
   * settings.
   */
  async startWizard(e) {
    return this.post("/api/wizard/start", e);
  }
}
function A(r, e) {
  return e == null ? `/api/project-settings/${r}` : `/api/project-settings/${r}/${encodeURIComponent(String(e))}`;
}
function j(r, e) {
  return e == null ? `/api/project-settings/${r}/show` : `/api/project-settings/${r}/show/${encodeURIComponent(String(e))}`;
}
class Lt extends c {
  // ---------------------------------------------------------------------------
  // content
  // ---------------------------------------------------------------------------
  /** GET /api/project-settings/content/show/{subproject?} */
  async showContent(e) {
    return this.get(j("content", e));
  }
  /** POST /api/project-settings/content/{subproject?} */
  async saveContent(e, t) {
    return this.post(
      A("content", t),
      e
    );
  }
  // ---------------------------------------------------------------------------
  // domains
  // ---------------------------------------------------------------------------
  /** GET /api/project-settings/domains/show/{subproject?} */
  async showDomains(e) {
    return this.get(j("domains", e));
  }
  /** POST /api/project-settings/domains/{subproject?} */
  async saveDomains(e, t) {
    return this.post(
      A("domains", t),
      e
    );
  }
  // ---------------------------------------------------------------------------
  // layout
  // ---------------------------------------------------------------------------
  /** GET /api/project-settings/layout/show/{subproject?} */
  async showLayout(e) {
    return this.get(j("layout", e));
  }
  /** POST /api/project-settings/layout/{subproject?} */
  async saveLayout(e, t) {
    return this.post(
      A("layout", t),
      e
    );
  }
  // ---------------------------------------------------------------------------
  // seo
  // ---------------------------------------------------------------------------
  /** GET /api/project-settings/seo/show/{subproject?} */
  async showSeo(e) {
    return this.get(j("seo", e));
  }
  /** POST /api/project-settings/seo/{subproject?} */
  async saveSeo(e, t) {
    return this.post(
      A("seo", t),
      e
    );
  }
  // ---------------------------------------------------------------------------
  // template
  // ---------------------------------------------------------------------------
  /** GET /api/project-settings/template/show/{subproject?} */
  async showTemplate(e) {
    return this.get(j("template", e));
  }
  /** POST /api/project-settings/template/{subproject?} */
  async saveTemplate(e, t) {
    return this.post(
      A("template", t),
      e
    );
  }
}
class zt extends c {
  // ---------------------------------------------------------------------------
  // /api/dashboard-program (resource — index, store, show, update, destroy)
  // ---------------------------------------------------------------------------
  /** GET /api/dashboard-program */
  async listDashboardPrograms() {
    return this.get("/api/dashboard-program");
  }
  /** POST /api/dashboard-program */
  async createDashboardProgram(e = {}) {
    return this.post("/api/dashboard-program", e);
  }
  /** GET /api/dashboard-program/{dashboard_program} */
  async showDashboardProgram(e) {
    return this.get(
      `/api/dashboard-program/${encodeURIComponent(String(e))}`
    );
  }
  /** PUT /api/dashboard-program/{dashboard_program} — POST + `?_method=PUT`. */
  async updateDashboardProgram(e, t) {
    return this.put(
      `/api/dashboard-program/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** DELETE /api/dashboard-program/{dashboard_program} */
  async destroyDashboardProgram(e) {
    return this.delete(
      `/api/dashboard-program/${encodeURIComponent(String(e))}`
    );
  }
  // ---------------------------------------------------------------------------
  // /api/dashboard-settings/get (public)
  // ---------------------------------------------------------------------------
  /** GET /api/dashboard-settings/get — `auth: public`. */
  async getDashboardSettings() {
    return this.get(
      "/api/dashboard-settings/get",
      void 0,
      { auth: !1 }
    );
  }
  // ---------------------------------------------------------------------------
  // /api/protocol-category/{protocol_category} (PUT only — the rest are owned
  // by another slice).
  // ---------------------------------------------------------------------------
  /** PUT /api/protocol-category/{protocol_category} — POST + `?_method=PUT`. */
  async updateProtocolCategory(e, t) {
    return this.put(
      `/api/protocol-category/${encodeURIComponent(String(e))}`,
      t
    );
  }
}
class Mt extends c {
  /** POST /api/subproject-wizard/content/{id} */
  async wizardContent(e, t) {
    return this.post(
      `/api/subproject-wizard/content/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** POST /api/subproject-wizard/domains/{id} */
  async wizardDomains(e, t) {
    return this.post(
      `/api/subproject-wizard/domains/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** POST /api/subproject-wizard/layout/{id} */
  async wizardLayout(e, t) {
    return this.post(
      `/api/subproject-wizard/layout/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** POST /api/subproject-wizard/seo/{id} */
  async wizardSeo(e, t) {
    return this.post(
      `/api/subproject-wizard/seo/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** POST /api/subproject-wizard/team/{id} */
  async wizardTeam(e, t) {
    return this.post(
      `/api/subproject-wizard/team/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /** POST /api/subproject-wizard/template/{id} */
  async wizardTemplate(e, t) {
    return this.post(
      `/api/subproject-wizard/template/${encodeURIComponent(String(e))}`,
      t
    );
  }
}
class _t extends c {
  // ---------------------------------------------------------------------------
  // Public / guest endpoints
  // ---------------------------------------------------------------------------
  /**
   * POST `/api/v1/intake/start` — kick off a guest intake session.
   * Creates a guest user + intake row and returns a bearer scoped to
   * the new intake's `{id}` ability. Public — no Bearer required.
   * Rate-limited 5/min upstream.
   */
  start(e = {}, t) {
    return this.post(
      "/api/v1/intake/start",
      e,
      { auth: !1, ...t ?? {} }
    );
  }
  /**
   * POST `/api/v1/intake/handoff/{token}/exchange` — exchange a handoff
   * token for a full user-bearer once the intake is complete. Public —
   * the handoff token IS the credential. Rate-limited 10/min upstream.
   */
  exchange(e, t = {}, n) {
    const s = encodeURIComponent(e);
    return this.post(
      `/api/v1/intake/handoff/${s}/exchange`,
      t,
      { auth: !1, ...n ?? {} }
    );
  }
  // ---------------------------------------------------------------------------
  // Authenticated endpoints (Bearer with intake:{id} ability)
  // ---------------------------------------------------------------------------
  /**
   * POST `/api/v1/intake/{intake}/voice-record` — upload a voice chunk.
   * Bearer required. Rate-limited 60/min upstream. Callers should send
   * an Idempotency-Key header to make retries safe across network
   * blips. Body shape is open — FormData / File payloads are picked up
   * automatically by `BaseApiClient` via the `hasBinary` check.
   */
  voiceRecord(e, t, n) {
    const s = encodeURIComponent(String(e));
    return this.post(
      `/api/v1/intake/${s}/voice-record`,
      t,
      n
    );
  }
  /**
   * POST `/api/v1/intake/{intake}/voice-finalize` — finalize the
   * speech-to-text pipeline for an intake. Bearer required. Heavily
   * rate-limited (2/min) upstream so this is a one-shot call after
   * recording is done.
   */
  voiceFinalize(e, t = {}, n) {
    const s = encodeURIComponent(String(e));
    return this.post(
      `/api/v1/intake/${s}/voice-finalize`,
      t,
      n
    );
  }
  /**
   * POST `/api/v1/intake/{intake}/answers` — submit structured answers
   * for the current intake. Bearer required.
   */
  submitAnswers(e, t, n) {
    const s = encodeURIComponent(String(e));
    return this.post(`/api/v1/intake/${s}/answers`, t, n);
  }
  /**
   * POST `/api/v1/intake/{intake}/audience` — set the audience for the
   * intake (which subproject / role tier the intake targets). Bearer
   * required.
   */
  setAudience(e, t, n) {
    const s = encodeURIComponent(String(e));
    return this.post(`/api/v1/intake/${s}/audience`, t, n);
  }
  /**
   * POST `/api/v1/intake/{intake}/handoff` — initiate the handoff
   * flow: the controller mints a handoff token (returned in the
   * response) which the consumer then exchanges via `exchange()` from
   * a public context to upgrade to a full user-bearer.
   */
  initiateHandoff(e, t = {}, n) {
    const s = encodeURIComponent(String(e));
    return this.post(`/api/v1/intake/${s}/handoff`, t, n);
  }
  /**
   * GET `/api/v1/intake/{intake}/status` — current intake progress /
   * completion state. Bearer required. Suitable for polling.
   */
  getStatus(e, t) {
    const n = encodeURIComponent(String(e));
    return this.get(`/api/v1/intake/${n}/status`, void 0, t);
  }
}
class Nt extends c {
  /**
   * `GET /api/codify-domain/by-tld/{tld}` — merged CodifyDomain payload
   * (vocabulary + policy_boundary + substrate_systems + about_copy +
   * kind_render). Returns 404 when the TLD has no live domain row.
   */
  async getDomain(e) {
    return this.get(
      `/api/codify-domain/by-tld/${encodeURIComponent(e)}`
    );
  }
  /**
   * `GET /api/codify-domain/{tld}/intents` — live intents for the TLD
   * (with parent-TLD inheritance: city overlays merge their parent
   * vertical's catalogue). The api/ envelope wraps the list as
   * `{ intents: [...] }`; this method returns the raw envelope so the
   * caller can choose to unwrap or treat the whole thing as the result.
   */
  async getIntents(e) {
    return this.get(
      `/api/codify-domain/${encodeURIComponent(e)}/intents`
    );
  }
  /**
   * `GET /api/codify-domain/{tld}/deal-template/{intent_slug}` — full
   * deal template for one intent. 404 when no live template matches
   * (the API falls back to the parent vertical's template first).
   */
  async getDealTemplate(e, t) {
    return this.get(
      `/api/codify-domain/${encodeURIComponent(e)}/deal-template/${encodeURIComponent(t)}`
    );
  }
  /**
   * `GET /api/codify-domain/{tld}/agent-profile` — bulk one-shot
   * payload powering CI-MYC's agent page. Domain + intents + deal
   * templates + outcome rollup + stakeholders + 20 most recent
   * comments in one round-trip.
   */
  async getAgentProfile(e) {
    return this.get(
      `/api/codify-domain/${encodeURIComponent(e)}/agent-profile`
    );
  }
  /**
   * `GET /api/codify-domain/{tld}/comments` — list comments for the
   * TLD, optionally narrowed to a single intent (returns intent-scoped
   * comments PLUS domain-level comments, since domain-level notes are
   * relevant to every intent view).
   */
  async listComments(e, t) {
    const n = `/api/codify-domain/${encodeURIComponent(e)}/comments`, s = t ? `${n}?intent_slug=${encodeURIComponent(t)}` : n;
    return this.get(s);
  }
  /**
   * `POST /api/codify-domain/{tld}/comments` — author a comment.
   * Requires sanctum auth on the api/ side; CI-MYC's caller injects
   * the user's Bearer token via `getToken`. Returns the persisted row
   * (wrapped as `{ comment: AgentComment }`).
   *
   * v1 attributes the comment to the authenticated user; agent-
   * authored comments (machine token + `author_agent_id`) land in
   * Phase 4 once api/ wires the agent token guard.
   */
  async createComment(e, t) {
    return this.post(
      `/api/codify-domain/${encodeURIComponent(e)}/comments`,
      t
    );
  }
}
function I(r, e = 80) {
  const t = (r ?? "").toString().replace(/\s+/g, " ").trim();
  return t.length <= e ? t.replace(/"/g, "'") : `${t.slice(0, e - 1).replace(/"/g, "'")}…`;
}
function D(r) {
  return r.replace(/[^A-Za-z0-9]/g, "_").replace(/^_+|_+$/g, "").slice(0, 32) || "Actor";
}
function Te(r) {
  const e = /* @__PURE__ */ new Map(), t = (n, s) => {
    if (!n) return;
    const o = D(n);
    e.has(o) || e.set(o, { alias: o, label: n, kind: s });
  };
  for (const n of r.required_stakeholders ?? []) {
    const s = n.role || n.onet_code || "Stakeholder", o = /agent/i.test(s);
    t(s, o ? "agent" : "human");
  }
  for (const n of r.required_systems ?? [])
    t(n.abbr, "system");
  for (const n of r.pipeline_steps ?? []) {
    if (!n.actor) continue;
    const s = (r.required_systems ?? []).some((i) => i.abbr === n.actor), o = /agent/i.test(n.actor);
    t(n.actor, s ? "system" : o ? "agent" : "human");
  }
  return Array.from(e.values());
}
function De(r, e) {
  const t = r.inputs ?? [];
  for (const n of t) {
    const s = n.match(/^step:(\d+)/);
    if (s) {
      const o = e.get(Number(s[1]));
      if (o != null && o.actor) return D(o.actor);
    }
  }
  return null;
}
function Bt(r) {
  var p, l;
  const e = [];
  e.push("sequenceDiagram");
  const t = I(((p = r.problem_classification) == null ? void 0 : p.summary) ?? r.intent_slug ?? "use case", 120), n = Te(r);
  for (const u of n) {
    const g = u.kind === "system" ? `<<sys>> ${I(u.label, 24)}` : I(u.label, 32);
    e.push(`  participant ${u.alias} as ${g}`);
  }
  n.length > 0 ? e.push(`  Note over ${n[0].alias}: ${I(t, 120)}`) : e.push(`  Note left of Codify: ${I(t, 120)}`);
  const s = /* @__PURE__ */ new Map();
  for (const u of r.pipeline_steps ?? [])
    typeof u.step == "number" && s.set(u.step, u);
  const o = (r.pipeline_steps ?? []).slice().sort((u, g) => (u.step ?? 0) - (g.step ?? 0));
  for (let u = 0; u < o.length; u++) {
    const g = o[u];
    if (!g.actor) continue;
    const $ = D(g.actor), U = De(g, s) ?? (u > 0 ? D(o[u - 1].actor ?? "") : null);
    U && U !== $ ? e.push(`  ${U}->>${$}: ${I(g.action ?? "action")}`) : U === $ ? e.push(`  ${$}->>${$}: ${I(g.action ?? "action")}`) : e.push(`  ${$}->>${$}: ${I(g.action ?? "action")}`);
    for (const w of g.policy_checks ?? [])
      e.push(`  Note right of ${$}: policy: ${I(w, 60)}`);
  }
  const i = r.success_criteria;
  if (i != null && i.primary_metric) {
    const u = i.verification ? ` (${i.verification})` : "", g = ((l = n[n.length - 1]) == null ? void 0 : l.alias) ?? "Codify";
    e.push(`  Note over ${g}: ✅ ${I(i.primary_metric, 80)}${u}`);
  }
  return e.join(`
`);
}
class Wt extends c {
  // ===========================================================================
  // Public helpers
  // ===========================================================================
  /**
   * GET /api/codify-domain/ — list every LIVE codify domain (with live
   * intent counts), filtered to domains that have ≥1 live intent. Anon-
   * allowed + per-IP throttled. Body shape: `{ data: CodifyDomainListItem[] }`.
   */
  async listDomains() {
    return this.get("/api/codify-domain/");
  }
  /**
   * GET /api/codify-domain/{tld}/kind-render — resolved kind_render map for a
   * TLD. `role` is silently dropped for anonymous callers (the server returns
   * `role: null` + the base-layer map). 404 when the TLD has no live domain.
   */
  async getKindRender(e, t) {
    return this.get(
      `/api/codify-domain/${encodeURIComponent(e)}/kind-render`,
      t
    );
  }
  /**
   * GET /api/codify/lookup/{resolver} — tenant-scoped controlled-input
   * autocomplete. `q` + `tld` are reserved; any other query key is forwarded
   * to the resolver backend. Unknown resolver → 404 `resolver_not_registered`;
   * an external (paid) backend requires auth → 401 `authentication_required`.
   * Returns `{ results, meta }`.
   */
  async lookup(e, t) {
    return this.get(
      `/api/codify/lookup/${encodeURIComponent(e)}`,
      t
    );
  }
  // ===========================================================================
  // Admin — codify-domain
  // ===========================================================================
  /**
   * GET /api/admin/codify-domain — paginated (50/page) list of domains across
   * all statuses, optionally filtered by `status` / `tld`. Body:
   * `{ data: AdminCodifyDomain[], total }`.
   */
  async adminListDomains(e) {
    return this.get(
      "/api/admin/codify-domain",
      e
    );
  }
  /** GET /api/admin/codify-domain/{id} — single domain (any status). */
  async adminShowDomain(e) {
    return this.get(
      `/api/admin/codify-domain/${encodeURIComponent(String(e))}`
    );
  }
  /**
   * POST /api/admin/codify-domain — create a DRAFT domain. Validated against
   * codify-domain.schema.json (422 on failure). Returns the new row (201) with
   * `status: 'draft'` + the assigned `version`.
   */
  async adminCreateDomain(e) {
    return this.post(
      "/api/admin/codify-domain",
      e
    );
  }
  /**
   * PUT /api/admin/codify-domain/{id} — partial edit of a DRAFT domain (409
   * if not a draft). Sent as POST + `?_method=PUT`. The merged row must still
   * validate (422 otherwise). Returns the refreshed row.
   */
  async adminUpdateDomain(e, t) {
    return this.put(
      `/api/admin/codify-domain/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /**
   * POST /api/admin/codify-domain/{id}/approve — promote a DRAFT to LIVE
   * (demotes the prior live version to deprecated + fires CodifyDomainApproved).
   * 409 if the row is not a draft. Returns the now-live row.
   */
  async adminApproveDomain(e) {
    return this.post(
      `/api/admin/codify-domain/${encodeURIComponent(String(e))}/approve`
    );
  }
  /**
   * POST /api/admin/codify-domain/{id}/revert — demote a LIVE row and restore
   * the prior deprecated version to live. 409 if the row is not live or no
   * prior version exists. Returns the restored (now-live) row.
   */
  async adminRevertDomain(e) {
    return this.post(
      `/api/admin/codify-domain/${encodeURIComponent(String(e))}/revert`
    );
  }
  // ===========================================================================
  // Admin — codify-intent
  // ===========================================================================
  /**
   * GET /api/admin/codify-intent — paginated (50/page) list of intents,
   * optionally filtered by `domain_id` / `tld` / `status` / `slug`. Body:
   * `{ data: AdminCodifyIntent[], total }`.
   */
  async adminListIntents(e) {
    return this.get(
      "/api/admin/codify-intent",
      e
    );
  }
  /** GET /api/admin/codify-intent/{id} — single intent (any status). */
  async adminShowIntent(e) {
    return this.get(
      `/api/admin/codify-intent/${encodeURIComponent(String(e))}`
    );
  }
  /**
   * PUT /api/admin/codify-intent/{id} — partial edit of a DRAFT intent (409
   * if not a draft). Sent as POST + `?_method=PUT`. The merged row must still
   * validate against codify-intent.schema.json (422 otherwise).
   */
  async adminUpdateIntent(e, t) {
    return this.put(
      `/api/admin/codify-intent/${encodeURIComponent(String(e))}`,
      t
    );
  }
  /**
   * POST /api/admin/codify-intent/{id}/approve — promote a DRAFT intent to
   * LIVE (demotes the prior live (tld, slug) + fires CodifyIntentApproved).
   * 409 if not a draft.
   */
  async adminApproveIntent(e) {
    return this.post(
      `/api/admin/codify-intent/${encodeURIComponent(String(e))}/approve`
    );
  }
  /**
   * POST /api/admin/codify-intent — bulk-create intents. Each entry is
   * validated against codify-intent.schema.json; the whole batch fails 422 on
   * the first bad row (or 422 `No intents supplied.` on an empty array).
   * Returns `{ created: <n> }` (201).
   */
  async adminBulkStoreIntents(e) {
    return this.post(
      "/api/admin/codify-intent",
      e
    );
  }
  // ===========================================================================
  // Admin — codify-deal-template
  // ===========================================================================
  /**
   * POST /api/admin/codify-deal-template — bulk-create deal templates. Each
   * entry is validated against codify-deal-template.schema.json and its
   * `(tld, intent_slug)` must resolve to an existing intent (422 otherwise).
   * Returns `{ created: <n> }` (201).
   */
  async adminBulkStoreDealTemplates(e) {
    return this.post(
      "/api/admin/codify-deal-template",
      e
    );
  }
}
function v(r, e) {
  return r ? {
    ...e ?? {},
    headers: { ...(e == null ? void 0 : e.headers) ?? {}, "Idempotency-Key": r }
  } : e;
}
class Gt extends c {
  // ===========================================================================
  // User upsert — IBD / PHM / MOB / NIO (AbstractUserUpsertController)
  // ===========================================================================
  /**
   * POST /api/v1/integrations/ibd/users/upsert — federate an IBD (Crohnie AI)
   * user. `external_id` is the upstream Mongo `_id`. 202 `{ user_id,
   * external_id, source: 'ibd', status: 'linked' }`.
   */
  async upsertIbdUser(e, t, n) {
    return this.post(
      "/api/v1/integrations/ibd/users/upsert",
      e,
      v(t, n)
    );
  }
  /**
   * POST /api/v1/integrations/phm/users/upsert — federate a PHM user.
   * `external_id` is the upstream MariaDB integer (as a string). 202 linked.
   */
  async upsertPhmUser(e, t, n) {
    return this.post(
      "/api/v1/integrations/phm/users/upsert",
      e,
      v(t, n)
    );
  }
  /**
   * POST /api/v1/integrations/mob/users/upsert — federate a MOB (Run Tracker)
   * user. `external_id` is the device UUID. 202 linked.
   */
  async upsertMobUser(e, t, n) {
    return this.post(
      "/api/v1/integrations/mob/users/upsert",
      e,
      v(t, n)
    );
  }
  /**
   * POST /api/v1/integrations/nio/users/upsert — federate a NIO (NutriScan)
   * user. `external_id` is the Firebase UID. 202 linked.
   */
  async upsertNioUser(e, t, n) {
    return this.post(
      "/api/v1/integrations/nio/users/upsert",
      e,
      v(t, n)
    );
  }
  /**
   * POST /api/v1/integrations/careers/users/upsert — codify-careers HRM
   * claim-back federation upsert. At least one of `email` / `source_email`
   * is required. 202 `{ user_id, p2x_user_id, source, status: 'linked' }`.
   */
  async upsertCareersUser(e, t, n) {
    return this.post(
      "/api/v1/integrations/careers/users/upsert",
      e,
      v(t, n)
    );
  }
  // ===========================================================================
  // IBD Phase 1 event log
  // ===========================================================================
  /**
   * POST /api/v1/integrations/ibd/applications — push an IBD clinical-program
   * application. 202 `{ id, source: 'ibd', kind: 'application', status:
   * 'accepted' }`.
   */
  async createIbdApplication(e, t, n) {
    return this.post(
      "/api/v1/integrations/ibd/applications",
      e,
      v(t, n)
    );
  }
  /**
   * POST /api/v1/integrations/ibd/kpi-events — push an IBD KPI event
   * (`metric`, numeric `value`, `dimensions`, `occurred_at`). 202 accepted
   * (kind `kpi_event`).
   */
  async createIbdKpiEvent(e, t, n) {
    return this.post(
      "/api/v1/integrations/ibd/kpi-events",
      e,
      v(t, n)
    );
  }
  // ===========================================================================
  // MOB Phase 1 event log
  // ===========================================================================
  /**
   * POST /api/v1/integrations/mob/activity-locations/batch — upload a batch of
   * GPS points keyed by `device_uuid`. 202 accepted (kind `activity_location`).
   */
  async batchMobActivityLocations(e, t, n) {
    return this.post(
      "/api/v1/integrations/mob/activity-locations/batch",
      e,
      v(t, n)
    );
  }
  /**
   * POST /api/v1/integrations/mob/runs/complete — push a run-completion event
   * (duration, distance, path GeoJSON). 202 accepted (kind `run_complete`).
   */
  async completeMobRun(e, t, n) {
    return this.post(
      "/api/v1/integrations/mob/runs/complete",
      e,
      v(t, n)
    );
  }
  // ===========================================================================
  // NIO Phase 1 event log
  // ===========================================================================
  /**
   * POST /api/v1/integrations/nio/assessments-responses — submit a completed
   * NIO assessment (`assessment_key`, `responses`, optional `scoring`). 202
   * accepted (kind `assessment`).
   */
  async createNioAssessmentResponse(e, t, n) {
    return this.post(
      "/api/v1/integrations/nio/assessments-responses",
      e,
      v(t, n)
    );
  }
  /**
   * POST /api/v1/integrations/nio/orders — push a NIO subscription/order event
   * (`source` in {stripe,appstore,playstore}). 202 accepted (kind `order`).
   */
  async createNioOrder(e, t, n) {
    return this.post(
      "/api/v1/integrations/nio/orders",
      e,
      v(t, n)
    );
  }
  // ===========================================================================
  // NIO server-authoritative coin economy
  // ===========================================================================
  /**
   * POST /api/v1/integrations/nio/coins/grant — credit the authenticated
   * user's coin balance. Returns `{ balance, transaction_id }`. The
   * `Idempotency-Key` makes a grant replay-safe (the ledger's unique index is
   * the durable backstop beyond the 24h cache window).
   */
  async grantNioCoins(e, t, n) {
    return this.post(
      "/api/v1/integrations/nio/coins/grant",
      e,
      v(t, n)
    );
  }
  /**
   * POST /api/v1/integrations/nio/coins/spend — debit the authenticated user's
   * coin balance. Returns `{ balance, transaction_id }`. A spend that would
   * overdraw returns 422 `{ amount: ['Insufficient coin balance.'] }`.
   */
  async spendNioCoins(e, t, n) {
    return this.post(
      "/api/v1/integrations/nio/coins/spend",
      e,
      v(t, n)
    );
  }
  // ===========================================================================
  // Token mints — unauthenticated (the endpoint's own check is the auth)
  // ===========================================================================
  /**
   * POST /api/v1/integrations/nio/firebase-login — swap a Firebase ID token
   * for a P2X Sanctum bearer. Sent WITHOUT an Authorization header by default
   * (the Firebase signature is the authentication); the tenant still resolves
   * from `X-Domain`, and `Idempotency-Key` makes a retried swap return the
   * cached token instead of minting a second. Returns `{ success, message,
   * data: { user, token } }`. A bad token → 401.
   */
  async nioFirebaseLogin(e, t, n) {
    return this.post(
      "/api/v1/integrations/nio/firebase-login",
      e,
      v(t, { auth: !1, ...n ?? {} })
    );
  }
  /**
   * POST /api/v1/integrations/mob/guest-register — mint the device's FIRST
   * Sanctum bearer from a stable `device_uuid`. Unauthenticated (no bearer);
   * sent with `{ auth: false }` by default. Throttled + idempotent server-side
   * (a repeat device_uuid resolves the same user). Returns
   * `{ data: { user, token } }` — 201 on first registration, 200 on a repeat.
   */
  async mobGuestRegister(e, t, n) {
    return this.post(
      "/api/v1/integrations/mob/guest-register",
      e,
      v(t, { auth: !1, ...n ?? {} })
    );
  }
}
async function Vt() {
  var r, e;
  try {
    const t = await d.programs.getFeaturedPrograms();
    if (t.data.success) {
      const n = t.data.data;
      return console.log(`Retrieved ${n.length} featured programs`), n.forEach((s) => {
        console.log(`Program #${s.id}: ${s.name} by ${s.author.name}`), console.log(`Price: $${s.price} | Status: ${s.status}`), console.log(`Category: ${s.category.name}`), console.log("---");
      }), n;
    } else
      return console.error("Failed to retrieve featured programs:", t.data.message), [];
  } catch (t) {
    return console.error("Error retrieving featured programs:", ((e = (r = t.response) == null ? void 0 : r.data) == null ? void 0 : e.message) || t.message), [];
  }
}
async function qt() {
  var r, e;
  try {
    const t = await d.programs.getRecentPrograms();
    if (t.data.success) {
      const n = t.data.data;
      return console.log(`Retrieved ${n.length} recent programs`), n.forEach((s) => {
        console.log(`Program #${s.id}: ${s.name} by ${s.author.name}`), console.log(`Created: ${new Date(s.createdAt).toLocaleDateString()}`), console.log("---");
      }), n;
    } else
      return console.error("Failed to retrieve recent programs:", t.data.message), [];
  } catch (t) {
    return console.error("Error retrieving recent programs:", ((e = (r = t.response) == null ? void 0 : r.data) == null ? void 0 : e.message) || t.message), [];
  }
}
async function Ht(r) {
  var e, t, n;
  try {
    const s = await d.programs.getProgram(r);
    if (s.data.success) {
      const o = s.data.data;
      return console.log(`Program #${o.id}: ${o.name}`), console.log(`Description: ${o.description}`), console.log(`Price: $${o.price}`), console.log(`Status: ${o.status}`), console.log(`Author: ${o.author.name}`), console.log(`Category: ${o.category.name}`), o;
    } else
      return console.error("Failed to retrieve program:", s.data.message), null;
  } catch (s) {
    return ((e = s.response) == null ? void 0 : e.status) === 404 ? console.error(`Program #${r} not found`) : console.error("Error retrieving program:", ((n = (t = s.response) == null ? void 0 : t.data) == null ? void 0 : n.message) || s.message), null;
  }
}
async function Ot(r) {
  var e, t;
  try {
    const n = await d.programs.getProgramFeedback(r);
    if (n.data.success) {
      const s = n.data.data;
      return console.log(`Retrieved ${s.length} feedback items for program #${r}`), s.forEach((o) => {
        console.log(`${o.user.name} - ${o.rating}/5 stars`), console.log(`Comment: ${o.comment}`), console.log(`Date: ${new Date(o.createdAt).toLocaleDateString()}`), console.log("---");
      }), s;
    } else
      return console.error("Failed to retrieve program feedback:", n.data.message), [];
  } catch (n) {
    return console.error("Error retrieving program feedback:", ((t = (e = n.response) == null ? void 0 : e.data) == null ? void 0 : t.message) || n.message), [];
  }
}
async function Jt(r, e) {
  var t, n;
  try {
    const s = await d.programs.searchPrograms(r, e);
    if (s.data.success) {
      const o = s.data.data;
      return console.log(`Found ${o.length} programs matching "${r}"`), e && console.log(`Category filter: #${e}`), o.forEach((i) => {
        console.log(`Program #${i.id}: ${i.name} by ${i.author.name}`), console.log(`Price: $${i.price} | Status: ${i.status}`), console.log("---");
      }), o;
    } else
      return console.error("Search failed:", s.data.message), [];
  } catch (s) {
    return console.error("Error searching programs:", ((n = (t = s.response) == null ? void 0 : t.data) == null ? void 0 : n.message) || s.message), [];
  }
}
async function Qt(r) {
  var e, t;
  try {
    const n = await d.programs.toggleBookmark(r);
    if (n.data.success) {
      const { bookmarked: s } = n.data.data;
      return console.log(s ? `Program #${r} has been bookmarked` : `Program #${r} has been unbookmarked`), s;
    } else
      return console.error("Failed to toggle bookmark:", n.data.message), !1;
  } catch (n) {
    return console.error("Error toggling bookmark:", ((t = (e = n.response) == null ? void 0 : e.data) == null ? void 0 : t.message) || n.message), !1;
  }
}
async function Kt() {
  var r, e;
  try {
    const t = await d.programs.getBookmarks();
    if (t.data.success) {
      const n = t.data.data;
      return console.log(`Retrieved ${n.length} bookmarked programs`), n.forEach((s) => {
        console.log(`Program #${s.id}: ${s.name} by ${s.author.name}`), console.log(`Price: $${s.price} | Status: ${s.status}`), console.log("---");
      }), n;
    } else
      return console.error("Failed to retrieve bookmarks:", t.data.message), [];
  } catch (t) {
    return console.error("Error retrieving bookmarks:", ((e = (r = t.response) == null ? void 0 : r.data) == null ? void 0 : e.message) || t.message), [];
  }
}
async function Yt() {
  var r, e;
  try {
    const t = await d.programs.getCategories();
    if (t.data.success) {
      const n = t.data.data;
      console.log(`Retrieved ${n.length} program categories`), n.forEach((s) => {
        console.log(`Category #${s.id}: ${s.name}`), s.description && console.log(`Description: ${s.description}`), s.parentId && console.log(`Parent Category: #${s.parentId}`), console.log("---");
      });
    } else
      console.error("Failed to retrieve categories:", t.data.message);
  } catch (t) {
    console.error("Error retrieving categories:", ((e = (r = t.response) == null ? void 0 : r.data) == null ? void 0 : e.message) || t.message);
  }
}
async function Xt(r) {
  var e, t;
  try {
    const n = await d.programs.getUserPrograms(r);
    if (n.data.success) {
      const s = n.data.data;
      return console.log(`Retrieved ${s.length} programs by user #${r}`), s.forEach((o) => {
        console.log(`Program #${o.id}: ${o.name}`), console.log(`Price: $${o.price} | Status: ${o.status}`), console.log("---");
      }), s;
    } else
      return console.error("Failed to retrieve user programs:", n.data.message), [];
  } catch (n) {
    return console.error("Error retrieving user programs:", ((t = (e = n.response) == null ? void 0 : e.data) == null ? void 0 : t.message) || n.message), [];
  }
}
async function Zt(r) {
  var e, t;
  try {
    const n = await d.programs.getUserFeaturedPrograms(r);
    if (n.data.success) {
      const s = n.data.data;
      return console.log(`Retrieved ${s.length} featured programs by user #${r}`), s.forEach((o) => {
        console.log(`Program #${o.id}: ${o.name}`), console.log(`Price: $${o.price} | Status: ${o.status}`), console.log("---");
      }), s;
    } else
      return console.error("Failed to retrieve user featured programs:", n.data.message), [];
  } catch (n) {
    return console.error("Error retrieving user featured programs:", ((t = (e = n.response) == null ? void 0 : e.data) == null ? void 0 : t.message) || n.message), [];
  }
}
async function en() {
  var r, e;
  try {
    const t = await d.items.getItems({
      status: _.ACTIVE,
      page: 1,
      perPage: 20
    });
    if (t.data.success) {
      const { items: n, pagination: s } = t.data.data;
      console.log(`Retrieved ${n.length} items (page ${s.currentPage} of ${s.lastPage})`), console.log(`Total items: ${s.total}`), n.forEach((o) => {
        console.log(`Item #${o.id}: ${o.name} - $${o.price} (${o.status})`);
      });
    } else
      console.error("Failed to retrieve items:", t.data.message);
  } catch (t) {
    console.error("Error retrieving items:", ((e = (r = t.response) == null ? void 0 : r.data) == null ? void 0 : e.message) || t.message);
  }
}
async function tn(r) {
  var e, t, n;
  try {
    const s = await d.items.getItem(r);
    if (s.data.success) {
      const o = s.data.data;
      console.log(`Item #${o.id}: ${o.name}`), console.log(`Description: ${o.description}`), console.log(`Price: $${o.price}`), console.log(`Status: ${o.status}`), console.log(`Created: ${o.createdAt}`);
    } else
      console.error("Failed to retrieve item:", s.data.message);
  } catch (s) {
    ((e = s.response) == null ? void 0 : e.status) === 404 ? console.error(`Item #${r} not found`) : console.error("Error retrieving item:", ((n = (t = s.response) == null ? void 0 : t.data) == null ? void 0 : n.message) || s.message);
  }
}
async function nn(r, e, t) {
  var n, s, o, i;
  try {
    const p = await d.items.createItem({
      name: r,
      description: e,
      price: t,
      status: _.ACTIVE
    });
    if (p.data.success) {
      const l = p.data.data;
      return console.log(`Created new item #${l.id}: ${l.name}`), l;
    } else
      return console.error("Failed to create item:", p.data.message), null;
  } catch (p) {
    if (((n = p.response) == null ? void 0 : n.status) === 422 && ((s = p.response.data) != null && s.errors)) {
      const l = p.response.data.errors;
      Object.entries(l).forEach(([u, g]) => {
        console.error(`${u}: ${g.join(", ")}`);
      });
    } else
      console.error("Error creating item:", ((i = (o = p.response) == null ? void 0 : o.data) == null ? void 0 : i.message) || p.message);
    return null;
  }
}
async function rn(r, e) {
  var t, n, s, o, i;
  try {
    const p = await d.items.updateItem(r, e);
    if (p.data.success) {
      const l = p.data.data;
      return console.log(`Updated item #${l.id}: ${l.name}`), Object.keys(e).forEach((u) => {
        console.log(`- Updated ${u}: ${l[u]}`);
      }), l;
    } else
      return console.error("Failed to update item:", p.data.message), null;
  } catch (p) {
    if (((t = p.response) == null ? void 0 : t.status) === 404)
      console.error(`Item #${r} not found`);
    else if (((n = p.response) == null ? void 0 : n.status) === 422 && ((s = p.response.data) != null && s.errors)) {
      const l = p.response.data.errors;
      Object.entries(l).forEach(([u, g]) => {
        console.error(`${u}: ${g.join(", ")}`);
      });
    } else
      console.error("Error updating item:", ((i = (o = p.response) == null ? void 0 : o.data) == null ? void 0 : i.message) || p.message);
    return null;
  }
}
async function sn(r) {
  var e, t, n;
  try {
    const s = await d.items.deleteItem(r);
    return s.data.success ? (console.log(`Item #${r} deleted successfully`), !0) : (console.error("Failed to delete item:", s.data.message), !1);
  } catch (s) {
    return ((e = s.response) == null ? void 0 : e.status) === 404 ? console.error(`Item #${r} not found`) : console.error("Error deleting item:", ((n = (t = s.response) == null ? void 0 : t.data) == null ? void 0 : n.message) || s.message), !1;
  }
}
async function on(r, e) {
  var t, n;
  try {
    const s = await d.items.searchItems(r, e);
    if (s.data.success) {
      const o = s.data.data;
      return console.log(`Found ${o.length} items matching "${r}" (type: ${e})`), o.forEach((i) => {
        console.log(`Item #${i.id}: ${i.name} - $${i.price}`);
      }), o;
    } else
      return console.error("Search failed:", s.data.message), [];
  } catch (s) {
    return console.error("Error searching items:", ((n = (t = s.response) == null ? void 0 : t.data) == null ? void 0 : n.message) || s.message), [];
  }
}
async function an() {
  var r, e;
  try {
    const t = await d.items.getCollections();
    if (t.data.success) {
      const n = t.data.data;
      return console.log(`Retrieved ${n.length} collections`), n.forEach((s) => {
        console.log(`Collection #${s.id}: ${s.name} (${s.items.length} items)`);
      }), n;
    } else
      return console.error("Failed to retrieve collections:", t.data.message), [];
  } catch (t) {
    return console.error("Error retrieving collections:", ((e = (r = t.response) == null ? void 0 : r.data) == null ? void 0 : e.message) || t.message), [];
  }
}
async function cn(r, e) {
  var t, n;
  try {
    const s = await d.items.createCollection({
      name: r,
      description: e
    });
    if (s.data.success) {
      const o = s.data.data;
      return console.log(`Created new collection #${o.id}: ${o.name}`), o;
    } else
      return console.error("Failed to create collection:", s.data.message), null;
  } catch (s) {
    return console.error("Error creating collection:", ((n = (t = s.response) == null ? void 0 : t.data) == null ? void 0 : n.message) || s.message), null;
  }
}
async function pn(r, e) {
  var t, n;
  try {
    const s = await d.items.addItemToCollection(r, e);
    return s.data.success ? (console.log(`Added item #${e} to collection #${r}`), !0) : (console.error("Failed to add item to collection:", s.data.message), !1);
  } catch (s) {
    return console.error("Error adding item to collection:", ((n = (t = s.response) == null ? void 0 : t.data) == null ? void 0 : n.message) || s.message), !1;
  }
}
async function ln(r) {
  var e, t;
  try {
    const n = await d.items.removeItemFromCollection(r);
    return n.data.success ? (console.log(`Removed item #${r} from collection`), !0) : (console.error("Failed to remove item from collection:", n.data.message), !1);
  } catch (n) {
    return console.error("Error removing item from collection:", ((t = (e = n.response) == null ? void 0 : e.data) == null ? void 0 : t.message) || n.message), !1;
  }
}
async function un(r, e) {
  var t, n;
  try {
    const s = await d.auth.login({
      email: r,
      password: e,
      rememberMe: !0
    });
    s.data.success ? (console.log("Login successful!"), console.log("User:", s.data.data.user), console.log("Token expires at:", s.data.data.expiresAt)) : console.error("Login failed:", s.data.message);
  } catch (s) {
    console.error("Login error:", ((n = (t = s.response) == null ? void 0 : t.data) == null ? void 0 : n.message) || s.message);
  }
}
async function dn(r, e, t, n) {
  var s, o, i, p;
  try {
    const l = await d.auth.register({
      name: r,
      email: e,
      password: t,
      password_confirmation: n,
      terms: !0
      // Accept terms and conditions
    });
    l.data.success ? (console.log("Registration successful!"), console.log("User:", l.data.data.user)) : console.error("Registration failed:", l.data.message);
  } catch (l) {
    if (((s = l.response) == null ? void 0 : s.status) === 422 && ((o = l.response.data) != null && o.errors)) {
      const u = l.response.data.errors;
      Object.entries(u).forEach(([g, $]) => {
        console.error(`${g}: ${$.join(", ")}`);
      });
    } else
      console.error("Registration error:", ((p = (i = l.response) == null ? void 0 : i.data) == null ? void 0 : p.message) || l.message);
  }
}
async function gn() {
  var r, e, t;
  try {
    if (!d.auth.isAuthenticated()) {
      console.log("User is not authenticated. Please login first.");
      return;
    }
    const n = await d.auth.getCurrentUser();
    n.data.success ? console.log("Current user:", n.data.data) : console.error("Failed to get current user:", n.data.message);
  } catch (n) {
    ((r = n.response) == null ? void 0 : r.status) === 401 ? console.error("Authentication error: Your session has expired. Please login again.") : console.error("Error getting current user:", ((t = (e = n.response) == null ? void 0 : e.data) == null ? void 0 : t.message) || n.message);
  }
}
async function hn() {
  var r, e;
  try {
    const t = await d.auth.logout();
    t.data.success ? console.log("Logout successful!") : console.error("Logout failed:", t.data.message);
  } catch (t) {
    console.error("Logout error:", ((e = (r = t.response) == null ? void 0 : r.data) == null ? void 0 : e.message) || t.message);
  }
}
async function mn(r) {
  var e, t;
  try {
    const n = await d.auth.requestPasswordReset({ email: r });
    n.data.success ? console.log("Password reset email sent!") : console.error("Password reset request failed:", n.data.message);
  } catch (n) {
    console.error("Password reset error:", ((t = (e = n.response) == null ? void 0 : e.data) == null ? void 0 : t.message) || n.message);
  }
}
async function yn(r, e, t, n) {
  var s, o;
  try {
    const i = await d.auth.setNewPassword({
      email: r,
      token: e,
      password: t,
      password_confirmation: n
    });
    i.data.success ? console.log("Password reset successful!") : console.error("Password reset failed:", i.data.message);
  } catch (i) {
    console.error("Password reset error:", ((o = (s = i.response) == null ? void 0 : s.data) == null ? void 0 : o.message) || i.message);
  }
}
async function fn(r) {
  var e, t;
  try {
    const n = await d.chat.getChatList(r);
    if (n.data.success) {
      const s = n.data.data;
      return console.log(`Retrieved ${s.length} chat rooms`), s.forEach((o) => {
        const i = o.participants.map((l) => l.name).join(", "), p = o.lastMessage ? `Last message: ${o.lastMessage.message.substring(0, 30)}${o.lastMessage.message.length > 30 ? "..." : ""}` : "No messages yet";
        console.log(`Chat #${o.id}: ${i}`), console.log(`Type: ${o.type} | Unread: ${o.unreadCount}`), console.log(p), console.log("---");
      }), s;
    } else
      return console.error("Failed to retrieve chat rooms:", n.data.message), [];
  } catch (n) {
    return console.error("Error retrieving chat rooms:", ((t = (e = n.response) == null ? void 0 : e.data) == null ? void 0 : t.message) || n.message), [];
  }
}
async function Cn(r) {
  var e, t;
  try {
    const n = await d.chat.getChatRoom(r);
    if (n.data.success) {
      const s = n.data.data, o = s.participants.map((i) => i.name).join(", ");
      return console.log(`Chat room #${s.id} with ${o}`), console.log(`Type: ${s.type} | Created: ${new Date(s.createdAt).toLocaleDateString()}`), s;
    } else
      return console.error("Failed to retrieve chat room:", n.data.message), null;
  } catch (n) {
    return console.error("Error retrieving chat room:", ((t = (e = n.response) == null ? void 0 : e.data) == null ? void 0 : t.message) || n.message), null;
  }
}
async function $n(r, e) {
  var t, n;
  try {
    const s = await d.chat.getMessages(r, e);
    if (s.data.success) {
      const o = s.data.data;
      return console.log(`Retrieved ${o.length} messages from chat #${r}`), o.forEach((i) => {
        var p;
        console.log(`${i.user.name} (${new Date(i.createdAt).toLocaleString()}):`), console.log(i.message), ((p = i.attachments) == null ? void 0 : p.length) > 0 && console.log(`Attachments: ${i.attachments.length}`), console.log("---");
      }), o;
    } else
      return console.error("Failed to retrieve chat messages:", s.data.message), [];
  } catch (s) {
    return console.error("Error retrieving chat messages:", ((n = (t = s.response) == null ? void 0 : t.data) == null ? void 0 : n.message) || s.message), [];
  }
}
async function vn(r, e, t) {
  var n, s;
  try {
    const o = await d.chat.sendMessage({
      roomId: r,
      message: e,
      attachments: t
    });
    if (o.data.success) {
      const i = o.data.data;
      return console.log("Message sent successfully"), console.log(`Message ID: ${i.id}`), console.log(`Sent at: ${new Date(i.createdAt).toLocaleString()}`), i;
    } else
      return console.error("Failed to send message:", o.data.message), null;
  } catch (o) {
    return console.error("Error sending message:", ((s = (n = o.response) == null ? void 0 : n.data) == null ? void 0 : s.message) || o.message), null;
  }
}
async function Sn(r) {
  var e, t;
  try {
    const n = await d.chat.findUserToChat(r);
    if (n.data.success) {
      const s = n.data.data;
      return console.log(`Found ${s.length} users matching "${r}"`), s.forEach((o) => {
        console.log(`User #${o.id}: ${o.name} (${o.email})`);
      }), s;
    } else
      return console.error("Failed to find users:", n.data.message), [];
  } catch (n) {
    return console.error("Error finding users:", ((t = (e = n.response) == null ? void 0 : e.data) == null ? void 0 : t.message) || n.message), [];
  }
}
async function bn(r) {
  var e, t;
  try {
    const n = await d.chat.deleteMessage(r);
    return n.data.success ? (console.log(`Message #${r} deleted successfully`), !0) : (console.error("Failed to delete message:", n.data.message), !1);
  } catch (n) {
    return console.error("Error deleting message:", ((t = (e = n.response) == null ? void 0 : e.data) == null ? void 0 : t.message) || n.message), !1;
  }
}
async function Rn(r) {
  var e, t;
  try {
    const n = await d.chat.deleteChat(r);
    return n.data.success ? (console.log(`Chat #${r} deleted successfully`), !0) : (console.error("Failed to delete chat:", n.data.message), !1);
  } catch (n) {
    return console.error("Error deleting chat:", ((t = (e = n.response) == null ? void 0 : e.data) == null ? void 0 : t.message) || n.message), !1;
  }
}
export {
  ye as ActivityApiClient,
  st as ActivityModuleApiClient,
  tt as AdminApiClient,
  Tt as AgentCommunicationApiClient,
  nt as AgentsModuleApiClient,
  z as ApiError,
  lt as AppealModuleApiClient,
  ut as ApplicationModuleApiClient,
  fe as AssessmentsApiClient,
  ot as AssessmentsModuleApiClient,
  X as AuthApiClient,
  Je as AuthUserApiClient,
  c as BaseApiClient,
  jt as ChainApiClient,
  Ce as ChallengeApiClient,
  it as ChallengeModuleApiClient,
  ue as ChatApiClient,
  Wt as CodifyApiClient,
  Nt as CodifyDomainApiClient,
  St as CoinbaseModuleApiClient,
  et as CommunicationsApiClient,
  yt as ConnectorModuleApiClient,
  zt as DashboardProgramApiClient,
  Oe as DealWizardApiClient,
  dt as DisbursementModuleApiClient,
  Se as DomainApiClient,
  ft as ETLModuleApiClient,
  At as FacilitiesApiClient,
  It as FailApiClient,
  me as FollowUpsApiClient,
  at as FollowUpsModuleApiClient,
  bt as H5iApiClient,
  Ut as HitlApiClient,
  wt as HrmApiClient,
  _t as IntakeModuleApiClient,
  Gt as IntegrationsApiClient,
  Y as ItemsApiClient,
  pt as ItemsModuleApiClient,
  le as KPIApiClient,
  rt as KPIModuleApiClient,
  Pt as LmsApiClient,
  xt as MiscCoreApiClient,
  de as NotificationApiClient,
  he as NudgeApiClient,
  vt as NudgeModuleApiClient,
  $e as OrderApiClient,
  ct as OrderModuleApiClient,
  ve as PaymentApiClient,
  Ze as PersonalChainWizardApiClient,
  ce as ProgramsApiClient,
  Ye as ProgramsTeamApiClient,
  Lt as ProjectSettingsApiClient,
  pe as ProtocolApiClient,
  Xe as ProtocolDomainApiClient,
  gt as ReferralModuleApiClient,
  ht as ReportModuleApiClient,
  Rt as RlhfApiClient,
  Et as ScheduleApiClient,
  $t as ServicesModuleApiClient,
  ge as StripeApiClient,
  Dt as SubprojectAdminApiClient,
  we as SubprojectApiClient,
  Mt as SubprojectWizardApiClient,
  kt as SystemsApiClient,
  ie as TeamApiClient,
  Ke as TenancyApiClient,
  oe as UserApiClient,
  mt as VerificationModuleApiClient,
  Ue as WizardApiClient,
  Ft as WizardSetupApiClient,
  P as WizardStepExecutor,
  Ct as WorkflowModuleApiClient,
  pn as addItemToCollectionExample,
  Be as createApiClient,
  cn as createCollectionExample,
  Le as createFormErrors,
  be as createGovApiClient,
  x as createHmsApiClient,
  nn as createItemExample,
  Ie as createMfeApiClient,
  Re as createMktApiClient,
  Bt as dealTemplateToMermaid,
  Rn as deleteChatExample,
  sn as deleteItemExample,
  bn as deleteMessageExample,
  Sn as findUserToChatExample,
  Kt as getBookmarksExample,
  fn as getChatListExample,
  $n as getChatMessagesExample,
  Cn as getChatRoomExample,
  an as getCollectionsExample,
  gn as getCurrentUserExample,
  ze as getErrorMessage,
  Vt as getFeaturedProgramsExample,
  tn as getItemExample,
  en as getItemsExample,
  Yt as getProgramCategoriesExample,
  Ht as getProgramExample,
  Ot as getProgramFeedbackExample,
  qt as getRecentProgramsExample,
  Zt as getUserFeaturedProgramsExample,
  Xt as getUserProgramsExample,
  Ge as govApiClient,
  Fe as handleApiCall,
  d as hmsApiClient,
  un as loginExample,
  hn as logoutExample,
  qe as mfeApiClient,
  Ve as mktApiClient,
  M as processApiError,
  dn as registerExample,
  ln as removeItemFromCollectionExample,
  mn as requestPasswordResetExample,
  Qe as resolveInherited,
  on as searchItemsExample,
  Jt as searchProgramsExample,
  vn as sendMessageExample,
  yn as setNewPasswordExample,
  Qt as toggleBookmarkExample,
  rn as updateItemExample,
  R as wizardApiClient,
  He as wizardSteps
};
