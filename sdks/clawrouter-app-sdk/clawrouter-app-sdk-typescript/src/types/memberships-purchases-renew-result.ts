import type { CommerceOperationResponse } from './commerce-operation-response';

/** Memberships purchases renew result schema exposed by Claw Router. */
export interface MembershipsPurchasesRenewResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships purchases renew result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
