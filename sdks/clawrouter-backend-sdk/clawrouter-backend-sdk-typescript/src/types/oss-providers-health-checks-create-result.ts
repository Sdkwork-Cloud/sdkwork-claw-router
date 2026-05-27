import type { StorageProviderHealthCheckResponse } from './storage-provider-health-check-response';

/** Oss providers health checks create result schema exposed by Claw Router. */
export interface OssProvidersHealthChecksCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on oss providers health checks create result. */
  data?: StorageProviderHealthCheckResponse;
  /** Human-readable response message. */
  msg?: string;
}
