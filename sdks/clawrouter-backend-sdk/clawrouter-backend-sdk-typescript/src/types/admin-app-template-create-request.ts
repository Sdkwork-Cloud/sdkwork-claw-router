import type { JsonValue } from './json-value';
import type { MediaResource } from './media-resource';

/** Admin app template create request schema exposed by Claw Router. */
export interface AdminAppTemplateCreateRequest {
  /** App config schema field on admin app template create request. */
  appConfigSchema?: Record<string, JsonValue>;
  /** Capability manifest field on admin app template create request. */
  capabilityManifest?: Record<string, JsonValue>[];
  /** Category code field on admin app template create request. */
  categoryCode?: string;
  /** Category id field on admin app template create request. */
  categoryId?: string | null;
  /** Cover field on admin app template create request. */
  cover?: MediaResource;
  /** Default app config field on admin app template create request. */
  defaultAppConfig?: Record<string, JsonValue>;
  /** Dependency manifest field on admin app template create request. */
  dependencyManifest?: Record<string, JsonValue>[];
  /** Description field on admin app template create request. */
  description?: string;
  /** Featured field on admin app template create request. */
  featured?: boolean;
  /** Framework field on admin app template create request. */
  framework?: string;
  /** Git ref field on admin app template create request. */
  gitRef?: string | null;
  /** Git repo url field on admin app template create request. */
  gitRepoUrl?: string | null;
  /** Git sub path field on admin app template create request. */
  gitSubPath?: string | null;
  /** Icon field on admin app template create request. */
  icon?: MediaResource;
  /** Language field on admin app template create request. */
  language?: string;
  /** Publish status field on admin app template create request. */
  publishStatus?: 'DRAFT' | 'PUBLISHED' | 'OFFLINE';
  /** Runtime field on admin app template create request. */
  runtime?: string;
  /** Sort weight field on admin app template create request. */
  sortWeight?: number;
  /** Source app id field on admin app template create request. */
  sourceAppId?: string | null;
  /** Template code field on admin app template create request. */
  templateCode: string;
  /** Template name field on admin app template create request. */
  templateName: string;
  /** Template no field on admin app template create request. */
  templateNo?: string;
  /** Template type field on admin app template create request. */
  templateType?: string;
  /** Variable schema field on admin app template create request. */
  variableSchema?: Record<string, JsonValue>;
  /** Visibility field on admin app template create request. */
  visibility?: 'PRIVATE' | 'TENANT' | 'PUBLIC';
}
