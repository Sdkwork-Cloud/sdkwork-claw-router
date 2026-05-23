/** Commerce order cancellation record schema exposed by Claw Router. */
export interface CommerceOrderCancellationRecord {
  /** Approved by field on commerce order cancellation record. */
  approved_by?: string;
  /** Cancellation no field on commerce order cancellation record. */
  cancellation_no: string;
  /** Completed at field on commerce order cancellation record. */
  completed_at?: string;
  /** Created at field on commerce order cancellation record. */
  created_at: string;
  /** Idempotency key field on commerce order cancellation record. */
  idempotency_key: string;
  /** Order id field on commerce order cancellation record. */
  order_id: string;
  /** Organization id field on commerce order cancellation record. */
  organization_id?: string;
  /** Reason code field on commerce order cancellation record. */
  reason_code: string;
  /** Reason message field on commerce order cancellation record. */
  reason_message?: string;
  /** Requested by field on commerce order cancellation record. */
  requested_by: string;
  /** Status field on commerce order cancellation record. */
  status: string;
  /** Tenant id field on commerce order cancellation record. */
  tenant_id: string;
}
