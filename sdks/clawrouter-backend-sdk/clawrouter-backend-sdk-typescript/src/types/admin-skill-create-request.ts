import type { JsonValue } from './json-value';

/** Admin skill create request schema exposed by Claw Router. */
export interface AdminSkillCreateRequest {
  /** Builtin field on admin skill create request. */
  builtin?: boolean;
  /** Capabilities field on admin skill create request. */
  capabilities?: string[];
  /** Category id field on admin skill create request. */
  categoryId?: string | null;
  /** Config schema field on admin skill create request. */
  configSchema?: Record<string, JsonValue>;
  /** Cover image field on admin skill create request. */
  coverImage?: string;
  /** Currency field on admin skill create request. */
  currency?: string;
  /** Default config field on admin skill create request. */
  defaultConfig?: Record<string, JsonValue>;
  /** Description field on admin skill create request. */
  description?: string;
  /** Documentation url field on admin skill create request. */
  documentationUrl?: string;
  /** Enabled field on admin skill create request. */
  enabled?: boolean;
  /** Entrypoint field on admin skill create request. */
  entrypoint?: string;
  /** Featured field on admin skill create request. */
  featured?: boolean;
  /** Homepage url field on admin skill create request. */
  homepageUrl?: string;
  /** Icon field on admin skill create request. */
  icon?: string;
  /** Is builtin field on admin skill create request. */
  isBuiltin?: boolean;
  /** License name field on admin skill create request. */
  licenseName?: string;
  /** Manifest url field on admin skill create request. */
  manifestUrl?: string;
  /** Market status field on admin skill create request. */
  marketStatus?: 'DRAFT' | 'PUBLISHED' | 'OFFLINE' | 'DEPRECATED';
  /** Name field on admin skill create request. */
  name: string;
  /** Package id field on admin skill create request. */
  packageId?: string | null;
  /** Price field on admin skill create request. */
  price?: string | null;
  /** Provider field on admin skill create request. */
  provider?: string;
  /** Recommend weight field on admin skill create request. */
  recommendWeight?: number;
  /** Repository url field on admin skill create request. */
  repositoryUrl?: string;
  /** Review status field on admin skill create request. */
  reviewStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  /** Runtime field on admin skill create request. */
  runtime?: string;
  /** Skill key field on admin skill create request. */
  skillKey: string;
  /** Source type field on admin skill create request. */
  sourceType?: 'OFFICIAL' | 'COMMUNITY' | 'ENTERPRISE' | 'PRIVATE' | 'CUSTOM';
  /** Summary field on admin skill create request. */
  summary?: string;
  /** Tags field on admin skill create request. */
  tags?: string[];
  /** Version field on admin skill create request. */
  version?: string;
  /** Version name field on admin skill create request. */
  versionName?: string;
  /** Visibility field on admin skill create request. */
  visibility?: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
}
