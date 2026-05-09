import type { AdminModelVendorMutationResponse } from './admin-model-vendor-mutation-response';

export interface AddVendorResult {
  /** Business response code. */
  code: string;
  data?: AdminModelVendorMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
