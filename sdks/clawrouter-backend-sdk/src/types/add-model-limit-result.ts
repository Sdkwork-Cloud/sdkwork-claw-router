import type { AdminRateLimitMutationResponse } from './admin-rate-limit-mutation-response';

export interface AddModelLimitResult {
  /** Business response code. */
  code: string;
  data?: AdminRateLimitMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
