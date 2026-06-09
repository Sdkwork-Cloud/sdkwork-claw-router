import type { IamDepartmentItem } from './iam-department-item';

/** Iam department list response schema exposed by Claw Router. */
export interface IamDepartmentListResponse {
  /** Items field on iam department list response. */
  items: IamDepartmentItem[];
}
