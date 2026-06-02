/** Commerce account record schema exposed by Claw Router. */
export interface CommerceAccountRecord {
  /** Asset type field on commerce account record. */
  asset_type: string;
  /** Available amount field on commerce account record. */
  available_amount: string;
  /** Created at field on commerce account record. */
  created_at: string;
  /** Currency code field on commerce account record. */
  currency_code?: string;
  /** Frozen amount field on commerce account record. */
  frozen_amount: string;
  /** Id field on commerce account record. */
  id?: string;
  /** Organization id field on commerce account record. */
  organization_id?: string;
  /** Owner user id field on commerce account record. */
  owner_user_id: string;
  /** Status field on commerce account record. */
  status: string;
  /** Tenant id field on commerce account record. */
  tenant_id: string;
  /** Updated at field on commerce account record. */
  updated_at: string;
  /** Version field on commerce account record. */
  version: string;
}
