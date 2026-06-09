/** Iam verification code verify request schema exposed by Claw Router. */
export interface IamVerificationCodeVerifyRequest {
  /** Code field on iam verification code verify request. */
  code: string;
  /** Code id field on iam verification code verify request. */
  codeId?: string;
  /** Scene field on iam verification code verify request. */
  scene: 'LOGIN' | 'REGISTER' | 'RESET_PASSWORD';
  /** Target field on iam verification code verify request. */
  target: string;
  /** Verify type field on iam verification code verify request. */
  verifyType: 'EMAIL' | 'PHONE';
}
