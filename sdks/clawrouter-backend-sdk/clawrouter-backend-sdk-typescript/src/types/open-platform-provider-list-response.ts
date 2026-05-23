import type { OpenPlatformProviderItem } from './open-platform-provider-item';

/** Open platform provider list response schema exposed by Claw Router. */
export interface OpenPlatformProviderListResponse {
  /** Items field on open platform provider list response. */
  items: OpenPlatformProviderItem[];
}
