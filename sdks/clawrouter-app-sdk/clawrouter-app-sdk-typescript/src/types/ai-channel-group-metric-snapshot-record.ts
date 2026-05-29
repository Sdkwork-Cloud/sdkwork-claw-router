import type { JsonValue } from './json-value';

/** Ai channel group metric snapshot record schema exposed by Claw Router. */
export interface AiChannelGroupMetricSnapshotRecord {
  /** Capacity limit field on ai channel group metric snapshot record. */
  capacity_limit?: string;
  /** Capacity used field on ai channel group metric snapshot record. */
  capacity_used?: string;
  /** Channel available count field on ai channel group metric snapshot record. */
  channel_available_count?: string;
  /** Channel group id field on ai channel group metric snapshot record. */
  channel_group_id?: string;
  /** Channel total count field on ai channel group metric snapshot record. */
  channel_total_count?: string;
  /** Created at field on ai channel group metric snapshot record. */
  created_at?: string;
  /** Group code field on ai channel group metric snapshot record. */
  group_code?: string;
  /** Health status field on ai channel group metric snapshot record. */
  health_status?: string;
  /** Id field on ai channel group metric snapshot record. */
  id?: string;
  /** Metadata field on ai channel group metric snapshot record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai channel group metric snapshot record. */
  organization_id: string;
  /** Provider code field on ai channel group metric snapshot record. */
  provider_code?: string;
  /** Rebuild version field on ai channel group metric snapshot record. */
  rebuild_version?: string;
  /** Request count today field on ai channel group metric snapshot record. */
  request_count_today?: string;
  /** Request count total field on ai channel group metric snapshot record. */
  request_count_total?: string;
  /** Snapshot at field on ai channel group metric snapshot record. */
  snapshot_at?: string;
  /** Source id field on ai channel group metric snapshot record. */
  source_id?: string;
  /** Source type field on ai channel group metric snapshot record. */
  source_type?: string;
  /** Source version field on ai channel group metric snapshot record. */
  source_version?: string;
  /** Status field on ai channel group metric snapshot record. */
  status: string;
  /** Tenant id field on ai channel group metric snapshot record. */
  tenant_id: string;
  /** Updated at field on ai channel group metric snapshot record. */
  updated_at?: string;
  /** Usage amount today field on ai channel group metric snapshot record. */
  usage_amount_today?: string;
  /** Usage amount total field on ai channel group metric snapshot record. */
  usage_amount_total?: string;
  /** Uuid field on ai channel group metric snapshot record. */
  uuid: string;
}
