import type { MediaResource } from './media-resource';

/** Course application video upload response schema exposed by Claw Router. */
export interface CourseApplicationVideoUploadResponse {
  /** Content type field on course application video upload response. */
  contentType: string;
  /** File name field on course application video upload response. */
  fileName: string;
  /** Sha 256 field on course application video upload response. */
  sha256: string;
  /** Size bytes field on course application video upload response. */
  sizeBytes: string;
  /** Uploaded at field on course application video upload response. */
  uploadedAt: string;
  /** Video field on course application video upload response. */
  video: MediaResource;
}
