import { getSdkworkAppbaseAppSdkClient } from './sdk-clients.ts';

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
  cursor?: string;
  page?: number;
  page_size?: number;
  pageSize?: number;
  sort?: string;
}

export async function fetchIamOrganizations(params?: IamDirectoryListParams) {
  return getSdkworkAppbaseAppSdkClient().iam.organizations.list(normalizeIamDirectoryListParams(params));
}

export async function fetchIamOrganizationTree(params?: IamDirectoryListParams) {
  void params;
  return getSdkworkAppbaseAppSdkClient().iam.organizations.tree.retrieve();
}

export async function fetchIamOrganizationMemberships(params?: IamDirectoryListParams) {
  return getSdkworkAppbaseAppSdkClient().iam.organizationMemberships.list(normalizeIamDirectoryListParams(params));
}

export async function fetchIamDepartments(params?: IamDirectoryListParams) {
  return getSdkworkAppbaseAppSdkClient().iam.departments.list(normalizeIamDirectoryListParams(params));
}

export async function fetchIamDepartmentTree(params?: IamDirectoryListParams) {
  void params;
  return getSdkworkAppbaseAppSdkClient().iam.departments.tree.retrieve();
}

export async function fetchIamDepartmentAssignments(params?: IamDirectoryListParams) {
  return getSdkworkAppbaseAppSdkClient().iam.departmentAssignments.list(normalizeIamDirectoryListParams(params));
}

export async function fetchIamPositions(params?: IamDirectoryListParams) {
  return getSdkworkAppbaseAppSdkClient().iam.positions.list(normalizeIamDirectoryListParams(params));
}

export async function fetchIamPositionAssignments(params?: IamDirectoryListParams) {
  return getSdkworkAppbaseAppSdkClient().iam.positionAssignments.list(normalizeIamDirectoryListParams(params));
}

export async function fetchIamRoleBindings(params?: IamDirectoryListParams) {
  return getSdkworkAppbaseAppSdkClient().iam.roleBindings.list(normalizeIamDirectoryListParams(params));
}

function normalizeIamDirectoryListParams(params: IamDirectoryListParams | undefined): {
  cursor?: string;
  page?: number;
  pageSize?: number;
  q?: string;
  sort?: string;
} | undefined {
  if (!params) {
    return undefined;
  }
  const pageSize = params.pageSize ?? params.page_size;
  return {
    ...(params.cursor ? { cursor: params.cursor } : {}),
    ...(params.page !== undefined ? { page: params.page } : {}),
    ...(pageSize !== undefined ? { pageSize } : {}),
    ...(params.q ? { q: params.q } : {}),
    ...(params.sort ? { sort: params.sort } : {}),
  };
}
