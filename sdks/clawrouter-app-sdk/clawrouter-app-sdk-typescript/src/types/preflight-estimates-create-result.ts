import type { CommerceOperationResponse } from './commerce-operation-response';

/** Preflight estimates create result schema exposed by Claw Router. */
export interface PreflightEstimatesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on preflight estimates create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
