/** Commerce refund record schema exposed by Claw Router. */
export interface CommerceRefundRecord {
  /** Amount field on commerce refund record. */
  amount: string;
  /** Created at field on commerce refund record. */
  created_at: string;
  /** Idempotency key field on commerce refund record. */
  idempotency_key: string;
  /** Payment attempt id field on commerce refund record. */
  payment_attempt_id: string;
  /** Refund no field on commerce refund record. */
  refund_no: string;
  /** Request no field on commerce refund record. */
  request_no: string;
  /** Status field on commerce refund record. */
  status: string;
  /** Tenant id field on commerce refund record. */
  tenant_id: string;
  /** Updated at field on commerce refund record. */
  updated_at: string;
}
