/** Commerce membership package mutation request schema exposed by Claw Router. */
export interface CommerceMembershipPackageMutationRequest {
  /** Code field on commerce membership package mutation request. */
  code: string;
  /** Currency code field on commerce membership package mutation request. */
  currencyCode?: string;
  /** Duration days field on commerce membership package mutation request. */
  durationDays: number;
  /** Name field on commerce membership package mutation request. */
  name: string;
  /** Package group id field on commerce membership package mutation request. */
  packageGroupId: string;
  /** Plan id field on commerce membership package mutation request. */
  planId: string;
  /** Price amount field on commerce membership package mutation request. */
  priceAmount: string;
  /** Status field on commerce membership package mutation request. */
  status?: 'active' | 'inactive' | 'disabled';
}
