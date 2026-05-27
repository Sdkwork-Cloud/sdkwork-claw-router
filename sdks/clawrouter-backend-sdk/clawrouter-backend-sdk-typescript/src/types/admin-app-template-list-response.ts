import type { AdminAppTemplateItemResponse } from './admin-app-template-item-response';

/** Admin app template list response schema exposed by Claw Router. */
export interface AdminAppTemplateListResponse {
  /** Has next page field on admin app template list response. */
  hasNextPage: boolean;
  /** App template snapshots returned by the backend management API. */
  items: AdminAppTemplateItemResponse[];
  /** Page field on admin app template list response. */
  page: number;
  /** Page size field on admin app template list response. */
  pageSize: number;
  /** Total field on admin app template list response. */
  total: number;
}
