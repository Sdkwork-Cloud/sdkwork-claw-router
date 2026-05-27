import type { StorageQuotaPolicy } from './storage-quota-policy';

/** Storage quota policy mutation response schema exposed by Claw Router. */
export interface StorageQuotaPolicyMutationResponse {
  /** Quota policy field on storage quota policy mutation response. */
  quotaPolicy: StorageQuotaPolicy;
  /** Request id field on storage quota policy mutation response. */
  requestId: string;
}
