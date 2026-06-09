import type { IamOrganizationListResponse } from './iam-organization-list-response';

/** Organizations list result schema exposed by Claw Router. */
export interface OrganizationsListResult {
  /** Business response code. */
  code: string;
  /** Data field on organizations list result. */
  data?: IamOrganizationListResponse;
  /** Human-readable response message. */
  msg?: string;
}
