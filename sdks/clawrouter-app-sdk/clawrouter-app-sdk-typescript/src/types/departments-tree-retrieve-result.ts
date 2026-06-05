import type { IamDepartmentTreeResponse } from './iam-department-tree-response';

/** Departments tree retrieve result schema exposed by Claw Router. */
export interface DepartmentsTreeRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on departments tree retrieve result. */
  data?: IamDepartmentTreeResponse;
  /** Human-readable response message. */
  msg?: string;
}
