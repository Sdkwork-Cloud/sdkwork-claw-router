import type { JsonValue } from './json-value';

/** Content doc page record schema exposed by Claw Router. */
export interface ContentDocPageRecord {
  /** Content hash field on content doc page record. */
  content_hash?: string;
  /** Content source field on content doc page record. */
  content_source?: string;
  /** Created at field on content doc page record. */
  created_at?: string;
  /** Data scope field on content doc page record. */
  data_scope?: string;
  /** Deleted at field on content doc page record. */
  deleted_at?: string;
  /** Deleted by field on content doc page record. */
  deleted_by?: string;
  /** Doc code field on content doc page record. */
  doc_code?: string;
  /** Doc type field on content doc page record. */
  doc_type?: string;
  /** Id field on content doc page record. */
  id?: string;
  /** Metadata field on content doc page record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on content doc page record. */
  organization_id?: string;
  /** Path field on content doc page record. */
  path?: string;
  /** Published at field on content doc page record. */
  published_at?: string;
  /** Slug field on content doc page record. */
  slug?: string;
  /** Sort order field on content doc page record. */
  sort_order?: number;
  /** Source ref field on content doc page record. */
  source_ref?: string;
  /** Status field on content doc page record. */
  status?: string;
  /** Summary field on content doc page record. */
  summary?: string;
  /** Tenant id field on content doc page record. */
  tenant_id?: string;
  /** Title field on content doc page record. */
  title?: string;
  /** Updated at field on content doc page record. */
  updated_at?: string;
  /** Uuid field on content doc page record. */
  uuid?: string;
  /** Version field on content doc page record. */
  version?: string;
}
