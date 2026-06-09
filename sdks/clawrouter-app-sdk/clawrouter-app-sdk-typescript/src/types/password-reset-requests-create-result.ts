import type { IamPasswordResetRequestResponse } from './iam-password-reset-request-response';

/** Password reset requests create result schema exposed by Claw Router. */
export interface PasswordResetRequestsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on password reset requests create result. */
  data?: IamPasswordResetRequestResponse;
  /** Human-readable response message. */
  msg?: string;
}
