/**
 * ProgramsTeamApiClient — covers the Programs + Program Sale + Team + Role +
 * Project-Role + Members slice of the P2X API. Source of truth for shapes is
 * `sdk/spec/endpoints.json`.
 *
 * The class extends `BaseApiClient`, which already handles:
 *   - Bearer token injection (skipped per call via `{ auth: false }`)
 *   - `X-Domain` header from `getDomain`
 *   - PUT/PATCH → POST + `?_method=PUT|PATCH` (Laravel)
 *   - FormData switching when payload contains a `File`/`Blob`
 *   - 401 / 422 → callback + `ApiError`
 *
 * Wrapper handling: nearly every slice endpoint emits `wrapper: "data"` (single
 * Resource), so the SDK consumes the parsed envelope (`{ success, message,
 * data }`) and the typed payload sits in `.data`. The single
 * `wrapper: "paginated"` endpoint (`/api/program/get-bookmarks`) surfaces the
 * envelope with `.data` carrying `items[]` + pagination — typed as
 * `PaginatedPayload<T>` (re-exported below).
 *
 * The slice spans six top-level prefixes:
 *
 *   - `/api/program-sale/*`       — purchase + listing flow
 *   - `/api/program/*`            — program CRUD, history, run-personal, publish
 *   - `/api/project-role/*`       — Subproject role CRUD (admin guard)
 *   - `/api/role` + `/api/roles/*`— User role CRUD
 *   - `/api/team/*`               — Team membership, invites, role mgmt
 *
 * 60 endpoints total (see `/tmp/programs-team-slice.json` for the filtered
 * manifest used during TDD).
 */
import { BaseApiClient } from '../api-client';
export class ProgramsTeamApiClient extends BaseApiClient {
    // ===========================================================================
    // /api/program-sale/* — purchase + listing flow
    // ===========================================================================
    /** POST /api/program-sale/buy */
    async buyProgram(body) {
        return this.post('/api/program-sale/buy', body);
    }
    /** POST /api/program-sale/list (auth=public) */
    async listProgramSale(body) {
        return this.post('/api/program-sale/list', body, {
            auth: false,
        });
    }
    /** GET /api/program-sale/list-by-author/{username} (auth=public) */
    async listProgramSaleByAuthor(username) {
        return this.get(`/api/program-sale/list-by-author/${encodeURIComponent(username)}`, undefined, { auth: false });
    }
    /** GET /api/program-sale/list/random/{username}/{ignore} (auth=public) */
    async listProgramSaleRandom(username, ignore) {
        return this.get(`/api/program-sale/list/random/${encodeURIComponent(username)}/${encodeURIComponent(String(ignore))}`, undefined, { auth: false });
    }
    /** GET /api/program-sale/salary/{program} */
    async getProgramSaleSalary(program) {
        return this.get(`/api/program-sale/salary/${program}`);
    }
    /** GET /api/program-sale/tags (auth=public) */
    async getProgramSaleTags() {
        return this.get('/api/program-sale/tags', undefined, {
            auth: false,
        });
    }
    /** GET /api/program-sale/{program_sale} */
    async showProgramSale(programSale) {
        return this.get(`/api/program-sale/${programSale}`);
    }
    /** PUT /api/program-sale/{program_sale} */
    async updateProgramSale(programSale, body) {
        return this.put(`/api/program-sale/${programSale}`, body);
    }
    /** DELETE /api/program-sale/{program_sale} */
    async destroyProgramSale(programSale) {
        return this.delete(`/api/program-sale/${programSale}`);
    }
    // ===========================================================================
    // /api/program/* — program CRUD, history, run-personal, publish
    // ===========================================================================
    /** GET /api/program/all */
    async getAllPrograms() {
        return this.get('/api/program/all');
    }
    /** GET /api/program/chains/{program}/{user} */
    async getProgramChains(program, user) {
        return this.get(`/api/program/chains/${program}/${user}`);
    }
    /** POST /api/program/detach-protocol */
    async detachProtocol(body) {
        return this.post('/api/program/detach-protocol', body);
    }
    /** GET /api/program/get-bookmarks (paginated) */
    async getProgramBookmarks() {
        return this.get('/api/program/get-bookmarks');
    }
    /** GET /api/program/history */
    async getProgramHistory() {
        return this.get('/api/program/history');
    }
    /** GET /api/program/history/{chain} */
    async getProgramHistoryByChain(chain) {
        return this.get(`/api/program/history/${chain}`);
    }
    /** GET /api/program/last-purchases */
    async getLastPurchases() {
        return this.get('/api/program/last-purchases');
    }
    /** POST /api/program/program-check */
    async programCheck(body) {
        return this.post('/api/program/program-check', body);
    }
    /**
     * GET /api/program/program-data/{program?}
     * `program` is optional — when omitted the trailing path segment is dropped.
     */
    async getProgramData(program) {
        const tail = program === undefined || program === null ? '' : `/${program}`;
        return this.get(`/api/program/program-data${tail}`);
    }
    /** POST /api/program/program/add-tag */
    async addProgramTag(body) {
        return this.post('/api/program/program/add-tag', body);
    }
    /** DELETE /api/program/program/delete-tag/{program}/{tag} */
    async deleteProgramTag(program, tag) {
        return this.delete(`/api/program/program/delete-tag/${program}/${encodeURIComponent(String(tag))}`);
    }
    /** GET /api/program/publications/{program} */
    async getProgramPublications(program) {
        return this.get(`/api/program/publications/${program}`);
    }
    /** POST /api/program/publish */
    async publishProgram(body) {
        return this.post('/api/program/publish', body);
    }
    /** POST /api/program/publish/cancel */
    async cancelPublishProgram(body) {
        return this.post('/api/program/publish/cancel', body);
    }
    /** POST /api/program/run-personal */
    async runPersonalProgram(body) {
        return this.post('/api/program/run-personal', body);
    }
    /** POST /api/program/search */
    async searchPrograms(body) {
        return this.post('/api/program/search', body);
    }
    /** GET /api/program/show/{program} */
    async showProgram(program) {
        return this.get(`/api/program/show/${program}`);
    }
    /** GET /api/program/simulation/{program} */
    async simulateProgram(program) {
        return this.get(`/api/program/simulation/${program}`);
    }
    /** POST /api/program/toggle-bookmark */
    async toggleProgramBookmark(body) {
        return this.post('/api/program/toggle-bookmark', body);
    }
    /**
     * PUT /api/program/update-program/{program}
     *
     * Spec leaves `request.shape` empty (the FormRequest applies conditional
     * step-based rules), so the body type is open. Multipart kicks in
     * automatically when any value is a `File`/`Blob` (e.g. `program_image`).
     */
    async updateProgram(program, body) {
        return this.put(`/api/program/update-program/${program}`, body);
    }
    /** GET /api/program/users-additional-steps/{program}/{protocol} */
    async getProgramUsersAdditionalSteps(program, protocol) {
        return this.get(`/api/program/users-additional-steps/${program}/${protocol}`);
    }
    /** GET /api/program/users-steps/{program} */
    async getProgramUsersSteps(program) {
        return this.get(`/api/program/users-steps/${program}`);
    }
    /** GET /api/program/users/{program} */
    async getProgramUsers(program) {
        return this.get(`/api/program/users/${program}`);
    }
    /** POST /api/program/validate-additional-protocol */
    async validateAdditionalProtocol(body) {
        return this.post('/api/program/validate-additional-protocol', body);
    }
    // ===========================================================================
    // /api/project-role/* — Subproject role CRUD (admin guard)
    // ===========================================================================
    /** GET /api/project-role/permissions */
    async getProjectRolePermissions() {
        return this.get('/api/project-role/permissions');
    }
    /** GET /api/project-role/{project_role} */
    async showProjectRole(projectRole) {
        return this.get(`/api/project-role/${projectRole}`);
    }
    /** PUT /api/project-role/{project_role} */
    async updateProjectRole(projectRole, body) {
        return this.put(`/api/project-role/${projectRole}`, body);
    }
    /** DELETE /api/project-role/{project_role} */
    async destroyProjectRole(projectRole) {
        return this.delete(`/api/project-role/${projectRole}`);
    }
    // ===========================================================================
    // /api/role + /api/roles/* — User role CRUD
    // ===========================================================================
    /** GET /api/role */
    async listRoles() {
        return this.get('/api/role');
    }
    /**
     * POST /api/role — spec leaves request/response shape empty.
     * Body kept open so callers can pass a name + permission map.
     */
    async createRole(body) {
        return this.post('/api/role', body);
    }
    /** GET /api/role/{role} */
    async showRole(role) {
        return this.get(`/api/role/${role}`);
    }
    /** PUT /api/role/{role} */
    async updateRole(role, body) {
        return this.put(`/api/role/${role}`, body);
    }
    /** DELETE /api/role/{role} */
    async destroyRole(role) {
        return this.delete(`/api/role/${role}`);
    }
    /** GET /api/roles/all */
    async getAllRoles() {
        return this.get('/api/roles/all');
    }
    // ===========================================================================
    // /api/team/* — Team membership, invites, role mgmt, network search
    // ===========================================================================
    /** POST /api/team/accept */
    async acceptTeamInvite(body) {
        return this.post('/api/team/accept', body);
    }
    /** GET /api/team/accept-invite/{token} */
    async acceptTeamInviteByToken(token) {
        return this.get(`/api/team/accept-invite/${encodeURIComponent(token)}`);
    }
    /** GET /api/team/all */
    async getAllTeamMembers() {
        return this.get('/api/team/all');
    }
    /** POST /api/team/handle-role */
    async handleTeamRole(body) {
        return this.post('/api/team/handle-role', body);
    }
    /** POST /api/team/invite */
    async inviteTeamMember(body) {
        return this.post('/api/team/invite', body);
    }
    /** POST /api/team/leave */
    async leaveTeam(body) {
        return this.post('/api/team/leave', body);
    }
    /** GET /api/team/list/{status} */
    async listTeam(status) {
        return this.get(`/api/team/list/${encodeURIComponent(String(status))}`);
    }
    /** GET /api/team/member/{status} */
    async listTeamInvites(status) {
        return this.get(`/api/team/member/${encodeURIComponent(String(status))}`);
    }
    /** POST /api/team/network-invite */
    async inviteNetworkMember(body) {
        return this.post('/api/team/network-invite', body);
    }
    /** POST /api/team/network-invite-potential */
    async inviteNetworkPotentialMember(body) {
        return this.post('/api/team/network-invite-potential', body);
    }
    /** POST /api/team/network-search */
    async searchNetwork(body) {
        return this.post('/api/team/network-search', body);
    }
    /** POST /api/team/reject */
    async rejectTeamInvite(body) {
        return this.post('/api/team/reject', body);
    }
    /** POST /api/team/remove */
    async removeTeamMember(body) {
        return this.post('/api/team/remove', body);
    }
    /** POST /api/team/remove-potential */
    async removePotentialTeamMember(body) {
        return this.post('/api/team/remove-potential', body);
    }
    /** GET /api/team/roles */
    async getTeamRoles() {
        return this.get('/api/team/roles');
    }
    /** POST /api/team/search-members */
    async searchTeamMembers(body) {
        return this.post('/api/team/search-members', body);
    }
    /** POST /api/team/search-users */
    async searchTeamUsers(body) {
        return this.post('/api/team/search-users', body);
    }
}
//# sourceMappingURL=programs-team-api-client.js.map