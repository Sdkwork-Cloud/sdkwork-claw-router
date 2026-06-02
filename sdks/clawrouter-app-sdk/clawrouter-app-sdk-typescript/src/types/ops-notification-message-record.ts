import type { JsonValue } from './json-value';

/** Ops notification message record schema exposed by Claw Router. */
export interface OpsNotificationMessageRecord {
  /** Action url field on ops notification message record. */
  action_url?: string;
  /** App id field on ops notification message record. */
  app_id?: string;
  /** Content field on ops notification message record. */
  content?: string;
  /** Created at field on ops notification message record. */
  created_at?: string;
  /** Data scope field on ops notification message record. */
  data_scope?: string;
  /** Deleted at field on ops notification message record. */
  deleted_at?: string;
  /** Deleted by field on ops notification message record. */
  deleted_by?: string;
  /** Expire at field on ops notification message record. */
  expire_at?: string;
  /** Id field on ops notification message record. */
  id?: string;
  /** Message code field on ops notification message record. */
  message_code?: string;
  /** Message type field on ops notification message record. */
  message_type?: string;
  /** Metadata field on ops notification message record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ops notification message record. */
  organization_id?: string;
  /** Priority field on ops notification message record. */
  priority?: number;
  /** Published at field on ops notification message record. */
  published_at?: string;
  /** Scope type field on ops notification message record. */
  scope_type?: string;
  /** Severity field on ops notification message record. */
  severity?: string;
  /** Show as popup field on ops notification message record. */
  show_as_popup?: boolean;
  /** Status field on ops notification message record. */
  status?: string;
  /** Summary field on ops notification message record. */
  summary?: string;
  /** Tenant id field on ops notification message record. */
  tenant_id?: string;
  /** Title field on ops notification message record. */
  title?: string;
  /** Updated at field on ops notification message record. */
  updated_at?: string;
  /** Uuid field on ops notification message record. */
  uuid?: string;
  /** Version field on ops notification message record. */
  version?: string;
}
