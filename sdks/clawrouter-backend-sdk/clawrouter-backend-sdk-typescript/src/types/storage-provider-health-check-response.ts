/** Storage provider health check response schema exposed by Claw Router. */
export interface StorageProviderHealthCheckResponse {
  /** Checked at field on storage provider health check response. */
  checkedAt?: string;
  /** Healthy field on storage provider health check response. */
  healthy: boolean;
  /** Provider id field on storage provider health check response. */
  providerId: string;
  /** Request id field on storage provider health check response. */
  requestId: string;
  /** Status field on storage provider health check response. */
  status: string;
}
