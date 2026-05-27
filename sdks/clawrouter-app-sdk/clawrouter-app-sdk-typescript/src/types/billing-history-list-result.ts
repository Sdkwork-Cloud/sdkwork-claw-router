import type { BillingHistoryCollectionResponse } from './billing-history-collection-response';

/** Billing history list result schema exposed by Claw Router. */
export interface BillingHistoryListResult {
  /** Business response code. */
  code: string;
  /** Data field on billing history list result. */
  data?: BillingHistoryCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
