import type { MediaResource } from './media-resource';

/** Course instructor schema exposed by Claw Router. */
export interface CourseInstructor {
  /** Avatar field on course instructor. */
  avatar: MediaResource;
  /** Bio field on course instructor. */
  bio: string;
  /** Name field on course instructor. */
  name: string;
  /** Title field on course instructor. */
  title: string;
}
