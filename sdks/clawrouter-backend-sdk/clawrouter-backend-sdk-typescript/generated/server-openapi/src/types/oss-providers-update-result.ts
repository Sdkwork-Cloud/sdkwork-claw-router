import type { StorageProviderMutationResponse } from './storage-provider-mutation-response';

/** Oss providers update result schema exposed by Claw Router. */
export interface OssProvidersUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on oss providers update result. */
  data?: StorageProviderMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
