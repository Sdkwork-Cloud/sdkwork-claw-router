import type { OpenPlatformManifestItem } from './open-platform-manifest-item';

/** Open platform manifest list response schema exposed by Claw Router. */
export interface OpenPlatformManifestListResponse {
  /** Items field on open platform manifest list response. */
  items: OpenPlatformManifestItem[];
}
