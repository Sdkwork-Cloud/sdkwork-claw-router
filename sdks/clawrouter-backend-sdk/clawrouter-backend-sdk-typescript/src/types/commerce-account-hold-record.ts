/** Commerce account hold record schema exposed by Claw Router. */
export interface CommerceAccountHoldRecord {
  /** Account id field on commerce account hold record. */
  account_id: string;
  /** Amount field on commerce account hold record. */
  amount: string;
  /** Asset type field on commerce account hold record. */
  asset_type: string;
  /** Created at field on commerce account hold record. */
  created_at: string;
  /** Expires at field on commerce account hold record. */
  expires_at: string;
  /** Idempotency key field on commerce account hold record. */
  idempotency_key: string;
  /** Organization id field on commerce account hold record. */
  organization_id?: string;
  /** Owner user id field on commerce account hold record. */
  owner_user_id: string;
  /** Prehold no field on commerce account hold record. */
  prehold_no: string;
  /** Released at field on commerce account hold record. */
  released_at?: string;
  /** Request no field on commerce account hold record. */
  request_no: string;
  /** Settled at field on commerce account hold record. */
  settled_at?: string;
  /** Status field on commerce account hold record. */
  status: string;
  /** Tenant id field on commerce account hold record. */
  tenant_id: string;
  /** Updated at field on commerce account hold record. */
  updated_at: string;
}
