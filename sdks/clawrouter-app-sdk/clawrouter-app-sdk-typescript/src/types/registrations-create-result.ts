import type { IamSessionResponse } from './iam-session-response';

/** Registrations create result schema exposed by Claw Router. */
export interface RegistrationsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on registrations create result. */
  data?: IamSessionResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
