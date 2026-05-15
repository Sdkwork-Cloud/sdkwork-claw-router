import type { CommerceOperationResponse } from './commerce-operation-response';

/** Preflight releases create result schema exposed by Claw Router. */
export interface PreflightReleasesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on preflight releases create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
