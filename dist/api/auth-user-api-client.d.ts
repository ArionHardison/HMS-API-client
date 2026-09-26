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
import { BaseApiClient, type ApiResponse } from '../api-client';
import type { AdminLoginBySocialTokenResponse, AdminUpdateUserRequest, AdminUserData, BasicUserSummary, ChangeUserCoverRequest, ChangeUserPhotoRequest, CurrentUserData, DashboardAuthBySocialTokenRequest, DashboardJoinByTokenRequest, DashboardJoinRequest, DashboardLoginRequest, DashboardLoginResponse, DeleteRoleRequest, DeleteUserRequest, FinishCodifyRegistrationRequest, FinishSocialRegistrationRequest, GetCodeRequest, HandleUserTagRequest, InvitedUserSummary, NewPasswordRequest, PublicUserProfile, ResetPasswordRequest, RestrictUserRequest, RestrictedUserSummary, RoleRecord, SetRoleRequest, SetTimezoneRequest, SignInRequest, SignInResponse, SignUpRequest, UpdateBillingInfoRequest, UpdatePasswordRequest, UpdatePhoneRequest, UpdatePricingRequest, UpdateUserRequest, UsersChangeCoverRequest, UsersChangePhotoRequest } from '../types/auth-user';
export type { AdminLoginBySocialTokenResponse, AdminUpdateUserRequest, AdminUserData, BasicUserSummary, ChangeUserCoverRequest, ChangeUserPhotoRequest, CurrentUserData, DashboardAuthBySocialTokenRequest, DashboardJoinByTokenRequest, DashboardJoinRequest, DashboardLoginRequest, DashboardLoginResponse, DeleteRoleRequest, DeleteUserRequest, FinishCodifyRegistrationRequest, FinishSocialRegistrationRequest, GetCodeRequest, HandleUserTagRequest, InvitedUserSummary, NewPasswordRequest, PublicUserProfile, ResetPasswordRequest, RestrictUserRequest, RestrictedUserSummary, RoleRecord, SetRoleRequest, SetTimezoneRequest, SignInRequest, SignInResponse, SignUpRequest, UpdateBillingInfoRequest, UpdatePasswordRequest, UpdatePhoneRequest, UpdatePricingRequest, UpdateUserRequest, UsersChangeCoverRequest, UsersChangePhotoRequest, };
/**
 * `wrapper: "paginated"` Laravel envelope shape — the SDK does not yet
 * normalize pagination across slices, so we leave `meta` / `links` open.
 */
export interface PaginatedPayload<T> {
    items: T[];
    meta?: unknown;
    links?: unknown;
}
/** Empty success payload (`wrapper: "data"`, `shape: {}`) — endpoints that just acknowledge. */
export interface EmptyOk {
    [key: string]: unknown;
}
export declare class AuthUserApiClient extends BaseApiClient {
    /** POST /api/dashboard/auth-by-social-token */
    dashboardAuthBySocialToken(body: DashboardAuthBySocialTokenRequest): Promise<ApiResponse<AdminLoginBySocialTokenResponse>>;
    /** GET /api/dashboard/auth/{token} */
    dashboardAuthByToken(token: string): Promise<ApiResponse<unknown>>;
    /** POST /api/dashboard/join */
    dashboardJoin(body: DashboardJoinRequest): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/dashboard/join/{token} */
    dashboardJoinByToken(token: string): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/dashboard/login */
    dashboardLogin(body: DashboardLoginRequest): Promise<ApiResponse<DashboardLoginResponse>>;
    /** GET /api/logout (auth=api — Bearer required) */
    logout(): Promise<ApiResponse<EmptyOk>>;
    /**
     * POST /api/public/auth/finish-social-registration
     * NOTE: spec auth is `api` despite the `/public/` prefix. Bearer required.
     */
    finishSocialRegistration(body: FinishSocialRegistrationRequest): Promise<ApiResponse<SignInResponse>>;
    /** POST /api/public/auth/new-password */
    newPassword(body: NewPasswordRequest): Promise<ApiResponse<EmptyOk>>;
    /**
     * GET /api/public/auth/protocol-chain/get-user-by-invite/{token}/{source?}
     * `source` is optional in the path.
     */
    getUserByInvite(token: string, source?: string): Promise<ApiResponse<InvitedUserSummary>>;
    /** POST /api/public/auth/reset */
    resetPassword(body: ResetPasswordRequest): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/public/auth/sign-in */
    signIn(body: SignInRequest): Promise<ApiResponse<SignInResponse>>;
    /**
     * POST /api/public/auth/sign-up
     * NOTE: spec auth is `api` (Bearer required) — register-while-authenticated
     * flow. Apparently load-bearing for `team` / `tenant` invites.
     */
    signUp(body: SignUpRequest): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/user/change-cover/{user} */
    userChangeCover(user: number, body: ChangeUserCoverRequest): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/user/change-photo/{user} */
    userChangePhoto(user: number, body: ChangeUserPhotoRequest): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/user/creator-dashboard */
    getCreatorDashboard(): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/user/creator-stats */
    getCreatorStats(): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/user/finish-codify-registration */
    finishCodifyRegistration(body: FinishCodifyRegistrationRequest): Promise<ApiResponse<CurrentUserData>>;
    /** GET /api/user/get-data */
    getUserData(): Promise<ApiResponse<CurrentUserData>>;
    /** GET /api/user/get-wallet */
    getWallet(): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/user/set-timezone */
    setTimezone(body: SetTimezoneRequest): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/user/{user} (admin) */
    adminShowUser(user: number): Promise<ApiResponse<AdminUserData>>;
    /** PUT /api/user/{user} (admin) */
    adminUpdateUser(user: number, body: AdminUpdateUserRequest): Promise<ApiResponse<AdminUserData>>;
    /** DELETE /api/user/{user} (admin) */
    adminDestroyUser(user: number): Promise<ApiResponse<unknown>>;
    /** GET /api/users/assigned-tags/{category} */
    getAssignedTags(category: string | number): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/users/become-creator/{user} */
    becomeCreator(user: number): Promise<ApiResponse<unknown>>;
    /** GET /api/users/can-creator/{user} */
    canCreator(user: number): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/users/change-cover/{user} */
    usersChangeCover(user: number, body: UsersChangeCoverRequest): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/users/change-photo/{user} */
    usersChangePhoto(user: number, body: UsersChangePhotoRequest): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/users/delete-role */
    deleteRole(body: DeleteRoleRequest): Promise<ApiResponse<RoleRecord>>;
    /** DELETE /api/users/delete/{user} — body carries the password confirmation. */
    deleteUser(user: number, body: DeleteUserRequest): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/users/find/{searchQuery} */
    findUsers(searchQuery: string): Promise<ApiResponse<BasicUserSummary>>;
    /** GET /api/users/get-available-roles */
    getAvailableRoles(): Promise<ApiResponse<RoleRecord>>;
    /** POST /api/users/get-code */
    getCode(body: GetCodeRequest): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/users/get-pricing */
    getPricing(): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/users/get-restricted-users (paginated) */
    getRestrictedUsers(): Promise<ApiResponse<PaginatedPayload<RestrictedUserSummary>>>;
    /** GET /api/users/get-role-category/{category} */
    getRoleCategory(category: string | number): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/users/get-roles */
    getRoles(): Promise<ApiResponse<RoleRecord>>;
    /** GET /api/users/get-sessions */
    getSessions(): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/users/handle-user-tag */
    handleUserTag(body: HandleUserTagRequest): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/users/id/{user} */
    getUserById(user: number): Promise<ApiResponse<BasicUserSummary>>;
    /** GET /api/users/name/{username} */
    getUserByName(username: string): Promise<ApiResponse<PublicUserProfile>>;
    /** GET /api/users/referral */
    getReferral(): Promise<ApiResponse<EmptyOk>>;
    /** GET /api/users/referral/transactions (paginated) */
    getReferralTransactions(): Promise<ApiResponse<PaginatedPayload<EmptyOk>>>;
    /** GET /api/users/remove-restriction/{restriction} (paginated) */
    removeRestriction(restriction: number): Promise<ApiResponse<PaginatedPayload<RestrictedUserSummary>>>;
    /** POST /api/users/restrict/{user} */
    restrictUser(user: number, body?: RestrictUserRequest): Promise<ApiResponse<RestrictedUserSummary>>;
    /** POST /api/users/set-role */
    setRole(body: SetRoleRequest): Promise<ApiResponse<RoleRecord>>;
    /** PATCH /api/users/update-billing-info */
    updateBillingInfo(body: UpdateBillingInfoRequest): Promise<ApiResponse<EmptyOk>>;
    /** PATCH /api/users/update-password/{user} */
    updatePassword(user: number, body: UpdatePasswordRequest): Promise<ApiResponse<EmptyOk>>;
    /** PATCH /api/users/update-phone */
    updatePhone(body: UpdatePhoneRequest): Promise<ApiResponse<EmptyOk>>;
    /** POST /api/users/update-pricing */
    updatePricing(body: UpdatePricingRequest): Promise<ApiResponse<EmptyOk>>;
    /** PATCH /api/users/update/{user} */
    updateUser(user: number, body: UpdateUserRequest): Promise<ApiResponse<EmptyOk>>;
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
    getAccessibleSubprojects(): Promise<ApiResponse<EmptyOk[]>>;
}
//# sourceMappingURL=auth-user-api-client.d.ts.map