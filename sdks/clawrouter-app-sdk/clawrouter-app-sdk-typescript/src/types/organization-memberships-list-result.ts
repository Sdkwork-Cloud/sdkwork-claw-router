import type { IamOrganizationMembershipListResponse } from './iam-organization-membership-list-response';

/** Organization memberships list result schema exposed by Claw Router. */
export interface OrganizationMembershipsListResult {
  /** Business response code. */
  code: string;
  /** Data field on organization memberships list result. */
  data?: IamOrganizationMembershipListResponse;
  /** Human-readable response message. */
  msg?: string;
}
