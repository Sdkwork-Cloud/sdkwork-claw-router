export interface AdminSkillAssetCreateRequest {
  altText?: string;
  artifactId?: string | null;
  assetType?: number;
  assetUrl: string;
  durationSeconds?: string;
  fileSize?: number;
  height?: number;
  mimeType?: string;
  publishedAt?: string;
  sortOrder?: number;
  status?: number;
  thumbnailUrl?: string;
  title?: string;
  width?: number;
}
