import type { CourseApplicationCreateResponse } from './course-application-create-response';

/** Applications create result schema exposed by Claw Router. */
export interface ApplicationsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on applications create result. */
  data?: CourseApplicationCreateResponse;
  /** Human-readable response message. */
  msg?: string;
}
