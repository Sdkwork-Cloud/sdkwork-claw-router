/** Updated skill catalog asset snapshot returned by the backend. */
export interface AdminSkillAssetItem {
  altText?: string | null;
  artifactId?: string | null;
  assetType: number;
  assetUrl: string;
  createdAt: string;
  durationSeconds?: string | null;
  fileSize?: number | null;
  height?: number | null;
  id: string;
  mimeType?: string | null;
  publishedAt?: string | null;
  skillId: string;
  sortOrder: number;
  status: number;
  targetId: string;
  targetType: 35;
  thumbnailUrl?: string | null;
  title?: string | null;
  updatedAt: string;
  width?: number | null;
}
