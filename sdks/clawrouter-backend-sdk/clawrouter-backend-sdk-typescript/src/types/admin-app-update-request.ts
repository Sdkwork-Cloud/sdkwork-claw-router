import type { AdminAppConfig } from './admin-app-config';
import type { JsonValue } from './json-value';

/** Admin app update request schema exposed by Claw Router. */
export interface AdminAppUpdateRequest {
  /** Access url field on admin app update request. */
  accessUrl?: string | null;
  /** App type field on admin app update request. */
  appType?: string | null;
  /** Bundle id field on admin app update request. */
  bundleId?: string | null;
  /** Config field on admin app update request. */
  config?: AdminAppConfig;
  /** Description field on admin app update request. */
  description?: string | null;
  /** Download url field on admin app update request. */
  downloadUrl?: string | null;
  /** Icon field on admin app update request. */
  icon?: Record<string, JsonValue>;
  /** Icon url field on admin app update request. */
  iconUrl?: string | null;
  /** Install config field on admin app update request. */
  installConfig?: Record<string, JsonValue>;
  /** Install platforms field on admin app update request. */
  installPlatforms?: Record<string, JsonValue>;
  /** Install skill field on admin app update request. */
  installSkill?: Record<string, JsonValue>;
  /** Name field on admin app update request. */
  name?: string;
  /** Package name field on admin app update request. */
  packageName?: string | null;
  /** Platforms field on admin app update request. */
  platforms?: Record<string, JsonValue>;
  /** Project id field on admin app update request. */
  projectId?: string | null;
  /** Release notes field on admin app update request. */
  releaseNotes?: Record<string, JsonValue>[];
  /** Resource list field on admin app update request. */
  resourceList?: Record<string, JsonValue>;
  /** Store url field on admin app update request. */
  storeUrl?: string | null;
  /** User id field on admin app update request. */
  userId?: string | null;
  /** Version field on admin app update request. */
  version?: string | null;
}
