export interface OpsConfigSnapshotRecord {
  config_hash?: string;
  config_payload?: Record<string, unknown>;
  config_scope?: string;
  config_type?: string;
  created_at?: string;
  id?: string;
  legal_hold?: boolean;
  metadata?: Record<string, unknown>;
  organization_id?: string;
  payload_hash?: string;
  published_at?: string;
  published_by?: string;
  request_id?: string;
  retention_until?: string;
  rollback_from_snapshot_id?: string;
  snapshot_no?: string;
  source_ids?: Record<string, unknown>;
  source_table?: string;
  status?: string;
  tenant_id?: string;
  trace_id?: string;
  user_id?: string;
  uuid?: string;
}
