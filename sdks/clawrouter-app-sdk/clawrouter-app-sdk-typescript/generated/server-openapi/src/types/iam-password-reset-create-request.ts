/** Iam password reset create request schema exposed by Claw Router. */
export interface IamPasswordResetCreateRequest {
  /** Account field on iam password reset create request. */
  account: string;
  /** Code field on iam password reset create request. */
  code: string;
  /** Confirm password field on iam password reset create request. */
  confirmPassword?: string;
  /** New password field on iam password reset create request. */
  newPassword: string;
}
