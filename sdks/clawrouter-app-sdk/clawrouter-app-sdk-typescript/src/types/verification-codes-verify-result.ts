import type { IamVerificationCodeVerifyResponse } from './iam-verification-code-verify-response';

/** Verification codes verify result schema exposed by Claw Router. */
export interface VerificationCodesVerifyResult {
  /** Business response code. */
  code: string;
  /** Data field on verification codes verify result. */
  data?: IamVerificationCodeVerifyResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
