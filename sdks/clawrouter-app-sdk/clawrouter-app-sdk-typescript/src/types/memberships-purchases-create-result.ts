import type { CommerceOperationResponse } from './commerce-operation-response';

/** Memberships purchases create result schema exposed by Claw Router. */
export interface MembershipsPurchasesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships purchases create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
