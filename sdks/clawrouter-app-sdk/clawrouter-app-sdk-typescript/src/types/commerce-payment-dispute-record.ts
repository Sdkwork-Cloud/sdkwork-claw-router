/** Commerce payment dispute record schema exposed by Claw Router. */
export interface CommercePaymentDisputeRecord {
  /** Amount field on commerce payment dispute record. */
  amount: string;
  /** Closed at field on commerce payment dispute record. */
  closed_at?: string;
  /** Created at field on commerce payment dispute record. */
  created_at: string;
  /** Currency code field on commerce payment dispute record. */
  currency_code: string;
  /** Dispute no field on commerce payment dispute record. */
  dispute_no: string;
  /** Evidence due at field on commerce payment dispute record. */
  evidence_due_at?: string;
  /** Native dispute id field on commerce payment dispute record. */
  native_dispute_id: string;
  /** Opened at field on commerce payment dispute record. */
  opened_at: string;
  /** Organization id field on commerce payment dispute record. */
  organization_id?: string;
  /** Payment attempt id field on commerce payment dispute record. */
  payment_attempt_id: string;
  /** Provider account id field on commerce payment dispute record. */
  provider_account_id?: string;
  /** Provider code field on commerce payment dispute record. */
  provider_code: string;
  /** Reason code field on commerce payment dispute record. */
  reason_code?: string;
  /** Status field on commerce payment dispute record. */
  status: string;
  /** Tenant id field on commerce payment dispute record. */
  tenant_id: string;
  /** Updated at field on commerce payment dispute record. */
  updated_at: string;
}
