import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Accounts current summary retrieve result schema exposed by Claw Router. */
export interface AccountsCurrentSummaryRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on accounts current summary retrieve result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
