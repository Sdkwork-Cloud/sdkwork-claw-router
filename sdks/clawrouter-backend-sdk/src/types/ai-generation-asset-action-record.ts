export interface AiGenerationAssetActionRecord {
  action_params?: Record<string, unknown>;
  action_type?: string;
  asset_id?: string;
  client_ip_hash?: string;
  client_ip_region?: string;
  completed_at?: string;
  created_at?: string;
  failure_code?: string;
  id?: string;
  job_id?: string;
  legal_hold?: boolean;
  metadata?: Record<string, unknown>;
  organization_id?: string;
  payload_hash?: string;
  request_id?: string;
  result_asset_id?: string;
  retention_until?: string;
  status?: string;
  tenant_id?: string;
  trace_id?: string;
  user_agent_hash?: string;
  user_id?: string;
  uuid?: string;
}
