import type { JsonValue } from './json-value';

/** Iam gateway api key group metric snapshot record schema exposed by Claw Router. */
export interface IamGatewayApiKeyGroupMetricSnapshotRecord {
  /** Account available count field on iam gateway api key group metric snapshot record. */
  account_available_count?: string;
  /** Account total count field on iam gateway api key group metric snapshot record. */
  account_total_count?: string;
  /** Capacity limit field on iam gateway api key group metric snapshot record. */
  capacity_limit?: string;
  /** Capacity used field on iam gateway api key group metric snapshot record. */
  capacity_used?: string;
  /** Created at field on iam gateway api key group metric snapshot record. */
  created_at?: string;
  /** Group code field on iam gateway api key group metric snapshot record. */
  group_code?: string;
  /** Group id field on iam gateway api key group metric snapshot record. */
  group_id?: string;
  /** Health status field on iam gateway api key group metric snapshot record. */
  health_status?: string;
  /** Id field on iam gateway api key group metric snapshot record. */
  id?: string;
  /** Metadata field on iam gateway api key group metric snapshot record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on iam gateway api key group metric snapshot record. */
  organization_id?: string;
  /** Provider code field on iam gateway api key group metric snapshot record. */
  provider_code?: string;
  /** Rebuild version field on iam gateway api key group metric snapshot record. */
  rebuild_version?: string;
  /** Request count today field on iam gateway api key group metric snapshot record. */
  request_count_today?: string;
  /** Request count total field on iam gateway api key group metric snapshot record. */
  request_count_total?: string;
  /** Snapshot at field on iam gateway api key group metric snapshot record. */
  snapshot_at?: string;
  /** Source id field on iam gateway api key group metric snapshot record. */
  source_id?: string;
  /** Source type field on iam gateway api key group metric snapshot record. */
  source_type?: string;
  /** Source version field on iam gateway api key group metric snapshot record. */
  source_version?: string;
  /** Status field on iam gateway api key group metric snapshot record. */
  status?: string;
  /** Tenant id field on iam gateway api key group metric snapshot record. */
  tenant_id?: string;
  /** Updated at field on iam gateway api key group metric snapshot record. */
  updated_at?: string;
  /** Usage amount today field on iam gateway api key group metric snapshot record. */
  usage_amount_today?: string;
  /** Usage amount total field on iam gateway api key group metric snapshot record. */
  usage_amount_total?: string;
  /** Uuid field on iam gateway api key group metric snapshot record. */
  uuid?: string;
}
