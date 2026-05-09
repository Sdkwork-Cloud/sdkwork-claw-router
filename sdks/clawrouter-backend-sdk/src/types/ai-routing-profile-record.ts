export interface AiRoutingProfileRecord {
  config_hash?: string;
  created_at?: string;
  data_scope?: string;
  deleted_at?: string;
  deleted_by?: string;
  id?: string;
  metadata?: Record<string, unknown>;
  organization_id?: string;
  policy_id?: string;
  profile_name?: string;
  profile_version?: string;
  published_at?: string;
  published_by?: string;
  release_status?: string;
  rollback_from_profile_id?: string;
  status?: string;
  tenant_id?: string;
  traffic_percent?: string;
  updated_at?: string;
  uuid?: string;
  version?: string;
}
