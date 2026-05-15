import type { JsonValue } from './json-value';

/** Commerce billing export record schema exposed by Claw Router. */
export interface CommerceBillingExportRecord {
  /** Approved by field on commerce billing export record. */
  approved_by?: string;
  /** Audit log id field on commerce billing export record. */
  audit_log_id?: string;
  /** Created at field on commerce billing export record. */
  created_at?: string;
  /** Created by field on commerce billing export record. */
  created_by?: string;
  /** Download count field on commerce billing export record. */
  download_count?: string;
  /** Expire at field on commerce billing export record. */
  expire_at?: string;
  /** Export no field on commerce billing export record. */
  export_no?: string;
  /** Export type field on commerce billing export record. */
  export_type?: string;
  /** File hash field on commerce billing export record. */
  file_hash?: string;
  /** File manifest field on commerce billing export record. */
  file_manifest?: Record<string, JsonValue>;
  /** Id field on commerce billing export record. */
  id?: string;
  /** Legal hold field on commerce billing export record. */
  legal_hold?: boolean;
  /** Metadata field on commerce billing export record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on commerce billing export record. */
  organization_id?: string;
  /** Payload hash field on commerce billing export record. */
  payload_hash?: string;
  /** Period end field on commerce billing export record. */
  period_end?: string;
  /** Period start field on commerce billing export record. */
  period_start?: string;
  /** Request id field on commerce billing export record. */
  request_id?: string;
  /** Retention until field on commerce billing export record. */
  retention_until?: string;
  /** Statement id field on commerce billing export record. */
  statement_id?: string;
  /** Status field on commerce billing export record. */
  status?: string;
  /** Tenant id field on commerce billing export record. */
  tenant_id?: string;
  /** Trace id field on commerce billing export record. */
  trace_id?: string;
  /** User id field on commerce billing export record. */
  user_id?: string;
  /** Uuid field on commerce billing export record. */
  uuid?: string;
}
