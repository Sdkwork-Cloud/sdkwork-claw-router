import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Wallet points exchange rules list result schema exposed by Claw Router. */
export interface WalletPointsExchangeRulesListResult {
  /** Business response code. */
  code: string;
  /** Data field on wallet points exchange rules list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
