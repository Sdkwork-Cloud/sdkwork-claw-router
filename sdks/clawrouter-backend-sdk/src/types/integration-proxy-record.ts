export interface IntegrationProxyRecord {
  created_at?: string;
  data_scope?: string;
  deleted_at?: string;
  deleted_by?: string;
  description?: string;
  endpoint?: string;
  health_status?: string;
  id?: string;
  last_checked_at?: string;
  metadata?: Record<string, unknown>;
  organization_id?: string;
  proxy_code?: string;
  proxy_type?: string;
  region?: string;
  secret_hash?: string;
  secret_ref?: string;
  status?: string;
  tenant_id?: string;
  updated_at?: string;
  uuid?: string;
  version?: string;
}
