import type { JsonValue } from './json-value';
import type { MediaResource } from './media-resource';

/** Offline agent skill snapshot returned by the backend. */
export interface AdminSkillItem {
  /** Builtin field on admin skill item. */
  builtin: boolean;
  /** Capabilities field on admin skill item. */
  capabilities: string[];
  /** Category id field on admin skill item. */
  categoryId?: string | null;
  /** Config schema field on admin skill item. */
  configSchema: Record<string, JsonValue>;
  /** Cover field on admin skill item. */
  cover?: MediaResource;
  /** Created at field on admin skill item. */
  createdAt: string;
  /** Currency field on admin skill item. */
  currency: string;
  /** Default config field on admin skill item. */
  defaultConfig: Record<string, JsonValue>;
  /** Description field on admin skill item. */
  description?: string;
  /** Documentation url field on admin skill item. */
  documentationUrl?: string;
  /** Enabled field on admin skill item. */
  enabled: boolean;
  /** Entrypoint field on admin skill item. */
  entrypoint?: string;
  /** Featured field on admin skill item. */
  featured: boolean;
  /** Homepage url field on admin skill item. */
  homepageUrl?: string;
  /** Icon field on admin skill item. */
  icon?: MediaResource;
  /** Id field on admin skill item. */
  id: string;
  /** Install count field on admin skill item. */
  installCount: string;
  /** Is builtin field on admin skill item. */
  isBuiltin: boolean;
  /** Latest published at field on admin skill item. */
  latestPublishedAt?: string;
  /** License name field on admin skill item. */
  licenseName?: string;
  /** Manifest url field on admin skill item. */
  manifestUrl?: string;
  /** Market status field on admin skill item. */
  marketStatus: 'DRAFT' | 'PUBLISHED' | 'OFFLINE' | 'DEPRECATED';
  /** Name field on admin skill item. */
  name: string;
  /** Package id field on admin skill item. */
  packageId?: string | null;
  /** Price field on admin skill item. */
  price?: string | null;
  /** Provider field on admin skill item. */
  provider?: string;
  /** Rating avg field on admin skill item. */
  ratingAvg: string;
  /** Rating count field on admin skill item. */
  ratingCount: string;
  /** Recommend weight field on admin skill item. */
  recommendWeight: number;
  /** Repository url field on admin skill item. */
  repositoryUrl?: string;
  /** Review comment field on admin skill item. */
  reviewComment?: string;
  /** Review status field on admin skill item. */
  reviewStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  /** Reviewed at field on admin skill item. */
  reviewedAt?: string;
  /** Reviewed by field on admin skill item. */
  reviewedBy?: string;
  /** Runtime field on admin skill item. */
  runtime?: string;
  /** Skill key field on admin skill item. */
  skillKey: string;
  /** Source type field on admin skill item. */
  sourceType: 'OFFICIAL' | 'COMMUNITY' | 'ENTERPRISE' | 'PRIVATE' | 'CUSTOM';
  /** Summary field on admin skill item. */
  summary?: string;
  /** Tags field on admin skill item. */
  tags: string[];
  /** Updated at field on admin skill item. */
  updatedAt: string;
  /** Version field on admin skill item. */
  version?: string;
  /** Version name field on admin skill item. */
  versionName?: string;
  /** Visibility field on admin skill item. */
  visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
}
