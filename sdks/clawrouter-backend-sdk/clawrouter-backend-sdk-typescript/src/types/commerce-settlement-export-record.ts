import type { JsonValue } from './json-value';

/** Commerce settlement export record schema exposed by Claw Router. */
export interface CommerceSettlementExportRecord {
  /** Approved by field on commerce settlement export record. */
  approved_by?: string;
  /** Audit log id field on commerce settlement export record. */
  audit_log_id?: string;
  /** Created at field on commerce settlement export record. */
  created_at?: string;
  /** Created by field on commerce settlement export record. */
  created_by?: string;
  /** Download count field on commerce settlement export record. */
  download_count?: string;
  /** Expire at field on commerce settlement export record. */
  expire_at?: string;
  /** Export no field on commerce settlement export record. */
  export_no?: string;
  /** Export type field on commerce settlement export record. */
  export_type?: string;
  /** File hash field on commerce settlement export record. */
  file_hash?: string;
  /** File manifest field on commerce settlement export record. */
  file_manifest?: Record<string, JsonValue>;
  /** Id field on commerce settlement export record. */
  id?: string;
  /** Legal hold field on commerce settlement export record. */
  legal_hold?: boolean;
  /** Metadata field on commerce settlement export record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on commerce settlement export record. */
  organization_id?: string;
  /** Payload hash field on commerce settlement export record. */
  payload_hash?: string;
  /** Period end field on commerce settlement export record. */
  period_end?: string;
  /** Period start field on commerce settlement export record. */
  period_start?: string;
  /** Request id field on commerce settlement export record. */
  request_id?: string;
  /** Retention until field on commerce settlement export record. */
  retention_until?: string;
  /** Statement id field on commerce settlement export record. */
  statement_id?: string;
  /** Status field on commerce settlement export record. */
  status?: string;
  /** Tenant id field on commerce settlement export record. */
  tenant_id?: string;
  /** Trace id field on commerce settlement export record. */
  trace_id?: string;
  /** User id field on commerce settlement export record. */
  user_id?: string;
  /** Uuid field on commerce settlement export record. */
  uuid?: string;
}
