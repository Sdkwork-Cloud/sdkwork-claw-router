import type { JsonValue } from './json-value';

/** Integration provider account record schema exposed by Claw Router. */
export interface IntegrationProviderAccountRecord {
  /** Account code field on integration provider account record. */
  account_code?: string;
  /** Account name field on integration provider account record. */
  account_name?: string;
  /** Auth config field on integration provider account record. */
  auth_config?: Record<string, JsonValue>;
  /** Auth type field on integration provider account record. */
  auth_type?: string;
  /** Base url field on integration provider account record. */
  base_url?: string;
  /** Consecutive error count field on integration provider account record. */
  consecutive_error_count?: string;
  /** Created at field on integration provider account record. */
  created_at?: string;
  /** Credential profile field on integration provider account record. */
  credential_profile?: string;
  /** Data scope field on integration provider account record. */
  data_scope?: string;
  /** Deleted at field on integration provider account record. */
  deleted_at?: string;
  /** Deleted by field on integration provider account record. */
  deleted_by?: string;
  /** External account id field on integration provider account record. */
  external_account_id?: string;
  /** Id field on integration provider account record. */
  id?: string;
  /** Last balance checked at field on integration provider account record. */
  last_balance_checked_at?: string;
  /** Last rotated at field on integration provider account record. */
  last_rotated_at?: string;
  /** Last used at field on integration provider account record. */
  last_used_at?: string;
  /** Last verified at field on integration provider account record. */
  last_verified_at?: string;
  /** Masked label field on integration provider account record. */
  masked_label?: string;
  /** Metadata field on integration provider account record. */
  metadata?: Record<string, JsonValue>;
  /** Next rotate at field on integration provider account record. */
  next_rotate_at?: string;
  /** Organization id field on integration provider account record. */
  organization_id?: string;
  /** Provider code field on integration provider account record. */
  provider_code?: string;
  /** Provider id field on integration provider account record. */
  provider_id?: string;
  /** Quota limit field on integration provider account record. */
  quota_limit?: string;
  /** Quota unit field on integration provider account record. */
  quota_unit?: string;
  /** Quota used field on integration provider account record. */
  quota_used?: string;
  /** Risk level field on integration provider account record. */
  risk_level?: string;
  /** Secret hash field on integration provider account record. */
  secret_hash?: string;
  /** Secret ref field on integration provider account record. */
  secret_ref?: string;
  /** Secret rotation policy field on integration provider account record. */
  secret_rotation_policy?: Record<string, JsonValue>;
  /** Secret version field on integration provider account record. */
  secret_version?: string;
  /** Status field on integration provider account record. */
  status?: string;
  /** Tenant id field on integration provider account record. */
  tenant_id?: string;
  /** Updated at field on integration provider account record. */
  updated_at?: string;
  /** Upstream balance amount field on integration provider account record. */
  upstream_balance_amount?: string;
  /** Upstream balance currency field on integration provider account record. */
  upstream_balance_currency?: string;
  /** Uuid field on integration provider account record. */
  uuid?: string;
  /** Version field on integration provider account record. */
  version?: string;
}
