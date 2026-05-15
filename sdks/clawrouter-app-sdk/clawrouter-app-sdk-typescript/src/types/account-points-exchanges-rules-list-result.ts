import type { CommerceExchangeRulesResponse } from './commerce-exchange-rules-response';

/** Account points exchanges rules list result schema exposed by Claw Router. */
export interface AccountPointsExchangesRulesListResult {
  /** Business response code. */
  code: string;
  /** Data field on account points exchanges rules list result. */
  data?: CommerceExchangeRulesResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
