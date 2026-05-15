import type { JsonValue } from './json-value';

/** Iam audit event record schema exposed by Claw Router. */
export interface IamAuditEventRecord {
  /** Action field on iam audit event record. */
  action?: string;
  /** Actor user id field on iam audit event record. */
  actor_user_id?: string;
  /** App id field on iam audit event record. */
  app_id?: string;
  /** Created at field on iam audit event record. */
  created_at?: string;
  /** Detail json field on iam audit event record. */
  detail_json?: Record<string, JsonValue>;
  /** Environment field on iam audit event record. */
  environment?: string;
  /** Id field on iam audit event record. */
  id?: string;
  /** Organization id field on iam audit event record. */
  organization_id?: string;
  /** Request id field on iam audit event record. */
  request_id?: string;
  /** Resource id field on iam audit event record. */
  resource_id?: string;
  /** Resource type field on iam audit event record. */
  resource_type?: string;
  /** Sharding key field on iam audit event record. */
  sharding_key?: string;
  /** Tenant id field on iam audit event record. */
  tenant_id?: string;
}
