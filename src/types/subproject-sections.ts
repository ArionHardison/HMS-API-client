/**
 * Shared subproject section payloads used by every wizard / admin / claim
 * surface that walks an admin through configuring a subproject. Six sections,
 * each with a stable shape across:
 *   - /api/subproject-admin/create/subproject/{section}
 *   - /api/subproject-admin/claim/subproject/{subproject}/{section}
 *   - /api/subproject-wizard/{section}/{id}
 *   - /api/project-settings/{section}/{subproject?}
 *
 * Source of truth: `sdk/spec/endpoints.json` request shapes for each section.
 */

/** Content section — name + parent project + categories + placeholders. */
export interface SubprojectContentRequest {
  name: string;
  parent_project: string | number;
  categories: ReadonlyArray<unknown>;
  placeholders: Record<string, unknown>;
}

/** Domains section — DNS-level config + aliases. */
export interface SubprojectDomainsRequest {
  state_id: number | null;
  city_id: number | null;
  country_id: number | null;
  domain: string;
  aliases: ReadonlyArray<string>;
}

/** Layout section — visual structure flags. */
export interface SubprojectLayoutRequest {
  /** Logo URL or upload reference. */
  logo: string | null;
  /** Layout style identifier. */
  style: string;
  show_top_logo: boolean;
  show_top_title: boolean;
  show_top_description: boolean;
  show_submit_button: boolean;
  allow_file_upload: boolean;
  allow_audio_input: boolean;
  show_header: boolean;
  show_footer: boolean;
  show_loading_overlay: boolean;
  show_autocomplete: boolean;
}

/** SEO section — title/description/keywords + free-form meta tags. */
export interface SubprojectSeoRequest {
  title: string;
  description: string;
  keywords: string;
  /** Free-form meta tag map: name → content. */
  meta: Record<string, string>;
}

/** A single team member entry. */
export interface SubprojectTeamMember {
  /** User id or email/handle — controller accepts both. */
  id?: number | string;
  email?: string;
  /** Optional permission set. */
  permissions?: ReadonlyArray<string>;
  [key: string]: unknown;
}

/** Team section — member list with permissions. */
export interface SubprojectTeamRequest {
  /** Subproject id (some endpoints expect it in the body). */
  id?: number | string;
  members: ReadonlyArray<SubprojectTeamMember>;
}

/** Template section — color palette. */
export interface SubprojectTemplateRequest {
  font_color: string;
  buttons_font_color: string;
  danger_color: string;
  warning_color: string;
  success_color: string;
  info_color: string;
  primary_color: string;
  background_color: string;
  disabled_color: string;
  link_color: string;
}

/** GET response for any section "show" endpoint — spec leaves shape empty. */
export interface SubprojectSectionResponse {
  [key: string]: unknown;
}
