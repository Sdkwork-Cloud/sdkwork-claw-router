export interface OpsAlertEventRecord {
  alert_no?: string;
  alert_status?: string;
  created_at?: string;
  first_seen_at?: string;
  id?: string;
  last_seen_at?: string;
  legal_hold?: boolean;
  message?: string;
  metadata?: Record<string, unknown>;
  organization_id?: string;
  payload_hash?: string;
  request_id?: string;
  resolved_at?: string;
  resolved_by?: string;
  retention_until?: string;
  severity?: string;
  source?: string;
  status?: string;
  tenant_id?: string;
  title?: string;
  trace_id?: string;
  user_id?: string;
  uuid?: string;
}
