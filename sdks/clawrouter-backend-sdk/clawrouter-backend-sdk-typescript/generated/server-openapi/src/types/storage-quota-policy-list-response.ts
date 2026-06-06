import type { StorageQuotaPolicy } from './storage-quota-policy';

/** Storage quota policy list response schema exposed by Claw Router. */
export interface StorageQuotaPolicyListResponse {
  /** Items field on storage quota policy list response. */
  items: StorageQuotaPolicy[];
  /** Request id field on storage quota policy list response. */
  requestId: string;
}
