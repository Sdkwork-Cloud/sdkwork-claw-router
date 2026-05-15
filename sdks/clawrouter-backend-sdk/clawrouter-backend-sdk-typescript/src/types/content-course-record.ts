import type { JsonValue } from './json-value';

/** Content course record schema exposed by Claw Router. */
export interface ContentCourseRecord {
  /** Category field on content course record. */
  category?: string;
  /** Content field on content course record. */
  content?: string;
  /** Course code field on content course record. */
  course_code?: string;
  /** Created at field on content course record. */
  created_at?: string;
  /** Currency field on content course record. */
  currency?: string;
  /** Data scope field on content course record. */
  data_scope?: string;
  /** Deleted at field on content course record. */
  deleted_at?: string;
  /** Deleted by field on content course record. */
  deleted_by?: string;
  /** Description field on content course record. */
  description?: string;
  /** Duration text field on content course record. */
  duration_text?: string;
  /** External bvid field on content course record. */
  external_bvid?: string;
  /** Id field on content course record. */
  id?: string;
  /** Instructor snapshot field on content course record. */
  instructor_snapshot?: Record<string, JsonValue>;
  /** Is collection field on content course record. */
  is_collection?: boolean;
  /** Lessons count field on content course record. */
  lessons_count?: number;
  /** Level field on content course record. */
  level?: string;
  /** Metadata field on content course record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on content course record. */
  organization_id?: string;
  /** Price amount field on content course record. */
  price_amount?: string;
  /** Published at field on content course record. */
  published_at?: string;
  /** Rating score field on content course record. */
  rating_score?: string;
  /** Status field on content course record. */
  status?: string;
  /** Students count field on content course record. */
  students_count?: string;
  /** Tags field on content course record. */
  tags?: Record<string, JsonValue>;
  /** Tenant id field on content course record. */
  tenant_id?: string;
  /** Thumbnail url field on content course record. */
  thumbnail_url?: string;
  /** Title field on content course record. */
  title?: string;
  /** Updated at field on content course record. */
  updated_at?: string;
  /** Uuid field on content course record. */
  uuid?: string;
  /** Version field on content course record. */
  version?: string;
}
