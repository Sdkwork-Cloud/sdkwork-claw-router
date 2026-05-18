import type { JsonValue } from './json-value';

/** Iam policy record schema exposed by Claw Router. */
export interface IamPolicyRecord {
  /** Code field on iam policy record. */
  code?: string;
  /** Created at field on iam policy record. */
  created_at?: string;
  /** Id field on iam policy record. */
  id?: string;
  /** Name field on iam policy record. */
  name?: string;
  /** Policy json field on iam policy record. */
  policy_json?: Record<string, JsonValue>;
  /** Status field on iam policy record. */
  status?: string;
  /** Tenant id field on iam policy record. */
  tenant_id?: string;
  /** Updated at field on iam policy record. */
  updated_at?: string;
}
