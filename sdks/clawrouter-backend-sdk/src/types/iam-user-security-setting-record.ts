export interface IamUserSecuritySettingRecord {
  created_at?: string;
  data_scope?: string;
  deleted_at?: string;
  deleted_by?: string;
  id?: string;
  last_login_at?: string;
  last_login_ip_hash?: string;
  metadata?: Record<string, unknown>;
  mfa_enabled?: boolean;
  mfa_method?: string;
  organization_id?: string;
  owner_id?: string;
  owner_type?: string;
  password_last_changed_at?: string;
  security_level?: string;
  status?: string;
  tenant_id?: string;
  third_party_bound_snapshot?: Record<string, unknown>;
  trusted_device_count?: number;
  updated_at?: string;
  user_id?: string;
  uuid?: string;
  version?: string;
}
