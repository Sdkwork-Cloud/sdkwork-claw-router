import type { JsonValue } from './json-value';
import type { MediaResource } from './media-resource';

/** Plus category record schema exposed by Claw Router. */
export interface PlusCategoryRecord {
  /** Code field on plus category record. */
  code?: string;
  /** Created at field on plus category record. */
  created_at?: string;
  /** Data scope field on plus category record. */
  data_scope?: number;
  /** Description field on plus category record. */
  description?: string;
  /** Group name field on plus category record. */
  group_name?: string;
  /** Icon field on plus category record. */
  icon?: MediaResource;
  /** Id field on plus category record. */
  id?: string;
  /** Name field on plus category record. */
  name?: string;
  /** Organization id field on plus category record. */
  organization_id?: string;
  /** Parent id field on plus category record. */
  parent_id?: string;
  /** Path field on plus category record. */
  path?: string;
  /** Shop id field on plus category record. */
  shop_id?: string;
  /** Sort weight field on plus category record. */
  sort_weight?: number;
  /** Status field on plus category record. */
  status?: number;
  /** Tags field on plus category record. */
  tags?: Record<string, JsonValue>;
  /** Tenant id field on plus category record. */
  tenant_id?: string;
  /** Type field on plus category record. */
  type?: number;
  /** Updated at field on plus category record. */
  updated_at?: string;
  /** Uuid field on plus category record. */
  uuid?: string;
  /** V field on plus category record. */
  v?: string;
  /** Visible field on plus category record. */
  visible?: boolean;
}
