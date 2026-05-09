export interface OpsNotificationMessageRecord {
  action_url?: string;
  content?: string;
  created_at?: string;
  data_scope?: string;
  deleted_at?: string;
  deleted_by?: string;
  expire_at?: string;
  id?: string;
  message_code?: string;
  message_type?: string;
  metadata?: Record<string, unknown>;
  organization_id?: string;
  published_at?: string;
  severity?: string;
  status?: string;
  summary?: string;
  target_owner_id?: string;
  target_owner_type?: string;
  target_scope?: string;
  target_user_id?: string;
  tenant_id?: string;
  title?: string;
  updated_at?: string;
  uuid?: string;
  version?: string;
}
