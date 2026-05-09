export interface OpsInboxEventRecord {
  consumer_name?: string;
  created_at?: string;
  event_type?: string;
  event_version?: number;
  failure_reason?: string;
  id?: string;
  legal_hold?: boolean;
  message_id?: string;
  metadata?: Record<string, unknown>;
  organization_id?: string;
  payload_hash?: string;
  process_status?: string;
  processed_at?: string;
  request_id?: string;
  retention_until?: string;
  retry_count?: number;
  source_system?: string;
  status?: string;
  tenant_id?: string;
  trace_id?: string;
  user_id?: string;
  uuid?: string;
}
