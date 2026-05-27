import type { JsonValue } from './json-value';

/** Ai prompt version record schema exposed by Claw Router. */
export interface AiPromptVersionRecord {
  /** Checksum hash field on ai prompt version record. */
  checksum_hash?: string;
  /** Content field on ai prompt version record. */
  content?: string;
  /** Created at field on ai prompt version record. */
  created_at?: string;
  /** Created by field on ai prompt version record. */
  created_by?: string;
  /** Data scope field on ai prompt version record. */
  data_scope?: string;
  /** Deleted at field on ai prompt version record. */
  deleted_at?: string;
  /** Deleted by field on ai prompt version record. */
  deleted_by?: string;
  /** Deprecated at field on ai prompt version record. */
  deprecated_at?: string;
  /** Id field on ai prompt version record. */
  id?: string;
  /** Lifecycle status field on ai prompt version record. */
  lifecycle_status?: string;
  /** Metadata field on ai prompt version record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai prompt version record. */
  organization_id?: string;
  /** Prompt id field on ai prompt version record. */
  prompt_id?: string;
  /** Published at field on ai prompt version record. */
  published_at?: string;
  /** Review comment field on ai prompt version record. */
  review_comment?: string;
  /** Review status field on ai prompt version record. */
  review_status?: string;
  /** Status field on ai prompt version record. */
  status?: string;
  /** Tenant id field on ai prompt version record. */
  tenant_id?: string;
  /** Title field on ai prompt version record. */
  title?: string;
  /** Updated at field on ai prompt version record. */
  updated_at?: string;
  /** Uuid field on ai prompt version record. */
  uuid?: string;
  /** Version field on ai prompt version record. */
  version?: string;
  /** Version no field on ai prompt version record. */
  version_no?: string;
}
