import type { MediaResource } from './media-resource';

/** Admin skill artifact update request schema exposed by Claw Router. */
export interface AdminSkillArtifactUpdateRequest {
  /** Artifact field on admin skill artifact update request. */
  artifact?: MediaResource;
  /** Artifact ref field on admin skill artifact update request. */
  artifactRef?: string | null;
  /** Artifact size bytes field on admin skill artifact update request. */
  artifactSizeBytes?: string;
  /** Artifact type field on admin skill artifact update request. */
  artifactType?: number;
  /** Checksum hash field on admin skill artifact update request. */
  checksumHash?: string | null;
  /** Deprecated at field on admin skill artifact update request. */
  deprecatedAt?: string | null;
  /** Frameworks field on admin skill artifact update request. */
  frameworks?: string[];
  /** License name field on admin skill artifact update request. */
  licenseName?: string | null;
  /** Os name field on admin skill artifact update request. */
  osName?: string;
  /** Platform type field on admin skill artifact update request. */
  platformType?: string;
  /** Published at field on admin skill artifact update request. */
  publishedAt?: string | null;
  /** Release notes field on admin skill artifact update request. */
  releaseNotes?: string | null;
  /** Runtime field on admin skill artifact update request. */
  runtime?: string | null;
  /** Status field on admin skill artifact update request. */
  status?: number;
  /** Version field on admin skill artifact update request. */
  version?: string;
}
