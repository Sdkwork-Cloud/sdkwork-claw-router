import type { IamOrganizationTreeResponse } from './iam-organization-tree-response';

/** Organizations tree retrieve result schema exposed by Claw Router. */
export interface OrganizationsTreeRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on organizations tree retrieve result. */
  data?: IamOrganizationTreeResponse;
  /** Human-readable response message. */
  msg?: string;
}
