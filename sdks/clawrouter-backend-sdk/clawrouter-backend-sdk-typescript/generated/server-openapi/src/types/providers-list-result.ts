import type { OpenPlatformProviderListResponse } from './open-platform-provider-list-response';

/** Providers list result schema exposed by Claw Router. */
export interface ProvidersListResult {
  /** Business response code. */
  code: string;
  /** Data field on providers list result. */
  data?: OpenPlatformProviderListResponse;
  /** Human-readable response message. */
  msg?: string;
}
