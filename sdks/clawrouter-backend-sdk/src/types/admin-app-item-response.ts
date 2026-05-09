import type { AdminAppConfig } from './admin-app-config';

/** Published PlusApp snapshot returned by the backend. */
export interface AdminAppItemResponse {
  accessUrl?: string | null;
  appKey?: string | null;
  appType?: string | null;
  bundleId?: string | null;
  config: AdminAppConfig;
  createdAt: string;
  description?: string | null;
  downloadUrl?: string | null;
  icon: Record<string, unknown>;
  iconUrl?: string | null;
  id: string;
  installConfig: Record<string, unknown>;
  installPlatforms: Record<string, unknown>;
  installSkill: Record<string, unknown>;
  marketStatus: 'DRAFT' | 'PUBLISHED' | 'OFFLINE';
  name: string;
  packageName?: string | null;
  platforms: Record<string, unknown>;
  projectId?: string | null;
  releaseNotes: Record<string, unknown>[];
  resourceList: Record<string, unknown>;
  status: 'ACTIVE' | 'INACTIVE';
  storeUrl?: string | null;
  updatedAt: string;
  userId?: string | null;
  uuid: string;
  version?: string | null;
}
