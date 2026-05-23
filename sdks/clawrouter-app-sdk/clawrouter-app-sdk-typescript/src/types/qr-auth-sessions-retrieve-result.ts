import type { OpenPlatformQrAuthSessionResponse } from './open-platform-qr-auth-session-response';

/** Qr auth sessions retrieve result schema exposed by Claw Router. */
export interface QrAuthSessionsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on qr auth sessions retrieve result. */
  data?: OpenPlatformQrAuthSessionResponse;
  /** Human-readable response message. */
  msg?: string;
}
