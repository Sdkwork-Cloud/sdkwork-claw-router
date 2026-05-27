import type { JsonValue } from './json-value';

/** Commerce usage service provider reconciliation run record schema exposed by Claw Router. */
export interface CommerceUsageServiceProviderReconciliationRunRecord {
  /** Created at field on commerce usage service provider reconciliation run record. */
  created_at?: string;
  /** Difference amount field on commerce usage service provider reconciliation run record. */
  difference_amount?: string;
  /** Id field on commerce usage service provider reconciliation run record. */
  id?: string;
  /** Legal hold field on commerce usage service provider reconciliation run record. */
  legal_hold?: boolean;
  /** Matched count field on commerce usage service provider reconciliation run record. */
  matched_count?: string;
  /** Metadata field on commerce usage service provider reconciliation run record. */
  metadata?: Record<string, JsonValue>;
  /** Mismatch count field on commerce usage service provider reconciliation run record. */
  mismatch_count?: string;
  /** Missing external count field on commerce usage service provider reconciliation run record. */
  missing_external_count?: string;
  /** Missing internal count field on commerce usage service provider reconciliation run record. */
  missing_internal_count?: string;
  /** Organization id field on commerce usage service provider reconciliation run record. */
  organization_id?: string;
  /** Payload hash field on commerce usage service provider reconciliation run record. */
  payload_hash?: string;
  /** Period end field on commerce usage service provider reconciliation run record. */
  period_end?: string;
  /** Period start field on commerce usage service provider reconciliation run record. */
  period_start?: string;
  /** Request id field on commerce usage service provider reconciliation run record. */
  request_id?: string;
  /** Retention until field on commerce usage service provider reconciliation run record. */
  retention_until?: string;
  /** Run no field on commerce usage service provider reconciliation run record. */
  run_no?: string;
  /** Scope id field on commerce usage service provider reconciliation run record. */
  scope_id?: string;
  /** Scope type field on commerce usage service provider reconciliation run record. */
  scope_type?: string;
  /** Status field on commerce usage service provider reconciliation run record. */
  status?: string;
  /** Tenant id field on commerce usage service provider reconciliation run record. */
  tenant_id?: string;
  /** Total external amount field on commerce usage service provider reconciliation run record. */
  total_external_amount?: string;
  /** Total internal amount field on commerce usage service provider reconciliation run record. */
  total_internal_amount?: string;
  /** Trace id field on commerce usage service provider reconciliation run record. */
  trace_id?: string;
  /** User id field on commerce usage service provider reconciliation run record. */
  user_id?: string;
  /** Uuid field on commerce usage service provider reconciliation run record. */
  uuid?: string;
}
