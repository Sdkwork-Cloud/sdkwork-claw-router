import type { MessagingCollectionResponse } from './messaging-collection-response';

/** Route rules list result schema exposed by Claw Router. */
export interface RouteRulesListResult {
  /** Business response code. */
  code: string;
  /** Data field on route rules list result. */
  data?: MessagingCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
