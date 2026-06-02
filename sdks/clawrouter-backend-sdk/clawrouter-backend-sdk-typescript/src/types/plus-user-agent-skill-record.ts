import type { JsonValue } from './json-value';

/** Plus user agent skill record schema exposed by Claw Router. */
export interface PlusUserAgentSkillRecord {
  /** Config field on plus user agent skill record. */
  config?: Record<string, JsonValue>;
  /** Created at field on plus user agent skill record. */
  created_at?: string;
  /** Data scope field on plus user agent skill record. */
  data_scope?: number;
  /** Enabled field on plus user agent skill record. */
  enabled?: boolean;
  /** Id field on plus user agent skill record. */
  id?: string;
  /** Installed at field on plus user agent skill record. */
  installed_at?: string;
  /** Last enabled at field on plus user agent skill record. */
  last_enabled_at?: string;
  /** Last used at field on plus user agent skill record. */
  last_used_at?: string;
  /** Organization id field on plus user agent skill record. */
  organization_id?: string;
  /** Skill id field on plus user agent skill record. */
  skill_id?: string;
  /** Tenant id field on plus user agent skill record. */
  tenant_id?: string;
  /** Updated at field on plus user agent skill record. */
  updated_at?: string;
  /** Used count field on plus user agent skill record. */
  used_count?: string;
  /** User id field on plus user agent skill record. */
  user_id?: string;
  /** Uuid field on plus user agent skill record. */
  uuid?: string;
  /** V field on plus user agent skill record. */
  v?: string;
}
