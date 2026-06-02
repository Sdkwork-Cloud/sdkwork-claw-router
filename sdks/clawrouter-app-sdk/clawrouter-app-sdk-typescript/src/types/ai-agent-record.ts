import type { JsonValue } from './json-value';
import type { MediaResource } from './media-resource';

/** Ai agent record schema exposed by Claw Router. */
export interface AiAgentRecord {
  /** Agent code field on ai agent record. */
  agent_code?: string;
  /** Avatar field on ai agent record. */
  avatar?: MediaResource;
  /** Created at field on ai agent record. */
  created_at?: string;
  /** Data scope field on ai agent record. */
  data_scope?: string;
  /** Default version id field on ai agent record. */
  default_version_id?: string;
  /** Deleted at field on ai agent record. */
  deleted_at?: string;
  /** Deleted by field on ai agent record. */
  deleted_by?: string;
  /** Description field on ai agent record. */
  description?: string;
  /** Governance status field on ai agent record. */
  governance_status?: string;
  /** Id field on ai agent record. */
  id?: string;
  /** Metadata field on ai agent record. */
  metadata?: Record<string, JsonValue>;
  /** Name field on ai agent record. */
  name?: string;
  /** Organization id field on ai agent record. */
  organization_id?: string;
  /** Owner user id field on ai agent record. */
  owner_user_id?: string;
  /** Published at field on ai agent record. */
  published_at?: string;
  /** Published by field on ai agent record. */
  published_by?: string;
  /** Status field on ai agent record. */
  status?: string;
  /** Template source field on ai agent record. */
  template_source?: string;
  /** Tenant id field on ai agent record. */
  tenant_id?: string;
  /** Updated at field on ai agent record. */
  updated_at?: string;
  /** Uuid field on ai agent record. */
  uuid?: string;
  /** Version field on ai agent record. */
  version?: string;
  /** Visibility field on ai agent record. */
  visibility?: string;
}
