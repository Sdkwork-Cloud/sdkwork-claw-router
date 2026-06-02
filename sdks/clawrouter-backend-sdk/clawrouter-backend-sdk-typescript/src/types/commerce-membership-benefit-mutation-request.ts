import type { MediaResource } from './media-resource';

/** Commerce membership benefit mutation request schema exposed by Claw Router. */
export interface CommerceMembershipBenefitMutationRequest {
  /** Benefit key field on commerce membership benefit mutation request. */
  benefitKey?: string | null;
  /** Claimed field on commerce membership benefit mutation request. */
  claimed?: boolean;
  /** Description field on commerce membership benefit mutation request. */
  description?: string | null;
  /** Icon field on commerce membership benefit mutation request. */
  icon?: MediaResource;
  /** Id field on commerce membership benefit mutation request. */
  id?: number;
  /** Name field on commerce membership benefit mutation request. */
  name: string;
  /** Type field on commerce membership benefit mutation request. */
  type?: string | null;
  /** Usage limit field on commerce membership benefit mutation request. */
  usageLimit?: number | null;
  /** Used count field on commerce membership benefit mutation request. */
  usedCount?: number | null;
}
