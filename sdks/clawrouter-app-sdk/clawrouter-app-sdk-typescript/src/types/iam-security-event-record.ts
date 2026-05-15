import type { JsonValue } from './json-value';

/** Iam security event record schema exposed by Claw Router. */
export interface IamSecurityEventRecord {
  /** Created at field on iam security event record. */
  created_at?: string;
  /** Detail json field on iam security event record. */
  detail_json?: Record<string, JsonValue>;
  /** Event type field on iam security event record. */
  event_type?: string;
  /** Id field on iam security event record. */
  id?: string;
  /** Session id field on iam security event record. */
  session_id?: string;
  /** Severity field on iam security event record. */
  severity?: string;
  /** Tenant id field on iam security event record. */
  tenant_id?: string;
  /** User id field on iam security event record. */
  user_id?: string;
}
