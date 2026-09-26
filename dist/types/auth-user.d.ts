/**
 * Auth + User Profile slice — request / response types.
 *
 * Source of truth: `sdk/spec/endpoints.json`. Each interface mirrors the
 * `request.shape` or `response.shape` of a single endpoint. `unknown` is used
 * verbatim for fields the manifest could not concretize (Laravel Resource
 * `parent::toArray($request)` calls, etc.) — narrow them at the call site.
 *
 * Structural interfaces only — no branded type aliases. (See top-level
 * CLAUDE.md guidance.)
 */
/** Shape returned by Laravel Resources when there is no extra wrapping. */
export interface BasicUserSummary {
    id: number;
    username: unknown;
    full_name: unknown;
    profile_picture: unknown;
    country: unknown;
}
/** Shape returned for a restricted user list entry. */
export interface RestrictedUserSummary {
    id: number;
    user_id: number;
    username: unknown;
    full_name: unknown;
    profile_picture: unknown;
}
/** `{name, id}` role-shaped record. */
export interface RoleRecord {
    name: unknown;
    id: number;
}
/**
 * The "current user" envelope returned by `/api/user/get-data` and
 * `/api/user/finish-codify-registration`. Shapes are identical because both
 * surface the same `UserCurrentResource`.
 */
export interface CurrentUserData {
    username: unknown;
    full_name: unknown;
    email: unknown;
    phone: unknown;
    id: number;
    profession: unknown;
    email_verified_at: string;
    gender: unknown;
    creator: unknown;
    birth_date: unknown;
    address: unknown;
    country: unknown;
    state: unknown;
    city: unknown;
    services_pending: unknown;
    timezone: unknown;
    unreadMessages: unknown;
    unreadNotifications: unknown;
    assignedTasks: unknown;
    is_temporary: boolean;
    agent: unknown;
    zip: unknown;
    language: unknown;
    company: unknown;
    profile_picture: unknown;
    profile_cover: unknown;
    payment_methods: unknown;
    roles: unknown;
    permissions: unknown;
}
/** Shape of the post-sign-in admin login response. */
export interface AdminLoginBySocialTokenResponse {
    accessToken: unknown;
    permissions: unknown;
    userData: unknown;
}
/** Shape returned by `/api/dashboard/login`. */
export interface DashboardLoginResponse {
    accessToken: unknown;
    id: number;
    tenant_id: number;
    domain: unknown;
    roles: unknown;
    permissions: unknown;
}
/** Shape returned by sign-in / finish-social-registration. */
export interface SignInResponse {
    accessToken: unknown;
    id: number;
    roles: unknown;
    permissions: unknown;
    full_name: unknown;
    username: unknown;
    email_verified_at: string;
    force_password_reset: unknown;
}
/** Invitation lookup response shape. */
export interface InvitedUserSummary {
    email: unknown;
    full_name: unknown;
    username: unknown;
}
/** Admin "show" / "update" user response. */
export interface AdminUserData {
    id: number;
    created_at: string;
    email: unknown;
    username: unknown;
    full_name: unknown;
    phone: unknown;
    profile_picture: unknown;
    profession: unknown;
    description: unknown;
    country: unknown;
    country_id: number;
    country_name: unknown;
    subproject_id: number;
    subproject_name: unknown;
    last_activity: unknown;
    is_online: boolean;
    roles: unknown;
    type: unknown;
}
/** Public profile by username response shape. */
export interface PublicUserProfile {
    id: number;
    username: unknown;
    full_name: unknown;
    about: unknown;
    profile_picture: unknown;
    description: unknown;
    title: unknown;
    location: unknown;
    party: unknown;
    roles: unknown;
    tags: unknown;
    category: unknown;
    sub_category: unknown;
    name: unknown;
    subscribed: unknown;
    ends_at: string;
    subscription_price: unknown;
    subscription_id: number;
}
export interface DashboardAuthBySocialTokenRequest {
    driver: string;
    social: string;
}
export interface DashboardJoinRequest {
    secret_token: string;
    password: string;
    password_confirmation: string;
}
export interface DashboardJoinByTokenRequest {
    token: string;
}
export interface DashboardLoginRequest {
    login: string;
    password: string;
}
export interface FinishSocialRegistrationRequest {
    timezone: string;
    full_name: string;
    email: string;
    referral?: unknown;
    team?: string;
    sms_contest: boolean;
    agreed: boolean;
    social: number;
    driver: string;
}
export interface NewPasswordRequest {
    token: string;
    email: string;
    password: string;
    confirm_password: string;
}
export interface ResetPasswordRequest {
    email?: unknown;
}
export interface SignInRequest {
    login: string;
    password: string;
}
export interface SignUpRequest {
    timezone: string;
    full_name: string;
    country_id?: unknown;
    login: string;
    email?: unknown;
    phone?: number;
    password: string;
    sms_contest: boolean;
    agreed: boolean;
    referral?: unknown;
    token?: string;
    tenant?: string;
    team?: string;
}
/**
 * Body for the singular `/api/user/change-cover/{user}` and
 * `/api/user/change-photo/{user}` endpoints. The manifest reports `user` as
 * a body field even though it's also a path param — kept here for parity.
 */
export interface ChangeUserCoverRequest {
    profile_cover?: File | Blob;
    user: number;
}
export interface ChangeUserPhotoRequest {
    profile_picture?: File | Blob;
    user: number;
}
export interface FinishCodifyRegistrationRequest {
    timezone: string;
    full_name: string;
    country_id?: unknown;
    login: string;
    email?: unknown;
    phone?: number;
    sms_contest: boolean;
    agreed: boolean;
    password: string;
}
export interface SetTimezoneRequest {
    timezone: string;
}
export interface AdminUpdateUserRequest {
    full_name: string;
    email?: unknown;
    username?: unknown;
    phone?: number;
    profession?: string;
    description?: string;
    subproject_id?: unknown;
    country_id?: unknown;
    roles?: unknown[];
}
/** Plural-namespace versions of the cover / photo endpoints. */
export interface UsersChangeCoverRequest {
    profile_cover?: File | Blob;
    user: number;
}
export interface UsersChangePhotoRequest {
    profile_picture?: File | Blob;
    user: number;
}
export interface DeleteRoleRequest {
    role: string;
}
export interface DeleteUserRequest {
    password: string;
}
export interface GetCodeRequest {
    phone: string;
}
export interface HandleUserTagRequest {
    id?: unknown;
    sub_category_id?: unknown;
    assign: boolean;
}
export interface RestrictUserRequest {
    user_id?: unknown;
}
export interface SetRoleRequest {
    role: string;
}
export interface UpdateBillingInfoRequest {
    address: string;
    city: string;
    company: string;
    state: string;
    zip?: unknown;
}
export interface UpdatePasswordRequest {
    password: string;
}
export interface UpdatePhoneRequest {
    phone: string;
    code: number;
}
export interface UpdatePricingRequest {
    price: number;
    module: string;
}
export interface UpdateUserRequest {
    username: string;
    full_name: string;
    about?: string;
    birth_date: string;
    gender: number;
    country_id?: unknown;
}
//# sourceMappingURL=auth-user.d.ts.map