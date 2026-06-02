/** Commerce payment reconciliation item record schema exposed by Claw Router. */
export interface CommercePaymentReconciliationItemRecord {
  /** Created at field on commerce payment reconciliation item record. */
  created_at: string;
  /** Currency code field on commerce payment reconciliation item record. */
  currency_code?: string;
  /** Difference amount field on commerce payment reconciliation item record. */
  difference_amount?: string;
  /** Difference type field on commerce payment reconciliation item record. */
  difference_type: string;
  /** Id field on commerce payment reconciliation item record. */
  id?: string;
  /** Internal amount field on commerce payment reconciliation item record. */
  internal_amount?: string;
  /** Internal status field on commerce payment reconciliation item record. */
  internal_status?: string;
  /** Match status field on commerce payment reconciliation item record. */
  match_status: string;
  /** Organization id field on commerce payment reconciliation item record. */
  organization_id?: string;
  /** Payment attempt id field on commerce payment reconciliation item record. */
  payment_attempt_id?: string;
  /** Provider amount field on commerce payment reconciliation item record. */
  provider_amount?: string;
  /** Provider code field on commerce payment reconciliation item record. */
  provider_code: string;
  /** Provider status field on commerce payment reconciliation item record. */
  provider_status?: string;
  /** Reconciliation run id field on commerce payment reconciliation item record. */
  reconciliation_run_id: string;
  /** Refund attempt id field on commerce payment reconciliation item record. */
  refund_attempt_id?: string;
  /** Refund id field on commerce payment reconciliation item record. */
  refund_id?: string;
  /** Resolution note field on commerce payment reconciliation item record. */
  resolution_note?: string;
  /** Resolution status field on commerce payment reconciliation item record. */
  resolution_status: string;
  /** Resolved at field on commerce payment reconciliation item record. */
  resolved_at?: string;
  /** Resolved by field on commerce payment reconciliation item record. */
  resolved_by?: string;
  /** Statement id field on commerce payment reconciliation item record. */
  statement_id?: string;
  /** Statement item id field on commerce payment reconciliation item record. */
  statement_item_id?: string;
  /** Tenant id field on commerce payment reconciliation item record. */
  tenant_id: string;
  /** Updated at field on commerce payment reconciliation item record. */
  updated_at: string;
}
