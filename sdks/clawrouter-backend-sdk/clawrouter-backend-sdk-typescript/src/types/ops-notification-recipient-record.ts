import type { JsonValue } from './json-value';

/** Ops notification recipient record schema exposed by Claw Router. */
export interface OpsNotificationRecipientRecord {
  /** App id field on ops notification recipient record. */
  app_id?: string;
  /** Created at field on ops notification recipient record. */
  created_at?: string;
  /** Data scope field on ops notification recipient record. */
  data_scope?: string;
  /** Deleted at field on ops notification recipient record. */
  deleted_at?: string;
  /** Deleted by field on ops notification recipient record. */
  deleted_by?: string;
  /** Id field on ops notification recipient record. */
  id?: string;
  /** Message id field on ops notification recipient record. */
  message_id?: string;
  /** Metadata field on ops notification recipient record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ops notification recipient record. */
  organization_id?: string;
  /** Recipient role code field on ops notification recipient record. */
  recipient_role_code?: string;
  /** Recipient type field on ops notification recipient record. */
  recipient_type?: string;
  /** Recipient user id field on ops notification recipient record. */
  recipient_user_id?: string;
  /** Recipient value field on ops notification recipient record. */
  recipient_value?: string;
  /** Status field on ops notification recipient record. */
  status?: string;
  /** Tenant id field on ops notification recipient record. */
  tenant_id?: string;
  /** Updated at field on ops notification recipient record. */
  updated_at?: string;
  /** Uuid field on ops notification recipient record. */
  uuid?: string;
  /** Version field on ops notification recipient record. */
  version?: string;
}
