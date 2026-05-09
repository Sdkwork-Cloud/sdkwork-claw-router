export interface IamUserLoginEventRecord {
  auth_method?: string;
  auth_provider?: string;
  client_ip_hash?: string;
  client_ip_masked?: string;
  client_ip_region?: string;
  created_at?: string;
  device_fingerprint_hash?: string;
  device_label?: string;
  failure_reason_code?: string;
  id?: string;
  legal_hold?: boolean;
  login_result?: string;
  metadata?: Record<string, unknown>;
  mfa_verified?: boolean;
  occurred_at?: string;
  organization_id?: string;
  payload_hash?: string;
  request_id?: string;
  retention_until?: string;
  risk_level?: string;
  session_id_hash?: string;
  status?: string;
  tenant_id?: string;
  trace_id?: string;
  user_agent_hash?: string;
  user_id?: string;
  uuid?: string;
}
