import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Memberships entitlements list result schema exposed by Claw Router. */
export interface MembershipsEntitlementsListResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships entitlements list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
