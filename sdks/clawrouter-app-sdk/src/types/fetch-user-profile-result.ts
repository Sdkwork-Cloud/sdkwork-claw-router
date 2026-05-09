import type { UserProfileResponse } from './user-profile-response';

export interface FetchUserProfileResult {
  /** Business response code. */
  code: string;
  data?: UserProfileResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
