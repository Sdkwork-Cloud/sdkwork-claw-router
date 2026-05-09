export interface IntegrationProviderHealthSnapshotRecord {
  channel_id?: string;
  check_type?: string;
  checked_at?: string;
  created_at?: string;
  error_code?: string;
  error_message_masked?: string;
  health_status?: string;
  http_status?: number;
  id?: string;
  latency_ms?: number;
  legal_hold?: boolean;
  metadata?: Record<string, unknown>;
  organization_id?: string;
  payload_hash?: string;
  provider_account_id?: string;
  provider_id?: string;
  quota_snapshot?: Record<string, unknown>;
  request_id?: string;
  retention_until?: string;
  status?: string;
  tenant_id?: string;
  trace_id?: string;
  user_id?: string;
  uuid?: string;
}
