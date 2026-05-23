import type { CommerceOperationResponse } from './commerce-operation-response';

/** Cart items update result schema exposed by Claw Router. */
export interface CartItemsUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on cart items update result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
