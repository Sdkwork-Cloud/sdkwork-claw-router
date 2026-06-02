import type { JsonValue } from './json-value';

/** Ops notification preference record schema exposed by Claw Router. */
export interface OpsNotificationPreferenceRecord {
  /** App id field on ops notification preference record. */
  app_id?: string;
  /** Created at field on ops notification preference record. */
  created_at?: string;
  /** Data scope field on ops notification preference record. */
  data_scope?: string;
  /** Deleted at field on ops notification preference record. */
  deleted_at?: string;
  /** Deleted by field on ops notification preference record. */
  deleted_by?: string;
  /** Delivery channel field on ops notification preference record. */
  delivery_channel?: string;
  /** Enabled field on ops notification preference record. */
  enabled?: boolean;
  /** Id field on ops notification preference record. */
  id?: string;
  /** Message type field on ops notification preference record. */
  message_type?: string;
  /** Metadata field on ops notification preference record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ops notification preference record. */
  organization_id?: string;
  /** Owner id field on ops notification preference record. */
  owner_id?: string;
  /** Owner type field on ops notification preference record. */
  owner_type?: string;
  /** Quiet hours field on ops notification preference record. */
  quiet_hours?: Record<string, JsonValue>;
  /** Status field on ops notification preference record. */
  status?: string;
  /** Tenant id field on ops notification preference record. */
  tenant_id?: string;
  /** Updated at field on ops notification preference record. */
  updated_at?: string;
  /** User id field on ops notification preference record. */
  user_id?: string;
  /** Uuid field on ops notification preference record. */
  uuid?: string;
  /** Version field on ops notification preference record. */
  version?: string;
}
