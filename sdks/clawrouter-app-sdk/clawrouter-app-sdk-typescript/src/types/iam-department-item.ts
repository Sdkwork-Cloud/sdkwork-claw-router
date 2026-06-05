/** Iam department item schema exposed by Claw Router. */
export interface IamDepartmentItem {
  /** Code field on iam department item. */
  code: string;
  /** Created at field on iam department item. */
  createdAt: string;
  /** Id field on iam department item. */
  id: string;
  /** Name field on iam department item. */
  name: string;
  /** Organization id field on iam department item. */
  organizationId: string;
  /** Parent department id field on iam department item. */
  parentDepartmentId?: string | null;
  /** Path field on iam department item. */
  path: string;
  /** Status field on iam department item. */
  status: string;
  /** Tenant id field on iam department item. */
  tenantId: string;
  /** Updated at field on iam department item. */
  updatedAt: string;
}
