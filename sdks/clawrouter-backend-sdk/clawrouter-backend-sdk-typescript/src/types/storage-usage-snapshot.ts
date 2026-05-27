/** Storage usage snapshot schema exposed by Claw Router. */
export interface StorageUsageSnapshot {
  /** File count field on storage usage snapshot. */
  fileCount: number;
  /** Id field on storage usage snapshot. */
  id: string;
  /** Reserved bytes field on storage usage snapshot. */
  reservedBytes?: number;
  /** Scope field on storage usage snapshot. */
  scope?: string;
  /** Scope id field on storage usage snapshot. */
  scopeId: string;
  /** Scope type field on storage usage snapshot. */
  scopeType: 'app' | 'business_domain' | 'organization' | 'space' | 'tenant' | 'user';
  /** Snapshot at field on storage usage snapshot. */
  snapshotAt: string;
  /** Snapshot type field on storage usage snapshot. */
  snapshotType?: string;
  /** Used bytes field on storage usage snapshot. */
  usedBytes: number;
}
