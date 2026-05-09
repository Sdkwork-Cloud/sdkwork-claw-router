import type { AiModelVendorRecord } from './ai-model-vendor-record';

export interface FetchVendorsResult {
  /** Business response code. */
  code: string;
  data?: AiModelVendorRecord[];
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
