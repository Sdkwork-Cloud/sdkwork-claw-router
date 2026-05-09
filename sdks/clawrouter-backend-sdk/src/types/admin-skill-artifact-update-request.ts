export interface AdminSkillArtifactUpdateRequest {
  artifactRef?: string | null;
  artifactSizeBytes?: number;
  artifactType?: number;
  artifactUrl?: string | null;
  checksumHash?: string | null;
  deprecatedAt?: string | null;
  frameworks?: string[];
  licenseName?: string | null;
  osName?: string;
  platformType?: string;
  publishedAt?: string | null;
  releaseNotes?: string | null;
  runtime?: string | null;
  status?: number;
  version?: string;
}
