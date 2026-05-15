import type { CommerceOperationResponse } from './commerce-operation-response';

/** Account points transfers create result schema exposed by Claw Router. */
export interface AccountPointsTransfersCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on account points transfers create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
