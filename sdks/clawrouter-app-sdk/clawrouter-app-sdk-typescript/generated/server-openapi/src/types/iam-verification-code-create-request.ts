/** Iam verification code create request schema exposed by Claw Router. */
export interface IamVerificationCodeCreateRequest {
  /** Scene field on iam verification code create request. */
  scene: 'LOGIN' | 'REGISTER' | 'RESET_PASSWORD';
  /** Target field on iam verification code create request. */
  target: string;
  /** Verify type field on iam verification code create request. */
  verifyType: 'EMAIL' | 'PHONE';
}
