import type { JsonValue } from './json-value';
import type { MediaResource } from './media-resource';

/** Plus agent skill package record schema exposed by Claw Router. */
export interface PlusAgentSkillPackageRecord {
  /** Category id field on plus agent skill package record. */
  category_id?: string;
  /** Cover field on plus agent skill package record. */
  cover?: MediaResource;
  /** Created at field on plus agent skill package record. */
  created_at?: string;
  /** Data scope field on plus agent skill package record. */
  data_scope?: number;
  /** Description field on plus agent skill package record. */
  description?: string;
  /** Enabled field on plus agent skill package record. */
  enabled?: boolean;
  /** Featured field on plus agent skill package record. */
  featured?: boolean;
  /** Icon field on plus agent skill package record. */
  icon?: MediaResource;
  /** Id field on plus agent skill package record. */
  id?: string;
  /** Latest published at field on plus agent skill package record. */
  latest_published_at?: string;
  /** Name field on plus agent skill package record. */
  name?: string;
  /** Organization id field on plus agent skill package record. */
  organization_id?: string;
  /** Package key field on plus agent skill package record. */
  package_key?: string;
  /** Sort weight field on plus agent skill package record. */
  sort_weight?: number;
  /** Summary field on plus agent skill package record. */
  summary?: string;
  /** Tags field on plus agent skill package record. */
  tags?: Record<string, JsonValue>;
  /** Tenant id field on plus agent skill package record. */
  tenant_id?: string;
  /** Updated at field on plus agent skill package record. */
  updated_at?: string;
  /** User id field on plus agent skill package record. */
  user_id?: string;
  /** Uuid field on plus agent skill package record. */
  uuid?: string;
  /** V field on plus agent skill package record. */
  v?: string;
}
