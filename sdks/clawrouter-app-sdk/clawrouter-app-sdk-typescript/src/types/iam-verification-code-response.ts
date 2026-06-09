/** Iam verification code response schema exposed by Claw Router. */
export interface IamVerificationCodeResponse {
  /** Code id field on iam verification code response. */
  codeId?: string;
  /** Messaging send request id that carries the external SMS or email delivery audit trail. */
  deliveryRequestId?: string;
  /** Expires at field on iam verification code response. */
  expiresAt?: string;
}
