import type { OpenPlatformQrAuthSessionResponse } from './open-platform-qr-auth-session-response';

/** Qr auth sessions create result schema exposed by Claw Router. */
export interface QrAuthSessionsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on qr auth sessions create result. */
  data?: OpenPlatformQrAuthSessionResponse;
  /** Human-readable response message. */
  msg?: string;
}
