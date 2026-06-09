import type { IamDepartmentAssignmentItem } from './iam-department-assignment-item';

/** Iam department assignment list response schema exposed by Claw Router. */
export interface IamDepartmentAssignmentListResponse {
  /** Items field on iam department assignment list response. */
  items: IamDepartmentAssignmentItem[];
}
