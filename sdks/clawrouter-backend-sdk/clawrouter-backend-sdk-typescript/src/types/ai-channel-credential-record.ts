import type { JsonValue } from './json-value';

/** Ai channel credential record schema exposed by Claw Router. */
export interface AiChannelCredentialRecord {
  /** Auth config field on ai channel credential record. */
  auth_config: Record<string, JsonValue>;
  /** Base url field on ai channel credential record. */
  base_url: string;
  /** Channel code field on ai channel credential record. */
  channel_code?: string;
  /** Channel id field on ai channel credential record. */
  channel_id: string;
  /** Consecutive error count field on ai channel credential record. */
  consecutive_error_count?: string;
  /** Created at field on ai channel credential record. */
  created_at?: string;
  /** Credential hash field on ai channel credential record. */
  credential_hash: string;
  /** Credential name field on ai channel credential record. */
  credential_name: string;
  /** Credential ref field on ai channel credential record. */
  credential_ref: string;
  /** Data scope field on ai channel credential record. */
  data_scope?: string;
  /** Deleted at field on ai channel credential record. */
  deleted_at?: string;
  /** Deleted by field on ai channel credential record. */
  deleted_by?: string;
  /** Health status field on ai channel credential record. */
  health_status?: string;
  /** Id field on ai channel credential record. */
  id?: string;
  /** Last latency ms field on ai channel credential record. */
  last_latency_ms?: number;
  /** Last used at field on ai channel credential record. */
  last_used_at?: string;
  /** Last verified at field on ai channel credential record. */
  last_verified_at?: string;
  /** Masked label field on ai channel credential record. */
  masked_label?: string;
  /** Metadata field on ai channel credential record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai channel credential record. */
  organization_id: string;
  /** Priority field on ai channel credential record. */
  priority?: number;
  /** Provider code field on ai channel credential record. */
  provider_code?: string;
  /** Status field on ai channel credential record. */
  status: string;
  /** Tenant id field on ai channel credential record. */
  tenant_id: string;
  /** Updated at field on ai channel credential record. */
  updated_at?: string;
  /** Uuid field on ai channel credential record. */
  uuid: string;
  /** Version field on ai channel credential record. */
  version?: string;
  /** Weight field on ai channel credential record. */
  weight?: number;
}
