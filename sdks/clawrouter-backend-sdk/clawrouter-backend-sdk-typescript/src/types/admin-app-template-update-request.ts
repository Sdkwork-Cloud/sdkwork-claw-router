import type { JsonValue } from './json-value';

/** Admin app template update request schema exposed by Claw Router. */
export interface AdminAppTemplateUpdateRequest {
  /** App config schema field on admin app template update request. */
  appConfigSchema?: Record<string, JsonValue>;
  /** Capability manifest field on admin app template update request. */
  capabilityManifest?: Record<string, JsonValue>[];
  /** Category code field on admin app template update request. */
  categoryCode?: string | null;
  /** Category id field on admin app template update request. */
  categoryId?: string | null;
  /** Cover url field on admin app template update request. */
  coverUrl?: string | null;
  /** Default app config field on admin app template update request. */
  defaultAppConfig?: Record<string, JsonValue>;
  /** Dependency manifest field on admin app template update request. */
  dependencyManifest?: Record<string, JsonValue>[];
  /** Description field on admin app template update request. */
  description?: string | null;
  /** Featured field on admin app template update request. */
  featured?: boolean;
  /** Framework field on admin app template update request. */
  framework?: string | null;
  /** Git ref field on admin app template update request. */
  gitRef?: string | null;
  /** Git repo url field on admin app template update request. */
  gitRepoUrl?: string | null;
  /** Git sub path field on admin app template update request. */
  gitSubPath?: string | null;
  /** Icon url field on admin app template update request. */
  iconUrl?: string | null;
  /** Language field on admin app template update request. */
  language?: string | null;
  /** Publish status field on admin app template update request. */
  publishStatus?: 'DRAFT' | 'PUBLISHED' | 'OFFLINE';
  /** Runtime field on admin app template update request. */
  runtime?: string | null;
  /** Sort weight field on admin app template update request. */
  sortWeight?: number;
  /** Source app id field on admin app template update request. */
  sourceAppId?: string | null;
  /** Template name field on admin app template update request. */
  templateName?: string;
  /** Template type field on admin app template update request. */
  templateType?: string | null;
  /** Variable schema field on admin app template update request. */
  variableSchema?: Record<string, JsonValue>;
  /** Visibility field on admin app template update request. */
  visibility?: 'PRIVATE' | 'TENANT' | 'PUBLIC';
}
