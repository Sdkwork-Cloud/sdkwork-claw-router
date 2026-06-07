import type { OpenPlatformManifestListResponse } from './open-platform-manifest-list-response';

/** Manifests list result schema exposed by Claw Router. */
export interface ManifestsListResult {
  /** Business response code. */
  code: string;
  /** Data field on manifests list result. */
  data?: OpenPlatformManifestListResponse;
  /** Human-readable response message. */
  msg?: string;
}
