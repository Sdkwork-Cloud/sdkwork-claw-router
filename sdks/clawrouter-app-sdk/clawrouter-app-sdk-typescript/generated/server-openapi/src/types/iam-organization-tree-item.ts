import type { JsonValue } from './json-value';

/** Iam organization tree item schema exposed by Claw Router. */
export interface IamOrganizationTreeItem {
  /** Children field on iam organization tree item. */
  children: Record<string, JsonValue>[];
  /** Code field on iam organization tree item. */
  code: string;
  /** Created at field on iam organization tree item. */
  createdAt: string;
  /** Id field on iam organization tree item. */
  id: string;
  /** Name field on iam organization tree item. */
  name: string;
  /** Parent id field on iam organization tree item. */
  parentId?: string | null;
  /** Path field on iam organization tree item. */
  path: string;
  /** Status field on iam organization tree item. */
  status: string;
  /** Tenant id field on iam organization tree item. */
  tenantId: string;
  /** Updated at field on iam organization tree item. */
  updatedAt: string;
}
