export interface StudioCatalogActionRecord {
  action_type?: string;
  client_ip_hash?: string;
  created_at?: string;
  id?: string;
  legal_hold?: boolean;
  metadata?: Record<string, unknown>;
  organization_id?: string;
  payload_hash?: string;
  rating_score?: string;
  release_id?: string;
  request_id?: string;
  retention_until?: string;
  review_body?: string;
  review_title?: string;
  status?: string;
  target_id?: string;
  target_type?: string;
  tenant_id?: string;
  trace_id?: string;
  user_agent_hash?: string;
  user_id?: string;
  uuid?: string;
}
