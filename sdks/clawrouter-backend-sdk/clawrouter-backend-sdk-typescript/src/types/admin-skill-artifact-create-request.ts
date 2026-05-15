/** Admin skill artifact create request schema exposed by Claw Router. */
export interface AdminSkillArtifactCreateRequest {
  /** Artifact ref field on admin skill artifact create request. */
  artifactRef?: string;
  /** Artifact size bytes field on admin skill artifact create request. */
  artifactSizeBytes?: number;
  /** Artifact type field on admin skill artifact create request. */
  artifactType?: number;
  /** Artifact url field on admin skill artifact create request. */
  artifactUrl?: string;
  /** Checksum hash field on admin skill artifact create request. */
  checksumHash?: string;
  /** Deprecated at field on admin skill artifact create request. */
  deprecatedAt?: string;
  /** Frameworks field on admin skill artifact create request. */
  frameworks?: string[];
  /** License name field on admin skill artifact create request. */
  licenseName?: string;
  /** Os name field on admin skill artifact create request. */
  osName?: string;
  /** Platform type field on admin skill artifact create request. */
  platformType?: string;
  /** Published at field on admin skill artifact create request. */
  publishedAt?: string;
  /** Release notes field on admin skill artifact create request. */
  releaseNotes?: string;
  /** Runtime field on admin skill artifact create request. */
  runtime?: string;
  /** Status field on admin skill artifact create request. */
  status?: number;
  /** Version field on admin skill artifact create request. */
  version?: string;
}
