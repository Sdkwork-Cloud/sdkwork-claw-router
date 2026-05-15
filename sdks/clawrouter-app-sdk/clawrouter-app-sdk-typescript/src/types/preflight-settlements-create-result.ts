import type { CommerceOperationResponse } from './commerce-operation-response';

/** Preflight settlements create result schema exposed by Claw Router. */
export interface PreflightSettlementsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on preflight settlements create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
