export interface IntegrationWebhookEndpointRecord {
  created_at?: string;
  data_scope?: string;
  deleted_at?: string;
  deleted_by?: string;
  endpoint_code?: string;
  event_types?: Record<string, unknown>;
  failure_count?: string;
  id?: string;
  last_failure_at?: string;
  last_success_at?: string;
  metadata?: Record<string, unknown>;
  name?: string;
  organization_id?: string;
  owner_id?: string;
  owner_type?: string;
  retry_policy?: Record<string, unknown>;
  secret_hash?: string;
  secret_ref?: string;
  signing_alg?: string;
  status?: string;
  target_url?: string;
  tenant_id?: string;
  updated_at?: string;
  user_id?: string;
  uuid?: string;
  version?: string;
}
