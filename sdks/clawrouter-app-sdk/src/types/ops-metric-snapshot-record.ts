export interface OpsMetricSnapshotRecord {
  created_at?: string;
  dimension_key?: string;
  dimension_value?: string;
  id?: string;
  metadata?: Record<string, unknown>;
  metric_name?: string;
  metric_period?: string;
  metric_scope?: string;
  metric_unit?: string;
  metric_value?: string;
  organization_id?: string;
  payload?: Record<string, unknown>;
  period_end?: string;
  period_start?: string;
  rebuild_version?: string;
  source_id?: string;
  source_type?: string;
  source_version?: string;
  status?: string;
  tenant_id?: string;
  updated_at?: string;
  uuid?: string;
}
