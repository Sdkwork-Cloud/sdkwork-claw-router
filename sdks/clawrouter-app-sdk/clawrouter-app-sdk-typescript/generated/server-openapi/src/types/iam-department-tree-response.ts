import type { IamDepartmentTreeItem } from './iam-department-tree-item';

/** Iam department tree response schema exposed by Claw Router. */
export interface IamDepartmentTreeResponse {
  /** Items field on iam department tree response. */
  items: IamDepartmentTreeItem[];
}
