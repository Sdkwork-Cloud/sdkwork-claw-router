import type { CommerceOperationResponse } from './commerce-operation-response';

/** Cart items create result schema exposed by Claw Router. */
export interface CartItemsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on cart items create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
