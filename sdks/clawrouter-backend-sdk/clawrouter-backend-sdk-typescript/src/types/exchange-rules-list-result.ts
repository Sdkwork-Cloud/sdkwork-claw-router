import type { AdminExchangeRulesResponse } from './admin-exchange-rules-response';

/** Exchange rules list result schema exposed by Claw Router. */
export interface ExchangeRulesListResult {
  /** Business response code. */
  code: string;
  /** Data field on exchange rules list result. */
  data?: AdminExchangeRulesResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
