/** Create storage quota policy request schema exposed by Claw Router. */
export interface CreateStorageQuotaPolicyRequest {
  /** Enforcement field on create storage quota policy request. */
  enforcement?: string;
  /** Quota limit field on create storage quota policy request. */
  quotaLimit?: string;
  /** Quota limit bytes field on create storage quota policy request. */
  quotaLimitBytes: string;
  /** Scope id field on create storage quota policy request. */
  scopeId: string;
  /** Scope type field on create storage quota policy request. */
  scopeType: 'app' | 'organization' | 'space' | 'tenant' | 'user';
  /** Single file limit bytes field on create storage quota policy request. */
  singleFileLimitBytes?: string;
}
