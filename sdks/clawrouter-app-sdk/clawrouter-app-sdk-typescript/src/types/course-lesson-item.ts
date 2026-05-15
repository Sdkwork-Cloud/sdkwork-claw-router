/** Course lesson item schema exposed by Claw Router. */
export interface CourseLessonItem {
  /** Content field on course lesson item. */
  content: string;
  /** Description field on course lesson item. */
  description: string;
  /** Duration seconds field on course lesson item. */
  durationSeconds: number;
  /** Duration text field on course lesson item. */
  durationText: string;
  /** External bvid field on course lesson item. */
  externalBvid: string;
  /** Free preview field on course lesson item. */
  freePreview: boolean;
  /** Id field on course lesson item. */
  id: string;
  /** Lesson id field on course lesson item. */
  lessonId: number;
  /** Lesson no field on course lesson item. */
  lessonNo: number;
  /** Number field on course lesson item. */
  number: number;
  /** Sort order field on course lesson item. */
  sortOrder: number;
  /** Source provider field on course lesson item. */
  sourceProvider: string;
  /** Title field on course lesson item. */
  title: string;
  /** Video url field on course lesson item. */
  videoUrl: string;
}
