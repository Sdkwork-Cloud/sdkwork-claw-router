import type { IamLoginQrCodeStatusResponse } from './iam-login-qr-code-status-response';

/** Login qr codes confirm result schema exposed by Claw Router. */
export interface LoginQrCodesConfirmResult {
  /** Business response code. */
  code: string;
  /** Data field on login qr codes confirm result. */
  data?: IamLoginQrCodeStatusResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
