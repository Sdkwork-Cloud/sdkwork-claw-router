import type { JsonValue } from './json-value';

/** Iam user preference record schema exposed by Claw Router. */
export interface IamUserPreferenceRecord {
  /** Appearance config field on iam user preference record. */
  appearance_config?: Record<string, JsonValue>;
  /** Created at field on iam user preference record. */
  created_at?: string;
  /** Data scope field on iam user preference record. */
  data_scope?: string;
  /** Default console path field on iam user preference record. */
  default_console_path?: string;
  /** Deleted at field on iam user preference record. */
  deleted_at?: string;
  /** Deleted by field on iam user preference record. */
  deleted_by?: string;
  /** Id field on iam user preference record. */
  id?: string;
  /** Language field on iam user preference record. */
  language?: string;
  /** Metadata field on iam user preference record. */
  metadata?: Record<string, JsonValue>;
  /** Notification preferences field on iam user preference record. */
  notification_preferences?: Record<string, JsonValue>;
  /** Organization id field on iam user preference record. */
  organization_id?: string;
  /** Owner id field on iam user preference record. */
  owner_id?: string;
  /** Owner type field on iam user preference record. */
  owner_type?: string;
  /** Status field on iam user preference record. */
  status?: string;
  /** Tenant id field on iam user preference record. */
  tenant_id?: string;
  /** Theme mode field on iam user preference record. */
  theme_mode?: string;
  /** Timezone field on iam user preference record. */
  timezone?: string;
  /** Updated at field on iam user preference record. */
  updated_at?: string;
  /** User id field on iam user preference record. */
  user_id?: string;
  /** Uuid field on iam user preference record. */
  uuid?: string;
  /** Version field on iam user preference record. */
  version?: string;
}
