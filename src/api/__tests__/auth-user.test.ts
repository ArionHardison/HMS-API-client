/**
 * AuthUserApiClient — endpoint-by-endpoint contract tests.
 *
 * Each endpoint in the Auth + User Profile slice (51 routes) gets one or more
 * `it()` blocks asserting:
 *   - URL (after BaseURL + path-param interpolation)
 *   - HTTP verb on the wire (PUT/PATCH → POST + `?_method=PUT|PATCH`)
 *   - Authorization header presence per spec `auth` (public ⇒ no Bearer;
 *     api/sanctum/admin ⇒ Bearer required)
 *   - `X-Domain` header always present
 *   - Request body matches the spec's `request.shape`
 *   - Response decoding pulls the typed payload out of the envelope
 *     (`wrapper: "data"` ⇒ caller reads `.data`; `wrapper: "paginated"` ⇒
 *     `.data.items[]`)
 *   - File-upload bodies serialize as `multipart/form-data`
 *
 * MSW-based; see `src/__tests__/contract/base-client.contract.test.ts` for
 * the canonical style.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../__tests__/msw/server';
import {
  expectAuthHeader,
  expectDomainHeader,
  expectMethodOverride,
  expectNoAuthHeader,
  mockEndpoint,
} from '../../__tests__/helpers/factories';
import { AuthUserApiClient } from '../auth-user-api-client';

const BASE = 'https://api.test.local';
const TOKEN = 'tok-123';
const DOMAIN = 'phm.ai';

function makeClient(): AuthUserApiClient {
  return new AuthUserApiClient({
    baseURL: BASE,
    getToken: () => TOKEN,
    getDomain: () => DOMAIN,
  });
}

/** Captures the most recent intercepted request for downstream assertions. */
function captured(): { current: Request | null } {
  return { current: null };
}

describe('AuthUserApiClient — Auth + User Profile slice', () => {
  let cap: { current: Request | null };

  beforeEach(() => {
    cap = captured();
  });

  afterEach(() => {
    cap.current = null;
  });

  // ===========================================================================
  // Public auth endpoints (auth: false)
  // ===========================================================================

  describe('POST /api/dashboard/auth-by-social-token', () => {
    it('omits Bearer, sends X-Domain, body matches shape, returns data payload', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/dashboard/auth-by-social-token`, async ({ request }) => {
          cap.current = request.clone();
          await request.clone().json();
          return {
            success: true,
            message: '',
            data: { accessToken: 'a', permissions: ['x'], userData: { id: 1 } },
          };
        }),
      );
      const res = await makeClient().dashboardAuthBySocialToken({
        driver: 'google',
        social: 'soc-tkn',
      });
      expectNoAuthHeader(cap.current!);
      expectDomainHeader(cap.current!, DOMAIN);
      expect(cap.current!.method).toBe('POST');
      const body = await cap.current!.json();
      expect(body).toEqual({ driver: 'google', social: 'soc-tkn' });
      expect(res.data.accessToken).toBe('a');
    });
  });

  describe('GET /api/dashboard/auth/{token}', () => {
    it('interpolates token, no Bearer, returns parsed envelope', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/dashboard/auth/abc123`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { ok: 1 } };
        }),
      );
      const res = await makeClient().dashboardAuthByToken('abc123');
      expectNoAuthHeader(cap.current!);
      expectDomainHeader(cap.current!, DOMAIN);
      expect(res.data).toEqual({ ok: 1 });
    });
  });

  describe('POST /api/dashboard/join', () => {
    it('public, body shape (secret_token, password, password_confirmation)', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/dashboard/join`, async ({ request }) => {
          cap.current = request.clone();
          await request.clone().json();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().dashboardJoin({
        secret_token: 'sek',
        password: 'P@ssw0rd',
        password_confirmation: 'P@ssw0rd',
      });
      expectNoAuthHeader(cap.current!);
      expect(await cap.current!.json()).toEqual({
        secret_token: 'sek',
        password: 'P@ssw0rd',
        password_confirmation: 'P@ssw0rd',
      });
    });
  });

  describe('GET /api/dashboard/join/{token}', () => {
    it('public, interpolates token', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/dashboard/join/xyz`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().dashboardJoinByToken('xyz');
      expectNoAuthHeader(cap.current!);
    });
  });

  describe('POST /api/dashboard/login', () => {
    it('public, returns DashboardLoginResponse data payload', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/dashboard/login`, async ({ request }) => {
          cap.current = request.clone();
          return {
            success: true,
            message: '',
            data: {
              accessToken: 'aT',
              id: 7,
              tenant_id: 99,
              domain: 'phm.ai',
              roles: ['admin'],
              permissions: ['*'],
            },
          };
        }),
      );
      const res = await makeClient().dashboardLogin({
        login: 'arion',
        password: 'pw',
      });
      expectNoAuthHeader(cap.current!);
      expect(await cap.current!.json()).toEqual({ login: 'arion', password: 'pw' });
      expect(res.data.id).toBe(7);
      expect(res.data.tenant_id).toBe(99);
    });
  });

  describe('GET /api/logout', () => {
    it('Bearer required (auth=api), GET method', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/logout`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().logout();
      expectAuthHeader(cap.current!, TOKEN);
      expect(cap.current!.method).toBe('GET');
    });
  });

  describe('POST /api/public/auth/finish-social-registration', () => {
    it('Bearer required (spec says auth=api), body shape exhaustive', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/public/auth/finish-social-registration`,
          async ({ request }) => {
            cap.current = request.clone();
            return {
              success: true,
              message: '',
              data: {
                accessToken: 't',
                id: 1,
                roles: [],
                permissions: [],
                full_name: 'Arion',
                username: 'arion',
                email_verified_at: '2025-01-01T00:00:00Z',
                force_password_reset: false,
              },
            };
          },
        ),
      );
      const res = await makeClient().finishSocialRegistration({
        timezone: 'America/Los_Angeles',
        full_name: 'Arion Hardison',
        email: 'a@b.co',
        sms_contest: true,
        agreed: true,
        social: 12,
        driver: 'google',
      });
      expectAuthHeader(cap.current!, TOKEN);
      const body = await cap.current!.json();
      expect(body).toEqual({
        timezone: 'America/Los_Angeles',
        full_name: 'Arion Hardison',
        email: 'a@b.co',
        sms_contest: true,
        agreed: true,
        social: 12,
        driver: 'google',
      });
      expect(res.data.id).toBe(1);
    });
  });

  describe('POST /api/public/auth/new-password', () => {
    it('public, full reset payload', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/public/auth/new-password`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().newPassword({
        token: 'tk',
        email: 'e@e.co',
        password: 'pw',
        confirm_password: 'pw',
      });
      expectNoAuthHeader(cap.current!);
      expect(await cap.current!.json()).toEqual({
        token: 'tk',
        email: 'e@e.co',
        password: 'pw',
        confirm_password: 'pw',
      });
    });
  });

  describe('GET /api/public/auth/protocol-chain/get-user-by-invite/{token}/{source?}', () => {
    it('omits source segment when not provided, public', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/public/auth/protocol-chain/get-user-by-invite/inv1`,
          ({ request }) => {
            cap.current = request;
            return {
              success: true,
              message: '',
              data: { email: 'e', full_name: 'F', username: 'u' },
            };
          },
        ),
      );
      const res = await makeClient().getUserByInvite('inv1');
      expectNoAuthHeader(cap.current!);
      expect(res.data.email).toBe('e');
    });

    it('appends source segment when provided', async () => {
      server.use(
        mockEndpoint(
          'get',
          `${BASE}/api/public/auth/protocol-chain/get-user-by-invite/inv2/email`,
          ({ request }) => {
            cap.current = request;
            return {
              success: true,
              message: '',
              data: { email: 'e', full_name: 'F', username: 'u' },
            };
          },
        ),
      );
      await makeClient().getUserByInvite('inv2', 'email');
      expect(new URL(cap.current!.url).pathname).toBe(
        '/api/public/auth/protocol-chain/get-user-by-invite/inv2/email',
      );
    });
  });

  describe('POST /api/public/auth/reset', () => {
    it('public, optional email body', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/public/auth/reset`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().resetPassword({ email: 'a@b.co' });
      expectNoAuthHeader(cap.current!);
      expect(await cap.current!.json()).toEqual({ email: 'a@b.co' });
    });
  });

  describe('POST /api/public/auth/sign-in', () => {
    it('public, returns SignInResponse with accessToken+permissions', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/public/auth/sign-in`, async ({ request }) => {
          cap.current = request.clone();
          return {
            success: true,
            message: '',
            data: {
              accessToken: 'tkn',
              id: 5,
              roles: ['user'],
              permissions: ['read'],
              full_name: 'F',
              username: 'u',
              email_verified_at: '2024-01-01T00:00:00Z',
              force_password_reset: false,
            },
          };
        }),
      );
      const res = await makeClient().signIn({ login: 'arion', password: 'pw' });
      expectNoAuthHeader(cap.current!);
      expectDomainHeader(cap.current!, DOMAIN);
      expect(await cap.current!.json()).toEqual({ login: 'arion', password: 'pw' });
      expect(res.data.id).toBe(5);
      expect(res.data.accessToken).toBe('tkn');
    });
  });

  describe('POST /api/public/auth/sign-up', () => {
    it('Bearer required (spec auth=api), exhaustive sign-up body', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/public/auth/sign-up`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().signUp({
        timezone: 'UTC',
        full_name: 'F L',
        login: 'flast',
        password: 'P@ssw0rd!',
        sms_contest: false,
        agreed: true,
      });
      expectAuthHeader(cap.current!, TOKEN);
      const body = await cap.current!.json();
      expect(body).toEqual({
        timezone: 'UTC',
        full_name: 'F L',
        login: 'flast',
        password: 'P@ssw0rd!',
        sms_contest: false,
        agreed: true,
      });
    });
  });

  // ===========================================================================
  // /api/user/* — singular namespace
  // ===========================================================================

  describe('POST /api/user/change-cover/{user}', () => {
    it('multipart when profile_cover is a Blob, Bearer required', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/user/change-cover/42`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      const blob = new Blob(['img'], { type: 'image/png' });
      await makeClient().userChangeCover(42, { profile_cover: blob, user: 42 });
      expectAuthHeader(cap.current!, TOKEN);
      const ctype = cap.current!.headers.get('content-type') ?? '';
      expect(ctype).toMatch(/multipart\/form-data/);
      const fd = await cap.current!.formData();
      expect(fd.get('profile_cover')).toBeInstanceOf(Blob);
      expect(fd.get('user')).toBe('42');
    });
  });

  describe('POST /api/user/change-photo/{user}', () => {
    it('multipart when profile_picture is a Blob, Bearer required', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/user/change-photo/9`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      const blob = new Blob(['ppic'], { type: 'image/jpeg' });
      await makeClient().userChangePhoto(9, { profile_picture: blob, user: 9 });
      expectAuthHeader(cap.current!, TOKEN);
      const ctype = cap.current!.headers.get('content-type') ?? '';
      expect(ctype).toMatch(/multipart\/form-data/);
      const fd = await cap.current!.formData();
      expect(fd.get('profile_picture')).toBeInstanceOf(Blob);
    });
  });

  describe('GET /api/user/creator-dashboard', () => {
    it('Bearer required, GET, no body', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/user/creator-dashboard`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { metric: 1 } };
        }),
      );
      const res = await makeClient().getCreatorDashboard();
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data).toEqual({ metric: 1 });
    });
  });

  describe('GET /api/user/creator-stats', () => {
    it('Bearer required, GET, no body', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/user/creator-stats`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { foo: 'bar' } };
        }),
      );
      await makeClient().getCreatorStats();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('POST /api/user/finish-codify-registration', () => {
    it('Bearer required, returns CurrentUserData', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/user/finish-codify-registration`,
          async ({ request }) => {
            cap.current = request.clone();
            return {
              success: true,
              message: '',
              data: {
                username: 'u',
                full_name: 'F',
                email: 'e',
                phone: '1',
                id: 4,
                profession: null,
                email_verified_at: '2025-01-01T00:00:00Z',
                gender: 0,
                creator: false,
                birth_date: null,
                address: null,
                country: null,
                state: null,
                city: null,
                services_pending: null,
                timezone: 'UTC',
                unreadMessages: 0,
                unreadNotifications: 0,
                assignedTasks: 0,
                is_temporary: false,
                agent: null,
                zip: null,
                language: 'en',
                company: null,
                profile_picture: null,
                profile_cover: null,
                payment_methods: [],
                roles: [],
                permissions: [],
              },
            };
          },
        ),
      );
      const res = await makeClient().finishCodifyRegistration({
        timezone: 'UTC',
        full_name: 'F L',
        login: 'fl',
        sms_contest: false,
        agreed: true,
        password: 'P@ssw0rd',
      });
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.id).toBe(4);
      expect(res.data.is_temporary).toBe(false);
    });
  });

  describe('GET /api/user/get-data', () => {
    it('Bearer required, returns CurrentUserData', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/user/get-data`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: { id: 7, username: 'u', is_temporary: false } as any,
          };
        }),
      );
      const res = await makeClient().getUserData();
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.id).toBe(7);
    });
  });

  describe('GET /api/user/get-wallet', () => {
    it('Bearer required, GET', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/user/get-wallet`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { balance: 0 } };
        }),
      );
      await makeClient().getWallet();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('POST /api/user/set-timezone', () => {
    it('Bearer required, body shape {timezone}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/user/set-timezone`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().setTimezone({ timezone: 'America/Los_Angeles' });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ timezone: 'America/Los_Angeles' });
    });
  });

  describe('GET /api/user/{user} (admin show)', () => {
    it('Bearer required, returns AdminUserData', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/user/55`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: {
              id: 55,
              created_at: '2024-01-01T00:00:00Z',
              email: 'e',
              username: 'u',
              full_name: 'F',
              phone: '1',
              profile_picture: null,
              profession: null,
              description: null,
              country: null,
              country_id: 0,
              country_name: null,
              subproject_id: 0,
              subproject_name: null,
              last_activity: null,
              is_online: false,
              roles: [],
              type: 'user',
            },
          };
        }),
      );
      const res = await makeClient().adminShowUser(55);
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.id).toBe(55);
    });
  });

  describe('PUT /api/user/{user} (admin update)', () => {
    it('rewrites PUT to POST + ?_method=PUT, Bearer required, body shape', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/user/77`, async ({ request }) => {
          cap.current = request.clone();
          return {
            success: true,
            message: '',
            data: {
              id: 77,
              created_at: 't',
              email: 'e',
              username: 'u',
              full_name: 'F new',
              phone: null,
              profile_picture: null,
              profession: null,
              description: null,
              country: null,
              country_id: 0,
              country_name: null,
              subproject_id: 0,
              subproject_name: null,
              last_activity: null,
              is_online: false,
              roles: [],
              type: 'user',
            },
          };
        }),
      );
      const res = await makeClient().adminUpdateUser(77, {
        full_name: 'F new',
        roles: [1, 2],
      });
      expectAuthHeader(cap.current!, TOKEN);
      expectMethodOverride(cap.current!, 'PUT');
      const body = await cap.current!.json();
      expect(body).toEqual({ full_name: 'F new', roles: [1, 2] });
      expect(res.data.id).toBe(77);
    });
  });

  describe('DELETE /api/user/{user} (admin destroy)', () => {
    it('issues a real DELETE, Bearer required', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/user/88`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().adminDestroyUser(88);
      expectAuthHeader(cap.current!, TOKEN);
      expect(cap.current!.method).toBe('DELETE');
    });
  });

  // ===========================================================================
  // /api/users/* — plural namespace
  // ===========================================================================

  describe('GET /api/users/assigned-tags/{category}', () => {
    it('interpolates category, Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/users/assigned-tags/diet`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { tags: [] } };
        }),
      );
      await makeClient().getAssignedTags('diet');
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('POST /api/users/become-creator/{user}', () => {
    it('Bearer required, no body', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/users/become-creator/3`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: null };
        }),
      );
      await makeClient().becomeCreator(3);
      expectAuthHeader(cap.current!, TOKEN);
      expect(cap.current!.method).toBe('POST');
    });
  });

  describe('GET /api/users/can-creator/{user}', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/users/can-creator/5`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { can: true } };
        }),
      );
      await makeClient().canCreator(5);
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('POST /api/users/change-cover/{user}', () => {
    it('multipart upload, Bearer required', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/users/change-cover/6`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      const blob = new Blob(['x'], { type: 'image/png' });
      await makeClient().usersChangeCover(6, { profile_cover: blob, user: 6 });
      expectAuthHeader(cap.current!, TOKEN);
      expect(cap.current!.headers.get('content-type') ?? '').toMatch(
        /multipart\/form-data/,
      );
    });
  });

  describe('POST /api/users/change-photo/{user}', () => {
    it('multipart upload, Bearer required', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/users/change-photo/8`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      const blob = new Blob(['y'], { type: 'image/jpeg' });
      await makeClient().usersChangePhoto(8, { profile_picture: blob, user: 8 });
      expectAuthHeader(cap.current!, TOKEN);
      expect(cap.current!.headers.get('content-type') ?? '').toMatch(
        /multipart\/form-data/,
      );
    });
  });

  describe('POST /api/users/delete-role', () => {
    it('Bearer required, body {role}, returns RoleRecord', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/users/delete-role`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: { name: 'creator', id: 7 } };
        }),
      );
      const res = await makeClient().deleteRole({ role: 'creator' });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ role: 'creator' });
      expect(res.data.id).toBe(7);
    });
  });

  describe('DELETE /api/users/delete/{user}', () => {
    it('real DELETE with body {password}, Bearer required', async () => {
      server.use(
        mockEndpoint('delete', `${BASE}/api/users/delete/11`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().deleteUser(11, { password: 'pw' });
      expectAuthHeader(cap.current!, TOKEN);
      expect(cap.current!.method).toBe('DELETE');
      const body = await cap.current!.json();
      expect(body).toEqual({ password: 'pw' });
    });
  });

  describe('GET /api/users/find/{searchQuery}', () => {
    it('public, interpolates URL-encoded search query, returns BasicUserSummary', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/users/find/hello%20world`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: { id: 1, username: 'u', full_name: 'F', profile_picture: null, country: null },
          };
        }),
      );
      const res = await makeClient().findUsers('hello world');
      expectNoAuthHeader(cap.current!);
      expect(res.data.id).toBe(1);
    });
  });

  describe('GET /api/users/get-available-roles', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/users/get-available-roles`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { name: 'admin', id: 1 } };
        }),
      );
      const res = await makeClient().getAvailableRoles();
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.id).toBe(1);
    });
  });

  describe('POST /api/users/get-code', () => {
    it('Bearer required, body {phone}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/users/get-code`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().getCode({ phone: '+15551234567' });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ phone: '+15551234567' });
    });
  });

  describe('GET /api/users/get-pricing', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/users/get-pricing`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { tier: 'pro' } };
        }),
      );
      await makeClient().getPricing();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/users/get-restricted-users', () => {
    it('Bearer required, paginated payload', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/users/get-restricted-users`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: {
              items: [
                { id: 1, user_id: 2, username: 'u', full_name: 'F', profile_picture: null },
              ],
              meta: { current_page: 1 },
            },
          };
        }),
      );
      const res = await makeClient().getRestrictedUsers();
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.items[0].id).toBe(1);
    });
  });

  describe('GET /api/users/get-role-category/{category}', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/users/get-role-category/admins`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().getRoleCategory('admins');
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/users/get-roles', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/users/get-roles`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: { name: 'user', id: 2 } };
        }),
      );
      const res = await makeClient().getRoles();
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.id).toBe(2);
    });
  });

  describe('GET /api/users/get-sessions', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/users/get-sessions`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().getSessions();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('POST /api/users/handle-user-tag', () => {
    it('Bearer required, body shape {id, sub_category_id, assign}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/users/handle-user-tag`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().handleUserTag({ id: 1, sub_category_id: 2, assign: true });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({
        id: 1,
        sub_category_id: 2,
        assign: true,
      });
    });
  });

  describe('GET /api/users/id/{user}', () => {
    it('public, returns BasicUserSummary', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/users/id/13`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: { id: 13, username: 'u', full_name: 'F', profile_picture: null, country: null },
          };
        }),
      );
      const res = await makeClient().getUserById(13);
      expectNoAuthHeader(cap.current!);
      expect(res.data.id).toBe(13);
    });
  });

  describe('GET /api/users/name/{username}', () => {
    it('public, URL-encodes username, returns PublicUserProfile', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/users/name/arion%40co`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: {
              id: 21,
              username: 'arion@co',
              full_name: 'Arion',
              about: null,
              profile_picture: null,
              description: null,
              title: null,
              location: null,
              party: null,
              roles: [],
              tags: [],
              category: null,
              sub_category: null,
              name: null,
              subscribed: false,
              ends_at: '',
              subscription_price: null,
              subscription_id: 0,
            },
          };
        }),
      );
      const res = await makeClient().getUserByName('arion@co');
      expectNoAuthHeader(cap.current!);
      expect(res.data.id).toBe(21);
    });
  });

  describe('GET /api/users/referral', () => {
    it('Bearer required', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/users/referral`, ({ request }) => {
          cap.current = request;
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().getReferral();
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('GET /api/users/referral/transactions', () => {
    it('Bearer required, paginated', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/users/referral/transactions`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: { items: [{ id: 1, amount: 5 }], meta: {} },
          };
        }),
      );
      const res = await makeClient().getReferralTransactions();
      expectAuthHeader(cap.current!, TOKEN);
      expect(res.data.items.length).toBe(1);
    });
  });

  describe('GET /api/users/remove-restriction/{restriction}', () => {
    it('Bearer required, paginated payload', async () => {
      server.use(
        mockEndpoint('get', `${BASE}/api/users/remove-restriction/15`, ({ request }) => {
          cap.current = request;
          return {
            success: true,
            message: '',
            data: { items: [], meta: {} },
          };
        }),
      );
      await makeClient().removeRestriction(15);
      expectAuthHeader(cap.current!, TOKEN);
    });
  });

  describe('POST /api/users/restrict/{user}', () => {
    it('Bearer required, body {user_id?}, returns RestrictedUserSummary', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/users/restrict/42`, async ({ request }) => {
          cap.current = request.clone();
          return {
            success: true,
            message: '',
            data: { id: 1, user_id: 42, username: 'u', full_name: 'F', profile_picture: null },
          };
        }),
      );
      const res = await makeClient().restrictUser(42, { user_id: 42 });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ user_id: 42 });
      expect(res.data.user_id).toBe(42);
    });
  });

  describe('POST /api/users/set-role', () => {
    it('Bearer required, body {role}, returns RoleRecord', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/users/set-role`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: { name: 'admin', id: 1 } };
        }),
      );
      const res = await makeClient().setRole({ role: 'admin' });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({ role: 'admin' });
      expect(res.data.id).toBe(1);
    });
  });

  describe('PATCH /api/users/update-billing-info', () => {
    it('rewrites to POST + ?_method=PATCH, Bearer required', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/users/update-billing-info`,
          async ({ request }) => {
            cap.current = request.clone();
            return { success: true, message: '', data: {} };
          },
        ),
      );
      await makeClient().updateBillingInfo({
        address: '1 St',
        city: 'LA',
        company: 'Acme',
        state: 'CA',
        zip: '90001',
      });
      expectAuthHeader(cap.current!, TOKEN);
      expectMethodOverride(cap.current!, 'PATCH');
      expect(await cap.current!.json()).toEqual({
        address: '1 St',
        city: 'LA',
        company: 'Acme',
        state: 'CA',
        zip: '90001',
      });
    });
  });

  describe('PATCH /api/users/update-password/{user}', () => {
    it('rewrites to POST + ?_method=PATCH, Bearer required, body {password}', async () => {
      server.use(
        mockEndpoint(
          'post',
          `${BASE}/api/users/update-password/19`,
          async ({ request }) => {
            cap.current = request.clone();
            return { success: true, message: '', data: {} };
          },
        ),
      );
      await makeClient().updatePassword(19, { password: 'newpw' });
      expectAuthHeader(cap.current!, TOKEN);
      expectMethodOverride(cap.current!, 'PATCH');
      expect(await cap.current!.json()).toEqual({ password: 'newpw' });
    });
  });

  describe('PATCH /api/users/update-phone', () => {
    it('rewrites to POST + ?_method=PATCH, body {phone, code}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/users/update-phone`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().updatePhone({ phone: '+15551234567', code: 1234 });
      expectAuthHeader(cap.current!, TOKEN);
      expectMethodOverride(cap.current!, 'PATCH');
      expect(await cap.current!.json()).toEqual({
        phone: '+15551234567',
        code: 1234,
      });
    });
  });

  describe('POST /api/users/update-pricing', () => {
    it('Bearer required, body {price, module}', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/users/update-pricing`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().updatePricing({ price: 19.99, module: 'subscription' });
      expectAuthHeader(cap.current!, TOKEN);
      expect(await cap.current!.json()).toEqual({
        price: 19.99,
        module: 'subscription',
      });
    });
  });

  describe('PATCH /api/users/update/{user}', () => {
    it('rewrites to POST + ?_method=PATCH, body shape per spec', async () => {
      server.use(
        mockEndpoint('post', `${BASE}/api/users/update/30`, async ({ request }) => {
          cap.current = request.clone();
          return { success: true, message: '', data: {} };
        }),
      );
      await makeClient().updateUser(30, {
        username: 'arion',
        full_name: 'Arion H',
        about: 'hi',
        birth_date: '1990-01-01',
        gender: 1,
        country_id: 840,
      });
      expectAuthHeader(cap.current!, TOKEN);
      expectMethodOverride(cap.current!, 'PATCH');
      expect(await cap.current!.json()).toEqual({
        username: 'arion',
        full_name: 'Arion H',
        about: 'hi',
        birth_date: '1990-01-01',
        gender: 1,
        country_id: 840,
      });
    });
  });
});
