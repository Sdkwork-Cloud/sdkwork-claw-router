import type { OpenPlatformAccountItem } from './open-platform-account-item';

/** Open platform account list response schema exposed by Claw Router. */
export interface OpenPlatformAccountListResponse {
  /** Items field on open platform account list response. */
  items: OpenPlatformAccountItem[];
}
