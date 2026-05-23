import type { CommerceOperationResponse } from './commerce-operation-response';

/** Cart items delete result schema exposed by Claw Router. */
export interface CartItemsDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on cart items delete result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
