import type { CommerceOperationResponse } from './commerce-operation-response';

/** Orders cancellations create result schema exposed by Claw Router. */
export interface OrdersCancellationsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on orders cancellations create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
