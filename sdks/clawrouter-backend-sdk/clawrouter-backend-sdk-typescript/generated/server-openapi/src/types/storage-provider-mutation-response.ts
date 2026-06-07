import type { StorageProviderConfig } from './storage-provider-config';

/** Storage provider mutation response schema exposed by Claw Router. */
export interface StorageProviderMutationResponse {
  /** Provider field on storage provider mutation response. */
  provider: StorageProviderConfig;
  /** Request id field on storage provider mutation response. */
  requestId: string;
}
