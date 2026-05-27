import type { JsonValue } from './json-value';

/** Admin course mutation request schema exposed by Claw Router. */
export interface AdminCourseMutationRequest {
  /** Category field on admin course mutation request. */
  category?: string;
  /** Course code field on admin course mutation request. */
  courseCode?: string;
  /** Description field on admin course mutation request. */
  description?: string;
  /** Instructor snapshot field on admin course mutation request. */
  instructorSnapshot?: Record<string, JsonValue>;
  /** Level field on admin course mutation request. */
  level?: string;
  /** Metadata field on admin course mutation request. */
  metadata?: Record<string, JsonValue>;
  /** Status field on admin course mutation request. */
  status?: string;
  /** Thumbnail url field on admin course mutation request. */
  thumbnailUrl?: string;
  /** Title field on admin course mutation request. */
  title?: string;
}
