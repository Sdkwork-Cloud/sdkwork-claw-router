import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Wallet tokens retrieve result schema exposed by Claw Router. */
export interface WalletTokensRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on wallet tokens retrieve result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
