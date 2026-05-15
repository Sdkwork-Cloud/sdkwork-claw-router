import type { JsonValue } from './json-value';

/** Ops metric snapshot record schema exposed by Claw Router. */
export interface OpsMetricSnapshotRecord {
  /** Created at field on ops metric snapshot record. */
  created_at?: string;
  /** Dimension key field on ops metric snapshot record. */
  dimension_key?: string;
  /** Dimension value field on ops metric snapshot record. */
  dimension_value?: string;
  /** Id field on ops metric snapshot record. */
  id?: string;
  /** Metadata field on ops metric snapshot record. */
  metadata?: Record<string, JsonValue>;
  /** Metric name field on ops metric snapshot record. */
  metric_name?: string;
  /** Metric period field on ops metric snapshot record. */
  metric_period?: string;
  /** Metric scope field on ops metric snapshot record. */
  metric_scope?: string;
  /** Metric unit field on ops metric snapshot record. */
  metric_unit?: string;
  /** Metric value field on ops metric snapshot record. */
  metric_value?: string;
  /** Organization id field on ops metric snapshot record. */
  organization_id?: string;
  /** Payload field on ops metric snapshot record. */
  payload?: Record<string, JsonValue>;
  /** Period end field on ops metric snapshot record. */
  period_end?: string;
  /** Period start field on ops metric snapshot record. */
  period_start?: string;
  /** Rebuild version field on ops metric snapshot record. */
  rebuild_version?: string;
  /** Source id field on ops metric snapshot record. */
  source_id?: string;
  /** Source type field on ops metric snapshot record. */
  source_type?: string;
  /** Source version field on ops metric snapshot record. */
  source_version?: string;
  /** Status field on ops metric snapshot record. */
  status?: string;
  /** Tenant id field on ops metric snapshot record. */
  tenant_id?: string;
  /** Updated at field on ops metric snapshot record. */
  updated_at?: string;
  /** Uuid field on ops metric snapshot record. */
  uuid?: string;
}
