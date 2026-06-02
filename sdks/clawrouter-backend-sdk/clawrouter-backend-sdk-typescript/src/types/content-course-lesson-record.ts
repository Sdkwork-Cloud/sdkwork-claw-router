import type { JsonValue } from './json-value';
import type { MediaResource } from './media-resource';

/** Content course lesson record schema exposed by Claw Router. */
export interface ContentCourseLessonRecord {
  /** Content field on content course lesson record. */
  content?: string;
  /** Course id field on content course lesson record. */
  course_id?: string;
  /** Created at field on content course lesson record. */
  created_at?: string;
  /** Data scope field on content course lesson record. */
  data_scope?: string;
  /** Deleted at field on content course lesson record. */
  deleted_at?: string;
  /** Deleted by field on content course lesson record. */
  deleted_by?: string;
  /** Description field on content course lesson record. */
  description?: string;
  /** Duration seconds field on content course lesson record. */
  duration_seconds?: string;
  /** Duration text field on content course lesson record. */
  duration_text?: string;
  /** External bvid field on content course lesson record. */
  external_bvid?: string;
  /** Free preview field on content course lesson record. */
  free_preview?: boolean;
  /** Id field on content course lesson record. */
  id?: string;
  /** Lesson no field on content course lesson record. */
  lesson_no?: number;
  /** Metadata field on content course lesson record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on content course lesson record. */
  organization_id?: string;
  /** Section id field on content course lesson record. */
  section_id?: string;
  /** Sort order field on content course lesson record. */
  sort_order?: number;
  /** Source provider field on content course lesson record. */
  source_provider?: string;
  /** Status field on content course lesson record. */
  status?: string;
  /** Tenant id field on content course lesson record. */
  tenant_id?: string;
  /** Title field on content course lesson record. */
  title?: string;
  /** Updated at field on content course lesson record. */
  updated_at?: string;
  /** Uuid field on content course lesson record. */
  uuid?: string;
  /** Version field on content course lesson record. */
  version?: string;
  /** Video field on content course lesson record. */
  video?: MediaResource;
}
