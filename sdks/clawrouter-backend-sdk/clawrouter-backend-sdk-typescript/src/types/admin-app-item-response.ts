import type { AdminAppConfig } from './admin-app-config';
import type { JsonValue } from './json-value';
import type { MediaResource } from './media-resource';

/** Offline PlusApp snapshot returned by the backend. */
export interface AdminAppItemResponse {
  /** Access url field on admin app item response. */
  accessUrl?: string | null;
  /** App key field on admin app item response. */
  appKey?: string | null;
  /** App type field on admin app item response. */
  appType?: string | null;
  /** Artifact field on admin app item response. */
  artifact?: MediaResource;
  /** Bundle id field on admin app item response. */
  bundleId?: string | null;
  /** Config field on admin app item response. */
  config: AdminAppConfig;
  /** Created at field on admin app item response. */
  createdAt: string;
  /** Description field on admin app item response. */
  description?: string | null;
  /** Icon field on admin app item response. */
  icon: MediaResource;
  /** Id field on admin app item response. */
  id: string;
  /** Install config field on admin app item response. */
  installConfig: Record<string, JsonValue>;
  /** Install platforms field on admin app item response. */
  installPlatforms: Record<string, JsonValue>;
  /** Install skill field on admin app item response. */
  installSkill: Record<string, JsonValue>;
  /** Market status field on admin app item response. */
  marketStatus: 'DRAFT' | 'PUBLISHED' | 'OFFLINE';
  /** Name field on admin app item response. */
  name: string;
  /** Package name field on admin app item response. */
  packageName?: string | null;
  /** Platforms field on admin app item response. */
  platforms: Record<string, JsonValue>;
  /** Project id field on admin app item response. */
  projectId?: string | null;
  /** Release notes field on admin app item response. */
  releaseNotes: Record<string, JsonValue>[];
  /** Resource list field on admin app item response. */
  resourceList: Record<string, JsonValue>;
  /** Status field on admin app item response. */
  status: 'ACTIVE' | 'INACTIVE';
  /** Store url field on admin app item response. */
  storeUrl?: string | null;
  /** Updated at field on admin app item response. */
  updatedAt: string;
  /** User id field on admin app item response. */
  userId?: string | null;
  /** Uuid field on admin app item response. */
  uuid: string;
  /** Version field on admin app item response. */
  version?: string | null;
}
