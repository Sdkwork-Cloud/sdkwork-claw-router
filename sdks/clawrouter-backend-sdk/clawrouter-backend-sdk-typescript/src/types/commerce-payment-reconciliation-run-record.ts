/** Commerce payment reconciliation run record schema exposed by Claw Router. */
export interface CommercePaymentReconciliationRunRecord {
  /** Completed at field on commerce payment reconciliation run record. */
  completed_at?: string;
  /** Created at field on commerce payment reconciliation run record. */
  created_at: string;
  /** Difference amount field on commerce payment reconciliation run record. */
  difference_amount: string;
  /** Idempotency key field on commerce payment reconciliation run record. */
  idempotency_key: string;
  /** Matched count field on commerce payment reconciliation run record. */
  matched_count: string;
  /** Mismatched count field on commerce payment reconciliation run record. */
  mismatched_count: string;
  /** Missing internal count field on commerce payment reconciliation run record. */
  missing_internal_count: string;
  /** Missing provider count field on commerce payment reconciliation run record. */
  missing_provider_count: string;
  /** Organization id field on commerce payment reconciliation run record. */
  organization_id?: string;
  /** Period end field on commerce payment reconciliation run record. */
  period_end: string;
  /** Period start field on commerce payment reconciliation run record. */
  period_start: string;
  /** Provider account id field on commerce payment reconciliation run record. */
  provider_account_id?: string;
  /** Provider code field on commerce payment reconciliation run record. */
  provider_code: string;
  /** Report file ref field on commerce payment reconciliation run record. */
  report_file_ref?: string;
  /** Request no field on commerce payment reconciliation run record. */
  request_no: string;
  /** Run no field on commerce payment reconciliation run record. */
  run_no: string;
  /** Settlement currency field on commerce payment reconciliation run record. */
  settlement_currency: string;
  /** Started at field on commerce payment reconciliation run record. */
  started_at?: string;
  /** Status field on commerce payment reconciliation run record. */
  status: string;
  /** Tenant id field on commerce payment reconciliation run record. */
  tenant_id: string;
  /** Total internal amount field on commerce payment reconciliation run record. */
  total_internal_amount: string;
  /** Total provider amount field on commerce payment reconciliation run record. */
  total_provider_amount: string;
  /** Updated at field on commerce payment reconciliation run record. */
  updated_at: string;
}
