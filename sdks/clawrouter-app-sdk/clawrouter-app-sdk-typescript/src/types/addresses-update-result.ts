import type { CommerceOperationResponse } from './commerce-operation-response';

/** Addresses update result schema exposed by Claw Router. */
export interface AddressesUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on addresses update result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
