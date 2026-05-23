import type { JsonValue } from './json-value';

/** Ops notification delivery record schema exposed by Claw Router. */
export interface OpsNotificationDeliveryRecord {
  /** Archived at field on ops notification delivery record. */
  archived_at?: string;
  /** Created at field on ops notification delivery record. */
  created_at?: string;
  /** Data scope field on ops notification delivery record. */
  data_scope?: string;
  /** Deleted at field on ops notification delivery record. */
  deleted_at?: string;
  /** Deleted by field on ops notification delivery record. */
  deleted_by?: string;
  /** Delivered at field on ops notification delivery record. */
  delivered_at?: string;
  /** Delivery channel field on ops notification delivery record. */
  delivery_channel?: string;
  /** Delivery status field on ops notification delivery record. */
  delivery_status?: string;
  /** Failure code field on ops notification delivery record. */
  failure_code?: string;
  /** Id field on ops notification delivery record. */
  id?: string;
  /** Message id field on ops notification delivery record. */
  message_id?: string;
  /** Metadata field on ops notification delivery record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ops notification delivery record. */
  organization_id?: string;
  /** Owner id field on ops notification delivery record. */
  owner_id?: string;
  /** Owner type field on ops notification delivery record. */
  owner_type?: string;
  /** Popup seen at field on ops notification delivery record. */
  popup_seen_at?: string;
  /** Read at field on ops notification delivery record. */
  read_at?: string;
  /** Retry count field on ops notification delivery record. */
  retry_count?: number;
  /** Status field on ops notification delivery record. */
  status?: string;
  /** Tenant id field on ops notification delivery record. */
  tenant_id?: string;
  /** Updated at field on ops notification delivery record. */
  updated_at?: string;
  /** User id field on ops notification delivery record. */
  user_id?: string;
  /** Uuid field on ops notification delivery record. */
  uuid?: string;
  /** Version field on ops notification delivery record. */
  version?: string;
}
