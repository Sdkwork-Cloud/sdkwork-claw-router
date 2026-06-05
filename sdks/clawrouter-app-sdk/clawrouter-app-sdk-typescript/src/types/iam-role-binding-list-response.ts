import type { IamRoleBindingItem } from './iam-role-binding-item';

/** Iam role binding list response schema exposed by Claw Router. */
export interface IamRoleBindingListResponse {
  /** Items field on iam role binding list response. */
  items: IamRoleBindingItem[];
}
