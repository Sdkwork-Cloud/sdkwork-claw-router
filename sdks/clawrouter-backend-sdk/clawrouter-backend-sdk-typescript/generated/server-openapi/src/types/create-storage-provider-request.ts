/** Create storage provider request schema exposed by Claw Router. */
export interface CreateStorageProviderRequest {
  /** Credential ref field on create storage provider request. */
  credentialRef: string;
  /** Endpoint field on create storage provider request. */
  endpoint?: string;
  /** Endpoint url field on create storage provider request. */
  endpointUrl?: string;
  /** Lifecycle field on create storage provider request. */
  lifecycle?: boolean;
  /** Multipart field on create storage provider request. */
  multipart?: boolean;
  /** Object lock field on create storage provider request. */
  objectLock?: boolean;
  /** Path style enabled field on create storage provider request. */
  pathStyleEnabled?: boolean;
  /** Provider code field on create storage provider request. */
  providerCode: string;
  /** Provider type field on create storage provider request. */
  providerType: 'aws_s3' | 'cloudflare_r2' | 'cos_s3' | 'local_dev_s3' | 'minio' | 'oss_s3' | 's3_compatible';
  /** Region field on create storage provider request. */
  region?: string;
  /** Supports lifecycle field on create storage provider request. */
  supportsLifecycle?: boolean;
  /** Supports multipart field on create storage provider request. */
  supportsMultipart?: boolean;
  /** Supports object lock field on create storage provider request. */
  supportsObjectLock?: boolean;
}
