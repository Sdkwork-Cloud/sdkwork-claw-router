/** Commerce inventory ledger record schema exposed by Claw Router. */
export interface CommerceInventoryLedgerRecord {
  /** Balance after field on commerce inventory ledger record. */
  balance_after: string;
  /** Business type field on commerce inventory ledger record. */
  business_type: string;
  /** Created at field on commerce inventory ledger record. */
  created_at: string;
  /** Direction field on commerce inventory ledger record. */
  direction: string;
  /** Id field on commerce inventory ledger record. */
  id?: string;
  /** Idempotency key field on commerce inventory ledger record. */
  idempotency_key: string;
  /** Movement no field on commerce inventory ledger record. */
  movement_no: string;
  /** Organization id field on commerce inventory ledger record. */
  organization_id?: string;
  /** Quantity field on commerce inventory ledger record. */
  quantity: string;
  /** Sku id field on commerce inventory ledger record. */
  sku_id: string;
  /** Source id field on commerce inventory ledger record. */
  source_id: string;
  /** Source type field on commerce inventory ledger record. */
  source_type: string;
  /** Tenant id field on commerce inventory ledger record. */
  tenant_id: string;
  /** Warehouse id field on commerce inventory ledger record. */
  warehouse_id?: string;
}
