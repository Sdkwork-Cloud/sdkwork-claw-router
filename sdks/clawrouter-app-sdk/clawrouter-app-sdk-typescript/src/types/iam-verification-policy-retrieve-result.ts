import type { AuthVerificationPolicy } from './auth-verification-policy';

/** Iam verification policy retrieve result schema exposed by Claw Router. */
export interface IamVerificationPolicyRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on iam verification policy retrieve result. */
  data?: AuthVerificationPolicy;
  /** Human-readable response message. */
  msg?: string;
}
