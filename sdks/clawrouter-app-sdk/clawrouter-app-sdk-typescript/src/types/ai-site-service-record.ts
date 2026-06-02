import type { JsonValue } from './json-value';

/** Ai site service record schema exposed by Claw Router. */
export interface AiSiteServiceRecord {
  /** Auth config field on ai site service record. */
  auth_config?: Record<string, JsonValue>;
  /** Auth type field on ai site service record. */
  auth_type?: string;
  /** Base url field on ai site service record. */
  base_url?: string;
  /** Consecutive error count field on ai site service record. */
  consecutive_error_count?: string;
  /** Created at field on ai site service record. */
  created_at?: string;
  /** Credential hash field on ai site service record. */
  credential_hash?: string;
  /** Credential profile field on ai site service record. */
  credential_profile?: string;
  /** Credential ref field on ai site service record. */
  credential_ref?: string;
  /** Credential version field on ai site service record. */
  credential_version?: string;
  /** Data scope field on ai site service record. */
  data_scope?: string;
  /** Deleted at field on ai site service record. */
  deleted_at?: string;
  /** Deleted by field on ai site service record. */
  deleted_by?: string;
  /** Environment field on ai site service record. */
  environment?: string;
  /** Health status field on ai site service record. */
  health_status?: string;
  /** Id field on ai site service record. */
  id?: string;
  /** Last latency ms field on ai site service record. */
  last_latency_ms?: number;
  /** Last sync at field on ai site service record. */
  last_sync_at?: string;
  /** Last verified at field on ai site service record. */
  last_verified_at?: string;
  /** Masked label field on ai site service record. */
  masked_label?: string;
  /** Metadata field on ai site service record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai site service record. */
  organization_id: string;
  /** Protocol code field on ai site service record. */
  protocol_code?: string;
  /** Region code field on ai site service record. */
  region_code?: string;
  /** Service code field on ai site service record. */
  service_code: string;
  /** Service name field on ai site service record. */
  service_name: string;
  /** Service type field on ai site service record. */
  service_type: string;
  /** Site code field on ai site service record. */
  site_code: string;
  /** Site id field on ai site service record. */
  site_id: string;
  /** Sort order field on ai site service record. */
  sort_order?: number;
  /** Status field on ai site service record. */
  status: string;
  /** Tenant id field on ai site service record. */
  tenant_id: string;
  /** Updated at field on ai site service record. */
  updated_at?: string;
  /** Uuid field on ai site service record. */
  uuid: string;
  /** Version field on ai site service record. */
  version?: string;
}
