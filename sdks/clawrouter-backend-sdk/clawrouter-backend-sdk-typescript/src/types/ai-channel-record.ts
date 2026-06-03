import type { JsonValue } from './json-value';

/** Ai channel record schema exposed by Claw Router. */
export interface AiChannelRecord {
  /** Auth config field on ai channel record. */
  auth_config?: Record<string, JsonValue>;
  /** Auth type field on ai channel record. */
  auth_type?: string;
  /** Base url field on ai channel record. */
  base_url?: string;
  /** Channel code field on ai channel record. */
  channel_code: string;
  /** Channel name field on ai channel record. */
  channel_name: string;
  /** Channel type field on ai channel record. */
  channel_type: string;
  /** Circuit breaker policy field on ai channel record. */
  circuit_breaker_policy?: Record<string, JsonValue>;
  /** Consecutive error count field on ai channel record. */
  consecutive_error_count?: string;
  /** Created at field on ai channel record. */
  created_at?: string;
  /** Credential hash field on ai channel record. */
  credential_hash?: string;
  /** Credential profile field on ai channel record. */
  credential_profile?: string;
  /** Credential ref field on ai channel record. */
  credential_ref?: string;
  /** Credential rotation policy field on ai channel record. */
  credential_rotation_policy?: Record<string, JsonValue>;
  /** Credential rotation strategy field on ai channel record. */
  credential_rotation_strategy?: string;
  /** Credential version field on ai channel record. */
  credential_version?: string;
  /** Data scope field on ai channel record. */
  data_scope?: string;
  /** Deleted at field on ai channel record. */
  deleted_at?: string;
  /** Deleted by field on ai channel record. */
  deleted_by?: string;
  /** Environment field on ai channel record. */
  environment?: string;
  /** External channel id field on ai channel record. */
  external_channel_id?: string;
  /** Health status field on ai channel record. */
  health_status?: string;
  /** Id field on ai channel record. */
  id?: string;
  /** Last balance checked at field on ai channel record. */
  last_balance_checked_at?: string;
  /** Last latency ms field on ai channel record. */
  last_latency_ms?: number;
  /** Last rotated at field on ai channel record. */
  last_rotated_at?: string;
  /** Last used at field on ai channel record. */
  last_used_at?: string;
  /** Last verified at field on ai channel record. */
  last_verified_at?: string;
  /** Masked label field on ai channel record. */
  masked_label?: string;
  /** Metadata field on ai channel record. */
  metadata?: Record<string, JsonValue>;
  /** Next rotate at field on ai channel record. */
  next_rotate_at?: string;
  /** Organization id field on ai channel record. */
  organization_id: string;
  /** Priority field on ai channel record. */
  priority?: number;
  /** Protocol code field on ai channel record. */
  protocol_code?: string;
  /** Provider code field on ai channel record. */
  provider_code?: string;
  /** Provider id field on ai channel record. */
  provider_id?: string;
  /** Proxy id field on ai channel record. */
  proxy_id?: string;
  /** Quota limit field on ai channel record. */
  quota_limit?: string;
  /** Quota unit field on ai channel record. */
  quota_unit?: string;
  /** Quota used field on ai channel record. */
  quota_used?: string;
  /** Region code field on ai channel record. */
  region_code?: string;
  /** Retry policy field on ai channel record. */
  retry_policy?: Record<string, JsonValue>;
  /** Risk level field on ai channel record. */
  risk_level?: string;
  /** Rpm limit field on ai channel record. */
  rpm_limit?: string;
  /** Site channel role field on ai channel record. */
  site_channel_role?: string;
  /** Site code field on ai channel record. */
  site_code?: string;
  /** Site id field on ai channel record. */
  site_id?: string;
  /** Site service code field on ai channel record. */
  site_service_code?: string;
  /** Site service id field on ai channel record. */
  site_service_id?: string;
  /** Status field on ai channel record. */
  status: string;
  /** Tenant id field on ai channel record. */
  tenant_id: string;
  /** Timeout ms field on ai channel record. */
  timeout_ms?: number;
  /** Updated at field on ai channel record. */
  updated_at?: string;
  /** Upstream balance amount field on ai channel record. */
  upstream_balance_amount?: string;
  /** Upstream balance currency field on ai channel record. */
  upstream_balance_currency?: string;
  /** Uuid field on ai channel record. */
  uuid: string;
  /** Version field on ai channel record. */
  version?: string;
  /** Weight field on ai channel record. */
  weight?: number;
}
