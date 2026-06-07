import type { IamOrganizationMembershipItem } from './iam-organization-membership-item';

/** Iam organization membership list response schema exposed by Claw Router. */
export interface IamOrganizationMembershipListResponse {
  /** Items field on iam organization membership list response. */
  items: IamOrganizationMembershipItem[];
}
