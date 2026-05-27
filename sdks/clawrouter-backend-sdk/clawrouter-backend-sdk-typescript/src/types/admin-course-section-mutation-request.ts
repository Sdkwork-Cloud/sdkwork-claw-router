import type { JsonValue } from './json-value';

/** Admin course section mutation request schema exposed by Claw Router. */
export interface AdminCourseSectionMutationRequest {
  /** Description field on admin course section mutation request. */
  description?: string;
  /** Metadata field on admin course section mutation request. */
  metadata?: Record<string, JsonValue>;
  /** Section no field on admin course section mutation request. */
  sectionNo?: string;
  /** Sort order field on admin course section mutation request. */
  sortOrder?: number;
  /** Status field on admin course section mutation request. */
  status?: string;
  /** Title field on admin course section mutation request. */
  title?: string;
}
