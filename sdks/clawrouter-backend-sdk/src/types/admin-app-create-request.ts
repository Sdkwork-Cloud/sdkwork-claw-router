import type { AdminAppConfig } from './admin-app-config';

export interface AdminAppCreateRequest {
  accessUrl?: string;
  appType?: string;
  bundleId?: string;
  config: AdminAppConfig;
  description?: string;
  downloadUrl?: string;
  icon?: Record<string, unknown>;
  iconUrl?: string;
  installConfig?: Record<string, unknown>;
  installPlatforms?: Record<string, unknown>;
  installSkill?: Record<string, unknown>;
  marketStatus?: 'DRAFT' | 'PUBLISHED' | 'OFFLINE';
  name: string;
  packageName?: string;
  platforms?: Record<string, unknown>;
  projectId?: string | null;
  releaseNotes?: Record<string, unknown>[];
  resourceList?: Record<string, unknown>;
  status?: 'ACTIVE' | 'INACTIVE';
  storeUrl?: string;
  userId?: string | null;
  version?: string;
}
