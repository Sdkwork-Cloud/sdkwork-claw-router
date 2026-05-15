import type { JsonValue } from './json-value';

/** Content course relation record schema exposed by Claw Router. */
export interface ContentCourseRelationRecord {
  /** Course id field on content course relation record. */
  course_id?: string;
  /** Created at field on content course relation record. */
  created_at?: string;
  /** Data scope field on content course relation record. */
  data_scope?: string;
  /** Deleted at field on content course relation record. */
  deleted_at?: string;
  /** Deleted by field on content course relation record. */
  deleted_by?: string;
  /** Id field on content course relation record. */
  id?: string;
  /** Metadata field on content course relation record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on content course relation record. */
  organization_id?: string;
  /** Related course id field on content course relation record. */
  related_course_id?: string;
  /** Relation type field on content course relation record. */
  relation_type?: string;
  /** Sort order field on content course relation record. */
  sort_order?: number;
  /** Status field on content course relation record. */
  status?: string;
  /** Tenant id field on content course relation record. */
  tenant_id?: string;
  /** Updated at field on content course relation record. */
  updated_at?: string;
  /** Uuid field on content course relation record. */
  uuid?: string;
  /** Version field on content course relation record. */
  version?: string;
}
