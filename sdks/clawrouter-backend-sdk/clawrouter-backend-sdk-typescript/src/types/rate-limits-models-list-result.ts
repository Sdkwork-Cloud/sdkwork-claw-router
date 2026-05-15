import type { AdminModelLimitsResponse } from './admin-model-limits-response';

/** Rate limits models list result schema exposed by Claw Router. */
export interface RateLimitsModelsListResult {
  /** Business response code. */
  code: string;
  /** Data field on rate limits models list result. */
  data?: AdminModelLimitsResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
