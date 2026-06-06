import type { MessagingCollectionResponse } from './messaging-collection-response';

/** Templates list result schema exposed by Claw Router. */
export interface TemplatesListResult {
  /** Business response code. */
  code: string;
  /** Data field on templates list result. */
  data?: MessagingCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
