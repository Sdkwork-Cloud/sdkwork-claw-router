import type { JsonValue } from './json-value';
import type { MediaResource } from './media-resource';

/** Admin skill update request schema exposed by Claw Router. */
export interface AdminSkillUpdateRequest {
  /** Builtin field on admin skill update request. */
  builtin?: boolean;
  /** Capabilities field on admin skill update request. */
  capabilities?: string[];
  /** Category id field on admin skill update request. */
  categoryId?: string | null;
  /** Config schema field on admin skill update request. */
  configSchema?: Record<string, JsonValue>;
  /** Cover field on admin skill update request. */
  cover?: MediaResource;
  /** Currency field on admin skill update request. */
  currency?: string;
  /** Default config field on admin skill update request. */
  defaultConfig?: Record<string, JsonValue>;
  /** Description field on admin skill update request. */
  description?: string | null;
  /** Documentation url field on admin skill update request. */
  documentationUrl?: string | null;
  /** Entrypoint field on admin skill update request. */
  entrypoint?: string | null;
  /** Featured field on admin skill update request. */
  featured?: boolean;
  /** Homepage url field on admin skill update request. */
  homepageUrl?: string | null;
  /** Icon field on admin skill update request. */
  icon?: MediaResource;
  /** Is builtin field on admin skill update request. */
  isBuiltin?: boolean;
  /** License name field on admin skill update request. */
  licenseName?: string | null;
  /** Manifest url field on admin skill update request. */
  manifestUrl?: string | null;
  /** Name field on admin skill update request. */
  name?: string;
  /** Package id field on admin skill update request. */
  packageId?: string | null;
  /** Price field on admin skill update request. */
  price?: string | null;
  /** Provider field on admin skill update request. */
  provider?: string | null;
  /** Recommend weight field on admin skill update request. */
  recommendWeight?: number;
  /** Repository url field on admin skill update request. */
  repositoryUrl?: string | null;
  /** Runtime field on admin skill update request. */
  runtime?: string | null;
  /** Skill key field on admin skill update request. */
  skillKey?: string;
  /** Source type field on admin skill update request. */
  sourceType?: 'OFFICIAL' | 'COMMUNITY' | 'ENTERPRISE' | 'PRIVATE' | 'CUSTOM';
  /** Summary field on admin skill update request. */
  summary?: string;
  /** Tags field on admin skill update request. */
  tags?: string[];
  /** Version field on admin skill update request. */
  version?: string;
  /** Version name field on admin skill update request. */
  versionName?: string | null;
  /** Visibility field on admin skill update request. */
  visibility?: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
}
