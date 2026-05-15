import type { CommerceOperationResponse } from './commerce-operation-response';

/** Account points exchanges create result schema exposed by Claw Router. */
export interface AccountPointsExchangesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on account points exchanges create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
