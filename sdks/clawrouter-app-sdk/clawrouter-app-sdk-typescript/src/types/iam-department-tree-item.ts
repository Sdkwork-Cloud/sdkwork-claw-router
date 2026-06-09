import type { JsonValue } from './json-value';

/** Iam department tree item schema exposed by Claw Router. */
export interface IamDepartmentTreeItem {
  /** Children field on iam department tree item. */
  children: Record<string, JsonValue>[];
  /** Code field on iam department tree item. */
  code: string;
  /** Created at field on iam department tree item. */
  createdAt: string;
  /** Id field on iam department tree item. */
  id: string;
  /** Name field on iam department tree item. */
  name: string;
  /** Organization id field on iam department tree item. */
  organizationId: string;
  /** Parent department id field on iam department tree item. */
  parentDepartmentId?: string | null;
  /** Path field on iam department tree item. */
  path: string;
  /** Status field on iam department tree item. */
  status: string;
  /** Tenant id field on iam department tree item. */
  tenantId: string;
  /** Updated at field on iam department tree item. */
  updatedAt: string;
}
