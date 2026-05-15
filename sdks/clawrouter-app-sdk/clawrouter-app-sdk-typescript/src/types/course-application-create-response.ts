/** Course application create response schema exposed by Claw Router. */
export interface CourseApplicationCreateResponse {
  /** Application id field on course application create response. */
  applicationId: number;
  /** Category field on course application create response. */
  category: string;
  /** Contact email field on course application create response. */
  contactEmail?: string;
  /** Contact name field on course application create response. */
  contactName?: string;
  /** Description field on course application create response. */
  description: string;
  /** External bvid field on course application create response. */
  externalBvid?: string;
  /** Id field on course application create response. */
  id: string;
  /** Source provider field on course application create response. */
  sourceProvider: 'bilibili' | 'local';
  /** Status field on course application create response. */
  status: string;
  /** Submitted at field on course application create response. */
  submittedAt: string;
  /** Title field on course application create response. */
  title: string;
  /** Video url field on course application create response. */
  videoUrl?: string;
}
