import type { IamLoginQrCodeResponse } from './iam-login-qr-code-response';

/** Login qr codes create result schema exposed by Claw Router. */
export interface LoginQrCodesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on login qr codes create result. */
  data?: IamLoginQrCodeResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
