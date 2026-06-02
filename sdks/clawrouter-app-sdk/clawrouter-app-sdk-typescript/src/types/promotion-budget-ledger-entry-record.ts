/** Promotion budget ledger entry record schema exposed by Claw Router. */
export interface PromotionBudgetLedgerEntryRecord {
  /** Amount delta minor field on promotion budget ledger entry record. */
  amount_delta_minor: string;
  /** Application id field on promotion budget ledger entry record. */
  application_id?: string;
  /** Balance amount minor field on promotion budget ledger entry record. */
  balance_amount_minor: string;
  /** Balance quantity field on promotion budget ledger entry record. */
  balance_quantity: string;
  /** Budget account id field on promotion budget ledger entry record. */
  budget_account_id: string;
  /** Business type field on promotion budget ledger entry record. */
  business_type: string;
  /** Created at field on promotion budget ledger entry record. */
  created_at: string;
  /** Currency code field on promotion budget ledger entry record. */
  currency_code: string;
  /** Direction field on promotion budget ledger entry record. */
  direction: string;
  /** Id field on promotion budget ledger entry record. */
  id?: string;
  /** Idempotency key field on promotion budget ledger entry record. */
  idempotency_key: string;
  /** Ledger no field on promotion budget ledger entry record. */
  ledger_no: string;
  /** Occurred at field on promotion budget ledger entry record. */
  occurred_at: string;
  /** Organization id field on promotion budget ledger entry record. */
  organization_id?: string;
  /** Quantity delta field on promotion budget ledger entry record. */
  quantity_delta: string;
  /** Request no field on promotion budget ledger entry record. */
  request_no: string;
  /** Source id field on promotion budget ledger entry record. */
  source_id: string;
  /** Source type field on promotion budget ledger entry record. */
  source_type: string;
  /** Tenant id field on promotion budget ledger entry record. */
  tenant_id: string;
}
