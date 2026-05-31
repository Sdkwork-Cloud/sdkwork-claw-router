import type { CommerceOperationResponse } from './commerce-operation-response';

/** Recharges orders cancel result schema exposed by Claw Router. */
export interface RechargesOrdersCancelResult {
  /** Business response code. */
  code: string;
  /** Data field on recharges orders cancel result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
