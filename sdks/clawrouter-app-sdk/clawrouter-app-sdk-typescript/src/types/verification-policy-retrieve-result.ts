import type { AuthVerificationPolicy } from './auth-verification-policy';

/** Verification policy retrieve result schema exposed by Claw Router. */
export interface VerificationPolicyRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on verification policy retrieve result. */
  data?: AuthVerificationPolicy;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
