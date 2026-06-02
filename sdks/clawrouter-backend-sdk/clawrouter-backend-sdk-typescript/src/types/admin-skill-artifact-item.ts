import type { MediaResource } from './media-resource';

/** Updated skill catalog artifact snapshot returned by the backend. */
export interface AdminSkillArtifactItem {
  /** Artifact field on admin skill artifact item. */
  artifact?: MediaResource;
  /** Artifact ref field on admin skill artifact item. */
  artifactRef?: string | null;
  /** Artifact size bytes field on admin skill artifact item. */
  artifactSizeBytes: number;
  /** Artifact type field on admin skill artifact item. */
  artifactType: number;
  /** Checksum hash field on admin skill artifact item. */
  checksumHash?: string | null;
  /** Created at field on admin skill artifact item. */
  createdAt: string;
  /** Deprecated at field on admin skill artifact item. */
  deprecatedAt?: string | null;
  /** Frameworks field on admin skill artifact item. */
  frameworks: string[];
  /** Id field on admin skill artifact item. */
  id: string;
  /** License name field on admin skill artifact item. */
  licenseName?: string | null;
  /** Os name field on admin skill artifact item. */
  osName: string;
  /** Platform type field on admin skill artifact item. */
  platformType: string;
  /** Published at field on admin skill artifact item. */
  publishedAt?: string | null;
  /** Release notes field on admin skill artifact item. */
  releaseNotes?: string | null;
  /** Runtime field on admin skill artifact item. */
  runtime?: string | null;
  /** Skill id field on admin skill artifact item. */
  skillId: string;
  /** Status field on admin skill artifact item. */
  status: number;
  /** Target id field on admin skill artifact item. */
  targetId: string;
  /** Target type field on admin skill artifact item. */
  targetType: 35;
  /** Updated at field on admin skill artifact item. */
  updatedAt: string;
  /** Version field on admin skill artifact item. */
  version: string;
}
