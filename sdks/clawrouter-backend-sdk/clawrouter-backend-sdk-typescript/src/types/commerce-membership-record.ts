/** Commerce membership record schema exposed by Claw Router. */
export interface CommerceMembershipRecord {
  /** Created at field on commerce membership record. */
  created_at: string;
  /** Expires at field on commerce membership record. */
  expires_at: string;
  /** Grace until field on commerce membership record. */
  grace_until?: string;
  /** Membership no field on commerce membership record. */
  membership_no: string;
  /** Organization id field on commerce membership record. */
  organization_id?: string;
  /** Owner user id field on commerce membership record. */
  owner_user_id: string;
  /** Plan id field on commerce membership record. */
  plan_id: string;
  /** Source order id field on commerce membership record. */
  source_order_id?: string;
  /** Source payment intent id field on commerce membership record. */
  source_payment_intent_id?: string;
  /** Starts at field on commerce membership record. */
  starts_at: string;
  /** Status field on commerce membership record. */
  status: string;
  /** Tenant id field on commerce membership record. */
  tenant_id: string;
  /** Updated at field on commerce membership record. */
  updated_at: string;
}
