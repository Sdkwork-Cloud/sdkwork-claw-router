import type { StorageQuotaPolicyListResponse } from './storage-quota-policy-list-response';

/** Oss quotas list result schema exposed by Claw Router. */
export interface OssQuotasListResult {
  /** Business response code. */
  code: string;
  /** Data field on oss quotas list result. */
  data?: StorageQuotaPolicyListResponse;
  /** Human-readable response message. */
  msg?: string;
}
