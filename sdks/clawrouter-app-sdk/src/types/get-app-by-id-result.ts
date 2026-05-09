import type { AppDetailResponse } from './app-detail-response';

export interface GetAppByIdResult {
  /** Business response code. */
  code: string;
  data?: AppDetailResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
