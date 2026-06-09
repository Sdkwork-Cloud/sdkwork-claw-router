/** Iam password reset request response schema exposed by Claw Router. */
export interface IamPasswordResetRequestResponse {
  /** Local/private deployment development code returned only when no notification adapter is configured. */
  debugCode?: string;
  /** Expires at field on iam password reset request response. */
  expiresAt?: string;
  /** Request id field on iam password reset request response. */
  requestId?: string;
}
