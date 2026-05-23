/** Commerce refund attempt record schema exposed by Claw Router. */
export interface CommerceRefundAttemptRecord {
  /** Amount field on commerce refund attempt record. */
  amount: string;
  /** Created at field on commerce refund attempt record. */
  created_at: string;
  /** Currency code field on commerce refund attempt record. */
  currency_code: string;
  /** Failed at field on commerce refund attempt record. */
  failed_at?: string;
  /** Failure code field on commerce refund attempt record. */
  failure_code?: string;
  /** Failure message field on commerce refund attempt record. */
  failure_message?: string;
  /** Organization id field on commerce refund attempt record. */
  organization_id?: string;
  /** Out refund no field on commerce refund attempt record. */
  out_refund_no: string;
  /** Provider account id field on commerce refund attempt record. */
  provider_account_id?: string;
  /** Provider code field on commerce refund attempt record. */
  provider_code: string;
  /** Provider refund id field on commerce refund attempt record. */
  provider_refund_id?: string;
  /** Refund attempt no field on commerce refund attempt record. */
  refund_attempt_no: string;
  /** Refund id field on commerce refund attempt record. */
  refund_id: string;
  /** Status field on commerce refund attempt record. */
  status: string;
  /** Submitted at field on commerce refund attempt record. */
  submitted_at?: string;
  /** Succeeded at field on commerce refund attempt record. */
  succeeded_at?: string;
  /** Tenant id field on commerce refund attempt record. */
  tenant_id: string;
  /** Updated at field on commerce refund attempt record. */
  updated_at: string;
}
