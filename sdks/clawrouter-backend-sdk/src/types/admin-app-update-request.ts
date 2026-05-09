import type { AdminAppConfig } from './admin-app-config';

export interface AdminAppUpdateRequest {
  accessUrl?: string | null;
  appType?: string | null;
  bundleId?: string | null;
  config?: AdminAppConfig;
  description?: string | null;
  downloadUrl?: string | null;
  icon?: Record<string, unknown>;
  iconUrl?: string | null;
  installConfig?: Record<string, unknown>;
  installPlatforms?: Record<string, unknown>;
  installSkill?: Record<string, unknown>;
  name?: string;
  packageName?: string | null;
  platforms?: Record<string, unknown>;
  projectId?: string | null;
  releaseNotes?: Record<string, unknown>[];
  resourceList?: Record<string, unknown>;
  storeUrl?: string | null;
  userId?: string | null;
  version?: string | null;
}
