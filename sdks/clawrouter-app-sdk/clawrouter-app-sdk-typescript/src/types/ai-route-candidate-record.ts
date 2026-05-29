import type { JsonValue } from './json-value';

/** Ai route candidate record schema exposed by Claw Router. */
export interface AiRouteCandidateRecord {
  /** Api code field on ai route candidate record. */
  api_code?: string;
  /** Catalog key field on ai route candidate record. */
  catalog_key?: string;
  /** Channel group id field on ai route candidate record. */
  channel_group_id?: string;
  /** Channel id field on ai route candidate record. */
  channel_id?: string;
  /** Channel type field on ai route candidate record. */
  channel_type?: string;
  /** Config version field on ai route candidate record. */
  config_version?: string;
  /** Created at field on ai route candidate record. */
  created_at?: string;
  /** Endpoint id field on ai route candidate record. */
  endpoint_id?: string;
  /** Health status field on ai route candidate record. */
  health_status?: string;
  /** Id field on ai route candidate record. */
  id?: string;
  /** Metadata field on ai route candidate record. */
  metadata?: Record<string, JsonValue>;
  /** Model code field on ai route candidate record. */
  model_code?: string;
  /** Organization id field on ai route candidate record. */
  organization_id: string;
  /** Priority field on ai route candidate record. */
  priority?: number;
  /** Provider code field on ai route candidate record. */
  provider_code?: string;
  /** Rebuild version field on ai route candidate record. */
  rebuild_version?: string;
  /** Refreshed at field on ai route candidate record. */
  refreshed_at?: string;
  /** Region code field on ai route candidate record. */
  region_code?: string;
  /** Source id field on ai route candidate record. */
  source_id?: string;
  /** Source type field on ai route candidate record. */
  source_type?: string;
  /** Source version field on ai route candidate record. */
  source_version?: string;
  /** Status field on ai route candidate record. */
  status: string;
  /** Tenant id field on ai route candidate record. */
  tenant_id: string;
  /** Updated at field on ai route candidate record. */
  updated_at?: string;
  /** Uuid field on ai route candidate record. */
  uuid: string;
  /** Vendor code field on ai route candidate record. */
  vendor_code?: string;
  /** Weight field on ai route candidate record. */
  weight?: number;
}
