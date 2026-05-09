/** Updated skill catalog artifact snapshot returned by the backend. */
export interface AdminSkillArtifactItem {
  artifactRef?: string | null;
  artifactSizeBytes: number;
  artifactType: number;
  artifactUrl?: string | null;
  checksumHash?: string | null;
  createdAt: string;
  deprecatedAt?: string | null;
  frameworks: string[];
  id: string;
  licenseName?: string | null;
  osName: string;
  platformType: string;
  publishedAt?: string | null;
  releaseNotes?: string | null;
  runtime?: string | null;
  skillId: string;
  status: number;
  targetId: string;
  targetType: 35;
  updatedAt: string;
  version: string;
}
