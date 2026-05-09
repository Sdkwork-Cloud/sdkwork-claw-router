import type { AppPasswordLoginResponse } from './app-password-login-response';

export interface LoginResult {
  /** Business response code. */
  code: string;
  data?: AppPasswordLoginResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
