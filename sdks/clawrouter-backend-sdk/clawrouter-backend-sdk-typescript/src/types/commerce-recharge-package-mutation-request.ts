/** Commerce recharge package mutation request schema exposed by Claw Router. */
export interface CommerceRechargePackageMutationRequest {
  /** Bonus field on commerce recharge package mutation request. */
  bonus: number;
  /** Rmb field on commerce recharge package mutation request. */
  rmb: string;
  /** Status field on commerce recharge package mutation request. */
  status?: 'active' | 'inactive';
}
