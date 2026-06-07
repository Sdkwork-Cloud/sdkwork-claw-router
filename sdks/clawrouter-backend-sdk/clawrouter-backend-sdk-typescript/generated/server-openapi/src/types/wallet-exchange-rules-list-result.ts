import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Wallet exchange rules list result schema exposed by Claw Router. */
export interface WalletExchangeRulesListResult {
  /** Business response code. */
  code: string;
  /** Data field on wallet exchange rules list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
