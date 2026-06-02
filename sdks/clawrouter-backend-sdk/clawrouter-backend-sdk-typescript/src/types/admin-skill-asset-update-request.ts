import type { MediaResource } from './media-resource';

/** Admin skill asset update request schema exposed by Claw Router. */
export interface AdminSkillAssetUpdateRequest {
  /** Alt text field on admin skill asset update request. */
  altText?: string | null;
  /** Artifact id field on admin skill asset update request. */
  artifactId?: string | null;
  /** Asset field on admin skill asset update request. */
  asset?: MediaResource;
  /** Asset type field on admin skill asset update request. */
  assetType?: number;
  /** Duration seconds field on admin skill asset update request. */
  durationSeconds?: string | null;
  /** File size field on admin skill asset update request. */
  fileSize?: number | null;
  /** Height field on admin skill asset update request. */
  height?: number | null;
  /** Mime type field on admin skill asset update request. */
  mimeType?: string | null;
  /** Published at field on admin skill asset update request. */
  publishedAt?: string | null;
  /** Sort order field on admin skill asset update request. */
  sortOrder?: number;
  /** Status field on admin skill asset update request. */
  status?: number;
  /** Thumbnail field on admin skill asset update request. */
  thumbnail?: MediaResource;
  /** Title field on admin skill asset update request. */
  title?: string | null;
  /** Width field on admin skill asset update request. */
  width?: number | null;
}
