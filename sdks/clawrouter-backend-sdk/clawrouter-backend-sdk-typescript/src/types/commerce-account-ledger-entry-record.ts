/** Commerce account ledger entry record schema exposed by Claw Router. */
export interface CommerceAccountLedgerEntryRecord {
  /** Account id field on commerce account ledger entry record. */
  account_id: string;
  /** Amount field on commerce account ledger entry record. */
  amount: string;
  /** Asset type field on commerce account ledger entry record. */
  asset_type: string;
  /** Balance after field on commerce account ledger entry record. */
  balance_after: string;
  /** Business type field on commerce account ledger entry record. */
  business_type: string;
  /** Created at field on commerce account ledger entry record. */
  created_at: string;
  /** Direction field on commerce account ledger entry record. */
  direction: string;
  /** Id field on commerce account ledger entry record. */
  id?: string;
  /** Idempotency key field on commerce account ledger entry record. */
  idempotency_key: string;
  /** Organization id field on commerce account ledger entry record. */
  organization_id?: string;
  /** Owner user id field on commerce account ledger entry record. */
  owner_user_id: string;
  /** Remark field on commerce account ledger entry record. */
  remark?: string;
  /** Request no field on commerce account ledger entry record. */
  request_no: string;
  /** Source id field on commerce account ledger entry record. */
  source_id?: string;
  /** Source type field on commerce account ledger entry record. */
  source_type?: string;
  /** Tenant id field on commerce account ledger entry record. */
  tenant_id: string;
  /** Transaction no field on commerce account ledger entry record. */
  transaction_no: string;
}
