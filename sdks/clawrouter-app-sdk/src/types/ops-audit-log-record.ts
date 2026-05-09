export interface OpsAuditLogRecord {
  action?: string;
  after_hash?: string;
  approval_id?: string;
  before_hash?: string;
  change_summary?: Record<string, unknown>;
  client_ip_hash?: string;
  created_at?: string;
  id?: string;
  legal_hold?: boolean;
  metadata?: Record<string, unknown>;
  operator_id?: string;
  operator_name_snapshot?: string;
  operator_type?: string;
  organization_id?: string;
  request_id?: string;
  retention_until?: string;
  risk_level?: string;
  target_id?: string;
  target_type?: string;
  target_uuid?: string;
  tenant_id?: string;
  trace_id?: string;
  user_agent_hash?: string;
  uuid?: string;
}
