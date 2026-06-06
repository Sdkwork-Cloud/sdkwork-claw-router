import type { CourseApplicationVideoUploadResponse } from './course-application-video-upload-response';

/** Applications videos create result schema exposed by Claw Router. */
export interface ApplicationsVideosCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on applications videos create result. */
  data?: CourseApplicationVideoUploadResponse;
  /** Human-readable response message. */
  msg?: string;
}
