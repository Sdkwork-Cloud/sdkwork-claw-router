import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Wallet exchange rate retrieve result schema exposed by Claw Router. */
export interface WalletExchangeRateRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on wallet exchange rate retrieve result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
