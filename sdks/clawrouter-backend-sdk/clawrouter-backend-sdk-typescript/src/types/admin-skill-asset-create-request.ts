import type { MediaResource } from './media-resource';

/** Admin skill asset create request schema exposed by Claw Router. */
export interface AdminSkillAssetCreateRequest {
  /** Alt text field on admin skill asset create request. */
  altText?: string;
  /** Artifact id field on admin skill asset create request. */
  artifactId?: string | null;
  /** Asset field on admin skill asset create request. */
  asset: MediaResource;
  /** Asset type field on admin skill asset create request. */
  assetType?: number;
  /** Duration seconds field on admin skill asset create request. */
  durationSeconds?: string;
  /** File size field on admin skill asset create request. */
  fileSize?: number;
  /** Height field on admin skill asset create request. */
  height?: number;
  /** Mime type field on admin skill asset create request. */
  mimeType?: string;
  /** Published at field on admin skill asset create request. */
  publishedAt?: string;
  /** Sort order field on admin skill asset create request. */
  sortOrder?: number;
  /** Status field on admin skill asset create request. */
  status?: number;
  /** Thumbnail field on admin skill asset create request. */
  thumbnail?: MediaResource;
  /** Title field on admin skill asset create request. */
  title?: string;
  /** Width field on admin skill asset create request. */
  width?: number;
}
