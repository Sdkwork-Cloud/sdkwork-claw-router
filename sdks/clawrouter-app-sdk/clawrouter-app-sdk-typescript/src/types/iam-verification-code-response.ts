/** Iam verification code response schema exposed by Claw Router. */
export interface IamVerificationCodeResponse {
  /** Code id field on iam verification code response. */
  codeId?: string;
  /** Local/private deployment development code returned only when no notification adapter is configured. */
  debugCode?: string;
  /** Expires at field on iam verification code response. */
  expiresAt?: string;
}
