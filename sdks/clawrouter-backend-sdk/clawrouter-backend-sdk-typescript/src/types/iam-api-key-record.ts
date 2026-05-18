import type { JsonValue } from './json-value';

/** Iam api key record schema exposed by Claw Router. */
export interface IamApiKeyRecord {
  /** Created at field on iam api key record. */
  created_at?: string;
  /** Expires at field on iam api key record. */
  expires_at?: string;
  /** Id field on iam api key record. */
  id?: string;
  /** Key hash field on iam api key record. */
  key_hash?: string;
  /** Name field on iam api key record. */
  name?: string;
  /** Permission scope json field on iam api key record. */
  permission_scope_json?: Record<string, JsonValue>;
  /** Status field on iam api key record. */
  status?: string;
  /** Tenant id field on iam api key record. */
  tenant_id?: string;
  /** Updated at field on iam api key record. */
  updated_at?: string;
  /** User id field on iam api key record. */
  user_id?: string;
}
