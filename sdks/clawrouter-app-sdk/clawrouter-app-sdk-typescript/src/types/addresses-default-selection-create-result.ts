import type { CommerceOperationResponse } from './commerce-operation-response';

/** Addresses default selection create result schema exposed by Claw Router. */
export interface AddressesDefaultSelectionCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on addresses default selection create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
