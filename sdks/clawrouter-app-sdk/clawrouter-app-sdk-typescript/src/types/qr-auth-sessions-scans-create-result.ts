import type { OpenPlatformQrAuthScanResponse } from './open-platform-qr-auth-scan-response';

/** Qr auth sessions scans create result schema exposed by Claw Router. */
export interface QrAuthSessionsScansCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on qr auth sessions scans create result. */
  data?: OpenPlatformQrAuthScanResponse;
  /** Human-readable response message. */
  msg?: string;
}
