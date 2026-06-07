import type { StorageProviderMutationResponse } from './storage-provider-mutation-response';

/** Oss providers create result schema exposed by Claw Router. */
export interface OssProvidersCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on oss providers create result. */
  data?: StorageProviderMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
