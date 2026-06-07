/** Storage provider config schema exposed by Claw Router. */
export interface StorageProviderConfig {
  /** Created at field on storage provider config. */
  createdAt?: string;
  /** Credential ref field on storage provider config. */
  credentialRef: string;
  /** Endpoint field on storage provider config. */
  endpoint?: string;
  /** Endpoint url field on storage provider config. */
  endpointUrl?: string;
  /** Health field on storage provider config. */
  health: string;
  /** Health status field on storage provider config. */
  healthStatus?: string;
  /** Id field on storage provider config. */
  id: string;
  /** Last health check at field on storage provider config. */
  lastHealthCheckAt?: string;
  /** Lifecycle field on storage provider config. */
  lifecycle?: boolean;
  /** Multipart field on storage provider config. */
  multipart?: boolean;
  /** Object lock field on storage provider config. */
  objectLock?: boolean;
  /** Path style enabled field on storage provider config. */
  pathStyleEnabled?: boolean;
  /** Provider code field on storage provider config. */
  providerCode: string;
  /** Provider type field on storage provider config. */
  providerType: 'aws_s3' | 'cloudflare_r2' | 'cos_s3' | 'local_dev_s3' | 'minio' | 'oss_s3' | 's3_compatible';
  /** Region field on storage provider config. */
  region?: string;
  /** Status field on storage provider config. */
  status: 'active' | 'archived' | 'disabled';
  /** Supports lifecycle field on storage provider config. */
  supportsLifecycle?: boolean;
  /** Supports multipart field on storage provider config. */
  supportsMultipart?: boolean;
  /** Supports object lock field on storage provider config. */
  supportsObjectLock?: boolean;
  /** Updated at field on storage provider config. */
  updatedAt?: string;
}
