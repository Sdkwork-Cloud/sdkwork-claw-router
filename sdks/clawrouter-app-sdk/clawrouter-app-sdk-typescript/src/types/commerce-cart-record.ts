/** Commerce cart record schema exposed by Claw Router. */
export interface CommerceCartRecord {
  /** Cart no field on commerce cart record. */
  cart_no: string;
  /** Created at field on commerce cart record. */
  created_at: string;
  /** Currency code field on commerce cart record. */
  currency_code: string;
  /** Organization id field on commerce cart record. */
  organization_id?: string;
  /** Owner user id field on commerce cart record. */
  owner_user_id: string;
  /** Status field on commerce cart record. */
  status: string;
  /** Tenant id field on commerce cart record. */
  tenant_id: string;
  /** Updated at field on commerce cart record. */
  updated_at: string;
}
