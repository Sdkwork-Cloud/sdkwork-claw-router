import type { JsonValue } from './json-value';

/** Admin course lesson mutation request schema exposed by Claw Router. */
export interface AdminCourseLessonMutationRequest {
  /** Description field on admin course lesson mutation request. */
  description?: string;
  /** Duration seconds field on admin course lesson mutation request. */
  durationSeconds?: number;
  /** External bvid field on admin course lesson mutation request. */
  externalBvid?: string;
  /** Free preview field on admin course lesson mutation request. */
  freePreview?: boolean;
  /** Lesson no field on admin course lesson mutation request. */
  lessonNo?: string;
  /** Metadata field on admin course lesson mutation request. */
  metadata?: Record<string, JsonValue>;
  /** Section id field on admin course lesson mutation request. */
  sectionId?: string;
  /** Status field on admin course lesson mutation request. */
  status?: string;
  /** Title field on admin course lesson mutation request. */
  title?: string;
  /** Video url field on admin course lesson mutation request. */
  videoUrl?: string;
}
