import type { CommerceOperationResponse } from './commerce-operation-response';

/** Addresses create result schema exposed by Claw Router. */
export interface AddressesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on addresses create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
