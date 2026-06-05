import type { IamRoleBindingListResponse } from './iam-role-binding-list-response';

/** Role bindings list result schema exposed by Claw Router. */
export interface RoleBindingsListResult {
  /** Business response code. */
  code: string;
  /** Data field on role bindings list result. */
  data?: IamRoleBindingListResponse;
  /** Human-readable response message. */
  msg?: string;
}
