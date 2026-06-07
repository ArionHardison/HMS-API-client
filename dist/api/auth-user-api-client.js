"use strict";
/**
 * AuthUserApiClient — covers every endpoint in the Auth + User Profile slice
 * of the P2X API. Source of truth for shapes is `sdk/spec/endpoints.json`.
 *
 * The class extends `BaseApiClient`, which already handles:
 *   - Bearer token injection (skipped per call via `{ auth: false }`)
 *   - `X-Domain` header from `getDomain`
 *   - PUT/PATCH → POST + `?_method=PUT|PATCH` (Laravel)
 *   - FormData switching when payload contains a `File`/`Blob`
 *   - 401 / 422 → callback + `ApiError`
 *
 * All methods are fully typed. Wrapper handling: most slice endpoints emit
 * `wrapper: "data"` (single Resource), so the SDK consumes the parsed envelope
 * (`{ success, message, data }`) and the typed payload sits in `.data`.
 * `wrapper: "paginated"` endpoints surface the same envelope but the `.data`
 * payload itself contains an `items[]` + pagination — typed as `{ items: T[];
 * meta?: unknown; links?: unknown }` to keep this slice independent of the
 * pagination DTOs that other slices may flesh out.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUserApiClient = void 0;
const api_client_1 = require("../api-client");
class AuthUserApiClient extends api_client_1.BaseApiClient {
    // ---------------------------------------------------------------------------
    // Public auth (no Bearer token required — uses { auth: false })
    // ---------------------------------------------------------------------------
    /** POST /api/dashboard/auth-by-social-token */
    async dashboardAuthBySocialToken(body) {
        return this.post('/api/dashboard/auth-by-social-token', body, { auth: false });
    }
    /** GET /api/dashboard/auth/{token} */
    async dashboardAuthByToken(token) {
        return this.get(`/api/dashboard/auth/${encodeURIComponent(token)}`, undefined, { auth: false });
    }
    /** POST /api/dashboard/join */
    async dashboardJoin(body) {
        return this.post('/api/dashboard/join', body, { auth: false });
    }
    /** GET /api/dashboard/join/{token} */
    async dashboardJoinByToken(token) {
        return this.get(`/api/dashboard/join/${encodeURIComponent(token)}`, undefined, { auth: false });
    }
    /** POST /api/dashboard/login */
    async dashboardLogin(body) {
        return this.post('/api/dashboard/login', body, {
            auth: false,
        });
    }
    /** GET /api/logout (auth=api — Bearer required) */
    async logout() {
        return this.get('/api/logout');
    }
    /**
     * POST /api/public/auth/finish-social-registration
     * NOTE: spec auth is `api` despite the `/public/` prefix. Bearer required.
     */
    async finishSocialRegistration(body) {
        return this.post('/api/public/auth/finish-social-registration', body);
    }
    /** POST /api/public/auth/new-password */
    async newPassword(body) {
        return this.post('/api/public/auth/new-password', body, {
            auth: false,
        });
    }
    /**
     * GET /api/public/auth/protocol-chain/get-user-by-invite/{token}/{source?}
     * `source` is optional in the path.
     */
    async getUserByInvite(token, source) {
        const tail = source ? `/${encodeURIComponent(source)}` : '';
        return this.get(`/api/public/auth/protocol-chain/get-user-by-invite/${encodeURIComponent(token)}${tail}`, undefined, { auth: false });
    }
    /** POST /api/public/auth/reset */
    async resetPassword(body) {
        return this.post('/api/public/auth/reset', body, { auth: false });
    }
    /** POST /api/public/auth/sign-in */
    async signIn(body) {
        return this.post('/api/public/auth/sign-in', body, {
            auth: false,
        });
    }
    /**
     * POST /api/public/auth/sign-up
     * NOTE: spec auth is `api` (Bearer required) — register-while-authenticated
     * flow. Apparently load-bearing for `team` / `tenant` invites.
     */
    async signUp(body) {
        return this.post('/api/public/auth/sign-up', body);
    }
    // ---------------------------------------------------------------------------
    // /api/user/* (singular namespace)
    // ---------------------------------------------------------------------------
    /** POST /api/user/change-cover/{user} */
    async userChangeCover(user, body) {
        return this.post(`/api/user/change-cover/${user}`, body);
    }
    /** POST /api/user/change-photo/{user} */
    async userChangePhoto(user, body) {
        return this.post(`/api/user/change-photo/${user}`, body);
    }
    /** GET /api/user/creator-dashboard */
    async getCreatorDashboard() {
        return this.get('/api/user/creator-dashboard');
    }
    /** GET /api/user/creator-stats */
    async getCreatorStats() {
        return this.get('/api/user/creator-stats');
    }
    /** POST /api/user/finish-codify-registration */
    async finishCodifyRegistration(body) {
        return this.post('/api/user/finish-codify-registration', body);
    }
    /** GET /api/user/get-data */
    async getUserData() {
        return this.get('/api/user/get-data');
    }
    /** GET /api/user/get-wallet */
    async getWallet() {
        return this.get('/api/user/get-wallet');
    }
    /** POST /api/user/set-timezone */
    async setTimezone(body) {
        return this.post('/api/user/set-timezone', body);
    }
    /** GET /api/user/{user} (admin) */
    async adminShowUser(user) {
        return this.get(`/api/user/${user}`);
    }
    /** PUT /api/user/{user} (admin) */
    async adminUpdateUser(user, body) {
        return this.put(`/api/user/${user}`, body);
    }
    /** DELETE /api/user/{user} (admin) */
    async adminDestroyUser(user) {
        return this.delete(`/api/user/${user}`);
    }
    // ---------------------------------------------------------------------------
    // /api/users/* (plural namespace)
    // ---------------------------------------------------------------------------
    /** GET /api/users/assigned-tags/{category} */
    async getAssignedTags(category) {
        return this.get(`/api/users/assigned-tags/${category}`);
    }
    /** POST /api/users/become-creator/{user} */
    async becomeCreator(user) {
        return this.post(`/api/users/become-creator/${user}`);
    }
    /** GET /api/users/can-creator/{user} */
    async canCreator(user) {
        return this.get(`/api/users/can-creator/${user}`);
    }
    /** POST /api/users/change-cover/{user} */
    async usersChangeCover(user, body) {
        return this.post(`/api/users/change-cover/${user}`, body);
    }
    /** POST /api/users/change-photo/{user} */
    async usersChangePhoto(user, body) {
        return this.post(`/api/users/change-photo/${user}`, body);
    }
    /** POST /api/users/delete-role */
    async deleteRole(body) {
        return this.post('/api/users/delete-role', body);
    }
    /** DELETE /api/users/delete/{user} — body carries the password confirmation. */
    async deleteUser(user, body) {
        // BaseApiClient's `.delete()` doesn't accept a body — drop to `request`.
        return this.request(`/api/users/delete/${user}`, { method: 'DELETE', body: JSON.stringify(body) });
    }
    /** GET /api/users/find/{searchQuery} */
    async findUsers(searchQuery) {
        return this.get(`/api/users/find/${encodeURIComponent(searchQuery)}`, undefined, { auth: false });
    }
    /** GET /api/users/get-available-roles */
    async getAvailableRoles() {
        return this.get('/api/users/get-available-roles');
    }
    /** POST /api/users/get-code */
    async getCode(body) {
        return this.post('/api/users/get-code', body);
    }
    /** GET /api/users/get-pricing */
    async getPricing() {
        return this.get('/api/users/get-pricing');
    }
    /** GET /api/users/get-restricted-users (paginated) */
    async getRestrictedUsers() {
        return this.get('/api/users/get-restricted-users');
    }
    /** GET /api/users/get-role-category/{category} */
    async getRoleCategory(category) {
        return this.get(`/api/users/get-role-category/${category}`);
    }
    /** GET /api/users/get-roles */
    async getRoles() {
        return this.get('/api/users/get-roles');
    }
    /** GET /api/users/get-sessions */
    async getSessions() {
        return this.get('/api/users/get-sessions');
    }
    /** POST /api/users/handle-user-tag */
    async handleUserTag(body) {
        return this.post('/api/users/handle-user-tag', body);
    }
    /** GET /api/users/id/{user} */
    async getUserById(user) {
        return this.get(`/api/users/id/${user}`, undefined, { auth: false });
    }
    /** GET /api/users/name/{username} */
    async getUserByName(username) {
        return this.get(`/api/users/name/${encodeURIComponent(username)}`, undefined, { auth: false });
    }
    /** GET /api/users/referral */
    async getReferral() {
        return this.get('/api/users/referral');
    }
    /** GET /api/users/referral/transactions (paginated) */
    async getReferralTransactions() {
        return this.get('/api/users/referral/transactions');
    }
    /** GET /api/users/remove-restriction/{restriction} (paginated) */
    async removeRestriction(restriction) {
        return this.get(`/api/users/remove-restriction/${restriction}`);
    }
    /** POST /api/users/restrict/{user} */
    async restrictUser(user, body = {}) {
        return this.post(`/api/users/restrict/${user}`, body);
    }
    /** POST /api/users/set-role */
    async setRole(body) {
        return this.post('/api/users/set-role', body);
    }
    /** PATCH /api/users/update-billing-info */
    async updateBillingInfo(body) {
        return this.patch('/api/users/update-billing-info', body);
    }
    /** PATCH /api/users/update-password/{user} */
    async updatePassword(user, body) {
        return this.patch(`/api/users/update-password/${user}`, body);
    }
    /** PATCH /api/users/update-phone */
    async updatePhone(body) {
        return this.patch('/api/users/update-phone', body);
    }
    /** POST /api/users/update-pricing */
    async updatePricing(body) {
        return this.post('/api/users/update-pricing', body);
    }
    /** PATCH /api/users/update/{user} */
    async updateUser(user, body) {
        return this.patch(`/api/users/update/${user}`, body);
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
        return this.get('/api/me/accessible-subprojects');
    }
}
exports.AuthUserApiClient = AuthUserApiClient;
//# sourceMappingURL=auth-user-api-client.js.map