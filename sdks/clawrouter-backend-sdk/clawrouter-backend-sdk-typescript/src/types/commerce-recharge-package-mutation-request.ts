/** Commerce recharge package mutation request schema exposed by Claw Router. */
export interface CommerceRechargePackageMutationRequest {
  /** Bonus points field on commerce recharge package mutation request. */
  bonusPoints: number;
  /** Currency code field on commerce recharge package mutation request. */
  currencyCode: string;
  /** Price amount field on commerce recharge package mutation request. */
  priceAmount: string;
  /** Status field on commerce recharge package mutation request. */
  status?: 'active' | 'inactive';
}
