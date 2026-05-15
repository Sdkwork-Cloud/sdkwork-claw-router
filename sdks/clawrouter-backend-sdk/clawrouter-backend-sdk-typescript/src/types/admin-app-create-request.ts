import type { AdminAppConfig } from './admin-app-config';
import type { JsonValue } from './json-value';

/** Admin app create request schema exposed by Claw Router. */
export interface AdminAppCreateRequest {
  /** Access url field on admin app create request. */
  accessUrl?: string;
  /** App type field on admin app create request. */
  appType?: string;
  /** Bundle id field on admin app create request. */
  bundleId?: string;
  /** Config field on admin app create request. */
  config: AdminAppConfig;
  /** Description field on admin app create request. */
  description?: string;
  /** Download url field on admin app create request. */
  downloadUrl?: string;
  /** Icon field on admin app create request. */
  icon?: Record<string, JsonValue>;
  /** Icon url field on admin app create request. */
  iconUrl?: string;
  /** Install config field on admin app create request. */
  installConfig?: Record<string, JsonValue>;
  /** Install platforms field on admin app create request. */
  installPlatforms?: Record<string, JsonValue>;
  /** Install skill field on admin app create request. */
  installSkill?: Record<string, JsonValue>;
  /** Market status field on admin app create request. */
  marketStatus?: 'DRAFT' | 'PUBLISHED' | 'OFFLINE';
  /** Name field on admin app create request. */
  name: string;
  /** Package name field on admin app create request. */
  packageName?: string;
  /** Platforms field on admin app create request. */
  platforms?: Record<string, JsonValue>;
  /** Project id field on admin app create request. */
  projectId?: string | null;
  /** Release notes field on admin app create request. */
  releaseNotes?: Record<string, JsonValue>[];
  /** Resource list field on admin app create request. */
  resourceList?: Record<string, JsonValue>;
  /** Status field on admin app create request. */
  status?: 'ACTIVE' | 'INACTIVE';
  /** Store url field on admin app create request. */
  storeUrl?: string;
  /** User id field on admin app create request. */
  userId?: string | null;
  /** Version field on admin app create request. */
  version?: string;
}
