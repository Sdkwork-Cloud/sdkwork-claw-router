export interface AdminSkillArtifactCreateRequest {
  artifactRef?: string;
  artifactSizeBytes?: number;
  artifactType?: number;
  artifactUrl?: string;
  checksumHash?: string;
  deprecatedAt?: string;
  frameworks?: string[];
  licenseName?: string;
  osName?: string;
  platformType?: string;
  publishedAt?: string;
  releaseNotes?: string;
  runtime?: string;
  status?: number;
  version?: string;
}
