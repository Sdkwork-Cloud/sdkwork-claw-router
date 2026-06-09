import type { IamOrganizationTreeItem } from './iam-organization-tree-item';

/** Iam organization tree response schema exposed by Claw Router. */
export interface IamOrganizationTreeResponse {
  /** Items field on iam organization tree response. */
  items: IamOrganizationTreeItem[];
}
