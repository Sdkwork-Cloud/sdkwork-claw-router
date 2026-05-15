import type { JsonValue } from './json-value';

/** Ai model catalog source record schema exposed by Claw Router. */
export interface AiModelCatalogSourceRecord {
  /** Catalog version field on ai model catalog source record. */
  catalog_version?: string;
  /** Created at field on ai model catalog source record. */
  created_at?: string;
  /** Data scope field on ai model catalog source record. */
  data_scope?: string;
  /** Deleted at field on ai model catalog source record. */
  deleted_at?: string;
  /** Deleted by field on ai model catalog source record. */
  deleted_by?: string;
  /** Error message masked field on ai model catalog source record. */
  error_message_masked?: string;
  /** Id field on ai model catalog source record. */
  id?: string;
  /** Last observed at field on ai model catalog source record. */
  last_observed_at?: string;
  /** Last success at field on ai model catalog source record. */
  last_success_at?: string;
  /** Metadata field on ai model catalog source record. */
  metadata?: Record<string, JsonValue>;
  /** Normalized payload hash field on ai model catalog source record. */
  normalized_payload_hash?: string;
  /** Organization id field on ai model catalog source record. */
  organization_id: string;
  /** Parser kind field on ai model catalog source record. */
  parser_kind: string;
  /** Provider code field on ai model catalog source record. */
  provider_code?: string;
  /** Raw payload ref field on ai model catalog source record. */
  raw_payload_ref?: string;
  /** Refresh interval seconds field on ai model catalog source record. */
  refresh_interval_seconds?: string;
  /** Region code field on ai model catalog source record. */
  region_code?: string;
  /** Schema version field on ai model catalog source record. */
  schema_version?: string;
  /** Source code field on ai model catalog source record. */
  source_code: string;
  /** Source hash field on ai model catalog source record. */
  source_hash?: string;
  /** Source kind field on ai model catalog source record. */
  source_kind: string;
  /** Source name field on ai model catalog source record. */
  source_name: string;
  /** Source url field on ai model catalog source record. */
  source_url?: string;
  /** Status field on ai model catalog source record. */
  status: string;
  /** Tenant id field on ai model catalog source record. */
  tenant_id: string;
  /** Trust level field on ai model catalog source record. */
  trust_level: string;
  /** Updated at field on ai model catalog source record. */
  updated_at?: string;
  /** Uuid field on ai model catalog source record. */
  uuid: string;
  /** Vendor code field on ai model catalog source record. */
  vendor_code?: string;
  /** Version field on ai model catalog source record. */
  version?: string;
}
