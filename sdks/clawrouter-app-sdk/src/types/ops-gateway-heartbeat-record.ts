export interface OpsGatewayHeartbeatRecord {
  active_connections?: string;
  cpu_percent?: string;
  created_at?: string;
  disk_percent?: string;
  heartbeat_at?: string;
  id?: string;
  instance_id?: string;
  legal_hold?: boolean;
  memory_percent?: string;
  metadata?: Record<string, unknown>;
  network_in_bytes?: string;
  network_out_bytes?: string;
  open_file_count?: string;
  organization_id?: string;
  payload?: Record<string, unknown>;
  payload_hash?: string;
  request_id?: string;
  retention_until?: string;
  status?: string;
  tenant_id?: string;
  thread_count?: string;
  trace_id?: string;
  uptime_seconds?: string;
  user_id?: string;
  uuid?: string;
}
