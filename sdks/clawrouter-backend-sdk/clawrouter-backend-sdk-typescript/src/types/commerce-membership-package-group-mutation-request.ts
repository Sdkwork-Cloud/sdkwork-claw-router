/** Commerce membership package group mutation request schema exposed by Claw Router. */
export interface CommerceMembershipPackageGroupMutationRequest {
  /** Billing cycle field on commerce membership package group mutation request. */
  billingCycle: string;
  /** Code field on commerce membership package group mutation request. */
  code: string;
  /** Description field on commerce membership package group mutation request. */
  description?: string | null;
  /** Duration days field on commerce membership package group mutation request. */
  durationDays: number;
  /** Name field on commerce membership package group mutation request. */
  name: string;
  /** Sort weight field on commerce membership package group mutation request. */
  sortWeight?: number;
  /** Status field on commerce membership package group mutation request. */
  status?: 'active' | 'inactive' | 'disabled';
}
