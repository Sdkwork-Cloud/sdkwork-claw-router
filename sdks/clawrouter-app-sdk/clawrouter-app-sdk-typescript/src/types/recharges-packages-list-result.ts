import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Recharges packages list result schema exposed by Claw Router. */
export interface RechargesPackagesListResult {
  /** Business response code. */
  code: string;
  /** Data field on recharges packages list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
