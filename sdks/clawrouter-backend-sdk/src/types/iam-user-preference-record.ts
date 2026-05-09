export interface IamUserPreferenceRecord {
  appearance_config?: Record<string, unknown>;
  created_at?: string;
  data_scope?: string;
  default_console_path?: string;
  deleted_at?: string;
  deleted_by?: string;
  id?: string;
  language?: string;
  metadata?: Record<string, unknown>;
  notification_preferences?: Record<string, unknown>;
  organization_id?: string;
  owner_id?: string;
  owner_type?: string;
  status?: string;
  tenant_id?: string;
  theme_mode?: string;
  timezone?: string;
  updated_at?: string;
  user_id?: string;
  uuid?: string;
  version?: string;
}
