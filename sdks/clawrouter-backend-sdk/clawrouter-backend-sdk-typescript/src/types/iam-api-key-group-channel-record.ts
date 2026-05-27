import type { JsonValue } from './json-value';

/** Iam api key group channel record schema exposed by Claw Router. */
export interface IamApiKeyGroupChannelRecord {
  /** Capabilities field on iam api key group channel record. */
  capabilities?: Record<string, JsonValue>;
  /** Channel id field on iam api key group channel record. */
  channel_id?: string;
  /** Created at field on iam api key group channel record. */
  created_at?: string;
  /** Data scope field on iam api key group channel record. */
  data_scope?: string;
  /** Deleted at field on iam api key group channel record. */
  deleted_at?: string;
  /** Deleted by field on iam api key group channel record. */
  deleted_by?: string;
  /** Effective from field on iam api key group channel record. */
  effective_from?: string;
  /** Effective to field on iam api key group channel record. */
  effective_to?: string;
  /** Group id field on iam api key group channel record. */
  group_id?: string;
  /** Id field on iam api key group channel record. */
  id?: string;
  /** Metadata field on iam api key group channel record. */
  metadata?: Record<string, JsonValue>;
  /** Model scope field on iam api key group channel record. */
  model_scope?: Record<string, JsonValue>;
  /** Organization id field on iam api key group channel record. */
  organization_id?: string;
  /** Priority field on iam api key group channel record. */
  priority?: number;
  /** Status field on iam api key group channel record. */
  status?: string;
  /** Tenant id field on iam api key group channel record. */
  tenant_id?: string;
  /** Updated at field on iam api key group channel record. */
  updated_at?: string;
  /** Uuid field on iam api key group channel record. */
  uuid?: string;
  /** Version field on iam api key group channel record. */
  version?: string;
  /** Weight field on iam api key group channel record. */
  weight?: number;
}
