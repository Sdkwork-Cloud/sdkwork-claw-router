/** Storage usage counter schema exposed by Claw Router. */
export interface StorageUsageCounter {
  /** File count field on storage usage counter. */
  fileCount: string;
  /** Files field on storage usage counter. */
  files?: string;
  /** Id field on storage usage counter. */
  id: string;
  /** Reserved field on storage usage counter. */
  reserved?: string;
  /** Reserved bytes field on storage usage counter. */
  reservedBytes: string;
  /** Scope field on storage usage counter. */
  scope?: string;
  /** Scope id field on storage usage counter. */
  scopeId: string;
  /** Scope type field on storage usage counter. */
  scopeType: 'app' | 'business_domain' | 'organization' | 'space' | 'tenant' | 'user';
  /** Snapshot at field on storage usage counter. */
  snapshotAt?: string;
  /** Updated at field on storage usage counter. */
  updatedAt?: string;
  /** Used field on storage usage counter. */
  used?: string;
  /** Used bytes field on storage usage counter. */
  usedBytes: string;
}
