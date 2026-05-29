import type { JsonValue } from './json-value';

/** Ai vendor api endpoint record schema exposed by Claw Router. */
export interface AiVendorApiEndpointRecord {
  /** Api endpoint id field on ai vendor api endpoint record. */
  api_endpoint_id?: string;
  /** Created at field on ai vendor api endpoint record. */
  created_at?: string;
  /** Data scope field on ai vendor api endpoint record. */
  data_scope?: string;
  /** Deleted at field on ai vendor api endpoint record. */
  deleted_at?: string;
  /** Deleted by field on ai vendor api endpoint record. */
  deleted_by?: string;
  /** Endpoint code field on ai vendor api endpoint record. */
  endpoint_code: string;
  /** Id field on ai vendor api endpoint record. */
  id?: string;
  /** Metadata field on ai vendor api endpoint record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai vendor api endpoint record. */
  organization_id: string;
  /** Sort order field on ai vendor api endpoint record. */
  sort_order?: number;
  /** Status field on ai vendor api endpoint record. */
  status: string;
  /** Supported field on ai vendor api endpoint record. */
  supported?: boolean;
  /** Tenant id field on ai vendor api endpoint record. */
  tenant_id: string;
  /** Updated at field on ai vendor api endpoint record. */
  updated_at?: string;
  /** Uuid field on ai vendor api endpoint record. */
  uuid: string;
  /** Vendor code field on ai vendor api endpoint record. */
  vendor_code: string;
  /** Vendor id field on ai vendor api endpoint record. */
  vendor_id?: string;
  /** Version field on ai vendor api endpoint record. */
  version?: string;
}
