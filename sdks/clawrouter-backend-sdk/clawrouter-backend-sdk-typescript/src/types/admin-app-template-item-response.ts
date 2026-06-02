import type { JsonValue } from './json-value';
import type { MediaResource } from './media-resource';

/** Persisted app template snapshot returned by the backend. */
export interface AdminAppTemplateItemResponse {
  /** App config schema field on admin app template item response. */
  appConfigSchema: Record<string, JsonValue>;
  /** Capability manifest field on admin app template item response. */
  capabilityManifest: Record<string, JsonValue>[];
  /** Category code field on admin app template item response. */
  categoryCode?: string | null;
  /** Category id field on admin app template item response. */
  categoryId?: string | null;
  /** Cover field on admin app template item response. */
  cover?: MediaResource;
  /** Created at field on admin app template item response. */
  createdAt: string;
  /** Current version id field on admin app template item response. */
  currentVersionId?: string | null;
  /** Default app config field on admin app template item response. */
  defaultAppConfig: Record<string, JsonValue>;
  /** Dependency manifest field on admin app template item response. */
  dependencyManifest: Record<string, JsonValue>[];
  /** Description field on admin app template item response. */
  description?: string | null;
  /** Featured field on admin app template item response. */
  featured: boolean;
  /** Framework field on admin app template item response. */
  framework?: string | null;
  /** Git ref field on admin app template item response. */
  gitRef?: string | null;
  /** Git repo url field on admin app template item response. */
  gitRepoUrl?: string | null;
  /** Git sub path field on admin app template item response. */
  gitSubPath?: string | null;
  /** Icon field on admin app template item response. */
  icon?: MediaResource;
  /** Id field on admin app template item response. */
  id: string;
  /** Language field on admin app template item response. */
  language?: string | null;
  /** Publish status field on admin app template item response. */
  publishStatus: 'DRAFT' | 'PUBLISHED' | 'OFFLINE';
  /** Runtime field on admin app template item response. */
  runtime?: string | null;
  /** Sort weight field on admin app template item response. */
  sortWeight: number;
  /** Source app id field on admin app template item response. */
  sourceAppId?: string | null;
  /** Template code field on admin app template item response. */
  templateCode: string;
  /** Template name field on admin app template item response. */
  templateName: string;
  /** Template no field on admin app template item response. */
  templateNo: string;
  /** Template type field on admin app template item response. */
  templateType?: string | null;
  /** Updated at field on admin app template item response. */
  updatedAt: string;
  /** Uuid field on admin app template item response. */
  uuid: string;
  /** Variable schema field on admin app template item response. */
  variableSchema: Record<string, JsonValue>;
  /** Visibility field on admin app template item response. */
  visibility: 'PRIVATE' | 'TENANT' | 'PUBLIC';
}
