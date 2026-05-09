import type { InstallationStatusResponse } from './installation-status-response';

export interface FetchInstallationStatusResult {
  /** Business response code. */
  code: string;
  data?: InstallationStatusResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
