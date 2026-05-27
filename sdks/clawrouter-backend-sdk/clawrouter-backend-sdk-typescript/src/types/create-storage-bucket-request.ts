/** Create storage bucket request schema exposed by Claw Router. */
export interface CreateStorageBucketRequest {
  /** Block public access field on create storage bucket request. */
  blockPublicAccess?: boolean;
  /** Bucket name field on create storage bucket request. */
  bucketName: string;
  /** Bucket region field on create storage bucket request. */
  bucketRegion?: string;
  /** Data residency region field on create storage bucket request. */
  dataResidencyRegion?: string;
  /** Default encryption mode field on create storage bucket request. */
  defaultEncryptionMode?: 'none' | 'sse_kms' | 'sse_s3';
  /** Default storage class field on create storage bucket request. */
  defaultStorageClass?: 'STANDARD' | 'INTELLIGENT_TIERING' | 'STANDARD_IA' | 'ONEZONE_IA' | 'GLACIER_IR' | 'GLACIER' | 'DEEP_ARCHIVE';
  /** Encryption field on create storage bucket request. */
  encryption?: string;
  /** Kms key ref field on create storage bucket request. */
  kmsKeyRef?: string;
  /** Lifecycle enabled field on create storage bucket request. */
  lifecycleEnabled?: boolean;
  /** Logical scope field on create storage bucket request. */
  logicalScope: 'migration_import' | 'system_archive' | 'system_quarantine' | 'system_temp' | 'system_variant' | 'tenant_private' | 'tenant_public_asset';
  /** Object key prefix field on create storage bucket request. */
  objectKeyPrefix?: string;
  /** Object lock enabled field on create storage bucket request. */
  objectLockEnabled?: boolean;
  /** Provider id field on create storage bucket request. */
  providerId: string;
  /** Public access blocked field on create storage bucket request. */
  publicAccessBlocked?: boolean;
  /** Storage class field on create storage bucket request. */
  storageClass?: string;
  /** Versioning enabled field on create storage bucket request. */
  versioningEnabled?: boolean;
}
