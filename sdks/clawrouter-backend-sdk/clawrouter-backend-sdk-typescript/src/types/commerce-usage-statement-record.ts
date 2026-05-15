import type { JsonValue } from './json-value';

/** Commerce usage statement record schema exposed by Claw Router. */
export interface CommerceUsageStatementRecord {
  /** Created at field on commerce usage statement record. */
  created_at?: string;
  /** Currency field on commerce usage statement record. */
  currency?: string;
  /** Due at field on commerce usage statement record. */
  due_at?: string;
  /** Export id field on commerce usage statement record. */
  export_id?: string;
  /** Generated at field on commerce usage statement record. */
  generated_at?: string;
  /** Id field on commerce usage statement record. */
  id?: string;
  /** Invoice id field on commerce usage statement record. */
  invoice_id?: string;
  /** Metadata field on commerce usage statement record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on commerce usage statement record. */
  organization_id?: string;
  /** Owner id field on commerce usage statement record. */
  owner_id?: string;
  /** Owner type field on commerce usage statement record. */
  owner_type?: string;
  /** Paid at field on commerce usage statement record. */
  paid_at?: string;
  /** Payment status field on commerce usage statement record. */
  payment_status?: string;
  /** Period field on commerce usage statement record. */
  period?: string;
  /** Period end field on commerce usage statement record. */
  period_end?: string;
  /** Period start field on commerce usage statement record. */
  period_start?: string;
  /** Rebuild version field on commerce usage statement record. */
  rebuild_version?: string;
  /** Source id field on commerce usage statement record. */
  source_id?: string;
  /** Source type field on commerce usage statement record. */
  source_type?: string;
  /** Source version field on commerce usage statement record. */
  source_version?: string;
  /** Statement no field on commerce usage statement record. */
  statement_no?: string;
  /** Statement status field on commerce usage statement record. */
  statement_status?: string;
  /** Status field on commerce usage statement record. */
  status?: string;
  /** Tenant id field on commerce usage statement record. */
  tenant_id?: string;
  /** Total cost field on commerce usage statement record. */
  total_cost?: string;
  /** Total requests field on commerce usage statement record. */
  total_requests?: string;
  /** Total tokens field on commerce usage statement record. */
  total_tokens?: string;
  /** Updated at field on commerce usage statement record. */
  updated_at?: string;
  /** Uuid field on commerce usage statement record. */
  uuid?: string;
}
