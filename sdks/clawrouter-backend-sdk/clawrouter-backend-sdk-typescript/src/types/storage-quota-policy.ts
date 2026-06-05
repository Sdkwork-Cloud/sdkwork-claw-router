/** Storage quota policy schema exposed by Claw Router. */
export interface StorageQuotaPolicy {
  /** Created at field on storage quota policy. */
  createdAt?: string;
  /** Enforcement field on storage quota policy. */
  enforcement?: string;
  /** Id field on storage quota policy. */
  id: string;
  /** Limit field on storage quota policy. */
  limit?: string;
  /** Quota limit bytes field on storage quota policy. */
  quotaLimitBytes: string;
  /** Scope id field on storage quota policy. */
  scopeId: string;
  /** Scope type field on storage quota policy. */
  scopeType: 'app' | 'organization' | 'space' | 'tenant' | 'user';
  /** Single file limit bytes field on storage quota policy. */
  singleFileLimitBytes?: string;
  /** Status field on storage quota policy. */
  status: 'active' | 'archived' | 'disabled';
  /** Updated at field on storage quota policy. */
  updatedAt?: string;
  /** Used field on storage quota policy. */
  used?: string;
  /** Used bytes field on storage quota policy. */
  usedBytes: string;
}
