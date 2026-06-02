import type { JsonValue } from './json-value';

/** Plus favorite record schema exposed by Claw Router. */
export interface PlusFavoriteRecord {
  /** Content id field on plus favorite record. */
  content_id?: string;
  /** Content type field on plus favorite record. */
  content_type?: number;
  /** Created at field on plus favorite record. */
  created_at?: string;
  /** Data scope field on plus favorite record. */
  data_scope?: number;
  /** Folder id field on plus favorite record. */
  folder_id?: string;
  /** Id field on plus favorite record. */
  id?: string;
  /** Image field on plus favorite record. */
  image?: Record<string, JsonValue>;
  /** Is private field on plus favorite record. */
  is_private?: boolean;
  /** Last viewed at field on plus favorite record. */
  last_viewed_at?: string;
  /** Organization id field on plus favorite record. */
  organization_id?: string;
  /** Remark field on plus favorite record. */
  remark?: string;
  /** Sort weight field on plus favorite record. */
  sort_weight?: number;
  /** Status field on plus favorite record. */
  status?: number;
  /** Tags field on plus favorite record. */
  tags?: string;
  /** Tenant id field on plus favorite record. */
  tenant_id?: string;
  /** Title field on plus favorite record. */
  title?: string;
  /** Updated at field on plus favorite record. */
  updated_at?: string;
  /** User id field on plus favorite record. */
  user_id?: string;
  /** Uuid field on plus favorite record. */
  uuid?: string;
  /** V field on plus favorite record. */
  v?: string;
  /** View count field on plus favorite record. */
  view_count?: number;
}
