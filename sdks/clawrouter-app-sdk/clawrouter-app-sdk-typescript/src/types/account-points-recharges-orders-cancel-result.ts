import type { CommerceOperationResponse } from './commerce-operation-response';

/** Account points recharges orders cancel result schema exposed by Claw Router. */
export interface AccountPointsRechargesOrdersCancelResult {
  /** Business response code. */
  code: string;
  /** Data field on account points recharges orders cancel result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
