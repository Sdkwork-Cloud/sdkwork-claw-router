import type { MessagingCollectionResponse } from './messaging-collection-response';

/** Provider accounts list result schema exposed by Claw Router. */
export interface ProviderAccountsListResult {
  /** Business response code. */
  code: string;
  /** Data field on provider accounts list result. */
  data?: MessagingCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
