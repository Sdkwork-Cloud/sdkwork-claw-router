import { getClawRouterAppSdkClient } from './sdk-clients.ts';

export interface IamDirectoryListParams {
  organization_id?: string;
  organizationId?: string;
  department_id?: string;
  departmentId?: string;
  user_id?: string;
  userId?: string;
  scope_id?: string;
  scopeId?: string;
  status?: string;
  q?: string;
  page?: number;
  page_size?: number;
  pageSize?: number;
}

export async function fetchIamOrganizations(params?: IamDirectoryListParams) {
  return getClawRouterAppSdkClient().iam.organizations.list(params);
}

export async function fetchIamOrganizationTree(params?: IamDirectoryListParams) {
  return getClawRouterAppSdkClient().iam.organizations.tree.retrieve(params);
}

export async function fetchIamOrganizationMemberships(params?: IamDirectoryListParams) {
  return getClawRouterAppSdkClient().iam.organizationMemberships.list(params);
}

export async function fetchIamDepartments(params?: IamDirectoryListParams) {
  return getClawRouterAppSdkClient().iam.departments.list(params);
}

export async function fetchIamDepartmentTree(params?: IamDirectoryListParams) {
  return getClawRouterAppSdkClient().iam.departments.tree.retrieve(params);
}

export async function fetchIamDepartmentAssignments(params?: IamDirectoryListParams) {
  return getClawRouterAppSdkClient().iam.departmentAssignments.list(params);
}

export async function fetchIamPositions(params?: IamDirectoryListParams) {
  return getClawRouterAppSdkClient().iam.positions.list(params);
}

export async function fetchIamPositionAssignments(params?: IamDirectoryListParams) {
  return getClawRouterAppSdkClient().iam.positionAssignments.list(params);
}

export async function fetchIamRoleBindings(params?: IamDirectoryListParams) {
  return getClawRouterAppSdkClient().iam.roleBindings.list(params);
}
