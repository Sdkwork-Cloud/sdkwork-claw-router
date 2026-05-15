import type { CommercePointsExchangeRateResponse } from './commerce-points-exchange-rate-response';

/** Account points exchange rate retrieve result schema exposed by Claw Router. */
export interface AccountPointsExchangeRateRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on account points exchange rate retrieve result. */
  data?: CommercePointsExchangeRateResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
