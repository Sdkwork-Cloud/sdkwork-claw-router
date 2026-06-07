/** Iam password reset request create request schema exposed by Claw Router. */
export interface IamPasswordResetRequestCreateRequest {
  /** Account field on iam password reset request create request. */
  account: string;
  /** Channel field on iam password reset request create request. */
  channel: 'EMAIL' | 'SMS';
}
