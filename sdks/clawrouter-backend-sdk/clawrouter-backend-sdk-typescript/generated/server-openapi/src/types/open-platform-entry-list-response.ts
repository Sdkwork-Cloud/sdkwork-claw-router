import type { OpenPlatformEntryItem } from './open-platform-entry-item';

/** Open platform entry list response schema exposed by Claw Router. */
export interface OpenPlatformEntryListResponse {
  /** Items field on open platform entry list response. */
  items: OpenPlatformEntryItem[];
}
