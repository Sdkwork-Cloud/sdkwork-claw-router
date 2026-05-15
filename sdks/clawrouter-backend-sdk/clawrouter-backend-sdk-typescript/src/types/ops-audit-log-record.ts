import type { JsonValue } from './json-value';

/** Ops audit log record schema exposed by Claw Router. */
export interface OpsAuditLogRecord {
  /** Action field on ops audit log record. */
  action?: string;
  /** After hash field on ops audit log record. */
  after_hash?: string;
  /** Approval id field on ops audit log record. */
  approval_id?: string;
  /** Before hash field on ops audit log record. */
  before_hash?: string;
  /** Change summary field on ops audit log record. */
  change_summary?: Record<string, JsonValue>;
  /** Client ip hash field on ops audit log record. */
  client_ip_hash?: string;
  /** Created at field on ops audit log record. */
  created_at?: string;
  /** Id field on ops audit log record. */
  id?: string;
  /** Legal hold field on ops audit log record. */
  legal_hold?: boolean;
  /** Metadata field on ops audit log record. */
  metadata?: Record<string, JsonValue>;
  /** Operator id field on ops audit log record. */
  operator_id?: string;
  /** Operator name snapshot field on ops audit log record. */
  operator_name_snapshot?: string;
  /** Operator type field on ops audit log record. */
  operator_type?: string;
  /** Organization id field on ops audit log record. */
  organization_id?: string;
  /** Request id field on ops audit log record. */
  request_id?: string;
  /** Retention until field on ops audit log record. */
  retention_until?: string;
  /** Risk level field on ops audit log record. */
  risk_level?: string;
  /** Target id field on ops audit log record. */
  target_id?: string;
  /** Target type field on ops audit log record. */
  target_type?: string;
  /** Target uuid field on ops audit log record. */
  target_uuid?: string;
  /** Tenant id field on ops audit log record. */
  tenant_id?: string;
  /** Trace id field on ops audit log record. */
  trace_id?: string;
  /** User agent hash field on ops audit log record. */
  user_agent_hash?: string;
  /** Uuid field on ops audit log record. */
  uuid?: string;
}
