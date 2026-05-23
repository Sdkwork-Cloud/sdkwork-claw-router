import type { CommerceOperationResponse } from './commerce-operation-response';

/** Memberships purchases upgrade result schema exposed by Claw Router. */
export interface MembershipsPurchasesUpgradeResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships purchases upgrade result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
