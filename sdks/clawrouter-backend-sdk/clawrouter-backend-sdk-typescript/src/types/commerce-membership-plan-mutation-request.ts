import type { CommerceMembershipBenefitMutationRequest } from './commerce-membership-benefit-mutation-request';

/** Commerce membership plan mutation request schema exposed by Claw Router. */
export interface CommerceMembershipPlanMutationRequest {
  /** Benefits field on commerce membership plan mutation request. */
  benefits?: CommerceMembershipBenefitMutationRequest[];
  /** Code field on commerce membership plan mutation request. */
  code: string;
  /** Name field on commerce membership plan mutation request. */
  name: string;
  /** Rank field on commerce membership plan mutation request. */
  rank?: number;
  /** Status field on commerce membership plan mutation request. */
  status?: 'active' | 'inactive' | 'disabled';
}
