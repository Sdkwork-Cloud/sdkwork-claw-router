import type { JsonValue } from './json-value';

/** Ai modality record schema exposed by Claw Router. */
export interface AiModalityRecord {
  /** Created at field on ai modality record. */
  created_at?: string;
  /** Data scope field on ai modality record. */
  data_scope?: string;
  /** Deleted at field on ai modality record. */
  deleted_at?: string;
  /** Deleted by field on ai modality record. */
  deleted_by?: string;
  /** Description field on ai modality record. */
  description?: string;
  /** Display name field on ai modality record. */
  display_name: string;
  /** Id field on ai modality record. */
  id?: string;
  /** Input supported field on ai modality record. */
  input_supported?: boolean;
  /** Metadata field on ai modality record. */
  metadata?: Record<string, JsonValue>;
  /** Modality code field on ai modality record. */
  modality_code: string;
  /** Modality group field on ai modality record. */
  modality_group?: string;
  /** Organization id field on ai modality record. */
  organization_id: string;
  /** Output supported field on ai modality record. */
  output_supported?: boolean;
  /** Sort order field on ai modality record. */
  sort_order?: number;
  /** Status field on ai modality record. */
  status: string;
  /** Tenant id field on ai modality record. */
  tenant_id: string;
  /** Updated at field on ai modality record. */
  updated_at?: string;
  /** Uuid field on ai modality record. */
  uuid: string;
  /** Version field on ai modality record. */
  version?: string;
}
