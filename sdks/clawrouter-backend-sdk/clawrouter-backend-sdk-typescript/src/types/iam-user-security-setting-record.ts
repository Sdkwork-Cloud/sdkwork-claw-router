import type { JsonValue } from './json-value';

/** Iam user security setting record schema exposed by Claw Router. */
export interface IamUserSecuritySettingRecord {
  /** Created at field on iam user security setting record. */
  created_at?: string;
  /** Data scope field on iam user security setting record. */
  data_scope?: string;
  /** Deleted at field on iam user security setting record. */
  deleted_at?: string;
  /** Deleted by field on iam user security setting record. */
  deleted_by?: string;
  /** Id field on iam user security setting record. */
  id?: string;
  /** Last login at field on iam user security setting record. */
  last_login_at?: string;
  /** Last login ip hash field on iam user security setting record. */
  last_login_ip_hash?: string;
  /** Metadata field on iam user security setting record. */
  metadata?: Record<string, JsonValue>;
  /** Mfa enabled field on iam user security setting record. */
  mfa_enabled?: boolean;
  /** Mfa method field on iam user security setting record. */
  mfa_method?: string;
  /** Organization id field on iam user security setting record. */
  organization_id?: string;
  /** Owner id field on iam user security setting record. */
  owner_id?: string;
  /** Owner type field on iam user security setting record. */
  owner_type?: string;
  /** Password last changed at field on iam user security setting record. */
  password_last_changed_at?: string;
  /** Security level field on iam user security setting record. */
  security_level?: string;
  /** Status field on iam user security setting record. */
  status?: string;
  /** Tenant id field on iam user security setting record. */
  tenant_id?: string;
  /** Third party bound snapshot field on iam user security setting record. */
  third_party_bound_snapshot?: Record<string, JsonValue>;
  /** Trusted device count field on iam user security setting record. */
  trusted_device_count?: number;
  /** Updated at field on iam user security setting record. */
  updated_at?: string;
  /** User id field on iam user security setting record. */
  user_id?: string;
  /** Uuid field on iam user security setting record. */
  uuid?: string;
  /** Version field on iam user security setting record. */
  version?: string;
}
