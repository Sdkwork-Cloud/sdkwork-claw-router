import type { ProviderJsonValue } from './provider-json-value';

/** OpenAI-compatible organization project object. */
export interface OpenAiProject {
  /** Unix timestamp in seconds when the project was archived. */
  archived_at?: number;
  /** Unix timestamp in seconds when the project was created. */
  created_at?: number;
  /** Project identifier. */
  id: string;
  /** Developer-defined project metadata. */
  metadata?: Record<string, ProviderJsonValue>;
  /** Human-readable project name. */
  name: string;
  /** Object type, normally organization.project. */
  object: 'organization.project';
  /** Project lifecycle status. */
  status?: string;
}
