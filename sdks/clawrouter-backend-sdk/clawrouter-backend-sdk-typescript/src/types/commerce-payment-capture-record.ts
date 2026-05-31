/** Commerce payment capture record schema exposed by Claw Router. */
export interface CommercePaymentCaptureRecord {
  /** Amount field on commerce payment capture record. */
  amount: string;
  /** Capture no field on commerce payment capture record. */
  capture_no: string;
  /** Created at field on commerce payment capture record. */
  created_at: string;
  /** Currency code field on commerce payment capture record. */
  currency_code: string;
  /** Failed at field on commerce payment capture record. */
  failed_at?: string;
  /** Failure code field on commerce payment capture record. */
  failure_code?: string;
  /** Failure message field on commerce payment capture record. */
  failure_message?: string;
  /** Idempotency key field on commerce payment capture record. */
  idempotency_key: string;
  /** Native capture id field on commerce payment capture record. */
  native_capture_id?: string;
  /** Organization id field on commerce payment capture record. */
  organization_id?: string;
  /** Payment attempt id field on commerce payment capture record. */
  payment_attempt_id: string;
  /** Provider account id field on commerce payment capture record. */
  provider_account_id?: string;
  /** Provider code field on commerce payment capture record. */
  provider_code: string;
  /** Request no field on commerce payment capture record. */
  request_no: string;
  /** Status field on commerce payment capture record. */
  status: string;
  /** Submitted at field on commerce payment capture record. */
  submitted_at?: string;
  /** Succeeded at field on commerce payment capture record. */
  succeeded_at?: string;
  /** Tenant id field on commerce payment capture record. */
  tenant_id: string;
  /** Updated at field on commerce payment capture record. */
  updated_at: string;
}
