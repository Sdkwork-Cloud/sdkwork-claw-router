import type { MediaResource } from './media-resource';

/** Course application create request schema exposed by Claw Router. */
export interface CourseApplicationCreateRequest {
  /** Category field on course application create request. */
  category: string;
  /** Contact email field on course application create request. */
  contactEmail?: string;
  /** Contact name field on course application create request. */
  contactName?: string;
  /** Description field on course application create request. */
  description: string;
  /** External bvid field on course application create request. */
  externalBvid?: string;
  /** Notes field on course application create request. */
  notes?: string;
  /** Source provider field on course application create request. */
  sourceProvider: 'bilibili' | 'local';
  /** Title field on course application create request. */
  title: string;
  /** Video field on course application create request. */
  video?: MediaResource;
}
