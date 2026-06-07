import type { IamDepartmentAssignmentListResponse } from './iam-department-assignment-list-response';

/** Department assignments list result schema exposed by Claw Router. */
export interface DepartmentAssignmentsListResult {
  /** Business response code. */
  code: string;
  /** Data field on department assignments list result. */
  data?: IamDepartmentAssignmentListResponse;
  /** Human-readable response message. */
  msg?: string;
}
