import type { JsonValue } from './json-value';

/** Ai pricing import snapshot record schema exposed by Claw Router. */
export interface AiPricingImportSnapshotRecord {
  /** Accepted count field on ai pricing import snapshot record. */
  accepted_count?: string;
  /** Created at field on ai pricing import snapshot record. */
  created_at?: string;
  /** Currency field on ai pricing import snapshot record. */
  currency?: string;
  /** Data format field on ai pricing import snapshot record. */
  data_format?: string;
  /** Error message masked field on ai pricing import snapshot record. */
  error_message_masked?: string;
  /** Id field on ai pricing import snapshot record. */
  id?: string;
  /** Import source field on ai pricing import snapshot record. */
  import_source: string;
  /** Legal hold field on ai pricing import snapshot record. */
  legal_hold?: boolean;
  /** Metadata field on ai pricing import snapshot record. */
  metadata?: Record<string, JsonValue>;
  /** Normalized payload hash field on ai pricing import snapshot record. */
  normalized_payload_hash?: string;
  /** Observed at field on ai pricing import snapshot record. */
  observed_at: string;
  /** Organization id field on ai pricing import snapshot record. */
  organization_id: string;
  /** Payload hash field on ai pricing import snapshot record. */
  payload_hash?: string;
  /** Published at field on ai pricing import snapshot record. */
  published_at?: string;
  /** Raw payload ref field on ai pricing import snapshot record. */
  raw_payload_ref?: string;
  /** Rejected count field on ai pricing import snapshot record. */
  rejected_count?: string;
  /** Request id field on ai pricing import snapshot record. */
  request_id: string;
  /** Retention until field on ai pricing import snapshot record. */
  retention_until?: string;
  /** Row count field on ai pricing import snapshot record. */
  row_count?: string;
  /** Schema version field on ai pricing import snapshot record. */
  schema_version?: string;
  /** Source hash field on ai pricing import snapshot record. */
  source_hash: string;
  /** Source name field on ai pricing import snapshot record. */
  source_name: string;
  /** Source url field on ai pricing import snapshot record. */
  source_url?: string;
  /** Source version field on ai pricing import snapshot record. */
  source_version?: string;
  /** Status field on ai pricing import snapshot record. */
  status: string;
  /** Tenant id field on ai pricing import snapshot record. */
  tenant_id: string;
  /** Trace id field on ai pricing import snapshot record. */
  trace_id?: string;
  /** Upstream commit field on ai pricing import snapshot record. */
  upstream_commit?: string;
  /** User id field on ai pricing import snapshot record. */
  user_id?: string;
  /** Uuid field on ai pricing import snapshot record. */
  uuid: string;
}
