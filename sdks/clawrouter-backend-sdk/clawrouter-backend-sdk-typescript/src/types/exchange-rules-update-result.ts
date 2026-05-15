import type { AdminExchangeRuleMutationResponse } from './admin-exchange-rule-mutation-response';

/** Exchange rules update result schema exposed by Claw Router. */
export interface ExchangeRulesUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on exchange rules update result. */
  data?: AdminExchangeRuleMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
