import type { JsonValue } from './json-value';

/** Iam session record schema exposed by Claw Router. */
export interface IamSessionRecord {
  /** Access token hash field on iam session record. */
  access_token_hash?: string;
  /** App id field on iam session record. */
  app_id?: string;
  /** Auth level field on iam session record. */
  auth_level?: string;
  /** Auth token hash field on iam session record. */
  auth_token_hash?: string;
  /** Created at field on iam session record. */
  created_at?: string;
  /** Data scope json field on iam session record. */
  data_scope_json?: Record<string, JsonValue>;
  /** Deployment mode field on iam session record. */
  deployment_mode?: string;
  /** Environment field on iam session record. */
  environment?: string;
  /** Expires at field on iam session record. */
  expires_at?: string;
  /** Id field on iam session record. */
  id?: string;
  /** Organization id field on iam session record. */
  organization_id?: string;
  /** Permission scope json field on iam session record. */
  permission_scope_json?: Record<string, JsonValue>;
  /** Refresh token hash field on iam session record. */
  refresh_token_hash?: string;
  /** Revoked at field on iam session record. */
  revoked_at?: string;
  /** Sharding key field on iam session record. */
  sharding_key?: string;
  /** Sharding strategy field on iam session record. */
  sharding_strategy?: string;
  /** Tenant id field on iam session record. */
  tenant_id?: string;
  /** Updated at field on iam session record. */
  updated_at?: string;
  /** User id field on iam session record. */
  user_id?: string;
}
