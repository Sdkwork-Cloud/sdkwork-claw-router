export interface OpsOutboxEventRecord {
  aggregate_id?: string;
  aggregate_type?: string;
  aggregate_uuid?: string;
  created_at?: string;
  event_id?: string;
  event_payload?: Record<string, unknown>;
  event_type?: string;
  event_version?: number;
  failure_reason?: string;
  headers?: Record<string, unknown>;
  id?: string;
  legal_hold?: boolean;
  metadata?: Record<string, unknown>;
  next_retry_at?: string;
  organization_id?: string;
  payload_hash?: string;
  publish_status?: string;
  published_at?: string;
  request_id?: string;
  retention_until?: string;
  retry_count?: number;
  status?: string;
  tenant_id?: string;
  trace_id?: string;
  user_id?: string;
  uuid?: string;
}
