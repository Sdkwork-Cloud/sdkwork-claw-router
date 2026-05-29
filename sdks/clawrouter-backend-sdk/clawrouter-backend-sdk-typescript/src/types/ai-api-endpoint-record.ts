import type { JsonValue } from './json-value';

/** Ai api endpoint record schema exposed by Claw Router. */
export interface AiApiEndpointRecord {
  /** Created at field on ai api endpoint record. */
  created_at?: string;
  /** Data scope field on ai api endpoint record. */
  data_scope?: string;
  /** Deleted at field on ai api endpoint record. */
  deleted_at?: string;
  /** Deleted by field on ai api endpoint record. */
  deleted_by?: string;
  /** Display name field on ai api endpoint record. */
  display_name?: string;
  /** Endpoint code field on ai api endpoint record. */
  endpoint_code: string;
  /** Id field on ai api endpoint record. */
  id?: string;
  /** Metadata field on ai api endpoint record. */
  metadata?: Record<string, JsonValue>;
  /** Method field on ai api endpoint record. */
  method?: string;
  /** Organization id field on ai api endpoint record. */
  organization_id: string;
  /** Path template field on ai api endpoint record. */
  path_template: string;
  /** Protocol code field on ai api endpoint record. */
  protocol_code: string;
  /** Request schema field on ai api endpoint record. */
  request_schema?: Record<string, JsonValue>;
  /** Response schema field on ai api endpoint record. */
  response_schema?: Record<string, JsonValue>;
  /** Sort order field on ai api endpoint record. */
  sort_order?: number;
  /** Status field on ai api endpoint record. */
  status: string;
  /** Streaming supported field on ai api endpoint record. */
  streaming_supported?: boolean;
  /** Tenant id field on ai api endpoint record. */
  tenant_id: string;
  /** Updated at field on ai api endpoint record. */
  updated_at?: string;
  /** Uuid field on ai api endpoint record. */
  uuid: string;
  /** Version field on ai api endpoint record. */
  version?: string;
}
