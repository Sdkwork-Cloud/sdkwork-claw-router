import type { StorageQuotaPolicyMutationResponse } from './storage-quota-policy-mutation-response';

/** Oss quotas create result schema exposed by Claw Router. */
export interface OssQuotasCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on oss quotas create result. */
  data?: StorageQuotaPolicyMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
