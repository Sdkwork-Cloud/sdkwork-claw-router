import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Wallet overview retrieve result schema exposed by Claw Router. */
export interface WalletOverviewRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on wallet overview retrieve result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
