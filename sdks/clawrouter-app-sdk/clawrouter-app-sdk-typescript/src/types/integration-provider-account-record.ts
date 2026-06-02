import type { JsonValue } from './json-value';

/** Integration provider account record schema exposed by Claw Router. */
export interface IntegrationProviderAccountRecord {
  /** Account code field on integration provider account record. */
  account_code: string;
  /** Account name field on integration provider account record. */
  account_name: string;
  /** Account type field on integration provider account record. */
  account_type?: string;
  /** Auth config field on integration provider account record. */
  auth_config?: Record<string, JsonValue>;
  /** Auth type field on integration provider account record. */
  auth_type?: string;
  /** Base url field on integration provider account record. */
  base_url?: string;
  /** Channel type field on integration provider account record. */
  channel_type?: string;
  /** Consecutive error count field on integration provider account record. */
  consecutive_error_count?: string;
  /** Created at field on integration provider account record. */
  created_at?: string;
  /** Credential profile field on integration provider account record. */
  credential_profile?: string;
  /** Credential version field on integration provider account record. */
  credential_version?: string;
  /** Data scope field on integration provider account record. */
  data_scope?: string;
  /** Deleted at field on integration provider account record. */
  deleted_at?: string;
  /** Deleted by field on integration provider account record. */
  deleted_by?: string;
  /** Environment field on integration provider account record. */
  environment?: string;
  /** Health status field on integration provider account record. */
  health_status?: string;
  /** Id field on integration provider account record. */
  id?: string;
  /** Last latency ms field on integration provider account record. */
  last_latency_ms?: number;
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
  organization_id: string;
  /** Provider code field on integration provider account record. */
  provider_code: string;
  /** Provider id field on integration provider account record. */
  provider_id?: string;
  /** Quota snapshot field on integration provider account record. */
  quota_snapshot?: Record<string, JsonValue>;
  /** Region code field on integration provider account record. */
  region_code?: string;
  /** Risk level field on integration provider account record. */
  risk_level?: string;
  /** Secret hash field on integration provider account record. */
  secret_hash?: string;
  /** Secret ref field on integration provider account record. */
  secret_ref?: string;
  /** Status field on integration provider account record. */
  status: string;
  /** Tenant id field on integration provider account record. */
  tenant_id: string;
  /** Updated at field on integration provider account record. */
  updated_at?: string;
  /** Uuid field on integration provider account record. */
  uuid: string;
  /** Version field on integration provider account record. */
  version?: string;
}
