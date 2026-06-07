import type { IamDepartmentListResponse } from './iam-department-list-response';

/** Departments list result schema exposed by Claw Router. */
export interface DepartmentsListResult {
  /** Business response code. */
  code: string;
  /** Data field on departments list result. */
  data?: IamDepartmentListResponse;
  /** Human-readable response message. */
  msg?: string;
}
