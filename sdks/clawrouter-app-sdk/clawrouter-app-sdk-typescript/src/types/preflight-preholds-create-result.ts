import type { CommerceOperationResponse } from './commerce-operation-response';

/** Preflight preholds create result schema exposed by Claw Router. */
export interface PreflightPreholdsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on preflight preholds create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
