export interface CommerceBillingExportRecord {
  approved_by?: string;
  audit_log_id?: string;
  created_at?: string;
  created_by?: string;
  download_count?: string;
  expire_at?: string;
  export_no?: string;
  export_type?: string;
  file_hash?: string;
  file_manifest?: Record<string, unknown>;
  id?: string;
  legal_hold?: boolean;
  metadata?: Record<string, unknown>;
  organization_id?: string;
  payload_hash?: string;
  period_end?: string;
  period_start?: string;
  request_id?: string;
  retention_until?: string;
  statement_id?: string;
  status?: string;
  tenant_id?: string;
  trace_id?: string;
  user_id?: string;
  uuid?: string;
}
