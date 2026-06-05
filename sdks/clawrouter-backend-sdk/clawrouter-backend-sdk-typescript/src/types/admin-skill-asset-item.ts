import type { MediaResource } from './media-resource';

/** Updated skill catalog asset snapshot returned by the backend. */
export interface AdminSkillAssetItem {
  /** Alt text field on admin skill asset item. */
  altText?: string | null;
  /** Artifact id field on admin skill asset item. */
  artifactId?: string | null;
  /** Asset field on admin skill asset item. */
  asset: MediaResource;
  /** Asset type field on admin skill asset item. */
  assetType: number;
  /** Created at field on admin skill asset item. */
  createdAt: string;
  /** Duration seconds field on admin skill asset item. */
  durationSeconds?: string | null;
  /** File size field on admin skill asset item. */
  fileSize?: string | null;
  /** Height field on admin skill asset item. */
  height?: number | null;
  /** Id field on admin skill asset item. */
  id: string;
  /** Mime type field on admin skill asset item. */
  mimeType?: string | null;
  /** Published at field on admin skill asset item. */
  publishedAt?: string | null;
  /** Skill id field on admin skill asset item. */
  skillId: string;
  /** Sort order field on admin skill asset item. */
  sortOrder: number;
  /** Status field on admin skill asset item. */
  status: number;
  /** Target id field on admin skill asset item. */
  targetId: string;
  /** Target type field on admin skill asset item. */
  targetType: 35;
  /** Thumbnail field on admin skill asset item. */
  thumbnail?: MediaResource;
  /** Title field on admin skill asset item. */
  title?: string | null;
  /** Updated at field on admin skill asset item. */
  updatedAt: string;
  /** Width field on admin skill asset item. */
  width?: number | null;
}
