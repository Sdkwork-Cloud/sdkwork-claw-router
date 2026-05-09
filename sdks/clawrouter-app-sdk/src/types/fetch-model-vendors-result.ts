import type { RankingVendorOptionsResponse } from './ranking-vendor-options-response';

export interface FetchModelVendorsResult {
  /** Business response code. */
  code: string;
  data?: RankingVendorOptionsResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
