import type { JsonValue } from './json-value';

/** Plus comments record schema exposed by Claw Router. */
export interface PlusCommentsRecord {
  /** Author field on plus comments record. */
  author?: Record<string, JsonValue>;
  /** Content field on plus comments record. */
  content?: string;
  /** Content id field on plus comments record. */
  content_id?: string;
  /** Content type field on plus comments record. */
  content_type?: number;
  /** Created at field on plus comments record. */
  created_at?: string;
  /** Data scope field on plus comments record. */
  data_scope?: number;
  /** Device info field on plus comments record. */
  device_info?: string;
  /** Id field on plus comments record. */
  id?: string;
  /** Ip address field on plus comments record. */
  ip_address?: string;
  /** Is top field on plus comments record. */
  is_top?: boolean;
  /** Likes field on plus comments record. */
  likes?: number;
  /** Organization id field on plus comments record. */
  organization_id?: string;
  /** Parent id field on plus comments record. */
  parent_id?: string;
  /** Path field on plus comments record. */
  path?: string;
  /** Reply count field on plus comments record. */
  reply_count?: number;
  /** Sort weight field on plus comments record. */
  sort_weight?: number;
  /** Status field on plus comments record. */
  status?: number;
  /** Tenant id field on plus comments record. */
  tenant_id?: string;
  /** Updated at field on plus comments record. */
  updated_at?: string;
  /** User id field on plus comments record. */
  user_id?: string;
  /** Uuid field on plus comments record. */
  uuid?: string;
  /** V field on plus comments record. */
  v?: string;
}
