import type { CommerceOperationResponse } from './commerce-operation-response';

/** Addresses delete result schema exposed by Claw Router. */
export interface AddressesDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on addresses delete result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
