import type { OpenPlatformQrAuthSessionResponse } from './open-platform-qr-auth-session-response';

/** Qr auth sessions passwords create result schema exposed by Claw Router. */
export interface QrAuthSessionsPasswordsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on qr auth sessions passwords create result. */
  data?: OpenPlatformQrAuthSessionResponse;
  /** Human-readable response message. */
  msg?: string;
}
