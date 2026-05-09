export interface OpsJobExecutionRecord {
  created_at?: string;
  duration_ms?: string;
  ended_at?: string;
  execution_status?: string;
  failure_count?: string;
  failure_reason?: string;
  id?: string;
  job_name?: string;
  job_type?: string;
  legal_hold?: boolean;
  metadata?: Record<string, unknown>;
  organization_id?: string;
  payload?: Record<string, unknown>;
  payload_hash?: string;
  processed_count?: string;
  request_id?: string;
  retention_until?: string;
  started_at?: string;
  status?: string;
  success_count?: string;
  tenant_id?: string;
  trace_id?: string;
  trigger_type?: string;
  user_id?: string;
  uuid?: string;
}
