import type { JsonValue } from './json-value';

/** Ai model catalog sync run record schema exposed by Claw Router. */
export interface AiModelCatalogSyncRunRecord {
  /** Accepted count field on ai model catalog sync run record. */
  accepted_count?: string;
  /** Catalog version field on ai model catalog sync run record. */
  catalog_version?: string;
  /** Change summary field on ai model catalog sync run record. */
  change_summary?: Record<string, JsonValue>;
  /** Created at field on ai model catalog sync run record. */
  created_at?: string;
  /** Error message masked field on ai model catalog sync run record. */
  error_message_masked?: string;
  /** Finished at field on ai model catalog sync run record. */
  finished_at?: string;
  /** Id field on ai model catalog sync run record. */
  id?: string;
  /** Legal hold field on ai model catalog sync run record. */
  legal_hold?: boolean;
  /** Metadata field on ai model catalog sync run record. */
  metadata?: Record<string, JsonValue>;
  /** Observed at field on ai model catalog sync run record. */
  observed_at?: string;
  /** Observed meter count field on ai model catalog sync run record. */
  observed_meter_count?: string;
  /** Observed model count field on ai model catalog sync run record. */
  observed_model_count?: string;
  /** Observed price count field on ai model catalog sync run record. */
  observed_price_count?: string;
  /** Observed vendor count field on ai model catalog sync run record. */
  observed_vendor_count?: string;
  /** Organization id field on ai model catalog sync run record. */
  organization_id: string;
  /** Payload hash field on ai model catalog sync run record. */
  payload_hash?: string;
  /** Provider code field on ai model catalog sync run record. */
  provider_code?: string;
  /** Region code field on ai model catalog sync run record. */
  region_code?: string;
  /** Rejected count field on ai model catalog sync run record. */
  rejected_count?: string;
  /** Request id field on ai model catalog sync run record. */
  request_id?: string;
  /** Retention until field on ai model catalog sync run record. */
  retention_until?: string;
  /** Run status field on ai model catalog sync run record. */
  run_status: string;
  /** Skipped count field on ai model catalog sync run record. */
  skipped_count?: string;
  /** Source code field on ai model catalog sync run record. */
  source_code: string;
  /** Source hash field on ai model catalog sync run record. */
  source_hash?: string;
  /** Source id field on ai model catalog sync run record. */
  source_id?: string;
  /** Source type field on ai model catalog sync run record. */
  source_type?: string;
  /** Source version field on ai model catalog sync run record. */
  source_version?: string;
  /** Started at field on ai model catalog sync run record. */
  started_at: string;
  /** Status field on ai model catalog sync run record. */
  status: string;
  /** Tenant id field on ai model catalog sync run record. */
  tenant_id: string;
  /** Trace id field on ai model catalog sync run record. */
  trace_id?: string;
  /** User id field on ai model catalog sync run record. */
  user_id?: string;
  /** Uuid field on ai model catalog sync run record. */
  uuid: string;
  /** Vendor code field on ai model catalog sync run record. */
  vendor_code?: string;
}
