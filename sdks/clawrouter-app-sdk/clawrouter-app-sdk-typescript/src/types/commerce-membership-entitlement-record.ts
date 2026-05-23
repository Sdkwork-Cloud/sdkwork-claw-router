/** Commerce membership entitlement record schema exposed by Claw Router. */
export interface CommerceMembershipEntitlementRecord {
  /** Created at field on commerce membership entitlement record. */
  created_at: string;
  /** Entitlement code field on commerce membership entitlement record. */
  entitlement_code: string;
  /** Name field on commerce membership entitlement record. */
  name: string;
  /** Organization id field on commerce membership entitlement record. */
  organization_id?: string;
  /** Plan id field on commerce membership entitlement record. */
  plan_id?: string;
  /** Quota amount field on commerce membership entitlement record. */
  quota_amount: string;
  /** Quota period field on commerce membership entitlement record. */
  quota_period?: string;
  /** Reset policy field on commerce membership entitlement record. */
  reset_policy?: string;
  /** Status field on commerce membership entitlement record. */
  status: string;
  /** Tenant id field on commerce membership entitlement record. */
  tenant_id: string;
  /** Updated at field on commerce membership entitlement record. */
  updated_at: string;
}
