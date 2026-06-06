import type { StorageProviderConfig } from './storage-provider-config';

/** Storage provider list response schema exposed by Claw Router. */
export interface StorageProviderListResponse {
  /** Items field on storage provider list response. */
  items: StorageProviderConfig[];
  /** Request id field on storage provider list response. */
  requestId: string;
}
