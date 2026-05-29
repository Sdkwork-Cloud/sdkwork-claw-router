import type { JsonValue } from './json-value';

/** Ai modality api endpoint record schema exposed by Claw Router. */
export interface AiModalityApiEndpointRecord {
  /** Api endpoint id field on ai modality api endpoint record. */
  api_endpoint_id?: string;
  /** Created at field on ai modality api endpoint record. */
  created_at?: string;
  /** Data scope field on ai modality api endpoint record. */
  data_scope?: string;
  /** Deleted at field on ai modality api endpoint record. */
  deleted_at?: string;
  /** Deleted by field on ai modality api endpoint record. */
  deleted_by?: string;
  /** Endpoint code field on ai modality api endpoint record. */
  endpoint_code: string;
  /** Id field on ai modality api endpoint record. */
  id?: string;
  /** Metadata field on ai modality api endpoint record. */
  metadata?: Record<string, JsonValue>;
  /** Modality code field on ai modality api endpoint record. */
  modality_code: string;
  /** Modality id field on ai modality api endpoint record. */
  modality_id?: string;
  /** Organization id field on ai modality api endpoint record. */
  organization_id: string;
  /** Sort order field on ai modality api endpoint record. */
  sort_order?: number;
  /** Status field on ai modality api endpoint record. */
  status: string;
  /** Supported field on ai modality api endpoint record. */
  supported?: boolean;
  /** Tenant id field on ai modality api endpoint record. */
  tenant_id: string;
  /** Updated at field on ai modality api endpoint record. */
  updated_at?: string;
  /** Uuid field on ai modality api endpoint record. */
  uuid: string;
  /** Version field on ai modality api endpoint record. */
  version?: string;
}
