/** Open platform qr auth password create request schema exposed by Claw Router. */
export interface OpenPlatformQrAuthPasswordCreateRequest {
  /** Channel field on open platform qr auth password create request. */
  channel?: 'EMAIL' | 'PHONE';
  /** Confirm password field on open platform qr auth password create request. */
  confirmPassword?: string;
  /** Email field on open platform qr auth password create request. */
  email?: string;
  /** Password field on open platform qr auth password create request. */
  password: string;
  /** Phone field on open platform qr auth password create request. */
  phone?: string;
  /** Username field on open platform qr auth password create request. */
  username: string;
  /** Verification code field on open platform qr auth password create request. */
  verificationCode?: string;
}
