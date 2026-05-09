import type { AdminPromoCodeStatusUpdateResponse } from './admin-promo-code-status-update-response';

export interface UpdatePromoCodeStatusResult {
  /** Business response code. */
  code: string;
  data?: AdminPromoCodeStatusUpdateResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
