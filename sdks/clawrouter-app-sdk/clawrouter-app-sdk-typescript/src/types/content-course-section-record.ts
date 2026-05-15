import type { JsonValue } from './json-value';

/** Content course section record schema exposed by Claw Router. */
export interface ContentCourseSectionRecord {
  /** Course id field on content course section record. */
  course_id?: string;
  /** Created at field on content course section record. */
  created_at?: string;
  /** Data scope field on content course section record. */
  data_scope?: string;
  /** Deleted at field on content course section record. */
  deleted_at?: string;
  /** Deleted by field on content course section record. */
  deleted_by?: string;
  /** Description field on content course section record. */
  description?: string;
  /** Duration seconds field on content course section record. */
  duration_seconds?: string;
  /** Id field on content course section record. */
  id?: string;
  /** Lesson count field on content course section record. */
  lesson_count?: number;
  /** Metadata field on content course section record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on content course section record. */
  organization_id?: string;
  /** Section no field on content course section record. */
  section_no?: number;
  /** Sort order field on content course section record. */
  sort_order?: number;
  /** Status field on content course section record. */
  status?: string;
  /** Tenant id field on content course section record. */
  tenant_id?: string;
  /** Title field on content course section record. */
  title?: string;
  /** Updated at field on content course section record. */
  updated_at?: string;
  /** Uuid field on content course section record. */
  uuid?: string;
  /** Version field on content course section record. */
  version?: string;
}
