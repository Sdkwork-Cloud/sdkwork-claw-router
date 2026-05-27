/** Storage default bucket config schema exposed by Claw Router. */
export interface StorageDefaultBucketConfig {
  /** Bucket id field on storage default bucket config. */
  bucketId: string;
  /** Bucket name field on storage default bucket config. */
  bucketName: string;
  /** Data residency region field on storage default bucket config. */
  dataResidencyRegion?: string;
  /** Id field on storage default bucket config. */
  id: string;
  /** Logical scope field on storage default bucket config. */
  logicalScope: 'migration_import' | 'system_archive' | 'system_quarantine' | 'system_temp' | 'system_variant' | 'tenant_private' | 'tenant_public_asset';
  /** Provider code field on storage default bucket config. */
  providerCode: string;
  /** Provider id field on storage default bucket config. */
  providerId: string;
  /** Provider type field on storage default bucket config. */
  providerType?: 'aws_s3' | 'cloudflare_r2' | 'cos_s3' | 'local_dev_s3' | 'minio' | 'oss_s3' | 's3_compatible';
  /** Reason field on storage default bucket config. */
  reason?: string;
  /** Region field on storage default bucket config. */
  region?: string;
  /** Status field on storage default bucket config. */
  status: 'active' | 'archived' | 'disabled';
  /** Updated at field on storage default bucket config. */
  updatedAt?: string;
}
