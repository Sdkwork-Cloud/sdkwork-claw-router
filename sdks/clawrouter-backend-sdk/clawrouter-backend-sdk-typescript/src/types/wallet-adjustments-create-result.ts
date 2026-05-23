import type { CommerceOperationResponse } from './commerce-operation-response';

/** Wallet adjustments create result schema exposed by Claw Router. */
export interface WalletAdjustmentsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on wallet adjustments create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
