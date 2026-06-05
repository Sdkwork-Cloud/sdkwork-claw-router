import type { IamOrganizationItem } from './iam-organization-item';

/** Iam organization list response schema exposed by Claw Router. */
export interface IamOrganizationListResponse {
  /** Items field on iam organization list response. */
  items: IamOrganizationItem[];
}
