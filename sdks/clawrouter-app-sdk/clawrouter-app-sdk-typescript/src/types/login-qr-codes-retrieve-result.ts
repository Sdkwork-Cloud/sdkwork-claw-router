import type { IamLoginQrCodeStatusResponse } from './iam-login-qr-code-status-response';

/** Login qr codes retrieve result schema exposed by Claw Router. */
export interface LoginQrCodesRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on login qr codes retrieve result. */
  data?: IamLoginQrCodeStatusResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
