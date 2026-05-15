/** Iam registration create request schema exposed by Claw Router. */
export interface IamRegistrationCreateRequest {
  /** Channel field on iam registration create request. */
  channel?: 'EMAIL' | 'PHONE';
  /** Confirm password field on iam registration create request. */
  confirmPassword?: string;
  /** Email field on iam registration create request. */
  email?: string;
  /** Organization code field on iam registration create request. */
  organizationCode?: string;
  /** Password field on iam registration create request. */
  password: string;
  /** Phone field on iam registration create request. */
  phone?: string;
  /** Tenant code field on iam registration create request. */
  tenantCode?: string;
  /** Username field on iam registration create request. */
  username: string;
  /** Verification code field on iam registration create request. */
  verificationCode: string;
}
