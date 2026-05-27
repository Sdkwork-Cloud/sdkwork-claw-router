/** Storage bucket config schema exposed by Claw Router. */
export interface StorageBucketConfig {
  /** Block public access field on storage bucket config. */
  blockPublicAccess?: boolean;
  /** Bucket name field on storage bucket config. */
  bucketName: string;
  /** Bucket region field on storage bucket config. */
  bucketRegion?: string;
  /** Created at field on storage bucket config. */
  createdAt?: string;
  /** Default encryption mode field on storage bucket config. */
  defaultEncryptionMode?: 'none' | 'sse_kms' | 'sse_s3';
  /** Default storage class field on storage bucket config. */
  defaultStorageClass?: 'STANDARD' | 'INTELLIGENT_TIERING' | 'STANDARD_IA' | 'ONEZONE_IA' | 'GLACIER_IR' | 'GLACIER' | 'DEEP_ARCHIVE';
  /** Encryption field on storage bucket config. */
  encryption?: string;
  /** Id field on storage bucket config. */
  id: string;
  /** Kms key ref field on storage bucket config. */
  kmsKeyRef?: string;
  /** Lifecycle enabled field on storage bucket config. */
  lifecycleEnabled?: boolean;
  /** Logical scope field on storage bucket config. */
  logicalScope: 'migration_import' | 'system_archive' | 'system_quarantine' | 'system_temp' | 'system_variant' | 'tenant_private' | 'tenant_public_asset';
  /** Object key prefix field on storage bucket config. */
  objectKeyPrefix?: string;
  /** Object lock enabled field on storage bucket config. */
  objectLockEnabled?: boolean;
  /** Provider code field on storage bucket config. */
  providerCode: string;
  /** Provider id field on storage bucket config. */
  providerId: string;
  /** Public access blocked field on storage bucket config. */
  publicAccessBlocked?: boolean;
  /** Status field on storage bucket config. */
  status: 'active' | 'archived' | 'disabled';
  /** Storage class field on storage bucket config. */
  storageClass?: string;
  /** Updated at field on storage bucket config. */
  updatedAt?: string;
  /** Versioning enabled field on storage bucket config. */
  versioningEnabled?: boolean;
}
