import type { JsonValue } from './json-value';

/** Integration provider invoice import record schema exposed by Claw Router. */
export interface IntegrationProviderInvoiceImportRecord {
  /** Created at field on integration provider invoice import record. */
  created_at?: string;
  /** Currency field on integration provider invoice import record. */
  currency?: string;
  /** Id field on integration provider invoice import record. */
  id?: string;
  /** Import no field on integration provider invoice import record. */
  import_no?: string;
  /** Import status field on integration provider invoice import record. */
  import_status?: string;
  /** Legal hold field on integration provider invoice import record. */
  legal_hold?: boolean;
  /** Metadata field on integration provider invoice import record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on integration provider invoice import record. */
  organization_id?: string;
  /** Payload hash field on integration provider invoice import record. */
  payload_hash?: string;
  /** Period end field on integration provider invoice import record. */
  period_end?: string;
  /** Period start field on integration provider invoice import record. */
  period_start?: string;
  /** Provider account id field on integration provider invoice import record. */
  provider_account_id?: string;
  /** Provider code field on integration provider invoice import record. */
  provider_code?: string;
  /** Request id field on integration provider invoice import record. */
  request_id?: string;
  /** Retention until field on integration provider invoice import record. */
  retention_until?: string;
  /** Source file ref field on integration provider invoice import record. */
  source_file_ref?: string;
  /** Source hash field on integration provider invoice import record. */
  source_hash?: string;
  /** Status field on integration provider invoice import record. */
  status?: string;
  /** Tenant id field on integration provider invoice import record. */
  tenant_id?: string;
  /** Total amount field on integration provider invoice import record. */
  total_amount?: string;
  /** Trace id field on integration provider invoice import record. */
  trace_id?: string;
  /** User id field on integration provider invoice import record. */
  user_id?: string;
  /** Uuid field on integration provider invoice import record. */
  uuid?: string;
}
