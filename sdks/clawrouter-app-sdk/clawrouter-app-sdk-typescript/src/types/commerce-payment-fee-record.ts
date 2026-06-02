/** Commerce payment fee record schema exposed by Claw Router. */
export interface CommercePaymentFeeRecord {
  /** Amount field on commerce payment fee record. */
  amount: string;
  /** Created at field on commerce payment fee record. */
  created_at: string;
  /** Currency code field on commerce payment fee record. */
  currency_code: string;
  /** Fee type field on commerce payment fee record. */
  fee_type: string;
  /** Id field on commerce payment fee record. */
  id?: string;
  /** Occurred at field on commerce payment fee record. */
  occurred_at: string;
  /** Organization id field on commerce payment fee record. */
  organization_id?: string;
  /** Payment attempt id field on commerce payment fee record. */
  payment_attempt_id?: string;
  /** Provider account id field on commerce payment fee record. */
  provider_account_id?: string;
  /** Provider code field on commerce payment fee record. */
  provider_code: string;
  /** Refund id field on commerce payment fee record. */
  refund_id?: string;
  /** Statement item id field on commerce payment fee record. */
  statement_item_id?: string;
  /** Tenant id field on commerce payment fee record. */
  tenant_id: string;
}
