export interface OpsNotificationDeliveryRecord {
  created_at?: string;
  data_scope?: string;
  deleted_at?: string;
  deleted_by?: string;
  delivered_at?: string;
  delivery_channel?: string;
  delivery_status?: string;
  failure_code?: string;
  id?: string;
  message_id?: string;
  metadata?: Record<string, unknown>;
  organization_id?: string;
  owner_id?: string;
  owner_type?: string;
  read_at?: string;
  retry_count?: number;
  status?: string;
  tenant_id?: string;
  updated_at?: string;
  user_id?: string;
  uuid?: string;
  version?: string;
}
