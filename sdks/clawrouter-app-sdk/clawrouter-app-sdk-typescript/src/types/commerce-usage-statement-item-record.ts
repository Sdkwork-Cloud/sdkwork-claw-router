import type { JsonValue } from './json-value';

/** Commerce usage statement item record schema exposed by Claw Router. */
export interface CommerceUsageStatementItemRecord {
  /** Asset count field on commerce usage statement item record. */
  asset_count?: string;
  /** Breakdown payload field on commerce usage statement item record. */
  breakdown_payload?: Record<string, JsonValue>;
  /** Cost amount field on commerce usage statement item record. */
  cost_amount?: string;
  /** Created at field on commerce usage statement item record. */
  created_at?: string;
  /** Currency field on commerce usage statement item record. */
  currency?: string;
  /** Duration seconds field on commerce usage statement item record. */
  duration_seconds?: string;
  /** Id field on commerce usage statement item record. */
  id?: string;
  /** Item type field on commerce usage statement item record. */
  item_type?: string;
  /** Metadata field on commerce usage statement item record. */
  metadata?: Record<string, JsonValue>;
  /** Modality field on commerce usage statement item record. */
  modality?: string;
  /** Model field on commerce usage statement item record. */
  model?: string;
  /** Model list field on commerce usage statement item record. */
  model_list?: Record<string, JsonValue>;
  /** Organization id field on commerce usage statement item record. */
  organization_id?: string;
  /** Provider code field on commerce usage statement item record. */
  provider_code?: string;
  /** Rebuild version field on commerce usage statement item record. */
  rebuild_version?: string;
  /** Request count field on commerce usage statement item record. */
  request_count?: string;
  /** Source id field on commerce usage statement item record. */
  source_id?: string;
  /** Source type field on commerce usage statement item record. */
  source_type?: string;
  /** Source usage fact ids field on commerce usage statement item record. */
  source_usage_fact_ids?: Record<string, JsonValue>;
  /** Source version field on commerce usage statement item record. */
  source_version?: string;
  /** Statement id field on commerce usage statement item record. */
  statement_id?: string;
  /** Status field on commerce usage statement item record. */
  status?: string;
  /** Tenant id field on commerce usage statement item record. */
  tenant_id?: string;
  /** Token count field on commerce usage statement item record. */
  token_count?: string;
  /** Updated at field on commerce usage statement item record. */
  updated_at?: string;
  /** Usage text field on commerce usage statement item record. */
  usage_text?: string;
  /** Uuid field on commerce usage statement item record. */
  uuid?: string;
}
