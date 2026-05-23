import type { CommerceOperationResponse } from './commerce-operation-response';

/** Recharges orders create result schema exposed by Claw Router. */
export interface RechargesOrdersCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on recharges orders create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
