import type { IamVerificationCodeResponse } from './iam-verification-code-response';

/** Verification codes create result schema exposed by Claw Router. */
export interface VerificationCodesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on verification codes create result. */
  data?: IamVerificationCodeResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
